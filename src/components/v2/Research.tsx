import { publicUrl } from '@/lib/publicUrl';
import { useInView } from '@/hooks/useInView';

// ── Static research items — confirmed from actual work ────────────────────────

const BANNER = {
  title: '從系統實作走向研究驗證',
  desc:  '聚焦文化科技、互動學習、UI/UX 與 AI 應用，將實作成果延伸為可驗證、可持續發展的研究與學習經驗。',
};

interface ResearchCard {
  chip:    string;
  title:   string;
  content: string;
  footer:  string;
  expandable?: boolean;
  pdfPath?: string;
}

const CARDS: ResearchCard[] = [
  {
    chip:    '2026.05',
    expandable: true,
    pdfPath: '/documents/research/2026-management-conference/paper.pdf',

    title:   '第17屆前瞻管理學術與產業趨勢研討會',
    content: '跟著龍走－𪹚龍文化與互動體驗｜論文發表',
    footer:  '研究／實作摘要',
  },
  {
    chip:    '專題研究',
    title:   '跟著龍走－苗栗𪹚龍文化互動學習平台',
    content: '文化介紹、AI 客家八音、2D RPG 與互動學習整合',
    footer:  '研究／實作摘要',
  },
  {
    chip:    'AI 模組',
    title:   'AI 客家八音生成流程',
    content: '六部曲情境、文化特徵對應、Prompt 與 MusicGen 生成流程',
    footer:  '研究／實作摘要',
  },
];

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

// ── Research card ─────────────────────────────────────────────────────────────

function ResearchCardItem({ card }: { card: ResearchCard }) {
  if (card.expandable) {
    return (
      <details className="v2-card v2-research-details" style={{ padding: '20px 22px', boxShadow: 'var(--shadow-xs)' }}>
        <summary className="v2-research-summary">
          <span style={{ color: 'var(--v2-purple)', fontSize: '0.75rem', fontWeight: 700 }}>{card.chip}</span>
          <span className="v2-research-arrow" aria-hidden>⌄</span>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, lineHeight: 1.5, margin: '14px 24px 14px 0' }}>{card.title}</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--v2-text-sec)', lineHeight: 1.65 }}>{card.content}</p>
          <span className="v2-research-open-label">展開研究摘要</span>
          <span className="v2-research-close-label">收合研究摘要</span>
        </summary>
        <div style={{ borderTop: '1px solid var(--v2-border)', marginTop: 18, paddingTop: 18, fontSize: '0.8125rem', lineHeight: 1.8, color: 'var(--v2-text-sec)' }}>
          <h4 style={{ color: 'var(--v2-text)', fontWeight: 700, marginBottom: 8 }}>研究概覽</h4>
          <p>本研究以苗栗客家𪹚龍文化為核心，提出結合 AI 音樂生成、體感互動與遊戲化學習的網頁體驗，將文化知識、工藝與儀式流程轉化為可參與的數位內容。</p>
          <ul style={{ paddingLeft: 20, margin: '12px 0' }}>
            <li>運用 Meta MusicGen 生成具客家八音特色的配樂。</li>
            <li>結合 Python、OpenCV 與 MediaPipe 設計體感舞龍互動。</li>
            <li>以 GDevelop 設計糊龍任務，融入客語與文化知識。</li>
          </ul>
          <p style={{ fontSize: '0.75rem' }}>以上依本篇研討會論文整理。</p>
          <ul style={{ paddingLeft: 20, margin: '12px 0 18px' }}>
            <li>發表場合：第17屆前瞻管理學術與產業趨勢研討會</li>
            <li>參與角色：論文整合、團隊 PM</li>
            <li>成果：論文發表</li>
          </ul>
          {card.pdfPath ? (
            <a href={publicUrl(card.pdfPath)} target="_blank" rel="noopener noreferrer" className="v2-bubble-btn v2-bubble-btn--soft">論文全文（PDF）↗</a>
          ) : (
            <p style={{ color: 'var(--v2-text-muted)', fontSize: '0.75rem' }}>論文全文尚未上傳</p>
          )}
        </div>
      </details>
    );
  }
  return (
    <div
      className="v2-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 22px',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Chip */}
      <span
        style={{
          display: 'inline-flex',
          alignSelf: 'flex-start',
          padding: '2px 10px',
          borderRadius: '999px',
          background: 'var(--v2-purple-dim)',
          color: 'var(--v2-purple)',
          border: '1px solid rgba(116,87,232,0.2)',
          fontFamily: 'var(--font-family-mono)',
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          marginBottom: '14px',
          whiteSpace: 'nowrap',
        }}
      >
        {card.chip}
      </span>

      {/* Title */}
      <h3
        style={{
          fontFamily: 'var(--font-family-v2-display)',
          fontSize: '0.9375rem',
          fontWeight: 700,
          color: 'var(--v2-text)',
          lineHeight: 1.35,
          marginBottom: '10px',
          flex: 1,
        }}
      >
        {card.title}
      </h3>

      {/* Content */}
      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--v2-text-sec)',
          lineHeight: 1.65,
          marginBottom: '16px',
        }}
      >
        {card.content}
      </p>

      {/* Footer meta */}
      <p
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: '0.68rem',
          fontWeight: 600,
          color: 'var(--v2-text-muted)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          borderTop: '1px solid var(--v2-border)',
          paddingTop: '10px',
          marginTop: 'auto',
        }}
      >
        {card.footer}
      </p>
    </div>
  );
}

// ── Main Research component ───────────────────────────────────────────────────

export function Research() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05 });

  return (
    <div ref={ref} className={`v2-reveal ${inView ? 'is-visible' : ''}`}>
      <ResearchBanner />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3" style={{ alignItems: 'start' }}>
        {CARDS.map(card => (
          <ResearchCardItem key={card.chip} card={card} />
        ))}
      </div>
    </div>
  );
}
