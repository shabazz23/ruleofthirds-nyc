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
          <div className="fa-list">
            {ARTISTS.map((a, i) => (
              <Artist key={`${a.first} ${a.last}`} a={a} index={i + 1} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Artist({ a, index }) {
  const name = [a.first, a.last].filter(Boolean).join(' ');
  const w = a.work;
  const workName = w.title ? `${w.title} by ${name}` : `A painting by ${name}`;
  const also = w.also && (w.also.title ? `${w.also.title} by ${name}` : `Another piece by ${name}`);
  return (
    <article className={`fa${index % 2 === 0 ? ' fa-flip' : ''}${w.wide ? ' fa-wide' : ''}`}>
      <Reveal className="fa-head">
        <p className="fa-index">{String(index).padStart(2, '0')}</p>
        <h2>
          {a.last ? (
            <>
              {a.first} <em>{a.last}</em>
            </>
          ) : (
            <em>{a.first}</em>
          )}
        </h2>
        <p className="fa-role">
          {[a.role, a.hometown].filter(Boolean).map((t) => (
            <span key={t}>{t}</span>
          ))}
        </p>
      </Reveal>

      <div className="fa-grid">
        <Reveal className="fa-photo">
          <figure>
            <div className={`fa-frame ${w.wide ? 'fa-r43' : 'fa-r34'}`}>
              <Image
                src={w.image}
                alt={`${workName}, hanging in the space`}
                fill
                sizes={w.wide ? '(max-width: 900px) 100vw, 66vw' : '(max-width: 900px) 100vw, 42vw'}
              />
            </div>
            <figcaption>
              <span>In the space</span>
              <span>Golden Hour Loft</span>
            </figcaption>
          </figure>
        </Reveal>

        {w.video && (
          <Reveal className="fa-clip">
            <figure>
              <div className="fa-frame fa-r916">
                <video autoPlay muted loop playsInline preload="metadata" poster={w.poster} aria-hidden="true">
                  {w.video.webm && <source src={w.video.webm} type="video/webm" />}
                  <source src={w.video.mp4} type="video/mp4" />
                </video>
              </div>
              <figcaption>
                <span>Detail</span>
              </figcaption>
            </figure>
          </Reveal>
        )}

        {!w.video && w.also && (
          <Reveal className="fa-clip">
            <figure>
              <div className="fa-frame fa-r34">
                <Image src={w.also.image} alt={`${also}, hanging in the space`} fill sizes="(max-width: 900px) 50vw, 26vw" />
              </div>
              <figcaption>
                <span>{w.also.title || 'Also in the space'}</span>
              </figcaption>
            </figure>
          </Reveal>
        )}

        <Reveal className="fa-info">
          <div className="fa-portrait">
            {a.portrait ? (
              <Image src={a.portrait} alt={`Self-portrait of ${name}`} width={192} height={192} />
            ) : (
              <span aria-hidden="true">
                {a.first[0]}
                {a.last?.[0]}
              </span>
            )}
          </div>
          {w.title && (
            <p className="fa-work">
              <em>{w.title}</em>
              {w.status && <span className="fa-status">{w.status}</span>}
            </p>
          )}
          <p className="fa-bio">{a.bio}</p>
          {w.context && (
            <figure className="fa-context">
              <div className="fa-frame fa-r34">
                <Image src={w.context} alt={`${workName}, on the wall in the space`} fill sizes="(max-width: 900px) 60vw, 18vw" />
              </div>
              <figcaption>
                <span>On the wall</span>
              </figcaption>
            </figure>
          )}
          {a.links?.length > 0 && (
            <ul className="fa-links">
              {a.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener">
                    {l.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </article>
  );
}
