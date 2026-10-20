import Reveal from '../../components/Reveal';
import { GALLERY } from '../../components/gallery';

export const metadata = {
  title: 'Gallery',
};

export default function Gallery() {
  return (
    <>
      <section className="page-hero center">
        <Reveal>
          <p className="eyebrow">Selected Work</p>
          <h1>Gallery</h1>
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
              <Reveal key={g.href}>
                <figure className="gallery-item">
                  <a
                    className="gallery-media"
                    href={g.href}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${g.linkLabel}: ${g.title}${g.artist ? ` by ${g.artist}` : ''}`}
                  >
                    {g.video ? (
                      <video autoPlay muted loop playsInline preload="metadata" poster={g.poster} aria-hidden="true">
                        {g.video.webm && <source src={g.video.webm} type="video/webm" />}
                        <source src={g.video.mp4} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={g.image} alt="" loading="lazy" />
                    )}
                    <span className="gallery-cta">
                      {g.linkLabel} <span aria-hidden="true">↗</span>
                    </span>
                  </a>
                  <figcaption>
                    <span className="gallery-kind">{g.kind}</span>
                    <span className="gallery-title">
                      {g.title}
                      {g.artist && <em> — {g.artist}</em>}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
