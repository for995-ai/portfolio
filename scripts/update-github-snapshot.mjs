#!/usr/bin/env node
// ─── GitHub snapshot generator ───────────────────────────────────────────────
//
// Writes public/data/github.json, which the site reads at runtime instead of
// calling the GitHub API from the browser. Visitors therefore never see a
// degraded dashboard because of API rate limits.
//
// Run manually:      pnpm github:snapshot
// Run in CI:         same command in a scheduled GitHub Action (see below)
//
// ── Credentials ──────────────────────────────────────────────────────────────
//
// Two *separate* names, so the trust boundary is never ambiguous:
//
//   SNAPSHOT_TOKEN  optional. Only raises the REST rate limit — every REST
//                   endpoint used here returns public data and works without
//                   it. Worth setting in CI because Actions runners share
//                   outbound IPs and can hit the 60 req/hr anonymous cap.
//
//   GRAPHQL_TOKEN   required *only* for the contribution calendar, which has
//                   no REST equivalent and rejects anonymous requests.
//
// Neither is ever logged, printed, or written into the JSON. Nothing in src/
// imports this file, so no token can reach the Vite bundle.
//
// This script requests PUBLIC data only. It never asks for private repository
// content, names, or metadata, and needs no `repo` scope.

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const USER = 'for995-ai';
const API  = 'https://api.github.com';
const OUT  = resolve(dirname(fileURLToPath(import.meta.url)), '../public/data/github.json');

const LANGUAGE_SAMPLE_LIMIT = 12;

const restToken    = process.env.SNAPSHOT_TOKEN ?? '';
const graphqlToken = process.env.GRAPHQL_TOKEN  ?? '';

/** REST headers. Auth is optional here and used purely for rate limits. */
const restHeaders = {
  Accept: 'application/vnd.github+json',
  ...(restToken ? { Authorization: `Bearer ${restToken}` } : {}),
};

async function getJSON(path) {
  const res = await fetch(`${API}${path}`, { headers: restHeaders });
  if (!res.ok) throw new Error(`GitHub REST ${res.status} for ${path}`);
  return res.json();
}

/**
 * Contribution calendar lives only on the GraphQL API, which requires a token.
 * With no token we return nulls and the UI hides the numbers rather than
 * inventing them.
 */
/** GitHub's own quartile enum → the 0–4 buckets the UI renders. */
const LEVEL_FROM_ENUM = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

async function fetchContributions() {
  if (!graphqlToken) {
    console.log('· contribution calendar: skipped (no GRAPHQL_TOKEN set)');
    return null;
  }

  // PUBLIC contribution graph only. No private repository content requested.
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }`;

  const res = await fetch(`${API}/graphql`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${graphqlToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { login: USER } }),
  });

  // Diagnostics describe *what failed*, never the credential.
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body?.message ? ` — ${body.message}` : '';
    } catch { /* non-JSON error body */ }
    console.log(`· contribution calendar: HTTP ${res.status}${detail}`);
    return null;
  }

  const json = await res.json();

  if (Array.isArray(json.errors) && json.errors.length > 0) {
    for (const e of json.errors) {
      console.log(`· contribution calendar: GraphQL ${e.type ?? 'ERROR'} — ${e.message}`);
    }
    return null;
  }

  if (!json?.data?.user) {
    console.log('· contribution calendar: user resolved to null ' +
                '(token identity cannot read this user\'s contribution graph)');
    return null;
  }

  const cal = json.data.user.contributionsCollection?.contributionCalendar;
  if (!cal) {
    console.log('· contribution calendar: contributionsCollection returned null');
    return null;
  }

  const days = cal.weeks.flatMap(w => w.contributionDays);

  console.log(`· contribution calendar: OK — total=${cal.totalContributions} ` +
              `weeks=${cal.weeks.length} days=${days.length}`);

  // Intensity comes straight from GitHub's own quartile enum, so the snapshot
  // matches what GitHub itself would render.
  const level = d => LEVEL_FROM_ENUM[d.contributionLevel] ?? 0;

  // Streaks, counted from the most recent day backwards. Today counting zero
  // does not break a streak that is otherwise alive.
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) current++;
    else if (i !== days.length - 1) break;
  }
  let longest = 0, run = 0;
  for (const d of days) {
    run = d.contributionCount > 0 ? run + 1 : 0;
    if (run > longest) longest = run;
  }

  return {
    total: cal.totalContributions,
    currentStreak: current,
    longestStreak: longest,
    weeks: cal.weeks.map(w => ({
      contributionDays: w.contributionDays.map(d => ({
        date:  d.date,
        count: d.contributionCount,
        level: level(d),
      })),
    })),
  };
}

async function main() {
  const [user, allRepos] = await Promise.all([
    getJSON(`/users/${USER}`),
    getJSON(`/users/${USER}/repos?per_page=100&sort=updated`),
  ]);

  const ownRepos = allRepos.filter(r => !r.fork && !r.archived);

  // Aggregate language bytes across public repos.
  const sample = ownRepos.slice(0, LANGUAGE_SAMPLE_LIMIT);
  const results = await Promise.allSettled(
    sample.map(r => getJSON(`/repos/${USER}/${r.name}/languages`)),
  );

  const totals = new Map();
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

  const snapshot = {
    generatedAt: new Date().toISOString(),
    profile: {
      login:       user.login,
      name:        user.name,
      avatarUrl:   user.avatar_url,
      htmlUrl:     user.html_url,
      publicRepos: user.public_repos,
      followers:   user.followers,
      following:   user.following,
      totalStars:  ownRepos.reduce((s, r) => s + r.stargazers_count, 0),
    },
    languages,
    contributions: await fetchContributions(),
    repos: ownRepos.map(r => ({
      id:          r.id,
      name:        r.name,
      description: r.description,
      htmlUrl:     r.html_url,
      language:    r.language,
      stars:       r.stargazers_count,
      forks:       r.forks_count,
      updatedAt:   r.updated_at,
    })),
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');

  console.log(`✓ wrote ${OUT}`);
  console.log(`  repos: ${snapshot.repos.length}  languages: ${languages.length}` +
              `  contributions: ${snapshot.contributions ? 'yes' : 'none'}`);

  // Explicit verdict, so a dispatch run answers the question on its own.
  console.log(
    snapshot.contributions
      ? '\nRESULT A — the supplied GRAPHQL_TOKEN can read the PUBLIC contributionCalendar.'
      : '\nRESULT B — no contribution calendar was returned. See the diagnostic line above.',
  );
}

main().catch(err => {
  console.error('✗ snapshot failed:', err.message);
  process.exit(1);
});
