import { EquipmentGrid } from '@/components/arcade/EquipmentGrid';
import { ExpChart } from '@/components/arcade/ExpChart';
import { useInView } from '@/hooks/useInView';
import { characterInfo, expGrowth, expGrowthLabel, expGrowthNote } from '@/data/player';

/**
 * Section 2 — PlayerStats：標題靠左、內容置於右側同一水平帶（結構刻意不同於他區）。
 * 僅中文標題「裝備」，關卡感由右側 LevelIndicator 承擔。
 */
export function PlayerStats() {
  const band = useInView<HTMLDivElement>({ threshold: 0.05 });
  const chart = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section id="level-1" aria-label="技術能力" className="sgap-9">
      <div className="arcade-container">
        <div
          ref={band.ref}
          className={`arcade-reveal md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-10 ${
            band.inView ? 'is-visible' : ''
          }`}
        >
          {/* 標題與內容同一水平帶（nowrap 防止「技術能／力」斷字） */}
          <h2 className="zh-heading text-h1 whitespace-nowrap font-sans text-arcade-text md:pt-1">
            技術能力
          </h2>

          <div className="mt-6 md:mt-0">
            {/* 基本資料：無框橫列 */}
            <dl className="m-0 flex flex-wrap gap-x-10 gap-y-4">
              {characterInfo.map((row) => (
                <div key={row.label}>
                  <dt className="font-mono text-xs font-bold tracking-[0.25em] text-arcade-muted">
                    {row.label}
                  </dt>
                  <dd className="m-0 mt-1 text-sm font-medium text-arcade-text-sec">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* 技術格 */}
            <div className="mt-8">
              <EquipmentGrid />
            </div>

            {/* EXP GROWTH 折線圖（真實學業成績，非自評） */}
            <div
              ref={chart.ref}
              className={`arcade-reveal mt-8 rounded-[12px] bg-arcade-panel p-6 md:p-8 ${
                chart.inView ? 'is-visible' : ''
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-mono text-xs font-bold tracking-[0.3em] text-arcade-muted">
                  EXP GROWTH
                </h3>
                <p className="font-mono text-sm font-bold tracking-wider text-dopa-lime">
                  {expGrowthLabel}
                </p>
              </div>
              <div className="mt-4">
                <ExpChart
                  data={expGrowth}
                  ariaLabel="歷年學業平均折線圖：112上 64.05、112下 69.04、113上 70.74、113下 81.79、114上 79.00、114下 84.38"
                />
              </div>
              <p className="zh-body mt-4 max-w-[68ch] text-xs text-arcade-text-sec">
                {expGrowthNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
