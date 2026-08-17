import { PROJECTS, type Project } from '@/data/portfolioV2';
import { publicUrl } from '@/lib/publicUrl';
import { Pagination, usePagination } from './Pagination';
import { useInView } from '@/hooks/useInView';

// ── Source chip mapping ───────────────────────────────────────────────────────

type SourceType = '專題' | '競賽' | '課程' | '自行開發';

const SOURCE_MAP: Record<string, SourceType> = {
  A0: '自行開發',
  A1: '專題',
  A2: '競賽',
  A3: '競賽',
  A4: '競賽',
  A5: '課程',
  A6: '課程',
  A7: '自行開發',
  A8: '自行開發',
};

const SOURCE_CSS: Record<SourceType, string> = {
  '專題':     'v2-source-chip v2-source-chip--project',
  '競賽':     'v2-source-chip v2-source-chip--competition',
  '課程':     'v2-source-chip v2-source-chip--course',
  '自行開發': 'v2-source-chip v2-source-chip--self',
};

// ── Confirmed project images ──────────────────────────────────────────────────

const PROJECT_IMAGES: Partial<Record<string, string>> = {
  A2: '/images/project-starryrun.png',
  A3: '/images/project-soulscent.png',
  A4: '/images/project-hotpot.png',
  A5: '/images/project-accommodation.png',
  A6: '/images/project-dog.png',
};

// ── Card copy ─────────────────────────────────────────────────────────────────
// Summary + highlights are restatements of the role/skills already recorded in
// portfolioV2.ts. No invented outcomes, metrics, or awards.

interface Blurb { summary: string; highlights: string[] }

const BLURB: Partial<Record<string, Blurb>> = {
  A1: {
    summary: '苗栗𪹚龍文化互動學習平台，整合地圖、文化資訊與互動學習內容。',
    highlights: ['擔任團隊 PM 並負責 UI/UX 設計', '地圖與系統整合、API 串接'],
  },
  A2: {
    summary: '路跑活動報名網站，承接 2026 全球品牌大賽高雄初賽企劃。',
    highlights: ['負責網站建置與活動企劃', '報名流程設計與前端實作'],
  },
  A3: {
    summary: '結合 MBTI 人格分析與芳療知識庫的智能精油顧問系統。',
    highlights: ['擔任團隊 PM，主導系統發想與建置', 'AI 應用與需求分析'],
  },
  A4: {
    summary: 'AI 智能點餐系統，以模組化 AI 服務降低餐飲業客服成本。',
    highlights: ['負責系統發想與建置', '資料整合與提案簡報'],
  },
  A5: {
    summary: '打工換宿智慧媒合平台，整合評核機制以保護青年求職安全。',
    highlights: ['獨立完成平台企劃與需求分析', '網路行銷規劃'],
  },
  A6: {
    summary: '動物收容所領養與志工管理系統，資料庫設計課程專案。',
    highlights: ['資料庫結構設計與功能規劃', '系統整合實作'],
  },
  A7: {
    summary: '相簿滑滑整理 APP，以手勢互動加速重複相片的篩選流程。',
    highlights: ['獨立製作，負責 APP 流程與互動設計', '以產品思維定義核心操作'],
  },
  A8: {
    summary: '彈珠工廠網頁互動體驗，以物理引擎打造趣味工廠場景。',
    highlights: ['獨立完成網頁設計與前端實作', '互動體驗設計'],
  },
  A0: {
    summary: '本作品集網站，採 React + Vite + TypeScript 架構開發。',
    highlights: ['自行規劃資訊架構與 UI/UX', '前端實作與效能優化'],
  },
};

// ── Project links ─────────────────────────────────────────────────────────────
// Priority: live demo → case study → public GitHub repo.
// A link renders only when a real URL exists; nothing is ever stubbed.

type LinkType = 'demo' | 'case-study' | 'github';

interface ProjectLink { label: string; url: string; type: LinkType }

/**
 * Verified public links, keyed by project id.
 *
 * Every URL below was deployed and checked live (HTTP 200, page renders) before
 * being added. A project with no entry renders no action buttons at all —
 * never a placeholder, never a "coming soon".
 *
 * A1 跟著龍走      — repository is team-owned; ownership unresolved
 * A6 狗狗領養      — source code not yet located
 * A8 彈珠汽水      — project not ready for publication
 */
