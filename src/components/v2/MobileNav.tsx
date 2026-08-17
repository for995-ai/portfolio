import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { scrollToSection } from '@/lib/scrollToSection';

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: readonly NavLink[];
  activeId: string;
}

const CLOSE_MS = 200;

/**
 * Mobile navigation — a fold-out panel that drops from under the floating nav
 * pill, matching the light, rounded surface language used elsewhere. It is
 * deliberately not a side drawer or full-screen overlay.
 *
 * The panel is only mounted while open (plus its closing animation), so its
 * links never sit in the tab order behind the page.
 */
export function MobileNav({ links, activeId }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);   // keeps the panel alive during close
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const close = useCallback(() => setOpen(false), []);

  // Mount on open; unmount only after the close animation has finished.
  useEffect(() => {
    window.clearTimeout(closeTimer.current);
    if (open) {
      setMounted(true);
    } else if (mounted) {
      closeTimer.current = window.setTimeout(() => setMounted(false), CLOSE_MS);
    }
    return () => window.clearTimeout(closeTimer.current);
  }, [open, mounted]);

  // Lock background scrolling while the panel is open, and always release it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  // Escape closes; Tab is trapped inside the panel.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button');
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      // The toggle sits outside the panel, so wrap from either end.
      if (e.shiftKey && (active === first || active === buttonRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Move focus into the panel on open, and back to the toggle on close.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      const first = panelRef.current?.querySelector<HTMLElement>('a[href]');
      first?.focus();
    } else if (wasOpen.current) {
      buttonRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open, mounted]);

  return (
    <>
      {/* Hamburger toggle — morphs to ✕ */}
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? '關閉導覽選單' : '開啟導覽選單'}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen(v => !v)}
        className="v2-burger"
      >
        <span className="v2-burger-bar" data-open={open} />
        <span className="v2-burger-bar" data-open={open} />
        <span className="v2-burger-bar" data-open={open} />
      </button>

      {/* Portalled to <body>: the nav pill uses backdrop-filter, which would
          otherwise become the containing block for position:fixed children and
          offset the panel by the pill's own position. */}
      {mounted && createPortal(
        <>
          {/* Backdrop — click to dismiss */}
          <div
            aria-hidden
            onClick={close}
            className="v2-mobile-backdrop"
            data-open={open}
          />

          {/* Fold-out panel, aligned to the nav pill's edges */}
          <div
            ref={panelRef}
            id="mobile-nav-panel"
            className="v2-mobile-panel"
            data-open={open}
          >
            <nav aria-label="行動版導覽">
              <ul>
                {links.map(({ href, label }) => {
                  const id = href.slice(1);
                  const isActive = activeId === id;
                  return (
                    <li key={href}>
                      <a
                        href={href}
                        aria-current={isActive ? 'location' : undefined}
                        className="v2-mobile-link"
                        data-active={isActive}
                        onClick={e => {
                          e.preventDefault();
                          close();
                          // Let the scroll lock release before scrolling.
                          window.setTimeout(() => scrollToSection(id), 60);
                        }}
                      >
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </>,
        document.body,
      )}
    </>
  );
}
