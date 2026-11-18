// Stripe client for the website checkout. Server-only.
//
// This uses the site's own Stripe secret key from Vercel env vars
// (STRIPE_SECRET_KEY) — it is unrelated to Muse's Stripe connector, which
// manages the merchant account but never touches website checkout.

import Stripe from 'stripe';

let client = null;

export function getStripe() {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        'STRIPE_SECRET_KEY is not set. Add it in Vercel (see SETUP.md).',
      );
    }
    client = new Stripe(key);
  }
  return client;
}
