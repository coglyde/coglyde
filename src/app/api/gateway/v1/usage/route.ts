import {
  authenticate,
  errorResponse,
  history,
  refreshPendingReceipts,
} from "@/lib/gateway/ledger";

export async function GET(request: Request) {
  try {
    const client = await authenticate(request);
    await refreshPendingReceipts(client.id);
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
