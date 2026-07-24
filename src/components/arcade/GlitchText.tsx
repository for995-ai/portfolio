import { useEffect, useState, type ElementType, type ReactNode } from 'react';
import { prefersReducedMotion, useInView } from '@/hooks/useInView';

interface GlitchTextProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** 進入視窗時自動觸發一次 glitch（預設 true） */
  autoTrigger?: boolean;
}

/** RGB 分離 glitch 文字：hover 觸發、進場觸發一次，單次 ≤300ms */
export function GlitchText({
  children,
  as: Tag = 'span',
  className = '',
  autoTrigger = true,
}: GlitchTextProps) {
  const { ref, inView } = useInView<HTMLElement>();
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    if (!inView || !autoTrigger || prefersReducedMotion()) return;
    setGlitching(true);
    const timer = setTimeout(() => setGlitching(false), 300);
    return () => clearTimeout(timer);
  }, [inView, autoTrigger]);

  const trigger = () => {
    if (glitching || prefersReducedMotion()) return;
    setGlitching(true);
    setTimeout(() => setGlitching(false), 300);
  };

  return (
    <Tag
      ref={ref}
      onMouseEnter={trigger}
      className={`inline-block ${glitching ? 'arcade-text-glitch' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
