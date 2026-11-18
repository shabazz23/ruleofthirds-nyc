import { buildOrder, dollars, errorResponse, paypalRequest, siteOrigin } from '../../../../lib/checkout';

// Creates a PayPal order and returns the PayPal page where the shopper logs in
// and approves it. Payment is taken when they come back (see ../confirm).
export async function POST(request) {
  try {
    const { items } = await request.json();
    const order = buildOrder(items);
    const origin = siteOrigin(request);

    const { ok, data } = await paypalRequest('/v2/checkout/orders', {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: dollars(order.totalCents),
            breakdown: {
              item_total: { currency_code: 'USD', value: dollars(order.itemsCents) },
              shipping: { currency_code: 'USD', value: dollars(order.shippingCents) },
            },
          },
          items: order.lines.map(({ product, qty, unitCents }) => ({
            name: product.name.slice(0, 127),
            sku: product.id.slice(0, 127),
            quantity: String(qty),
            unit_amount: { currency_code: 'USD', value: dollars(unitCents) },
            category: 'PHYSICAL_GOODS',
          })),
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: 'Rule of Thirds',
            shipping_preference: 'GET_FROM_FILE',
            user_action: 'PAY_NOW',
            return_url: `${origin}/checkout/complete?provider=paypal`,
            cancel_url: `${origin}/shop`,
          },
        },
      },
    });

    const approve = data?.links?.find((l) => l.rel === 'payer-action' || l.rel === 'approve');
    if (!ok || !approve) {
      console.error('[checkout] paypal create failed', data);
      return Response.json({ error: 'PayPal could not start checkout. Please try again.' }, { status: 502 });
    }
    return Response.json({ url: approve.href });
  } catch (err) {
    return errorResponse(err);
  }
}
