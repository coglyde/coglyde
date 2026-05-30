// Shared pricing types and billing math. The numbers and copy live in the
// sibling files (build-tiers, website-plans, seo-plans, bundles, add-ons) and
// the tab wiring lives in tabs.ts. Plan `key`s map to Stripe price IDs via env
// vars (see resolveStripePriceId in lib/stripe.ts and .env.example).

export type BillingPeriod = "monthly" | "annual";

// The four service lines the pricing page is organized into.
export type PricingTabKey =
  | "all-in-one"
  | "website-design"
  | "seo"
  | "automations";

export type SubscriptionPlan = {
  key: string;
  name: string;
  blurb: string;
  monthly: number;
  features: string[];
  popular?: boolean;
  // Optional explainer surfaced as an info tooltip next to the plan name.
  tooltip?: string;
};

export type AddOn = {
  key: string;
  name: string;
  price: number;
  blurb: string;
  note?: string;
};

export type BuildTier = {
  name: string;
  startingAt: number;
  blurb: string;
  features: string[];
  popular?: boolean;
};

// Annual billing gives roughly two months free (pay for 10, get 12).
export const annualTotal = (monthly: number) => monthly * 10;
export const annualPerMonth = (monthly: number) =>
  Math.round((monthly * 10) / 12);

// Formats a dollar amount for display: no decimals for whole numbers, two
// decimals when there are cents (so 139.99 stays "139.99" and 1399.9 shows as
// "1,399.90"). Pair with a leading "$" at the call site.
export const formatPrice = (amount: number): string =>
  amount.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  });
