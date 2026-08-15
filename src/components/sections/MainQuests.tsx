import { useState } from 'react';
import { QuestCard } from '@/components/arcade/QuestCard';
import { QuestModal } from '@/components/arcade/QuestModal';
import { useInView } from '@/hooks/useInView';
import { quests, type Quest } from '@/data/quests';

/**
 * Projects — Project Select（關卡選擇）。
 * 桌機 3 欄 / 平板 2 欄 / 手機 1 欄；點擊卡片開啟詳情 Modal。
 */
export function MainQuests() {
  const head = useInView<HTMLDivElement>();
  const [active, setActive] = useState<Quest | null>(null);

  return (
    <section id="level-2" aria-label="專案作品" className="sgap-11">
      <div className="arcade-container">
        <div ref={head.ref} className={`arcade-reveal ${head.inView ? 'is-visible' : ''}`}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="px-title text-[0.6rem] text-px-coral">PROJECT SELECT</p>
              <h2 className="zh-heading text-h1 mt-2 whitespace-nowrap font-sans text-px-white">
                專案作品
              </h2>
            </div>
            <p className="px-title text-[0.55rem] text-px-peach">
              {quests.length} STAGES
            </p>
          </div>
          <div className="px-rule mt-4 w-40" aria-hidden="true" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quests.map((quest, i) => (
            <QuestCard key={quest.id} quest={quest} index={i} onOpen={setActive} />
          ))}
        </div>
      </div>

      <QuestModal quest={active} onClose={() => setActive(null)} />
    </section>
  );
}
