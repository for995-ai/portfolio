import { useEffect, useState } from 'react';
import {
  fetchGitHubData,
  GITHUB_USER,
  GITHUB_URL,
  type GitHubData,
  type GitHubLanguageStat,
  type GitHubRepository,
  type GitHubContributions,
  type GitHubContributionDay,
  type GitHubContributionWeek,
} from '@/lib/github';
import { useInView } from '@/hooks/useInView';
import { ResilientImage } from './ResilientImage';

// Restrained language palette — GitHub-adjacent hues, desaturated to sit inside
// the lavender/purple system rather than fighting it.
const LANG_COLOR: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#D4B93C',
  Python:     '#3572A5',
  HTML:       '#D96A4A',
  CSS:        '#8B62C9',
  SCSS:       '#B5638F',
  Vue:        '#41A87F',
  Java:       '#B07219',
  'C#':       '#68217A',
  'C++':      '#5B84C4',
  Shell:      '#7A9E5C',
  Dart:       '#3BA8C4',
  Kotlin:     '#A97BFF',
  Go:         '#4B9DBF',
  Ruby:       '#B3423A',
  PHP:        '#6E7BB5',
};

const langColor = (lang: string | null) =>
  (lang && LANG_COLOR[lang]) || 'var(--v2-text-faint)';

// ── Shared card shell ─────────────────────────────────────────────────────────

function Card({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`v2-card ${className}`}
      style={{ boxShadow: 'var(--shadow-xs)', padding: '22px 24px', ...style }}
    >
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-family-mono)',
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--v2-text-muted)',
        marginBottom: '16px',
      }}
    >
      {children}
    </p>
  );
}

// ── Profile card ──────────────────────────────────────────────────────────────

function MetricCard({ value, label, hint }: { value: number; label: string; hint: string }) {
  return (
    <div className="v2-gh-metric-card">
      <p className="v2-gh-metric-value">{value.toLocaleString()}</p>
      <p className="v2-gh-metric-label">{label}</p>
      <p className="v2-gh-metric-hint">{hint}</p>
    </div>
  );
}

