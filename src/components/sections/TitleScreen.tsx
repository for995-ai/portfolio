import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/hooks/useInView';
import { useStage3D } from '@/hooks/stage3d';

/** SVG 降級版手把（磨砂鋁金質感）：2D 版本的完整主視覺 */
function GamepadSvg({ onPressStart }: { onPressStart: () => void }) {
  return (
    <svg
      viewBox="0 0 560 340"
      className="w-full [filter:drop-shadow(0_0_20px_rgba(139,92,255,0.35))]"
      role="img"
      aria-label="遊戲手把"
    >
      <defs>
        {/* 磨砂鋁金：#8A8F9E → #B8BCC8 → #6E6E85 斜向 135deg */}
        <linearGradient id="padAlu" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a8f9e" />
          <stop offset="0.5" stopColor="#b8bcc8" />
          <stop offset="1" stopColor="#6e6e85" />
        </linearGradient>
        <linearGradient id="padHighlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.25)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <pattern id="padBrush" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(135)">
          <line x1="0" y1="0" x2="0" y2="2" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        </pattern>
        <radialGradient id="stickCap" cx="0.5" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#b8bcc8" />
          <stop offset="1" stopColor="#6e6e85" />
        </radialGradient>
      </defs>

      {/* 手把本體：鋁金底 + 拉絲 + 上緣高光 */}
      <g>
        <path
          id="padShape"
          d="M148,78 C190,62 240,56 280,56 C320,56 370,62 412,78
             C452,94 470,118 486,160 C502,204 514,244 508,272
             C502,296 484,310 462,308 C436,306 420,284 404,264
             C390,246 372,236 348,232 L212,232
             C188,236 170,246 156,264 C140,284 124,306 98,308
             C76,310 58,296 52,272 C46,244 58,204 74,160
             C90,118 108,94 148,78 Z"
          fill="url(#padAlu)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
        <use href="#padShape" fill="url(#padBrush)" />
        <path
          d="M148,78 C190,62 240,56 280,56 C320,56 370,62 412,78
             C440,89 458,105 472,130 L88,130 C102,105 120,89 148,78 Z"
          fill="url(#padHighlight)"
        />
      </g>

      {/* 十字鍵 */}
      <g fill="#8a8f9e" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5">
        <rect x="144" y="130" width="16" height="52" rx="4" />
        <rect x="126" y="148" width="52" height="16" rx="4" />
      </g>

      {/* 動作鍵 */}
      <g fill="#8a8f9e" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5">
        <circle cx="408" cy="124" r="14" />
        <circle cx="441" cy="157" r="14" />
        <circle cx="408" cy="190" r="14" />
        <circle cx="375" cy="157" r="14" />
      </g>

      {/* 類比搖桿 */}
      <g>
        <circle cx="224" cy="204" r="24" fill="#6e6e85" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <circle cx="224" cy="204" r="15" fill="url(#stickCap)" />
        <circle cx="336" cy="204" r="24" fill="#6e6e85" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <circle cx="336" cy="204" r="15" fill="url(#stickCap)" />
      </g>

      {/* 中央觸控板（更霧）+ START 鍵（洋紅發光）：可點擊 */}
      <g
        role="button"
        tabIndex={0}
        aria-label="按下 START，前往專案作品"
        className="group cursor-pointer focus:outline-none"
        onClick={onPressStart}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPressStart();
          }
        }}
      >
        <rect x="216" y="74" width="128" height="54" rx="12" fill="#6e6e85" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
        <rect x="216" y="74" width="128" height="54" rx="12" fill="url(#padBrush)" />
        <g className="arcade-breathe">
          <rect
            x="252"
            y="192"
            width="56"
            height="24"
            rx="12"
            fill="#272045"
            stroke="var(--dopa-magenta)"
            strokeWidth="1.5"
            className="transition-all duration-300 group-hover:stroke-[#ff2e9f]"
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,46,159,0.6))' }}
          />
          <text
            x="280"
            y="208"
            textAnchor="middle"
            className="font-mono"
            fontSize="10"
            fontWeight="700"
            letterSpacing="3"
            fill="var(--dopa-magenta)"
          >
            START
          </text>
        </g>
      </g>
    </svg>
  );
}

