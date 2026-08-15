import { characterInfo } from '@/data/player';
import { COMPETITIONS, PROFILE_PILLARS } from '@/data/portfolioData';
import { quests } from '@/data/quests';
import { Container, LinkButton, PixelMark } from '@/components/v2/primitives';

// Verified from git user config — update if GitHub username differs
const GITHUB_URL = 'https://github.com/for995-ai';

// School name is established project fact; not in data/*.ts so hardcoded here
const SCHOOL = '國立聯合大學';

// Proof values derived from real data:
//   quests.length              → quests.ts array count
//   COMPETITIONS.length        → portfolioData.ts COMPETITIONS
//   '1'                        → quests[0].badge: 已發表於 2026 前瞻管理學術與產業趨勢研討會
//   '150'                      → savePoints[0].period: 累積 150 小時
const PROOF = [
  { value: String(quests.length),       label: '件作品'  },
  { value: String(COMPETITIONS.length), label: '項競賽'  },
  { value: '1',                         label: '篇研討會' },
  { value: '150',                       label: '小時課輔' },
] as const;

// positioning from player.ts characterInfo[0]
const positioning = characterInfo[0].value; // 文化科技 × 互動學習研究者
// supporting from portfolioData.ts
const supporting = PROFILE_PILLARS.join('・');  // 前端互動開發・UI/UX 設計・AI 輔助體驗
// location from player.ts characterInfo[2]
const location = characterInfo[2].value.replace(' / ', '・'); // 苗栗・台灣

function PhotoFrame({ className = '' }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden border-[3px] border-v2-text-faint bg-v2-panel ${className}`}
      style={{ borderRadius: 'var(--v2-radius-sm)', boxShadow: 'var(--v2-shadow)' }}
    >
      <picture>
        <source srcSet="/images/su-ming-wei-web.webp" type="image/webp" />
        <img
          src="/images/su-ming-wei.png"
          alt="蘇洺崴 SU MING-WEI"
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
        />
      </picture>
    </div>
  );
}

function SchoolMeta() {
  return (
    <dl className="space-y-1.5">
      <dd className="font-mono text-xs tracking-[0.1em] text-v2-text-sec">{SCHOOL}</dd>
      <dd className="font-mono text-xs tracking-[0.1em] text-v2-text-sec">{characterInfo[1].value}</dd>
      <dd className="font-mono text-xs tracking-[0.1em] text-v2-text-muted">{location}</dd>
    </dl>
  );
}

export function Hero() {
  return (
    <section
      id="profile"
      className="v2-section pb-10 pt-14 md:pb-16 md:pt-20"
      aria-label="Profile"
    >
      <Container>
        {/* Pixel identity mark */}
        <PixelMark className="mb-6 block tracking-[0.15em] text-v2-text-muted">
          00 ▚
        </PixelMark>

        {/* Two-column grid: text left / photo right */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[3fr_2fr] md:items-start md:gap-12">

          {/* ── Left: text content ── */}
          <div>
            {/* Mobile: name + small photo in one row */}
            <div className="flex items-start justify-between gap-4 md:block">
              <div>
                <h1
                  className="font-bold leading-[1.1] text-v2-text"
                  style={{
                    fontFamily: 'var(--font-family-v2-display)',
                    fontSize: 'clamp(2.5rem, 6vw, 3.75rem)',
                  }}
                >
                  蘇洺崴
                </h1>
                <p className="mt-2 font-mono text-sm tracking-[0.22em] text-v2-text-muted">
                  SU MING-WEI
                </p>
              </div>
              {/* Mobile-only small photo (80×80) */}
              <PhotoFrame className="h-20 w-20 shrink-0 md:hidden" />
            </div>

            {/* Positioning */}
            <p
              className="mt-5 text-lg leading-snug text-v2-text-sec md:text-xl"
              style={{ fontFamily: 'var(--font-family-v2-display)' }}
            >
              {positioning}
            </p>

            {/* Supporting / pillars */}
            <p className="mt-2 text-base text-v2-text-sec">
              {supporting}
            </p>

            {/* Mobile-only school meta */}
            <div className="mt-5 md:hidden">
              <SchoolMeta />
            </div>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap gap-3">
              {/* Primary */}
              <LinkButton
                variant="primary"
                href="#projects"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  const el = document.getElementById('projects');
                  if (!el) return;
                  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
                }}
              >
                查看作品 ▶
              </LinkButton>

              {/* Tertiary — GitHub */}
              <LinkButton
                variant="ghost"
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </LinkButton>
            </div>
          </div>

          {/* ── Right: desktop photo + school info ── */}
          <div className="hidden md:block">
            <PhotoFrame className="h-[260px] w-[260px]" />
            <div className="mt-5">
              <SchoolMeta />
            </div>
          </div>
        </div>

        {/* ── Proof strip ── */}
        <div className="mt-10 border-t border-v2-border pt-7 md:mt-14">
          <div className="flex flex-wrap gap-6 md:gap-10">
            {PROOF.map(({ value, label }) => (
              <div key={label}>
                <p className="font-mono text-2xl font-bold leading-none text-v2-text md:text-3xl">
                  {value}
                </p>
                <p className="mt-1.5 text-xs tracking-widest text-v2-text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
