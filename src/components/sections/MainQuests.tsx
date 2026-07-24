import { BossQuestCard, QuestShowcase } from '@/components/arcade/QuestCard';
import { quests } from '@/data/quests';

/**
 * Section 3 — MainQuests：BOSS 卡直接開場，
 * 完整 LEVEL 標記縮小、右對齊放在 BOSS 卡上方（結構刻意不同於他區）。
 */
export function MainQuests() {
  const bossQuest = quests.find((q) => q.boss);
  const otherQuests = quests.filter((q) => !q.boss);

  return (
    <section id="level-2" aria-label="專案作品" className="sgap-11">
      <div className="arcade-container">
        <p className="mb-4 text-right font-mono text-xs font-bold tracking-[0.25em] text-arcade-muted">
          專案作品
        </p>

        {bossQuest && <BossQuestCard quest={bossQuest} />}

        <div className="flex flex-col gap-20 md:gap-28">
          {otherQuests.map((quest, i) => (
            <QuestShowcase key={quest.id} quest={quest} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
