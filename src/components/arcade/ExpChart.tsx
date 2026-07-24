import { useInView } from '@/hooks/useInView';
import type { ExpPoint } from '@/data/player';

interface ExpChartProps {
  data: ExpPoint[];
  /** 圖表無障礙說明 */
  ariaLabel: string;
}

/* 繪圖區座標（viewBox 640 × 300） */
const VIEW_W = 640;
const VIEW_H = 300;
const PLOT = { left: 48, right: 612, top: 28, bottom: 244 };
const Y_MIN = 60;
const Y_MAX = 90;

function xAt(index: number, total: number): number {
  return PLOT.left + (index * (PLOT.right - PLOT.left)) / (total - 1);
}

function yAt(value: number): number {
  return (
    PLOT.bottom - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * (PLOT.bottom - PLOT.top)
  );
}

/** EXP GROWTH 折線圖：--grad-data 漸層折線＋下方淡出填充＋末端脈動環（600ms 繪製） */
export function ExpChart({ data, ariaLabel }: ExpChartProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35 });

  const points = data.map((d, i) => ({
    ...d,
    x: xAt(i, data.length),
    y: yAt(d.score),
  }));
  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');
  const areaD = `${pathD} L${points[points.length - 1].x.toFixed(1)},${PLOT.bottom} L${points[0].x.toFixed(1)},${PLOT.bottom} Z`;
  const last = points[points.length - 1];
  const gridValues = [60, 70, 80, 90];

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          {/* --grad-data: lime → cyan */}
          <linearGradient id="expLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#b4ff3d" />
            <stop offset="1" stopColor="#00f0ff" />
          </linearGradient>
          <linearGradient id="expArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b4ff3d" stopOpacity="0.18" />
            <stop offset="1" stopColor="#00f0ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 水平格線與 y 軸刻度 */}
        {gridValues.map((v) => (
          <g key={v}>
            <line
              x1={PLOT.left}
              x2={PLOT.right}
              y1={yAt(v)}
              y2={yAt(v)}
              stroke="var(--arcade-border)"
              strokeWidth="1"
            />
            <text
              x={PLOT.left - 10}
              y={yAt(v) + 4}
              textAnchor="end"
              className="font-mono"
              fontSize="11"
              fill="var(--arcade-muted)"
            >
              {v}
            </text>
          </g>
        ))}

        {/* x 軸學期標籤 */}
        {points.map((p) => (
          <text
            key={p.term}
            x={p.x}
            y={PLOT.bottom + 24}
            textAnchor="middle"
            className="font-mono"
            fontSize="11"
            fill="var(--arcade-muted)"
          >
            {p.term}
          </text>
        ))}

        {/* 下方淡出填充 */}
        <path
          d={areaD}
          fill="url(#expArea)"
          style={{
            opacity: inView ? 1 : 0,
            transition: 'opacity 400ms ease-out 300ms',
          }}
        />

        {/* 折線：pathLength=1 + dasharray 繪製動畫（600ms） */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#expLine)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: inView ? 0 : 1,
            transition: 'stroke-dashoffset 600ms ease-out',
          }}
        />

        {/* 資料點與數值標籤（折線畫完後淡入） */}
        {points.map((p, i) => (
          <g
            key={p.term}
            style={{
              opacity: inView ? 1 : 0,
              transition: `opacity 300ms ease-out ${300 + i * 50}ms`,
            }}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="var(--arcade-bg)"
              stroke="var(--dopa-lime)"
              strokeWidth="2"
            />
            <text
              x={p.x}
              y={p.y - 12}
              textAnchor="middle"
              className="font-mono"
              fontSize="11"
              fontWeight="700"
              fill={i === points.length - 1 ? 'var(--dopa-lime)' : 'var(--arcade-text)'}
            >
              {p.score.toFixed(2)}
            </text>
          </g>
        ))}

        {/* 末端點脈動環（只改 opacity） */}
        {last && (
          <g
            style={{
              opacity: inView ? 1 : 0,
              transition: 'opacity 300ms ease-out 600ms',
            }}
          >
            <circle
              cx={last.x}
              cy={last.y}
              r="11"
              fill="none"
              stroke="var(--dopa-lime)"
              strokeWidth="1.5"
              opacity="0.5"
              className="arcade-pulse"
            />
            <circle cx={last.x} cy={last.y} r="4.5" fill="var(--dopa-lime)" />
          </g>
        )}
      </svg>
    </div>
  );
}
