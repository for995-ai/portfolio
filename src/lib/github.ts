// ─── GitHub data service ─────────────────────────────────────────────────────
//
// Reads a **static snapshot** at /data/github.json, generated at build time by
// scripts/update-github-snapshot.mjs. That keeps the dashboard stable for
// visitors: the GitHub public API allows only 60 requests/hour/IP, so calling
// it from the browser meant a shared office or campus network could exhaust the
// quota and show a degraded section to the next visitor.
//
// The live API remains only as a last-resort fallback if the snapshot is
// missing. No token is read, stored, or shipped by anything in this file.

const USER = 'for995-ai';
const API  = 'https://api.github.com';
const SNAPSHOT_URL = '/data/github.json';

/**
 * Allowlist of public repositories worth showing in a portfolio.
 *
 * Only names present here AND present in the snapshot are rendered — the
 * account also holds scratch/placeholder repos that would weaken the section.
 * Add a name here to surface it; order in this array is display order.
 *
 * Note: some work lives in *private* repositories (e.g. photo-swipe-cleaner,
 * which backs the 相簿滑滑整理 APP project). Those are intentionally absent —
 * a visitor could not open them — while the project itself still appears in
 * the Projects section.
 */
const featuredPublicRepoNames: string[] = [
  'portfolio',
];

const LANGUAGE_SAMPLE_LIMIT = 12;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GitHubProfile {
  login:       string;
  name:        string | null;
  avatarUrl:   string;
  htmlUrl:     string;
  publicRepos: number;
  followers:   number;
  following:   number;
  totalStars:  number;
}

export interface GitHubLanguageStat {
  language:   string;
  bytes:      number;
  percentage: number;
}

export interface GitHubRepository {
  id:          number;
  name:        string;
  description: string | null;
  htmlUrl:     string;
  language:    string | null;
  stars:       number;
  forks:       number;
  updatedAt:   string;
}

export interface GitHubContributionDay {
  date:  string;
  count: number;
  /** Intensity bucket, precomputed by the snapshot script. */
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubContributionWeek {
  contributionDays: GitHubContributionDay[];
}

/**
 * Contribution calendar. Only ever populated from a tokened build-time run —
 * never estimated. `null` means "not synced yet", and the UI says nothing
 * about why.
 */
export interface GitHubContributions {
  total:         number;
  currentStreak: number;
  longestStreak: number;
  weeks:         GitHubContributionWeek[];
}

export interface GitHubData {
  profile:       GitHubProfile;
  languages:     GitHubLanguageStat[];
  repos:         GitHubRepository[];
  contributions: GitHubContributions | null;
  /** ISO timestamp of the snapshot, or null when served from the live API. */
  generatedAt:   string | null;
}

// ─── Snapshot shape (what the generator writes) ──────────────────────────────

interface Snapshot {
  generatedAt:   string;
  profile:       GitHubProfile;
  languages:     GitHubLanguageStat[];
  contributions: GitHubContributions | null;
  repos:         GitHubRepository[];
}

// ─── Curation ────────────────────────────────────────────────────────────────

/**
 * Intersect available repos with the allowlist, preserving allowlist order.
 * Nothing is padded in to reach a target count — the section is
 * content-driven, so one strong repo renders as one card.
 */
function curate(repos: GitHubRepository[]): GitHubRepository[] {
  const byName = new Map(repos.map(r => [r.name, r]));
  return featuredPublicRepoNames
    .map(name => byName.get(name))
    .filter((r): r is GitHubRepository => r !== undefined);
}

// ─── Snapshot path ───────────────────────────────────────────────────────────

async function loadSnapshot(): Promise<GitHubData> {
  const res = await fetch(SNAPSHOT_URL, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`snapshot ${res.status}`);
  const snap = (await res.json()) as Snapshot;

  return {
    profile:       snap.profile,
    languages:     snap.languages ?? [],
    contributions: snap.contributions ?? null,
    generatedAt:   snap.generatedAt ?? null,
    repos:         curate(snap.repos ?? []),
  };
}

// ─── Live API fallback ───────────────────────────────────────────────────────

interface RawUser {
  login: string; name: string | null; avatar_url: string; html_url: string;
  public_repos: number; followers: number; following: number;
}
interface RawRepo {
  id: number; name: string; description: string | null; html_url: string;
  language: string | null; stargazers_count: number; forks_count: number;
  updated_at: string; fork: boolean; archived: boolean;
}

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: { Accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

async function loadLive(): Promise<GitHubData> {
  const [user, allRepos] = await Promise.all([
    getJSON<RawUser>(`/users/${USER}`),
    getJSON<RawRepo[]>(`/users/${USER}/repos?per_page=100&sort=updated`),
  ]);

  const own = allRepos.filter(r => !r.fork && !r.archived);

  const results = await Promise.allSettled(
    own.slice(0, LANGUAGE_SAMPLE_LIMIT)
       .map(r => getJSON<Record<string, number>>(`/repos/${USER}/${r.name}/languages`)),
  );
  const totals = new Map<string, number>();
  for (const r of results) {
    if (r.status !== 'fulfilled') continue;
    for (const [lang, bytes] of Object.entries(r.value)) {
      totals.set(lang, (totals.get(lang) ?? 0) + bytes);
    }
  }
  const grand = [...totals.values()].reduce((a, b) => a + b, 0);
  const languages = grand === 0 ? [] : [...totals.entries()]
    .map(([language, bytes]) => ({ language, bytes, percentage: (bytes / grand) * 100 }))
    .sort((a, b) => b.bytes - a.bytes);

  const mapped: GitHubRepository[] = own.map(r => ({
    id: r.id, name: r.name, description: r.description, htmlUrl: r.html_url,
    language: r.language, stars: r.stargazers_count, forks: r.forks_count,
    updatedAt: r.updated_at,
  }));

  return {
    profile: {
      login: user.login, name: user.name, avatarUrl: user.avatar_url,
      htmlUrl: user.html_url, publicRepos: user.public_repos,
      followers: user.followers, following: user.following,
      totalStars: own.reduce((s, r) => s + r.stargazers_count, 0),
    },
    languages,
    contributions: null,
    generatedAt: null,
    repos: curate(mapped),
  };
}

// ─── Public entry point (module-level cache) ─────────────────────────────────

let inflight: Promise<GitHubData> | null = null;

/**
 * Snapshot first, live API only if the snapshot is unavailable. Memoised, so
 * scrolling past the section repeatedly never refetches.
 */
export function fetchGitHubData(): Promise<GitHubData> {
  if (!inflight) {
    inflight = loadSnapshot()
      .catch(() => loadLive())
      .catch(err => {
        inflight = null; // allow a later mount to retry
        throw err;
      });
  }
  return inflight;
}

export const GITHUB_USER = USER;
export const GITHUB_URL  = `https://github.com/${USER}`;
