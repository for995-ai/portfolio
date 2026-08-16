// ─── Hero background slideshow ───────────────────────────────────────────────
//
// Data-driven Hero cover. Add entries here and the slideshow picks them up
// automatically — no JSX changes needed.
//
//   • 0 photos → gradient mesh fallback
//   • 1 photo  → static photo cover, no animation
//   • 2+       → automatic crossfade slideshow, fixed order (never shuffled)
//
// Order below is deliberate and tells a background story:
//   參與 → 主持 → 服務 → 團隊 → 校園 → 教育服務 → 校園生活 → 團隊成果 → 夥伴
//
// ── How the crop values were derived ────────────────────────────────────────
// `object-fit: cover` only crops along the axis where the image is
// proportionally larger than the viewport. Measured per photo:
//
//   1440×900 (ar 1.60): every photo is *narrower* in ratio, so the image is
//     scaled to full width and only the VERTICAL axis is cropped
//     (ar-1.50 photos lose ~6% of height; ar-1.33 photos lose ~17%).
//     → `position`'s Y value is what does the work here; X has little or no
//       effect at exactly this size, but matters from ~1280px down.
//
//   1024×900 (ar 1.14) and 390×844 (ar 0.46): the image is scaled to full
//     height and the HORIZONTAL axis is cropped hard — at 390px only ~31%
//     (ar 1.50) / ~35% (ar 1.33) of the frame width is visible.
//     → `mobilePosition`'s X value is critical and is set per photo so that
//       MING WEI SU stays inside the visible strip.

export interface HeroBackground {
  src: string;
  /** Documentation only — rendered decoratively with an empty alt. */
  alt: string;
  /** Desktop/tablet object-position. */
  position?: string;
  /** Narrow-viewport object-position (<768px). */
  mobilePosition?: string;
  /** Multiplier on the readability scrim. 1 = shared default. */
  overlayStrength?: number;
  /** CSS filter brightness, for photos that are far darker/brighter than the set. */
  brightness?: number;
}

export const heroBackgrounds: HeroBackground[] = [
  {
    // Subject right-of-centre (x 56–85%), head high in frame.
    src: '/images/hero/optimized/hero-01-workshop.webp',
    alt: '帶領學童手作工作坊',
    // Head sits very high (y 2%); Y biased up so the crown is never clipped.
    position: '62% 20%',
    mobilePosition: '75% 20%',
  },
  {
    // Subject slightly left of centre (head x 39–52%), mid-height.
    src: '/images/hero/optimized/hero-02-event-hosting.webp',
    alt: '手持大聲公主持營隊活動',
    position: 'center 45%',
    mobilePosition: '44% 45%',
  },
  {
    // Subject right of centre (head x 50–70%); overcast, slightly flat light.
    src: '/images/hero/optimized/hero-03-outreach-activity.webp',
    alt: '國小校園服務活動現場',
    position: '58% 45%',
    mobilePosition: '64% 45%',
    overlayStrength: 1.06,
  },
  {
    // Subject left of centre (head x 33–47%) at the head of the team line.
    src: '/images/hero/optimized/hero-04-team-leadership.webp',
    alt: '帶領志工團隊集合',
    position: 'center 42%',
    mobilePosition: '36% 42%',
  },
  {
    // NIGHT. Subject far left (head x 13–24%). Needs a brightness lift so it
    // does not read as a black frame between two daylight photos.
    src: '/images/hero/optimized/hero-05-campus-event.webp',
    alt: '夜間校園活動與夥伴合影',
    position: 'center 45%',
    mobilePosition: '12% 45%',
    brightness: 1.2,
    overlayStrength: 0.82,
  },
  {
    // Subject far left in yellow (head x 20–27%); feet near the bottom edge,
    // so the vertical crop is biased down to avoid cutting the group off.
    src: '/images/hero/optimized/hero-06-tutoring-graduation.webp',
    alt: '課輔營隊結業頒證合影',
    position: 'center 58%',
    mobilePosition: '15% 58%',
  },
  {
    // Selfie: face is large at lower-left (x 7–38%). Bright outdoor grass, so
    // the scrim is nudged up to keep the panel legible.
    src: '/images/hero/optimized/hero-07-graduation-selfie.webp',
    alt: '畢業日與同學草地自拍',
    // X biased left so his face is never clipped at tablet widths, where this
    // 4:3 frame does get cropped horizontally.
    position: '35% 46%',
    mobilePosition: '5% 46%',
    overlayStrength: 1.16,
  },
  {
    // NIGHT stage, large group (x 15–89%); subject centre in graduation gown.
    src: '/images/hero/optimized/hero-08-graduation-stage.webp',
    alt: '畢業典禮舞台大合照',
    position: 'center 48%',
    mobilePosition: '58% 48%',
    brightness: 1.1,
    overlayStrength: 0.9,
  },
  {
    // Subject carried horizontally, face right-of-centre (x 62–72%).
    src: '/images/hero/optimized/hero-09-graduation-friends.webp',
    alt: '畢業典禮與好友慶祝',
    position: 'center 45%',
    mobilePosition: '72% 45%',
    brightness: 1.06,
  },
];

/** Crossfade timing — calm and slow; 9 photos ≈ 54s for a full cycle. */
export const HERO_SLIDE_INTERVAL_MS = 6000;
export const HERO_FADE_DURATION_MS  = 1100;
