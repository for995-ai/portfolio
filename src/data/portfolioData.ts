export type EvidenceItem = {
  title: string;
  desc?: string;
  reflection?: string;
  img?: string;
  file?: string;
};

export const SKILLS = [
  { category: "程式語言與後端", items: ["Python", "JavaScript", "HTML/CSS", "PHP"] },
  { category: "資料庫管理", items: ["MySQL", "PyMySQL", "SQL Server", "資料庫結構設計"] },
  { category: "專業系統分析", items: ["UML 塑模", "系統需求分析", "專案管理 (Agile)", "流程優化"] },
  { category: "UI/UX 與開發工具", items: ["Figma 介面設計", "React.js", "Tailwind CSS", "Git 版本控制"] },
];

export const CERTIFICATIONS: EvidenceItem[] = [
  { title: "中華民國商業職業教育學會 會計能力檢定 - 三級", img: "/images/中華民國商業職業教育學會 會計能力檢定 - 三級.png" },
  { title: "ICDL 國際認證 - IT Security 資訊安全", img: "/images/ICDL 國際認證 - IT Security 資訊安全.png" },
  { title: "CSEPT 大學院校英語能力測驗 第一級", img: "/images/CSEPT 大學院校英語能力測驗 第一級.png" },
  { title: "國家級技術士：電腦軟體應用 (丙級)", img: "/images/國家級技術士：電腦軟體應用 (丙級).png" },
  { title: "國家級技術士：會計事務 - 人工記帳 (丙級)", img: "/images/國家級技術士：會計事務 - 人工記帳 (丙級).png" },
  { title: "國家級技術士：會計事務 - 資訊 (丙級)", img: "/images/國家級技術士：會計事務 - 資訊 (丙級).png" },
];

export const OFFICER_EXPERIENCE: EvidenceItem[] = [
  { title: "資訊管理學系系學會 14th 會長 / 13th 活動長", desc: "統籌學會整體運作與跨部門決策，主辦多場大型聯合迎新與系上大型活動。", reflection: "在跨系協調與資源分配中，深刻體會到系統化溝通與建立標準作業流程(SOP)對專案推動的關鍵作用。", img: "/images/資訊管理學系系學會 14th 會長.png" },
  { title: "資訊志工 114 隊長", desc: "帶領志工團隊深入偏鄉進行 AI 科技營隊與自走車教學，落實大學社會責任。", reflection: "將生硬的資訊科技轉化為偏鄉學童易懂的課程，大幅提升了我的技術轉譯與同理心溝通能力。", img: "/images/資訊管理學系 資訊志工 114隊長.png" },
  { title: "偏鄉系統帶班老師", desc: "運用遠端視訊系統關懷與引導偏鄉孩童之數位學習進度，提升遠距溝通技巧。", reflection: "觀察到硬體普及後的數位軟體落差，讓我更確信未來系統設計必須以「使用者友善」為核心出發。", img: "/images/偏鄉系統帶班老師.png" },
  { title: "動物友善推廣社 14th 公關", desc: "對外聯繫合作單位，策劃生命教育講座與宣傳活動，累積對外公關溝通經驗。", reflection: "學會如何精準傳遞活動核心理念給不同利害關係人，並成功整合內外部資源達成宣傳目標。", img: "/images/動物友善推廣社 14th公關.png" },
  { title: "排球系隊 114 隊長", desc: "帶領系隊日常訓練、戰術商討與賽事執行，凝聚團隊精神。", reflection: "在快節奏的賽事中學習情緒控管與即時戰術調整，培養了極佳的抗壓性與團隊凝聚力。", img: "/images/資訊管理學系 排球系隊 114隊長.png" },
  { title: "Sponya 9th 校園大使", desc: "擔任品牌校園推廣窗口，負責行銷企劃與實務操作，具備市場敏銳度。", reflection: "第一線接觸品牌行銷，將受眾數據與社群互動結合，訓練了我的商業思維與洞察力。", img: "/images/Sponya 9th校園大使.png" },
];

