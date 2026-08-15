/**
 * 全站像素夕陽背景層（fixed、z-0、aria-hidden、pointer-events-none）。
 * 三層：夕陽漸層 → dithering 顆粒＋像素網格 → 稀疏像素雲／星。
 * 裝飾集中於畫面上緣與下緣，中央閱讀帶保持乾淨；動畫走 steps()／線性極慢平移，
 * 並受全域 prefers-reduced-motion 保護（reduce 時 animation 被停用）。
 */

/* 疏密自然的星點（上緣為主，避開中央 30%–70%） */
const STARS: Array<{ top: string; left: string; blink: boolean }> = [
  { top: '6%', left: '12%', blink: true },
  { top: '10%', left: '28%', blink: false },
  { top: '4%', left: '46%', blink: false },
  { top: '14%', left: '63%', blink: true },
  { top: '8%', left: '78%', blink: false },
  { top: '18%', left: '88%', blink: true },
  { top: '22%', left: '6%', blink: false },
  { top: '13%', left: '38%', blink: false },
  { top: '78%', left: '18%', blink: false },
  { top: '84%', left: '72%', blink: true },
];

const CLOUDS: Array<{ top: string; left: string; scale: number; cls: string }> = [
  { top: '16%', left: '4%', scale: 2.2, cls: 'px-cloud--slow' },
  { top: '26%', left: '66%', scale: 1.6, cls: 'px-cloud--slower' },
  { top: '72%', left: '10%', scale: 1.8, cls: 'px-cloud--slower' },
  { top: '86%', left: '54%', scale: 1.3, cls: 'px-cloud--slow' },
];

export function PixelSky() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* 第 1 層：深紫夜空 → 紫羅蘭 → 洋紅 → 珊瑚橘 → 奶油黃（下緣夕陽） */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #0d0b1a 0%, #1b1033 26%, #3d1b5c 46%, #7a2a6d 64%, #c9427a 78%, #ff7a4d 90%, #ffb08a 100%)',
        }}
      />

      {/* 第 2 層：dithering 顆粒 + 極淡像素網格 */}
      <div className="px-dither absolute inset-0 opacity-[0.5]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(23,16,43,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(23,16,43,0.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* 中央閱讀帶壓一層暗色，確保文字對比（不影響上下裝飾帶） */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(13,11,26,0.55) 30%, rgba(13,11,26,0.62) 70%, transparent 100%)',
        }}
      />

      {/* 第 3 層：像素星 */}
      {STARS.map((s, i) => (
        <span
          key={`s${i}`}
          className={`px-star ${s.blink ? 'px-star--blink' : ''}`}
          style={{ top: s.top, left: s.left, animationDelay: `${(i % 4) * 0.9}s` }}
        />
      ))}

      {/* 第 3 層：像素雲（極慢平移） */}
      {CLOUDS.map((c, i) => (
        <span
          key={`c${i}`}
          className={`px-cloud ${c.cls}`}
          style={{
            top: c.top,
            left: c.left,
            transform: `scale(${c.scale})`,
            transformOrigin: 'left center',
            animationDelay: `${i * -35}s`,
          }}
        />
      ))}
    </div>
  );
}
