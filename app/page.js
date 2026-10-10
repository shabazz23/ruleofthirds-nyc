import Image from 'next/image';
import Link from 'next/link';
import Reveal from '../components/Reveal';
import AddToBag from '../components/AddToBag';
import { HAT } from '../components/products';

export const metadata = {
  title: 'Rule of Thirds — An Exercise in Perspective',
};

const PEERSPACE = 'https://www.peerspace.com/pages/listings/67981614acf549c7b9556489';

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="page-hero home-hero">
        <Reveal>
          <p className="eyebrow">A creative space — Brooklyn, NY</p>
          <h1>
            Rule of <em>Thirds</em>
          </h1>
        </Reveal>
        <Reveal>
          <div className="hero-media">
            <Image
              src="/images/living-staircase.jpg"
              alt="Sunlit interior of the Golden Hour Loft studio"
              width={1320}
              height={880}
              priority
            />
          </div>
        </Reveal>
      </section>

      {/* INTRO */}
      <section className="intro-block">
        <Reveal>
          <h2>An exercise in perspective.</h2>
          <p className="lede" style={{ margin: '0 auto' }}>
            A creative space dedicated to the intersection of imagery, storytelling, culture,
            and design. Through photography, moving images, and thoughtfully created objects,
            we explore the ways in which art influences how we see and experience the world.
          </p>
        </Reveal>
      </section>

      {/* FEATURED PRODUCT */}
      <section className="wrap" style={{ paddingBottom: '5rem' }}>
        <Reveal>
          <p className="eyebrow">Featured Object</p>
        </Reveal>
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
              <p className="price">Price TBA</p>
              <div className="product-actions">
                <AddToBag product={HAT} />
                <Link href="/shop" className="btn btn-ghost">
                  View in Shop
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* STUDIO */}
      <section className="feature-band">
        <div className="feature-grid">
          <Reveal>
            <Image
              src="/images/loft-double-height.jpg"
              alt="Double-height living space of Golden Hour Loft with mezzanine"
              width={1320}
              height={1981}
            />
          </Reveal>
          <Reveal>
            <p className="eyebrow">The Studio</p>
            <h2>
              Golden Hour <em>Loft</em>
            </h2>
            <p className="lede">
              Our 5,000 sq ft Brooklyn production space — floor-to-ceiling windows, a working
              chef&rsquo;s kitchen, and a private rooftop. Built for photo, film, and content.
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <Link href="/about#studio" className="btn btn-ghost">
                About the studio
              </Link>
              <a href={PEERSPACE} target="_blank" rel="noopener" className="btn">
                Book the space
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
