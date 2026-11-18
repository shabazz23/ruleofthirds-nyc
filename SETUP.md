# Store setup — Rule of Thirds

The store code is built and on the `store/checkout-auth-paypal` branch:
customer sign-in (email/password + optional Google), Stripe hosted checkout
(cards, Apple Pay, Google Pay), PayPal checkout, and order history on
`/account`. This doc covers the owner-only steps that finish the launch:
the database, the API keys, and the webhooks. No code changes are needed —
everything is configured through Vercel and the payment dashboards.

After every step that adds or changes an env var in Vercel, redeploy the
site (Vercel → Deployments → ⋯ → Redeploy). Env vars only take effect on a
new deployment.

## 1. Create the database (Postgres)

1. In Vercel, open the `ruleofthirds-nyc` project → **Storage** → **Create
   Database** → **Postgres**. The free tier is enough to start. (Vercel
   provisions Prisma Postgres; the site uses the standard postgres.js
   driver, so any Postgres works.)
2. Connect it to the project when asked. Vercel automatically adds
   `POSTGRES_URL` (and related vars, including the pooled
   `POSTGRES_DATABASE_URL_POOLED` the site prefers on serverless) to the
   project's env vars — you don't need to copy anything by hand.
3. Open the database → **Query** tab, paste the contents of
   `db/schema.sql` from this repo, and run it. This creates the `users`,
   `accounts`, `sessions`, `verification_tokens`, and `orders` tables.
   (Safe to run twice — every statement is `IF NOT EXISTS`.)

## 2. Set the Vercel env vars

Vercel → Project → **Settings** → **Environment Variables**. Add each of
these for the **Production** environment (`.env.example` in the repo lists
the same names):

| Variable | Where to get it |
|---|---|
| `AUTH_SECRET` | Generate one: run `openssl rand -base64 32` in a terminal and paste the output. |
| `AUTH_URL` | Optional — only needed outside Vercel. The auth config trusts the host from the request, so leave it unset on Vercel. |
| `POSTGRES_URL` | Auto-provided by Vercel in step 1 — no action needed. |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys → **Secret key** (live, starts with `sk_live_`). |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → Webhooks — see step 3. |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal Developer Dashboard → Apps & Credentials → **Live** → the "Rule of Thirds" app → Client ID. |
| `PAYPAL_CLIENT_SECRET` | Same place → Secret. Keep it private; it never leaves the server. |
| `GOOGLE_CLIENT_ID` | Only for Google sign-in — see step 4. Leave unset for email/password only. |
| `GOOGLE_CLIENT_SECRET` | Same as above. |
| `SITE_URL` | Optional. Defaults to `https://ruleofthirds.nyc` when unset. |

## 3. Stripe webhook (so paid orders get recorded)

The site records an order only when Stripe tells it a payment completed,
via a webhook. Without this, payments still go through, but orders won't
appear on the customer's `/account` page.

1. Deploy the site first (merge this branch — Vercel auto-deploys `master`).
2. Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**.
3. Endpoint URL: `https://ruleofthirds.nyc/api/webhooks/stripe`
4. Listen for the event: `checkout.session.completed`
5. After creating it, open the endpoint and copy the **Signing secret**
   (starts with `whsec_`) into `STRIPE_WEBHOOK_SECRET` in Vercel, then
   redeploy.

Apple Pay, Google Pay, and Link need no extra setup — they come with
Stripe's hosted Checkout automatically.

## 4. PayPal credentials

1. Make sure the PayPal Business account's primary email is **confirmed**
   in PayPal — live API credentials are blocked until the email is
   confirmed.
2. Go to [developer.paypal.com](https://developer.paypal.com) and sign in
   with the PayPal Business account.
3. **Dashboard** → **Apps & Credentials** → switch from Sandbox to **Live**.
4. Open the **"Rule of Thirds"** REST API app (create it if it doesn't
   exist yet) and copy the **Client ID** and **Secret** into
   `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` in Vercel,
   then redeploy.
5. If the PayPal buttons don't appear on `/checkout`, the Client ID env
   var is missing — the page falls back to card checkout only.

## 5. Google sign-in (optional)

Skip this to offer email/password sign-in only.

1. [Google Cloud Console](https://console.cloud.google.com) → create a
   project (or reuse one) → **APIs & Services** → **Credentials** →
   **Create Credentials** → **OAuth client ID** → **Web application**.
2. Authorized redirect URI:
   `https://ruleofthirds.nyc/api/auth/callback/google`
3. Copy the **Client ID** and **Client secret** into `GOOGLE_CLIENT_ID`
   and `GOOGLE_CLIENT_SECRET` in Vercel, then redeploy. The "Continue with
   Google" button appears on the sign-in and sign-up pages.

## 6. Smoke test (after the redeploy)

1. Sign up at `https://ruleofthirds.nyc/signup`, then check `/account`
   loads and shows your email.
2. Add the hat to the bag and go to `/checkout`. Pay with a card via
   Stripe (use a real card for a live test — this is live mode, so a test
   purchase charges you and needs a refund in the Stripe Dashboard), then
   confirm the order appears on `/account` and in Stripe Dashboard →
   Payments.
3. Repeat with PayPal and confirm the order appears in PayPal →
   Activity and on `/account`.
4. Stripe Dashboard → Developers → Webhooks → the endpoint should show a
   `200` response for `checkout.session.completed`.

## How orders work

- **Stripe**: the customer pays on Stripe's hosted Checkout page. Stripe
  then calls the webhook, which records the order as paid. Refunds are
  handled in the Stripe Dashboard (the site doesn't change the order row).
- **PayPal**: the customer approves in the PayPal popup; the site captures
  the payment server-side and records the order. Refunds are handled in
  PayPal → Activity.
- **Guest checkout** is allowed. Signed-in customers see their orders on
  `/account`; guests get the email receipt from Stripe/PayPal.
- **Shipping**: US only, flat $6.99 per order (Stripe is configured with
  `allowed_countries: ['US']` in `app/api/checkout/stripe/route.js`).
  Prices and shipping live in one place — `components/products.js` — and
  the server reprices every bag from it, so the site never trusts a price
  from the browser.

## Troubleshooting

- **"POSTGRES_URL is not set" / sign-in fails**: the database isn't linked
  to the project, or `db/schema.sql` hasn't been run yet.
- **Stripe checkout fails to start**: `STRIPE_SECRET_KEY` is missing or is
  a test key (`sk_test_…`) — the live site needs the live key.
- **Orders paid but missing from /account**: the webhook isn't registered
  (step 3) or `STRIPE_WEBHOOK_SECRET` is wrong — check the webhook's
  recent deliveries in the Stripe Dashboard.
- **PayPal buttons missing**: `NEXT_PUBLIC_PAYPAL_CLIENT_ID` isn't set, or
  the site wasn't redeployed after setting it.
- **Google button missing**: both Google env vars must be set, then
  redeploy. If Google errors on sign-in, check the redirect URI in step 5
  matches exactly.
