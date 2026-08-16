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

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
      <span style={{ fontSize: '0.8125rem', color: 'var(--v2-text-sec)' }}>{label}</span>
      <span
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: '0.9375rem',
          fontWeight: 700,
          color: 'var(--v2-text)',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function ProfileCard({ data }: { data: GitHubData }) {
  const { profile } = data;

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={profile.avatarUrl}
            alt=""
            width={56}
            height={56}
            loading="lazy"
            decoding="async"
            style={{ borderRadius: '50%', border: '2px solid var(--v2-border)', display: 'block' }}
          />
          {/* Micro-pixel accent — the single brand mark in this section */}
          <span
            aria-hidden
            className="v2-px-dot"
            style={{ position: 'absolute', right: -1, bottom: 3 }}
          />
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: 'var(--v2-text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            @{profile.login}
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--v2-text-sec)', marginTop: '2px' }}>
            MING WEI SU
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', marginBottom: '14px' }}>
        <CardLabel>GitHub Overview</CardLabel>
        <span style={{ fontSize: '0.65rem', color: 'var(--v2-text-faint)', whiteSpace: 'nowrap' }}>
          Public activity only
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <StatRow label="Repositories" value={profile.publicRepos} />
        <StatRow label="Followers"    value={profile.followers} />
        <StatRow label="Following"    value={profile.following} />
        <StatRow label="Stars"        value={profile.totalStars} />
      </div>

      <a
        href={profile.htmlUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="v2-bubble-btn v2-bubble-btn--secondary"
        style={{ width: '100%', marginTop: '20px' }}
      >
        GitHub Profile ↗
      </a>
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

function ContributionCard({ contributions }: { contributions: GitHubContributions | null }) {
  if (!contributions) {
    // Compact state — no dead space, and nothing about why it is empty.
    return (
      <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <CardLabel>Contribution Activity</CardLabel>
          <p style={{ fontSize: '0.8125rem', color: 'var(--v2-text-sec)', marginTop: '-6px' }}>
            資料同步中
          </p>
        </div>
        <a
          href={`${GITHUB_URL}?tab=overview`}
          target="_blank"
          rel="noopener noreferrer"
          className="v2-bubble-btn v2-bubble-btn--soft"
          style={{ flexShrink: 0 }}
        >
          View on GitHub ↗
        </a>
      </Card>
    );
  }

  const { total, currentStreak, longestStreak, weeks } = contributions;

  return (
    <Card style={{ display: 'flex', flexDirection: 'column' }}>
      <CardLabel>Contribution Activity</CardLabel>

      <Calendar weeks={weeks} />

      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px',
          marginTop: '22px', paddingTop: '18px', borderTop: '1px solid var(--v2-border)',
        }}
      >
        <StreakStat value={total.toLocaleString()}   label="Total Contributions" />
        <StreakStat value={`${currentStreak} days`}  label="Current Streak" />
        <StreakStat value={`${longestStreak} days`}  label="Longest Streak" />
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
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <MetaIcon path={STAR_PATH} /> {repo.stars}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <MetaIcon path={FORK_PATH} /> {repo.forks}
        </span>
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
          {/* Top composition.
              With a synced calendar the classic dashboard applies: profile and
              languages stacked at left, calendar filling the right. Without it
              the calendar card is only a slim bar, so putting it in a column
              would leave a hole — profile and languages go side by side and the
              bar spans the full width underneath. */}
          {state.data.contributions ? (
            <div className="v2-gh-grid">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <ProfileCard data={state.data} />
                {state.data.languages.length > 0 && (
                  <LanguageCard languages={state.data.languages} />
                )}
              </div>
              <ContributionCard contributions={state.data.contributions} />
            </div>
          ) : (
            <>
              <div className="v2-gh-split">
                <ProfileCard data={state.data} />
                {state.data.languages.length > 0 && (
                  <LanguageCard languages={state.data.languages} />
                )}
              </div>
              <div style={{ marginTop: '20px' }}>
                <ContributionCard contributions={null} />
              </div>
            </>
          )}

          {/* Curated public repositories */}
          {state.data.repos.length > 0 && (
            <>
              <SubHeading label="Public Repositories" />
              <div className="v2-gh-repos">
                {state.data.repos.map(repo => (
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
