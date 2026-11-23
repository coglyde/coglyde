import { authenticate, errorResponse, history } from "@/lib/gateway/ledger";

export async function GET(request: Request) {
  try {
    const client = await authenticate(request);
    const usage = await history(client.id);
    return Response.json(
      {
        ...usage,
        ...(client.policy.listDiscountBps === undefined
          ? {}
          : {
              pricing: {
                basis: "provider_standard_list",
                discount_bps: client.policy.listDiscountBps,
              },
            }),
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
