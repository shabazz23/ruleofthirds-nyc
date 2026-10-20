// Work shot in the space, shown on /gallery in the order listed.
//
// Each piece is a looping clip (or a still image) that links out when clicked.
// A piece with several links uses `links` instead of href/linkLabel; they
// appear as a small menu over the clip on hover (always shown on phones).
// Pieces are staggered across the page automatically (big, small, small, big…);
// `shape` sets each frame: 'wide' (2:1) or 'tall' (4:5 portrait).
// Put files in public/gallery/ and add an entry:
//
//   {
//     title: 'Song Title',                      // optional
//     titleEm: 'in italics',                    // optional, set in the serif italic after the title
//     artist: 'Artist Name',                    // optional
//     kind: 'Music Video',                      // small label above the title
//     shape: 'wide',                            // 'wide' or 'tall'
//     href: 'https://www.youtube.com/watch?v=…',
//     linkLabel: 'Watch on YouTube',            // shown on hover
//     // or: links: [{ label: 'Instagram', href: '…' }, { label: 'Shop', href: '…' }],
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
    shape: 'tall',
    href: 'https://www.expressyourselfblackman.com/',
    linkLabel: 'Visit the site',
    video: { mp4: '/gallery/express-yourself.mp4', webm: '/gallery/express-yourself.webm' },
    poster: '/gallery/express-yourself-poster.jpg',
  },
  {
    shape: 'tall',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/chefmarie.a__/' },
      { label: 'Substack', href: 'https://chefmariea1.substack.com/' },
      { label: 'Linktree', href: 'https://linktr.ee/Zoeskitchen' },
      { label: 'PCOS Blueprint', href: 'https://stan.store/zoeskitchen/p/pcos-weightloss-blueprint' },
    ],
    video: { mp4: '/gallery/chef-marie.mp4', webm: '/gallery/chef-marie.webm' },
    poster: '/gallery/chef-marie-poster.jpg',
  },
];
