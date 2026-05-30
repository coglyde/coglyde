import Stripe from "stripe";
import type { BillingPeriod } from "./pricing";

// Server-only Stripe access. The whole checkout flow stays inert until
// STRIPE_SECRET_KEY is present, so the site runs fine before keys are added.

let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!cached) cached = new Stripe(key);
  return cached;
}

// A plan key like "care-pro" plus a period resolves to an env var such as
// STRIPE_PRICE_CARE_PRO_MONTHLY, whose value is the Stripe price id.
export function resolveStripePriceId(
  planKey: string,
  period: BillingPeriod,
): string | undefined {
  const base = planKey.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
  return process.env[`STRIPE_PRICE_${base}_${period.toUpperCase()}`];
}
