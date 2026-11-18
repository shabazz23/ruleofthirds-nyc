import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Reveal from '../../components/Reveal';
import SignOutButton from '../../components/SignOutButton';
import { formatPrice } from '../../components/format';
import { auth } from '@/lib/auth';
import { dbConfigured } from '@/lib/db';
import { getOrdersForUser } from '@/lib/orders';

export const metadata = {
  title: 'Your account',
};

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function providerLabel(provider) {
  if (provider === 'paypal') return 'PayPal';
  return 'Card / Apple Pay';
}

async function AccountDetails() {
  // Reads the session cookie, so with cacheComponents this must sit behind
  // a Suspense boundary: the static shell renders first and this streams
  // in at request time.
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/signin?callbackUrl=/account');
  }

  if (!dbConfigured()) {
    return (
      <p className="lede" style={{ marginTop: '1rem' }}>
        Signed in as <strong>{session.user.email}</strong>. Order history is
        unavailable right now — the store database is still being set up.
      </p>
    );
  }

  const orders = await getOrdersForUser(session.user.id);

  return (
    <>
      <div className="account-head">
        <div>
          <p className="lede">
            Signed in as <strong>{session.user.email}</strong>
            {session.user.name ? ` (${session.user.name})` : ''}
          </p>
        </div>
        <SignOutButton />
      </div>

      <h2 style={{ marginTop: '3rem' }}>Order history</h2>
      {orders.length === 0 ? (
        <p className="lede" style={{ marginTop: '1rem' }}>
          No orders yet.{' '}
          <Link href="/shop">The hat is waiting.</Link>
        </p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-meta">
                <span>{formatDate(order.createdAt)}</span>
                <span>{providerLabel(order.provider)}</span>
                <span className="order-status">{order.status}</span>
              </div>
              {(order.items ?? []).map((item, i) => (
                <div className="cart-row cart-row-sub" key={`${order.id}-${i}`}>
                  <span>
                    {item.name}
                    {item.qty > 1 ? ` × ${item.qty}` : ''}
                  </span>
                  <span>
                    {formatPrice(
                      ((item.lineCents ?? item.unitCents * item.qty) || 0) / 100,
                    )}
                  </span>
                </div>
              ))}
              <div className="cart-row cart-row-sub">
                <span>Shipping</span>
                <span>{formatPrice(order.shippingCents / 100)}</span>
              </div>
              <div className="cart-row">
                <span>Total</span>
                <span>{formatPrice(order.totalCents / 100)}</span>
              </div>
              <p className="order-ref">Order {order.providerOrderId}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

export default function AccountPage() {
  return (
    <>
      <section className="page-hero center">
        <Reveal>
          <p className="eyebrow">Account</p>
          <h1>
            Your <em>account</em>
          </h1>
        </Reveal>
      </section>
      <section className="wrap" style={{ paddingBottom: '4rem' }}>
        <Suspense fallback={<p className="lede">Loading your account…</p>}>
          <AccountDetails />
        </Suspense>
      </section>
    </>
  );
}
