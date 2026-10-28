// Artists whose work lives in the space, shown on /featured-artists in the order listed.
//
// Put files in public/artists/ and add an entry:
//
//   {
//     first: 'Jane', last: 'Doe',                  // the last name is set in the serif italic
//     role: 'Painter',
//     hometown: 'Brooklyn, NY',
//     portrait: '/artists/jane-doe.jpg',           // optional small self-portrait (square works best);
//                                                  // until there is one, a circle with initials holds the spot
//     bio: 'A short paragraph about the artist.',
//     work: {
//       title: 'Untitled',
//       status: 'Sold',                            // optional small tag next to the title
//       image: '/artists/jane-doe-work.jpg',       // the piece as it hangs in the space (3:4 upright)
//       video: { mp4: '/artists/jane-doe-work.mp4', webm: '/artists/jane-doe-work.webm' }, // optional silent detail clip (9:16)
//       poster: '/artists/jane-doe-work-poster.jpg',
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
    bio: 'George Seyffert is an attorney and artist from Brooklyn, New York. His painting Greenpoint hangs in the space.',
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
];
