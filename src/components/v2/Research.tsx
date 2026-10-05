import { RESEARCH, type Research as ResearchEntry } from '@/data/portfolioV2';
import { publicUrl } from '@/lib/publicUrl';
import { useInView } from '@/hooks/useInView';

const BANNER = {
  title: '從系統實作走向研究驗證',
  desc:  '聚焦文化科技、互動學習、UI/UX 與 AI 應用，將實作成果延伸為可驗證、可持續發展的研究與學習經驗。',
};

// ── Banner ────────────────────────────────────────────────────────────────────

function ResearchBanner() {
  return (
    <div
      style={{
        background: 'var(--v2-surface)',
        border: '1px solid var(--v2-border)',
        borderLeft: '4px solid var(--v2-purple)',
        borderRadius: 'var(--radius-card)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-xs)',
        marginBottom: '32px',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-family-v2-display)',
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--v2-text)',
          lineHeight: 1.35,
          marginBottom: '8px',
        }}
      >
        {BANNER.title}
      </h3>
      <p style={{ fontSize: '0.8125rem', color: 'var(--v2-text-sec)', lineHeight: 1.7 }}>
        {BANNER.desc}
      </p>
    </div>
  );
}

// Each conference supplies its own overview, bullets, metadata and documents.
function ResearchCardItem({ card }: { card: ResearchEntry }) {
  return (
    <details className="v2-card v2-research-details" style={{ padding: '20px 22px', boxShadow: 'var(--shadow-xs)' }}>
      <summary className="v2-research-summary">
        <span style={{ color: 'var(--v2-purple)', fontSize: '0.75rem', fontWeight: 700 }}>{card.chip}</span>
        <span className="v2-research-arrow" aria-hidden>⌄</span>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, lineHeight: 1.5, margin: '14px 24px 14px 0' }}>{card.title}</h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--v2-text-sec)', lineHeight: 1.65 }}>{card.content}</p>
        <p style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.68rem', color: 'var(--v2-text-muted)', marginTop: 10 }}>{card.footer}</p>
        <span className="v2-research-open-label">展開研究摘要</span>
        <span className="v2-research-close-label">收合研究摘要</span>
      </summary>
      <div style={{ borderTop: '1px solid var(--v2-border)', marginTop: 18, paddingTop: 18, fontSize: '0.8125rem', lineHeight: 1.8, color: 'var(--v2-text-sec)' }}>
        <h4 style={{ color: 'var(--v2-text)', fontWeight: 700, marginBottom: 8 }}>研究概覽</h4>
        <p>{card.overview}</p>
        <ul style={{ paddingLeft: 20, margin: '12px 0' }}>
          {card.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}
        </ul>
        <p style={{ fontSize: '0.75rem' }}>以上依本篇研討會論文整理。</p>
        <ul style={{ paddingLeft: 20, margin: '12px 0 18px' }}>
          {card.meta.map(item => <li key={item.label}>{item.label}：{item.value}</li>)}
        </ul>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {card.links.map(link => (
            <a
              key={link.path}
              href={publicUrl(link.path)}
              target="_blank"
              rel="noopener noreferrer"
              className="v2-bubble-btn v2-bubble-btn--soft"
              style={{ maxWidth: '100%', whiteSpace: 'normal', textAlign: 'center' }}
            >
              {link.label}↗
            </a>
          ))}
        </div>
      </div>
    </details>
  );
}

export function Research() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05 });

  return (
    <div ref={ref} className={`v2-reveal ${inView ? 'is-visible' : ''}`}>
      <ResearchBanner />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2" style={{ alignItems: 'start' }}>
        {RESEARCH.map(card => (
          <ResearchCardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
