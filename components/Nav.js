'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from './cart';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/shop', label: 'Shop' },
  { href: '/contact', label: 'Contact' },
];

export default function Nav() {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const dialog = useRef(null);
  const trigger = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => dialog.current?.close();

  useEffect(() => { dialog.current?.close(); }, [pathname]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="site-nav editorial-nav">
        <div className="nav-inner">
          <Link href="/" className="brand">Rule of Thirds<sup>®</sup></Link>
          <button ref={trigger} className="menu-trigger" aria-controls="site-menu"
            aria-expanded={menuOpen} aria-haspopup="dialog"
            onClick={() => { dialog.current.showModal(); setMenuOpen(true); }}>
            Menu <span aria-hidden="true">＋</span>
          </button>
          <button className="bag-label" onClick={openCart} aria-label={`Open bag, ${count} items`}>
            Bag <span>({count.toString().padStart(2, '0')})</span>
          </button>
        </div>
      </header>
      <dialog ref={dialog} id="site-menu" className="editorial-menu" aria-label="Site navigation"
        onClose={() => { setMenuOpen(false); trigger.current?.focus(); }}>
        <div className="menu-top"><span>Rule of Thirds®</span><button autoFocus className="menu-trigger" onClick={closeMenu}>Close ×</button></div>
        <nav aria-label="Primary">
          {LINKS.map((link, i) => (
            <Link key={link.href} href={link.href} onClick={closeMenu} aria-current={pathname === link.href ? 'page' : undefined}>
              <span className="menu-index">0{i + 1}</span>{link.label}<span className="menu-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
        <p className="menu-bottom">An exercise in perspective. <span>Brooklyn, New York</span></p>
      </dialog>
    </>
  );
}
