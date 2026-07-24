/** Section 2 — PlayerStats 文案與數據（成績為真實資料，不得更改） */

export interface CharacterInfoRow {
  label: string;
  value: string;
}

export const characterInfo: CharacterInfoRow[] = [
  { label: '定位', value: '文化科技 × 互動學習研究者' },
  { label: '主修', value: '資訊管理學系' },
  { label: '所在地', value: '苗栗 / 台灣' },
];

export interface Skill {
  name: string;
  value: number;
}

export const skills: Skill[] = [
  { name: '前端開發 (React / Tailwind / HTML·CSS·JS)', value: 85 },
  { name: 'UI·UX 介面設計 (Figma / 互動原型)', value: 88 },
  { name: '遊戲化系統設計 (Unity / 互動敘事)', value: 80 },
  { name: '程式語言 (C++ / Python / Java)', value: 75 },
  { name: 'AI 工具整合 (Gemini / Codex / NotebookLM)', value: 90 },
];

export interface ExpPoint {
  term: string;
  score: number;
}

/** 學業平均（真實資料） */
export const expGrowth: ExpPoint[] = [
  { term: '112上', score: 64.05 },
  { term: '112下', score: 69.04 },
  { term: '113上', score: 70.74 },
  { term: '113下', score: 81.79 },
  { term: '114上', score: 79.0 },
  { term: '114下', score: 84.38 },
];

export const expGrowthLabel = 'EXP GROWTH +20.33';

export const expGrowthNote =
  '學業平均自 64.05 提升至 84.38；資訊核心科目（資料庫系統設計 90、程式設計 90、資訊管理導論 91）維持 85 分以上';
