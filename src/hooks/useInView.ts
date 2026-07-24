import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  /** 進入視窗一次後即停止觀察（預設 true） */
  once?: boolean;
  threshold?: number | number[];
  rootMargin?: string;
}

/**
 * IntersectionObserver 進場偵測 hook（全站禁止監聽 scroll 事件，一律用此 hook）。
 */
export function useInView<T extends HTMLElement>(options: UseInViewOptions = {}) {
  const { once = true, threshold = 0.2, rootMargin } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once, rootMargin]);

  return { ref, inView };
}

/** 是否處於使用者要求減少動態的環境 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
