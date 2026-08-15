import { EXPERIENCE, type Experience } from '@/data/portfolioV2';
import { useInView } from '@/hooks/useInView';

// ── Period helpers ────────────────────────────────────────────────────────────

function yearDisplay(period: string): string {
  const [s, e] = period.split('–');
  const sy = s.slice(0, 4);
  if (e === '現在') return `${sy}–`;
  const ey = e.slice(0, 4);
  return sy === ey ? sy : `${sy}–${ey}`;
}

function periodDisplay(period: string): string {
  const [s, e] = period.split('–');
  const fmt = (p: string) => (p === '現在' ? '現在' : p.slice(0, 7));
  return `${fmt(s)} – ${fmt(e)}`;
}

// Overview sentences derived solely from existing tasks — no new facts added
const OVERVIEW: Partial<Record<string, string>> = {
  D2: '參與特展與社群內容相關工作，兼顧活動執行、內容製作與資料整理。',
  D3: '以系統帶班角色協助大學伴班務管理與課輔進度協調。',
};

// ── D1 Primary entry ──────────────────────────────────────────────────────────
//
// Three-item layout for correct cross-viewport ordering:
//   Mobile (flex-col):   meta(1) → content(2)  [date hidden, period inside meta]
//   Desktop (md:grid):   year col-1 | meta col-2 row-1 | content col-2 row-2

function PrimaryEntry({ exp }: { exp: Experience }) {
  // Overview: restatement of existing tasks only — no new facts
  const overview = `參與前端介面製作與 AI 功能整合，工作範圍涵蓋 Wireframe、前端實作與 API 串接。`;

  return (
    <div className="flex flex-col gap-2 py-8 md:grid md:grid-cols-[140px_1fr] md:gap-x-10 md:gap-y-0 md:py-10">

      {/* Meta: position + org + period (mobile) */}
      <div className="order-1 md:col-start-2 md:row-start-1">
        <h3
          className="text-xl font-bold leading-tight text-v2-text md:text-2xl"
          style={{ fontFamily: 'var(--font-family-v2-display)' }}
        >
          {exp.position}
        </h3>
        <p className="mt-1 text-base text-v2-text-sec">{exp.organization}</p>
        {/* Period — mobile only; desktop gets it inside content below */}
        <p className="mt-1 font-mono text-xs tracking-[0.08em] text-v2-text-muted md:hidden">
          {periodDisplay(exp.period)}
        </p>
      </div>

      {/* Year — desktop left column only (hidden on mobile) */}
      <div className="hidden md:col-start-1 md:row-start-1 md:block md:pt-1">
        <p className="whitespace-nowrap font-mono text-sm tracking-[0.06em] text-v2-text-sec">
          {yearDisplay(exp.period)}
        </p>
      </div>

      {/* Content: overview + highlights + skills metadata */}
      <div className="order-2 md:col-start-2 md:row-start-2">
        {/* Period detail — desktop only */}
        <p className="mb-3 hidden font-mono text-xs tracking-[0.08em] text-v2-text-muted md:block">
          {periodDisplay(exp.period)}
        </p>

        <p className="text-sm leading-[1.75] text-v2-text-sec">{overview}</p>

        <ul className="mt-3 space-y-1.5">
          {exp.tasks.map((t, i) => (
            <li key={i} className="flex items-baseline gap-2 text-sm text-v2-text-sec">
              <span className="shrink-0 text-v2-purple-lt" aria-hidden="true">•</span>
              {t}
            </li>
          ))}
        </ul>

        <p className="mt-4 font-mono text-xs tracking-[0.06em] text-v2-text-muted">
          {exp.skills.join(' · ')}
        </p>
      </div>
    </div>
  );
}

// ── Standard expanded entry (D2, D3) ──────────────────────────────────────────

