'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [year, setYear] = useState(2026);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <p className="footer-brand">Rule of Thirds</p>
          <p>
            An exercise in perspective — photography, film, art, and thoughtfully made objects.
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/featured-artists">Featured Artists</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4>Policies</h4>
          <ul>
            <li>Shipping &amp; Returns</li>
            <li>Preorder Policy</li>
            <li>Privacy Policy</li>
            <li>Terms &amp; Conditions</li>
          </ul>
        </div>
      </div>
      <div className="footer-base">
        <span>© {year} Rule of Thirds. All rights reserved.</span>
        <span>Brooklyn, New York</span>
      </div>
    </footer>
  );
}
