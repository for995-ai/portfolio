import { characterInfo } from '@/data/player';
import { Container } from '@/components/v2/primitives';
import { HeroBackdrop } from './HeroBackdrop';
import { heroBackgrounds } from '@/data/heroBackgrounds';

const SCHOOL = '國立聯合大學';
const DEPT   = characterInfo[1].value;        // 資訊管理學系
const EMAIL  = 'for995@gmail.com';

const KEYWORDS = ['UI/UX 設計', '前端互動開發', 'AI 應用'] as const;

// Panel sits on photography when backgrounds exist, on gradient when they don't.
const hasPhoto = heroBackgrounds.length > 0;

function Avatar() {
  return (
    <div
      className="v2-avatar mx-auto"
      style={{
        width: 'clamp(112px, 11.5vw, 142px)',
        height: 'clamp(112px, 11.5vw, 142px)',
        marginBottom: '22px',
        border: '3px solid rgba(255,255,255,0.88)',
        boxShadow: '0 4px 22px rgba(23,21,37,0.16)',
      }}
    >
      <img
        src="/images/profile/optimized/su-ming-wei-avatar.webp"
        alt="蘇洺崴個人照片"
        width={640}
        height={640}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      aria-label="個人首頁"
      className="v2-section relative flex items-center justify-center overflow-hidden"
      style={{
        minHeight: '100svh',
        paddingTop: 'calc(var(--v2-nav-h) + 40px)',
        paddingBottom: '48px',
      }}
    >
      <HeroBackdrop />

      <Container className="relative z-10 w-full">
        {/* Identity panel — content-driven height, no CTAs.
            The photography carries the story; this only establishes who. */}
        <div
          className="mx-auto w-full text-center"
          style={{
            maxWidth: '720px',
            background: hasPhoto ? 'rgba(255,255,255,0.81)' : 'rgba(255,255,255,0.86)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.60)',
            boxShadow: hasPhoto
              ? '0 18px 60px rgba(23,21,37,0.18), 0 2px 8px rgba(23,21,37,0.08)'
              : '0 10px 44px rgba(23,21,37,0.10), 0 1px 4px rgba(23,21,37,0.05)',
            padding: 'clamp(34px, 3.6vw, 52px) clamp(22px, 4.5vw, 56px)',
          }}
        >
          <Avatar />

          {/* Name — lavender highlight block */}
          <h1
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-family-v2-display)',
              fontSize: 'var(--v2-text-hero)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.015em',
              color: 'var(--v2-text)',
              background: 'var(--v2-lavender)',
              padding: '4px 24px 9px',
              borderRadius: '12px',
              borderLeft: '5px solid var(--v2-purple)',
              marginBottom: '12px',
            }}
          >
            蘇洺崴
          </h1>

          {/* Latin name */}
          <p
            className="font-mono text-v2-text-muted"
            style={{
              fontSize: 'clamp(0.8125rem, 1vw, 0.9375rem)',
              letterSpacing: '0.3em',
              marginBottom: '16px',
            }}
          >
            MING WEI SU
          </p>

          {/* School / dept */}
          <p
            style={{
              fontFamily: 'var(--font-family-v2-display)',
              fontSize: 'clamp(0.875rem, 1.15vw, 1.125rem)',
              fontWeight: 600,
              color: 'var(--v2-text-sec)',
              marginBottom: '22px',
            }}
          >
            {SCHOOL}・{DEPT}
          </p>

          {/* Keyword chips */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '9px',
              justifyContent: 'center',
              marginBottom: '22px',
            }}
          >
            {KEYWORDS.map(kw => (
              <span key={kw} className="v2-keyword-chip v2-keyword-chip--hero">{kw}</span>
            ))}
          </div>

          {/* Email — the only interactive element left in the panel */}
          <a
            href={`mailto:${EMAIL}`}
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-family-mono)',
              fontSize: 'clamp(0.8125rem, 1vw, 0.9375rem)',
              color: 'var(--v2-text-sec)',
              letterSpacing: '0.03em',
              textDecoration: 'none',
              borderBottom: '1px solid var(--v2-border)',
              paddingBottom: '2px',
              transition: 'color 150ms ease, border-color 150ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--v2-purple)';
              e.currentTarget.style.borderColor = 'var(--v2-purple)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--v2-text-sec)';
              e.currentTarget.style.borderColor = 'var(--v2-border)';
            }}
          >
            {EMAIL}
          </a>
        </div>
      </Container>
    </section>
  );
}
