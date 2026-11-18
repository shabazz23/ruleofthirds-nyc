# Rule of Thirds — ruleofthirds.nyc

Next.js (App Router) site for the **Rule of Thirds** creative platform: portfolio,
shop (preorder merch), and the **Golden Hour Loft** Brooklyn production studio.

## Pages

- `/` — Home: hero, intro, featured preorder hat, Golden Hour Loft feature
- `/about` — About the studio + full Golden Hour Loft section (space cards, Peerspace booking)
- `/gallery` — Placeholder ("A collection in progress")
- `/shop` — Objects / Shop: embroidered hat preorder (checkout wired later via Shopify)
- `/contact` — Contact form (goes live with the store launch)

## Commerce status

- Client-side bag (add / quantity / remove, persisted to localStorage) is fully working.
- Checkout is **disabled** until the Shopify store exists — the drawer says so honestly.
- Product data lives in `components/products.js` (`price: null` renders as "TBA").
- To go live: create the Shopify store, then wire checkout (Storefront API or Buy Button)
  and flip the drawer button.

## Still TBD (owner)

- Hat price, colors, product photos, preorder shipping window
- Business email + social links
- Real legal policies (Shipping & Returns, Preorder Policy, Privacy, Terms) — footer
  lists them as plain text until real policies exist. No placeholders.

## Develop

```bash
npm install
npm run dev
```

Deploy: push to `master` → Vercel auto-deploys. Custom domain: `ruleofthirds.nyc`
(A record `@ → 216.198.79.1` at Namecheap; `www` per Vercel's requested record).

## Images

Studio photography in `public/images/` (optimized full + `-sm` variants).
Only original/user-supplied photos are used.

## Checkout (Stripe + PayPal)

The bag sends product ids and quantities to `/api/checkout/stripe` or
`/api/checkout/paypal`; the server prices the order from `components/products.js`
and redirects to Stripe's or PayPal's hosted payment page (no payment scripts run
on this site, so the CSP is unchanged). `/checkout/complete` confirms the payment
(Stripe: session paid; PayPal: capture) and empties the bag.

Environment variables (set in Vercel, never committed):

| Name | Value |
| --- | --- |
| `STRIPE_SECRET_KEY` | `sk_test_…` for testing, `sk_live_…` when live |
| `PAYPAL_CLIENT_ID` | PayPal REST app client ID |
| `PAYPAL_CLIENT_SECRET` | PayPal REST app secret |
| `PAYPAL_ENV` | `sandbox` for testing, `live` when live |
| `SITE_URL` (optional) | e.g. `https://ruleofthirds.nyc` |
