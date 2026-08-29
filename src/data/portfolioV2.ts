// ─── Types ───────────────────────────────────────────────────────────────────

export type DisplayLevel = 'featured' | 'standard' | 'archive';

export interface Education {
  id: string;
  period: string;
  organization: string;
  department: string;
}

export interface Project {
  id: string;
  date: string;
  title: string;
  role: string;
  skills: string[];
  displayLevel: DisplayLevel;
  featuredRank?: number;
  image?: string;
  demo?: string;
  github?: string;
}

export interface LeadershipRole {
  id: string;
  period: string;
  organization: string;
  position: string;
  tasks: string[];
  skills: string[];
  displayLevel: DisplayLevel;
  featuredRank?: number;
}

export interface Research {
  id: string;
  date: string;
  event: string;
  work: string;
  role: string;
  result: string;
  displayLevel: DisplayLevel;
}

export interface Competition {
  id: string;
  date: string;
  event: string;
  work: string;
  role: string;
  result: string;
  displayLevel: DisplayLevel;
  featuredRank?: number;
}

export interface Experience {
  id: string;
  period: string;
  organization: string;
  position: string;
  tasks: string[];
  skills: string[];
  displayLevel: DisplayLevel;
  featuredRank?: number;
}

export interface Service {
  id: string;
  period: string;
  organization: string;
  role: string;
  tasks: string[];
  skills?: string[];
  displayLevel: DisplayLevel;
}

export interface Certification {
  id: string;
  date: string;
  name: string;
  issuer: string;
}

// ─── Verified Constant ────────────────────────────────────────────────────────

export const TUTORING_HOURS = 150;

// ─── Education ────────────────────────────────────────────────────────────────

export const EDUCATION: readonly Education[] = [
  {
    id: 'EDU1',
    period: '2023.09–2027.06',
    organization: '國立聯合大學',
    department: '資訊管理學系',
  },
  {
    id: 'EDU2',
    period: '2020.09–2023.06',
    organization: '臺中市豐原高商',
    department: '資料處理科',
  },
];

// ─── Projects (A0–A8) ─────────────────────────────────────────────────────────

export const PROJECTS: readonly Project[] = [
  {
    id: 'A0',
    date: '2026.09',
    title: '履歷／作品集網站',
    role: '獨立製作',
    skills: ['資訊架構', 'UI/UX', '前端實作'],
    displayLevel: 'archive',
  },
  {
    id: 'A1',
    date: '2025.07–',
    title: '跟著龍走－苗栗𪹚龍文化互動學習平台',
    role: '團隊 PM、UI/UX 設計、地圖／系統整合',
    skills: ['專案管理', 'API 串接', '跨域整合'],
    displayLevel: 'featured',
    featuredRank: 1,
  },
  {
    id: 'A2',
    date: '2026.07',
    title: '星空探險－路跑報名網站',
    role: '網站建置、企劃',
    skills: ['需求分析', '流程設計', '前端實作'],
    displayLevel: 'featured',
    featuredRank: 2,
  },
  {
    id: 'A3',
    date: '2026.01',
    title: '基於 MBTI 人格分析與芳療知識庫的智能精油顧問系統',
    role: '團隊 PM、系統發想／建置',
    skills: ['AI 應用', '需求分析', '團隊協作'],
    displayLevel: 'standard',
  },
  {
    id: 'A4',
    date: '2025.12',
    title: '食癒所－AI 智能點餐系統',
    role: '系統發想／建置、資料／簡報整合',
    skills: ['AI 服務設計', '商業企劃', '提案表達'],
    displayLevel: 'standard',
  },
  {
    id: 'A5',
    date: '2025.10',
    title: '作保庇宿安心打工換宿智慧媒合平台',
    role: '專案作者',
    skills: ['平台企劃', '需求分析', '網路行銷'],
    displayLevel: 'archive',
  },
  {
    id: 'A6',
    date: '2025.06',
    title: '狗狗領養＆志工系統',
    role: '專案作者',
    skills: ['PHP', 'MySQL', '資料庫設計', 'CRUD', 'Session', '系統整合'],
    github: 'https://github.com/for995-ai/dog-adoption-volunteer-system',
    displayLevel: 'archive',
  },
  {
    id: 'A7',
    date: '2026.08',
    title: '相簿滑滑整理 APP',
    role: '獨立製作',
    skills: ['APP 流程', '互動設計', '產品思維'],
    displayLevel: 'standard',
  },
  {
    id: 'A8',
    date: '2026.08',
    title: '彈珠工廠網頁設計',
    role: '獨立製作',
    skills: ['網頁設計', '互動體驗', '前端實作'],
    displayLevel: 'standard',
  },
];

// ─── Research (C2) ────────────────────────────────────────────────────────────

export const RESEARCH: readonly Research[] = [
  {
    id: 'C2',
    date: '2026.05',
    event: '2026 第十七屆前瞻管理學術與產業趨勢研討會',
    work: '跟著龍走－火旁龍文化與互動體驗',
    role: '論文整合、團隊 PM',
    result: '論文發表',
    displayLevel: 'featured',
  },
];

