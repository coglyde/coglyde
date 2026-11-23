import { z } from "zod";

const slug = z.string().regex(/^[a-z0-9][a-z0-9._-]{0,99}$/);
export const policySchema = z.strictObject({
  models: z.array(slug).min(1).max(12),
  providers: z.array(slug).min(1).max(32),
  trustedOnly: z.boolean(),
  strategy: z.enum(["lowest_cost", "largest_discount"]),
  listDiscountBps: z.int().min(0).max(10000).optional(),
  monthlyLimitsMicro: z
    .record(slug, z.int().positive().max(1_000_000_000))
    .optional(),
  // Only provision against an upstream allocation that cannot spend purchased credit.
  creditGrants: z
    .array(
      z
        .strictObject({
          provider: z.enum(["openai", "anthropic"]),
          startsAt: z.iso.datetime(),
          expiresAt: z.iso.datetime(),
          allocationMicro: z.int().positive().max(1_000_000_000),
          coverage: z.literal("provider_reserved_promo_only"),
        })
        .refine((g) => Date.parse(g.startsAt) < Date.parse(g.expiresAt)),
    )
    .max(2)
    .refine((gs) => new Set(gs.map((g) => g.provider)).size === gs.length)
    .optional(),
  markupBps: z.int().min(0).max(10000),
  requestCapMicroUsd: z.int().positive().max(100_000_000),
});
export type Policy = z.infer<typeof policySchema>;

// Standard synchronous text rates, in micro-USD per million tokens.
// Source URLs travel with each estimate so customers can inspect the comparison.
const directRates: Record<
  string,
  { input: number; cached: number; output: number; source: string }
> = {
  "claude-haiku-5.5": {
    input: 100000,
    cached: 10000,
    output: 500000,
    source: "https://platform.claude.com/docs/en/models/haiku-5-5/overview",
  },
  "gpt-5.4-mini": {
    input: 750000,
    cached: 75000,
    output: 4500000,
    source: "https://developers.openai.com/api/docs/models/gpt-5.4-mini",
  },
  "claude-sonnet-4.6": {
    input: 3000000,
    cached: 300000,
    output: 15000000,
    source: "https://platform.claude.com/docs/en/models/sonnet-4-6/overview",
  },
};

export const meterSchema = z.object({
  prompt_tokens: z.int().min(0).max(10_000_000),
  completion_tokens: z.int().min(0).max(10_000_000),
  prompt_tokens_details: z
    .object({ cached_tokens: z.int().nonnegative().optional() })
    .nullish(),
});

export type Meter = z.infer<typeof meterSchema>;
type DirectRate = (typeof directRates)[string] & {
  rateDate: string;
  longContext?: { above: number; multiplier: number };
};
export type ListPrice = DirectRate & { discountBps: number };
export function directRate(model: string): DirectRate | null {
  if (!Object.hasOwn(directRates, model)) return null;
  return {
    ...directRates[model],
    rateDate: model === "claude-haiku-5.5" ? "2026-11-23" : "2026-11-22",
    ...(model === "claude-haiku-5.5" && {
      longContext: { above: 100_000, multiplier: 5 },
    }),
  };
}

export function compareUsage(
  rate: DirectRate | null,
  usage: Meter,
  discountBps?: number,
) {
  const cached = usage.prompt_tokens_details?.cached_tokens;
  if (!rate || cached === undefined || cached > usage.prompt_tokens)
    return null;
  const factor =
    rate.longContext && usage.prompt_tokens > rate.longContext.above
      ? rate.longContext.multiplier
      : 1;
  const exactMicro =
    (factor *
      ((usage.prompt_tokens - cached) * rate.input +
        cached * rate.cached +
        usage.completion_tokens * rate.output)) /
    1_000_000;
  return {
    microUsd: Math.round(exactMicro),
    source: rate.source,
    basis: "standard_text_reported_cache",
    rateDate: rate.rateDate,
    ...(discountBps === undefined
      ? {}
      : {
          discountBps,
          // Apply the discount before rounding to the ledger's smallest unit.
          listChargeMicro: Math.round(
            (exactMicro * (10_000 - discountBps)) / 10_000,
          ),
        }),
  };
}

export function retail(wholesale: number, markupBps: number) {
  return Math.ceil((wholesale * (10_000 + markupBps)) / 10_000);
}

export const functionCall = z.object({
  id: z.string().min(1),
  type: z.literal("function"),
  function: z.object({ name: z.string().min(1), arguments: z.string() }),
});
const message = z.discriminatedUnion("role", [
  z.strictObject({ role: z.enum(["user", "system"]), content: z.string() }),
  z.strictObject({
    role: z.literal("assistant"),
    content: z.string().nullable(),
    tool_calls: z.array(functionCall).min(1).optional(),
  }),
  z.strictObject({
    role: z.literal("tool"),
    tool_call_id: z.string().min(1),
    content: z.string(),
  }),
]);
export const chatSchema = z.strictObject({
  model: z.literal("coglyde-auto").default("coglyde-auto"),
  messages: z.array(message).min(1).max(128),
  tools: z
    .array(
      z.strictObject({
        type: z.literal("function"),
        function: z.strictObject({
          name: z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/),
          description: z.string().optional(),
          parameters: z.record(z.string(), z.unknown()),
        }),
      }),
    )
    .min(1)
    .max(32)
    .optional(),
  max_tokens: z.int().positive().max(4096).default(512),
  stream: z.literal(false).optional(),
});
export type Chat = z.infer<typeof chatSchema>;
