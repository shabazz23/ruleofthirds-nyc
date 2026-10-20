// Work shot in the space, shown on /gallery in the order listed.
//
// Each piece is a looping clip (or a still image) that links out when clicked.
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
//     video: { mp4: '/gallery/x.mp4', webm: '/gallery/x.webm' }, // or image: '/gallery/x.jpg'
//     poster: '/gallery/x-poster.jpg',          // first frame / fallback still
//   },
export const GALLERY = [
  {
    shape: 'wide',
    title: 'Golden Hour,',
    titleEm: 'after hours',
    artist: '',
    href: 'https://www.youtube.com/watch?v=gTep-8LflL4',
    linkLabel: 'Watch on YouTube',
    video: { mp4: '/gallery/music-video.mp4', webm: '/gallery/music-video.webm' },
    poster: '/gallery/music-video-poster.jpg',
  },
  {
    kind: 'Series · Conversations in the Loft',
    shape: 'tall',
    title: 'Express Yourself,',
    titleEm: 'Black Man',
    artist: '',
    href: 'https://www.expressyourselfblackman.com/',
    linkLabel: 'Visit the site',
    video: { mp4: '/gallery/express-yourself.mp4', webm: '/gallery/express-yourself.webm' },
    poster: '/gallery/express-yourself-poster.jpg',
  },
];
