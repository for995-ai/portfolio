/**
 * PlayerStats — 裝備欄（EQUIPMENT GRID）資料
 *
 * 來源：portfolioData 的 SKILLS 與 RESUME_SKILL_GROUPS 合併去重
 * （React/React.js、Tailwind、Figma、Git 等跨組重複項僅保留一格），
 * 依「前端 / 設計 / 後端 / 分析與 AI / 工具」重新分組呈現。
 * 不含任何百分比、星等或自評數值。
 */

import { PROJECTS } from './portfolioData';

export interface EquipmentItem {
  name: string;
  /** 專案反查用關鍵字（預設取 name），比對 PROJECTS 的 tech + cat 欄位 */
  match?: string;
}

export interface EquipmentGroup {
  category: string;
  items: EquipmentItem[];
}

export const equipmentGroups: EquipmentGroup[] = [
  {
    category: '前端開發',
    items: [
      { name: 'React' },
      { name: 'TypeScript' },
      { name: 'JavaScript' },
      { name: 'HTML/CSS', match: 'HTML' },
      { name: 'Tailwind CSS', match: 'Tailwind' },
      { name: 'GSAP' },
      { name: 'Lenis' },
    ],
  },
  {
    category: 'UI/UX 設計',
    items: [
      { name: 'Figma' },
      { name: 'Wireframe' },
      { name: 'Prototype' },
      { name: 'Responsive Design' },
    ],
  },
  {
    category: '後端與資料庫',
    items: [
      { name: 'Python' },
      { name: 'PHP' },
      { name: 'MySQL' },
      { name: 'PyMySQL' },
      { name: 'SQL Server' },
      { name: '資料庫結構設計', match: '資料庫' },
    ],
  },
  {
    category: '系統分析與 AI',
    items: [
      { name: 'UML 塑模', match: 'UML' },
      { name: '系統需求分析' },
      { name: '專案管理 (Agile)', match: '專案管理' },
      { name: '流程優化' },
      { name: 'AI-assisted Design', match: 'AI' },
      { name: 'Prompt Engineering' },
      { name: 'Interactive Storytelling' },
      { name: 'Cultural Learning Experience' },
    ],
  },
  {
    category: '協作與工具',
    items: [
      { name: 'VS Code' },
      { name: 'Git / GitHub', match: 'Git' },
      { name: 'Canva' },
      { name: 'NotebookLM' },
    ],
  },
];

/** 反查此裝備曾用於哪些專案（比對 portfolioData PROJECTS 的 tech 與 cat 欄位） */
export function usedInProjects(item: EquipmentItem): string[] {
  const token = (item.match ?? item.name).toLowerCase();
  return PROJECTS.filter((p) =>
    `${p.tech} ${p.cat}`.toLowerCase().includes(token),
  ).map((p) => p.title);
}
