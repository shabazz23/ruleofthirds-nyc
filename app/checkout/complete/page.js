import CheckoutComplete from '../../../components/CheckoutComplete';

export const metadata = {
  title: 'Thank you',
  robots: { index: false },
};

export default function CompletePage() {
  return (
    <section className="page-hero center checkout-complete" style={{ minHeight: "60vh" }}>
      <CheckoutComplete />
    </section>
  );
}
