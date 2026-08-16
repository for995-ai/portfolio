// ─── Base-aware public asset URLs ────────────────────────────────────────────
//
// The site is served from the domain root during local development and from
// /portfolio/ on GitHub Pages. Asset paths are written root-relative in the
// data layer ('/images/…') and resolved through this helper wherever they
// reach the DOM, so no path is ever hardcoded to a deployment target.
//
// Vite sets BASE_URL to '/' in dev and '/portfolio/' in a production build,
// and it always carries a trailing slash.

const BASE_URL = import.meta.env.BASE_URL;

/**
 * Resolve a public asset path against the deployment base.
 *
 * Idempotent: a path that already carries the base is returned unchanged, so
 * passing a value through twice (e.g. component → Lightbox) is harmless.
 * Absolute URLs and data URIs pass through untouched.
 */
export function publicUrl(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;

  const base = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  if (base !== '/' && path.startsWith(base)) return path;

  return `${base}${path.replace(/^\/+/, '')}`;
}
