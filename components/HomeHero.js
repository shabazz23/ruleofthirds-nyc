'use client';

// Home hero with the entrance sequence: a viewfinder draws the thirds grid, a focus
// reticle locks on the upper-left power point, a shutter opens on a grid of letters,
// and the letters of "Rule of Thirds" fly (GSAP Flip) into the headline.
// Plays once per browser session; skipped entirely for reduced-motion visitors.

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import InlineScript from './InlineScript';

gsap.registerPlugin(Flip);

const SEEN_KEY = 'rot-intro-seen';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LINES = [
  [{ text: 'RULE' }, { text: 'OF' }],
  [{ text: 'Thirds', italic: true }],
];

// Hide the intro cover before first paint when it shouldn't play.
const SKIP_SCRIPT = `try{if(sessionStorage.getItem('${SEEN_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.getElementById('rot-intro').setAttribute('data-skip','')}catch(e){}`;

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function shouldSkip() {
  try {
    return (
      !!sessionStorage.getItem(SEEN_KEY) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  } catch {
    return false;
  }
}

export default function HomeHero() {
  const stageRef = useRef(null);
  const introRef = useRef(null);

  useIsoLayoutEffect(() => {
    const stage = stageRef.current;
    const intro = introRef.current;
    const grid = intro.querySelector('.lg');
    const chars = Array.from(stage.querySelectorAll('.hero-title .ch'));
    const homes = new Map(chars.map((ch) => [ch, ch.parentElement]));
    const goHome = () => chars.forEach((ch) => homes.get(ch).appendChild(ch));
    // The nav lives outside this component, so collect elements rather than scoped selectors.
    const chrome = [
      document.querySelector('.site-nav'),
      ...stage.querySelectorAll('.hero-eyebrow, .hero-aside, .hero-photo, .hero-meta'),
    ].filter(Boolean);

    let scrambleTimer;
    let flipTween;

    const finish = () => {
      intro.setAttribute('data-skip', '');
      document.body.classList.remove('locked');
    };

    if (shouldSkip()) {
      finish();
      return undefined;
    }

    const tok = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const ink = tok('--ink');
    const muted = tok('--muted');
    const line = tok('--line');

    // Letter grid: one reserved cell per headline letter, kept in reading order.
    const narrow = window.innerWidth < 760;
    const cols = narrow ? 6 : 12;
    const rows = narrow ? 9 : 6;
    grid.style.setProperty('--cols', cols);
    grid.style.setProperty('--rows', rows);
    const rect = grid.getBoundingClientRect();
    grid.style.setProperty('--cell', `${Math.min(rect.width / cols, rect.height / rows) * 0.6}px`);
    const total = cols * rows;
    const picks = new Set();
    while (picks.size < chars.length) picks.add(Math.floor(Math.random() * total));
    const reserved = [...picks].sort((a, b) => a - b);
    const fills = [];
    for (let i = 0; i < total; i++) {
      const cell = document.createElement('div');
      cell.className = 'lg-cell';
      const slot = reserved.indexOf(i);
      if (slot > -1) cell.appendChild(chars[slot]);
      else {
        const f = document.createElement('span');
        f.className = 'lg-fill';
        f.textContent = ALPHABET[Math.floor(Math.random() * 26)];
        cell.appendChild(f);
        fills.push(f);
      }
      grid.appendChild(cell);
    }

    window.scrollTo(0, 0);
    document.body.classList.add('locked');

    const ctx = gsap.context(() => {
      gsap.set(chrome, { autoAlpha: 0 });
      gsap.set(chars, { opacity: 0.35, color: muted });
      gsap.set('.hero-guides span', { backgroundColor: ink });

      gsap
        .timeline({ defaults: { ease: 'power2.inOut' } })
        // 1. Viewfinder
        .from('.vf-corner', { scale: 1.6, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06 })
        .from('.hero-guides .v', { scaleY: 0, duration: 0.8, stagger: 0.1 }, '-=0.3')
        .from('.hero-guides .h', { scaleX: 0, duration: 0.8, stagger: 0.1 }, '<0.1')
        .from('.vf-readout', { opacity: 0, x: -8, duration: 0.4 }, '<0.3')
        // 2. Focus hunts across the power points, then locks
        .from('.vf-reticle', { opacity: 0, scale: 0.4, duration: 0.35 }, '-=0.2')
        .to('.vf-reticle', { left: '66.666%', top: '33.333%', duration: 0.55 })
        .to('.vf-reticle', { left: '66.666%', top: '66.666%', duration: 0.45 })
        .to('.vf-reticle', { left: '33.333%', top: '33.333%', duration: 0.6 })
        .to('.vf-reticle', { scale: 0.7, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' })
        .to('.vf-reticle', { borderColor: tok('--accent'), duration: 0.1 }, '<')
        // 3. Shutter
        .to('.vf-shutter', { y: 0, duration: 0.22, ease: 'power4.in' }, '+=0.1')
        .set(['.vf-corner', '.vf-reticle', '.vf-readout', '.hero-guides span'], { autoAlpha: 0 })
        .set(grid, { autoAlpha: 1 })
        .call(() => {
          scrambleTimer = window.setInterval(() => {
            for (const f of fills) if (Math.random() < 0.35) f.textContent = ALPHABET[Math.floor(Math.random() * 26)];
          }, 70);
        })
        .to('.vf-shutter.top', { y: '-101%', duration: 0.5, ease: 'power3.out' }, '+=0.06')
        .to('.vf-shutter.bot', { y: '101%', duration: 0.5, ease: 'power3.out' }, '<')
        // 4. The hidden name sharpens; everything else blurs away
        .call(() => window.clearInterval(scrambleTimer), null, '+=0.7')
        .to(chars, { opacity: 1, color: ink, duration: 0.18, stagger: { each: 0.05, from: 'random' } })
        .to(fills, { opacity: 0, filter: 'blur(10px)', duration: 0.7, stagger: { amount: 0.5, from: 'random' } }, '<0.2')
        // 5. Letters fly home into the headline
        .call(() => {
          const state = Flip.getState(chars);
          goHome();
          flipTween = Flip.from(state, { duration: 1.4, ease: 'power3.inOut', scale: true, stagger: 0.035 });
        }, null, '+=0.15')
        // 6. Guides settle into faint layout lines; the rest of the page arrives
        .to('.hero-guides span', { autoAlpha: 1, backgroundColor: line, duration: 0.8, ease: 'power1.out' }, '+=1.1')
        .set(chars, { clearProps: 'color,opacity' })
        .call(() => {
          try { sessionStorage.setItem(SEEN_KEY, '1'); } catch {}
          finish();
        })
        .to(chrome, { autoAlpha: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08 }, '<');
    }, stage);

    return () => {
      window.clearInterval(scrambleTimer);
      flipTween?.kill();
      ctx.revert();
      gsap.set(chrome, { clearProps: 'all' });
      goHome();
      grid.innerHTML = '';
      document.body.classList.remove('locked');
    };
  }, []);

  return (
    <section className="hero-stage" ref={stageRef} aria-label="Rule of Thirds">
      <div className="hero-guides" aria-hidden="true">
        <span className="v v1" /><span className="v v2" />
        <span className="h h1" /><span className="h h2" />
      </div>

      <p className="eyebrow hero-eyebrow">A creative space — Brooklyn, NY</p>

      <h1 className="hero-title" aria-label="Rule of Thirds">
        {LINES.map((words, li) => (
          <span className="line" aria-hidden="true" key={li}>
            {words.map((w, wi) => (
              <span key={w.text}>
                {wi > 0 && <span className="sp" />}
                <span className="word">
                  {[...w.text].map((letter, i) => (
                    <span className={`ch${w.italic ? ' it' : ''}`} key={i}>{letter}</span>
                  ))}
                </span>
              </span>
            ))}
          </span>
        ))}
      </h1>

      <div className="hero-aside">
        <p className="hero-lede">An exercise in perspective.</p>
        <p>Photography, film, art, and thoughtfully made objects.</p>
      </div>

      <div className="hero-photo">
        <Image
          src="/images/living-staircase.jpg"
          alt="Sunlit interior of the Golden Hour Loft studio"
          fill
          sizes="(max-width: 760px) 0px, 34vw"
          priority
        />
      </div>

      <div className="hero-meta">
        <NycClock />
        <Link href="#about">Scroll</Link>
      </div>

      <div className="intro" id="rot-intro" ref={introRef} aria-hidden="true" suppressHydrationWarning>
        <span className="vf-corner tl" /><span className="vf-corner tr" />
        <span className="vf-corner bl" /><span className="vf-corner br" />
        <span className="vf-reticle" />
        <span className="vf-readout">f/<b>2.8</b>&nbsp; 1/125&nbsp; ISO 400&nbsp; 35mm</span>
        <div className="lg" />
        <span className="vf-shutter top" /><span className="vf-shutter bot" />
      </div>
      <InlineScript html={SKIP_SCRIPT} />
    </section>
  );
}

function NycClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);
  return <span>NYC {time}</span>;
}