function StandardEntry({ exp, overview }: { exp: Experience; overview?: string }) {
  return (
    <div className="flex flex-col gap-2 py-7 md:grid md:grid-cols-[140px_1fr] md:gap-x-10 md:gap-y-0">

      {/* Meta: position + org + period (mobile) */}
      <div className="order-1 md:col-start-2 md:row-start-1">
        <h3
          className="text-lg font-bold leading-tight text-v2-text"
          style={{ fontFamily: 'var(--font-family-v2-display)' }}
        >
          {exp.position}
        </h3>
        <p className="mt-0.5 text-sm text-v2-text-sec">{exp.organization}</p>
        {/* Period — mobile only */}
        <p className="mt-1 font-mono text-xs tracking-[0.08em] text-v2-text-muted md:hidden">
          {periodDisplay(exp.period)}
        </p>
      </div>

      {/* Year — desktop left column only */}
      <div className="hidden md:col-start-1 md:row-start-1 md:block md:pt-1">
        <p className="whitespace-nowrap font-mono text-sm tracking-[0.06em] text-v2-text-sec">
          {yearDisplay(exp.period)}
        </p>
      </div>

      {/* Tasks + skills */}
      <div className="order-2 md:col-start-2 md:row-start-2">
        {/* Period — desktop only */}
        <p className="mb-3 hidden font-mono text-xs tracking-[0.08em] text-v2-text-muted md:block">
          {periodDisplay(exp.period)}
        </p>
        {overview && (
          <p className="mb-3 text-sm leading-[1.75] text-v2-text-sec">{overview}</p>
        )}
        <ul className="space-y-1.5">
          {exp.tasks.map((t, i) => (
            <li key={i} className="flex items-baseline gap-2 text-sm text-v2-text-sec">
              <span className="shrink-0 text-v2-text-muted" aria-hidden="true">•</span>
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-3 font-mono text-xs tracking-[0.06em] text-v2-text-muted">
          {exp.skills.join(' · ')}
        </p>
      </div>
    </div>
  );
}

// ── Compact entry (D4) ────────────────────────────────────────────────────────
//
// Two-item layout. Mobile: org/position/tasks first, year below.
// Desktop: year left col, content right col.

function CompactEntry({ exp }: { exp: Experience }) {
  return (
    <div className="flex flex-col gap-1 py-5 md:grid md:grid-cols-[140px_1fr] md:gap-x-10">
      {/* Year — mobile: below content (order-2); desktop: left col */}
      <p className="order-2 font-mono text-xs tracking-[0.06em] text-v2-text-muted md:order-1 md:pt-0.5 md:whitespace-nowrap">
        {yearDisplay(exp.period)}
      </p>
      {/* Content */}
      <div className="order-1 md:order-2">
        <p
          className="font-bold leading-tight text-v2-text-sec"
          style={{ fontFamily: 'var(--font-family-v2-display)' }}
        >
          {exp.organization}
        </p>
        <p className="text-sm text-v2-text-sec">{exp.position}</p>
        <ul className="mt-2 space-y-0.5">
          {exp.tasks.map((t, i) => (
            <li key={i} className="text-sm text-v2-text-muted">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Main Experience component ──────────────────────────────────────────────────
// PortfolioV2 wraps this in <Section id="experience"> + <Container>.

export function Experience() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05 });

  return (
    <div ref={ref} className={`v2-reveal ${inView ? 'is-visible' : ''}`}>
      {EXPERIENCE.map((exp, idx) => {
        const isPrimary = exp.featuredRank === 1;
        const isCompact = exp.displayLevel === 'standard';

        return (
          <div key={exp.id}>
            {idx > 0 && <div className="h-px bg-v2-border" />}
            {isPrimary ? (
              <PrimaryEntry exp={exp} />
            ) : isCompact ? (
              <CompactEntry exp={exp} />
            ) : (
              <StandardEntry exp={exp} overview={OVERVIEW[exp.id]} />
            )}
          </div>
        );
      })}
    </div>
  );
}
