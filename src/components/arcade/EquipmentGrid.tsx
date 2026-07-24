import { useState } from 'react';
import {
  Atom,
  BookOpen,
  Braces,
  ClipboardList,
  Code,
  Database,
  Figma,
  FileCode,
  Frame,
  GitBranch,
  Landmark,
  LayoutTemplate,
  ListChecks,
  MonitorSmartphone,
  NotebookPen,
  Palette,
  Play,
  Repeat,
  Server,
  Sparkles,
  Terminal,
  Waves,
  Wind,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { equipmentGroups, usedInProjects, type EquipmentItem } from '@/data/equipment';

/** 裝備 → 圖示對應 */
const itemIcons: Record<string, LucideIcon> = {
  React: Atom,
  TypeScript: Braces,
  JavaScript: FileCode,
  'HTML/CSS': LayoutTemplate,
  'Tailwind CSS': Wind,
  GSAP: Zap,
  Lenis: Waves,
  Figma: Figma,
  Wireframe: Frame,
  Prototype: Play,
  'Responsive Design': MonitorSmartphone,
  Python: FileCode,
  PHP: Code,
  MySQL: Database,
  PyMySQL: Database,
  'SQL Server': Server,
  資料庫結構設計: Database,
  'UML 塑模': Workflow,
  系統需求分析: ClipboardList,
  '專案管理 (Agile)': ListChecks,
  流程優化: Repeat,
  'AI-assisted Design': Sparkles,
  'Prompt Engineering': Terminal,
  'Interactive Storytelling': BookOpen,
  'Cultural Learning Experience': Landmark,
  'VS Code': Code,
  'Git / GitHub': GitBranch,
  Canva: Palette,
  NotebookLM: NotebookPen,
};

/** dopa-orange 全站兩處之一：只有「系統分析與 AI」分類上色，其餘一律 muted */
const ORANGE_CATEGORY = '系統分析與 AI';

const COLLAPSED_COUNT = 16;

interface FlatItem {
  item: EquipmentItem;
  category: string;
  showLabel: boolean;
  index: number;
}

const flatItems: FlatItem[] = equipmentGroups.flatMap((group) =>
  group.items.map((item, i) => ({
    item,
    category: group.category,
    showLabel: i === 0,
    index: 0,
  })),
).map((entry, index) => ({ ...entry, index }));

/**
 * 裝備欄：格狀道具格（桌機 4 欄 / 手機 2 欄）。
 * grad-panel 背景、radius 4px、無邊框（hover 浮現 dopa-cyan 邊框）。
 * 超過 20 格 → 預設 16 格＋展開按鈕。進場 250ms + stagger 40ms。
 */
export function EquipmentGrid() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [hovered, setHovered] = useState<EquipmentItem | null>(null);
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? flatItems : flatItems.slice(0, COLLAPSED_COUNT);
  const hiddenCount = flatItems.length - COLLAPSED_COUNT;
  const hoveredProjects = hovered ? usedInProjects(hovered) : [];

  return (
    <div ref={ref}>
      <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 md:grid-cols-4">
        {visible.map(({ item, category, showLabel, index }) => {
          const Icon = itemIcons[item.name] ?? Code;
          return (
            <li
              key={item.name}
              className={`arcade-reveal arcade-reveal-fast ${inView ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${(index % COLLAPSED_COUNT) * 40}ms` }}
            >
              <div
                onMouseEnter={() => setHovered(item)}
                onMouseLeave={() => setHovered(null)}
                className="bg-grad-panel flex h-full flex-col gap-1 rounded-[4px] border border-transparent bg-arcade-panel px-3 py-2.5 transition-colors duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-dopa-cyan/60"
              >
                {showLabel && (
                  <span
                    className={`font-mono text-[10px] font-bold tracking-[0.15em] ${
                      category === ORANGE_CATEGORY ? 'text-dopa-orange' : 'text-arcade-muted'
                    }`}
                  >
                    {category}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-arcade-muted" aria-hidden="true" />
                  <span className="text-sm text-arcade-text-sec">{item.name}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {!expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-4 rounded-full border border-arcade-faint px-5 py-2 font-mono text-xs font-bold tracking-widest text-arcade-text-sec transition-colors duration-[120ms] hover:border-dopa-cyan/60 hover:text-arcade-text"
        >
          [ 展開全部 +{hiddenCount} ]
        </button>
      )}

      {/* 狀態列：顯示 hover 中裝備的使用專案 */}
      <p
        className="mt-4 min-h-[1.5rem] font-mono text-xs tracking-wider text-arcade-muted"
        aria-live="polite"
      >
        {hovered
          ? hoveredProjects.length > 0
            ? `▸ ${hovered.name}｜使用於：${hoveredProjects.join('、')}`
            : `▸ ${hovered.name}`
          : '▸ 將游標移至技術項目，檢視應用專案'}
      </p>
    </div>
  );
}
