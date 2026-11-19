import Link from 'next/link';
import Reveal from '../../components/Reveal';
import AddToBag from '../../components/AddToBag';
import ProductGallery from '../../components/ProductGallery';
import { formatPrice } from '../../components/format';
import { HAT } from '../../components/products';
import PaymentIcons from '../../components/PaymentIcons';

export const metadata = {
  title: 'Shop',
  description:
    'Thoughtfully made objects from Rule of Thirds by Good Life Collective, a photo, film and art studio. Shop pieces and preorders with card, Apple Pay, Google Pay or PayPal.',
  alternates: { canonical: '/shop' },
};

export default function Shop() {
  return (
    <>
      <section className="page-hero center">
        <Reveal>
          <p className="eyebrow">Objects</p>
          <h1>Shop</h1>
          <p className="lede">
            Thoughtfully made objects — beginning with one. More to come.
          </p>
        </Reveal>
      </section>

      <section className="wrap" style={{ paddingBottom: '4rem' }}>
        <Reveal>
          <div className="product-card product-card-shop">
            <ProductGallery images={HAT.images} badge={HAT.comingSoon ? 'Coming soon' : null} />
            <div className="product-info">
              <span className="preorder-tag">Preorder</span>
              <h3>{HAT.name}</h3>
              <p className="desc">
                {HAT.detail} — {HAT.color}
              </p>
              <p className="desc">{HAT.blurb}</p>
              {HAT.description.map((para, i) => (
                <p className="desc" key={i} style={{ marginTop: '1rem' }}>
                  {para}
                </p>
              ))}
              <ul className="detail-list">
                {HAT.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <p className="price">{formatPrice(HAT.price)}</p>
              <p className="desc" style={{ marginTop: '-0.75rem' }}>
                {HAT.shipping} · {formatPrice(HAT.shippingCost)} shipping
              </p>
              <div className="product-actions">
                <AddToBag product={HAT} label="Preorder — Add to Bag" />
              </div>
              <p className="form-note" style={{ marginTop: '1.25rem' }}>
                This is a preorder item. {HAT.shipping}. Pay by card, Apple Pay, Google Pay
                or PayPal.
              </p>
              <PaymentIcons />
              <p className="form-note">
                <Link href="/terms#shipping-returns-and-exchanges">Shipping &amp; refund policy</Link>
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
