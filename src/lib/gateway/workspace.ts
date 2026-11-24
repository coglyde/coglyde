import { randomBytes, randomUUID } from "node:crypto";
import {
  db,
  digest,
  GatewayError,
  history,
  refreshPendingReceipts,
} from "./ledger";
import { policySchema } from "./policy";

// Provisioning authorizes one verified primary email. After first sign-in,
// ownership is pinned to the Clerk user ID even if the email later changes.
export async function ownedWorkspace(userId: string, verifiedEmail?: string) {
  const sql = db();
  const columns = sql`w.client_id, w.display_name, w.purchases_enabled, c.policy,
    (c.key_digest IS NOT NULL) AS has_original_key`;
  const lookup = () => sql`SELECT ${columns} FROM gateway_workspaces w
    JOIN gateway_clients c ON c.id=w.client_id
    WHERE w.owner_user_id=${userId} AND c.enabled`;
  let [workspace] = await lookup();
  if (!workspace && verifiedEmail) {
    await sql`UPDATE gateway_workspaces SET owner_user_id=${userId}
      WHERE owner_email=${verifiedEmail.toLowerCase()} AND owner_user_id IS NULL
      AND NOT EXISTS (SELECT 1 FROM gateway_workspaces WHERE owner_user_id=${userId})`;
    [workspace] = await lookup();
  }
  return workspace ?? null;
}

export async function workspaceOverview(
  workspace: NonNullable<Awaited<ReturnType<typeof ownedWorkspace>>>,
) {
  const client = workspace.client_id;
  await refreshPendingReceipts(client);
  const [usage, keys] = await Promise.all([
    history(client),
    db()`SELECT id, name, suffix FROM gateway_keys
      WHERE client_id=${client} AND revoked_at IS NULL ORDER BY created_at DESC, id`,
  ]);
  const policy = policySchema.parse(workspace.policy);
  return {
    name: String(workspace.display_name),
    purchasesEnabled: Boolean(workspace.purchases_enabled),
    availableMicro: String(usage.available_micro),
    discountBps: policy.listDiscountBps ?? null,
    keys: [
      ...keys.map((k) => ({
        id: String(k.id),
        name: String(k.name),
        suffix: String(k.suffix),
      })),
      ...(workspace.has_original_key
        ? [{ id: "original", name: "Original integration key", suffix: "" }]
        : []),
    ],
    receipts: usage.receipts.map((r) => ({
      id: String(r.id),
      date: new Date(r.created_at).toISOString(),
      model: String(r.model),
      status: String(r.status),
      charge: r.charge_micro as string | null,
      direct: r.comparison?.microUsd as number | undefined,
      savings: r.savings_micro as string | null,
    })),
  };
}
export type WorkspaceOverview = Awaited<ReturnType<typeof workspaceOverview>>;

export async function createWorkspaceKey(client: string, name: string) {
  const secret = "cg_" + randomBytes(32).toString("base64url");
  const id = randomUUID();
  await db()`INSERT INTO gateway_keys (id, client_id, name, key_digest, suffix)
    VALUES (${id}, ${client}, ${name}, ${digest(secret)}, ${secret.slice(-4)})`;
  return { id, name, suffix: secret.slice(-4), secret };
}

export async function revokeWorkspaceKey(client: string, id: string) {
  if (id === "original") {
    await db()`UPDATE gateway_clients SET key_digest=NULL WHERE id=${client}`;
    return;
  }
  const rows =
    await db()`UPDATE gateway_keys SET revoked_at=coalesce(revoked_at, now())
    WHERE client_id=${client} AND id=${id} RETURNING id`;
  if (!rows.length) throw new GatewayError(404, "Key not found");
}
