import { useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { PixelMark } from '@/components/v2/primitives';
import { MobileNav, type NavLink } from '@/components/v2/MobileNav';
import { useScrollspy } from '@/hooks/useScrollspy';

export const NAV_LINKS: readonly NavLink[] = [
  { id: 'education',  label: 'EDUCATION'  },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'projects',   label: 'PROJECTS'   },
  { id: 'research',   label: 'RESEARCH'   },
  { id: 'skills',     label: 'SKILLS'     },
  { id: 'contact',    label: 'CONTACT'    },
] as const;

const SCROLLSPY_IDS = [
  'profile', 'education', 'experience', 'projects',
  'research', 'skills', 'certifications', 'leadership', 'notes', 'contact',
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeId = useScrollspy(SCROLLSPY_IDS);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const prevOpenRef = useRef(false);

  // Restore focus to the menu button when drawer closes
  useEffect(() => {
    if (prevOpenRef.current && !drawerOpen) {
      menuBtnRef.current?.focus();
    }
    prevOpenRef.current = drawerOpen;
  }, [drawerOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b border-v2-border bg-v2-bg"
        style={{ height: 'var(--v2-nav-h)' }}
      >
        <div className="v2-container flex h-full items-center justify-between">
          {/* Logo */}
          <a
            href="#profile"
            onClick={(e) => { e.preventDefault(); scrollTo('profile'); }}
            className="flex items-center gap-2 font-mono text-sm font-bold tracking-[0.12em] text-v2-text transition-colors duration-150 hover:text-v2-purple-lt"
          >
            <PixelMark>▚</PixelMark>
            SU MING-WEI
          </a>

          {/* Desktop nav */}
          <nav aria-label="主要導覽" className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map(({ id, label }) => {
              const isActive = activeId === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => { e.preventDefault(); scrollTo(id); }}
                  aria-current={isActive ? 'true' : undefined}
                  className={`font-mono text-xs tracking-[0.12em] transition-colors duration-150 ${
                    isActive
                      ? 'text-v2-purple-lt'
                      : 'text-v2-text-muted hover:text-v2-text'
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            ref={menuBtnRef}
            type="button"
            aria-label={drawerOpen ? '關閉選單' : '開啟選單'}
            aria-expanded={drawerOpen}
            aria-controls="v2-mobile-nav"
            onClick={() => setDrawerOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center text-v2-text-sec hover:text-v2-text md:hidden"
          >
            <Menu size={20} aria-hidden />
          </button>
        </div>
      </header>

      <MobileNav
        id="v2-mobile-nav"
        open={drawerOpen}
        activeId={activeId}
        links={NAV_LINKS}
        onClose={() => setDrawerOpen(false)}
        onNavigate={(id) => { scrollTo(id); setDrawerOpen(false); }}
      />
    </>
  );
}
