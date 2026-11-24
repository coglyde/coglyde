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
ALTER TABLE gateway_requests ADD COLUMN IF NOT EXISTS list_price jsonb;
CREATE INDEX IF NOT EXISTS gateway_history ON gateway_requests(client_id, created_at DESC);
-- Original installation keys remain valid until their owner revokes them.
ALTER TABLE gateway_clients ALTER COLUMN key_digest DROP NOT NULL;
CREATE TABLE IF NOT EXISTS gateway_workspaces (
  client_id text PRIMARY KEY REFERENCES gateway_clients(id),
  display_name text NOT NULL,
  owner_email text NOT NULL UNIQUE CHECK (owner_email = lower(owner_email)),
  owner_user_id text UNIQUE,
  purchases_enabled boolean NOT NULL DEFAULT false
);
CREATE TABLE IF NOT EXISTS gateway_keys (
  id uuid PRIMARY KEY,
  client_id text NOT NULL REFERENCES gateway_clients(id),
  name text NOT NULL,
  key_digest text NOT NULL UNIQUE,
  suffix text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);
CREATE INDEX IF NOT EXISTS gateway_active_keys ON gateway_keys(client_id) WHERE revoked_at IS NULL;
COMMIT;
