import { BubbleLink } from '@/components/v2/primitives';
import { scrollToSection, scrollToTop } from '@/lib/scrollToSection';

// Dark 4-column footer — no phone, no full address, no birthday

const GITHUB_URL  = 'https://github.com/for995-ai';
const GITHUB_USER = 'for995-ai';
const EMAIL       = 'for995@gmail.com';

const CTA_HEADLINE = '一起把想法做成能被使用的體驗。';
const CTA_DESC     = '如果你想交流 UI/UX、前端、AI 應用或互動學習專案，歡迎聯絡。';

interface Col {
  heading: string;
  items: { label: string; href?: string; external?: boolean }[];
}

const COLUMNS: Col[] = [
  {
    heading: '聯絡方式',
    items: [
      { label: EMAIL,                    href: `mailto:${EMAIL}`, external: true },
      { label: `GitHub: ${GITHUB_USER}`, href: GITHUB_URL,        external: true },
      { label: '苗栗・台灣' },
    ],
  },
  {
    heading: '代表專案',
    items: [
      { label: '跟著龍走',        href: '#projects' },
      { label: '星空探險',        href: '#projects' },
      { label: '相簿滑滑整理 APP', href: '#projects' },
    ],
  },
  {
    heading: '目前主軸',
    items: [
      { label: 'UI/UX' },
      { label: 'Frontend' },
      { label: 'AI × Interactive Learning' },
    ],
  },
  {
    heading: '網站導覽',
    items: [
      { label: '學歷',      href: '#education'  },
      { label: '經歷',      href: '#experience' },
      { label: '專案',      href: '#projects'   },
      { label: '研究與實作', href: '#research'   },
    ],
  },
];

const LINK_IDLE   = 'rgba(255,255,255,0.55)';
const LINK_ACTIVE = 'rgba(255,255,255,0.88)';


function FooterItem({ item }: { item: Col['items'][number] }) {
  const baseStyle: React.CSSProperties = {
    fontSize: '0.8125rem',
    color: LINK_IDLE,
    fontFamily: 'var(--font-family-v2-display)',
    lineHeight: 1.6,
  };

  if (!item.href) {
    return <span style={baseStyle}>{item.label}</span>;
  }

  const hover = {
    onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.currentTarget.style.color = LINK_ACTIVE;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.currentTarget.style.color = LINK_IDLE;
    },
  };

  if (item.external) {
    return (
      <a
        href={item.href}
        target={item.href.startsWith('mailto:') ? undefined : '_blank'}
        rel={item.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
        style={{ ...baseStyle, textDecoration: 'none', transition: 'color 150ms ease' }}
        {...hover}
      >
        {item.label}
      </a>
    );
  }

  return (
    <a
      href={item.href}
      onClick={e => { e.preventDefault(); scrollToSection(item.href!.slice(1)); }}
      style={{ ...baseStyle, textDecoration: 'none', transition: 'color 150ms ease' }}
      {...hover}
    >
      {item.label}
    </a>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="v2-footer-dark" style={{ paddingTop: '56px', paddingBottom: '32px' }}>
      <div className="v2-container">
        {/* CTA block */}
        <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
          <p
            style={{
              fontFamily: 'var(--font-family-v2-display)',
              fontSize: 'clamp(1.25rem, 2.4vw, 1.625rem)',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.4,
              marginBottom: '10px',
            }}
          >
            {CTA_HEADLINE}
          </p>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '24px' }}>
            {CTA_DESC}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <BubbleLink variant="primary" href={`mailto:${EMAIL}`}>
              Email
            </BubbleLink>
            <BubbleLink
              variant="soft"
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </BubbleLink>
          </div>
        </div>

        {/* 4 columns — desktop 4, tablet 2×2, mobile stack */}
        <div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4"
          style={{ paddingBottom: '36px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          {COLUMNS.map(col => (
            <div key={col.heading}>
              <p
                style={{
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                {col.heading}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {col.items.map(item => (
                  <li key={item.label}>
                    <FooterItem item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <p
            style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.28)',
              letterSpacing: '0.06em',
            }}
          >
            © 2026 蘇洺崴 MING WEI SU
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.28)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              transition: 'color 150ms ease',
              padding: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.60)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.28)'; }}
          >
            ↑ 回到頂部
          </button>
        </div>
      </div>
    </footer>
  );
}
