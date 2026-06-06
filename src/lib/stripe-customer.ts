import type Stripe from "stripe";
import { clerkClient, type User } from "@clerk/nextjs/server";
import { getStripe } from "./stripe";
import { addOns, bundles, seoPlans, websitePlans } from "./pricing";

// Friendly plan names keyed by plan key, so a subscription can be labelled from
// the price's `planKey` metadata (set by the seed script) without expanding the
// Stripe product — which would exceed Stripe's 4-level expand limit.
const PLAN_NAMES = new Map<string, string>();
for (const plan of [...bundles, ...websitePlans, ...seoPlans]) {
  PLAN_NAMES.set(plan.key, plan.name);
}
for (const addOn of addOns) {
  PLAN_NAMES.set(addOn.key, addOn.name);
}

// Bridges Clerk users and Stripe customers without a database: the Stripe
// customer id is stored on the Clerk user's private metadata. This file is the
// single place that reads/writes that link and turns a customer's Stripe
// subscriptions into a shape the /account page can render.

const STRIPE_CUSTOMER_KEY = "stripeCustomerId";

function readStripeCustomerId(user: User): string | undefined {
  const meta = user.privateMetadata as { stripeCustomerId?: string };
  return meta?.stripeCustomerId;
}

function primaryEmail(user: User): string | undefined {
  const primary = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId,
  );
  return primary?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
}

// Returns the user's Stripe customer id, creating the customer on first use.
// Returns null only when Stripe is not configured (no secret key).
export async function getOrCreateStripeCustomer(
  user: User,
): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe) return null;

  const existing = readStripeCustomerId(user);
  if (existing) return existing;

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const customer = await stripe.customers.create({
    email: primaryEmail(user),
    name: name || undefined,
    metadata: { clerkUserId: user.id },
  });

  await linkStripeCustomerToUser(user.id, customer.id);
  return customer.id;
}

// Stores the Stripe customer id on the Clerk user. Called from checkout (after
// creating the customer) and from the webhook (belt and suspenders).
// updateUserMetadata deep-merges, so this preserves any other metadata. The
// metadata object is built as a variable so it is checked structurally against
// Clerk's metadata type without tripping excess-property checks.
export async function linkStripeCustomerToUser(
  clerkUserId: string,
  stripeCustomerId: string,
): Promise<void> {
  const privateMetadata = { [STRIPE_CUSTOMER_KEY]: stripeCustomerId };
  const client = await clerkClient();
  await client.users.updateUserMetadata(clerkUserId, { privateMetadata });
}

export type PlanSummary = {
  id: string;
  name: string;
  status: Stripe.Subscription.Status;
  priceLabel: string;
  intervalLabel: string;
  currentPeriodEnd: number | null;
  cancelAtPeriodEnd: boolean;
  // The plan's internal key (price metadata.planKey), used for feature gating.
  planKey: string | null;
};

export type SubscriptionSummary = {
  // Whether Stripe is configured at all (keys present).
  stripeReady: boolean;
  subscriptions: PlanSummary[];
};

// Reads the period end defensively: recent Stripe API versions moved
// `current_period_end` from the subscription onto each subscription item, so
// we check the item first and fall back to the legacy field.
function periodEnd(subscription: Stripe.Subscription): number | null {
  const item = subscription.items?.data?.[0] as
    | { current_period_end?: number }
    | undefined;
  if (item?.current_period_end) return item.current_period_end;
  const legacy = subscription as unknown as { current_period_end?: number };
  return legacy.current_period_end ?? null;
}

function describePrice(price: Stripe.Price | undefined): {
  priceLabel: string;
  intervalLabel: string;
} {
  if (!price) return { priceLabel: "", intervalLabel: "" };
  const amount = ((price.unit_amount ?? 0) / 100).toLocaleString(undefined, {
    style: "currency",
    currency: (price.currency ?? "usd").toUpperCase(),
    minimumFractionDigits: 0,
  });
  const interval = price.recurring?.interval;
  const intervalLabel =
    interval === "year" ? "billed yearly" : interval ? "billed monthly" : "";
  const per = interval === "year" ? "/yr" : "/mo";
  return { priceLabel: `${amount}${interval ? per : ""}`, intervalLabel };
}

function planName(price: Stripe.Price | undefined): string {
  const planKey = price?.metadata?.planKey;
  if (planKey && PLAN_NAMES.has(planKey)) return PLAN_NAMES.get(planKey)!;
  return price?.nickname ?? "Subscription";
}

// Lists the user's subscriptions as display-ready summaries. Returns an empty
// list (not an error) when Stripe is unconfigured or the user has no customer.
export async function getSubscriptionSummary(
  user: User | null,
): Promise<SubscriptionSummary> {
  const stripe = getStripe();
  if (!stripe) return { stripeReady: false, subscriptions: [] };

  const customerId = user ? readStripeCustomerId(user) : undefined;
  if (!customerId) return { stripeReady: true, subscriptions: [] };

  const list = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    // Stripe caps expand at 4 levels; data.items.data.price is the deepest we
    // can go. The product is not expanded (we name plans from price metadata).
    expand: ["data.items.data.price"],
    limit: 20,
  });

  const subscriptions = list.data
    .filter((sub) => sub.status !== "incomplete_expired")
    .map((sub) => {
      const price = sub.items?.data?.[0]?.price;
      const { priceLabel, intervalLabel } = describePrice(price);
      return {
        id: sub.id,
        name: planName(price),
        status: sub.status,
        priceLabel,
        intervalLabel,
        currentPeriodEnd: periodEnd(sub),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        planKey: price?.metadata?.planKey ?? null,
      } satisfies PlanSummary;
    });

  return { stripeReady: true, subscriptions };
}
