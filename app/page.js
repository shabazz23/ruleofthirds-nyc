import Image from 'next/image';
import Link from 'next/link';
import Reveal from '../components/Reveal';
import AddToBag from '../components/AddToBag';
import { formatPrice } from '../components/format';
import { HAT } from '../components/products';

export const metadata = {
  title: 'Rule of Thirds — An Exercise in Perspective',
};

const PEERSPACE = 'https://www.peerspace.com/pages/listings/67981614acf549c7b9556489';

export default function Home() {
  return (
    <>
      <section className="perspective-hero" aria-labelledby="home-title">
        <div className="hero-kicker"><span>A creative space</span><span>Imagery / Culture / Objects</span></div>
        <h1 id="home-title" className="perspective-title"><span>Rule of</span><em>Thirds<span className="title-period">.</span></em></h1>
        <div className="contact-sheet" aria-label="Explore Rule of Thirds">
          {[
            { src: 'living-staircase.jpg', alt: 'Sunlit Golden Hour Loft interior with orange chairs', label: '01 — The space', href: '/about#studio' },
            { src: 'hat-front.jpg', alt: 'Rust corduroy Without Music, Life Would B-flat hat', label: '02 — The objects', href: '/shop' },
            { src: 'vinyl-wall.jpg', alt: 'Vinyl record display at Golden Hour Loft', label: '03 — The details', href: '/about#studio' },
            { src: 'loft-double-height.jpg', alt: 'Double-height Brooklyn loft and mezzanine', label: '04 — The perspective', href: '/about' },
            { src: 'hat-lifestyle.jpg', alt: 'Rule of Thirds corduroy hat styled in the studio', label: '05 — The everyday', href: '/shop' },
          ].map((item, i) => (
            <Link href={item.href} className="contact-sheet-frame" key={item.src}>
              <div><Image src={`/images/${item.src}`} alt={item.alt} width={560} height={640}
                sizes="(max-width: 600px) 66vw, 22vw" priority={i < 2} /></div>
              <span>{item.label}<span aria-hidden="true">↗</span></span>
            </Link>
          ))}
        </div>
        <div className="hero-bottom"><span>Photography. Film. Art. Design.</span><a href="#perspective">Explore the perspective ↓</a></div>
      </section>

      {/* INTRO */}
      <section id="perspective" className="intro-block editorial-intro">
        <Reveal>
          <p className="eyebrow">01 / The philosophy</p>
          <h2>An exercise in <em>perspective.</em></h2>
          <p className="lede" >
            A creative space dedicated to the intersection of imagery, storytelling, culture,
            and design. Through photography, moving images, and thoughtfully created objects,
            we explore the ways in which art influences how we see and experience the world.
          </p>
        </Reveal>
      </section>

      {/* FEATURED PRODUCT */}
      <section className="wrap" style={{ paddingBottom: '5rem' }}>
        <Reveal>
          <p className="eyebrow section-label">02 / Featured object <span>First edition — Preorder</span></p>
        </Reveal>
        <Reveal>
          <div className="product-card">
            <div className="product-visual product-visual-photo">
              <Image
                src="/images/hat-front.jpg"
                alt='Rust corduroy hat embroidered with "Without Music, Life Would B-flat"'
                width={1320}
                height={880}
              />
            </div>
            <div className="product-info">
              <span className="preorder-tag">Preorder</span>
              <h3>{HAT.name}</h3>
              <p className="desc">
                {HAT.detail} — {HAT.color}. {HAT.blurb}
              </p>
              <p className="price">{formatPrice(HAT.price)}</p>
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
            <p className="eyebrow">03 / The studio</p>
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
