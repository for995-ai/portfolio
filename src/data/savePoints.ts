/**
 * Section 4 — SavePoints（公會歷練）時間軸文案
 *
 * 資料來源規則（2026-07-23 資料稽核後確立）：
 * - 與舊版（portfolioData.ts OFFICER_EXPERIENCE）重疊的節點，描述／反思以舊版為準：
 *   03 系學會 14th 會長（舊版為「14th 會長 / 13th 活動長」合併條目，描述反思掛於此）
 *   07 Sponya 9th 校園大使（舊版有、新版原缺，補回）
 *   01 偏鄉課輔（新版描述保留；舊版「偏鄉系統帶班老師」描述＋反思併入 reflection）
 * - 其餘節點（02/04/05/06）為新版新增內容，舊版無對應。
 */

export interface SavePoint {
  id: string;
  title: string;
  /** 期間／時數等 meta 資訊 */
  period?: string;
  description: string;
  /** 舊版反思／補充描述 */
  reflection?: string;
  /** 佐證照片（lightbox 檢視） */
  image?: { src: string; alt: string };
  /** 特殊標籤（如 研究動機起點） */
  tag?: { label: string; tone: 'lime' | 'cyan' | 'amber' };
  /** 視覺加重節點 */
  highlight?: boolean;
}

export const savePoints: SavePoint[] = [
  {
    id: '01',
    title: '偏鄉數位課輔計畫｜大學伴 / 系統帶班老師',
    period: '2023.09—至今｜累積 150 小時',
    description:
      '長期參與偏鄉線上課輔，從陪伴者到帶班負責人。在真實教學現場觀察到「介面與互動設計對學習投入的影響往往大於內容本身」，此觀察成為我投入互動學習研究的起點。',
    reflection:
      '運用遠端視訊系統關懷與引導偏鄉孩童之數位學習進度，提升遠距溝通技巧。觀察到硬體普及後的數位軟體落差，讓我更確信未來系統設計必須以「使用者友善」為核心出發。',
    image: { src: '/images/偏鄉系統帶班老師.png', alt: '偏鄉系統帶班老師' },
    tag: { label: '研究動機起點', tone: 'lime' },
    highlight: true,
  },
  {
    id: '02',
    title: '資訊管理學系系學會 13th 活動長',
    description: '統籌系上大型活動執行與時程控管',
    image: {
      src: '/images/資訊管理學系系學會 13th 活動長.png',
      alt: '資訊管理學系系學會 13th 活動長',
    },
  },
  {
    id: '03',
    title: '資訊管理學系系學會 14th 會長',
    description: '統籌學會整體運作與跨部門決策，主辦多場大型聯合迎新與系上大型活動。',
    reflection:
      '在跨系協調與資源分配中，深刻體會到系統化溝通與建立標準作業流程(SOP)對專案推動的關鍵作用。',
    image: {
      src: '/images/資訊管理學系系學會 14th 會長.png',
      alt: '資訊管理學系系學會 14th 會長',
    },
  },
  {
    id: '04',
    title: '114年三系聯合迎新（經管＋資管＋電機）總召',
    description: '跨三系資源協調與突發狀況決策',
  },
  {
    id: '05',
    title: '藝坊創意行銷 工讀',
    period: '2026.03—2026.05',
    description: '對外商業洽談與廠商接洽實務',
  },
  {
    id: '06',
    title: '微靠右行有限公司 前端工程師實習生',
    period: '2026.07—2026.08',
    description: '參與正式開發流程，累積版本控制與協作開發經驗',
  },
  {
    id: '07',
    title: 'Sponya 9th 校園大使',
    description: '擔任品牌校園推廣窗口，負責行銷企劃與實務操作，具備市場敏銳度。',
    reflection:
      '第一線接觸品牌行銷，將受眾數據與社群互動結合，訓練了我的商業思維與洞察力。',
    image: { src: '/images/Sponya 9th校園大使.png', alt: 'Sponya 9th 校園大使' },
  },
];
