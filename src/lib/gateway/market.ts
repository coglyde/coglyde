import { z } from "zod";
import {
  type Chat,
  type Policy,
  type ListPrice,
  compareUsage,
  directRate,
  retail,
} from "./policy";

function marketplaceOrigin() {
  const url = new URL(process.env.GATEWAY_MARKETPLACE_ORIGIN ?? "");
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.origin !== url.href.replace(/\/$/, "")
  )
    throw Error("Invalid marketplace origin");
  return url.origin;
}
const rate = z.int().nonnegative().max(1_000_000_000);
const offerSchema = z.object({
  provider_id: z.string(),
  available: z.literal(true),
  healthy: z.literal(true),
  trusted: z.boolean(),
  pricing_mode: z.literal("per_token"),
  effective_input_per_1m: rate,
  effective_output_per_1m: rate,
  discount_pct: z.number().min(0).max(100),
});
type Offer = z.infer<typeof offerSchema>;
export type Route = {
  model: string;
  offer: Offer;
  estimatedMicro: number;
  wholesaleMicro: number;
  listPrice: ListPrice | null;
};

async function discover(path: string) {
  const response = await fetch(marketplaceOrigin() + path, {
    redirect: "error",
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw Error("Marketplace discovery unavailable");
  return response.json();
}

export async function chooseRoute(policy: Policy, chat: Chat) {
  // Reading fresh offers matters even for requests to the same model.
  const [catalog, books] = await Promise.all([
    discover("/v1/models"),
    Promise.allSettled(
      policy.models.map((model) =>
        discover("/api/markets/" + encodeURIComponent(model)),
      ),
    ),
  ]);
  const routes: Route[] = [];
  const promptBytes = Buffer.byteLength(
    JSON.stringify([chat.messages, chat.tools]),
  );
  const inputTokens = Math.max(1, Math.ceil(promptBytes / 4));
  const needsTools =
    !!chat.tools ||
    chat.messages.some(
      (m) => m.role === "tool" || (m.role === "assistant" && m.tool_calls),
    );
  for (const [index, result] of books.entries()) {
    const model = policy.models[index];
    if (result.status !== "fulfilled" || result.value?.model !== model)
      continue;
    const info = catalog?.data?.find(
      (item: { id: string }) => item.id === model,
    );
    if (!info || (needsTools && !info.supported_features?.includes("tools")))
      continue;
    if (!(info.context_length >= inputTokens + chat.max_tokens)) continue;
    if (
      info.top_provider?.max_completion_tokens &&
      info.top_provider.max_completion_tokens < chat.max_tokens
    )
      continue;
    const rate = directRate(model);
    if (policy.listDiscountBps !== undefined && !rate) continue;
    const listPrice =
      rate && policy.listDiscountBps !== undefined
        ? { ...rate, discountBps: policy.listDiscountBps }
        : null;
    const listQuote =
      listPrice &&
      compareUsage(
        listPrice,
        {
          prompt_tokens: inputTokens,
          completion_tokens: chat.max_tokens,
          prompt_tokens_details: { cached_tokens: 0 },
        },
        listPrice.discountBps,
      );
    for (const raw of result.value.offers ?? []) {
      const parsed = offerSchema.safeParse(raw);
      if (!parsed.success) continue;
      const offer = parsed.data;
      if (
        !policy.providers.includes(offer.provider_id) ||
        (policy.trustedOnly && !offer.trusted)
      )
        continue;
      const wholesaleMicro = Math.ceil(
        (inputTokens * offer.effective_input_per_1m +
          chat.max_tokens * offer.effective_output_per_1m) /
          1_000_000,
      );
      const estimatedMicro =
        listQuote?.listChargeMicro ?? retail(wholesaleMicro, policy.markupBps);
      if (estimatedMicro <= policy.requestCapMicroUsd)
        routes.push({
          model,
          offer,
          estimatedMicro,
          wholesaleMicro,
          listPrice,
        });
    }
  }
  routes.sort((a, b) => {
    if (
      policy.strategy === "largest_discount" &&
      a.offer.discount_pct !== b.offer.discount_pct
    )
      return b.offer.discount_pct - a.offer.discount_pct;
    return (
      a.estimatedMicro - b.estimatedMicro || a.wholesaleMicro - b.wholesaleMicro
    );
  });
  return routes[0] ?? null;
}

export function complete(route: Route, chat: Chat, key: string) {
  // Enforce the selected provider and discount floor again when the market executes.
  return fetch(marketplaceOrigin() + "/v1/chat/completions", {
    method: "POST",
    redirect: "error",
    signal: AbortSignal.timeout(55_000),
    headers: {
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
      "X-Min-Discount": String(Math.floor(route.offer.discount_pct)),
    },
    body: JSON.stringify({
      ...chat,
      model: route.model,
      provider: route.offer.provider_id,
    }),
  });
}

// This is a read of the original request. It never initiates another completion.
export async function settledListTotal(
  model: string,
  provider: string,
  reference: string,
  cost: number,
  key: string,
) {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(reference)) return undefined;
  try {
    const res = await fetch(marketplaceOrigin() + "/v1/requests/" + reference, {
      headers: { Authorization: "Bearer " + key },
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      console.warn("Gateway receipt lookup HTTP status", res.status);
      return undefined;
    }
    const record = await res.json();
    if (
      record?.request_id === reference &&
      record.model === model &&
      record.provider === provider &&
      record.settlement_group === "settled" &&
      record.buyer_cost_micro === cost &&
      Number.isSafeInteger(record.direct_cost_micro)
    )
      return record.direct_cost_micro as number;
  } catch {
    // Missing scope, delay or a timeout leaves the existing reconciliation hold.
  }
  return undefined;
}
