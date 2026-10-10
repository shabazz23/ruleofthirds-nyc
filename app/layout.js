import './globals.css';
import { Inter, Newsreader } from 'next/font/google';
import { CartProvider } from '../components/cart';
import Nav from '../components/Nav';
import PerspectiveBar from '../components/PerspectiveBar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const newsreader = Newsreader({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-serif' });

export const metadata = {
  title: {
    default: 'Rule of Thirds — An Exercise in Perspective',
    template: '%s · Rule of Thirds',
  },
  description:
    'A creative space dedicated to the intersection of imagery, storytelling, culture, and design. Photography, film, art, and thoughtfully made objects.',
  metadataBase: new URL('https://ruleofthirds.nyc'),
  openGraph: {
    title: 'Rule of Thirds — An Exercise in Perspective',
    description:
      'Photography, film, art, and thoughtfully made objects. An exercise in perspective.',
    url: 'https://ruleofthirds.nyc',
    siteName: 'Rule of Thirds',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body>
        <CartProvider>
          <Nav />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
          <PerspectiveBar />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
