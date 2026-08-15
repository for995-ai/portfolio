import { EquipmentGrid } from '@/components/arcade/EquipmentGrid';
import { useInView } from '@/hooks/useInView';

/**
 * Skills — Skill Inventory（技能背包）。
 * 分類與項目全部沿用 equipment.ts（由 portfolioData 的 SKILLS / RESUME_SKILL_GROUPS 整併），
 * 不使用任何無根據的能力百分比或進度條。
 * 角色資料已移至 #profile、成績成長已移至 #education；此區專責技能清單。
 */
export function PlayerStats() {
  const head = useInView<HTMLDivElement>();
  const grid = useInView<HTMLDivElement>({ threshold: 0.08 });

  return (
    <section id="level-1" aria-label="技術能力" className="sgap-9">
      <div className="arcade-container">
        <div ref={head.ref} className={`arcade-reveal ${head.inView ? 'is-visible' : ''}`}>
          <p className="px-title text-[0.6rem] text-px-coral">SKILL INVENTORY</p>
          <h2 className="zh-heading text-h1 mt-2 whitespace-nowrap font-sans text-px-white">
            技術能力
          </h2>
          <div className="px-rule mt-4 w-40" aria-hidden="true" />
        </div>

        <div
          ref={grid.ref}
          className={`arcade-reveal px-panel mt-8 p-5 md:p-6 ${grid.inView ? 'is-visible' : ''}`}
        >
          <EquipmentGrid />
        </div>
      </div>
    </section>
  );
}
