'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

export default function ProductGallery({ images }) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const current = images[index];

  const close = useCallback(() => setZoomed(false), []);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    document.body.classList.add('locked');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('locked');
    };
  }, [zoomed, close]);

  return (
    <div className="product-gallery">
      <button
        className="pg-main"
        onClick={() => setZoomed(true)}
        aria-label={`Zoom: ${current.alt}`}
      >
        <Image
          src={current.src}
          alt={current.alt}
          width={1320}
          height={880}
          priority={index === 0}
        />
        <span className="pg-zoom-hint">Click to zoom</span>
      </button>
      <div className="pg-thumbs" role="tablist" aria-label="Product views">
        {images.map((img, i) => (
          <button
            key={img.src}
            role="tab"
            aria-selected={i === index}
            aria-label={`View ${img.label}`}
            className={`pg-thumb${i === index ? ' active' : ''}`}
            onClick={() => setIndex(i)}
          >
            <Image src={img.src} alt="" width={240} height={160} />
          </button>
        ))}
      </div>

      {zoomed && (
        <div className="lightbox" onClick={close} role="dialog" aria-modal="true" aria-label={current.alt}>
          <button className="lightbox-close" onClick={close} aria-label="Close zoom">
            ×
          </button>
          <Image
            src={current.src}
            alt={current.alt}
            width={1320}
            height={880}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
