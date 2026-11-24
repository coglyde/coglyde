import { randomBytes, randomUUID } from "node:crypto";
import {
  db,
  buyerCredential,
  digest,
  GatewayError,
  history,
  refreshPendingReceipts,
} from "./ledger";
import { policySchema } from "./policy";

const personalPolicy = policySchema.parse({
  models: ["claude-haiku-5.5", "gpt-5.4-mini"],
  providers: ["anthropic", "openai"],
  trustedOnly: true,
  strategy: "lowest_cost",
  listDiscountBps: 2000,
  markupBps: 0,
  requestCapMicroUsd: 50000,
});

// A verified email can claim an invitation once. Returning owners are
// always resolved by their immutable Clerk ID, including after an email change.
export async function ownedWorkspace(userId: string, verifiedEmail?: string) {
  const sql = db();
  return sql.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(hashtextextended(${userId}, 0))`;
    const lookup =
      () => tx`SELECT w.client_id, w.display_name, w.purchases_enabled, w.funding_note,
      c.policy, c.enabled, (c.key_digest IS NOT NULL) AS has_original_key
      FROM gateway_workspaces w JOIN gateway_clients c ON c.id=w.client_id
      WHERE w.owner_user_id=${userId}`;
    let [workspace] = await lookup();
    if (!workspace) {
      if (!verifiedEmail)
        throw new GatewayError(
          403,
          "Verify your primary email address to open AI credits.",
        );
      const email = verifiedEmail.toLowerCase();
      const [invite] =
        await tx`SELECT client_id, owner_user_id FROM gateway_workspaces
        WHERE owner_email=${email} FOR UPDATE`;
      if (invite && !invite.owner_user_id) {
        await tx`UPDATE gateway_workspaces SET owner_user_id=${userId} WHERE client_id=${invite.client_id}`;
      } else {
        const client =
          "PERSONAL_" + randomUUID().replaceAll("-", "").toUpperCase();
        await tx`INSERT INTO gateway_clients (id,policy) VALUES (${client},${tx.json(personalPolicy)})`;
        await tx`INSERT INTO gateway_workspaces (client_id, display_name, owner_user_id, purchases_enabled)
          VALUES (${client}, 'Personal workspace', ${userId}, true)`;
      }
      [workspace] = await lookup();
    }
    if (!workspace?.enabled)
      throw new GatewayError(403, "This workspace is disabled.");
    return workspace;
  });
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
    fundingNote:
      (workspace.funding_note as string | null) ||
      (!buyerCredential(client) && !policy.creditGrants?.length
        ? "You can add credits now. API usage will be available once routing is activated."
        : null),
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
