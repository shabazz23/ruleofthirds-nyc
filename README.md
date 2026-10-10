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
