import { z } from "zod";
import {
  authenticate,
  errorResponse,
  GatewayError,
} from "@/lib/gateway/ledger";
import { nonce, readJson } from "@/lib/gateway/http";
import { getStripe } from "@/lib/stripe";

const topUp = z.strictObject({ usd_cents: z.int().min(500).max(100000) });

export async function POST(request: Request) {
  try {
    const client = await authenticate(request);
    const key = nonce(request);
    const body = topUp.safeParse(await readJson(request, 1024));
    if (!body.success)
      throw new GatewayError(400, "Choose a top-up between 5 and 1000 USD");
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
        metadata: { product: "gateway_credit", gateway_client: client.id },
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: body.data.usd_cents,
              product_data: { name: "Coglyde AI credits" },
            },
          },
        ],
        success_url: origin + "/account",
        cancel_url: origin + "/account",
      },
      { idempotencyKey: "gateway:" + client.id + ":" + key },
    );
    return Response.json(
      { url: session.url },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
