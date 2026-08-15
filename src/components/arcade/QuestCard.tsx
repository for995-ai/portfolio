import { useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import type { Quest } from '@/data/quests';

/**
 * 專案卡（像素卡帶／關卡選擇面板）。
 * 圖片以像素外框包覆但保持清晰（object-contain，不做像素化、不裁掉內容）；
 * 缺圖時自動回退為虛線佔位框，永不破圖。
 */
export function QuestCard({
  quest,
  index,
  onOpen,
}: {
  quest: Quest;
  index: number;
  onOpen: (q: Quest) => void;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.12 });
  const [imgFailed, setImgFailed] = useState(false);

  const showImage = quest.image != null && 'src' in quest.image && !imgFailed;
  const featured = quest.boss === true;

  return (
    <div
      ref={ref}
      className={`arcade-reveal h-full ${inView ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${(index % 3) * 70}ms` }}
    >
      <article
        className={`px-card px-window flex h-full flex-col transition-transform duration-150 hover:-translate-y-1 ${
          featured ? 'ring-2 ring-px-coral/70' : ''
        }`}
      >
        {/* 圖片區（16:10 像素視窗；真實截圖保持清晰） */}
        <div className="relative m-3 mt-4 aspect-[16/10] overflow-hidden rounded-[2px] border-[3px] border-px-ink bg-px-deep">
          {showImage && quest.image && 'src' in quest.image ? (
            <img
              src={encodeURI(quest.image.src)}
              alt={quest.image.alt}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-px-violet-lt/40">
              <Gamepad2 className="h-7 w-7 text-px-violet-lt/60" aria-hidden="true" />
              <span className="px-title text-[0.5rem] text-px-peach/70">TODO_待補圖片</span>
            </div>
          )}

          {/* 關卡編號 */}
          <span className="px-tag absolute left-2 top-2 !text-[0.5rem]">
            STAGE {quest.id}
          </span>
          {featured && (
            <span className="px-tag px-tag--coral absolute right-2 top-2 !text-[0.5rem]">
              FEATURED
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col px-4 pb-4">
          {/* 類型標籤 */}
          {quest.category && (
            <p className="px-title text-[0.5rem] leading-[1.6] text-px-coral">
              {quest.category}
            </p>
          )}

          {/* 專案名稱 */}
          <h3 className="zh-heading mt-2 text-base leading-[1.55] text-px-white">
            {quest.title}
          </h3>

          {/* 一句定位 */}
          {quest.positioning && (
            <p className="zh-body mt-2 line-clamp-3 text-[0.95rem] leading-[1.65] text-px-peach">
              {quest.positioning}
            </p>
          )}

          {/* 獎項 */}
          {quest.award && (
            <span className="px-tag px-tag--cream mt-3 self-start !text-[0.5rem]">
              {quest.award}
            </span>
          )}

          {/* 技術標籤（最多 4 個，其餘於 Modal 完整呈現） */}
          <ul className="m-0 mt-3 flex list-none flex-wrap gap-1.5 p-0">
            {quest.techs.slice(0, 4).map((t) => (
              <li key={t} className="px-tag !text-[0.5rem]">
                {t}
              </li>
            ))}
            {quest.techs.length > 4 && (
              <li className="px-tag !text-[0.5rem]">+{quest.techs.length - 4}</li>
            )}
          </ul>

          <button
            type="button"
            onClick={() => onOpen(quest)}
            aria-label={`查看 ${quest.title} 專案詳情`}
            className="px-btn px-btn--primary mt-4 w-full !text-[0.55rem]"
          >
            查看詳情 ▶
          </button>
        </div>
      </article>
    </div>
  );
}