function ProfileCard({ data }: { data: GitHubData }) {
  const { profile, contributions, languages, repos } = data;
  const topLanguages = languages.slice(0, 5);
  const featuredNames = ['portfolio', 'starry-run', 'dog-adoption-volunteer-system', 'mbti-aroma-advisor'];
  const featuredCount = featuredNames.filter(name => repos.some(repo => repo.name === name)).length;
  const latestUpdate = repos.reduce<string | null>((latest, repo) => {
    if (!latest || new Date(repo.updatedAt) > new Date(latest)) return repo.updatedAt;
    return latest;
  }, null);
  const updatedLabel = latestUpdate ? formatUpdated(latestUpdate) : '持續更新中';

  return (
    <Card className="v2-gh-overview-card">
      <div className="v2-gh-profile-head">
        <div className="v2-gh-avatar-wrap">
          <ResilientImage
            src={profile.avatarUrl}
            alt=""
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            fallback={<span className="v2-github-avatar-fallback" aria-hidden>GH</span>}
            style={{ width: '100%', height: '100%', borderRadius: '50%', border: '2px solid var(--v2-border)', display: 'block' }}
          />
          <span aria-hidden className="v2-px-dot v2-gh-avatar-dot" />
        </div>
        <div className="v2-gh-profile-copy">
          <p className="v2-gh-handle">@{profile.login}</p>
          <h3>蘇洺崴 <span>Ming-Wei Su</span></h3>
          <p>{updatedLabel}</p>
        </div>
        <a
          href={profile.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="v2-bubble-btn v2-bubble-btn--soft v2-gh-profile-link"
        >
          開啟 GitHub ↗
        </a>
      </div>

      <div className="v2-gh-metric-grid">
        <MetricCard value={profile.publicRepos} label="公開儲存庫" hint="Public repositories" />
        <MetricCard value={contributions?.total ?? 0} label="年度貢獻" hint="Public contributions" />
        <MetricCard value={languages.length} label="主要語言" hint="Languages used" />
        <MetricCard value={featuredCount} label="精選專案" hint="Featured projects" />
      </div>

      {topLanguages.length > 0 && (
        <div className="v2-gh-language-panel">
          <div className="v2-gh-panel-heading">
            <div>
              <h4>主要語言</h4>
              <p>依公開儲存庫程式碼比例</p>
            </div>
          </div>
          <ul className="v2-gh-language-list">
            {topLanguages.map(language => (
              <li key={language.language}>
                <span className="v2-gh-language-name">{language.language}</span>
                <span className="v2-gh-language-track" aria-hidden>
                  <span style={{ width: language.percentage + '%', background: langColor(language.language) }} />
                </span>
                <span className="v2-gh-language-percent">{language.percentage.toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

// ── Language distribution ─────────────────────────────────────────────────────

function LanguageCard({ languages }: { languages: GitHubLanguageStat[] }) {
  const top = languages.slice(0, 5);

  return (
    <Card>
      <CardLabel>Public Repository Languages</CardLabel>

      {/* Stacked proportional bar */}
      <div
        style={{
          display: 'flex',
          height: '8px',
          borderRadius: '999px',
          overflow: 'hidden',
          background: 'var(--v2-surface-2)',
          marginBottom: '18px',
        }}
        aria-hidden
      >
        {top.map(l => (
          <span
            key={l.language}
            style={{ width: `${l.percentage}%`, background: langColor(l.language) }}
          />
        ))}
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
        {top.map(l => (
          <li key={l.language} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              aria-hidden
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: langColor(l.language),
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '0.8125rem', color: 'var(--v2-text-sec)', flex: 1, minWidth: 0 }}>
              {l.language}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-family-mono)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--v2-text)',
              }}
            >
              {l.percentage.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>

      <p
        style={{
          fontSize: '0.68rem',
          color: 'var(--v2-text-faint)',
          marginTop: '14px',
        }}
      >
        Based on public repositories.
      </p>
    </Card>
  );
}

// ── Contribution activity ─────────────────────────────────────────────────────
//
// Renders the real calendar when the snapshot carries one. Until it does, the
// card stays compact and simply points at the live profile — no placeholder
// grid, no invented numbers, and nothing about how the data is sourced.

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/**
 * Calendar renders exactly what the snapshot provides — weeks, days, and the
 * precomputed intensity level. No bucketing logic lives here.
 */
function Calendar({ weeks }: { weeks: GitHubContributionWeek[] }) {
  // A month label appears on the first week that lands in a new month.
  const labels = weeks.map((w, i) => {
    const first = w.contributionDays[0];
    if (!first) return '';
    const m = new Date(first.date).getMonth();
    const prevFirst = i > 0 ? weeks[i - 1].contributionDays[0] : null;
    const prev = prevFirst ? new Date(prevFirst.date).getMonth() : -1;
    return m !== prev ? MONTHS[m] : '';
  });

  return (
    <div className="v2-heatmap-scroll">
      <div className="v2-heatmap">
        <div className="v2-heatmap-months">
          {labels.map((l, i) => <span key={i}>{l}</span>)}
        </div>
        <div className="v2-heatmap-grid">
          {weeks.map((w, i) => (
            <div key={i} className="v2-heatmap-week">
              {w.contributionDays.map((d: GitHubContributionDay) => (
                <span
                  key={d.date}
                  className="v2-heatmap-day"
                  data-level={d.level}
                  title={`${d.date}: ${d.count}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StreakStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="v2-gh-stat-value">{value}</p>
      <p className="v2-gh-stat-label">{label}</p>
    </div>
  );
}

function ContributionCard({
  contributions,
  repoCount,
}: {
  contributions: GitHubContributions | null;
  repoCount: number;
}) {
  if (!contributions) {
    return (
      <Card className="v2-gh-contribution-card">
        <div className="v2-gh-panel-heading">
          <div>
            <h3>貢獻活動紀錄</h3>
            <p>GitHub 公開貢獻資料同步中</p>
          </div>
        </div>
        <a
          href={GITHUB_URL + '?tab=overview'}
          target="_blank"
          rel="noopener noreferrer"
          className="v2-bubble-btn v2-bubble-btn--soft"
        >
          View on GitHub ↗
        </a>
      </Card>
    );
  }

  const { total, longestStreak, weeks } = contributions;

  return (
    <Card className="v2-gh-contribution-card">
      <div className="v2-gh-panel-heading">
        <div>
          <h3>貢獻活動紀錄</h3>
          <p>GitHub 最近一年的公開貢獻</p>
        </div>
      </div>

      <Calendar weeks={weeks} />

      <div className="v2-gh-streak-heading">
        <h4>開發成果摘要</h4>
        <p>以成果與持續投入為主要呈現</p>
      </div>

      <div className="v2-gh-summary-grid">
        <StreakStat value={total.toLocaleString()} label="年度公開貢獻" />
        <StreakStat value={longestStreak + ' days'} label="最長連續貢獻" />
        <StreakStat value={repoCount.toLocaleString()} label="公開儲存庫" />
      </div>
    </Card>
  );
}

// ── Repository card ───────────────────────────────────────────────────────────

function formatUpdated(iso: string): string {
  const d = new Date(iso);
  return `更新於 ${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function MetaIcon({ path }: { path: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden style={{ flexShrink: 0 }}>
      <path d={path} />
    </svg>
  );
}

const STAR_PATH =
  'M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z';
const FORK_PATH =
  'M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0Z';

function RepoCard({ repo }: { repo: GitHubRepository }) {
  return (
    <a
      href={repo.htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="v2-card v2-repo-card"
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
        <p
          style={{
            fontFamily: 'var(--font-family-mono)',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: 'var(--v2-purple)',
            lineHeight: 1.35,
            wordBreak: 'break-word',
          }}
        >
          {repo.name}
        </p>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden style={{ flexShrink: 0, marginTop: 3 }}>
          <path
            d="M2 2h10v10M2 12L12 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ color: 'var(--v2-text-muted)' }}
          />
        </svg>
      </div>

      {repo.description && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--v2-text-sec)', lineHeight: 1.6, marginBottom: '14px', flex: 1 }}>
          {repo.description}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '6px 14px',
          marginTop: 'auto',
          color: 'var(--v2-text-muted)',
          fontFamily: 'var(--font-family-mono)',
          fontSize: '0.72rem',
        }}
      >
        {repo.language && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span
              aria-hidden
              style={{ width: 9, height: 9, borderRadius: '50%', background: langColor(repo.language), flexShrink: 0 }}
            />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <MetaIcon path={STAR_PATH} /> {repo.stars}
          </span>
        )}
        {repo.forks > 0 && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <MetaIcon path={FORK_PATH} /> {repo.forks}
          </span>
        )}
      </div>

      <p
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: '0.68rem',
          color: 'var(--v2-text-faint)',
          marginTop: '8px',
          letterSpacing: '0.03em',
        }}
      >
        {formatUpdated(repo.updatedAt)}
      </p>
    </a>
  );
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function Skeleton({ height, width = '100%', radius = 'var(--radius)' }: { height: number; width?: string; radius?: string }) {
  return <span className="v2-skeleton" style={{ height, width, borderRadius: radius, display: 'block' }} />;
}

function DashboardSkeleton() {
  return (
    <>
      <div className="v2-gh-grid">
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <Skeleton height={56} width="56px" radius="50%" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <Skeleton height={14} width="70%" />
              <Skeleton height={11} width="50%" />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[0, 1, 2, 3].map(i => <Skeleton key={i} height={12} />)}
          </div>
          <div style={{ marginTop: '20px' }}><Skeleton height={46} radius="999px" /></div>
        </Card>
        <Card>
          <Skeleton height={11} width="45%" />
          <div style={{ marginTop: '18px' }}><Skeleton height={8} radius="999px" /></div>
          <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {[0, 1, 2, 3, 4].map(i => <Skeleton key={i} height={12} />)}
          </div>
        </Card>
      </div>
      <div className="v2-gh-repos" style={{ marginTop: '20px' }}>
        {[0, 1].map(i => (
          <Card key={i}>
            <Skeleton height={14} width="55%" />
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <Skeleton height={11} />
              <Skeleton height={11} width="80%" />
            </div>
            <div style={{ marginTop: '16px' }}><Skeleton height={11} width="60%" /></div>
          </Card>
        ))}
      </div>
    </>
  );
}

// ── Error fallback ────────────────────────────────────────────────────────────

function ErrorFallback() {
  return (
    <Card style={{ textAlign: 'center', padding: '36px 24px' }}>
      <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--v2-text)', marginBottom: '6px' }}>
        GitHub 資料暫時無法載入
      </p>
      <p style={{ fontSize: '0.8125rem', color: 'var(--v2-text-sec)', lineHeight: 1.7, marginBottom: '20px' }}>
        公開 API 目前無法回應，可能已達速率限制。可直接前往 GitHub 主頁查看實際內容。
      </p>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="v2-bubble-btn v2-bubble-btn--primary"
      >
        前往 @{GITHUB_USER} ↗
      </a>
    </Card>
  );
}

// ── Section heading for sub-blocks ────────────────────────────────────────────

function SubHeading({ label }: { label: string }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-family-mono)',
        fontSize: '0.68rem',
        fontWeight: 700,
        letterSpacing: '0.18em',
        color: 'var(--v2-text-muted)',
        textTransform: 'uppercase',
        margin: '32px 0 16px',
      }}
    >
      {label}
    </p>
  );
}

// ── Main GitHub component ─────────────────────────────────────────────────────

type State =
  | { status: 'loading' }
  | { status: 'ready'; data: GitHubData }
  | { status: 'error' };

export function GitHub() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05 });
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let alive = true;
    fetchGitHubData()
      .then(data => { if (alive) setState({ status: 'ready', data }); })
      .catch(()   => { if (alive) setState({ status: 'error' }); });
    return () => { alive = false; };
  }, []);

  return (
    <div ref={ref} className={`v2-reveal ${inView ? 'is-visible' : ''}`}>
      {state.status === 'loading' && <DashboardSkeleton />}
      {state.status === 'error'   && <ErrorFallback />}

      {state.status === 'ready' && (
        <>
          {/* GitHub overview inspired by the reference: identity and skills on
              the left, contribution evidence on the right. */}
          <div className="v2-gh-grid">
            <ProfileCard data={state.data} />
            <ContributionCard
              contributions={state.data.contributions}
              repoCount={state.data.profile.publicRepos}
            />
          </div>

          {/* Curated public repositories */}
          {state.data.repos.length > 0 && (
            <>
              <SubHeading label="Featured Repositories" />
              <div className="v2-gh-repos">
                {['portfolio', 'starry-run', 'dog-adoption-volunteer-system', 'mbti-aroma-advisor']
                  .map(name => state.data.repos.find(repo => repo.name === name))
                  .filter((repo): repo is GitHubRepository => Boolean(repo))
                  .map(repo => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
