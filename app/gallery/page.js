import { Pinyon_Script } from 'next/font/google';
import Reveal from '../../components/Reveal';
import GalleryTap from '../../components/GalleryTap';
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
            <GalleryTap />
            {GALLERY.map((g) => (
              <Reveal key={g.href || g.links?.[0].href || g.image || g.video.mp4} className="gallery-cell">
                <figure className={`gallery-item gallery-${g.shape || 'wide'}`} style={g.ratio && { '--ratio': g.ratio }}>
                  {g.links ? (
                    <div className="gallery-media gallery-media-multi">
                      <GalleryMedia g={g} />
                      <GalleryHint />
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
                              {l.label} <Arrow size={8} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : !g.href ? (
                    <div className="gallery-media">
                      <GalleryMedia g={g} />
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
                      <GalleryHint />
                      <span className="gallery-cta">
                        {g.linkLabel} <Arrow size={8} />
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

function Arrow({ size = 10 }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9 9 3M4.5 3H9v4.5" />
    </svg>
  );
}

function GalleryHint() {
  return (
    <span className="gallery-hint" aria-hidden="true">
      <Arrow />
    </span>
  );
}

function GalleryMedia({ g }) {
  return g.video ? (
    <video autoPlay muted loop playsInline preload="metadata" poster={g.poster} aria-hidden="true">
      {g.video.webm && <source src={g.video.webm} type="video/webm" />}
      <source src={g.video.mp4} type="video/mp4" />
    </video>
  ) : (
    <img src={g.image} alt={g.alt || ''} loading="lazy" />
  );
}
