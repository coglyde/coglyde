import { createHash, randomUUID } from "node:crypto";
import postgres from "postgres";
import {
  compareUsage,
  compareReportedList,
  directRate,
  policySchema,
  type Meter,
  type Policy,
  retail,
} from "./policy";
import { monthlyTier } from "./tiers";
import type { CreditRoute } from "./credits";
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

// This lock serializes grant checks, nonce creation and wallet holds for one tenant.
// A definite upstream rejection can switch the existing request to another route.
export async function reserve(
  client: string,
  policy: Policy,
  route: Route | CreditRoute,
  nonce: string,
  existing?: string,
  outputTokens?: number,
): Promise<string | null> {
  const id = existing ?? randomUUID();
  return db().begin(async (tx) => {
    const [wallet] =
      await tx`SELECT available_micro, policy FROM gateway_clients
      WHERE id = ${client} AND enabled FOR UPDATE`;
    if (!wallet) throw new GatewayError(401, "Invalid Coglyde key");
    let snapshot = route.listPrice;
    const livePolicy = policySchema.parse(wallet.policy);
    if (livePolicy.monthlyLimitsMicro || policy.monthlyLimitsMicro) {
      if (!outputTokens || !route.listPrice)
        throw Error("Missing monthly reservation data");
      if (existing) {
        // The initial reservation already claimed this model's monthly allowance.
        const [prior] =
          await tx`SELECT model, list_price FROM gateway_requests WHERE id=${id} AND client_id=${client} AND status='pending'`;
        if (prior?.model !== route.model || !prior.list_price?.monthlyHold)
          throw Error("Invalid tier change");
        snapshot = Object.assign({}, snapshot, {
          monthlyHold: prior.list_price.monthlyHold,
        });
      } else {
        const tier = await monthlyTier(tx, client, livePolicy, outputTokens);
        if (!tier)
          throw new GatewayError(
            429,
            "Monthly model allowance is fully reserved",
          );
        if (tier.model !== route.model)
          throw new GatewayError(
            409,
            "Monthly route changed. Retry the request.",
          );
        snapshot = Object.assign({}, snapshot, { monthlyHold: tier.held });
      }
    }
    if ("grant" in route) {
      const { grant, creditHold } = route;
      // A policy can be reduced or revoked while a request waits for this lock.
      if (
        !livePolicy.creditGrants?.some(
          (current) =>
            current.provider === grant.provider &&
            current.startsAt === grant.startsAt &&
            current.expiresAt === grant.expiresAt &&
            current.allocationMicro === grant.allocationMicro,
        )
      )
        return null;
      // Half a microdollar per rounded receipt is possible. Retain a full unit.
      const [budget] = await tx`SELECT COALESCE(SUM(CASE status
        WHEN 'released' THEN 0 WHEN 'settled' THEN COALESCE((comparison->>'microUsd')::bigint + 1,
          (list_price->>'creditHold')::bigint) ELSE (list_price->>'creditHold')::bigint END),0) AS used
        FROM gateway_requests WHERE client_id = ${client} AND provider = ${grant.provider}
        AND list_price ? 'creditHold' AND created_at >= ${grant.startsAt}::timestamptz
        AND id <> ${id}`;
      if (
        Date.now() < Date.parse(grant.startsAt) ||
        Date.now() + 90_000 >= Date.parse(grant.expiresAt) ||
        Number(budget.used) + creditHold > grant.allocationMicro
      )
        return null;
      snapshot = Object.assign({}, snapshot, { creditHold });
    }
    if (existing) {
      const [switched] =
        await tx`UPDATE gateway_requests SET model=${route.model},
        provider=${route.offer.provider_id}, list_price=${snapshot ? tx.json(snapshot) : null}, upstream_reference=NULL
        WHERE id=${id} AND client_id=${client} AND nonce=${nonce} AND status='pending'
        AND list_price ? 'creditHold' RETURNING id`;
      if (!switched) throw Error("Cannot switch request");
      return id;
    }
    const customerHold = livePolicy.monthlyLimitsMicro
      ? Math.min(Number(wallet.available_micro), policy.requestCapMicroUsd)
      : policy.requestCapMicroUsd;
    const [entry] =
      await tx`INSERT INTO gateway_requests (id,client_id,nonce,model,provider,hold_micro,markup_bps,list_price)
      VALUES (${id},${client},${nonce},${route.model},${route.offer.provider_id},${Math.max(1, customerHold)},${policy.markupBps},${snapshot ? tx.json(snapshot) : null})
      ON CONFLICT (client_id,nonce) DO NOTHING RETURNING id`;
    if (!entry)
      throw new GatewayError(
        409,
        "Request already accepted. Check usage for its receipt.",
      );
    if (
      !customerHold ||
      Number(wallet.available_micro) < customerHold ||
      route.estimatedMicro > customerHold
    )
      throw new GatewayError(402, "Insufficient available credit");
    await tx`UPDATE gateway_clients SET available_micro = available_micro - ${customerHold} WHERE id = ${client}`;
    return id;
  });
}

// Undefined cost means the marketplace has not reported settlement. Null explicitly releases a hold.
export async function finish(
  id: string,
  cost: number | null | undefined,
  usage?: Meter,
  reportedListMicro?: number,
) {
  if (
    cost != null &&
    (!Number.isSafeInteger(cost) || cost < 0 || cost > 1_000_000_000_000)
  )
    throw Error("Invalid settled cost");
  return db().begin(async (tx) => {
    const [row] =
      await tx`SELECT * FROM gateway_requests WHERE id = ${id} FOR UPDATE`;
    if (!row) throw Error("Unknown request");
    const previousCost =
      row.upstream_micro == null ? null : Number(row.upstream_micro);
    if (cost != null && previousCost !== null && previousCost !== cost)
      throw Error("Conflicting settlement");
    if (row.status !== "pending") {
      if (cost !== undefined && (row.status === "released") !== (cost === null))
        throw Error("Conflicting settlement");
      return { charge: Number(row.charge_micro), comparison: row.comparison };
    }

    const list = row.list_price;
    const comparison =
      (usage &&
        compareUsage(
          list ?? directRate(row.model),
          usage,
          list?.discountBps,
        )) ??
      (list && usage && reportedListMicro !== undefined
        ? compareReportedList(list, usage, reportedListMicro)
        : null) ??
      row.comparison;
    const wholesale = cost ?? previousCost;
    let charge: number | null = null;
    if (cost === null) charge = 0;
    else if (wholesale !== null) {
      const price = list
        ? comparison?.listChargeMicro
        : retail(wholesale, row.markup_bps);
      if (price != null) charge = Math.min(row.hold_micro, price);
    }
    const status =
      cost === null ? "released" : charge === null ? "pending" : "settled";
    await tx`UPDATE gateway_requests SET status = ${status}, upstream_micro = ${wholesale}, charge_micro = ${charge},
      input_tokens = COALESCE(${usage?.prompt_tokens ?? null},input_tokens),
      output_tokens = COALESCE(${usage?.completion_tokens ?? null},output_tokens),
      comparison = ${comparison ? tx.json(comparison) : null} WHERE id = ${id}`;
    if (charge !== null) {
      await tx`UPDATE gateway_clients SET available_micro = available_micro + ${row.hold_micro - charge} WHERE id = ${row.client_id}`;
    }
    return { charge, comparison };
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
