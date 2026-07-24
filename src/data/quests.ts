/**
 * Section 3 — MainQuests 文案
 *
 * 資料來源規則：
 * - 舊版四個專案（portfolioData.ts）為唯一事實來源：標題、分類、描述、技術、
 *   反思、案例研究（problem/role/impact）、連結全數取自 PROJECTS 與
 *   PROJECT_CASE_STUDIES。
 * - 敘事段落（narrative）依 2026-07 階段二指示，由 problem / role / impact
 *   以連接詞串成連貫段落，原句文字不變。
 * - QUEST 01 龍焰傳承為新版新增內容（舊版無），文案依使用者規格。
 */

import {
  PROJECT_CASE_STUDIES,
  PROJECTS,
  type ProjectId,
} from './portfolioData';

export interface Quest {
  id: string;
  title: string;
  /** 舊版專案分類（如 全端開發 / AI 創新） */
  category?: string;
  /** 徽章列（如發表資訊） */
  badge?: string;
  /** 一句話定位（舊版 description） */
  positioning?: string;
  /** 連貫段落敘事（problem + role + impact 串接） */
  narrative: string;
  /** 引言（挑戰或反思），以斜體＋左側細線呈現 */
  quote?: string;
  /** 技術標籤列 */
  techs: string[];
  /** 卡片圖片；todo 表示預留佔位並標記 TODO_待補圖片 */
  image?: { src: string; alt: string } | { todo: true };
  /** 舊版專案連結 */
  link?: string;
  /** BOSS 戰滿版卡（唯一使用 dopa-magenta 之處） */
  boss?: boolean;
}

const projectById = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));

/** 由舊版專案資料組出敘事卡（problem／role／impact 串為連貫段落，原句不變） */
function projectQuest(projectId: ProjectId, id: string): Quest {
  const project = projectById[projectId];
  const caseStudy = PROJECT_CASE_STUDIES[projectId];
  return {
    id,
    title: project.title,
    category: project.cat,
    positioning: project.desc,
    narrative: `${caseStudy.problem}我在專案中負責${caseStudy.role}，${caseStudy.impact}`,
    quote: project.reflection,
    techs: project.tech.split(' / '),
    image: { src: project.image, alt: `${project.title} 專案畫面` },
    link: project.link,
  };
}

export const quests: Quest[] = [
  {
    id: '01',
    title: '龍焰傳承 HakkaDragon',
    badge: '研究載體 ｜ 已發表於 2026 前瞻管理學術與產業趨勢研討會',
    positioning: '客家火旁龍文化教育遊戲',
    narrative:
      '開發客家火旁龍文化教育遊戲，將六階段舞龍儀式（糊龍→點睛→迎龍→跈龍→火旁龍→化龍返天）轉化為可互動的關卡體驗。最終完成完整可運行的六關卡系統，並確立碩士研究方向為「遊戲化介面對文化學習成效之影響」。',
    quote:
      '如何讓文化知識不只是被閱讀，而是被體驗——需同時處理陳述性知識（歷史脈絡）與程序性知識（工藝流程）的呈現差異。',
    techs: ['Unity WebGL', 'C#', '2D RPG 系統設計', 'AI 音樂生成'],
    image: { todo: true },
    boss: true,
  },
  projectQuest('hotpot-ordering', '02'),
  projectQuest('dog-adoption', '03'),
  projectQuest('workstay-platform', '04'),
  projectQuest('soulscent-lab', '05'),
];
