// Artists whose work lives in the space, shown on /featured-artists in the order listed.
//
// Every other artist is laid out mirrored. Put files in public/artists/ and add an entry:
//
//   {
//     first: 'Jane', last: 'Doe',                  // the last name is set in the serif italic; a single name
//                                                  // goes in `first` alone and is set entirely in italic
//     role: 'Painter',                             // optional
//     hometown: 'Brooklyn, NY',
//     portrait: '/artists/jane-doe.jpg',           // optional small self-portrait (square works best);
//                                                  // until there is one, a circle with initials holds the spot
//     bio: 'A short paragraph about the artist.',
//     work: {
//       title: 'Untitled',                         // optional
//       status: 'Sold',                            // optional small tag next to the title
//       image: '/artists/jane-doe-work.jpg',       // the piece as it hangs in the space (3:4 upright)
//       wide: true,                                // set for a 4:3 landscape photo; it then fills two columns
//       video: { mp4: '/artists/jane-doe-work.mp4', webm: '/artists/jane-doe-work.webm' }, // optional silent detail clip (9:16)
//       poster: '/artists/jane-doe-work-poster.jpg',
//       also: { title: 'Second Piece', image: '/artists/jane-doe-work-2.jpg' }, // optional second piece (3:4), shown instead of a clip
//       context: '/artists/jane-doe-work-wall.jpg', // optional smaller wider shot of the piece on the wall (3:4), under the bio
//     },
//     links: [
//       { label: 'Instagram', href: 'https://instagram.com/janedoe' },
//       { label: 'Website', href: 'https://janedoe.com' },
//     ],
//   },
export const ARTISTS = [
  {
    first: 'George',
    last: 'Seyffert',
    role: 'Attorney & Artist',
    hometown: 'Brooklyn, NY',
    portrait: '/artists/george-seyffert.jpg',
    bio: 'George Seyffert is an attorney and artist from Brooklyn, New York. The painting Greenpoint hangs in the space.',
    work: {
      title: 'Greenpoint',
      status: 'Sold',
      image: '/artists/george-seyffert-greenpoint.jpg',
      video: {
        mp4: '/artists/george-seyffert-greenpoint.mp4',
        webm: '/artists/george-seyffert-greenpoint.webm',
      },
      poster: '/artists/george-seyffert-greenpoint-poster.jpg',
    },
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/george.seyffert/' },
      { label: 'Website', href: 'https://www.georgeseyffert.com/' },
      { label: 'Shop', href: 'https://www.georgeseyffert.com/shop' },
      { label: 'Seyff', href: 'https://www.seyff.co/founder' },
    ],
  },
  {
    first: 'Richard',
    last: 'Edouard',
    role: 'Healthcare Professional & Artist',
    hometown: 'Long Island, NY',
    portrait: '/artists/richard-edouard.jpg',
    bio: 'Richard Edouard is a healthcare professional and artist from Long Island, New York. The painting Paid In Full, a piece about abundance, hangs in the space.',
    work: {
      title: 'Paid In Full',
      image: '/artists/richard-edouard-painting.jpg',
      wide: true,
    },
    links: [{ label: 'Instagram', href: 'https://www.instagram.com/richpapi_/' }],
  },
  {
    first: 'Sena',
    role: 'Attorney, Artist & Creative Director',
    hometown: 'South Jamaica, Queens',
    portrait: '/artists/sena.jpg',
    bio: 'Sena is an attorney, artist and creative director from South Jamaica, Queens.',
    work: {
      image: '/artists/sena-gloves.jpg',
      also: { image: '/artists/sena-abstract.jpg' },
      context: '/artists/sena-gloves-wall.jpg',
    },
    links: [{ label: 'Instagram', href: 'https://www.instagram.com/bobharlley/' }],
  },
];
