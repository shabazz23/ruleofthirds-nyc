import Image from 'next/image';
import Link from 'next/link';
import Reveal from '../components/Reveal';
import HomeHero from '../components/HomeHero';

export const metadata = {
  // "absolute" stops the "· Rule of Thirds" ending being added twice.
  title: { absolute: 'Golden Hour Loft | Photo, Film & Podcast Studio · Rule of Thirds by Good Life Collective' },
  alternates: { canonical: '/' },
};

const PEERSPACE = 'https://www.peerspace.com/pages/listings/67981614acf549c7b9556489';

// Studio photographs, placed on the thirds grid (see .t-photos in globals.css).
const STUDIO_PHOTOS = [
  { src: '/images/living-wide.jpg', alt: 'Dining area of Golden Hour Loft with orange chairs', w: 1320, h: 880, caption: 'Dining room', cls: 'p1' },
  { src: '/images/lounge-art.jpg', alt: 'Lounge with a colourful abstract painting', w: 1320, h: 881, caption: 'Lounge', cls: 'p4' },
  { src: '/images/vinyl-wall.jpg', alt: 'Seating corner with mirror and wall art', w: 1320, h: 1981, caption: 'Living room', cls: 'p5' },
  { src: '/images/record-wall-wide.jpg', alt: 'Four album covers on a white wall under a slim light, with a plant below', w: 1086, h: 724, cls: 'p6' },
];

export default function Home() {
  return (
    <div className="thirds-home">
      <div className="thirds-guides" aria-hidden="true"><span /><span /></div>

      <HomeHero />

      {/* ABOUT */}
      <section className="t-sec" id="about">
        <Reveal className="t-label">
          <p className="eyebrow">About</p>
          <Image
            className="t-about-photo"
            src="/images/directors-chair.jpg"
            alt="Director's chair beside a framed Grammy Awards poster and a carved mask in Golden Hour Loft"
            width={1086}
            height={1448}
            sizes="(max-width: 760px) 60vw, 240px"
          />
        </Reveal>
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
              chef&rsquo;s kitchen, and a private rooftop. Built for photo, film, podcasts, and content.
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
                {p.caption && (
                  <figcaption>
                    <span>{p.caption}</span>
                    <span>Golden Hour Loft</span>
                  </figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FROM THE KITCHEN */}
      <section className="t-sec t-kitchen">
        <Reveal className="t-label"><p className="eyebrow">From the Kitchen</p></Reveal>
        <Reveal className="t-object-img">
          <div className="t-frame t-r45">
            <Image
              src="/gallery/chef-marie-pancakes.jpg"
              alt="Lemon pancakes with berries, mint and powdered sugar by Chef Marie"
              fill
              sizes="(max-width: 760px) 100vw, 33vw"
            />
          </div>
        </Reveal>
        <Reveal className="t-object-info">
          <p className="t-credit">
            By{' '}
            <a href="https://www.instagram.com/chefmarie.a__/" target="_blank" rel="noopener">Chef Marie</a>,{' '}
            <a href="https://linktr.ee/Zoeskitchen" target="_blank" rel="noopener"><em>Zoe&rsquo;s Kitchen</em></a>
          </p>
          <Link href="/gallery" className="t-link">See the gallery</Link>
        </Reveal>
      </section>
    </div>
  );
}
