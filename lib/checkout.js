// Server-only checkout helpers. Prices always come from the product catalog
// here on the server, never from the shopper's browser, so a cart can't be
// edited to change what someone pays.
import Stripe from 'stripe';
import { PRODUCTS } from '../components/products';

const MAX_QTY = 10;

export class CheckoutError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

// Turn the cart the browser sends ([{ id, qty }]) into a priced order.
export function buildOrder(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new CheckoutError('Your bag is empty.');
  }
  const lines = [];
  for (const raw of rawItems.slice(0, 20)) {
    const product = PRODUCTS.find((p) => p.id === raw?.id);
    const qty = Number(raw?.qty);
    if (!product || typeof product.price !== 'number') {
      throw new CheckoutError('An item in your bag is no longer available.');
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      throw new CheckoutError(`Please choose between 1 and ${MAX_QTY} of each item.`);
    }
    lines.push({ product, qty, unitCents: Math.round(product.price * 100) });
  }
  // One flat shipping charge: the highest of the items' shipping costs.
  const shippingCents = Math.round(Math.max(...lines.map((l) => l.product.shippingCost || 0)) * 100);
  const itemsCents = lines.reduce((sum, l) => sum + l.unitCents * l.qty, 0);
  return { lines, shippingCents, itemsCents, totalCents: itemsCents + shippingCents };
}

export function siteOrigin(request) {
  return process.env.SITE_URL || new URL(request.url).origin;
}

export function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new CheckoutError('Card checkout is not switched on yet.', 503);
  return new Stripe(key);
}

// ---- PayPal (REST API, no PayPal script on the site) ----

function paypalBase() {
  return process.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

async function paypalToken() {
  // Either name works; the client ID isn't secret.
  const id = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new CheckoutError('PayPal checkout is not switched on yet.', 503);
  const res = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });
  if (!res.ok) throw new CheckoutError('PayPal is not responding. Please try again.', 502);
  return (await res.json()).access_token;
}

export async function paypalRequest(path, body) {
  const token = await paypalToken();
  const res = await fetch(`${paypalBase()}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export const dollars = (cents) => (cents / 100).toFixed(2);

export function errorResponse(err) {
  if (err instanceof CheckoutError) {
    return Response.json({ error: err.message }, { status: err.status });
  }
  console.error('[checkout]', err);
  return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
}
