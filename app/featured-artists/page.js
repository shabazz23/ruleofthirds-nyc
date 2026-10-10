import Image from 'next/image';
import Reveal from '../../components/Reveal';
import { ARTISTS } from '../../components/artists';

export const metadata = {
  title: 'Featured Artists',
};

export default function FeaturedArtists() {
  return (
    <>
      <section className="page-hero center">
        <Reveal>
          <p className="eyebrow">Artists in the Space</p>
          <h1>
            Featured <em>Artists</em>
          </h1>
        </Reveal>
      </section>
      <section className="wrap" style={{ paddingBottom: '4rem' }}>
        {ARTISTS.length === 0 ? (
          <Reveal>
            <div className="gallery-blank">
              <h2>
                Introductions <em>in progress</em>.
              </h2>
              <p>The artists whose work lives in the space — coming soon.</p>
            </div>
          </Reveal>
        ) : (
          <div className="artist-list">
            {ARTISTS.map((a) => (
              <Reveal key={a.name}>
                <article className="artist">
                  <figure className="artist-work">
                    <Image
                      src={a.artwork}
                      alt={a.artworkTitle ? `${a.artworkTitle} by ${a.name}` : `Artwork by ${a.name}`}
                      width={1320}
                      height={1650}
                      sizes="(max-width: 900px) 100vw, 50vw"
                    />
                    {a.artworkTitle && <figcaption>{a.artworkTitle}</figcaption>}
                  </figure>
                  <div className="artist-info">
                    <div className="artist-head">
                      <Image
                        className="artist-portrait"
                        src={a.portrait}
                        alt={`Self-portrait of ${a.name}`}
                        width={192}
                        height={192}
                      />
                      <div>
                        <h2>{a.name}</h2>
                        {a.medium && <p className="artist-medium">{a.medium}</p>}
                      </div>
                    </div>
                    <p className="lede">{a.bio}</p>
                    {a.links?.length > 0 && (
                      <ul className="artist-links">
                        {a.links.map((l) => (
                          <li key={l.href}>
                            <a href={l.href} target="_blank" rel="noopener">
                              {l.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
