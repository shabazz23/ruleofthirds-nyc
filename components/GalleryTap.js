'use client';

import { useEffect } from 'react';

// Phones can't hover, so on touch screens the first tap on a gallery piece
// shows its links, a tap on a link follows it, and any other tap hides them.
export default function GalleryTap() {
  useEffect(() => {
    if (!window.matchMedia('(hover: none)').matches) return;

    const closeAll = (except) => {
      document.querySelectorAll('.gallery-media.is-open').forEach((el) => {
        if (el !== except) el.classList.remove('is-open');
      });
    };

    const onClick = (e) => {
      const media = e.target.closest('.gallery-media');
      if (!media || !media.querySelector('.gallery-hint')) {
        closeAll();
        return;
      }
      if (!media.classList.contains('is-open')) {
        e.preventDefault();
        closeAll(media);
        media.classList.add('is-open');
      } else if (!e.target.closest('a')) {
        media.classList.remove('is-open');
      }
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
