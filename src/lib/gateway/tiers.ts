import type postgres from "postgres";
import { maxListCost } from "./credits";
import type { Policy } from "./policy";

// Count provider-list value on every route. Counting before the customer discount
// protects the provider allowance as well as the customer's dollar ceiling.
export async function monthlyTier(
  sql: postgres.Sql | postgres.TransactionSql,
  client: string,
  policy: Policy,
  outputTokens: number,
) {
  if (!policy.monthlyLimitsMicro) return null;
  const rows = await sql`SELECT model, SUM(CASE WHEN status='released' THEN 0
    WHEN status='settled' AND comparison ? 'microUsd' THEN (comparison->>'microUsd')::bigint + 1
    ELSE COALESCE((list_price->>'monthlyHold')::bigint, 1000000000) END) AS used
    FROM gateway_requests WHERE client_id=${client} AND created_at >=
    (date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE 'UTC') AT TIME ZONE 'UTC')
    GROUP BY model`;
  for (const model of policy.models) {
    const ceiling = policy.monthlyLimitsMicro[model];
    const held = maxListCost(model, outputTokens);
    const used = Number(rows.find((row) => row.model === model)?.used ?? 0);
    if (ceiling && used + held <= ceiling) return { model, held };
  }
  return null;
}
