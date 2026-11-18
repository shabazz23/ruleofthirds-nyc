import { buildOrder, errorResponse, siteOrigin, stripeClient } from '../../../../lib/checkout';

// Starts a Stripe Checkout session and returns the address of Stripe's secure
// payment page. Stripe shows cards, Apple Pay, Google Pay and Link there,
// based on what's switched on in the Stripe Dashboard.
export async function POST(request) {
  try {
    const { items } = await request.json();
    const order = buildOrder(items);
    const origin = siteOrigin(request);
    const stripe = stripeClient();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: order.lines.map(({ product, qty, unitCents }) => ({
        quantity: qty,
        price_data: {
          currency: 'usd',
          unit_amount: unitCents,
          product_data: {
            name: product.name,
            description: [
              product.detail,
              product.color,
              product.preorder ? `Preorder, ships in ${product.shipWindow || 'a few weeks'}` : null,
            ]
              .filter(Boolean)
              .join(' · '),
            images: product.image ? [`${origin}${product.image}`] : undefined,
            metadata: { product_id: product.id },
          },
        },
      })),
      shipping_address_collection: { allowed_countries: ['US'] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: 'Standard shipping',
            fixed_amount: { amount: order.shippingCents, currency: 'usd' },
          },
        },
      ],
      phone_number_collection: { enabled: false },
      custom_text: {
        submit: {
          message: `By placing your order you agree to our Terms of Service and Refund Policy at ${origin}/terms.`,
        },
      },
      success_url: `${origin}/checkout/complete?provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    return errorResponse(err);
  }
}
