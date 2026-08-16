import { useState, useEffect, useRef } from 'react';

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: readonly NavLink[];
  activeId: string;
}

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}

export function MobileNav({ links, activeId }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* Hamburger toggle */}
      <button
        type="button"
        aria-label={open ? '關閉選單' : '開啟選單'}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen(v => !v)}
        style={{
          width: 38,
          height: 38,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '10px',
          padding: '6px',
        }}
      >
        <span
          style={{
            display: 'block',
            width: 20,
            height: 1.5,
            background: 'var(--v2-text)',
            borderRadius: 2,
            transformOrigin: 'center',
            transition: 'transform 200ms ease, opacity 200ms ease',
            transform: open ? 'translateY(6.5px) rotate(45deg)' : 'none',
          }}
        />
        <span
          style={{
            display: 'block',
            width: 20,
            height: 1.5,
            background: 'var(--v2-text)',
            borderRadius: 2,
            transition: 'opacity 200ms ease',
            opacity: open ? 0 : 1,
          }}
        />
        <span
          style={{
            display: 'block',
            width: 20,
            height: 1.5,
            background: 'var(--v2-text)',
            borderRadius: 2,
            transformOrigin: 'center',
            transition: 'transform 200ms ease, opacity 200ms ease',
            transform: open ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
          }}
        />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            background: 'rgba(23,21,37,0.38)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        id="mobile-nav-drawer"
        role="dialog"
        aria-label="行動選單"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          width: 'min(280px, 80vw)',
          background: 'var(--v2-surface)',
          boxShadow: '-4px 0 32px rgba(23,21,37,0.14)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 260ms ease-out',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px 32px',
          overflowY: 'auto',
        }}
      >
        {/* Drawer header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <span
            style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: 'var(--v2-purple)',
            }}
          >
            SMW
          </span>
          <button
            type="button"
            aria-label="關閉選單"
            onClick={() => setOpen(false)}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '1px solid var(--v2-border)',
              background: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              color: 'var(--v2-text-sec)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav aria-label="行動導覽" style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {links.map(({ href, label }) => {
              const id = href.slice(1);
              const isActive = activeId === id;
              return (
                <li key={href}>
                  <a
                    href={href}
                    aria-current={isActive ? 'location' : undefined}
                    onClick={e => {
                      e.preventDefault();
                      setOpen(false);
                      setTimeout(() => scrollTo(id), 80);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-family-v2-display)',
                      fontSize: '0.9375rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--v2-purple)' : 'var(--v2-text-sec)',
                      background: isActive ? 'var(--v2-lavender)' : 'transparent',
                      transition: 'background 140ms ease, color 140ms ease',
                    }}
                  >
                    {isActive && (
                      <span
                        aria-hidden
                        style={{ width: 4, height: 4, borderRadius: 1, background: 'var(--v2-purple)', flexShrink: 0 }}
                      />
                    )}
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
