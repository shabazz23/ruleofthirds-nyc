import Image from 'next/image';
import Reveal from '../../components/Reveal';

export const metadata = {
  title: 'About',
};

const PEERSPACE = 'https://www.peerspace.com/pages/listings/67981614acf549c7b9556489';

const SPACES = [
  {
    index: '01',
    title: 'The Open Floor',
    copy: 'A sweeping, light-filled main space for photo, film, and branded content — built to adapt to any production.',
    img: '/images/living-wide.jpg',
    alt: 'Wide view of the open floor living area',
  },
  {
    index: '02',
    title: 'The Kitchen',
    copy: 'A working chef-style kitchen made for food content, hosting, and everything in between.',
    img: '/images/kitchen.jpg',
    alt: 'Chef-style kitchen at Golden Hour Loft',
  },
  {
    index: '03',
    title: 'The Lounge',
    copy: 'Art, vinyl, and quiet corners — a space that feels lived-in, not staged.',
    img: '/images/lounge-art.jpg',
    alt: 'Lounge corner with art and vinyl wall',
  },
];

export default function About() {
  return (
    <>
      <section className="page-hero center">
        <Reveal>
          <p className="eyebrow">About</p>
          <h1>
            About the <em>Studio</em>
          </h1>
        </Reveal>
      </section>

      <section className="intro-block">
        <Reveal>
          <p className="lede" style={{ margin: '0 auto', textAlign: 'left' }}>
            We believe creativity begins with perspective.
          </p>
          <p className="lede" style={{ margin: '1.5rem auto 0', textAlign: 'left' }}>
            Rooted in an appreciation for photography, film, art, music, and culture, this
            platform serves as a space for visual exploration and creative expression.
          </p>
          <p className="lede" style={{ margin: '1.5rem auto 0', textAlign: 'left' }}>
            Our work is guided by curiosity, intentionality, and an appreciation for the
            details that often go unnoticed. Whether through a photograph, a moving image,
            or an everyday object, our goal is to create work that feels considered,
            meaningful, and enduring.
          </p>
          <p className="lede" style={{ margin: '1.5rem auto 0', textAlign: 'left' }}>
            This is more than a portfolio or a storefront. It is an evolving collection of
            ideas, experiences, and creative endeavors.
          </p>
          <p className="lede" style={{ margin: '2rem auto 0', textAlign: 'left' }}>
            <em style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>
              A different way of seeing things.
            </em>
          </p>
        </Reveal>
      </section>

      {/* THE STUDIO — Golden Hour Loft */}
      <section className="studio-band" id="studio">
        <div className="studio-grid">
          <figure>
            <Reveal>
              <Image
                src="/images/living-staircase.jpg"
                alt="Sculptural staircase in the Golden Hour Loft living space"
                width={1320}
                height={880}
              />
            </Reveal>
          </figure>
          <Reveal>
            <p className="eyebrow">The Studio</p>
            <h2>
              Golden Hour <em>Loft</em>
            </h2>
            <p className="lede">
              A 5,000 sq ft production loft in Brooklyn — natural light, floor-to-ceiling
              windows, and rooms with real character. Available for photo, film, branded
              content, podcasts, and food shoots.
            </p>
            <a href={PEERSPACE} target="_blank" rel="noopener" className="btn">
              Book the space
            </a>
          </Reveal>
        </div>

        {SPACES.map((s, i) => (
          <div className="studio-grid flip" key={s.index} style={{ paddingTop: i === 0 ? 0 : undefined }}>
            <figure>
              <Reveal>
                <Image src={s.img} alt={s.alt} width={1320} height={880} />
              </Reveal>
            </figure>
            <Reveal>
              <p className="studio-index">{s.index}</p>
              <h2>{s.title}</h2>
              <p className="lede">{s.copy}</p>
            </Reveal>
          </div>
        ))}

        <div className="studio-grid" style={{ paddingTop: 0 }}>
          <figure>
            <Reveal>
              <Image
                src="/images/art-abstract.jpg"
                alt="Abstract artwork in the loft"
                width={1320}
                height={880}
              />
            </Reveal>
          </figure>
          <Reveal>
            <p className="studio-index">04</p>
            <h2>The Details</h2>
            <p className="lede">
              Boxing gloves on the wall, records on the shelf, art that asks questions. The
              loft is dressed with pieces that give every shoot a point of view — from
              $125/hr on Peerspace.
            </p>
            <a href={PEERSPACE} target="_blank" rel="noopener" className="btn btn-ghost">
              View on Peerspace
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
