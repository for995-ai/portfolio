import { useEffect, useRef, useState } from 'react';

interface CountUpOptions {
  /** Final value. Always landed on exactly. */
  value: number;
  /** Total animation time in ms. */
  duration?: number;
  /** Delay after the trigger before counting starts, for a light stagger. */
  delay?: number;
  /** Viewport ratio that starts the animation. */
  threshold?: number;
}

/** Ease-out cubic: quick to begin, settling gently — no overshoot, no bounce. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Counts from 0 to `value` the first time the element enters the viewport.
 *
 * Driven by requestAnimationFrame against elapsed time, so the cost is one
 * frame callback rather than a timer per increment. Runs at most once per page
 * load: the observer disconnects on trigger and a ref guards against React
 * re-renders restarting it. Reduced-motion users get the final value with no
 * animation at all.
 */
export function useCountUp<T extends HTMLElement>({
  value,
  duration = 900,
  delay = 0,
  threshold = 0.4,
}: CountUpOptions) {
  const ref = useRef<T>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || started.current) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Accessibility first: skip the animation entirely.
    if (reduced) {
      started.current = true;
      setDisplay(value);
      return;
    }

    let frame = 0;
    let timer = 0;

    const run = () => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // Round, not floor, so the value never sticks one short at the end.
        setDisplay(Math.round(easeOutCubic(t) * value));
        if (t < 1) {
          frame = requestAnimationFrame(step);
        } else {
          setDisplay(value);   // exact landing
        }
      };
      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (!entry?.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();          // never re-trigger on scroll-back
        timer = window.setTimeout(run, delay);
      },
      { threshold },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [value, duration, delay, threshold]);

  return { ref, display };
}