export const EVENT_EXPERIENCE: EvidenceItem[] = [
  { title: "彰化地區校友會 返鄉服務營隊", desc: "於同安國小擔任營隊隊輔，引導偏鄉孩童快樂成長。", reflection: "在營隊中學會如何以同理心與孩童溝通，並在突發狀況中培養臨場應變的團隊協作能力。", img: "/images/2025年國立聯合大學彰化地區校友會 同安國小寒假返鄉服務營隊.png" },
  { title: "Asia for Animals Conference 2025", desc: "參與台北國際動物大會，接軌全球動物福利前沿議題。", reflection: "與國際人士交流，讓我看見資訊科技在福利議題上的龐大應用潛力與跨國合作價值。", img: "/images/Asia for Animals Conference Taipei 2025.png" },
  { title: "華緣領袖教育培訓工作坊", desc: "結訓 8 小時。完成核心領導力、溝通與情緒管理訓練。", reflection: "系統化地學習領導框架，讓我更能掌握在跨系團隊中如何有效凝聚共識與分配任務。", img: "/images/華緣領袖教育培訓工作坊.png" },
  { title: "華緣·梅林小小領袖成長營志工", desc: "服務 32 小時。實際投入實踐，深耕基層兒少教育。", reflection: "將所學的領導理論實踐於營隊活動，深刻體會到「以身作則」是引導團隊的最佳方式。", img: "/images/華緣·梅林小小領袖成長營志工.png" },
  { title: "新埔國小寒假動物探索營志工", desc: "服務 24 小時。協助策劃生命教育，帶領學童探索動保議題。", reflection: "結合動保社團經驗，將生命教育轉化為孩童易懂的遊戲，強化了我的企劃轉譯與實踐力。", img: "/images/新埔國小寒假動物探索營志工.png" },
];

export const COMPETITIONS: EvidenceItem[] = [
  { title: "2024 僑光行流盃創意行銷競賽", desc: "大專院校-創新廣告金句組 佳作", reflection: "首次將系統分析邏輯應用於行銷企劃，學會從數據支撐創意，成功在跨領域競賽中獲得肯定。", file: "/images/- 2024僑光行流盃「全國大國大專校院曁高中職創意行銷」競賽 大專院校-創新廣告金句組-佳作.png" },
  { title: "2025 第十四屆全國連鎖加盟提案競賽", desc: "C.打造具連鎖潛力的創業品牌企劃組 優勝", reflection: "透過完整的商業模式分析與雛形設計，將資訊專案結合創業企劃，深刻體會到商業可行性的重要。", file: "/images/- 2025第十四屆全國連鎖加盟產業創新提案競賽暨高中職學校小論文競賽-C.打造具連鎖潛力的創業品牌企劃組 優勝.png" },
  { title: "第十屆 B2B 跨境電商暨 AI 創新提案競賽", desc: "AI 創新提案組 參賽證明", reflection: "深入研究 AI 工具在電商領域的應用場景，大幅提升了我在技術落地與系統架構評估的能力。", file: "/images/- 「第十屆全國大專院校B2B 跨境電商暨 AI 創新提案競賽」AI創新提案組-參賽證明.png" },
  { title: "第五屆 潛力種子盃個股研究競賽", desc: "參賽證明", reflection: "透過財務報表與市場數據分析個股，培養了對數據的敏銳度與邏輯推演能力。", file: "/images/第五屆潛力種子盃個股研究競賽-參賽證明.png" },
  { title: "2025「集點子大賽」徵選", desc: "參賽證明", reflection: "將日常觀察轉化為創新提案，訓練了我不斷尋找痛點並提出資訊解決方案的思維模式。", file: "/images/2025「集點子大賽」徵選-參賽證明.png" },
  { title: "2025 第九屆 Healthy x Happy 創新創業競賽", desc: "參賽證明", reflection: "在快節奏的競賽中與團隊激盪創意，將系統構想具象化，強化了我的快速原型產出能力。", file: "/images/2025 第九屆 全國大專校院Healthy x Happy 創新創業競賽-參賽證明.png" },
  { title: "2026 全國品牌大賽 — 六都創新永續城市行銷", desc: "進入初賽 ｜ 參賽作品：2027 星空探險計畫（詳見專案作品）" },
];

export const PROJECT_IDS = ["soulscent-lab", "hotpot-ordering", "workstay-platform", "dog-adoption"] as const;
export type ProjectId = (typeof PROJECT_IDS)[number];

export type Project = {
  id: ProjectId;
  cat: string;
  title: string;
  desc: string;
  tech: string;
  reflection: string;
  image: string;
  link: string;
};

