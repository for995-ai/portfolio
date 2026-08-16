import { useEffect, useState } from 'react';
import { useScrollspy } from '@/hooks/useScrollspy';
import { MobileNav } from './MobileNav';
import { scrollToSection } from '@/lib/scrollToSection';

const NAV_LINKS = [
  { href: '#hero',       label: '首頁'   },
  { href: '#about',      label: '簡介'   },
  { href: '#education',  label: '學歷'   },
  { href: '#experience', label: '經歷'   },
  { href: '#projects',   label: '專案'   },
  { href: '#github',     label: 'GitHub' },
  { href: '#research',   label: '研究'   },
  { href: '#awards',     label: '獎項證明' },
  { href: '#leadership', label: '社團服務' },
  { href: '#contact',    label: '聯絡'   },
] as const;

const SECTION_IDS = NAV_LINKS.map(l => l.href.slice(1));


export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const activeId = useScrollspy(SECTION_IDS, '-20% 0px -75% 0px');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 'var(--v2-nav-top, 18px)',
        left: 0,
        right: 0,
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          marginInline: 'auto',
          paddingInline: '20px',
          pointerEvents: 'auto',
        }}
      >
        {/* Pill */}
        <div
          data-nav-pill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 'var(--v2-nav-h, 64px)',
            paddingInline: '18px 14px',
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderRadius: '33px',
            border: '1px solid rgba(230,226,237,0.70)',
            boxShadow: scrolled
              ? '0 4px 24px rgba(23,21,37,0.11), 0 1px 4px rgba(23,21,37,0.06)'
              : '0 2px 12px rgba(23,21,37,0.07), 0 1px 3px rgba(23,21,37,0.04)',
            transition: 'box-shadow 300ms ease',
          }}
        >
          {/* Logo */}
          <a
            href="#hero"
            aria-label="回到頂部"
            onClick={e => { e.preventDefault(); scrollToSection('hero'); }}
            style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: 'var(--v2-purple)',
              textDecoration: 'none',
              flexShrink: 0,
              padding: '6px 10px',
            }}
          >
            SMW
          </a>

          {/* Desktop nav links */}
          <nav aria-label="主要導覽" className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const id = href.slice(1);
              const isActive = activeId === id;
              return (
                <a
                  key={href}
                  href={href}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={e => { e.preventDefault(); scrollToSection(id); }}
                  className="v2-nav-link"
                  style={isActive ? {
                    background: 'var(--v2-lavender)',
                    color: 'var(--v2-purple)',
                    fontWeight: 600,
                  } : undefined}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <div className="lg:hidden">
            <MobileNav links={NAV_LINKS} activeId={activeId} />
          </div>
        </div>
      </div>
    </header>
  );
}
