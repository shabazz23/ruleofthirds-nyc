import Reveal from '../../components/Reveal';

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
        <Reveal>
          <div className="gallery-blank">
            <h2>
              A collection <em>in progress</em>.
            </h2>
            <p>Photography, film, and artwork — coming soon.</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