export const PROJECTS: Project[] = [
  { id: "soulscent-lab", cat: "全端開發 / AI 創新", title: "SoulScent Lab 智能精油系統", desc: "整合 AI 推薦演算法的客製化精油調配系統。", tech: "React / Node.js / AI API 介接", reflection: "體會到 AI 介接與前端狀態管理的整合挑戰，學會處理非同步資料流與優化等待體驗。", image: "/images/project-soulscent.png", link: "https://gleaming-melba-0c0cbc.netlify.app" },
  { id: "hotpot-ordering", cat: "UI/UX / 系統分析", title: "食癒所 - AI 火鍋點餐", desc: "從使用者體驗出發，重新設計的現代化餐飲點餐介面。", tech: "Figma / 系統需求分析 / 流程塑模", reflection: "實際走過完整的系統分析流程，了解如何收斂需求並轉化為直覺的 UI 介面。", image: "/images/project-hotpot.png", link: "https://tranquil-kashata-043095.netlify.app" },
  { id: "workstay-platform", cat: "介面設計 / 專案統籌", title: "作保庇宿安心 - 換宿平台", desc: "針對打工換宿需求開發的媒合平台，解決資訊不對稱痛點。", tech: "專案管理 / 使用者研究 / UI 設計", reflection: "跨部門溝通是最大挑戰，學會利用工具收斂各方意見達成開發共識，確保如期推進。", image: "/images/project-accommodation.png", link: "https://gleeful-macaron-e3a192.netlify.app" },
  { id: "dog-adoption", cat: "後端開發 / 資料庫", title: "狗狗領養 & 志工管理系統", desc: "整合狗狗資料、領養申請、志工活動與後台管理的 PHP / MySQL 系統。", tech: "PHP / MySQL / XAMPP / CRUD / Session", reflection: "從資料表關聯、PHP CRUD 到登入與後台管理，完整練習資料庫設計與系統整合，也更熟悉以 MySQL 支援實際管理流程。", image: "/images/project-dog.png", link: "https://github.com/for995-ai/dog-adoption-volunteer-system" },
];

/**
 * 新增專案（2026 全國品牌大賽競賽作品）。
 * 結構較舊版嚴格型別的 PROJECTS 豐富（含 subtitle / badge / award / narrative /
 * challenge），故獨立為此匯出，不併入 PROJECTS，也不更動既有四個專案。
 * 圖片：待截取首頁主視覺存為 public/images/project-starryrun.png 後，
 * 將 image 改為 "/images/project-starryrun.png"；補圖前為 undefined（卡片顯示佔位）。
 */
export type ShowcaseProject = {
  id: string;
  cat: string;
  title: string;
  subtitle?: string;
  badge?: string;
  award?: string;
  desc: string;
  narrative: string;
  challenge?: string;
  technologies: string[];
  image?: string;
  link: string;
};

export const BRAND_COMPETITION_PROJECT: ShowcaseProject = {
  id: "starry-run",
  cat: "前端開發 / 品牌企劃",
  title: "2027 星空探險計畫｜低碳光影路跑活動官網",
  subtitle: "2026 全國品牌大賽 — 六都創新永續城市行銷競賽參賽作品",
  badge: "競賽作品 ｜ 2026 全國品牌大賽 進入初賽",
  award: "2026 全國品牌大賽",
  desc: "以高雄亞洲新灣區為主題的低碳光影路跑品牌企劃，從城市行銷概念發展為完整可運作的活動官網。",
  narrative:
    "這是 2026 全國品牌大賽「六都創新永續城市行銷」的參賽作品。競賽命題要求以城市為主體提出行銷企劃，我們選擇高雄駁二與亞洲新灣區，將「工業港口轉型為智慧永續城市」的城市敘事，轉譯為一場結合光影科技與低碳理念的路跑賽事。我負責將企劃概念落實為完整的活動官網，涵蓋賽事簡章、時序表、路線圖、物資說明、線上報名、志工招募、成績查詢與電子證書下載等十二個區塊——讓評審看到的不只是一份企劃書，而是一個真正可以運作的品牌載體。",
  // challenge（引言）為使用者的個人心得，請自行填寫，以下兩個方向擇一（或改寫）覆蓋此欄：
  //   方向一：品牌企劃與網站實作的落差——企劃書可以只談概念，但要做成可運作的網站，
  //           就必須把「永續」具體化為可執行的細節。
  //   方向二：這個主題由我發想，並負責報名網站製作與企劃書撰寫。
  // 現值為兩方向的事實綜合（僅根據上方 narrative 與方向二的既述事實，未加入未經證實的細節）：
  challenge:
    "這個主題由我發想，並負責報名網站製作與企劃書撰寫；最大的挑戰是把只談理念的企劃，落實成一個對外真正能運作的活動官網。",
  technologies: ["HTML/CSS", "JavaScript", "響應式設計", "品牌企劃", "資訊架構", "表單設計"],
  // 首頁主視覺截圖（含「點亮高雄，跑向續航」標語）；請存為此路徑。
  // 檔案放入前，卡片會自動回退顯示「TODO_待補圖片」佔位框，不會破圖。
  image: "/images/project-starryrun.png",
  link: "https://mellow-kulfi-531c3d.netlify.app/",
};

