'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useCart } from './cart';

// Shown after Stripe or PayPal sends the shopper back. It asks the server to
// confirm the payment went through, then empties the bag.
export default function CheckoutComplete() {
  const { clearCart } = useCart();
  const [state, setState] = useState('checking');
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const params = new URLSearchParams(window.location.search);
    const provider = params.get('provider');
    const id = provider === 'stripe' ? params.get('session_id') : params.get('token');
    if (!provider || !id) {
      setState('failed');
      return;
    }
    fetch('/api/checkout/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, id }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.paid) {
          clearCart();
          setState('paid');
        } else setState('failed');
      })
      .catch(() => setState('failed'));
  }, [clearCart]);

  if (state === 'checking') {
    return (
      <>
        <p className="eyebrow">Checkout</p>
        <h1>One moment</h1>
        <p className="lede">Confirming your payment…</p>
      </>
    );
  }

  if (state === 'paid') {
    return (
      <>
        <p className="eyebrow">Order received</p>
        <h1>
          Thank <em>you</em>
        </h1>
        <p className="lede">
          Your payment went through. A receipt is on its way to your email, and we will be in
          touch when your order ships.
        </p>
        <p style={{ marginTop: '2rem' }}>
          <Link className="btn" href="/shop">
            Back to the Shop
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <p className="eyebrow">Checkout</p>
      <h1>Payment not confirmed</h1>
      <p className="lede">
        We could not confirm this payment, so you have not been charged by us. Your bag is still
        saved. Please try again, or write to info@ruleofthirds.nyc.
      </p>
      <p style={{ marginTop: '2rem' }}>
        <Link className="btn" href="/shop">
          Back to the Shop
        </Link>
      </p>
    </>
  );
}
