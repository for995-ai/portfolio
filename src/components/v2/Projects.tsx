import { featuredProjects, selectedProjects, archiveProjects, type Project } from '@/data/portfolioV2';
import { useInView } from '@/hooks/useInView';

// ── Static data ───────────────────────────────────────────────────────────────

// Descriptions derived solely from existing title / role / skills — no new facts
const DESCRIPTIONS: Partial<Record<string, string>> = {
  A1: '以苗栗𪹚龍文化為主題的互動學習平台，由 PM 統籌 UI/UX 設計與地圖系統整合。',
  A2: '路跑活動報名網站，負責企劃、需求分析到前端建置的完整流程。',
  A3: '結合 MBTI 人格分析與芳療知識庫的智能精油顧問系統。',
  A4: '發想並建置 AI 智能點餐系統，整合資料分析與提案表達。',
  A7: '獨立規劃並設計以互動流程為核心的相簿整理 APP。',
  A8: '以彈珠工廠為題，獨立完成互動體驗導向的網頁設計。',
};

// Confirmed images — only entries where filename clearly identifies the project
// A0, A1, A7, A8: no confirmed images
// A5 (project-accommodation.png), A6 (project-dog.png): confirmed but used in archive text rows
const PROJECT_IMAGES: Partial<Record<string, string>> = {
  A2: '/images/project-starryrun.png',
  A3: '/images/project-soulscent.png',
  A4: '/images/project-hotpot.png',
};

// ── Primitives ────────────────────────────────────────────────────────────────

function MetaLabel({ label }: { label: string }) {
  return (
    <p className="mb-1 font-mono text-[0.65rem] tracking-[0.15em] text-v2-text-muted">
      {label}
    </p>
  );
}

function SubsectionLabel({ label }: { label: string }) {
  return (
    <div className="mb-6 mt-10">
      <div className="h-px bg-v2-border" />
      <p className="mt-3 font-mono text-[0.65rem] tracking-[0.2em] text-v2-text-muted">
        {label}
      </p>
    </div>
  );
}

// ── A1 — Primary Featured (no confirmed image; editorial text block) ───────────
//
// Purple left border signals primary; large title + desc + role/skills metadata.
// Must read clearly without any image.

