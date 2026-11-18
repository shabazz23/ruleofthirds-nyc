import Link from 'next/link';
import Reveal from './Reveal';

// Renders the light markdown used in components/legal.js.

const slug = (s) =>
  s.replace(/^\d+\.\s*/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|[\w.+-]+@[\w-]+\.[\w.]+[a-z])/g;

function inline(text, keyBase) {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyBase}-${i}`;
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{inline(part.slice(2, -2), key)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <Link key={key} href={link[2]}>{link[1]}</Link>;
    if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
      return <a key={key} href={`mailto:${part}`}>{part}</a>;
    }
    return part;
  });
}

export default function LegalDoc({ eyebrow, title, updated, body }) {
  const blocks = body.trim().split(/\n\s*\n/);
  return (
    <>
      <section className="page-hero center">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="legal-title">{title}</h1>
          <p className="legal-updated">Last updated {updated}</p>
        </Reveal>
      </section>
      <article className="legal">
        {blocks.map((block, i) => {
          if (block.startsWith('### ')) {
            const text = block.slice(4).trim();
            return <h2 key={i} id={slug(text)}>{text}</h2>;
          }
          if (block.startsWith('- ')) {
            return (
              <ul key={i}>
                {block.split('\n').map((line, j) => (
                  <li key={j}>{inline(line.replace(/^- /, ''), `${i}-${j}`)}</li>
                ))}
              </ul>
            );
          }
          return <p key={i}>{inline(block, `${i}`)}</p>;
        })}
      </article>
    </>
  );
}
