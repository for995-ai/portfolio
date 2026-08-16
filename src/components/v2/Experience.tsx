import { useState } from 'react';
import { publicUrl } from '@/lib/publicUrl';
import { EXPERIENCE, type Experience } from '@/data/portfolioV2';
import { Lightbox } from './Lightbox';
import { Pagination, usePagination } from './Pagination';
import { useInView } from '@/hooks/useInView';

// One-line role summary shown on the collapsed card.
const SUMMARY: Partial<Record<string, string>> = {
  D1: '參與前端介面製作與 AI 功能整合',
  D2: '特展活動企劃執行、社群內容設計發布',
  D3: '以系統帶班角色協助班務管理與課輔進度',
  D4: '社群貼文設計、品牌合作行銷活動',
};

// Heading + paragraph for the expanded body. Both are restatements of the
// tasks already in portfolioV2.ts — no new facts, no invented metrics.
const DETAIL: Partial<Record<string, { heading: string; body: string }>> = {
  D1: {
    heading: '工作內容與產出',
    body: '在實習期間參與產品前端介面的實作，從 Wireframe 規劃到畫面完成，並負責串接 AI 生圖與影片相關 API，讓設計稿能實際運作為可互動的功能。',
  },
  D2: {
    heading: '活動企劃與內容產出',
    body: '負責特展活動的企劃與現場執行，同時處理社群內容的文案設計與發布，並協助整理活動所需的各項資料。',
  },
  D3: {
    heading: '帶班與進度協調',
    body: '以系統帶班角色協助偏鄉課輔計畫的班務運作，負責大學伴的人員協調與課輔進度追蹤，確保每週課程能穩定進行。',
  },
  D4: {
    heading: '品牌社群與行銷執行',
    body: '擔任校園大使，負責品牌社群貼文的文案與視覺設計，並參與品牌合作的行銷影片拍攝。',
  },
};

// Media gallery — array per entry, supports 1 / 2 / 3 / 4+ images.
// Only confirmed filenames; an empty array renders no media area.
const MEDIA: Partial<Record<string, string[]>> = {
  D3: ['/images/偏鄉系統帶班老師.png'],
  D4: ['/images/Sponya 9th校園大使.png'],
};

// External link — only rendered when a real URL exists. No placeholder CTAs.
const LINKS: Partial<Record<string, { label: string; href: string }>> = {};

function periodDisplay(period: string): string {
  const [s, e] = period.split('–');
  const fmt = (p: string) => (p === '現在' ? '現在' : p.slice(0, 7));
  return `${fmt(s)} – ${fmt(e)}`;
}

// ── Chevron ───────────────────────────────────────────────────────────────────

function Chevron({ open }: { open: boolean }) {
  return (
    <span className="v2-exp-chevron" data-open={open} aria-hidden>
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

// ── Accordion card ────────────────────────────────────────────────────────────

function AccordionEntry({
  exp,
  defaultOpen,
  onImgClick,
}: {
  exp: Experience;
  defaultOpen: boolean;
  onImgClick: (info: { src: string; alt: string }) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const summary = SUMMARY[exp.id] ?? exp.tasks[0];
  const detail  = DETAIL[exp.id];
  const media   = MEDIA[exp.id] ?? [];
  const link    = LINKS[exp.id];

  return (
    <div className="v2-exp-card" data-open={open}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="v2-accordion-trigger v2-exp-trigger"
      >
        {/* Date */}
        <span className="v2-exp-date">{periodDisplay(exp.period)}</span>

        {/* Title block */}
        <span className="v2-exp-headings">
          <span className="v2-exp-title">
            {exp.position}
            <span className="v2-exp-org"> / {exp.organization}</span>
          </span>
          <span className="v2-exp-summary">{summary}</span>
        </span>

        <Chevron open={open} />
      </button>

      <div className="v2-accordion-body" data-open={open} aria-hidden={!open}>
        <div className="v2-accordion-inner">
          <div className="v2-exp-body-inner">
            {/* Media gallery — 1 / 2 / 3 / 4+ */}
            {media.length > 0 && (
              <div
                className={`v2-media-grid v2-media-grid--${Math.min(media.length, 4)}`}
                style={{ marginBottom: '20px' }}
              >
                {media.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    aria-label={`查看 ${exp.organization} 照片 ${i + 1}`}
                    onClick={() => onImgClick({ src, alt: `${exp.organization} ${exp.position}` })}
                    style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    <img
                      src={publicUrl(src)}
                      alt={`${exp.organization} ${exp.position}`}
                      loading="lazy"
                      decoding="async"
                      className="v2-media-img"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Sub-heading + full description */}
            {detail && (
              <>
                <h4 className="v2-exp-subheading">{detail.heading}</h4>
                <p className="v2-exp-lead">{detail.body}</p>
              </>
            )}

            {/* Supporting bullets */}
            <ul className="v2-exp-bullets">
              {exp.tasks.map((t, i) => (
                <li key={i}>
                  <span aria-hidden>▸</span>
                  {t}
                </li>
              ))}
            </ul>

            {/* Skills / tools */}
            <div className="v2-exp-skills">
              {exp.skills.map(s => (
                <span key={s} className="v2-tag">{s}</span>
              ))}
            </div>

            {/* Optional external link — only when a real URL exists */}
            {link && (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="v2-bubble-btn v2-bubble-btn--secondary"
                style={{ marginTop: '18px' }}
              >
                {link.label} ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Experience component ─────────────────────────────────────────────────

export function Experience() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05 });
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const { page, totalPages, pageItems, onPrevious, onNext } =
    usePagination(EXPERIENCE, 'experience');

  return (
    <div ref={ref} className={`v2-reveal ${inView ? 'is-visible' : ''}`}>
      {pageItems.map(exp => (
        <AccordionEntry
          key={exp.id}
          exp={exp}
          defaultOpen={exp.featuredRank === 1}
          onImgClick={setLightbox}
        />
      ))}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrevious={onPrevious}
        onNext={onNext}
        label="工作經歷分頁"
      />

      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
