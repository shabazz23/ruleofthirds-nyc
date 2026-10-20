// Work shot in the space, shown on /gallery in the order listed.
//
// Each piece is a looping clip (or a still image) that links out when clicked.
// Put files in public/gallery/ and add an entry:
//
//   {
//     title: 'Song Title',                      // optional
//     titleEm: 'in italics',                    // optional, set in the serif italic after the title
//     artist: 'Artist Name',                    // optional
//     kind: 'Music Video',                      // small label above the title
//     href: 'https://www.youtube.com/watch?v=…',
//     linkLabel: 'Watch on YouTube',            // shown on hover
//     video: { mp4: '/gallery/x.mp4', webm: '/gallery/x.webm' }, // or image: '/gallery/x.jpg'
//     poster: '/gallery/x-poster.jpg',          // first frame / fallback still
//   },
export const GALLERY = [
  {
    kind: 'Music Video · Shot in the Loft',
    title: 'Golden Hour,',
    titleEm: 'after hours',
    artist: '',
    href: 'https://www.youtube.com/watch?v=gTep-8LflL4',
    linkLabel: 'Watch on YouTube',
    video: { mp4: '/gallery/music-video.mp4', webm: '/gallery/music-video.webm' },
    poster: '/gallery/music-video-poster.jpg',
  },
];
