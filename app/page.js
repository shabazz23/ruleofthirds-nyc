import Image from 'next/image';
import Link from 'next/link';
import Reveal from '../components/Reveal';
import AddToBag from '../components/AddToBag';
import HomeHero from '../components/HomeHero';
import { formatPrice } from '../components/format';
import { HAT } from '../components/products';

export const metadata = {
  title: 'Rule of Thirds — An Exercise in Perspective',
};

const PEERSPACE = 'https://www.peerspace.com/pages/listings/67981614acf549c7b9556489';

// Studio photographs, placed on the thirds grid (see .t-photos in globals.css).
const STUDIO_PHOTOS = [
  { src: '/images/living-wide.jpg', alt: 'Dining area of Golden Hour Loft with orange chairs', w: 1320, h: 880, caption: 'Dining room', cls: 'p1' },
  { src: '/images/loft-double-height.jpg', alt: 'Double-height living space of Golden Hour Loft with mezzanine', w: 1320, h: 1981, caption: 'Double-height space', cls: 'p2' },
  { src: '/images/kitchen.jpg', alt: "Chef's kitchen at Golden Hour Loft", w: 1320, h: 880, caption: 'Kitchen', cls: 'p3' },
  { src: '/images/lounge-art.jpg', alt: 'Lounge with a colourful abstract painting', w: 1320, h: 881, caption: 'Lounge', cls: 'p4' },
  { src: '/images/vinyl-wall.jpg', alt: 'Seating corner with mirror and wall art', w: 1320, h: 1981, caption: 'Living room', cls: 'p5' },
];

export default function Home() {
  return (
    <div className="thirds-home">
      <div className="thirds-guides" aria-hidden="true"><span /><span /></div>

      <HomeHero />

      {/* ABOUT */}
      <section className="t-sec" id="about">
        <Reveal className="t-label"><p className="eyebrow">About</p></Reveal>
        <Reveal className="t-statement">
          <h2>
            A creative space dedicated to the intersection of <em>imagery</em>, storytelling,{' '}
            <em>culture</em>, and design.
          </h2>
          <p className="lede">
            Through photography, moving images, and thoughtfully created objects, we explore the
            ways in which art influences how we see and experience the world.
          </p>
          <Link href="/about" className="t-link">About Rule of Thirds</Link>
        </Reveal>
      </section>

      {/* FEATURED OBJECT */}
      <section className="t-sec">
        <Reveal className="t-label"><p className="eyebrow">Featured Object</p></Reveal>
        <Reveal className="t-object-img">
          <div className="t-frame t-r45">
            <Image
              src="/images/hat-front.jpg"
              alt='Rust corduroy hat embroidered with "Without Music, Life Would flat"'
              fill
              sizes="(max-width: 760px) 100vw, 33vw"
            />
          </div>
        </Reveal>
        <Reveal className="t-object-info">
          <span className="preorder-tag">Preorder</span>
          <h3>{HAT.name}</h3>
          <p className="desc">
            {HAT.detail} — {HAT.color}. {HAT.blurb}
          </p>
          <p className="price">{formatPrice(HAT.price)}</p>
          <div className="product-actions">
            <AddToBag product={HAT} />
            <Link href="/shop" className="btn btn-ghost">View in Shop</Link>
          </div>
        </Reveal>
      </section>

      {/* STUDIO */}
      <section className="t-sec" id="studio">
        <Reveal className="t-label"><p className="eyebrow">The Studio</p></Reveal>
        <Reveal className="t-studio-head">
          <h2>
            Golden Hour <em>Loft</em>
          </h2>
        </Reveal>
        <div className="t-photos">
          <Reveal className="t-studio-copy">
            <p className="lede">
              Our 5,000 sq ft Brooklyn production space — floor-to-ceiling windows, a working
              chef&rsquo;s kitchen, and a private rooftop. Built for photo, film, and content.
            </p>
            <div className="product-actions">
              <a href={PEERSPACE} target="_blank" rel="noopener" className="btn">Book the space</a>
              <Link href="/about#studio" className="btn btn-ghost">About the studio</Link>
            </div>
          </Reveal>
          {STUDIO_PHOTOS.map((p) => (
            <Reveal key={p.src} className={`t-photo ${p.cls}`}>
              <figure>
                <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(max-width: 760px) 100vw, 66vw" />
                <figcaption>
                  <span>{p.caption}</span>
                  <span>Golden Hour Loft</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
