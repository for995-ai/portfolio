import { useEffect, useId, useState } from 'react';
import { prefersReducedMotion } from '@/hooks/useInView';
import { useScrollProgress } from '@/hooks/useScrollProgress';

/**
 * 手把碎片場（position: fixed 獨立圖層，非各區塊內嵌）。
 * 全頁滾動進度驅動：視差位移＋持續旋轉＋sin 水平飄移，
 * 各碎片 activeRange 錯開 → 「零件從首屏飛散後一路飄過各區塊」。
 *
 * 效能與存在感控制：
 * - 同時可見上限 6 片（手機 3 片）、透明度 ≤ 0.4
 * - pointer-events-none、aria-hidden、z 低於內容（main 為 z-[1]）
 * - prefers-reduced-motion：停用所有位移旋轉，僅呈現 4 片靜態低透明碎片
 */

type FragmentShape =
  | 'dpad'
  | 'circle'
  | 'rect'
  | 'body-half'
  | 'shard'
  | 'stack'
  | 'sliver';

interface FragmentConfig {
  id: string;
  /** 所屬區塊風格（scattered-parts / edge-frame / timeline-nodes / grid-corner / stack-layer / minimal-line） */
  variant: string;
  shape: FragmentShape;
  size: number;
  /** 螢幕定位（fixed 座標） */
  pos: { left?: string; right?: string; top: string };
  /** 可見進度區間（錯開，讓不同區塊看到不同碎片） */
  range: [number, number];
  /** 視差深度係數 0.15–0.6（刻意不均勻） */
  depth: number;
  /** 持續旋轉速度（-180 至 180 deg / 全頁） */
  rotateSpeed: number;
  /** 水平 sin 飄移相位 */
  phase: number;
  maxOpacity: number;
  /** reduced-motion 靜態模式下保留的代表碎片 */
  static?: boolean;
}

const CONFIGS: FragmentConfig[] = [
  /* LV.1 scattered-parts：方向鍵＋按鍵散落右上 */
  { id: 'sp-dpad', variant: 'scattered-parts', shape: 'dpad', size: 56, pos: { right: '10%', top: '24vh' }, range: [0.05, 0.26], depth: 0.3, rotateSpeed: 120, phase: 0, maxOpacity: 0.35, static: true },
  { id: 'sp-c1', variant: 'scattered-parts', shape: 'circle', size: 40, pos: { right: '20%', top: '14vh' }, range: [0.07, 0.27], depth: 0.5, rotateSpeed: -160, phase: 1.2, maxOpacity: 0.35 },
  { id: 'sp-c2', variant: 'scattered-parts', shape: 'circle', size: 28, pos: { right: '5%', top: '44vh' }, range: [0.09, 0.3], depth: 0.18, rotateSpeed: 80, phase: 2.5, maxOpacity: 0.3 },
  /* LV.2 edge-frame：主體半殼貼左緣切邊＋洋紅小碎片＋肩鍵飄移 */
  { id: 'ef-body', variant: 'edge-frame', shape: 'body-half', size: 180, pos: { left: '-70px', top: '34vh' }, range: [0.24, 0.5], depth: 0.22, rotateSpeed: 40, phase: 0.6, maxOpacity: 0.18, static: true },
  { id: 'ef-shard', variant: 'edge-frame', shape: 'shard', size: 48, pos: { right: '9%', top: '12vh' }, range: [0.25, 0.36], depth: 0.45, rotateSpeed: -100, phase: 1.8, maxOpacity: 0.4 },
  { id: 'ef-trigger', variant: 'edge-frame', shape: 'rect', size: 44, pos: { right: '16%', top: '56vh' }, range: [0.35, 0.5], depth: 0.6, rotateSpeed: 170, phase: 3.4, maxOpacity: 0.3 },
  /* LV.3 timeline-nodes：搖桿帽沿左側錯開 */
  { id: 'tn-1', variant: 'timeline-nodes', shape: 'circle', size: 28, pos: { left: '5%', top: '20vh' }, range: [0.48, 0.64], depth: 0.35, rotateSpeed: 150, phase: 0.3, maxOpacity: 0.4, static: true },
  { id: 'tn-2', variant: 'timeline-nodes', shape: 'circle', size: 32, pos: { left: '9%', top: '48vh' }, range: [0.5, 0.66], depth: 0.55, rotateSpeed: -130, phase: 1.5, maxOpacity: 0.4 },
  { id: 'tn-3', variant: 'timeline-nodes', shape: 'circle', size: 24, pos: { left: '4%', top: '70vh' }, range: [0.52, 0.68], depth: 0.25, rotateSpeed: 90, phase: 2.8, maxOpacity: 0.35 },
  /* LV.4 grid-corner：觸控板於右下角 */
  { id: 'gc-pad', variant: 'grid-corner', shape: 'rect', size: 96, pos: { right: '3%', top: '66vh' }, range: [0.62, 0.8], depth: 0.15, rotateSpeed: 30, phase: 0.9, maxOpacity: 0.25, static: true },
  /* LV.5 stack-layer：肩鍵三片層疊 */
  { id: 'sl-stack', variant: 'stack-layer', shape: 'stack', size: 60, pos: { left: '10%', top: '22vh' }, range: [0.74, 0.88], depth: 0.4, rotateSpeed: -60, phase: 2.1, maxOpacity: 0.3 },
  /* ARCHIVE minimal-line：極細切片，最安靜 */
  { id: 'ml-sliver', variant: 'minimal-line', shape: 'sliver', size: 160, pos: { left: '6px', top: '30vh' }, range: [0.84, 0.96], depth: 0.2, rotateSpeed: 15, phase: 0.5, maxOpacity: 0.12 },
];

