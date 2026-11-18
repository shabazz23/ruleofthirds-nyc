'use client';

import { useState } from 'react';
import PaymentIcons from './PaymentIcons';

// Sends the bag (product ids and quantities only) to the server, which prices
// it and replies with the address of Stripe's or PayPal's secure payment page.
export default function CheckoutButtons({ items }) {
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');

  const start = async (provider) => {
    setBusy(provider);
    setError('');
    try {
      const res = await fetch(`/api/checkout/${provider}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map(({ id, qty }) => ({ id, qty })) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout could not start. Please try again.');
      window.location.assign(data.url);
    } catch (err) {
      setError(err.message);
      setBusy(null);
    }
  };

  return (
    <div className="checkout-buttons">
      <button className="btn" onClick={() => start('stripe')} disabled={busy !== null}>
        {busy === 'stripe' ? 'Opening checkout…' : 'Checkout'}
      </button>
      <button className="btn btn-ghost" onClick={() => start('paypal')} disabled={busy !== null}>
        {busy === 'paypal' ? 'Opening PayPal…' : 'Pay with PayPal'}
      </button>
      {error && (
        <p className="checkout-error" role="alert">
          {error}
        </p>
      )}
      <PaymentIcons className="pay-icons-center" />
      <p className="cart-note">Payments handled by Stripe and PayPal.</p>
    </div>
  );
}
