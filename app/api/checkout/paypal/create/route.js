// PayPal checkout, step 1: creates a PayPal order (Orders API v2, intent
// CAPTURE) for the bag. The bag is repriced server-side from
// components/products.js — the client only sends item ids and quantities.
// The returned order id is handed to the PayPal JS SDK button on the
// checkout page; the actual capture happens in /capture after the buyer
// approves.

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { paypalRequest } from '@/lib/paypal';
import { centsToDollars, priceBag } from '@/lib/pricing';

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
    const order = await paypalRequest('/v2/checkout/orders', {
      method: 'POST',
      body: {
        intent: 'CAPTURE',
        purchase_units: [
          {
            // Carries the signed-in user id through to the capture step so
            // the order can be attached to their account. Omitted for
            // guest checkouts.
            ...(session?.user?.id ? { custom_id: session.user.id } : {}),
            amount: {
              currency_code: 'USD',
              value: centsToDollars(priced.totalCents),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: centsToDollars(priced.subtotalCents),
                },
                shipping: {
                  currency_code: 'USD',
                  value: centsToDollars(priced.shippingCents),
                },
              },
            },
            // Products only: PayPal requires item_total to equal the sum of
            // the items, and shipping is carried separately in the
            // breakdown below — not as an item.
            items: priced.lines.map((line) => ({
              name: line.name,
              description: line.detail,
              quantity: String(line.qty),
              unit_amount: {
                currency_code: 'USD',
                value: centsToDollars(line.unitCents),
              },
            })),
          },
        ],
        application_context: {
          brand_name: 'Rule of Thirds',
          user_action: 'PAY_NOW',
        },
      },
    });
    return NextResponse.json({ id: order.id });
  } catch (err) {
    console.error('PayPal order creation failed:', err);
    return NextResponse.json(
      { error: 'Could not start PayPal checkout. Please try again.' },
      { status: 500 },
    );
  }
}
