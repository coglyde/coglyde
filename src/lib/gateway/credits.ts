import { compareUsage, directRate, type Chat, type Policy } from "./policy";
import type { Route } from "./market";

type Grant = NonNullable<Policy["creditGrants"]>[number];
const providers = {
  openai: {
    model: "gpt-5.4-mini",
    wireModel: "gpt-5.4-mini",
    context: 400_000,
    endpoint: "https://api.openai.com/v1/chat/completions",
  },
  anthropic: {
    model: "claude-sonnet-4.6",
    wireModel: "claude-sonnet-4-6",
    context: 1_000_000,
    endpoint: "https://api.anthropic.com/v1/chat/completions",
  },
} as const;

export type CreditRoute = Route & {
  grant: Grant;
  // A provider cannot accept more input than its context window. Hold this upper
  // bound until metering is known, even if a small prompt is estimated incorrectly.
  creditHold: number;
};

function keyFor(client: string, provider: Grant["provider"]) {
  return process.env[`GATEWAY_${provider.toUpperCase()}_KEY_${client}`];
}

export function creditCandidates(
  client: string,
  policy: Policy,
  chat: Chat,
  now = Date.now(),
) {
  const routes: CreditRoute[] = [];
  if (policy.listDiscountBps === undefined) return routes;
  for (const grant of policy.creditGrants ?? []) {
    const { model, context } = providers[grant.provider];
    const rate = directRate(model);
    if (
      !rate ||
      !keyFor(client, grant.provider) ||
      !policy.providers.includes(grant.provider) ||
      !policy.models.includes(model) ||
      Date.parse(grant.startsAt) > now ||
      Date.parse(grant.expiresAt) <= now + 90_000
    )
      continue;
    // The compatibility API moves all system instructions to the start.
    if (
      grant.provider === "anthropic" &&
      chat.messages.some(
        (m, i) =>
          m.role === "system" &&
          chat.messages.slice(0, i).some((p) => p.role !== "system"),
      )
    )
      continue;
    const prompt = Math.max(
      1,
      Math.ceil(
        Buffer.byteLength(JSON.stringify([chat.messages, chat.tools])) / 4,
      ),
    );
    const comparison = compareUsage(
      rate,
      {
        prompt_tokens: prompt,
        completion_tokens: chat.max_tokens,
        prompt_tokens_details: { cached_tokens: 0 },
      },
      policy.listDiscountBps,
    );
    const estimatedMicro = comparison?.listChargeMicro;
    if (
      estimatedMicro === undefined ||
      estimatedMicro > policy.requestCapMicroUsd
    )
      continue;
    routes.push({
      model,
      grant,
      estimatedMicro,
      wholesaleMicro: 0,
      creditHold: Math.ceil(
        (rate.input * context + rate.output * chat.max_tokens) / 1_000_000,
      ),
      listPrice: { ...rate, discountBps: policy.listDiscountBps },
      offer: {
        provider_id: grant.provider,
        available: true,
        healthy: true,
        trusted: true,
        pricing_mode: "per_token",
        effective_input_per_1m: 0,
        effective_output_per_1m: 0,
        discount_pct: 100,
      },
    });
  }
  return routes.sort((a, b) => a.estimatedMicro - b.estimatedMicro);
}

export function completeCredit(client: string, route: CreditRoute, chat: Chat) {
  const provider = route.grant.provider;
  const { endpoint, wireModel } = providers[provider];
  const key = keyFor(client, provider);
  if (!key) throw Error("Missing credit credential");
  return fetch(endpoint, {
    method: "POST",
    redirect: "error",
    signal: AbortSignal.timeout(55_000),
    headers: {
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: wireModel,
      messages: chat.messages,
      tools: chat.tools,
      ...(provider === "openai"
        ? { max_completion_tokens: chat.max_tokens, store: false }
        : { max_tokens: chat.max_tokens }),
    }),
  });
}