const EXTRA_LINKS: Partial<Record<string, ProjectLink[]>> = {
  A2: [
    { label: '查看作品', url: 'https://for995-ai.github.io/starry-run/',   type: 'demo' },
    { label: 'GitHub',   url: 'https://github.com/for995-ai/starry-run',    type: 'github' },
  ],
  A3: [
    { label: '查看作品', url: 'https://for995-ai.github.io/mbti-aroma-advisor/', type: 'demo' },
    { label: 'GitHub',   url: 'https://github.com/for995-ai/mbti-aroma-advisor', type: 'github' },
  ],
  A4: [
    { label: '查看作品', url: 'https://for995-ai.github.io/ai-food-ordering/', type: 'demo' },
    { label: 'GitHub',   url: 'https://github.com/for995-ai/ai-food-ordering',  type: 'github' },
  ],
  A5: [
    { label: '查看作品', url: 'https://for995-ai.github.io/work-exchange-platform/', type: 'demo' },
    { label: 'GitHub',   url: 'https://github.com/for995-ai/work-exchange-platform',  type: 'github' },
  ],
  A7: [
    // Native app — 查看作品 opens the deployed portfolio demo.
    { label: '查看作品', url: 'https://for995-ai.github.io/photo-swipe-cleaner/demo/', type: 'demo' },
    { label: 'GitHub',   url: 'https://github.com/for995-ai/photo-swipe-cleaner',      type: 'github' },
  ],
  A0: [
    // This site itself — the demo link points back to the deployed portfolio,
    // which is a different destination from the source repository.
    { label: '查看作品', url: 'https://for995-ai.github.io/portfolio/', type: 'demo' },
    { label: 'GitHub',   url: 'https://github.com/for995-ai/portfolio',  type: 'github' },
  ],
};

const TYPE_RANK: Record<LinkType, number> = { demo: 0, 'case-study': 1, github: 2 };

function linksFor(project: Project): ProjectLink[] {
  const links: ProjectLink[] = [];

  // Confirmed URLs recorded on the project itself
  if (project.demo)   links.push({ label: '查看作品', url: project.demo,   type: 'demo' });
  if (project.github) links.push({ label: 'GitHub',   url: project.github, type: 'github' });

  for (const l of EXTRA_LINKS[project.id] ?? []) links.push(l);

  return links.sort((a, b) => TYPE_RANK[a.type] - TYPE_RANK[b.type]);
}

// Display order: featured first, then standard, then archive
const SORTED_PROJECTS = [...PROJECTS].sort((a, b) => {
  const tier = (p: Project) =>
    p.displayLevel === 'featured' ? 0 : p.displayLevel === 'standard' ? 1 : 2;
  return tier(a) - tier(b) || (a.featuredRank ?? 99) - (b.featuredRank ?? 99);
});

// ── Placeholder (no confirmed image) ─────────────────────────────────────────

function PlaceholderImg({ title }: { title: string }) {
  return (
    <div aria-hidden className="v2-project-media v2-project-media--empty">
      <span>{title}</span>
    </div>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const src        = PROJECT_IMAGES[project.id];
  const sourceType = SOURCE_MAP[project.id];
  const blurb      = BLURB[project.id];
  const links      = linksFor(project);

  return (
    <article className="v2-card v2-project-card">
      {/* Image */}
      {src ? (
        <div className="v2-project-media">
          <img src={publicUrl(src)} alt={project.title} loading="lazy" decoding="async" />
        </div>
      ) : (
        <PlaceholderImg title={project.title} />
      )}

      <div className="v2-project-body">
        {/* Source chip + date */}
        <div className="v2-project-meta">
          {sourceType && <span className={SOURCE_CSS[sourceType]}>{sourceType}</span>}
          <span className="v2-project-date">{project.date}</span>
        </div>

        {/* Title */}
        <h3 className="v2-project-title">{project.title}</h3>

        {/* Role / tech line */}
        <p className="v2-project-role">
          {[project.role, ...project.skills].join(' · ')}
        </p>

        <div className="v2-project-divider" />

        {/* README-style summary */}
        {blurb && (
          <>
            <p className="v2-project-summary">{blurb.summary}</p>
            <ul className="v2-project-highlights">
              {blurb.highlights.map(h => (
                <li key={h}>
                  <span aria-hidden>▸</span>
                  {h}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Actions — only real URLs */}
        {links.length > 0 && (
          <div className="v2-project-actions">
            {links.map(l => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                /* 查看作品 always leads as primary; GitHub is always secondary,
                   so a project with only a repo never gets a primary button. */
                className={`v2-bubble-btn ${l.type === 'github' ? 'v2-bubble-btn--secondary' : 'v2-bubble-btn--primary'}`}
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

// ── Main Projects component ───────────────────────────────────────────────────

export function Projects() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05 });
  const { page, totalPages, pageItems, onPrevious, onNext } =
    usePagination(SORTED_PROJECTS, 'projects');

  return (
    <div ref={ref} className={`v2-reveal ${inView ? 'is-visible' : ''}`}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {pageItems.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrevious={onPrevious}
        onNext={onNext}
        label="專案作品分頁"
      />
    </div>
  );
}
