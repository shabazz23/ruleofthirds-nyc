// PayPal checkout, step 2: captures an approved PayPal order and records
// it as a paid order. Called by the PayPal button on the checkout page
// after the buyer approves. The amounts recorded come from PayPal's
// capture response — the order itself was priced server-side at creation,
// so what PayPal captured is what the bag cost.

import { NextResponse } from 'next/server';
import { paypalRequest } from '@/lib/paypal';
import { dbConfigured } from '@/lib/db';
import { recordOrder } from '@/lib/orders';

function dollarsToCents(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const orderId = typeof body?.orderID === 'string' ? body.orderID : '';
  if (!orderId) {
    return NextResponse.json({ error: 'Missing PayPal order id.' }, { status: 400 });
  }

  try {
    const captured = await paypalRequest(
      `/v2/checkout/orders/${orderId}/capture`,
      { method: 'POST', body: {} },
    );

    if (captured.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: `PayPal payment did not complete (status: ${captured.status}).` },
        { status: 402 },
      );
    }

    const unit = captured.purchase_units?.[0] ?? {};
    const capture = unit.payments?.captures?.[0] ?? {};
    const breakdown = unit.amount?.breakdown ?? {};

    if (!dbConfigured()) {
      // The payment went through at PayPal, but there is nowhere to record
      // it — fail loudly so the owner notices, rather than silently losing
      // the order. The capture can be found in PayPal → Activity.
      console.error('POSTGRES_URL is not set; cannot record PayPal order.', {
        paypalOrderId: captured.id,
        captureId: capture.id,
      });
      return NextResponse.json(
        { error: 'Payment captured, but the store database is not set up to record it. Please contact us with your PayPal order id.' },
        { status: 500 },
      );
    }

    try {
      await recordOrder({
        userId: unit.custom_id || null,
        email: captured.payer?.email_address ?? null,
        status: 'paid',
        provider: 'paypal',
        providerOrderId: captured.id,
        providerPaymentId: capture.id ?? null,
        items: (unit.items ?? []).map((item) => ({
          name: item.name,
          qty: Number(item.quantity) || 1,
          unitCents: dollarsToCents(item.unit_amount?.value),
        })),
        subtotalCents: dollarsToCents(breakdown.item_total?.value),
        shippingCents: dollarsToCents(breakdown.shipping?.value),
        totalCents: dollarsToCents(capture.amount?.value ?? unit.amount?.value),
        currency: capture.amount?.currency_code || 'USD',
        shippingAddress: unit.shipping ?? null,
      });
    } catch (recordErr) {
      // The money already moved at PayPal — a second capture attempt would
      // be rejected, so never tell the customer to retry. Log loudly so
      // the owner can reconcile from PayPal → Activity.
      console.error('PayPal payment captured but order could not be recorded:', recordErr, {
        paypalOrderId: captured.id,
        captureId: capture.id,
      });
      return NextResponse.json(
        { error: `Payment captured, but the order could not be saved (PayPal order ${captured.id}). Please contact us with that order id — do not try paying again.` },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, orderId: captured.id });
  } catch (err) {
    console.error('PayPal capture failed:', err);
    return NextResponse.json(
      { error: 'Could not complete the PayPal payment. Please try again.' },
      { status: 500 },
    );
  }
}
