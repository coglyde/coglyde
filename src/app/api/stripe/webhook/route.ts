import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { handleStripeEvent } from "@/lib/stripe-events";

// Stripe signature verification needs the raw request body and Node crypto.
export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json(
      { error: "not_configured", message: "Webhook is not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "missing_signature" },
      { status: 400 },
    );
  }

  // Must be the raw text body, not parsed JSON, or the signature check fails.
  const body = await request.text();

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid signature";
    return NextResponse.json(
      { error: "invalid_signature", message },
      { status: 400 },
    );
  }

  try {
    await handleStripeEvent(event);
  } catch (err) {
    // The side effects here (notify, log) are non-critical, so we record the
    // failure and still acknowledge the event to avoid needless Stripe retries.
    console.error("[stripe webhook] handler error:", err);
  }

  return NextResponse.json({ received: true });
}