/** 淡入淡出邊界寬度（進度單位） */
const FADE_ZONE = 0.05;
/** 視差位移量級（px / depth / 全頁進度） */
const PARALLAX_SCALE = 600;

/* ============ 磨砂鋁金 SVG 基底（漸層＋拉絲＋高光＋淡描邊） ============ */

function MetalDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-alu`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8a8f9e" />
        <stop offset="0.5" stopColor="#b8bcc8" />
        <stop offset="1" stopColor="#6e6e85" />
      </linearGradient>
      <pattern id={`${id}-brush`} width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(135)">
        <line x1="0" y1="0" x2="0" y2="2" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      </pattern>
      <linearGradient id={`${id}-hl`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(255,255,255,0.25)" />
        <stop offset="1" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>
  );
}

function FragmentShapeSvg({ shape, size }: { shape: FragmentShape; size: number }) {
  const id = useId().replace(/:/g, '');

  switch (shape) {
    case 'dpad': {
      const t = size * 0.3;
      const o = (size - t) / 2;
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <MetalDefs id={id} />
          <rect x={o} y="0" width={t} height={size} rx="3" fill={`url(#${id}-alu)`} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <rect x="0" y={o} width={size} height={t} rx="3" fill={`url(#${id}-alu)`} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <rect x={o} y="0" width={t} height={size} rx="3" fill={`url(#${id}-brush)`} />
          <rect x="0" y={o} width={size} height={t} rx="3" fill={`url(#${id}-brush)`} />
          <rect x={o} y="0" width={t} height={size * 0.18} rx="2" fill={`url(#${id}-hl)`} />
        </svg>
      );
    }
    case 'circle': {
      const r = size / 2;
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <MetalDefs id={id} />
          <circle cx={r} cy={r} r={r - 0.5} fill={`url(#${id}-alu)`} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <circle cx={r} cy={r} r={r - 0.5} fill={`url(#${id}-brush)`} />
          <ellipse cx={r} cy={r * 0.55} rx={r * 0.7} ry={r * 0.28} fill={`url(#${id}-hl)`} />
        </svg>
      );
    }
    case 'rect': {
      const h = Math.round(size * 0.55);
      return (
        <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`}>
          <MetalDefs id={id} />
          <rect width={size} height={h} rx={h * 0.2} fill={`url(#${id}-alu)`} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <rect width={size} height={h} rx={h * 0.2} fill={`url(#${id}-brush)`} />
          <rect width={size} height={h * 0.2} rx={h * 0.1} fill={`url(#${id}-hl)`} />
        </svg>
      );
    }
    case 'body-half': {
      const w = size;
      const h = Math.round(size * 0.72);
      const d =
        'M20,30 C40,10 90,4 120,10 C160,18 176,50 172,84 C168,112 140,126 104,124 C60,122 24,104 14,72 C8,52 10,40 20,30 Z';
      return (
        <svg width={w} height={h} viewBox="0 0 180 130">
          <MetalDefs id={id} />
          <path d={d} fill={`url(#${id}-alu)`} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <path d={d} fill={`url(#${id}-brush)`} />
          <path d="M20,30 C40,10 90,4 120,10 C150,16 166,34 171,56 L12,56 C12,44 14,36 20,30 Z" fill={`url(#${id}-hl)`} />
        </svg>
      );
    }
    case 'shard': {
      const h = Math.round(size * 0.7);
      return (
        <svg
          width={size}
          height={h}
          viewBox={`0 0 ${size} ${h}`}
          style={{ filter: 'drop-shadow(0 0 6px rgba(255,46,159,0.45))' }}
        >
          <MetalDefs id={id} />
          <rect width={size} height={h} rx="6" fill={`url(#${id}-alu)`} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <rect width={size} height={h} rx="6" fill={`url(#${id}-brush)`} />
          <rect width={size} height={h * 0.2} rx="3" fill={`url(#${id}-hl)`} />
          <rect width={size} height={h} rx="6" fill="none" stroke="rgba(255,46,159,0.5)" strokeWidth="1" />
        </svg>
      );
    }
    case 'stack': {
      const w = size;
      const h = Math.round(size * 0.45);
      const layers = [
        { rot: -8, dx: 0, dy: 0 },
        { rot: 4, dx: 10, dy: 8 },
        { rot: 14, dx: 20, dy: 16 },
      ];
      return (
        <svg width={w + 28} height={h + 24} viewBox={`0 0 ${w + 28} ${h + 24}`}>
          <MetalDefs id={id} />
          {layers.map((l, i) => (
            <g key={i} transform={`translate(${l.dx},${l.dy}) rotate(${l.rot} ${w / 2} ${h / 2})`}>
              <rect width={w} height={h} rx={h * 0.3} fill={`url(#${id}-alu)`} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <rect width={w} height={h} rx={h * 0.3} fill={`url(#${id}-brush)`} />
              <rect width={w} height={h * 0.22} rx={h * 0.15} fill={`url(#${id}-hl)`} />
            </g>
          ))}
        </svg>
      );
    }
    case 'sliver':
      return (
        <svg width="5" height={size} viewBox={`0 0 5 ${size}`}>
          <MetalDefs id={id} />
          <rect width="5" height={size} rx="2" fill={`url(#${id}-alu)`} stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
          <rect width="5" height={size * 0.2} rx="2" fill={`url(#${id}-hl)`} />
        </svg>
      );
  }
}

