import { PROJECTS, type Project } from '@/data/portfolioV2';
import { publicUrl } from '@/lib/publicUrl';
import { Pagination, usePagination } from './Pagination';
import { PhotoCleanerPreview } from './PhotoCleanerPreview';
import { useInView } from '@/hooks/useInView';

// ── Source chip mapping ───────────────────────────────────────────────────────

type SourceType = '專題' | '競賽' | '課程' | '自行開發';

const SOURCE_MAP: Record<string, SourceType> = {
  A1: '專題',
  A2: '競賽',
  A3: '競賽',
  A4: '競賽',
  A5: '課程',
  A6: '課程',
  A7: '自行開發',
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

// ── Drawn previews ────────────────────────────────────────────────────────────
// A project with no screenshot can supply a vector hero instead of falling
// through to the plain placeholder. Ids absent here behave exactly as before.

const PROJECT_PREVIEWS: Partial<Record<string, () => React.ReactElement>> = {
  A7: PhotoCleanerPreview,
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
    summary: '以 PHP + MySQL 建置的狗狗領養與志工管理系統，整合狗狗資料、領養申請、志工活動、使用者與後台管理流程，並完成公開安全化 Demo 部署。',
    highlights: [
      '以關聯式資料庫整合狗狗、使用者、領養申請與志工活動資料',
      '實作 PHP CRUD、Session 登入驗證與後台管理功能',
      '建立獨立 Demo 資料庫與安全化公開展示環境',
    ],
  },
  A7: {
    summary: '相簿滑滑整理 APP，以手勢互動加速重複相片的篩選流程。',
    highlights: ['獨立製作，負責 APP 流程與互動設計', '以產品思維定義核心操作'],
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
 *
 * A6 狗狗領養 is a PHP/MySQL application. Its 查看作品 button points at the
 * public, safety-hardened demo (recorded on the project itself in
 * portfolioV2.ts); the static case study shipped with this site stays linked
 * alongside it, so the write-up does not become unreachable.
 *
 * Root-relative URLs are internal pages of this deployment and are resolved
 * through publicUrl(), so they follow the /portfolio/ base on GitHub Pages
 * and the site root everywhere else.
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
  A6: [
    // Static case study served from public/. 查看作品 (the live demo) and the
    // repository link both live on the project record in portfolioV2.ts.
    { label: 'Case Study', url: '/case-studies/dog-adoption-volunteer-system/', type: 'case-study' },
  ],
  A7: [
    // Native app — 查看作品 opens the deployed portfolio demo.
    { label: '查看作品', url: 'https://for995-ai.github.io/photo-swipe-cleaner/demo/', type: 'demo' },
    { label: 'GitHub',   url: 'https://github.com/for995-ai/photo-swipe-cleaner',      type: 'github' },
  ],
};

const TYPE_RANK: Record<LinkType, number> = { demo: 0, 'case-study': 1, github: 2 };

function linksFor(project: Project): ProjectLink[] {
  const links: ProjectLink[] = [];

  // Confirmed URLs recorded on the project itself
  if (project.demo)   links.push({ label: '查看作品', url: project.demo,   type: 'demo' });
  if (project.github) links.push({ label: 'GitHub',   url: project.github, type: 'github' });

  for (const l of EXTRA_LINKS[project.id] ?? []) links.push(l);

  return links
    // Internal pages are stored root-relative, like the image paths, and are
    // resolved against BASE_URL here. External URLs pass through untouched.
    .map(l => (l.url.startsWith('/') ? { ...l, url: publicUrl(l.url) } : l))
    .sort((a, b) => TYPE_RANK[a.type] - TYPE_RANK[b.type]);
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
  const Preview    = PROJECT_PREVIEWS[project.id];
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
      ) : Preview ? (
        <div className="v2-project-media">
          <Preview />
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
                /* 查看作品 (the live demo) always leads as primary; case study
                   and GitHub stay secondary, so a project with only a repo
                   never gets a primary button. */
                className={`v2-bubble-btn ${l.type === 'demo' ? 'v2-bubble-btn--primary' : 'v2-bubble-btn--secondary'}`}
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