// ─── Competitions (C1, C3–C8) ─────────────────────────────────────────────────

export const COMPETITIONS: readonly Competition[] = [
  {
    id: 'C1',
    date: '2026.07',
    event: '2026 全球品牌大賽－六都創新永續城市行銷競賽',
    work: '星空探險隊',
    role: '路跑網站建置、活動企劃',
    result: '高雄市初賽入選',
    displayLevel: 'featured',
  },
  {
    id: 'C3',
    date: '2026.01',
    event: '第十屆全國大專院校 B2B 跨境電商暨 AI 創新提案競賽',
    work: '香氛實驗室',
    role: '團隊 PM、系統發想與建置',
    result: '參賽',
    displayLevel: 'standard',
  },
  {
    id: 'C4',
    date: '2026.01',
    event: '第五屆潛力種子盃個股研究競賽',
    work: '股物方程式',
    role: '研究資料蒐集、分析與整合',
    result: '參賽',
    displayLevel: 'standard',
  },
  {
    id: 'C5',
    date: '2025.12',
    event: '第十四屆全國連鎖加盟產業創新提案競賽－創業品牌企劃組',
    work: '食癒所',
    role: '點餐系統發想與建置、資料／簡報整合',
    result: '優勝',
    displayLevel: 'featured',
  },
  {
    id: 'C6',
    date: '2025.06',
    event: '2025「集點子大賽」徵選',
    work: '防詐銀守護',
    role: '企劃發想、資料整合',
    result: '參賽',
    displayLevel: 'archive',
  },
  {
    id: 'C7',
    date: '2025.05',
    event: '第九屆全國大專校院 Healthy x Happy 創新創業競賽',
    work: 'Happy Foodies',
    role: '系統介面設計',
    result: '參賽',
    displayLevel: 'archive',
  },
  {
    id: 'C8',
    date: '2024.03',
    event: '2024 僑光流行盃－全國大專校院暨高中職創意行銷競賽',
    work: '雙生',
    role: '文案企劃、視覺美編',
    result: '佳作',
    displayLevel: 'featured',
  },
];

// ─── Experience (D1–D4) ───────────────────────────────────────────────────────

export const EXPERIENCE: readonly Experience[] = [
  {
    id: 'D1',
    period: '2026.07.01–2026.08.14',
    organization: 'RICH 職場體驗網－微靠右行有限公司',
    position: '前端工程師',
    tasks: ['完成 3 個 Wireframe 與前端畫面', '串接 AI 生圖／影片 API'],
    skills: ['UI/UX 實作', 'API 串接', '需求溝通', '問題排查'],
    displayLevel: 'featured',
    featuredRank: 1,
  },
  {
    id: 'D2',
    period: '2026.03–2026.06',
    organization: '藝坊創意行銷',
    position: '工讀生',
    tasks: ['特展活動企劃與執行', '社群文案／貼文設計發布', '資料整理'],
    skills: ['活動企劃', '內容行銷', '時程協作'],
    displayLevel: 'featured',
  },
  {
    id: 'D3',
    period: '2024.09–現在',
    organization: '偏鄉地區中小學網路課業輔導計畫',
    position: '系統帶班',
    tasks: ['帶班約 15 名大學伴', '班務／資料管理', '協調問題與進度'],
    skills: ['人員協調', '進度追蹤', '行政管理'],
    displayLevel: 'featured',
  },
  {
    id: 'D4',
    period: '2025.09–2026.08',
    organization: 'Sponya 第九屆',
    position: '校園大使',
    tasks: ['社群貼文／文案設計', '參與台灣啤酒合作行銷影片拍攝'],
    skills: ['社群行銷', '品牌溝通', '內容製作'],
    displayLevel: 'standard',
  },
];

// ─── Leadership (B1–B5) ───────────────────────────────────────────────────────

export const LEADERSHIP: readonly LeadershipRole[] = [
  {
    id: 'B1',
    period: '2026.09–2027.05',
    organization: '國立聯合大學 112 級畢聯會',
    position: '文書長',
    tasks: ['會議紀錄／文件歸檔', '公文通知', '平台資訊整理', '行政支援'],
    skills: ['文書行政', '資訊整理', '溝通協調'],
    displayLevel: 'standard',
  },
  {
    id: 'B2',
    period: '2025.09–2026',
    organization: '第34屆資訊管理學系系學會',
    position: '會長',
    tasks: ['統籌系學會運作', '幹部分工', '活動／行政決策', '內外溝通'],
    skills: ['領導統籌', '專案管理', '溝通決策'],
    displayLevel: 'featured',
  },
  {
    id: 'B3',
    period: '2025.09–2026',
    organization: '第14屆動物友善推廣社',
    position: '公關長',
    tasks: ['社群宣傳', '內容規劃', '活動推廣', '對外溝通'],
    skills: ['公關溝通', '文案企劃', '議題轉譯'],
    displayLevel: 'standard',
  },
  {
    id: 'B4',
    period: '2025.09–2026',
    organization: '資訊管理學系排球系隊',
    position: '隊長',
    tasks: ['訓練／比賽安排', '隊員溝通', '對外聯繫'],
    skills: ['團隊領導', '協調溝通', '責任感'],
    displayLevel: 'standard',
  },
  {
    id: 'B5',
    period: '2024.09–2025',
    organization: '第33屆資訊管理學系系學會',
    position: '活動長',
    tasks: ['活動規劃執行', '流程／人力／物資協調', '現場應變'],
    skills: ['活動企劃', '執行管理', '臨場應變'],
    displayLevel: 'standard',
  },
];

