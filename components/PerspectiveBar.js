'use client';

import { useEffect, useState } from 'react';

export default function PerspectiveBar() {
  const [light, setLight] = useState(false);
  const [time, setTime] = useState('NYC');
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rot-theme') === 'light';
      setLight(saved);
      document.documentElement.dataset.theme = saved ? 'light' : 'dark';
    } catch { /* Theme remains usable when storage is unavailable. */ }
    const tick = () => setTime(new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(new Date()));
    tick();
    const timer = setInterval(tick, 60000);
    return () => clearInterval(timer);
  }, []);
  function toggleTheme() {
    const next = !light;
    setLight(next);
    document.documentElement.dataset.theme = next ? 'light' : 'dark';
    try { localStorage.setItem('rot-theme', next ? 'light' : 'dark'); } catch { /* Optional persistence. */ }
  }
  return (
    <div className="perspective-bar">
      <button onClick={toggleTheme} aria-label={`Switch to ${light ? 'dark' : 'light'} theme`}>
        <span aria-hidden="true">◐</span> {light ? 'Dark' : 'Light'} mode
      </button>
      <span className="perspective-caption">An exercise in perspective</span>
      <span>{time} <span aria-hidden="true">·</span> Brooklyn, NY</span>
    </div>
  );
}
