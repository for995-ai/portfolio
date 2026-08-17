import { useId } from 'react';

/**
 * Hero preview for A7 — 相簿滑滑整理 APP.
 *
 * Drawn entirely in SVG so it stays sharp on retina, scales with the card
 * without a single media query, and adds no image asset to the bundle.
 *
 * Every colour below was sampled from the live demo at
 * for995-ai.github.io/photo-swipe-cleaner/demo/ — this is that product's
 * palette, not a second brand invented for the thumbnail. The demo uses no
 * gradients anywhere; its atmosphere comes from flat pastel circles, and the
 * same device is reused here.
 */

// Sampled from the demo
const FRAME   = '#111014';   // phone body
const SCREEN  = '#FFF8E8';   // app background
const CORAL   = '#FF7D78';   // 左滑 → 待刪
const MINT    = '#85D6AE';   // 右滑 → 保留
const PIXEL   = '#423B4D';   // the demo's hard-offset pixel shadow
const BLUSH   = '#FBE4ED';
const LAVENDER= '#E7D8FF';
const PALE    = '#F3E9FF';
const CARD    = '#FFFDF7';
const PEACH   = '#FDE7CE';
const CREAM   = '#FFF3D6';
const ORANGE  = '#F4A26B';
const SAND    = '#C09675';
const BROWN   = '#8A6247';
const INK     = '#5B4BA8';

// Phone geometry, in the demo's own proportions (341 × 740 outer, 9.5 bezel)
const PH_H = 120;
const PH_W = PH_H * (341 / 740);          // 55.3
const PH_X = 160 - PH_W / 2;              // centred in a 320-wide canvas
const PH_Y = 14;
const BEZEL = (9.5 / 341) * PH_W;
const SC_X = PH_X + BEZEL;
const SC_Y = PH_Y + BEZEL;
const SC_W = PH_W - BEZEL * 2;
const SC_H = PH_H - BEZEL * 2;

/**
 * The whole handset — frame, screen and every element on it — is authored at
 * the geometry above and then scaled as one group. Enlarging it is a single
 * number rather than thirty re-tuned coordinates, and the interior can never
 * drift out of register with the frame.
 */
const PHONE_SCALE = 1.10;
const PIVOT_X = 160;
const PIVOT_Y = 76;
const PHONE_TRANSFORM =
  `translate(${PIVOT_X} ${PIVOT_Y}) scale(${PHONE_SCALE}) translate(${-PIVOT_X} ${-PIVOT_Y})`;

// Pixel glyphs, '1' = on. Both are 11 columns wide so the two badges carry the
// same weight. The grid needs this much width: on a narrower one the diagonals
// meet after two steps and the cross collapses into an hourglass.
const GLYPH_CROSS = [
  '11.......11',
  '.11.....11.',
  '..11...11..',
  '...11.11...',
  '....111....',
  '....111....',
  '...11.11...',
  '..11...11..',
  '.11.....11.',
  '11.......11',
];

const GLYPH_CHECK = [
  '.........11',
  '........11.',
  '.......11..',
  '......11...',
  '11...11....',
  '.11.11.....',
  '..111......',
];

/**
 * Renders a glyph as solid blocks. Horizontal runs are merged into one rect so
 * adjacent pixels cannot show a hairline seam at fractional scales.
 */
function PixelGlyph({
  rows, x, y, unit, fill,
}: { rows: string[]; x: number; y: number; unit: number; fill: string }) {
  const cells: React.ReactElement[] = [];

  rows.forEach((row, r) => {
    let c = 0;
    while (c < row.length) {
      if (row[c] !== '1') { c += 1; continue; }
      let run = 1;
      while (row[c + run] === '1') run += 1;
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={x + c * unit}
          y={y + r * unit}
          width={run * unit}
          height={unit}
          fill={fill}
        />,
      );
      c += run;
    }
  });

  return <g shapeRendering="crispEdges">{cells}</g>;
}

/** A swipe badge: cream chip, hard pixel offset shadow, coloured pixel glyph. */
function SwipeBadge({
  x, y, size, rows, fill,
}: { x: number; y: number; size: number; rows: string[]; fill: string }) {
  // Sized off the column count and centred on its own bounds, so glyphs of
  // different heights (the check is shorter than the cross) both sit true.
  const cols = rows[0].length;
  const unit = (size * 0.68) / cols;

  return (
    <g>
      {/* Offset shadow — the demo's pixel-button signature, softened for scale */}
      <rect x={x + 2.4} y={y + 2.4} width={size} height={size} rx={7} fill={PIXEL} opacity={0.17} />
      <rect
        x={x} y={y} width={size} height={size} rx={7}
        fill={CARD} stroke={PIXEL} strokeOpacity={0.1} strokeWidth={0.8}
      />
      <PixelGlyph
        rows={rows}
        x={x + (size - cols * unit) / 2}
        y={y + (size - rows.length * unit) / 2}
        unit={unit}
        fill={fill}
      />
    </g>
  );
}

