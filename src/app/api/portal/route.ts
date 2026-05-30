import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getStripe } from "@/lib/stripe";
import { getOrCreateStripeCustomer } from "@/lib/stripe-customer";

// Opens the Stripe billing portal for the signed-in user's linked customer.
// Used from /account and the post-checkout success page.
export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "not_configured", message: "The billing portal is not live yet." },
      { status: 503 },
    );
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "auth_required", message: "Please sign in to manage billing." },
      { status: 401 },
    );
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: "auth_required", message: "Please sign in to manage billing." },
      { status: 401 },
    );
  }

  const customerId = await getOrCreateStripeCustomer(user);
  if (!customerId) {
    return NextResponse.json(
      { error: "no_customer", message: "No billing account is linked yet." },
      { status: 400 },
    );
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    new URL(request.url).origin;

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/account`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Stripe error";
    return NextResponse.json({ error: "stripe_error", message }, { status: 502 });
  }
}
