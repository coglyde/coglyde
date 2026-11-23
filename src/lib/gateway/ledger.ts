import { createHash, randomUUID } from "node:crypto";
import postgres from "postgres";
import { policySchema, type Policy, retail } from "./policy";
import type { Route } from "./market";

let pool: ReturnType<typeof postgres> | undefined;
export function db() {
  if (!process.env.GATEWAY_DATABASE_URL)
    throw Error("Gateway database unavailable");
  return (pool ??= postgres(process.env.GATEWAY_DATABASE_URL, {
    prepare: false,
    max: 3,
    idle_timeout: 20,
    connect_timeout: 5,
  }));
}
export const digest = (key: string) =>
  createHash("sha256").update(key).digest("hex");

export class GatewayError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function authenticate(request: Request) {
  const match = /^Bearer (cg_[A-Za-z0-9_-]{43})$/i.exec(
    request.headers.get("authorization") ?? "",
  );
  if (!match) throw new GatewayError(401, "Invalid Coglyde key");
  const [account] =
    await db()`SELECT id, policy FROM gateway_clients WHERE enabled AND key_digest = ${digest(match[1])}`;
  if (!account) throw new GatewayError(401, "Invalid Coglyde key");
  return { id: String(account.id), policy: policySchema.parse(account.policy) };
}
export function upstreamKey(client: string) {
  const key = process.env["GATEWAY_BUYER_KEY_" + client];
  if (!key) throw new GatewayError(503, "Routing is unavailable");
  return key;
}

export async function reserve(
  client: string,
  policy: Policy,
  route: Route,
  nonce: string,
) {
  const id = randomUUID();
  await db().begin(async (tx) => {
    const [entry] =
      await tx`INSERT INTO gateway_requests (id,client_id,nonce,model,provider,hold_micro,markup_bps)
      VALUES (${id},${client},${nonce},${route.model},${route.offer.provider_id},${policy.requestCapMicroUsd},${policy.markupBps})
      ON CONFLICT (client_id,nonce) DO NOTHING RETURNING id`;
    if (!entry)
      throw new GatewayError(
        409,
        "Request already accepted. Check usage for its receipt.",
      );
    const [wallet] =
      await tx`UPDATE gateway_clients SET available_micro = available_micro - ${policy.requestCapMicroUsd}
      WHERE id = ${client} AND enabled AND available_micro >= ${policy.requestCapMicroUsd} RETURNING id`;
    if (!wallet) throw new GatewayError(402, "Insufficient available credit");
  });
  return id;
}

export async function finish(id: string, cost: number | null) {
  if (
    cost !== null &&
    (!Number.isSafeInteger(cost) || cost < 0 || cost > 1_000_000_000_000)
  )
    throw Error("Invalid settled cost");
  return db().begin(async (tx) => {
    const [row] =
      await tx`SELECT * FROM gateway_requests WHERE id = ${id} FOR UPDATE`;
    if (!row) throw Error("Unknown request");
    if (row.status !== "pending") {
      if (
        (row.status === "released") !== (cost === null) ||
        (cost !== null && Number(row.upstream_micro) !== cost)
      )
        throw Error("Conflicting settlement");
      return Number(row.charge_micro);
    }
    const charge =
      cost === null
        ? 0
        : Math.min(row.hold_micro, retail(cost, row.markup_bps));
    await tx`UPDATE gateway_requests SET status = ${cost === null ? "released" : "settled"},
      upstream_micro = ${cost}, charge_micro = ${charge}
      WHERE id = ${id}`;
    await tx`UPDATE gateway_clients SET available_micro = available_micro + ${row.hold_micro - charge} WHERE id = ${row.client_id}`;
    return charge;
  });
}

export async function deposit(
  client: string,
  reference: string,
  amount: number,
) {
  if (!reference || !Number.isSafeInteger(amount) || amount <= 0)
    throw Error("Invalid deposit");
  await db().begin(async (tx) => {
    const [added] =
      await tx`INSERT INTO gateway_deposits (reference,client_id,amount_micro)
      VALUES (${reference},${client},${amount}) ON CONFLICT DO NOTHING RETURNING reference`;
    if (added) {
      await tx`UPDATE gateway_clients SET available_micro = available_micro + ${amount} WHERE id = ${client}`;
    } else {
      const [prior] =
        await tx`SELECT * FROM gateway_deposits WHERE reference = ${reference}`;
      if (prior.client_id !== client || Number(prior.amount_micro) !== amount)
        throw Error("Deposit reference already used");
    }
  });
}

export async function history(client: string) {
  const [wallet] =
    await db()`SELECT available_micro::text FROM gateway_clients WHERE id = ${client}`;
  const receipts =
    await db()`SELECT id, nonce AS idempotency_key, created_at, model, status, charge_micro::text,
    input_tokens, output_tokens, comparison, CASE WHEN status = 'settled' THEN (comparison->>'microUsd')::bigint - charge_micro END AS savings_micro
    FROM gateway_requests WHERE client_id = ${client} ORDER BY created_at DESC, id DESC LIMIT 100`;
  return {
    currency: "USD",
    unit: "microdollars",
    available_micro: wallet.available_micro,
    receipts,
  };
}

export function errorResponse(error: unknown, requestId?: string) {
  const known = error instanceof GatewayError;
  return Response.json(
    {
      error: {
        message: known ? error.message : "Gateway temporarily unavailable",
      },
      request_id: requestId,
    },
    {
      status: known ? error.status : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
