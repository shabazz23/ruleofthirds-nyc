import Reveal from '../../components/Reveal';
import CheckoutForm from '../../components/CheckoutForm';

export const metadata = {
  title: 'Checkout',
};

export default function CheckoutPage() {
  return (
    <>
      <section className="page-hero center">
        <Reveal>
          <p className="eyebrow">Shop</p>
          <h1>
            Check<em>out</em>
          </h1>
        </Reveal>
      </section>
      <section className="wrap" style={{ paddingBottom: '4rem' }}>
        <CheckoutForm />
      </section>
    </>
  );
}
