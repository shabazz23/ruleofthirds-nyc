// Work shot in the space, shown on /gallery in the order listed.
//
// Each piece is a looping clip (or a still image) that links out when clicked.
// A piece with several links uses `links` instead of href/linkLabel; they
// appear as a small menu over the clip on hover (always shown on phones).
// Pieces pack into a tight mosaic on a three-column grid; `shape` sets each
// frame: 'wide' (two columns, 2:1), 'tall' (one column, 4:5) or 'portrait'
// (one column, two rows high, for phone video); `ratio` overrides wide/tall.
// List order decides placement, so arrange entries to fill the grid.
// Put files in public/gallery/ and add an entry:
//
//   {
//     title: 'Song Title',                      // optional
//     titleEm: 'in italics',                    // optional, set in the serif italic after the title
//     artist: 'Artist Name',                    // optional
//     kind: 'Music Video',                      // small label above the title
//     shape: 'wide',                            // 'wide', 'tall' or 'portrait'
//     ratio: '16 / 9',                          // optional, wide or tall frames
//     href: 'https://www.youtube.com/watch?v=…',
//     linkLabel: 'Watch on YouTube',            // shown on hover
//     // or: links: [{ label: 'Instagram', href: '…' }, { label: 'Shop', href: '…' }],
//     credit: { label: 'Shot by', name: '@handle', href: '…' }, // optional, shown with the links
//     video: { mp4: '/gallery/x.mp4', webm: '/gallery/x.webm' }, // or image: '/gallery/x.jpg'
//     poster: '/gallery/x-poster.jpg',          // first frame / fallback still
//   },
export const GALLERY = [
  {
    shape: 'wide',
    href: 'https://www.youtube.com/watch?v=gTep-8LflL4',
    linkLabel: 'Watch on YouTube',
    video: { mp4: '/gallery/music-video.mp4', webm: '/gallery/music-video.webm' },
    poster: '/gallery/music-video-poster.jpg',
  },
  {
    shape: 'portrait',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/lgtgcollective/' },
      { label: 'Linktree', href: 'https://linktr.ee/letgotogrow.co' },
    ],
    credit: { label: 'Shot by', name: '@chillzoeee', href: 'https://www.instagram.com/chillzoeee/' },
    video: { mp4: '/gallery/let-go-to-grow.mp4', webm: '/gallery/let-go-to-grow.webm' },
    poster: '/gallery/let-go-to-grow-poster.jpg',
  },
  {
    shape: 'portrait',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/chefmarie.a__/' },
      { label: 'Substack', href: 'https://chefmariea1.substack.com/' },
      { label: 'Linktree', href: 'https://linktr.ee/Zoeskitchen' },
      { label: 'PCOS Blueprint', href: 'https://stan.store/zoeskitchen/p/pcos-weightloss-blueprint' },
    ],
    video: { mp4: '/gallery/chef-marie.mp4', webm: '/gallery/chef-marie.webm' },
    poster: '/gallery/chef-marie-poster.jpg',
  },
  {
    shape: 'tall',
    href: 'https://www.expressyourselfblackman.com/',
    linkLabel: 'Visit the site',
    video: { mp4: '/gallery/express-yourself.mp4', webm: '/gallery/express-yourself.webm' },
    poster: '/gallery/express-yourself-poster.jpg',
  },
  {
    shape: 'wide',
    ratio: '16 / 9',
    links: [
      { label: 'YouTube', href: 'https://www.youtube.com/watch?v=3xMrVAhUy_M' },
      { label: 'Instagram', href: 'https://www.instagram.com/reel/DX95mHJuyc1/' },
    ],
    video: { mp4: '/gallery/slizzy.mp4' },
    poster: '/gallery/slizzy-poster.jpg',
  },
];
