import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { db, digest, finish } from "../../src/lib/gateway/ledger";
import { meterSchema, policySchema } from "../../src/lib/gateway/policy";

async function run() {
  const [action, id, argument] = process.argv.slice(2);
  const sql = db();
  if (action === "migrate") {
    await sql.unsafe(
      await readFile(new URL("./schema.sql", import.meta.url), "utf8"),
    );
    return;
  }
  if (action === "pending") {
    console.table(
      await sql`SELECT id, client_id, model, created_at, upstream_reference, hold_micro
      FROM gateway_requests WHERE status = 'pending' ORDER BY created_at`,
    );
    return;
  }
  if (action === "settle" || action === "release") {
    if (!id || (action === "settle" && !/^\d+$/.test(argument ?? "")))
      throw Error("Expected request UUID and settled cost in micro-USD");
    const usagePath = process.argv[5];
    const usage =
      action === "settle" && usagePath
        ? meterSchema.parse(JSON.parse(await readFile(usagePath, "utf8")))
        : undefined;
    const { charge } = await finish(
      id,
      action === "release" ? null : Number(argument),
      usage,
    );
    if (charge === null)
      throw Error(
        "Cost recorded. Supply the verified usage JSON file to complete list-price settlement.",
      );
    return;
  }
  if (!/^[A-Z][A-Z0-9_]{0,47}$/.test(id ?? ""))
    throw Error("Expected client ID in uppercase snake case");
  if (action === "create" || action === "policy") {
    const policy = policySchema.parse(
      JSON.parse(await readFile(argument, "utf8")),
    );
    if (action === "create") {
      const key = "cg_" + randomBytes(32).toString("base64url");
      await sql`INSERT INTO gateway_clients (id, key_digest, policy) VALUES (${id}, ${digest(key)}, ${sql.json(policy)})`;
      process.stdout.write(key + "\n");
      return;
    }
    const changed =
      await sql`UPDATE gateway_clients SET policy = ${sql.json(policy)} WHERE id = ${id} RETURNING id`;
    if (!changed.length) throw Error("Client not found");
    return;
  }
  throw Error("Expected migrate, create, policy, pending, settle, or release");
}

run()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (process.env.GATEWAY_DATABASE_URL) await db().end();
  });
