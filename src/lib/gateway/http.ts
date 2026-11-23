import { GatewayError } from "./ledger";

// Enforce the limit for chunked uploads as well as requests with Content-Length.
export async function readJson(request: Request, limit = 65536) {
  const reader = request.body?.getReader();
  if (!reader) throw new GatewayError(400, "Expected a JSON body");
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > limit) {
        await reader.cancel();
        throw new GatewayError(413, "Request body too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new GatewayError(400, "Invalid JSON");
  }
}

export function nonce(request: Request) {
  const value = request.headers.get("Idempotency-Key");
  if (!value || !/^[A-Za-z0-9._:-]{1,128}$/.test(value))
    throw new GatewayError(400, "Supply an Idempotency-Key");
  return value;
}
