import './globals.css';
import { Inter, Newsreader } from 'next/font/google';
import { CartProvider } from '../components/cart';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import ReducedMotion from '../components/ReducedMotion';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const newsreader = Newsreader({ subsets: ['latin'], style: 'italic', variable: '--font-serif' });

export const metadata = {
  title: {
    default: 'Rule of Thirds — An Exercise in Perspective',
    template: '%s · Rule of Thirds',
  },
  description:
    'Rule of Thirds by Good Life Collective is a creative studio for photography, film and art, and home of Golden Hour Loft, a 5,000 sq ft sunlit production space in Brooklyn for shoots and events.',
  metadataBase: new URL('https://ruleofthirds.nyc'),
  openGraph: {
    title: 'Rule of Thirds — An Exercise in Perspective',
    description:
      'A creative studio by Good Life Collective and home of Golden Hour Loft, a sunlit production space for photo, film and events.',
    siteName: 'Rule of Thirds',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/images/living-wide.jpg', width: 1320, height: 880, alt: 'Golden Hour Loft, Brooklyn' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/living-wide.jpg'],
  },
};

// Tells Google who runs the site, so it can show the name and links properly.
const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Rule of Thirds by Good Life Collective',
  alternateName: 'Rule of Thirds',
  legalName: 'Good Life Collective LLC',
  url: 'https://ruleofthirds.nyc',
  email: 'info@ruleofthirds.nyc',
  slogan: 'An exercise in perspective.',
  description:
    'A creative studio for photography, film and art, and home of Golden Hour Loft, a 5,000 sq ft production space for photo, film and events.',
  sameAs: ['https://www.peerspace.com/pages/listings/67981614acf549c7b9556489'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }}
        />
        <a href="#main" className="skip-link">Skip to content</a>
        <CartProvider>
          <Nav />
          <main id="main" tabIndex={-1}>{children}</main>
          <Footer />
          <CartDrawer />
          <ReducedMotion />
        </CartProvider>
      </body>
    </html>
  );
}
