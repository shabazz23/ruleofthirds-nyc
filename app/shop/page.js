import Reveal from '../../components/Reveal';
import AddToBag from '../../components/AddToBag';
import { HAT } from '../../components/products';

export const metadata = {
  title: 'Shop',
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
          <div className="product-card">
            <div className="product-visual">
              <p className="hat-mark">
                Without Music,
                <br />
                Life Would ♭
              </p>
            </div>
            <div className="product-info">
              <span className="preorder-tag">Preorder</span>
              <h3>{HAT.name}</h3>
              <p className="desc">{HAT.blurb}</p>
              {HAT.description.map((para, i) => (
                <p className="desc" key={i} style={{ marginTop: '1rem' }}>
                  {para}
                </p>
              ))}
              <p className="price">Price TBA</p>
              <div className="product-actions">
                <AddToBag product={HAT} label="Preorder — Add to Bag" />
              </div>
              <p className="form-note" style={{ marginTop: '1.25rem' }}>
                This is a preorder item. Estimated shipping window and final pricing will be
                announced before checkout opens.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
