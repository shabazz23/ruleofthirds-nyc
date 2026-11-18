import { Suspense } from 'react';
import Reveal from '../../../components/Reveal';
import SuccessContent from '../../../components/SuccessContent';

export const metadata = {
  title: 'Order confirmed',
};

export default function CheckoutSuccessPage() {
  return (
    <>
      <section className="page-hero center">
        <Reveal>
          <p className="eyebrow">Shop</p>
          <h1>
            Thank <em>you</em>
          </h1>
        </Reveal>
      </section>
      <section className="wrap" style={{ paddingBottom: '4rem' }}>
        <Suspense fallback={<p className="lede">Confirming your order…</p>}>
          <SuccessContent />
        </Suspense>
      </section>
    </>
  );
}