/** Three fading blocks reading as the trail left behind a swiped card. */
function SwipeTrail({ xs, y, fill }: { xs: number[]; y: number; fill: string }) {
  return (
    <g shapeRendering="crispEdges">
      {xs.map((x, i) => (
        <rect key={x} x={x} y={y} width={4} height={4} fill={fill} opacity={[0.5, 0.3, 0.16][i]} />
      ))}
    </g>
  );
}

export function PhotoCleanerPreview() {
  const uid = useId().replace(/:/g, '');
  const photoClip = `pc-photo-${uid}`;
  const shadow = `pc-shadow-${uid}`;

  return (
    <svg
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="相簿滑滑整理 APP：左滑待刪、右滑保留的照片整理介面"
    >
      <defs>
        <clipPath id={photoClip}>
          <rect x={137.5} y={33} width={45} height={58} rx={4.6} />
        </clipPath>
        <filter id={shadow} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#3A2E4F" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* ── Atmosphere: flat pastel circles, clipped by the card ─────────── */}
      <rect width={320} height={180} fill="#FCF8FF" />
      <circle cx={290} cy={10}  r={58} fill={LAVENDER} opacity={0.55} />
      <circle cx={38}  cy={172} r={70} fill={BLUSH}    opacity={0.6} />
      <circle cx={26}  cy={22}  r={40} fill={CREAM}    opacity={0.45} />
      {/* Halo — pulls the eye to the phone */}
      <circle cx={160} cy={PIVOT_Y} r={66} fill={PALE} opacity={0.85} />

      {/* ── Swipe language ───────────────────────────────────────────────── */}
      {/* Pulled in towards the handset so the three read as one gesture —
          左滑待刪 / 右滑保留 — rather than three unrelated icons. */}
      <SwipeBadge x={53}  y={60} size={32} rows={GLYPH_CROSS} fill={CORAL} />
      <SwipeBadge x={235} y={60} size={32} rows={GLYPH_CHECK} fill={MINT} />

      <SwipeTrail xs={[118, 111, 104]} y={74} fill={CORAL} />
      <SwipeTrail xs={[200, 207, 214]} y={74} fill={MINT} />

      {/* ── Phone, scaled as one piece ───────────────────────────────────── */}
      <g transform={PHONE_TRANSFORM}>
        <g filter={`url(#${shadow})`}>
          <rect x={PH_X} y={PH_Y} width={PH_W} height={PH_H} rx={(48 / 341) * PH_W} fill={FRAME} />
          <rect x={SC_X} y={SC_Y} width={SC_W} height={SC_H} rx={(38 / 322) * SC_W} fill={SCREEN} />
        </g>

        {/* Dynamic Island */}
        <rect x={151.5} y={18.6} width={17} height={4.6} rx={2.3} fill={FRAME} />

        {/* Session progress */}
        <rect x={139} y={26.8} width={42} height={2.4} rx={1.2} fill="#EFE7FA" />
        <rect x={139} y={26.8} width={26} height={2.4} rx={1.2} fill={MINT} />

        {/* The photo being sorted — abstract, tilted mid-swipe */}
        <g transform="rotate(-5 160 62)">
          <g clipPath={`url(#${photoClip})`}>
            <rect x={137.5} y={33} width={45} height={58} fill={PEACH} />
            <rect x={137.5} y={60} width={45} height={8} fill={CREAM} />
            <circle cx={158} cy={60} r={7} fill={ORANGE} />
            <rect x={137.5} y={68} width={45} height={23} fill={SAND} />
            <ellipse cx={149} cy={92} rx={27} ry={11} fill={BROWN} opacity={0.9} />
            <ellipse cx={172} cy={75} rx={11} ry={3} fill={CREAM} opacity={0.22} />
          </g>
          <rect
            x={137.5} y={33} width={45} height={58} rx={4.6}
            fill="none" stroke={CARD} strokeWidth={1.6}
          />
        </g>

        {/* Caption lines under the photo */}
        <rect x={139.5} y={96}  width={28} height={2.8} rx={1.4} fill="#E4DCF2" />
        <rect x={139.5} y={102} width={18} height={2.4} rx={1.2} fill="#EDE7F6" />

        {/* In-app actions, mirroring the demo's two pixel buttons */}
        <rect x={140.7} y={113.2} width={19} height={8.4} rx={2.4} fill={PIXEL} opacity={0.16} />
        <rect x={139.5} y={112}   width={19} height={8.4} rx={2.4} fill={CORAL} />
        <rect x={162.9} y={113.2} width={19} height={8.4} rx={2.4} fill={PIXEL} opacity={0.16} />
        <rect x={161.7} y={112}   width={19} height={8.4} rx={2.4} fill={MINT} />
      </g>

      {/* ── Wordmark ─────────────────────────────────────────────────────── */}
      <text
        x={160} y={167} textAnchor="middle"
        style={{ fontFamily: 'var(--font-family-v2-display)' }}
        fontSize={12} fontWeight={700} letterSpacing={1.9} fill={INK}
      >
        PHOTO SWIPE CLEANER
      </text>
    </svg>
  );
}
