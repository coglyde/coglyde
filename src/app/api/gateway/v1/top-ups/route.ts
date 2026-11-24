import { z } from "zod";
import {
  authenticate,
  errorResponse,
  GatewayError,
} from "@/lib/gateway/ledger";
import { nonce, readJson } from "@/lib/gateway/http";
import { creditCheckout } from "@/lib/gateway/checkout";

const topUp = z.strictObject({ usd_cents: z.int().min(500).max(100000) });

export async function POST(request: Request) {
  try {
    const client = await authenticate(request);
    const key = nonce(request);
    const body = topUp.safeParse(await readJson(request, 1024));
    if (!body.success)
      throw new GatewayError(400, "Choose a top-up between 5 and 1000 USD");
    const url = await creditCheckout(client.id, body.data.usd_cents, key);
    return Response.json(
      { url },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
