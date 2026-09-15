import { useCallback, useEffect, useMemo, useState } from 'react';
import { publicUrl } from '@/lib/publicUrl';
import { ResilientImage } from './ResilientImage';
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
 * Only current + next are mounted at rest; the outgoing slide remains mounted
 * briefly during a crossfade. The timer starts only after the next photo has
 * loaded, so a slow first visit never advances onto an unpainted layer.
 *
 * The whole backdrop is decorative: the container is aria-hidden and every
 * image carries an empty alt, so a screen reader never announces nine
 * background photos.
 */
export function HeroBackdrop() {
  const slides = heroBackgrounds;
  const [index, setIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set());
  const [failed, setFailed] = useState<Set<number>>(() => new Set());
  const [reduced, setReduced] = useState(false);

  const markLoaded = useCallback((slideIndex: number) => {
    setLoaded(current => {
      if (current.has(slideIndex)) return current;
      const next = new Set(current);
      next.add(slideIndex);
      return next;
    });
  }, []);

  const markFailed = useCallback((slideIndex: number) => {
    setFailed(current => {
      if (current.has(slideIndex)) return current;
      const next = new Set(current);
      next.add(slideIndex);
      return next;
    });
  }, []);

  const nextIndex = useMemo(() => {
    if (slides.length < 2) return null;

    for (let offset = 1; offset < slides.length; offset += 1) {
      const candidate = (index + offset) % slides.length;
      if (!failed.has(candidate)) return candidate;
    }

    return null;
  }, [failed, index, slides.length]);

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

  // Advance only after the next photo has really loaded. The old implementation
  // advanced on a fixed interval even when a slow first visit had not finished
  // downloading the next slide, which exposed an empty/broken layer.
  useEffect(() => {
    if (reduced || nextIndex === null || !loaded.has(nextIndex)) return;

    const id = window.setTimeout(() => {
      setPreviousIndex(index);
      setIndex(nextIndex);
    }, failed.has(index) ? 250 : HERO_SLIDE_INTERVAL_MS);

    return () => window.clearTimeout(id);
  }, [failed, index, loaded, nextIndex, reduced]);

  // The outgoing layer is needed only for the duration of the crossfade. This
  // keeps the normal steady state to two mounted/requested photos: current + next.
  useEffect(() => {
    if (previousIndex === null) return;
    const id = window.setTimeout(
      () => setPreviousIndex(null),
      HERO_FADE_DURATION_MS + 100,
    );
    return () => window.clearTimeout(id);
  }, [previousIndex]);

  // Mounted window: outgoing (during fade), current, and next.
  const mounted = useMemo(() => {
    if (slides.length === 0) return [];
    if (reduced || slides.length === 1) return [0];
    return [...new Set([previousIndex, index, nextIndex].filter((i): i is number => i !== null))];
  }, [index, nextIndex, previousIndex, reduced, slides.length]);

  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Gradient base — the fallback cover, and the backstop behind photos */}
      <div className="v2-hero-mesh" style={{ position: 'absolute', inset: 0 }} />

      {mounted.map(i => {
        const slide = slides[i];
        const isCurrent = i === index;
        const isNext = i === nextIndex;

        return (
          <div
            key={slide.src}
            className="v2-hero-slide"
            style={{
              opacity: isCurrent ? 1 : 0,
              transition: reduced ? 'none' : `opacity ${HERO_FADE_DURATION_MS}ms ease-in-out`,
            }}
          >
            <ResilientImage
              src={publicUrl(slide.src)}
              alt=""
              width={1600}
              height={1067}
              loading={isCurrent || isNext ? 'eager' : 'lazy'}
              decoding="async"
              // Only the visible photo competes with the avatar/app shell.
              {...{ fetchpriority: isCurrent ? 'high' : 'low' }}
              fallback={null}
              onLoad={() => markLoaded(i)}
              onPermanentError={() => markFailed(i)}
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
