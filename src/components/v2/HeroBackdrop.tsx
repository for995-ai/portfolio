import { useEffect, useMemo, useState } from 'react';
import {
  heroBackgrounds,
  HERO_SLIDE_INTERVAL_MS,
  HERO_FADE_DURATION_MS,
} from '@/data/heroBackgrounds';

/**
 * Full-bleed Hero backdrop.
 *
 * Renders the gradient mesh when no photos are configured, a static image for
 * one photo, and an automatic crossfade slideshow for two or more.
 *
 * Only a three-slide window (previous / current / next) is mounted at a time,
 * so a nine-photo cover never puts nine full-size JPEGs in the document. The
 * outgoing slide stays mounted as "previous", which is what keeps the
 * crossfade intact, and the slide after next is warmed with an off-DOM
 * `Image()` so a transition never lands on an unpainted layer.
 *
 * The whole backdrop is decorative: the container is aria-hidden and every
 * image carries an empty alt, so a screen reader never announces nine
 * background photos.
 */
export function HeroBackdrop() {
  const slides = heroBackgrounds;
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  // Respect prefers-reduced-motion, and react to live changes.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Reduced motion parks on the first photo — genuinely no advancing, not
  // merely a disabled transition.
  useEffect(() => {
    if (reduced) setIndex(0);
  }, [reduced]);

  // Auto-advance.
  useEffect(() => {
    if (slides.length < 2 || reduced) return;
    const id = window.setInterval(
      () => setIndex(i => (i + 1) % slides.length),
      HERO_SLIDE_INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [slides.length, reduced]);

  // Warm the slide after next, so the next crossfade has it decoded already.
  useEffect(() => {
    if (slides.length < 3 || reduced) return;
    const img = new Image();
    img.src = slides[(index + 2) % slides.length].src;
  }, [index, slides, reduced]);

  // Mounted window: previous, current, next.
  const mounted = useMemo(() => {
    const n = slides.length;
    if (n === 0) return [];
    if (reduced || n === 1) return [0];
    if (n === 2) return [0, 1];
    return [(index - 1 + n) % n, index, (index + 1) % n];
  }, [index, slides.length, reduced]);

  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Gradient base — the fallback cover, and the backstop behind photos */}
      <div className="v2-hero-mesh" style={{ position: 'absolute', inset: 0 }} />

      {mounted.map(i => {
        const slide = slides[i];
        const isCurrent = i === index;
        // First paint gets priority; every other slide loads lazily.
        const isFirst = i === 0;

        return (
          <div
            key={slide.src}
            className="v2-hero-slide"
            style={{
              opacity: isCurrent ? 1 : 0,
              transition: reduced ? 'none' : `opacity ${HERO_FADE_DURATION_MS}ms ease-in-out`,
            }}
          >
            <img
              src={slide.src}
              alt=""
              loading={isFirst ? 'eager' : 'lazy'}
              decoding="async"
              // lowercase DOM attribute — React 18 does not map the camelCase form
              {...{ fetchpriority: isFirst ? 'high' : 'low' }}
              className="v2-hero-photo"
              style={{
                ['--hero-pos' as string]: slide.position ?? 'center',
                ['--hero-pos-mobile' as string]:
                  slide.mobilePosition ?? slide.position ?? 'center',
                filter: slide.brightness ? `brightness(${slide.brightness})` : undefined,
              }}
            />
            {/* Readability scrim, per-slide so exposure can be tuned per photo.
                Passed as a multiplier into the gradient alphas — not as
                `opacity`, which clamps at 1 and would drop values above it. */}
            <div
              className="v2-hero-overlay"
              style={{ ['--scrim' as string]: slide.overlayStrength ?? 1 }}
            />
          </div>
        );
      })}
    </div>
  );
}
