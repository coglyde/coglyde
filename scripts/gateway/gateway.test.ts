import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import type Stripe from "stripe";
import { POST } from "../../src/app/api/gateway/v1/chat/completions/route";
import { GET } from "../../src/app/api/gateway/v1/usage/route";
import { creditCandidates } from "../../src/lib/gateway/credits";
import { chooseRoute } from "../../src/lib/gateway/market";
import {
  chatSchema,
  compareReportedList,
  compareUsage,
  directRate,
  policySchema,
} from "../../src/lib/gateway/policy";
import {
  db,
  deposit,
  digest,
  finish,
  history,
  reserve,
} from "../../src/lib/gateway/ledger";
import { processGatewayPayment } from "../../src/lib/gateway/stripe";
import { monthlyTier } from "../../src/lib/gateway/tiers";
import { maxListCost } from "../../src/lib/gateway/credits";
import pilot from "./pilot.json";

process.env.GATEWAY_MARKETPLACE_ORIGIN = "https://inference.example.test";
const policy = policySchema.parse(pilot);
const chat = chatSchema.parse({
  messages: [{ role: "user", content: "Hello" }],
  max_tokens: 100,
});
const [mini, sonnet] = policy.models;
const offer = (provider: string, price: number, discount: number) => ({
  provider_id: provider,
  available: true,
  healthy: true,
  pricing_mode: "per_token",
  trusted: true,
  effective_input_per_1m: price,
  effective_output_per_1m: price,
  discount_pct: discount,
});
function discovery(url: string) {
  if (url.endsWith("/v1/models"))
    return Response.json({
      data: [
        { id: mini, context_length: 4096, supported_features: [] },
        { id: sonnet, context_length: 4096, supported_features: ["tools"] },
      ],
    });
  const model = url.split("/").pop();
  const offers = [
    { ...offer("openai", 1, 99), healthy: false },
    { ...offer("openai", 2, 98), available: false },
    offer("outside", 3, 97),
    { ...offer("openai", 4, 96), trusted: false },
    model === mini
      ? offer("openai", 10000, 20)
      : offer("anthropic", 300000, 90),
  ];
  return Response.json({ model, offers });
}
test("strategies, tool requirements, caps and trust constrain live offers", async (t) => {
  t.mock.method(globalThis, "fetch", async (url: string) => discovery(url));
  assert.equal((await chooseRoute(policy, chat))?.model, mini);
  assert.equal(
    (await chooseRoute({ ...policy, strategy: "largest_discount" }, chat))
      ?.offer.provider_id,
    "anthropic",
  );
  assert.equal(
    (
      await chooseRoute(policy, {
        ...chat,
        tools: [
          { type: "function", function: { name: "read", parameters: {} } },
        ],
      })
    )?.model,
    sonnet,
  );
  assert.equal(
    await chooseRoute({ ...policy, providers: ["unavailable"] }, chat),
    null,
  );
  assert.equal(
    await chooseRoute({ ...policy, requestCapMicroUsd: 1 }, chat),
    null,
  );
  assert.equal(
    chatSchema.safeParse({ ...chat, provider: "outside" }).success,
    false,
  );
});
test("direct text estimates use reported cache reads; unsupported comparisons are absent", () => {
  const usage = {
    prompt_tokens: 10000,
    completion_tokens: 1000,
    prompt_tokens_details: { cached_tokens: 2000 },
  };
  assert.equal(compareUsage(directRate(mini), usage)?.microUsd, 10650);
  assert.equal(
    compareUsage(directRate(mini), { ...usage, prompt_tokens_details: null }),
    null,
  );
  assert.equal(compareUsage(directRate("unknown"), usage), null);
});
test("Haiku receipts can settle missing cache counts only below the cache minimum", () => {
  const rate = directRate("claude-haiku-5.5");
  const usage = { prompt_tokens: 436, completion_tokens: 54 };
  assert.equal(compareUsage(rate, usage, 2000)?.listChargeMicro, 56);
  assert.equal(
    compareUsage(rate, usage)?.basis,
    "standard_text_below_cache_minimum",
  );
  assert.equal(compareUsage(rate, { ...usage, prompt_tokens: 512 }), null);
  assert.equal(
    compareUsage(rate, {
      ...usage,
      prompt_tokens: 512,
      prompt_tokens_details: { cached_tokens: 512 },
    })?.microUsd,
    32,
  );
});
test("market list reference is bounded by official pricing for the observed usage", () => {
  const rate = { ...directRate("claude-haiku-5.5")!, discountBps: 2000 };
  const usage = { prompt_tokens: 532, completion_tokens: 34 };
  assert.equal(compareReportedList(rate, usage, 70)?.listChargeMicro, 56);
  for (const amount of [-1, 0, 71, 70.1])
    assert.equal(compareReportedList(rate, usage, amount), null);
});
test("list pricing applies to each model and rounds the discounted total once", async (t) => {
  const first = {
    prompt_tokens: 25,
    completion_tokens: 16,
    prompt_tokens_details: { cached_tokens: 0 },
  };
  assert.equal(
    compareUsage(directRate(mini), first, 2000)?.listChargeMicro,
    73,
  );
  assert.equal(
    compareUsage(directRate(sonnet), first, 2000)?.listChargeMicro,
    252,
  );
  assert.equal(
    compareUsage(
      directRate(mini),
      { ...first, prompt_tokens: 2, completion_tokens: 0 },
      2000,
    )?.listChargeMicro,
    1,
  );
  assert.equal(
    compareUsage(
      directRate(sonnet),
      { ...first, prompt_tokens_details: { cached_tokens: 25 } },
      2000,
    )?.listChargeMicro,
    198,
  );
  t.mock.method(globalThis, "fetch", async (url: string) => discovery(url));
  const discounted = { ...policy, listDiscountBps: 2000 };
  assert.equal((await chooseRoute(discounted, chat))?.listPrice?.input, 750000);
  assert.equal(
    await chooseRoute({ ...discounted, requestCapMicroUsd: 300 }, chat),
    null,
  );
  assert.equal(
    await chooseRoute({ ...discounted, models: ["unknown"] }, chat),
    null,
  );
});
test(
  "prepaid gateway and signed-event fulfillment use one client ledger",
  { skip: !process.env.GATEWAY_TEST_DATABASE_URL },
  async (t) => {
    process.env.GATEWAY_DATABASE_URL = process.env.GATEWAY_TEST_DATABASE_URL;
    const client = "TEST_" + randomBytes(8).toString("hex");
    const key = "cg_" + randomBytes(32).toString("base64url");
    process.env["GATEWAY_BUYER_KEY_" + client] = "dedicated-test-key";
    const sql = db();
    await sql.unsafe(
      await readFile(new URL("./schema.sql", import.meta.url), "utf8"),
    );
    await sql`INSERT INTO gateway_clients (id,policy,key_digest) VALUES (${client}, ${sql.json(policy)}, ${digest(key)})`;
    t.after(async () => {
      await sql`DELETE FROM gateway_requests WHERE client_id = ${client}`;
      await sql`DELETE FROM gateway_deposits WHERE client_id = ${client}`;
      await sql`DELETE FROM gateway_clients WHERE id = ${client}`;
      await sql.end();
    });
    const headers = { authorization: "Bearer " + key };
    const call = (nonce = randomUUID()) =>
      POST(
        new Request("http://localhost/api/gateway/v1/chat/completions", {
          method: "POST",
          headers: { ...headers, "Idempotency-Key": nonce },
          body: JSON.stringify(chat),
        }),
      );
    let status = 200;
    let cost: string | null = "100";
    let calls = 0;
    let cached: number | undefined = 0;
    let headerList: string | undefined;
    let traceCost: number | undefined;
    let traceModel = mini;
    t.mock.method(
      globalThis,
      "fetch",
      async (url: string, init?: RequestInit) => {
        if (url.endsWith("/v1/requests/private-reference")) {
          assert.equal(
            new Headers(init?.headers).get("authorization"),
            "Bearer dedicated-test-key",
          );
          return Response.json({
            request_id: "private-reference",
            provider: "openai",
            model: traceModel,
            settlement_group: "settled",
            buyer_cost_micro: 100,
            direct_cost_micro: traceCost,
          });
        }
        if (!url.endsWith("chat/completions")) return discovery(url);
        calls++;
        const body = JSON.parse(String(init?.body));
        assert.equal(body.model, mini);
        assert.equal(body.provider, "openai");
        assert.equal(
          new Headers(init?.headers).get("authorization"),
          "Bearer dedicated-test-key",
        );
        const responseHeaders = new Headers({
          "x-request-id": "private-reference",
          "x-si-trace-id": "routing-trace-not-a-billing-id",
        });
        if (headerList) responseHeaders.set("x-si-list-cost-micro", headerList);
        if (cost !== null) responseHeaders.set("x-si-buyer-cost-micro", cost);
        return Response.json(
          {
            internal: "private-reference",
            choices: [
              {
                index: 0,
                finish_reason: "stop",
                message: { role: "assistant", content: "Hello!" },
              },
            ],
            usage: {
              prompt_tokens: 1000,
              completion_tokens: 100,
              prompt_tokens_details: { cached_tokens: cached },
            },
          },
          { status, headers: responseHeaders },
        );
      },
    );
    assert.equal((await GET(new Request("http://localhost/"))).status, 401);
    assert.equal((await call()).status, 402);
    assert.equal(calls, 0);
    const event = {
      type: "checkout.session.completed",
      data: {
        object: {
          id: randomUUID(),
          mode: "payment",
          currency: "usd",
          amount_total: 5,
          payment_status: "paid",
          metadata: { product: "gateway_credit", gateway_client: client },
        },
      },
    } as unknown as Stripe.Event;
    await Promise.all([
      processGatewayPayment(event),
      processGatewayPayment(event),
    ]);
    assert.equal((await history(client)).available_micro, "50000");
    const shared = randomUUID();
    const replies = await Promise.all([call(shared), call(shared)]);
    assert.deepEqual(replies.map((r) => r.status).sort(), [200, 409]);
    const result = await replies.find((r) => r.ok)!.json();
    assert.equal(result.billing.charge_micro, 120);
    assert.equal(result.billing.savings_micro, 1080);
    assert.equal(JSON.stringify(result).includes("private-reference"), false);
    assert.equal((await history(client)).available_micro, "49880");
    await deposit(client, randomUUID(), 120);
    cost = null;
    const [a, b] = await Promise.all([call(), call()]);
    assert.deepEqual([a.status, b.status].sort(), [200, 402]);
    const pending = await (a.ok ? a : b).json();
    assert.equal(pending.billing.status, "pending");
    assert.equal((await history(client)).available_micro, "0");
    await Promise.all([finish(pending.id, 50), finish(pending.id, 50)]);
    assert.equal((await history(client)).available_micro, "49940");
    await deposit(client, randomUUID(), 60);
    status = 429;
    assert.equal((await call()).status, 502);
    assert.equal((await history(client)).available_micro, "50000");
    status = 503;
    const uncertain = await (await call()).json();
    assert.equal((await history(client)).available_micro, "0");
    await finish(uncertain.request_id, null);
    // A policy change only affects new reservations. Reconcile the pending call
    // after switching back to demonstrate that its original discount is retained.
    await sql`UPDATE gateway_clients SET policy = ${sql.json({ ...policy, listDiscountBps: 2000 })} WHERE id = ${client}`;
    status = 200;
    const deferred = await (await call()).json();
    await sql`UPDATE gateway_clients SET policy = ${sql.json(policy)} WHERE id = ${client}`;
    assert.equal((await finish(deferred.id, 100)).charge, 960);
    assert.equal((await finish(deferred.id, 100)).charge, 960);
    assert.equal((await history(client)).available_micro, "49040");
    await sql`UPDATE gateway_clients SET policy = ${sql.json({ ...policy, listDiscountBps: 2000 })} WHERE id = ${client}`;
    await deposit(client, randomUUID(), 960);
    cost = "100";
    cached = undefined;
    const incomplete = await (await call()).json();
    assert.equal(incomplete.billing.status, "pending");
    assert.equal(incomplete.billing.charge_micro, null);
    assert.equal((await finish(incomplete.id, 100)).charge, null);
    assert.equal((await history(client)).available_micro, "0");
    const corrected = {
      prompt_tokens: 1000,
      completion_tokens: 100,
      prompt_tokens_details: { cached_tokens: 1000 },
    };
    assert.equal((await finish(incomplete.id, 100, corrected)).charge, 420);
    await deposit(client, randomUUID(), 420);
    headerList = "1199";
    assert.equal((await (await call()).json()).billing.charge_micro, 959);
    await deposit(client, randomUUID(), 959);
    headerList = undefined;
    traceCost = 1199;
    traceModel = sonnet;
    const wrongTrace = await (await call()).json();
    assert.equal(wrongTrace.billing.status, "pending");
    traceModel = mini;
    const refreshed = await (
      await GET(new Request("http://localhost/", { headers }))
    ).json();
    assert.equal(
      refreshed.receipts.find((r: { id: string }) => r.id === wrongTrace.id)
        .charge_micro,
      "959",
    );
    assert.equal(refreshed.available_micro, "49041");
    await deposit(client, randomUUID(), 959);
    const matchedTrace = await (await call()).json();
    assert.equal(matchedTrace.billing.charge_micro, 959);
    assert.equal(
      matchedTrace.billing.direct_estimate.basis,
      "standard_text_upstream_list_total",
    );
    await deposit(client, randomUUID(), 959);
    traceCost = undefined;

    cached = 0;
    const settled = await (await call()).json();
    assert.equal(settled.billing.charge_micro, 960);
    assert.equal(settled.billing.status, "settled");
    assert.equal(settled.billing.savings_micro, 240);
    const grants = (["openai", "anthropic"] as const).map((provider) => ({
      provider,
      startsAt: new Date(Date.now() - 60_000).toISOString(),
      expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
      allocationMicro: 10_000_000,
      coverage: "provider_reserved_promo_only" as const,
    }));
    const creditPolicy = {
      ...policy,
      listDiscountBps: 2000,
      creditGrants: grants,
    };
    process.env["GATEWAY_OPENAI_KEY_" + client] = "test-openai";
    process.env["GATEWAY_ANTHROPIC_KEY_" + client] = "test-claude";
    assert.equal(
      creditCandidates(client, { ...creditPolicy, creditGrants: [] }, chat)
        .length,
      0,
    );
    assert.equal(
      creditCandidates(client, creditPolicy, chat, Date.now() + 90_000_000)
        .length,
      0,
    );
    assert.equal(
      creditCandidates(client, { ...creditPolicy, providers: ["other"] }, chat)
        .length,
      0,
    );
    await sql`UPDATE gateway_clients SET policy = ${sql.json(creditPolicy)} WHERE id = ${client}`;
    await deposit(client, randomUUID(), 200_000);
    const attempts: string[] = [];
    let rejected = new Set<string>();
    let ambiguous = false;
    const previousFetch = globalThis.fetch;
    t.mock.method(
      globalThis,
      "fetch",
      async (url: string, init?: RequestInit) => {
        const host = new URL(url).hostname;
        if (!["api.openai.com", "api.anthropic.com"].includes(host))
          return previousFetch(url, init);
        attempts.push(host);
        if (ambiguous) throw Error("Network timeout after sending");
        if (rejected.has(host)) return new Response(null, { status: 429 });
        const openai = host === "api.openai.com";
        const body = JSON.parse(String(init?.body));
        assert.equal(body.model, openai ? mini : "claude-sonnet-4-6");
        assert.equal(body.provider, undefined);
        assert.equal(
          body[openai ? "max_completion_tokens" : "max_tokens"],
          chat.max_tokens,
        );
        assert.equal(
          new Headers(init?.headers).get("authorization"),
          openai ? "Bearer test-openai" : "Bearer test-claude",
        );
        return Response.json({
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: { role: "assistant", content: "Hello!" },
            },
          ],
          usage: {
            prompt_tokens: 1000,
            completion_tokens: 100,
            ...(openai && { prompt_tokens_details: { cached_tokens: 0 } }),
          },
        });
      },
    );
    const creditReceipt = await (await call()).json();
    assert.equal(creditReceipt.billing.charge_micro, 960);
    assert.deepEqual(attempts, ["api.openai.com"]);
    rejected = new Set(["api.openai.com"]);
    const claudeReceipt = await (await call()).json();
    assert.equal(claudeReceipt.model, sonnet);
    assert.equal(claudeReceipt.billing.charge_micro, 3600);
    rejected.add("api.anthropic.com");
    const fallback = await (await call()).json();
    assert.equal(fallback.billing.charge_micro, 960);
    const [switched] =
      await sql`SELECT list_price FROM gateway_requests WHERE id = ${fallback.id}`;
    assert.equal(switched.list_price.creditHold, undefined);
    // The pending direct attempt consumes the last available allocation. A
    // subsequent request can still complete through the marketplace.
    const only = {
      ...grants[0],
      allocationMicro:
        creditCandidates(client, creditPolicy, chat)[0].creditHold + 1201,
    };
    await sql`UPDATE gateway_clients SET policy = ${sql.json({ ...creditPolicy, creditGrants: [only] })} WHERE id = ${client}`;
    ambiguous = true;
    const before = attempts.length;
    assert.equal((await call()).status, 503);
    assert.equal(attempts.length, before + 1);
    assert.equal((await (await call()).json()).billing.charge_micro, 960);
    assert.equal(attempts.length, before + 1);
    const haiku = "claude-haiku-5.5";
    assert.equal(
      compareUsage(
        directRate(haiku),
        {
          prompt_tokens: 1000,
          completion_tokens: 300,
          prompt_tokens_details: { cached_tokens: 0 },
        },
        2000,
      )?.listChargeMicro,
      200,
    );
    assert.equal(
      compareUsage(
        directRate(haiku),
        {
          prompt_tokens: 100001,
          completion_tokens: 300,
          prompt_tokens_details: { cached_tokens: 0 },
        },
        2000,
      )?.listChargeMicro,
      40600,
    );
    const tiers = {
      ...creditPolicy,
      models: [haiku, mini],
      monthlyLimitsMicro: {
        [haiku]: maxListCost(haiku, chat.max_tokens),
        [mini]: 5_000_000,
      },
    };
    const monthlyClient = client + "_TIERS";
    process.env["GATEWAY_ANTHROPIC_KEY_" + monthlyClient] = "test-claude";
    await sql`INSERT INTO gateway_clients (id,policy,key_digest,available_micro) VALUES
      (${monthlyClient}, ${sql.json(tiers)}, ${digest(randomUUID())}, 500000)`;
    const haikuRoute = creditCandidates(
      monthlyClient,
      { ...tiers, models: [haiku] },
      chat,
    )[0];
    const claim = () =>
      reserve(
        monthlyClient,
        tiers,
        haikuRoute,
        randomUUID(),
        undefined,
        chat.max_tokens,
      );
    const concurrent = await Promise.allSettled([claim(), claim()]);
    const winners = concurrent.filter((r) => r.status === "fulfilled");
    assert.equal(winners.length, 1);
    assert.equal(
      (await monthlyTier(sql, monthlyClient, tiers, chat.max_tokens))?.model,
      mini,
    );
    const winner = winners[0].value;
    assert.ok(winner);
    await finish(winner, null);
    assert.equal(
      (await monthlyTier(sql, monthlyClient, tiers, chat.max_tokens))?.model,
      haiku,
    );
    // Marketplace requests count against the same allowance. An ambiguous
    // response retains its hold, preventing a concurrent second admission.
    const { grant: _grant, creditHold: _hold, ...marketHaiku } = haikuRoute;
    void _grant;
    void _hold;
    const marketId = await reserve(
      monthlyClient,
      tiers,
      marketHaiku,
      randomUUID(),
      undefined,
      chat.max_tokens,
    );
    assert.ok(marketId);
    const exhausted = {
      ...tiers,
      monthlyLimitsMicro: { ...tiers.monthlyLimitsMicro, [mini]: 1 },
    };
    assert.equal(
      await monthlyTier(sql, monthlyClient, exhausted, chat.max_tokens),
      null,
    );
    await finish(marketId, 80, {
      prompt_tokens: 1000,
      completion_tokens: 300,
      prompt_tokens_details: { cached_tokens: 0 },
    });
    assert.equal(
      (await monthlyTier(sql, monthlyClient, tiers, chat.max_tokens))?.model,
      mini,
    );
    await sql`UPDATE gateway_requests SET created_at=(date_trunc('month', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC') - interval '1 second' WHERE id=${marketId}`;
    assert.equal(
      (await monthlyTier(sql, monthlyClient, tiers, chat.max_tokens))?.model,
      haiku,
    );
    await sql`DELETE FROM gateway_requests WHERE client_id=${monthlyClient}`;
    await sql`DELETE FROM gateway_clients WHERE id=${monthlyClient}`;
    const receipt = await GET(new Request("http://localhost/", { headers }));
    assert.equal(receipt.status, 200);
    assert.equal(
      JSON.stringify(await receipt.json()).includes("private-reference"),
      false,
    );
  },
);
