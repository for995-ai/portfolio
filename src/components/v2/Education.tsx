import { EDUCATION } from '@/data/portfolioV2';
import { useInView } from '@/hooks/useInView';

// Rank: confirmed from enrollment records — not in portfolioV2.ts type
const NUU_RANK = '班排 15/37';

// Grade highlights — static, verified from transcripts
const GRADE_TREND  = '學業平均 64.05 → 84.38';
const GRADE_DETAIL = ['資料庫系統設計 90', '程式設計 90', '資訊管理導論 91'];
const HS_NOTES     = ['奠定資訊與商業基礎', '從資料處理延伸至資訊管理、系統開發與 UI/UX'];

// ── Card shell ────────────────────────────────────────────────────────────────

function EduCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="v2-card"
      style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column' }}
    >
      {children}
    </div>
  );
}

// ── University card (EDUCATION[0]) ────────────────────────────────────────────

function UniversityCard({ edu }: { edu: (typeof EDUCATION)[0] }) {
  const [start, end] = edu.period.split('–');
  const period = `${start.slice(0, 7)} — ${end.slice(0, 7)}`;

  return (
    <EduCard>
      {/* Header row: org + rank chip */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h3
            style={{
              fontFamily: 'var(--font-family-v2-display)',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--v2-text)',
              lineHeight: 1.25,
            }}
          >
            {edu.organization}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--v2-text-sec)', marginTop: '3px' }}>
            {edu.department}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: '0.72rem',
              color: 'var(--v2-text-muted)',
              letterSpacing: '0.06em',
              marginTop: '6px',
            }}
          >
            {period}
          </p>
        </div>
        <span
          style={{
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '999px',
            padding: '3px 12px',
            background: 'var(--v2-lavender)',
            color: 'var(--v2-purple)',
            border: '1px solid rgba(116,87,232,0.15)',
            fontFamily: 'var(--font-family-mono)',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}
        >
          {NUU_RANK}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--v2-border)', margin: '16px 0' }} />

      {/* Grade summary */}
      <p
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: '0.875rem',
          fontWeight: 700,
          color: 'var(--v2-text)',
          letterSpacing: '0.04em',
          marginBottom: '8px',
        }}
      >
        {GRADE_TREND}
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {GRADE_DETAIL.map(g => (
          <li key={g} style={{ fontSize: '0.8125rem', color: 'var(--v2-text-sec)' }}>
            {g}
          </li>
        ))}
      </ul>
    </EduCard>
  );
}

// ── High school card (EDUCATION[1]) ───────────────────────────────────────────

function HighSchoolCard({ edu }: { edu: (typeof EDUCATION)[0] }) {
  const [start, end] = edu.period.split('–');
  const period = `${start.slice(0, 7)} — ${end.slice(0, 7)}`;

  return (
    <EduCard>
      {/* Header */}
      <div>
        <h3
          style={{
            fontFamily: 'var(--font-family-v2-display)',
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--v2-text)',
            lineHeight: 1.25,
          }}
        >
          {edu.organization}
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--v2-text-sec)', marginTop: '3px' }}>
          {edu.department}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-family-mono)',
            fontSize: '0.72rem',
            color: 'var(--v2-text-muted)',
            letterSpacing: '0.06em',
            marginTop: '6px',
          }}
        >
          {period}
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--v2-border)', margin: '16px 0' }} />

      {/* Notes */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {HS_NOTES.map(n => (
          <li key={n} style={{ fontSize: '0.8125rem', color: 'var(--v2-text-sec)', lineHeight: 1.6 }}>
            {n}
          </li>
        ))}
      </ul>
    </EduCard>
  );
}

// ── Main Education component ──────────────────────────────────────────────────

export function Education() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`v2-reveal ${inView ? 'is-visible' : ''} grid grid-cols-1 gap-5 md:grid-cols-2`}
    >
      {EDUCATION[0] && <UniversityCard edu={EDUCATION[0]} />}
      {EDUCATION[1] && <HighSchoolCard edu={EDUCATION[1]} />}
    </div>
  );
}
