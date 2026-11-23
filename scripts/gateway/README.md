# Coglyde inference gateway

The server API lives at `/api/gateway/v1`. The pilot supports non-streaming text chat and function calls. The caller executes any proposed tool under its own user permissions. Each client has a prepaid USD balance, a Coglyde bearer key, a dedicated upstream credential and a routing policy.

## Configure a client

1. Set the server-only `GATEWAY_DATABASE_URL` to a dedicated PostgreSQL database and run `npm run gateway:admin -- migrate` with that environment. Set `GATEWAY_MARKETPLACE_ORIGIN` to the HTTPS API origin of the connected marketplace.
2. Provision an upstream buyer key dedicated to the client. Set its trusted-provider and model/provider scope to the client’s policy, set a hard upstream budget, and use a workspace without priority or fallback keys. Store the credential in the server secret named `GATEWAY_BUYER_KEY_<CLIENT_ID>`.
3. Copy and adjust `pilot.json`. Its prices, markup and limits are example settings. Set optional `listDiscountBps` to bill a discount from the selected model’s published standard API price (2000 gives 20% off). Models without a listed rate are ineligible for this policy. The markup and discount use basis points and the per-request ceiling uses millionths of a US dollar. Use `lowest_cost` or `largest_discount`.
4. Run `npm run --silent gateway:admin -- create PILOT_CLIENT path/to/policy.json` in a secure terminal. It prints the customer key once. Put it in the calling server’s secret store. Use the `policy` command with the same arguments to change the policy. In an incident an operator can disable that account using `gateway_clients.enabled`.
5. For credit purchases configure the existing Stripe secret, webhook signing secret and public site URL. Register the signed webhook at `/api/stripe/webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Test in a Stripe sandbox before enabling purchases. Operators handle refunds and disputes manually during the pilot and should disable spending on a disputed account until reconciled.

## Customer API

Authenticate every request with a Coglyde bearer key. Supply a unique `Idempotency-Key` header on POST. The key is an opaque request identifier and appears in receipts. Use a UUID.

- `POST /top-ups` accepts `{"usd_cents":2500}` and returns a hosted checkout URL. Credit becomes available once the signed webhook confirms payment.
- `POST /chat/completions` accepts the request below. The gateway checks the live catalog and healthy offers, filters by client policy, estimates input tokens from the payload and uses the specified output budget to rank eligible offers. The selected provider and minimum discount are also sent with the inference request. Quotes may move before execution. A successful response includes the selected model, choices, usage and a billing receipt.
- `GET /usage` returns available credit and the latest 100 receipts. Pending requests retain their maximum charge until reconciled. The database retains the full history. Repeating an accepted inference nonce returns a conflict rather than generating a second answer. Use the receipt to check the first request.

```json
{
  "model": "coglyde-auto",
  "messages": [{ "role": "user", "content": "Summarize these notes in two sentences." }],
  "max_tokens": 128
}
```

## Settlement and comparisons

Each accepted request temporarily reserves the client's full per-request ceiling. List-price accounts pay the model’s published rate for the reported input, cached-read and output token mix, less their discount. The gateway snapshots the rate and discount when it reserves credit, rounds the final total to the nearest micro-USD, and caps it at the hold. Other accounts pay the authoritative upstream cost plus their configured markup, also capped at the hold. Any excess upstream cost is borne by Coglyde. The customer sees the final charge in micro-USD. Ledger rows store usage, routing and settlement metadata. Prompts and outputs are excluded.

For models covered by the versioned direct rate table, usage receipts include a standard synchronous text API estimate for the same model and reported token mix. Savings are the signed difference from the customer charge, after markup. A missing comparable price or cached-token breakdown leaves the comparison empty. Review the official linked rate cards when pricing changes. Custom contracts, batch discounts and non-text services require separate comparisons.

With missing cost, timeouts, or an ambiguous failure, `npm run gateway:admin -- pending` lists holds and known upstream references. Match the dedicated buyer key’s authoritative request record before using `settle <request-uuid> <actual-micro-usd>` or `release <request-uuid>`. Repeating the same settlement or webhook is safe. For list-price holds missing metering, append a usage JSON filename to the settle command. Include verified `prompt_tokens`, `completion_tokens`, and `prompt_tokens_details.cached_tokens`. Missing data keeps the request pending. Never infer zero from an absent charge.

## Verification

Run `npm run test:gateway`. Set `GATEWAY_TEST_DATABASE_URL` to a disposable PostgreSQL database to include concurrent funding, tenant accounting, retry, and HTTP handler integration tests. Requests to model providers are stubbed in the tests.

## Subscription credit routing

A list-price client can use a dedicated OpenAI or Anthropic project credential from
`GATEWAY_OPENAI_KEY_<CLIENT_ID>` or `GATEWAY_ANTHROPIC_KEY_<CLIENT_ID>`.
Leave `creditGrants` absent for a shared billing account that can draw on purchased
funds. A positive dashboard balance, a monthly subscription, and a project spend
alert do not guarantee promotional coverage. A protected upstream allocation must
exclude purchased funds and leave the other applications' reserve available.
Configure a given allocation for only one client.

After confirming those conditions with the provider, use the existing policy
command to record a `creditGrants` entry with `provider` (`openai` or `anthropic`),
`startsAt` and `expiresAt` (UTC grant boundaries), `allocationMicro` (only the
portion reserved for this client), and `coverage: "provider_reserved_promo_only"`.
Review a newly issued grant before updating its dates and amount. Keep the original
start date when reducing an existing allocation. The gateway never creates a
renewal based solely on the calendar.

Requests first try authorized credit routes in estimated customer-price order.
Each in-flight call reserves a conservative provider-cost ceiling. Settled calls
consume their metered direct price rounded up conservatively. Remaining allowance,
expiry, missing keys or an explicit upstream capacity/credential refusal can move
a request to the next route, then the marketplace. Timeouts keep the original
reservation for reconciliation. Customer pricing uses the same list-price snapshot
on either path. A zero upstream cash cost on a covered request still consumes
provider credit.
