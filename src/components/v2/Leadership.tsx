import { useState } from 'react';
import { LEADERSHIP, SERVICE, EXPERIENCE } from '@/data/portfolioV2';
import { Lightbox } from './Lightbox';
import { useInView } from '@/hooks/useInView';

// ── Activity photos — filenames verified against public/images ────────────────

const IMAGES: Partial<Record<string, string>> = {
  B2: '/images/資訊管理學系系學會 14th 會長.png',
  B3: '/images/動物友善推廣社 14th公關.png',
  B4: '/images/資訊管理學系 排球系隊 114隊長.png',
  D5: '/images/資訊管理學系 資訊志工 114隊長.png',
  D3: '/images/偏鄉系統帶班老師.png',
};

// ── Unified evidence card model ───────────────────────────────────────────────
// Six cards per Figma. Sourced from LEADERSHIP (B*), SERVICE (D5) and
// EXPERIENCE (D3) — same card language, no split between "leadership" and
// "service". The 6th card ("系統帶班") is factually EXPERIENCE.D3, not
// SERVICE.D11 — D11 is a separate, earlier role ("大學伴") in the same
// programme and must not be relabeled to match the card title.

interface EvidenceItem {
  id:      string;
  title:   string;
  role:    string;
  result:  string;
  period:  string;
  src?:    string;
}

const CARD_IDS = ['B2', 'B1', 'B3', 'B4', 'D5', 'D3'] as const;

const EVIDENCE: EvidenceItem[] = CARD_IDS.flatMap(id => {
  const lead = LEADERSHIP.find(l => l.id === id);
  if (lead) {
    return [{
      id,
      title:  lead.organization,
      role:   lead.position,
      result: lead.tasks[0],
      period: lead.period,
      src:    IMAGES[id],
    }];
  }
  const svc = SERVICE.find(s => s.id === id);
  if (svc) {
    return [{
      id,
      title:  svc.organization,
      role:   svc.role,
      result: svc.tasks[0],
      period: svc.period,
      src:    IMAGES[id],
    }];
  }
  const exp = EXPERIENCE.find(e => e.id === id);
  if (exp) {
    return [{
      id,
      title:  exp.organization,
      role:   exp.position,
      result: exp.tasks[0],
      period: exp.period,
      src:    IMAGES[id],
    }];
  }
  return [];
});

// ── Zoom bubble ───────────────────────────────────────────────────────────────

function ZoomBubble() {
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        right: '10px',
        bottom: '10px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30px',
        height: '30px',
        borderRadius: '999px',
        background: 'rgba(255,255,255,0.92)',
        boxShadow: 'var(--shadow-xs)',
        color: 'var(--v2-purple)',
        fontSize: '0.85rem',
        lineHeight: 1,
      }}
    >
      ⤢
    </span>
  );
}

// ── Evidence card ─────────────────────────────────────────────────────────────

function EvidenceCard({
  item,
  onImgClick,
}: {
  item: EvidenceItem;
  onImgClick: (info: { src: string; alt: string }) => void;
}) {
  const alt = `${item.title} ${item.role}`;

  return (
    <article className="v2-card v2-card--elevated" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Photo */}
      {item.src ? (
        <button
          type="button"
          aria-label={`查看 ${alt} 活動照片`}
          onClick={() => onImgClick({ src: item.src!, alt })}
          style={{
            position: 'relative',
            display: 'block',
            width: '100%',
            padding: 0,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
          }}
        >
          <img
            src={item.src}
            alt={alt}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              aspectRatio: '4/3',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <ZoomBubble />
        </button>
      ) : (
        <div
          aria-hidden
          style={{
            width: '100%',
            aspectRatio: '4/3',
            background: 'var(--v2-lavender)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-family-v2-display)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--v2-purple)',
              opacity: 0.6,
              textAlign: 'center',
              lineHeight: 1.45,
            }}
          >
            {item.role}
          </span>
        </div>
      )}

      {/* Body */}
      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <h3
          style={{
            fontFamily: 'var(--font-family-v2-display)',
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: 'var(--v2-text)',
            lineHeight: 1.35,
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-family-v2-display)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--v2-purple)',
          }}
        >
          {item.role}
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--v2-text-sec)', lineHeight: 1.6, flex: 1 }}>
          {item.result}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-family-mono)',
            fontSize: '0.7rem',
            color: 'var(--v2-text-muted)',
            letterSpacing: '0.04em',
            marginTop: '2px',
          }}
        >
          {item.period}
        </p>
      </div>
    </article>
  );
}

// ── Main Leadership component ─────────────────────────────────────────────────

export function Leadership() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05 });
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div ref={ref} className={`v2-reveal ${inView ? 'is-visible' : ''}`}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {EVIDENCE.map(item => (
          <EvidenceCard key={item.id} item={item} onImgClick={setLightbox} />
        ))}
      </div>

      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
