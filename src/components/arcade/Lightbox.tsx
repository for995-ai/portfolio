import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface LightboxImage {
  src: string;
  title: string;
}

interface LightboxProps {
  image: LightboxImage | null;
  onClose: () => void;
}

/**
 * 佐證圖片放大檢視（證照、競賽證明、活動照片）。
 * 行為沿用舊版：Esc 關閉、開啟時鎖捲動、焦點移至關閉鈕、關閉後還原焦點。
 */
export function Lightbox({ image, onClose }: LightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!image) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [image, onClose]);

  if (!image) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[300] grid place-items-center bg-arcade-bg/90 p-4 backdrop-blur-sm md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={`${image.title} 圖片預覽`}
      onClick={onClose}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="關閉圖片預覽"
        className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/40 bg-arcade-panel px-4 py-2 font-mono text-xs font-bold tracking-widest text-arcade-text transition-colors duration-[120ms] hover:bg-arcade-panel-hi"
      >
        <X className="h-4 w-4" aria-hidden="true" />
        關閉
      </button>
      <figure
        className="grid max-h-[88svh] w-fit max-w-[min(94vw,72rem)] gap-3"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={encodeURI(image.src)}
          alt={image.title}
          className="max-h-[78svh] w-auto max-w-full rounded border border-arcade-border bg-arcade-panel object-contain"
        />
        <figcaption className="text-center text-sm text-arcade-muted">
          {image.title}
        </figcaption>
      </figure>
    </div>,
    document.body,
  );
}
