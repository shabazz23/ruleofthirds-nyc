// Product catalog — prices and details are finalized by the owner.
// `price: null` means "to be announced"; the shop renders TBA gracefully.

export const HAT = {
  id: 'hat-without-music-life-would-flat',
  name: 'Without Music, Life Would ♭',
  detail: 'Embroidered Corduroy Hat',
  color: 'Rust',
  price: null,
  preorder: true,
  image: '/images/hat-front.jpg',
  images: [
    {
      src: '/images/hat-front.jpg',
      alt: 'Front view — cream script embroidery reading "Without Music, Life Would flat"',
      label: 'Front',
    },
    {
      src: '/images/hat-back.jpg',
      alt: 'Back view — "Live In Your Own Key" and "Brooklyn NY" embroidery with brass buckle strap',
      label: 'Back',
    },
    {
      src: '/images/hat-lifestyle.jpg',
      alt: 'Styled view of the rust corduroy hat',
      label: 'Styled',
    },
  ],
  blurb:
    'An expression of the relationship between music, identity, and everyday life.',
  description: [
    'Designed with an appreciation for typography, subtle details, and timeless aesthetics, this embroidered hat brings a familiar sentiment into a wearable form.',
    'Without Music, Life Would ♭. A statement about the importance of music in everything we do.',
  ],
  details: [
    'Rust corduroy six-panel cap',
    'Cream script embroidery, front',
    '\u201cBrooklyn NY\u201d script, side',
    '\u201cLive In Your Own Key\u201d, back arch',
    'Brass buckle strap closure',
  ],
};

export const PRODUCTS = [HAT];
