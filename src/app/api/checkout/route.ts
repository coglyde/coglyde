import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import type { BillingPeriod } from "@/lib/pricing";
import { getStripe, resolveStripePriceId } from "@/lib/stripe";
import { getOrCreateStripeCustomer } from "@/lib/stripe-customer";

type CheckoutBody = {
  planKey?: string;
  period?: BillingPeriod;
};

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error: "not_configured",
        message: "Checkout is not live yet. Add your Stripe keys to enable it.",
      },
      { status: 503 },
    );
  }

  // Subscribing requires an account so we can tie the Stripe customer to a
  // user and show it on /account. The client redirects to sign-in on a 401.
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "auth_required", message: "Please sign in to subscribe." },
      { status: 401 },
    );
  }

  let body: CheckoutBody = {};
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    // Leave body empty; validation below returns a clear error.
  }

  const planKey = body.planKey;
  const period: BillingPeriod = body.period === "annual" ? "annual" : "monthly";

  if (!planKey) {
    return NextResponse.json(
      { error: "missing_plan", message: "No plan was specified." },
      { status: 400 },
    );
  }

  const priceId = resolveStripePriceId(planKey, period);
  if (!priceId) {
    return NextResponse.json(
      {
        error: "unknown_price",
        message: `No Stripe price is configured for ${planKey} (${period}).`,
      },
      { status: 400 },
    );
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: "auth_required", message: "Please sign in to subscribe." },
      { status: 401 },
    );
  }
  const customerId = await getOrCreateStripeCustomer(user);

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId ?? undefined,
      client_reference_id: userId,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { metadata: { clerkUserId: userId, planKey } },
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=1`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Stripe error";
    return NextResponse.json({ error: "stripe_error", message }, { status: 502 });
  }
}