/** Section 1 — TitleScreen（100vh，不對稱佈局；3D 舞台啟用時手把由 Stage00 呈現） */
export function TitleScreen() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [ratio, setRatio] = useState(1);
  const [glitching, setGlitching] = useState(false);
  const stage3D = useStage3D();

  /* IO 驅動 2D 手把淡出（禁止 scroll 監聽） */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setRatio(entry.intersectionRatio),
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pressStart = () => {
    const scrollToQuests = () =>
      document.getElementById('level-2')?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });

    if (prefersReducedMotion() || glitching) {
      scrollToQuests();
      return;
    }
    setGlitching(true);
    setTimeout(() => {
      setGlitching(false);
      scrollToQuests();
    }, 260);
  };

  /* 2D 手把滾動淡出：opacity + translateY(-40px) + scale(0.92) */
  const padStyle = {
    opacity: Math.pow(ratio, 1.5),
    transform: `translateY(${(1 - ratio) * -40}px) scale(${0.92 + 0.08 * ratio})`,
    transition: 'opacity 150ms linear, transform 150ms linear',
  };

  return (
    <section
      id="title-screen"
      ref={sectionRef}
      aria-label="開場畫面 蘇洺崴"
      className="relative min-h-svh overflow-hidden"
    >
      {/* 保留原本藍紫科技感：極淡色球（像素夕陽之上的一層冷色調） */}
      <div
        className="arcade-blob-b pointer-events-none absolute -bottom-[18vh] -right-[12vw] h-[50vw] w-[50vw] rounded-full blur-3xl"
        style={{ background: 'rgba(0,240,255,0.10)' }}
        aria-hidden="true"
      />
      {/* 靜態掃描線橫紋 */}
      <div className="arcade-scanline-static pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* glitch 時的 scanline 覆蓋層 */}
      <div className={`arcade-scanlines ${glitching ? 'is-glitching' : ''}`} aria-hidden="true" />

      <div
        className={`relative z-10 flex min-h-svh flex-col justify-center px-6 pb-24 pt-16 md:block md:px-0 md:pb-0 md:pt-0 ${
          glitching ? 'is-glitching' : ''
        }`}
      >
        {/* 文字群：左對齊，距左緣 8vw、垂直略高於中線 */}
        <div className="md:absolute md:left-[8vw] md:top-[44%] md:max-w-xl md:-translate-y-1/2">
          <span className="px-tag px-tag--coral">PLAYER 01</span>

          {/* 大型像素姓名標題：階梯式硬陰影堆疊出立體感 */}
          <h1
            className="zh-heading mt-3 font-sans text-[clamp(2.75rem,9vw,5rem)] font-black leading-[1.05] text-px-white"
            style={{ textShadow: '3px 3px 0 #17102b, 6px 6px 0 #d6337f, 9px 9px 0 #5b2a86' }}
          >
            蘇洺崴
          </h1>
          <p className="px-title mt-3 text-[0.72rem] text-px-cream md:text-[0.85rem]">
            SU MING-WEI
          </p>

          <div className="px-rule mt-4 w-32" aria-hidden="true" />

          {/* 專業定位（沿用既有真實定位，未新增頭銜） */}
          <p className="px-title mt-4 text-[0.6rem] leading-[1.9] text-px-peach md:text-[0.68rem]">
            UI/UX DESIGNER
            <span className="mx-2 text-px-coral">/</span>
            FRONT-END CREATOR
            <span className="mx-2 text-px-coral">/</span>
            INTERACTIVE LEARNING
          </p>
          <p className="mt-3 text-[0.95rem] leading-[1.7] text-px-cream">
            國立聯合大學 資訊管理學系
          </p>
          <p className="zh-body mt-3 max-w-[46ch] text-base leading-[1.7] text-px-peach">
            把介面設計、前端實作與遊戲化學習結合，做成看得懂、用得動、記得住的數位體驗。
          </p>

          {/* 主要動作 */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#level-2" className="px-btn px-btn--primary">
              查看作品
            </a>
            <a href="#stage-clear" className="px-btn">
              聯絡我
            </a>
          </div>

          <p className="px-title px-blink mt-6 text-[0.55rem] text-px-cream">
            ▶ PRESS START / SCROLL
          </p>
        </div>

        {/* 手把：置右側偏下。3D 舞台啟用時由 Stage00 呈現，SVG 交叉淡出（400ms） */}
        <div className="mt-12 flex justify-center md:absolute md:right-[6vw] md:top-[55%] md:mt-0 md:block md:-translate-y-1/2">
          <div className="relative aspect-square w-[min(72vw,340px)] md:w-[clamp(360px,38vw,560px)]">
            <div
              className={`absolute inset-0 flex items-center transition-opacity duration-[400ms] ${
                stage3D ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
              aria-hidden={stage3D ? 'true' : undefined}
            >
              <div style={padStyle} className="w-full">
                <div className="arcade-float">
                  <GamepadSvg onPressStart={pressStart} />
                </div>
              </div>
            </div>

            {/* 3D 模式：透明的 START 按鈕（鍵盤與滑鼠操作皆保留） */}
            {stage3D && (
              <button
                type="button"
                onClick={pressStart}
                aria-label="按下 START，前往專案作品"
                className="absolute left-1/2 top-1/2 h-24 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-0 bg-transparent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-dopa-cyan"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
