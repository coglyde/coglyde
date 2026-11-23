import { z } from "zod";
import {
  chatSchema,
  directEstimate,
  functionCall,
  meterSchema,
} from "@/lib/gateway/policy";
import { chooseRoute, complete } from "@/lib/gateway/market";
import {
  authenticate,
  db,
  errorResponse,
  finish,
  GatewayError,
  reserve,
  upstreamKey,
} from "@/lib/gateway/ledger";
import { nonce, readJson } from "@/lib/gateway/http";

export const maxDuration = 90;
const choicesSchema = z
  .array(
    z.object({
      index: z.int(),
      finish_reason: z.string().nullable(),
      message: z.object({
        role: z.literal("assistant"),
        content: z.string().nullable(),
        tool_calls: z.array(functionCall).optional(),
      }),
    }),
  )
  .min(1);

export async function POST(request: Request) {
  let id: string | undefined;
  try {
    const client = await authenticate(request);
    const requestKey = nonce(request);
    const input = chatSchema.safeParse(await readJson(request));
    if (!input.success) throw new GatewayError(400, "Invalid chat request");
    const buyerKey = upstreamKey(client.id);
    const route = await chooseRoute(client.policy, input.data);
    if (!route)
      throw new GatewayError(
        503,
        "No eligible model is available within your settings",
      );
    id = await reserve(client.id, client.policy, route, requestKey);
    const response = await complete(route, input.data, buyerKey);
    const reference =
      response.headers.get("x-request-id") ??
      response.headers.get("x-si-trace-id");
    if (reference)
      await db()`UPDATE gateway_requests SET upstream_reference = ${reference} WHERE id = ${id}`;
    const rawCost = response.headers.get("x-si-buyer-cost-micro");
    const headerCost =
      rawCost && /^\d+$/.test(rawCost) ? Number(rawCost) : null;
    const result = await response.json().catch(() => null);
    const cost = headerCost ?? result?.usage?.buyer_cost_micro;
    const priced =
      Number.isSafeInteger(cost) && cost >= 0 && cost <= 1_000_000_000_000;
    const usage = meterSchema.safeParse(result?.usage);
    const comparison =
      response.ok && usage.success
        ? directEstimate(route.model, usage.data)
        : null;
    if (usage.success) {
      await db()`UPDATE gateway_requests SET input_tokens = ${usage.data.prompt_tokens}, output_tokens = ${usage.data.completion_tokens},
        comparison = ${comparison ? db().json(comparison) : null} WHERE id = ${id}`;
    }
    let charge: number | null = null;
    if (priced) charge = await finish(id, cost);
    if (!response.ok) {
      // A definite refusal before inference releases the reservation. Timeouts and
      // ambiguous failures stay pending for reconciliation, including network errors.
      if (
        !priced &&
        [400, 401, 402, 403, 404, 413, 422, 429].includes(response.status)
      )
        await finish(id, null);
      throw new GatewayError(
        502,
        "The selected model could not complete this request",
      );
    }
    const choices = choicesSchema.safeParse(result?.choices);
    if (!choices.success)
      throw new GatewayError(502, "Incomplete model response");
    const headers = { "Cache-Control": "no-store", "X-Coglyde-Request-Id": id };
    return Response.json(
      {
        id,
        object: "chat.completion",
        model: route.model,
        choices: choices.data,
        usage: usage.success ? usage.data : null,
        billing: {
          currency: "USD",
          status: priced ? "settled" : "pending",
          charge_micro: charge,
          direct_estimate: comparison,
          savings_micro:
            comparison && charge !== null ? comparison.microUsd - charge : null,
        },
      },
      { headers },
    );
  } catch (error) {
    return errorResponse(error, id);
  }
}
