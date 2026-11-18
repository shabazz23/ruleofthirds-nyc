// Stripe session lookup for the success page: confirms a Checkout Session
// is paid and returns just enough to show the confirmation (email, amount,
// status). The session id is a random value only the buyer has, so looking
// it up here is safe.

import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function GET(req) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  if (!sessionId || !sessionId.startsWith('cs_')) {
    return NextResponse.json({ error: 'Missing session id.' }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      email: session.customer_details?.email ?? null,
      amountTotal: session.amount_total,
      currency: session.currency,
      paymentStatus: session.payment_status,
      status: session.status,
    });
  } catch (err) {
    console.error('Stripe session lookup failed:', err);
    return NextResponse.json(
      { error: 'Could not find that checkout session.' },
      { status: 404 },
    );
  }
}