/* ============ 碎片場 ============ */

export function FragmentField() {
  const progress = useScrollProgress();
  const reduced = prefersReducedMotion();
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const update = () => setMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  /* reduced-motion：僅 4 片代表碎片，靜態低透明，無任何位移旋轉 */
  if (reduced) {
    return (
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden">
        {CONFIGS.filter((c) => c.static).map((cfg) => (
          <div key={cfg.id} style={{ position: 'absolute', ...cfg.pos, opacity: 0.12 }}>
            <FragmentShapeSvg shape={cfg.shape} size={cfg.size} />
          </div>
        ))}
      </div>
    );
  }

  const cap = mobile ? 3 : 6;
  const candidates = CONFIGS.filter(
    (c) => progress >= c.range[0] - FADE_ZONE && progress <= c.range[1] + FADE_ZONE,
  )
    .sort((a, b) => {
      const da = Math.abs(progress - (a.range[0] + a.range[1]) / 2);
      const db = Math.abs(progress - (b.range[0] + b.range[1]) / 2);
      return da - db;
    })
    .slice(0, cap);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden">
      {candidates.map((cfg) => {
        const anchor = (cfg.range[0] + cfg.range[1]) / 2;
        const rel = progress - anchor;
        /* 視差位移＋持續旋轉＋sin 水平飄移 */
        const ty = rel * cfg.depth * PARALLAX_SCALE;
        const tx = Math.sin(progress * Math.PI * 2 + cfg.phase) * 20;
        const rot = progress * cfg.rotateSpeed;
        /* activeRange 邊界淡入淡出 */
        const edge = Math.min(progress - cfg.range[0] + FADE_ZONE, cfg.range[1] + FADE_ZONE - progress);
        const opacity = cfg.maxOpacity * Math.min(Math.max(edge / FADE_ZONE, 0), 1);

        return (
          <div
            key={cfg.id}
            style={{
              position: 'absolute',
              ...cfg.pos,
              opacity,
              transform: `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg)`,
              willChange: 'transform',
            }}
          >
            <FragmentShapeSvg shape={cfg.shape} size={cfg.size} />
          </div>
        );
      })}
    </div>
  );
}
