'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from './cart';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/featured-artists', label: 'Featured Artists' },
  { href: '/shop', label: 'Shop' },
  { href: '/contact', label: 'Contact' },
];

export default function Nav() {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const onHome = pathname === '/';

  useEffect(() => {
    // On the phone homepage the bar floats over the full-screen painting in white, and only
    // turns cream once you scroll past the painting.
    const threshold = () => {
      const hero = onHome && window.innerWidth <= 760 && document.querySelector('.hero-stage');
      return hero ? hero.offsetHeight - 64 : 24;
    };
    const onScroll = () => setScrolled(window.scrollY > threshold());
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [onHome]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    document.body.classList.toggle('locked', menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={`site-nav${scrolled ? ' scrolled' : ''}${onHome ? ' on-hero' : ''}`}>
        <div className="nav-inner">
          <Link href="/" className="brand">
            Rule of Thirds
          </Link>
          <nav className="nav-links" aria-label="Primary">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={pathname === l.href ? 'active' : ''}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="nav-right">
            <button className="bag-btn" onClick={openCart} aria-label={`Open bag, ${count} items`}>
              <span aria-hidden="true">◈</span>
              {count > 0 && <span className="bag-count">{count}</span>}
            </button>
            <button
              className="burger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <div className="mobile-menu" aria-hidden={!menuOpen}>
        <nav aria-label="Mobile">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
