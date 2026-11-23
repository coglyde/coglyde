import { authenticate, errorResponse, history } from "@/lib/gateway/ledger";

export async function GET(request: Request) {
  try {
    const client = await authenticate(request);
    return Response.json(await history(client.id), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
