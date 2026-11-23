BEGIN;
CREATE TABLE IF NOT EXISTS gateway_clients (
  id text PRIMARY KEY,
  key_digest text NOT NULL UNIQUE,
  policy jsonb NOT NULL,
  available_micro bigint NOT NULL DEFAULT 0 CHECK (available_micro >= 0),
  enabled boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS gateway_deposits (
  reference text PRIMARY KEY,
  client_id text NOT NULL REFERENCES gateway_clients,
  amount_micro bigint NOT NULL CHECK (amount_micro > 0)
);
CREATE TABLE IF NOT EXISTS gateway_requests (
  id uuid PRIMARY KEY,
  client_id text NOT NULL REFERENCES gateway_clients,
  nonce text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  model text NOT NULL,
  provider text NOT NULL,
  hold_micro integer NOT NULL CHECK (hold_micro > 0),
  markup_bps integer NOT NULL,
  upstream_reference text,
  upstream_micro bigint,
  charge_micro bigint,
  input_tokens integer,
  output_tokens integer,
  comparison jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','settled','released')),
  UNIQUE(client_id, nonce)
);
CREATE INDEX IF NOT EXISTS gateway_history ON gateway_requests(client_id, created_at DESC);
COMMIT;
