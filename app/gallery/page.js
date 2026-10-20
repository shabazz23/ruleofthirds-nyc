import { Pinyon_Script } from 'next/font/google';
import Reveal from '../../components/Reveal';
import { GALLERY } from '../../components/gallery';

const script = Pinyon_Script({ subsets: ['latin'], weight: '400' });

export const metadata = {
  title: 'Gallery',
};

export default function Gallery() {
  return (
    <>
      <section className="page-hero center">
        <Reveal>
          <h1>Gallery</h1>
          <p className={`gallery-script ${script.className}`}>shot inside the space</p>
        </Reveal>
      </section>
      <section className="wrap" style={{ paddingBottom: '4rem' }}>
        {GALLERY.length === 0 ? (
          <Reveal>
            <div className="gallery-blank">
              <h2>
                A collection <em>in progress</em>.
              </h2>
              <p>Photography, film, and artwork — coming soon.</p>
            </div>
          </Reveal>
        ) : (
          <div className="gallery-grid">
            {GALLERY.map((g) => (
              <Reveal key={g.href || g.links[0].href} className="gallery-cell">
                <figure className={`gallery-item gallery-${g.shape || 'wide'}`}>
                  {g.links ? (
                    <div className="gallery-media gallery-media-multi">
                      <GalleryMedia g={g} />
                      <ul className="gallery-links">
                        {g.credit && (
                          <li className="gallery-credit">
                            {g.credit.label}{' '}
                            <a href={g.credit.href} target="_blank" rel="noopener">
                              {g.credit.name}
                            </a>
                          </li>
                        )}
                        {g.links.map((l) => (
                          <li key={l.href}>
                            <a href={l.href} target="_blank" rel="noopener">
                              {l.label} <span aria-hidden="true">↗</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <a
                      className="gallery-media"
                      href={g.href}
                      target="_blank"
                      rel="noopener"
                      aria-label={[g.linkLabel, g.title, g.titleEm, g.artist && `by ${g.artist}`].filter(Boolean).join(' ')}
                    >
                      <GalleryMedia g={g} />
                      <span className="gallery-cta">
                        {g.linkLabel} <span aria-hidden="true">↗</span>
                      </span>
                    </a>
                  )}
                  {(g.kind || g.title || g.titleEm || g.artist) && (
                    <figcaption>
                      {g.kind && <span className="gallery-kind">{g.kind}</span>}
                      {(g.title || g.titleEm || g.artist) && (
                        <span className="gallery-title">
                          {g.title}
                          {g.titleEm && <em className="gallery-title-em"> {g.titleEm}</em>}
                          {g.artist && <em>{(g.title || g.titleEm) && ' — '}{g.artist}</em>}
                        </span>
                      )}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function GalleryMedia({ g }) {
  return g.video ? (
    <video autoPlay muted loop playsInline preload="metadata" poster={g.poster} aria-hidden="true">
      {g.video.webm && <source src={g.video.webm} type="video/webm" />}
      <source src={g.video.mp4} type="video/mp4" />
    </video>
  ) : (
    <img src={g.image} alt="" loading="lazy" />
  );
}
