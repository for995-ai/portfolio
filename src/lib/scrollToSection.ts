// ─── Navigation scrolling — single source of truth ───────────────────────────
//
// Every nav interaction (header links, footer links, back-to-top) goes through
// this module. There is deliberately NO CSS `scroll-margin-top` and NO
// `scroll-padding-top` anywhere, so offsets can never stack.
//
// Why JS rather than CSS scroll-margin:
//
//   1. `scroll-margin-top` positions the *section wrapper*, but the wrapper
//      carries vertical padding, so the visible heading landed ~56px lower
//      than intended — the reader saw cards, not the heading.
//   2. The nav is a floating pill whose height differs between breakpoints;
//      measuring it at click time is exact, whereas a CSS constant is a guess.
//   3. Web fonts (five families, display=swap) and lazily-decoded images can
//      change element offsets *while a smooth scroll is in flight*, so the
//      position computed at click time drifts by the time it lands. A single
//      re-measurement after the animation settles removes that drift.

/** Breathing room between the nav's bottom edge and the heading. */
const DESIRED_GAP = 28;

/** How long to wait before checking whether layout shifted mid-scroll. */
const SETTLE_MS = 650;

/** Drift under this is imperceptible and not worth a corrective jump. */
const DRIFT_TOLERANCE = 4;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Bottom edge of the floating nav pill, measured live. */
function navBottom(): number {
  const pill = document.querySelector('[data-nav-pill]');
  return pill ? pill.getBoundingClientRect().bottom : 84;
}

/**
 * The element the reader should actually see first. Sections mark their
 * heading with data-section-heading; anything without one (hero, footer)
 * falls back to the section box itself.
 */
function anchorTarget(section: HTMLElement): HTMLElement {
  return section.querySelector<HTMLElement>('[data-section-heading]') ?? section;
}

/** Absolute document position that puts the heading just below the nav. */
function desiredScrollTop(section: HTMLElement): number {
  const rect = anchorTarget(section).getBoundingClientRect();
  return window.scrollY + rect.top - navBottom() - DESIRED_GAP;
}

function clamp(top: number): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, Math.min(top, Math.max(0, max)));
}

/**
 * Scroll so the section's heading sits DESIRED_GAP below the floating nav.
 *
 * Note: when a target sits near the end of the document the browser cannot
 * scroll far enough, and the landing position is clamped. That is expected for
 * the footer, which has no heading to align.
 */
export function scrollToSection(id: string): void {
  const section = document.getElementById(id);
  if (!section) return;

  // The hero occupies the top of the page; its natural home is the very top.
  if (id === 'hero') {
    scrollToTop();
    return;
  }

  const reduced = prefersReducedMotion();
  window.scrollTo({ top: clamp(desiredScrollTop(section)), behavior: reduced ? 'auto' : 'smooth' });

  if (reduced) return;

  // Re-measure once the animation and any late layout work have settled.
  window.setTimeout(() => {
    const corrected = clamp(desiredScrollTop(section));
    if (Math.abs(corrected - window.scrollY) > DRIFT_TOLERANCE) {
      window.scrollTo({ top: corrected, behavior: 'auto' });
    }
  }, SETTLE_MS);
}

export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}
