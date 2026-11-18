-- Rule of Thirds store — database tables.
--
-- Run this once in the Vercel Postgres dashboard (Storage → your database →
-- Query tab), or with any Postgres client pointed at POSTGRES_URL.
-- It is safe to run twice: every statement is IF NOT EXISTS.
--
-- Keep in sync with lib/schema.js (the drizzle schema the site code uses).
-- Columns are snake_case in Postgres; drizzle maps them to camelCase in JS.

CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text UNIQUE,
  email_verified timestamptz,
  image text,
  -- bcrypt hash for email/password sign-in; NULL for Google-only accounts.
  password_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- OAuth accounts linked to a user (one row per provider, e.g. Google).
CREATE TABLE IF NOT EXISTS accounts (
  user_id text NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  type text NOT NULL,
  provider text NOT NULL,
  provider_account_id text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at integer,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  PRIMARY KEY (provider, provider_account_id)
);

-- Database sessions (kept for Auth.js completeness; the site uses JWT
-- sessions, so this table stays empty in practice).
CREATE TABLE IF NOT EXISTS sessions (
  session_token text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  expires timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier text NOT NULL,
  token text NOT NULL,
  expires timestamptz NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- One row per completed purchase. provider_order_id is the Stripe Checkout
-- Session id or the PayPal order id; it is unique so webhook/capture
-- retries cannot double-record an order. user_id is NULL for guest
-- checkouts.
CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text REFERENCES users (id) ON DELETE SET NULL,
  email text,
  status text NOT NULL DEFAULT 'paid',
  provider text NOT NULL,
  provider_order_id text NOT NULL UNIQUE,
  provider_payment_id text,
  items jsonb NOT NULL,
  subtotal_cents integer NOT NULL,
  shipping_cents integer NOT NULL,
  total_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  shipping_address jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders (user_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);