// ─── Service (D5–D11) ─────────────────────────────────────────────────────────

export const SERVICE: readonly Service[] = [
  {
    id: 'D5',
    period: '2025.09–2026.05',
    organization: '國立聯合大學 USR－光耀科技服務營',
    role: '隊長',
    tasks: ['與中強光電於福基國小規劃 3 場資訊素養營', 'AI 繪本／Scratch 迷宮'],
    skills: ['專案統籌', '企業協作', '資訊教育', '帶隊應變'],
    displayLevel: 'featured',
  },
  {
    id: 'D6',
    period: '2026.02.04–02.06',
    organization: '苗栗縣新埔國小寒假動物探索營',
    role: '隊輔長／隊輔',
    tasks: ['營隊帶隊', '流程執行', '學童照顧', '隊輔協調'],
    displayLevel: 'standard',
  },
  {
    id: 'D7',
    period: '2026.01.18–01.21',
    organization: '雲林縣梅林國小《華緣．梅林小小領袖成長營》',
    role: '隊輔',
    tasks: ['學童活動陪伴', '活動與生活管理'],
    displayLevel: 'standard',
  },
  {
    id: 'D8',
    period: '2025.12.27',
    organization: '華緣領袖教育培訓工作坊',
    role: '志工培訓學員',
    tasks: ['志工／領袖教育培訓', '營隊帶領學習'],
    displayLevel: 'archive',
  },
  {
    id: 'D9',
    period: '2025.08.25–08.29',
    organization: 'Asia for Animals Conference Taipei 2025',
    role: '聯合大學代表',
    tasks: ['代表學校出席國際會議', '動物福利議題交流'],
    skills: ['國際交流', '議題理解', '跨文化溝通'],
    displayLevel: 'standard',
  },
  {
    id: 'D10',
    period: '2025.01.18–01.25',
    organization: '國立聯合大學彰化地區校友會同安國小寒假返鄉服務營隊',
    role: '隊輔',
    tasks: ['營隊活動', '學童照顧', '團隊生活管理'],
    displayLevel: 'archive',
  },
  {
    id: 'D11',
    period: '2023.09–2024.05',
    organization: '教育部偏鄉地區中小學網路課業輔導計畫',
    role: '大學伴',
    tasks: ['國一至國二數學輔導', '相見歡活動規劃'],
    skills: ['教學表達', '陪伴溝通', '活動設計'],
    displayLevel: 'standard',
  },
];

// ─── Certifications (E1–E2) ───────────────────────────────────────────────────

export const CERTIFICATIONS: readonly Certification[] = [
  {
    id: 'E1',
    date: '2025.06',
    name: 'ICDL 國際認證－IT Security 資訊安全',
    issuer: '中華民國電腦技能基金會',
  },
  {
    id: 'E2',
    date: '2024.01',
    name: 'CSEPT 大學院校英語能力測驗－第一級',
    issuer: '財團法人語言訓練測驗中心',
  },
];

// ─── Derived Counts ───────────────────────────────────────────────────────────

export const projectCount = PROJECTS.length;          // 9
export const competitionCount = COMPETITIONS.length;  // 7
export const researchCount = RESEARCH.length;         // 1

// ─── Selectors ────────────────────────────────────────────────────────────────

export const featuredProjects = PROJECTS
  .filter((p) => p.displayLevel === 'featured')
  .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99));

export const selectedProjects = PROJECTS.filter(
  (p) => p.displayLevel === 'standard',
);

export const archiveProjects = PROJECTS.filter(
  (p) => p.displayLevel === 'archive',
);

export const featuredExperience = EXPERIENCE
  .filter((e) => e.displayLevel === 'featured')
  .sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99));

export const featuredResearch = RESEARCH.filter(
  (r) => r.displayLevel === 'featured',
);

export const awards = COMPETITIONS.filter(
  (c) => c.result !== '參賽' && c.displayLevel !== 'archive',
);

export const otherCompetitions = COMPETITIONS.filter(
  (c) => c.result === '參賽' && c.displayLevel !== 'archive',
);

export const featuredLeadership = LEADERSHIP.filter(
  (l) => l.displayLevel === 'featured',
);

export const featuredService = SERVICE.filter(
  (s) => s.displayLevel === 'featured',
);
