import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { prefersReducedMotion } from '@/hooks/useInView';

/**
 * 全頁滾動進度（0–1）。
 * 以 requestAnimationFrame 迴圈讀取 window.scrollY（禁止 scroll 事件監聽），
 * 頁面不可見（document.hidden）時暫停迴圈；數值未變時不觸發 re-render。
 * prefers-reduced-motion 時不啟動迴圈（進度恆為 0，碎片走靜態呈現）。
 */
const ScrollProgressContext = createContext(0);

export function ScrollProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let raf = 0;
    let last = -1;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      if (Math.abs(p - last) > 0.0004) {
        last = p;
        setProgress(p);
      }
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    document.addEventListener('visibilitychange', onVisibility);
    if (!document.hidden) start();

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      stop();
    };
  }, []);

  return (
    <ScrollProgressContext.Provider value={progress}>
      {children}
    </ScrollProgressContext.Provider>
  );
}

export function useScrollProgress(): number {
  return useContext(ScrollProgressContext);
}
