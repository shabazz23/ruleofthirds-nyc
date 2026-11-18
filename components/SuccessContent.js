// Order confirmation. Reads the provider + order/session id from the URL
// (behind a Suspense boundary in the page, per the useSearchParams rule).
//
// - Stripe: the session id is looked up server-side; the bag is only
//   cleared once Stripe confirms the payment, so a failed lookup leaves
//   the bag intact for a retry.
// - PayPal: the capture already succeeded before redirecting here, so the
//   bag is cleared on arrival.
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from './cart';
import { formatPrice } from './format';

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const provider = searchParams.get('provider');
  const sessionId = searchParams.get('session_id');
  const paypalOrder = searchParams.get('order');
  const [stripeInfo, setStripeInfo] = useState(null);
  const [stripeError, setStripeError] = useState('');
  const cleared = useRef(false);

  useEffect(() => {
    if (provider === 'paypal' && paypalOrder) {
      if (!cleared.current) {
        cleared.current = true;
        clearCart();
      }
      return;
    }
    if (provider === 'stripe' && sessionId) {
      let cancelled = false;
      fetch(
        `/api/checkout/stripe/session?session_id=${encodeURIComponent(sessionId)}`,
      )
        .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
          if (cancelled) return;
          if (!ok) {
            setStripeError(
              data.error || 'We couldn’t confirm your order.',
            );
            return;
          }
          setStripeInfo(data);
          if (data.paymentStatus === 'paid' && !cleared.current) {
            cleared.current = true;
            clearCart();
          }
        })
        .catch(() => {
          if (!cancelled) {
            setStripeError('We couldn’t confirm your order.');
          }
        });
      return () => {
        cancelled = true;
      };
    }
  }, [provider, sessionId, paypalOrder, clearCart]);

  if (provider === 'paypal' && paypalOrder) {
    return (
      <div className="form-done">
        <h3>Your order is confirmed.</h3>
        <p>
          PayPal order {paypalOrder}. A confirmation email is on its way, and
          your preorder ships in 7 days.
        </p>
        <p style={{ marginTop: '1.5rem' }}>
          <Link className="btn" href="/account">
            View your orders
          </Link>{' '}
          <Link className="btn btn-ghost" href="/shop">
            Keep shopping
          </Link>
        </p>
      </div>
    );
  }

  if (provider === 'stripe' && sessionId) {
    if (stripeError) {
      return (
        <div className="form-done">
          <h3>We couldn’t confirm this order.</h3>
          <p>
            {stripeError} If you were charged, your order was still recorded —
            check your email for the confirmation, or{' '}
            <Link href="/contact">get in touch</Link>.
          </p>
          <p style={{ marginTop: '1.5rem' }}>
            <Link className="btn" href="/account">
              View your orders
            </Link>
          </p>
        </div>
      );
    }
    if (!stripeInfo) {
      return <p className="lede">Confirming your payment…</p>;
    }
    if (stripeInfo.paymentStatus !== 'paid') {
      return (
        <div className="form-done">
          <h3>Your payment hasn’t gone through yet.</h3>
          <p>
            We’ll email your confirmation as soon as it clears. If it doesn’t
            arrive within a few minutes, <Link href="/contact">let us know</Link>.
          </p>
        </div>
      );
    }
    return (
      <div className="form-done">
        <h3>Your order is confirmed.</h3>
        <p>
          {stripeInfo.amountTotal != null &&
            `${formatPrice(stripeInfo.amountTotal / 100)} charged`}
          {stripeInfo.email ? ` — a receipt is on its way to ${stripeInfo.email}` : ''}.
          Your preorder ships in 7 days.
        </p>
        <p style={{ marginTop: '1.5rem' }}>
          <Link className="btn" href="/account">
            View your orders
          </Link>{' '}
          <Link className="btn btn-ghost" href="/shop">
            Keep shopping
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="form-done">
      <h3>Your order is confirmed.</h3>
      <p>
        A confirmation email is on its way, and your preorder ships in 7 days.
      </p>
      <p style={{ marginTop: '1.5rem' }}>
        <Link className="btn" href="/account">
          View your orders
        </Link>{' '}
        <Link className="btn btn-ghost" href="/shop">
          Keep shopping
        </Link>
      </p>
    </div>
  );
}
