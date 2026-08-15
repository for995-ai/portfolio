import type { LightboxImage } from '@/components/arcade/Lightbox';
import type { SavePoint } from '@/data/savePoints';

interface SavePointNodeProps {
  point: SavePoint;
  index: number;
  /** 由父層時間軸統一控制進場（450ms + stagger 60ms） */
  visible: boolean;
  /** 開啟佐證照片 lightbox */
  onOpenImage: (image: LightboxImage) => void;
}

/**
 * 時間軸節點：「研究動機起點」用 dopa-lime＋較大尺寸＋脈動環，
 * 其餘節點一律 arcade-faint → text-sec，不上色。
 */
export function SavePointNode({ point, index, visible, onOpenImage }: SavePointNodeProps) {
  const highlight = point.highlight === true;

  return (
    <li
      className={`arcade-reveal arcade-reveal-calm relative pb-12 pl-12 last:pb-0 md:pl-16 ${
        visible ? 'is-visible' : ''
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* 菱形存檔點 */}
      <span
        className={`absolute top-1 flex items-center justify-center ${
          highlight ? 'left-[1px] h-[26px] w-[26px]' : 'left-[6px] h-4 w-4'
        }`}
        aria-hidden="true"
      >
        {highlight ? (
          <>
            {/* 研究動機起點：lime + 脈動環 */}
            <span className="arcade-pulse absolute h-[26px] w-[26px] rotate-45 border border-dopa-lime/50" />
            <span className="block h-[16px] w-[16px] rotate-45 border-2 border-dopa-lime bg-arcade-bg" />
            <span className="absolute h-1.5 w-1.5 rounded-full bg-dopa-lime" />
          </>
        ) : (
          <>
            <span className="block h-3 w-3 rotate-45 border-2 border-arcade-faint bg-arcade-bg" />
            <span className="absolute h-1 w-1 rounded-full bg-arcade-muted" />
          </>
        )}
      </span>

      <div
        className={highlight ? 'px-panel px-window p-5 pt-6 md:p-6 md:pt-7' : ''}
      >
        {/* 直接顯示年份與職稱，不加存檔點標記 */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {point.period && (
            <span className="px-title text-[0.52rem] text-px-cream">{point.period}</span>
          )}
          {point.tag && (
            <span className="px-tag px-tag--coral !text-[0.5rem]">{point.tag.label}</span>
          )}
        </div>

        <h3
          className={`zh-heading mt-2 font-sans text-arcade-text ${
            highlight ? 'text-lg md:text-xl' : 'text-base md:text-lg'
          }`}
        >
          {point.title}
        </h3>

        {/* 低飽和閱讀區：text-sec，內文不上色不加光暈 */}
        <p className="zh-body mt-2 max-w-[68ch] text-sm text-arcade-text-sec">
          {point.description}
        </p>

        {point.reflection && (
          <p className="zh-body mt-2 max-w-[68ch] text-xs text-arcade-muted">
            {point.reflection}
          </p>
        )}

        {point.image && (
          <button
            type="button"
            onClick={() => onOpenImage({ src: point.image!.src, title: point.title })}
            aria-label={`放大檢視 ${point.title} 照片`}
            className="mt-3 font-mono text-xs font-bold tracking-widest text-arcade-muted transition-colors duration-[120ms] hover:text-arcade-text"
          >
            [ 查看照片 ]
          </button>
        )}
      </div>
    </li>
  );
}