function FeaturedPrimary({ project }: { project: Project }) {
  const desc = DESCRIPTIONS[project.id];

  return (
    <div className="py-10 md:py-12">
      <div className="border-l-2 border-v2-purple pl-5 md:pl-7">
        <p className="mb-3 font-mono text-xs tracking-[0.12em] text-v2-text-muted">
          {project.date}
        </p>
        <h3
          className="text-2xl font-bold leading-tight text-v2-text md:text-3xl"
          style={{ fontFamily: 'var(--font-family-v2-display)' }}
        >
          {project.title}
        </h3>
        {desc && (
          <p className="mt-3 max-w-[600px] text-sm leading-[1.8] text-v2-text-sec">
            {desc}
          </p>
        )}
        <div className="mt-5 grid grid-cols-1 gap-3 md:max-w-[560px] md:grid-cols-2 md:gap-6">
          <div>
            <MetaLabel label="ROLE" />
            <p className="text-sm text-v2-text-sec">{project.role}</p>
          </div>
          <div>
            <MetaLabel label="SKILLS" />
            <p className="text-sm text-v2-text-sec">{project.skills.join(' · ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── A2 — Secondary Featured (confirmed image: project-starryrun.png) ──────────
//
// Mobile: image on top (first in DOM), text below.
// Desktop: text left col (1fr), image right col (42%).
// Explicit grid placement handles the desktop swap without DOM reordering.

function FeaturedSecondary({ project }: { project: Project }) {
  const desc = DESCRIPTIONS[project.id];
  const img = PROJECT_IMAGES[project.id];

  return (
    <div>
      <div className="h-px bg-v2-border" />
      <div className="flex flex-col gap-6 py-8 md:grid md:grid-cols-[1fr_42%] md:items-start md:gap-10">

        {/* Image — first in DOM → top on mobile; explicit col-2 placement on desktop */}
        {img && (
          <div
            className="overflow-hidden md:col-start-2 md:row-start-1"
            style={{ borderRadius: 'var(--v2-radius)' }}
          >
            <img
              src={img}
              alt={project.title}
              className="h-auto w-full"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        {/* Text — second in DOM → below image on mobile; explicit col-1 placement on desktop */}
        <div className="md:col-start-1 md:row-start-1">
          <p className="mb-2 font-mono text-xs tracking-[0.12em] text-v2-text-muted">
            {project.date}
          </p>
          <h3
            className="text-xl font-bold leading-tight text-v2-text md:text-2xl"
            style={{ fontFamily: 'var(--font-family-v2-display)' }}
          >
            {project.title}
          </h3>
          {desc && (
            <p className="mt-2 text-sm leading-[1.8] text-v2-text-sec">{desc}</p>
          )}
          <div className="mt-4 space-y-2">
            <div>
              <MetaLabel label="ROLE" />
              <p className="text-sm text-v2-text-sec">{project.role}</p>
            </div>
            <div>
              <MetaLabel label="SKILLS" />
              <p className="font-mono text-xs tracking-[0.06em] text-v2-text-muted">
                {project.skills.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Selected row — A3 / A4 / A7 / A8 ─────────────────────────────────────────
//
// Text-only for consistent layout; A3/A4 have confirmed images but thumbnails
// are omitted to prevent inconsistency with A7/A8 (no images).
// Date left col on desktop; stacked below title on mobile.

function SelectedRow({ project }: { project: Project }) {
  const desc = DESCRIPTIONS[project.id];

  return (
    <div className="flex flex-col gap-1 py-6 md:grid md:grid-cols-[100px_1fr] md:gap-x-10">
      {/* Date — mobile: below content (order-2); desktop: left col */}
      <p className="order-2 font-mono text-xs tracking-[0.06em] text-v2-text-muted md:order-1 md:pt-0.5">
        {project.date}
      </p>
      {/* Content */}
      <div className="order-1 md:order-2">
        <h3
          className="text-base font-bold leading-tight text-v2-text"
          style={{ fontFamily: 'var(--font-family-v2-display)' }}
        >
          {project.title}
        </h3>
        {desc && (
          <p className="mt-1 text-sm text-v2-text-sec">{desc}</p>
        )}
        <p className="mt-2 text-sm text-v2-text-sec">{project.role}</p>
        <p className="mt-1 font-mono text-xs tracking-[0.06em] text-v2-text-muted">
          {project.skills.join(' · ')}
        </p>
      </div>
    </div>
  );
}

// ── Archive row — A0 / A5 / A6 ───────────────────────────────────────────────
//
// Most compact tier: date + title + role/skills in a tight two-line block.
// No description, no thumbnails.

function ArchiveRow({ project }: { project: Project }) {
  return (
    <div className="py-4 md:grid md:grid-cols-[100px_1fr] md:items-baseline md:gap-x-10">
      <p className="font-mono text-xs tracking-[0.06em] text-v2-text-muted">
        {project.date}
      </p>
      <div className="mt-0.5 md:mt-0">
        <p
          className="text-sm font-medium leading-snug text-v2-text-sec"
          style={{ fontFamily: 'var(--font-family-v2-display)' }}
        >
          {project.title}
        </p>
        <p className="mt-0.5 font-mono text-xs tracking-[0.04em] text-v2-text-muted">
          {project.role} · {project.skills.join(' · ')}
        </p>
      </div>
    </div>
  );
}

// ── Main Projects component ───────────────────────────────────────────────────

export function Projects() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05 });

  return (
    <div ref={ref} className={`v2-reveal ${inView ? 'is-visible' : ''}`}>

      {/* Featured tier: A1 (primary) → A2 (secondary) */}
      {featuredProjects[0] && <FeaturedPrimary project={featuredProjects[0]} />}
      {featuredProjects[1] && <FeaturedSecondary project={featuredProjects[1]} />}

      {/* Selected tier: A3, A4, A7, A8 */}
      <SubsectionLabel label="SELECTED WORK" />
      {selectedProjects.map((p, idx) => (
        <div key={p.id}>
          {idx > 0 && <div className="h-px bg-v2-border" />}
          <SelectedRow project={p} />
        </div>
      ))}

      {/* Archive tier: A0, A5, A6 */}
      <SubsectionLabel label="ARCHIVE" />
      {archiveProjects.map((p, idx) => (
        <div key={p.id}>
          {idx > 0 && <div className="h-px bg-v2-border" />}
          <ArchiveRow project={p} />
        </div>
      ))}
    </div>
  );
}
