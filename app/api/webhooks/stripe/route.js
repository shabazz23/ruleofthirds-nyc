// Stripe webhook: records paid orders.
//
// Stripe signs every webhook; the signature is verified against
// STRIPE_WEBHOOK_SECRET before anything is trusted. On
// checkout.session.completed with payment_status "paid", the order is
// recorded (idempotently — Stripe retries webhooks, and recordOrder() drops
// duplicates by provider order id).
//
// Endpoint to register in the Stripe Dashboard:
//   https://ruleofthirds.nyc/api/webhooks/stripe
// Event to listen for: checkout.session.completed

import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { metadataToLines, priceBag } from '@/lib/pricing';
import { dbConfigured } from '@/lib/db';
import { recordOrder } from '@/lib/orders';

export async function POST(req) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set.');
    return NextResponse.json(
      { error: 'Webhook not configured.' },
      { status: 500 },
    );
  }

  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    console.error('STRIPE_SECRET_KEY is not set; cannot verify webhook.');
    return NextResponse.json(
      { error: 'Payment provider not configured.' },
      { status: 500 },
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Invalid signature.' },
      { status: 400 },
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (session.payment_status === 'paid') {
      if (!dbConfigured()) {
        // Return 500 so Stripe retries once the database exists.
        console.error('POSTGRES_URL is not set; cannot record Stripe order.');
        return NextResponse.json(
          { error: 'Database not configured.' },
          { status: 500 },
        );
      }
      try {
        // Reprice the metadata items server-side; the amount Stripe
        // actually charged is the source of truth for the total.
        const priced = priceBag(metadataToLines(session.metadata?.items));
        const totalCents =
          typeof session.amount_total === 'number'
            ? session.amount_total
            : priced.totalCents;
        await recordOrder({
          userId: session.metadata?.userId || null,
          email: session.customer_details?.email ?? null,
          status: 'paid',
          provider: 'stripe',
          providerOrderId: session.id,
          providerPaymentId:
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : null,
          items: priced.lines,
          subtotalCents: priced.subtotalCents,
          shippingCents: priced.shippingCents,
          totalCents,
          currency: (session.currency || 'usd').toUpperCase(),
          shippingAddress: session.shipping_details ?? null,
        });
      } catch (err) {
        // Return 500 so Stripe retries the webhook; recording is
        // idempotent, so a retry can't double-record the order.
        console.error('Failed to record Stripe order:', err);
        return NextResponse.json(
          { error: 'Failed to record order.' },
          { status: 500 },
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
