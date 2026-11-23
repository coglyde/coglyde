import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import type Stripe from "stripe";
import { POST } from "../../src/app/api/gateway/v1/chat/completions/route";
import { GET } from "../../src/app/api/gateway/v1/usage/route";
import { chooseRoute } from "../../src/lib/gateway/market";
import {
  chatSchema,
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
} from "../../src/lib/gateway/ledger";
import { processGatewayPayment } from "../../src/lib/gateway/stripe";
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
    t.mock.method(
      globalThis,
      "fetch",
      async (url: string, init?: RequestInit) => {
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
        });
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
    cached = 0;
    const settled = await (await call()).json();
    assert.equal(settled.billing.charge_micro, 960);
    assert.equal(settled.billing.status, "settled");
    assert.equal(settled.billing.savings_micro, 240);
    const receipt = await GET(new Request("http://localhost/", { headers }));
    assert.equal(receipt.status, 200);
    assert.equal(
      JSON.stringify(await receipt.json()).includes("private-reference"),
      false,
    );
  },
);
