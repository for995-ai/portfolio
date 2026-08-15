import { EDUCATION } from '@/data/portfolioV2';
import { expGrowth, expGrowthNote } from '@/data/player';
import { useInView } from '@/hooks/useInView';

// ── Grade chart constants ─────────────────────────────────────────────────────

const VW = 560;
const VH = 180;
const PL = 44;
const PR = 536;
const PT = 20;
const PB = 148;
const Y_MIN = 58;
const Y_MAX = 92;

function chartX(i: number, n: number): number {
  return PL + (i * (PR - PL)) / (n - 1);
}
function chartY(v: number): number {
  return PB - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * (PB - PT);
}

// ── Grade sparkline ───────────────────────────────────────────────────────────

function GradeChart() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  const pts = expGrowth.map((d, i) => ({
    ...d,
    x: chartX(i, expGrowth.length),
    y: chartY(d.score),
  }));

  const lineD = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');

  const last = pts[pts.length - 1];
  const areaD = `${lineD} L${last.x.toFixed(1)},${PB} L${pts[0].x.toFixed(1)},${PB} Z`;

  const gridYs = [60, 70, 80, 90];

  return (
    <div ref={ref} className="mt-5">
      <p className="mb-2 font-mono text-[0.68rem] tracking-[0.15em] text-v2-text-sec">
        學習表現趨勢
      </p>
      <div className="overflow-x-hidden">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="h-auto w-full max-w-[580px] min-w-[260px]"
          role="img"
          aria-label="歷年學業平均折線圖：112上 64.05、112下 69.04、113上 70.74、113下 81.79、114上 79.00、114下 84.38"
        >
          {gridYs.map((v) => (
            <g key={v}>
              <line
                x1={PL} x2={PR} y1={chartY(v)} y2={chartY(v)}
                stroke="rgba(255,255,255,0.09)" strokeWidth="1"
              />
              <text
                x={PL - 8} y={chartY(v) + 4}
                textAnchor="end" fontSize="11"
                style={{ fill: 'var(--v2-text-sec)', fontFamily: 'var(--font-family-mono)' }}
              >
                {v}
              </text>
            </g>
          ))}

          {pts.map((p) => (
            <text
              key={p.term}
              x={p.x} y={PB + 18}
              textAnchor="middle" fontSize="11"
              style={{ fill: 'var(--v2-text-sec)', fontFamily: 'var(--font-family-mono)' }}
            >
              {p.term}
            </text>
          ))}

          <path
            d={areaD}
            style={{
              fill: 'var(--v2-purple-dim)',
              opacity: inView ? 1 : 0,
              transition: 'opacity 400ms ease-out 150ms',
            }}
          />

          <path
            d={lineD}
            fill="none"
            pathLength={1}
            style={{
              stroke: 'var(--v2-purple-lt)',
              strokeWidth: '2',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeDasharray: '1',
              strokeDashoffset: inView ? '0' : '1',
              transition: 'stroke-dashoffset 600ms ease-out',
            }}
          />

          {pts.map((p, i) => {
            const isEndpoint = i === 0 || i === pts.length - 1;
            return (
              <g
                key={p.term}
                style={{
                  opacity: inView ? 1 : 0,
                  transition: `opacity 250ms ease-out ${280 + i * 40}ms`,
                }}
              >
                <circle
                  cx={p.x} cy={p.y} r="3.5"
                  style={{ fill: 'var(--v2-bg)', stroke: 'var(--v2-purple-lt)', strokeWidth: '1.5' }}
                />
                <text
                  x={p.x} y={p.y - 10}
                  textAnchor="middle" fontSize="11" fontWeight="600"
                  className={!isEndpoint ? 'hidden md:block' : undefined}
                  style={{
                    fill: i === pts.length - 1 ? 'var(--v2-purple-lt)' : 'var(--v2-text-sec)',
                    fontFamily: 'var(--font-family-mono)',
                  }}
                >
                  {p.score.toFixed(2)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ── Grade summary ─────────────────────────────────────────────────────────────

function GradeSummary() {
  const firstScore = expGrowth[0].score;
  const lastScore = expGrowth[expGrowth.length - 1].score;
  void expGrowthNote;

  return (
    <div className="mt-5 space-y-1.5">
      <p className="font-mono text-sm font-semibold tracking-[0.06em] text-v2-text-sec">
        {firstScore.toFixed(2)} → {lastScore.toFixed(2)}
      </p>
      <p className="text-sm text-v2-text-sec">學業平均持續提升</p>
      <p className="text-xs text-v2-text-muted">
        資料庫系統設計 90 &middot; 程式設計 90 &middot; 資訊管理導論 91
      </p>
    </div>
  );
}

// ── Main Education component ──────────────────────────────────────────────────

export function Education() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div ref={ref} className={`v2-reveal ${inView ? 'is-visible' : ''}`}>
      {EDUCATION.map((edu, idx) => {
        const [startFull, endFull] = edu.period.split('–');
        const yearStart = startFull.slice(0, 4);
        const yearEnd = endFull.slice(0, 4);
        const isUniversity = idx === 0;

        return (
          <div key={edu.id}>
            {idx > 0 && <div className="h-px bg-v2-border" />}

            {isUniversity ? (
              /*
               * University — 3-item grid for correct cross-viewport ordering:
               *
               *   Mobile (flex-col):
               *     order-1  →  meta (org + dept)
               *     order-2  →  date
               *     order-3  →  chart + summary
               *
               *   Desktop (md:grid [140px | 1fr]):
               *     col 1 row 1  →  date      (md:col-start-1 md:row-start-1)
               *     col 2 row 1  →  meta      (md:col-start-2 md:row-start-1)
               *     col 2 row 2  →  chart+sum (md:col-start-2 md:row-start-2)
               */
              <div className="flex flex-col gap-2 pb-8 md:grid md:grid-cols-[140px_1fr] md:gap-x-10 md:gap-y-0">
                {/* Meta: org + dept */}
                <div className="order-1 md:col-start-2 md:row-start-1">
                  <h3
                    className="text-xl font-bold leading-tight text-v2-text md:text-[1.375rem]"
                    style={{ fontFamily: 'var(--font-family-v2-display)' }}
                  >
                    {edu.organization}
                  </h3>
                  <p className="mt-1 text-base text-v2-text-sec">{edu.department}</p>
                </div>

                {/* Date */}
                <p className="order-2 font-mono text-sm tracking-[0.06em] text-v2-text-sec md:col-start-1 md:row-start-1 md:pt-1 md:whitespace-nowrap">
                  {yearStart} – {yearEnd}
                </p>

                {/* Chart + summary */}
                <div className="order-3 md:col-start-2 md:row-start-2">
                  <GradeChart />
                  <GradeSummary />
                </div>
              </div>
            ) : (
              /*
               * High school — 2-item layout (unchanged):
               *   Mobile: org/dept first, date below
               *   Desktop: date col-left, org/dept col-right
               */
              <div className="flex flex-col gap-2 py-6 md:grid md:grid-cols-[140px_1fr] md:gap-x-10">
                <p className="order-2 font-mono text-sm tracking-[0.06em] text-v2-text-sec md:order-1 md:pt-1 md:whitespace-nowrap">
                  {yearStart} – {yearEnd}
                </p>
                <div className="order-1 md:order-2">
                  <h3
                    className="text-lg font-bold leading-tight text-v2-text"
                    style={{ fontFamily: 'var(--font-family-v2-display)' }}
                  >
                    {edu.organization}
                  </h3>
                  <p className="mt-1 text-sm text-v2-text-sec">{edu.department}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
