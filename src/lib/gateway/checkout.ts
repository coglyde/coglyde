import { getStripe } from "@/lib/stripe";
import { db, GatewayError } from "./ledger";

export async function creditCheckout(
  client: string,
  cents: number,
  key: string,
) {
  if (!Number.isSafeInteger(cents) || cents < 500 || cents > 100000)
    throw new GatewayError(400, "Choose a top-up between 5 and 1000 USD");
  const [workspace] =
    await db()`SELECT purchases_enabled FROM gateway_workspaces WHERE client_id=${client}`;
  if (workspace && !workspace.purchases_enabled)
    throw new GatewayError(
      409,
      "Credit purchases are paused for this workspace.",
    );
  const stripe = getStripe();
  if (!stripe) throw new GatewayError(503, "Checkout is unavailable");
  const origin = new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://coglyde.com",
  ).origin;
  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      integration_identifier: "coglyde_gateway_qwjtmzla",
      adaptive_pricing: { enabled: false },
      metadata: { product: "gateway_credit", gateway_client: client },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: cents,
            product_data: { name: "Coglyde AI credits" },
          },
        },
      ],
      success_url: origin + "/account?section=ai&checkout=returned",
      cancel_url: origin + "/account?section=ai",
    },
    { idempotencyKey: "gateway:" + client + ":" + key },
  );
  if (!session.url) throw new GatewayError(503, "Checkout is unavailable");
  return session.url;
}
