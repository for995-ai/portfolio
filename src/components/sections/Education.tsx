import { ExpChart } from '@/components/arcade/ExpChart';
import { useInView } from '@/hooks/useInView';
import { expGrowth, expGrowthLabel, expGrowthNote } from '@/data/player';

/**
 * Education — Training History（學習紀錄）。
 * 校名／系所／年份與成績均為既有真實資料（沿用 player.ts 的 expGrowth）；
 * LEVEL 標記僅作為輔助的英文小標，不取代正式名稱。
 */
export function Education() {
  const head = useInView<HTMLDivElement>();
  const card = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="education" aria-label="教育背景" className="sgap-9">
      <div className="arcade-container">
        <div ref={head.ref} className={`arcade-reveal ${head.inView ? 'is-visible' : ''}`}>
          <p className="px-title text-[0.6rem] text-px-coral">TRAINING HISTORY</p>
          <h2 className="zh-heading text-h1 mt-2 whitespace-nowrap font-sans text-px-white">
            教育背景
          </h2>
          <div className="px-rule mt-4 w-40" aria-hidden="true" />
        </div>

        <div
          ref={card.ref}
          className={`arcade-reveal mt-8 grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)] ${
            card.inView ? 'is-visible' : ''
          }`}
        >
          {/* 學歷紀錄卡 */}
          <div className="px-panel px-window p-5 pt-6">
            <span className="px-tag px-tag--coral">LEVEL 01</span>
            <h3 className="zh-heading mt-3 text-lg leading-[1.6] text-px-white">
              國立聯合大學
            </h3>
            <p className="mt-1 text-base leading-[1.6] text-px-cream">資訊管理學系</p>
            <p className="px-title mt-3 text-[0.55rem] text-px-peach">2023 — 2027</p>
            <p className="zh-body mt-4 border-t-2 border-px-ink/70 pt-4 text-sm leading-[1.7] text-px-peach">
              學術專長：系統分析與設計、資料庫管理、前端互動開發、使用者介面設計。
            </p>
          </div>

          {/* 學業成績成長（真實數據） */}
          <div className="px-panel p-5 md:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="px-title text-[0.58rem] text-px-coral">GRADE GROWTH</p>
              <p className="px-title text-[0.58rem] text-px-cream">{expGrowthLabel}</p>
            </div>
            <div className="mt-4">
              <ExpChart
                data={expGrowth}
                ariaLabel="歷年學業平均折線圖：112上 64.05、112下 69.04、113上 70.74、113下 81.79、114上 79.00、114下 84.38"
              />
            </div>
            <p className="zh-body mt-4 max-w-[68ch] text-sm leading-[1.7] text-px-peach">
              {expGrowthNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
