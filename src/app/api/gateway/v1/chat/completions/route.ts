import { z } from "zod";
import {
  chatSchema,
  compareUsage,
  compareReportedList,
  functionCall,
  meterSchema,
} from "@/lib/gateway/policy";
import {
  creditCandidates,
  completeCredit,
  type CreditRoute,
} from "@/lib/gateway/credits";
import { monthlyTier } from "@/lib/gateway/tiers";
import {
  chooseRoute,
  complete,
  settledListTotal,
  type Route,
} from "@/lib/gateway/market";
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
    let routingPolicy = client.policy;
    if (client.policy.monthlyLimitsMicro) {
      const tier = await monthlyTier(
        db(),
        client.id,
        client.policy,
        input.data.max_tokens,
      );
      if (!tier)
        throw new GatewayError(
          429,
          "Monthly model allowance is fully reserved",
        );
      routingPolicy = { ...client.policy, models: [tier.model] };
    }
    let route: Route | undefined;
    let response: Response | undefined;
    let usedCredit: CreditRoute | undefined;
    for (const candidate of creditCandidates(
      client.id,
      routingPolicy,
      input.data,
    )) {
      const held = await reserve(
        client.id,
        client.policy,
        candidate,
        requestKey,
        id,
        input.data.max_tokens,
      );
      if (!held) continue;
      id = held;
      const direct = await completeCredit(client.id, candidate, input.data);
      // Only retry explicit pre-generation refusals. A timeout or a server error
      // can mean inference already happened and must keep its original receipt.
      if ([401, 402, 403, 404, 429].includes(direct.status)) {
        await direct.body?.cancel();
        continue;
      }
      route = candidate;
      response = direct;
      usedCredit = candidate;
      break;
    }
    if (!response || !route) {
      let buyerKey: string;
      try {
        buyerKey = upstreamKey(client.id);
        route = (await chooseRoute(routingPolicy, input.data)) ?? undefined;
        if (!route)
          throw new GatewayError(
            503,
            "No eligible model is available within your settings",
          );
      } catch (error) {
        if (id) await finish(id, null);
        throw error;
      }
      const held = await reserve(
        client.id,
        client.policy,
        route,
        requestKey,
        id,
        input.data.max_tokens,
      );
      if (!held) throw Error("Marketplace reservation unavailable");
      id = held;
      response = await complete(route, input.data, buyerKey);
    }
    if (!id) throw Error("Missing request reservation");
    const reference =
      response.headers.get("x-request-id") ??
      response.headers.get("x-si-trace-id");
    if (reference)
      await db()`UPDATE gateway_requests SET upstream_reference = ${reference} WHERE id = ${id}`;
    const rawCost = response.headers.get("x-si-buyer-cost-micro");
    const headerCost =
      rawCost && /^\d+$/.test(rawCost) ? Number(rawCost) : null;
    const result = await response.json().catch(() => null);
    // The direct path is admitted only with a provider-protected promotional allocation.
    const cost = usedCredit
      ? response.ok
        ? 0
        : undefined
      : (headerCost ?? result?.usage?.buyer_cost_micro);
    const priced =
      Number.isSafeInteger(cost) && cost >= 0 && cost <= 1_000_000_000_000;
    // The Claude compatibility endpoint does not support prompt caching.
    const rawUsage = result?.usage;
    const usage = meterSchema.safeParse(
      usedCredit?.grant.provider === "anthropic" &&
        rawUsage &&
        !rawUsage.prompt_tokens_details
        ? { ...rawUsage, prompt_tokens_details: { cached_tokens: 0 } }
        : rawUsage,
    );
    const refused =
      !response.ok &&
      !priced &&
      [400, 401, 402, 403, 404, 413, 422, 429].includes(response.status);
    let reportedListMicro: number | undefined;
    if (
      !usedCredit &&
      response.ok &&
      priced &&
      usage.success &&
      route.listPrice &&
      usage.data.prompt_tokens_details?.cached_tokens === undefined &&
      !compareUsage(route.listPrice, usage.data)
    ) {
      const header = response.headers.get("x-si-list-cost-micro");
      if (
        header &&
        /^\d+$/.test(header) &&
        compareReportedList(route.listPrice, usage.data, Number(header))
      )
        reportedListMicro = Number(header);
      else if (reference)
        reportedListMicro = await settledListTotal(
          route.model,
          route.offer.provider_id,
          reference,
          cost,
          upstreamKey(client.id),
        );
    }
    const { charge, comparison } = await finish(
      id,
      priced ? cost : refused ? null : undefined,
      response.ok && usage.success ? usage.data : undefined,
      reportedListMicro,
    );
    if (!response.ok) {
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
          status: charge !== null ? "settled" : "pending",
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
