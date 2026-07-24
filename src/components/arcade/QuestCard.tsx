import { useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useStage3D } from '@/hooks/stage3d';
import type { Quest } from '@/data/quests';

/** 技術標籤列：--arcade-elevated 底 + text-sec 文字（不上色） */
function TechPills({ techs }: { techs: string[] }) {
  return (
    <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0">
      {techs.map((tech) => (
        <li
          key={tech}
          className="rounded-full bg-arcade-elevated px-3 py-1 text-xs text-arcade-text-sec"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}

/** 引言：斜體＋左側細線，不加標籤文字 */
function QuestQuote({ text }: { text: string }) {
  return (
    <p className="zh-body mt-4 max-w-[68ch] border-l-2 border-arcade-faint pl-4 text-sm italic text-arcade-text-sec">
      {text}
    </p>
  );
}

function ProjectLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-5 inline-block font-mono text-xs font-bold tracking-widest text-arcade-text-sec transition-colors duration-[120ms] hover:text-dopa-cyan"
    >
      [ 查看完整專案 ↗ ]
    </a>
  );
}

/**
 * BOSS 卡：radius 2px（近直角）、2px magenta 實線外框＋光暈、
 * 右上 --grad-boss BOSS 標記、敘事區 --arcade-panel 實色。進場 600ms。
 */
export function BossQuestCard({ quest }: { quest: Quest }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const hasImage = quest.image && 'src' in quest.image;
  /* 3D 舞台模式：側廊的金屬展示台＋懸浮幾何取代佔位圖，封面縮減並隱藏線稿 */
  const stage3D = useStage3D();

  return (
    <div
      ref={ref}
      className={`arcade-reveal arcade-reveal-slow mb-24 md:mb-[160px] ${
        inView ? 'is-visible' : ''
      }`}
    >
      <article
        className="relative overflow-hidden rounded-[2px] border-2 border-dopa-magenta shadow-[0_0_36px_rgba(255,46,159,0.25)]"
        aria-label={`${quest.id} ${quest.title}`}
      >
        {/* 封面（高飽和區）：滿版大圖＋由下深色漸層壓底；3D 模式下縮減高度 */}
        <div
          className={`arcade-grid-bg relative bg-arcade-surface ${
            stage3D && quest.image && 'todo' in quest.image
              ? 'min-h-[200px] md:min-h-[240px]'
              : 'min-h-[300px] md:min-h-[380px]'
          }`}
        >
          {hasImage && quest.image && 'src' in quest.image && (
            <img
              src={encodeURI(quest.image.src)}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* 缺圖暫時視覺：--grad-boss 漸層＋深色疊層＋低透明龍形線稿 */}
          {quest.image && 'todo' in quest.image && (
            <>
              <div className="bg-grad-boss absolute inset-0 opacity-30" aria-hidden="true" />
              <div className="absolute inset-0 bg-arcade-bg/55" aria-hidden="true" />
              {!stage3D && (
              <svg
                viewBox="0 0 400 300"
                className="absolute left-1/2 top-1/2 h-auto w-[min(72%,420px)] -translate-x-1/2 -translate-y-1/2"
                aria-hidden="true"
                fill="none"
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* 龍身蜿蜒 */}
                <path d="M48,236 C96,220 88,168 132,150 C176,132 208,150 216,178 C222,202 200,218 178,210 C160,204 156,182 174,172" />
                <path d="M132,150 C136,116 158,92 194,86 C226,80 252,94 260,118 C268,142 252,164 228,164 C210,164 198,150 202,134" />
                {/* 龍首與龍角 */}
                <path d="M260,118 C276,110 290,110 302,118 C296,104 298,92 308,82" />
                <path d="M282,96 L296,72 M266,92 L274,64" />
                <circle cx="270" cy="116" r="3.5" fill="rgba(255,255,255,0.28)" stroke="none" />
                {/* 龍鬚 */}
                <path d="M300,124 C316,128 324,138 326,152 M298,130 C308,138 312,148 310,160" strokeWidth="1.8" />
                {/* 火旁龍火焰 */}
                <path d="M330,226 C346,198 334,182 350,158 C364,182 356,198 372,214 C380,186 390,180 386,156" />
                <path d="M350,244 C358,232 354,222 362,210" strokeWidth="1.8" />
                {/* 鱗紋 */}
                <path d="M150,146 C154,140 162,138 168,142 M170,134 C174,128 182,126 188,130 M192,124 C196,118 204,116 210,120" strokeWidth="1.5" />
              </svg>
              )}
            </>
          )}

          <div
            className="absolute inset-0 bg-gradient-to-t from-arcade-bg via-arcade-bg/45 to-transparent"
            aria-hidden="true"
          />

          {/* 代表作標記：--grad-boss 底＋深色字（視覺樣式不變） */}
          <span className="bg-grad-boss absolute right-4 top-4 z-10 rounded-[2px] px-3 py-1 font-mono text-xs font-bold tracking-[0.25em] text-arcade-bg md:right-6 md:top-6">
            代表作
          </span>

          {/* 圖片待補標記（角落小字，不搶戲） */}
          {quest.image && 'todo' in quest.image && (
            <span className="arcade-todo absolute left-4 top-4 z-10 flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] opacity-70 md:left-6 md:top-6">
              <Gamepad2 className="h-3 w-3" aria-hidden="true" />
              TODO_待補圖片
            </span>
          )}

          {/* 標題疊圖上：純色文字 */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-10">
            <p className="font-mono text-xs font-bold tracking-[0.25em] text-arcade-text-sec">
              {quest.id}
            </p>
            <h3 className="zh-heading text-h1 mt-2 font-sans text-arcade-text">
              {quest.title}
            </h3>
            {quest.badge && (
              <p className="mt-3 inline-block rounded-[2px] bg-arcade-bg/70 px-3 py-1.5 text-xs leading-relaxed text-arcade-text-sec">
                {quest.badge}
              </p>
            )}
          </div>
        </div>

        {/* 敘事區（低飽和閱讀區）：--arcade-panel 實色，不加漸層 */}
        <div className="bg-arcade-panel p-6 md:p-10">
          <p className="zh-body max-w-[68ch] text-sm text-arcade-text-sec md:text-base">
            {quest.narrative}
          </p>
          {quest.quote && <QuestQuote text={quest.quote} />}
          <TechPills techs={quest.techs} />
          {quest.link && <ProjectLink href={quest.link} />}
        </div>
      </article>
    </div>
  );
}

/**
 * 一般專案：兩欄交錯、radius 12px、圖片 hover scale(1.04)。
 * 閱讀區低飽和：內文 text-sec、無光暈。進場 400ms。
 */
export function QuestShowcase({ quest, index }: { quest: Quest; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const [imgFailed, setImgFailed] = useState(false);
  const imageRight = index % 2 === 1;

  /* 有 src 且未載入失敗 → 顯示圖；否則（todo 或圖檔尚未放入）→ 佔位框，永不破圖 */
  const showImage = quest.image != null && 'src' in quest.image && !imgFailed;
  const showTodo = !showImage && quest.image != null;

  return (
    <div ref={ref} className={`arcade-reveal ${inView ? 'is-visible' : ''}`}>
      <article
        className="grid items-center gap-6 md:grid-cols-12 md:gap-10"
        aria-label={`${quest.id} ${quest.title}`}
      >
        {showImage && quest.image && 'src' in quest.image ? (
          <div
            className={`overflow-hidden rounded-[12px] border border-arcade-border transition-colors duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-dopa-cyan/50 md:col-span-5 ${
              imageRight ? 'md:order-2' : ''
            }`}
          >
            <img
              src={encodeURI(quest.image.src)}
              alt={quest.image.alt}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="aspect-[16/10] w-full object-cover transition-transform duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
            />
          </div>
        ) : showTodo ? (
          /* 圖檔尚未放入或載入失敗：維持兩欄版面，顯示虛線框佔位標記 */
          <div
            className={`flex aspect-[16/10] items-center justify-center rounded-[12px] border border-dashed border-arcade-faint bg-arcade-surface md:col-span-5 ${
              imageRight ? 'md:order-2' : ''
            }`}
          >
            <span className="arcade-todo px-3 py-1.5 font-mono text-xs">
              TODO_待補圖片
            </span>
          </div>
        ) : null}

        <div className={`md:col-span-7 ${imageRight ? 'md:order-1' : ''}`}>
          <p className="font-mono text-xs font-bold tracking-[0.25em] text-arcade-muted">
            {quest.id}
            {quest.category && (
              <span className="ml-3 font-medium tracking-wider">{quest.category}</span>
            )}
          </p>
          <h3 className="zh-heading text-h2 mt-2 font-sans text-arcade-text">
            {quest.title}
          </h3>
          {/* 獎項標記：dopa-orange 低調 outline chip（不搶代表作的實色漸層權重） */}
          {quest.award && (
            <span className="mt-2 inline-block rounded-sm border border-dopa-orange/70 px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.15em] text-dopa-orange">
              {quest.award}
            </span>
          )}
          {quest.positioning && (
            <p className="mt-1.5 text-sm text-arcade-muted">{quest.positioning}</p>
          )}
          {quest.badge && (
            <p className="mt-2 inline-block rounded-[2px] bg-arcade-bg/70 px-3 py-1 text-xs leading-relaxed text-arcade-text-sec">
              {quest.badge}
            </p>
          )}
          <p className="zh-body mt-4 max-w-[68ch] text-sm text-arcade-text-sec">
            {quest.narrative}
          </p>
          {quest.quote && <QuestQuote text={quest.quote} />}
          <TechPills techs={quest.techs} />
          {quest.link && <ProjectLink href={quest.link} />}
        </div>
      </article>
    </div>
  );
}
