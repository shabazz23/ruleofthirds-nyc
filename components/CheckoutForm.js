// Checkout: order summary + payment choice.
//
// The bag is priced with the shared priceBag() helper (same numbers the
// server charges), and only item ids + quantities are sent to the API
// routes — prices are never trusted from the client.
//
// - Card / Apple Pay / Google Pay: Stripe hosted Checkout (redirect).
// - PayPal: PayPal JS SDK buttons, created + captured through our API.
// Sign-in is optional: guests can check out, and signed-in customers get
// the order attached to their account.
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useCart } from './cart';
import { formatPrice } from './format';
import { priceBag } from '../lib/pricing';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export default function CheckoutForm() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { data: session } = useSession();
  const [stripeBusy, setStripeBusy] = useState(false);
  const [error, setError] = useState('');

  const priced = useMemo(
    () => priceBag(items.map((i) => ({ id: i.id, qty: i.qty }))),
    [items],
  );
  const bagItems = useMemo(
    () => items.map((i) => ({ id: i.id, qty: i.qty })),
    [items],
  );

  const handleStripe = async () => {
    setError('');
    setStripeBusy(true);
    try {
      const res = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: bagItems }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setError(data.error || 'Could not start checkout.');
        setStripeBusy(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Could not start checkout. Please try again.');
      setStripeBusy(false);
    }
  };

  const createPayPalOrder = async () => {
    const res = await fetch('/api/checkout/paypal/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: bagItems }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.id) {
      throw new Error(data.error || 'Could not start PayPal checkout.');
    }
    return data.id;
  };

  const capturePayPalOrder = async (data) => {
    const res = await fetch('/api/checkout/paypal/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderID: data.orderID }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.error || 'Could not complete the PayPal payment.');
    }
    clearCart();
    router.push(`/checkout/success?provider=paypal&order=${data.orderID}`);
  };

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <p className="lede">Your bag is empty.</p>
        <Link className="btn" href="/shop" style={{ marginTop: '1.5rem' }}>
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-grid">
      <section className="order-summary" aria-label="Order summary">
        <h2>Your order</h2>
        {priced.lines.map((line) => (
          <div className="cart-row cart-row-sub" key={line.id}>
            <span>
              {line.name} × {line.qty}
            </span>
            <span>{formatPrice(line.lineCents / 100)}</span>
          </div>
        ))}
        <div className="cart-row cart-row-sub">
          <span>Shipping</span>
          <span>{formatPrice(priced.shippingCents / 100)}</span>
        </div>
        <div className="cart-row">
          <span>Total</span>
          <span>{formatPrice(priced.totalCents / 100)}</span>
        </div>
        <p className="form-note">
          Preorder — ships in 7 days. US shipping only for now.
        </p>
      </section>

      <section className="payment-choice" aria-label="Payment">
        {!session?.user && (
          <p className="form-note" style={{ marginTop: 0 }}>
            Checking out as a guest.{' '}
            <Link href="/signin?callbackUrl=/checkout">Sign in</Link> to keep
            this order on your account.
          </p>
        )}
        {session?.user && (
          <p className="form-note" style={{ marginTop: 0 }}>
            Signed in as {session.user.email}. This order will be saved to
            your account.
          </p>
        )}

        {error && (
          <p className="form-note form-error" role="alert">
            {error}
          </p>
        )}

        <h2>Pay with card</h2>
        <p className="form-note" style={{ marginTop: 0 }}>
          Cards, Apple Pay, and Google Pay — securely through Stripe.
        </p>
        <button
          className="btn"
          type="button"
          onClick={handleStripe}
          disabled={stripeBusy}
          style={{ width: '100%' }}
        >
          {stripeBusy ? 'Starting secure checkout…' : 'Pay with Card / Apple Pay'}
        </button>

        <p className="auth-divider">
          <span>or</span>
        </p>

        <h2>Pay with PayPal</h2>
        {PAYPAL_CLIENT_ID ? (
          <PayPalScriptProvider
            options={{
              clientId: PAYPAL_CLIENT_ID,
              currency: 'USD',
              intent: 'capture',
              components: 'buttons',
            }}
          >
            <PayPalButtons
              style={{ layout: 'vertical', shape: 'pill', label: 'paypal' }}
              createOrder={createPayPalOrder}
              onApprove={capturePayPalOrder}
              onError={(err) => {
                console.error('PayPal error:', err);
                setError(
                  err?.message ||
                    'Something went wrong with PayPal. Please try again.',
                );
              }}
            />
          </PayPalScriptProvider>
        ) : (
          <p className="form-note">
            PayPal checkout is being set up — please pay by card for now.
          </p>
        )}
      </section>
    </div>
  );
}
