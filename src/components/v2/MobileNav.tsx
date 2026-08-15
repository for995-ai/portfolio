import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { PixelMark } from '@/components/v2/primitives';

export interface NavLink {
  id: string;
  label: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface MobileNavProps {
  id: string;
  open: boolean;
  activeId: string;
  links: readonly NavLink[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export function MobileNav({ id, open, activeId, links, onClose, onNavigate }: MobileNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Focus first element on open
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  // Esc + Tab focus trap — single handler while open
  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;
      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={containerRef}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="行動導覽選單"
      className="fixed inset-0 z-50 flex flex-col bg-v2-bg"
    >
      {/* Header row — mirrors desktop header height */}
      <div
        className="flex shrink-0 items-center justify-between border-b border-v2-border px-5"
        style={{ height: 'var(--v2-nav-h)' }}
      >
        <span className="flex items-center gap-2 font-mono text-sm font-bold tracking-[0.12em] text-v2-text">
          <PixelMark>▚</PixelMark>
          SU MING-WEI
        </span>
        <button
          ref={closeRef}
          type="button"
          aria-label="關閉選單"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center text-v2-text-sec hover:text-v2-text"
        >
          <X size={20} aria-hidden />
        </button>
      </div>

      {/* Nav links */}
      <nav aria-label="行動導覽" className="flex flex-1 flex-col justify-center px-8">
        {links.map(({ id: linkId, label }) => {
          const isActive = activeId === linkId;
          return (
            <a
              key={linkId}
              href={`#${linkId}`}
              onClick={(e) => { e.preventDefault(); onNavigate(linkId); }}
              aria-current={isActive ? 'true' : undefined}
              className={`flex min-h-[56px] items-center gap-3 border-b font-mono text-sm tracking-[0.1em] transition-colors duration-150 ${
                isActive
                  ? 'border-v2-border text-v2-purple-lt'
                  : 'border-v2-border text-v2-text-sec hover:text-v2-text'
              }`}
            >
              {isActive && <PixelMark className="shrink-0">▸</PixelMark>}
              {label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
