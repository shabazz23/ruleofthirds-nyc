// Shared pricing — the single source of truth for what the bag costs.
//
// Prices and shipping always come from components/products.js; the client
// never decides what anything costs. Both the checkout page (for display)
// and the API routes (for charging) call priceBag() with item ids and
// quantities, so the amount a customer sees is the amount they are charged.
//
// Shipping mirrors the bag drawer: one flat rate per order, the highest
// shippingCost among the items in the bag.

import { PRODUCTS } from '../components/products';

// Name of the shipping line item sent to Stripe / PayPal.
export const SHIPPING_LINE_NAME = 'Shipping — flat rate';

export function priceBag(items) {
  const lines = [];
  let subtotalCents = 0;
  let shippingCents = 0;

  for (const item of items ?? []) {
    const product = PRODUCTS.find((p) => p.id === item?.id);
    const qty = Math.max(0, Math.floor(Number(item?.qty) || 0));
    if (!product || qty === 0) continue;
    if (typeof product.price !== 'number') {
      throw new Error(`"${product.name}" has no price yet, so it can't be checked out.`);
    }
    const unitCents = Math.round(product.price * 100);
    subtotalCents += unitCents * qty;
    shippingCents = Math.max(
      shippingCents,
      Math.round((product.shippingCost || 0) * 100),
    );
    lines.push({
      id: product.id,
      name: product.name,
      detail: product.detail,
      unitCents,
      qty,
      lineCents: unitCents * qty,
    });
  }

  return {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
  };
}

// Compact "id:qty,id:qty" form, for Stripe Checkout metadata.
export function linesToMetadata(lines) {
  return lines.map((l) => `${l.id}:${l.qty}`).join(',');
}

export function metadataToLines(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((part) => {
      const [id, qty] = part.split(':');
      return { id, qty: Number(qty) || 0 };
    })
    .filter((l) => l.id && l.qty > 0);
}

// Dollars with two decimals, as PayPal's API expects ("56.99").
export function centsToDollars(cents) {
  return (cents / 100).toFixed(2);
}
