import { errorResponse, paypalRequest, stripeClient } from '../../../../lib/checkout';

// Called by the "thank you" page. For Stripe it checks the session was paid;
// for PayPal it takes the approved payment (PayPal calls this "capture").
export async function POST(request) {
  try {
    const { provider, id } = await request.json();
    if (typeof id !== 'string' || !/^[A-Za-z0-9_-]{5,255}$/.test(id)) {
      return Response.json({ paid: false }, { status: 400 });
    }

    if (provider === 'stripe') {
      const session = await stripeClient().checkout.sessions.retrieve(id);
      const paid = session.payment_status === 'paid' || session.payment_status === 'no_payment_required';
      return Response.json({ paid });
    }

    if (provider === 'paypal') {
      const { ok, data } = await paypalRequest(`/v2/checkout/orders/${id}/capture`);
      // A repeat visit to the page finds the order already captured: still paid.
      const already = data?.details?.some((d) => d.issue === 'ORDER_ALREADY_CAPTURED');
      const paid = (ok && data?.status === 'COMPLETED') || Boolean(already);
      if (!paid) console.error('[checkout] paypal capture failed', data);
      return Response.json({ paid });
    }

    return Response.json({ paid: false }, { status: 400 });
  } catch (err) {
    return errorResponse(err);
  }
}
