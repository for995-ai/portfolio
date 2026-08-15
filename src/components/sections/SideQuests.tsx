import { useState } from 'react';
import { Award, Trophy } from 'lucide-react';
import { Lightbox, type LightboxImage } from '@/components/arcade/Lightbox';
import { useInView } from '@/hooks/useInView';
import { sideQuests, type SideQuest } from '@/data/sideQuests';

function SideQuestCard({
  quest,
  index,
  onOpen,
}: {
  quest: SideQuest;
  index: number;
  onOpen: (image: LightboxImage) => void;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const hasImage = Boolean(quest.image);
  /* dopa-orange 全站兩處之一：只有「優勝」獎項上色 */
  const isWinner = quest.description?.includes('優勝') === true;

  const imageArea = (
    <div className="relative m-3 mb-0 aspect-[4/3] shrink-0 overflow-hidden rounded-[2px] border-[3px] border-px-ink bg-px-deep">
      {quest.image ? (
        <img
          src={encodeURI(quest.image.src)}
          alt={quest.image.alt}
          loading="lazy"
          className="h-full w-full object-contain p-2.5"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[2px] border-2 border-dashed border-px-violet-lt/50">
            <Award className="h-8 w-8 text-px-peach/70" aria-hidden="true" />
          </div>
        </div>
      )}

      {/* Hover：獎項實際名稱浮層（--grad-hero 底、深色字，視覺樣式不變） */}
      <div className="absolute inset-0 flex items-center justify-center bg-px-night/75 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <span className="mx-3 flex items-center gap-2 rounded-[2px] border-2 border-px-ink bg-px-cream px-3 py-1.5 text-center text-xs leading-[1.5] text-px-ink">
          <Trophy className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {quest.title}
        </span>
      </div>
    </div>
  );

  return (
    <div
      ref={ref}
      className={`arcade-reveal arcade-reveal-mid ${inView ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${(index % 3) * 50}ms` }}
    >
      <article className="px-card group flex h-full flex-col overflow-hidden transition-transform duration-150 hover:-translate-y-1">
        {hasImage && quest.image ? (
          <button
            type="button"
            onClick={() => onOpen({ src: quest.image!.src, title: quest.title })}
            aria-label={`放大檢視 ${quest.title} 佐證圖片`}
            className="block w-full cursor-zoom-in text-left"
          >
            {imageArea}
          </button>
        ) : (
          imageArea
        )}

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="zh-heading font-sans text-sm text-arcade-text">
              {quest.title}
            </h3>
            {isWinner && (
              <span className="shrink-0 rounded-sm border border-dopa-orange/70 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-[0.15em] text-dopa-orange">
                優勝
              </span>
            )}
          </div>
          {quest.description && (
            <p className="zh-body mt-1 text-xs text-arcade-text-sec">
              {quest.description}
            </p>
          )}
          {quest.reflection && (
            <p className="zh-body mt-1.5 text-xs text-arcade-muted">
              {quest.reflection}
            </p>
          )}
        </div>
      </article>
    </div>
  );
}

/**
 * Section 5 — SideQuests：標題與第一張卡並排，形成不規則網格起始
 * （結構刻意不同於他區）。僅中文標題「成就」。
 */
export function SideQuests() {
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const title = useInView<HTMLDivElement>();

  return (
    <section id="level-4" aria-label="活動與競賽" className="sgap-8">
      <div className="arcade-container">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* 標題作為網格第一格 */}
          <div
            ref={title.ref}
            className={`arcade-reveal flex flex-col justify-end pb-2 pr-4 ${
              title.inView ? 'is-visible' : ''
            }`}
          >
            <p className="px-title text-[0.6rem] text-px-coral">ACHIEVEMENT ROOM</p>
            <h2 className="zh-heading text-h1 mt-2 whitespace-nowrap font-sans text-px-white">
              活動與競賽
            </h2>
            <p className="px-title mt-3 text-[0.52rem] text-px-peach">
              共 {sideQuests.length} 項
            </p>
            <div className="px-rule mt-4 w-32" aria-hidden="true" />
          </div>

          {sideQuests.map((quest, i) => (
            <SideQuestCard
              key={quest.title}
              quest={quest}
              index={i}
              onOpen={setLightboxImage}
            />
          ))}
        </div>
      </div>

      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </section>
  );
}
