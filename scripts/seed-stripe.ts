/**
 * One-time (re-runnable) Stripe catalog seeder.
 *
 * Reads the plans from src/lib/pricing (the single source of truth) and creates
 * the matching Stripe Products and recurring Prices, then writes the resulting
 * price ids back into .env.local as STRIPE_PRICE_* variables.
 *
 * Usage:
 *   npm run seed:stripe -- --dry-run     # print what would be created, no API calls
 *   npm run seed:stripe                  # create/update in Stripe, write .env.local
 *
 * It reads STRIPE_SECRET_KEY from .env.local (or the environment). Start in
 * Stripe TEST mode (sk_test_...), verify, then re-run with live keys.
 *
 * Idempotency: each Price is created with a stable lookup_key. On re-run, an
 * unchanged plan reuses its existing Price; a changed amount/interval creates a
 * new Price (transferring the lookup_key) and archives the old one, because
 * Stripe Prices are immutable.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import Stripe from "stripe";
import {
  addOns,
  annualTotal,
  bundles,
  seoPlans,
  websitePlans,
  type SubscriptionPlan,
} from "../src/lib/pricing";

const CURRENCY = "usd";
const ENV_PATH = resolve(process.cwd(), ".env.local");
const DRY_RUN = process.argv.includes("--dry-run");

// --- env loading ---------------------------------------------------------

function loadEnvLocal(path: string): void {
  if (!existsSync(path)) return;
  // Node 22 built-in; cast so this compiles even with older @types/node.
  const loadEnvFile = (process as { loadEnvFile?: (p: string) => void })
    .loadEnvFile;
  try {
    if (loadEnvFile) {
      loadEnvFile(path);
      return;
    }
    throw new Error("loadEnvFile unavailable");
  } catch {
    // Fall back to a minimal parser.
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    }
  }
}

// --- naming helpers (must match resolveStripePriceId in lib/stripe.ts) ----

type Period = "monthly" | "annual";

const envBase = (key: string) => key.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
const envVarName = (key: string, period: Period) =>
  `STRIPE_PRICE_${envBase(key)}_${period.toUpperCase()}`;
const lookupKey = (key: string, period: Period) =>
  `${envBase(key).toLowerCase()}_${period}`;
const cents = (dollars: number) => Math.round(dollars * 100);

// --- catalog -------------------------------------------------------------

type CatalogEntry = {
  key: string;
  name: string;
  description: string;
  prices: { period: Period; amount: number; interval: "month" | "year" }[];
};

function recurringEntry(plan: SubscriptionPlan): CatalogEntry {
  return {
    key: plan.key,
    name: plan.name,
    description: plan.blurb,
    prices: [
      { period: "monthly", amount: cents(plan.monthly), interval: "month" },
      { period: "annual", amount: cents(annualTotal(plan.monthly)), interval: "year" },
    ],
  };
}

function buildCatalog(): CatalogEntry[] {
  const recurring = [...bundles, ...websitePlans, ...seoPlans].map(recurringEntry);
  const addons = addOns.map<CatalogEntry>((addOn) => ({
    key: addOn.key,
    name: addOn.name,
    description: addOn.blurb,
    prices: [{ period: "monthly", amount: cents(addOn.price), interval: "month" }],
  }));
  return [...recurring, ...addons];
}

// --- env writeback -------------------------------------------------------

function writeEnvUpdates(path: string, updates: Record<string, string>): void {
  let contents = existsSync(path) ? readFileSync(path, "utf8") : "";
  for (const [name, value] of Object.entries(updates)) {
    const line = `${name}=${value}`;
    const pattern = new RegExp(`^${name}=.*$`, "m");
    contents = pattern.test(contents)
      ? contents.replace(pattern, line)
      : `${contents.endsWith("\n") || contents === "" ? "" : "\n"}${contents}${line}\n`;
  }
  writeFileSync(path, contents);
}

// --- main ----------------------------------------------------------------

async function main() {
  loadEnvLocal(ENV_PATH);
  const catalog = buildCatalog();

  if (DRY_RUN) {
    console.log("Dry run. Would create these products and prices:\n");
    for (const entry of catalog) {
      console.log(`• ${entry.name} (${entry.key})`);
      for (const price of entry.prices) {
        const dollars = (price.amount / 100).toFixed(2);
        console.log(
          `    ${envVarName(entry.key, price.period)}  $${dollars}/${price.interval}`,
        );
      }
    }
    console.log(`\n${catalog.length} products, ` +
      `${catalog.reduce((n, e) => n + e.prices.length, 0)} prices.`);
    return;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local (use a sk_test_ key first), then re-run.",
    );
    process.exit(1);
  }

  const stripe = new Stripe(secretKey);
  const mode = secretKey.startsWith("sk_live") ? "LIVE" : "TEST";
  console.log(`Seeding Stripe catalog in ${mode} mode...\n`);

  // Pre-fetch existing products (by metadata.planKey) and prices (by lookup_key)
  // so re-runs reuse instead of duplicating.
  const productsByKey = new Map<string, Stripe.Product>();
  for await (const product of stripe.products.list({ limit: 100 })) {
    const planKey = product.metadata?.planKey;
    if (planKey) productsByKey.set(planKey, product);
  }

  const allLookupKeys = catalog.flatMap((e) =>
    e.prices.map((p) => lookupKey(e.key, p.period)),
  );
  const pricesByLookup = new Map<string, Stripe.Price>();
  for (let i = 0; i < allLookupKeys.length; i += 10) {
    const batch = allLookupKeys.slice(i, i + 10);
    const found = await stripe.prices.list({ lookup_keys: batch, limit: 100 });
    for (const price of found.data) {
      if (price.lookup_key) pricesByLookup.set(price.lookup_key, price);
    }
  }

  const envUpdates: Record<string, string> = {};

  for (const entry of catalog) {
    let product = productsByKey.get(entry.key);
    if (!product) {
      product = await stripe.products.create({
        name: entry.name,
        description: entry.description,
        metadata: { planKey: entry.key },
      });
      productsByKey.set(entry.key, product);
      console.log(`+ product ${entry.name}`);
    }

    for (const price of entry.prices) {
      const lk = lookupKey(entry.key, price.period);
      const existing = pricesByLookup.get(lk);
      const unchanged =
        existing &&
        existing.unit_amount === price.amount &&
        existing.currency === CURRENCY &&
        existing.recurring?.interval === price.interval;

      let priceId: string;
      if (unchanged) {
        priceId = existing.id;
      } else {
        const created = await stripe.prices.create({
          product: product.id,
          currency: CURRENCY,
          unit_amount: price.amount,
          recurring: { interval: price.interval },
          nickname: `${entry.name} (${price.period})`,
          lookup_key: lk,
          transfer_lookup_key: Boolean(existing),
          metadata: { planKey: entry.key, period: price.period },
        });
        if (existing) await stripe.prices.update(existing.id, { active: false });
        priceId = created.id;
        console.log(
          `${existing ? "~" : "+"} price ${lk}  $${(price.amount / 100).toFixed(2)}/${price.interval}`,
        );
      }

      envUpdates[envVarName(entry.key, price.period)] = priceId;
    }
  }

  writeEnvUpdates(ENV_PATH, envUpdates);
  console.log(
    `\nDone. Wrote ${Object.keys(envUpdates).length} STRIPE_PRICE_* values to .env.local (${mode} mode).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
