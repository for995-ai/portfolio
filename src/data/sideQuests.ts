/**
 * Section 5 — SideQuests（支線成就）文案
 *
 * 資料來源規則（2026-07-23 資料稽核後確立）：
 * - 與舊版重疊的社團／隊長項目：描述、反思、照片以舊版（OFFICER_EXPERIENCE）為準。
 * - 舊版活動志工 5 筆（EVENT_EXPERIENCE）與競賽成果 6 筆（COMPETITIONS）全數收錄，
 *   直接引用 portfolioData，不複寫文字。
 * - 證照已移至獨立 CERTIFICATIONS 區塊（certifications 由 portfolioData 直接供給）。
 * - 舊衣工作坊、光耀營為新版新增內容（舊版無對應）。
 */

import {
  COMPETITIONS,
  EVENT_EXPERIENCE,
  OFFICER_EXPERIENCE,
  type EvidenceItem,
} from './portfolioData';

export interface SideQuest {
  title: string;
  description?: string;
  /** 舊版反思 */
  reflection?: string;
  /** 佐證圖片（點擊以 lightbox 放大） */
  image?: { src: string; alt: string };
}

const officerByTitle = Object.fromEntries(
  OFFICER_EXPERIENCE.map((item) => [item.title, item]),
);

/** 由舊版經歷／競賽條目轉為支線成就卡（img 與 file 欄位擇一存在） */
function fromEvidence(item: EvidenceItem): SideQuest {
  const src = item.img ?? item.file;
  return {
    title: item.title,
    description: item.desc,
    reflection: item.reflection,
    image: src ? { src, alt: item.title } : undefined,
  };
}

/** 社團與隊長經歷（舊版有對應者以舊版為準） */
const clubQuests: SideQuest[] = [
  fromEvidence(officerByTitle['動物友善推廣社 14th 公關']),
  {
    title: '舊衣環保寵物玩具 DIY 工作坊',
    description: '結合永續環保與動保教育的活動策劃',
  },
  {
    title: '光耀科技服務營 3.0 GAI 營 隊長',
    description: '科技營隊帶領與課程執行',
  },
  fromEvidence(officerByTitle['資訊志工 114 隊長']),
  fromEvidence(officerByTitle['排球系隊 114 隊長']),
];

export const sideQuests: SideQuest[] = [
  ...clubQuests,
  ...EVENT_EXPERIENCE.map(fromEvidence),
  ...COMPETITIONS.map(fromEvidence),
];
