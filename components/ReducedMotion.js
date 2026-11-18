'use client';

import { useEffect } from 'react';

// Visitors who turned on "Reduce motion" on their phone or computer see the
// gallery and artist clips as still frames instead of looping video.
export default function ReducedMotion() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches) return undefined;
    const still = () => {
      document.querySelectorAll('video[autoplay]').forEach((v) => {
        v.removeAttribute('autoplay');
        v.autoplay = false;
        v.pause();
      });
    };
    still();
    const obs = new MutationObserver(still);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);
  return null;
}