export const ARTICLES = [
  { title: "AI 賦能餐飲：從「食癒所」看系統分析與體驗升級", date: "2026.05", desc: "探討如何透過系統分析將 AI 技術融入火鍋店點餐流程，降低人力成本並提升顧客的情緒價值與數位體驗。", img: "/images/project-hotpot.png" },
  { title: "偏鄉數位落差的觀察與資訊志工的實踐", date: "2025.12", desc: "在帶領資訊志工與擔任偏鄉系統帶班的過程中，我發現硬體已逐漸普及，真正的挑戰在於數位素養的引導與軟體系統的友善設計。", img: "/images/偏鄉系統帶班老師.png" },
  { title: "系統分析在跨部門專案中的橋樑角色", date: "2026.03", desc: "擔任系學會會長與專案統籌的實務經驗中，體會到「系統分析 (SA)」不僅是生硬的技術文件，更是將商業需求轉化為工程語言的關鍵溝通工具。", img: "/images/資訊管理學系系學會 14th 會長.png" },
];

export const PROFILE_PILLARS = ["前端互動開發", "UI/UX 設計", "AI 輔助體驗"];

export const RESUME_SKILL_GROUPS = [
  { category: "前端開發", summary: "把互動、資料狀態與視覺細節整合成可交付介面。", items: ["React", "TypeScript", "Tailwind CSS", "GSAP", "Lenis"] },
  { category: "UI/UX 設計", summary: "從需求、流程到 prototype，建立清楚的使用路徑。", items: ["Figma", "Wireframe", "Prototype", "Responsive Design"] },
  { category: "AI 與互動體驗", summary: "將 AI 能力轉譯成有情境、有回饋的數位體驗。", items: ["AI-assisted Design", "Prompt Engineering", "Cultural Learning Experience", "Interactive Storytelling"] },
  { category: "工具與專案整合", summary: "用穩定工具整理規格、協作流程與交付素材。", items: ["VS Code", "Git / GitHub", "Canva", "NotebookLM"] },
];

export type ProjectCaseStudy = {
  problem: string;
  role: string;
  impact: string;
  focus: string;
};

export const PROJECT_CASE_STUDIES: Record<ProjectId, ProjectCaseStudy> = {
  "soulscent-lab": { problem: "把抽象的香氛偏好轉成使用者能理解的推薦流程。", role: "前端互動、AI API 串接、等待狀態設計", impact: "讓 AI 推薦從功能展示變成更完整的產品體驗。", focus: "AI 推薦體驗" },
  "hotpot-ordering": { problem: "點餐選項過多，使用者容易在決策過程中失去方向。", role: "需求分析、wireframe、點餐流程與介面層級設計", impact: "讓推薦、分類與下單動線更清楚，降低操作成本。", focus: "點餐流程設計" },
  "workstay-platform": { problem: "換宿資訊分散且信任感不足，媒合流程需要更透明。", role: "專案統籌、使用者研究、資訊架構與視覺介面", impact: "把角色、風險與需求整理成可開發的平台架構。", focus: "平台體驗設計" },
  "dog-adoption": { problem: "領養名冊、志工排班與管理資料需要集中追蹤。", role: "資料庫設計、後端邏輯、管理流程規劃", impact: "以資料結構支援公益場域的日常行政與紀錄管理。", focus: "資料庫系統" },
};

export const EXPERIENCE_SUMMARY = [
  "系學會與活動企劃：整理流程、協調團隊，讓活動資訊更容易執行。",
  "資訊志工與偏鄉教學：把科技內容轉化成學生能理解的學習體驗。",
  "競賽與專題實作：用 UI/UX、AI 工具與系統分析把想法做成作品。",
];

export const PROCESS_STEPS = [
  { title: "理解問題與使用者需求", desc: "釐清目標、使用情境與限制，先定義真正需要解決的問題。" },
  { title: "資料整理與研究", desc: "整理內容、競品與現有流程，建立設計與技術決策的依據。" },
  { title: "資訊架構與 Wireframe", desc: "把需求轉成資訊層級與操作路徑，以 wireframe 驗證核心流程。" },
  { title: "視覺設計與 Prototype", desc: "建立介面語言與互動回饋，透過 prototype 檢查體驗節奏。" },
  { title: "前端實作", desc: "以 React、Tailwind CSS 與互動技術將設計轉成可操作原型。" },
  { title: "測試、修正與優化", desc: "檢查響應式、可讀性、效能與操作回饋，持續修正細節。" },
];
