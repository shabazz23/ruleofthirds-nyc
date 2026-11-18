// Stripe Checkout: creates a hosted Checkout Session for the bag.
//
// The bag is repriced server-side from components/products.js — the client
// only sends item ids and quantities, never prices. Apple Pay, Google Pay,
// and Link come free with hosted Checkout; no separate wallet integration.
//
// Guest checkout is allowed; when a customer is signed in, their id and
// email ride along in the session metadata so the webhook can attach the
// order to their account.

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getStripe } from '@/lib/stripe';
import {
  SHIPPING_LINE_NAME,
  linesToMetadata,
  priceBag,
} from '@/lib/pricing';

const SITE_URL = process.env.SITE_URL || 'https://ruleofthirds.nyc';

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  let priced;
  try {
    priced = priceBag(body?.items);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  if (priced.count === 0) {
    return NextResponse.json({ error: 'Your bag is empty.' }, { status: 400 });
  }

  try {
    const session = await auth();
    const stripe = getStripe();

    const lineItems = priced.lines.map((line) => ({
      quantity: line.qty,
      price_data: {
        currency: 'usd',
        unit_amount: line.unitCents,
        product_data: {
          name: line.name,
          description: line.detail,
        },
      },
    }));
    if (priced.shippingCents > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: priced.shippingCents,
          product_data: { name: SHIPPING_LINE_NAME },
        },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${SITE_URL}/checkout/success?provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout`,
      shipping_address_collection: { allowed_countries: ['US'] },
      ...(session?.user?.email
        ? { customer_email: session.user.email }
        : {}),
      metadata: {
        ...(session?.user?.id ? { userId: session.user.id } : {}),
        items: linesToMetadata(priced.lines),
        subtotalCents: String(priced.subtotalCents),
        shippingCents: String(priced.shippingCents),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error('Stripe checkout failed:', err);
    return NextResponse.json(
      { error: 'Could not start checkout. Please try again.' },
      { status: 500 },
    );
  }
}
