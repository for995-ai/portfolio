import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { Box } from 'lucide-react';
import { HudHeader, type HudLink } from '@/components/pixel/HudHeader';
import { PixelSky } from '@/components/pixel/PixelSky';
import { FragmentField } from '@/components/arcade/FragmentDecor';
import { ScrollProgressProvider } from '@/hooks/useScrollProgress';
import { Stage3DContext } from '@/hooks/stage3d';
import {
  block3DForSession,
  detectTier,
  get3DPref,
  is3DBlocked,
  levelBAllowed,
  set3DPref,
  type Tier,
} from '@/components/arcade/gamepad3d/capability';
import { TitleScreen } from '@/components/sections/TitleScreen';
import { PlayerProfile } from '@/components/sections/PlayerProfile';
import { Education } from '@/components/sections/Education';
import { PlayerStats } from '@/components/sections/PlayerStats';
import { MainQuests } from '@/components/sections/MainQuests';
import { SavePoints } from '@/components/sections/SavePoints';
import { SideQuests } from '@/components/sections/SideQuests';
import { Certifications } from '@/components/sections/Certifications';
import { Archive } from '@/components/sections/Archive';
import { StageClear } from '@/components/sections/StageClear';

/* three.js 與舞台一律動態 import，不進首屏主 bundle */
const Stage = lazy(() => import('@/three/Stage'));

/** HUD 導覽（全部指向既有 section id，未更名任何錨點） */
const hudLinks: HudLink[] = [
  { id: 'profile', en: 'PROFILE', zh: '簡介' },
  { id: 'education', en: 'EDUCATION', zh: '學歷' },
  { id: 'level-2', en: 'PROJECTS', zh: '專案' },
  { id: 'level-3', en: 'EXPERIENCE', zh: '經歷' },
  { id: 'level-1', en: 'SKILLS', zh: '技能' },
  { id: 'level-4', en: 'AWARDS', zh: '活動競賽' },
  { id: 'stage-clear', en: 'CONTACT', zh: '聯絡' },
];

const CONTACT_EMAIL = 'for995@gmail.com';

/** 七個展台對應的區塊錨點 id（Stage05 涵蓋證照，文章區為過場） */
const STAGE_SECTION_IDS = [
  'title-screen',
  'level-1',
  'level-2',
  'level-3',
  'level-4',
  'certifications',
  'stage-clear',
];

/** 量測各展台在頁面滾動進度中的錨點（0–1 遞增） */
function measureAnchors(): number[] {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return STAGE_SECTION_IDS.map((_, i) => i / 6);
  const anchors = STAGE_SECTION_IDS.map((id, i) => {
    const el = document.getElementById(id);
    if (!el) return i / 6;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const center = i === 0 ? 0 : i === 6 ? max : top - window.innerHeight * 0.35;
    return Math.min(Math.max(center / max, 0), 1);
  });
  for (let i = 1; i < anchors.length; i++) {
    if (anchors[i] <= anchors[i - 1]) anchors[i] = anchors[i - 1] + 0.001;
  }
  return anchors;
}

/** 單頁滾動：暗色電玩 UI 推甄作品集（3D 舞台 A/B 分流 / 完整 2D 降級 C） */
export function Home() {
  const [tier] = useState<Tier>(() => (typeof window === 'undefined' ? 'C' : detectTier()));
  const [pref, setPrefState] = useState<'on' | 'off' | 'auto'>(() => get3DPref());
  const [tryStage, setTryStage] = useState(false);
  const [stage3D, setStage3D] = useState(false);
  const [loading, setLoading] = useState(false);

  const anchorsRef = useRef<number[]>([0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1]);
  const readyRef = useRef(false);
  const timeoutRef = useRef<number | undefined>(undefined);
  const failTimesRef = useRef<number[]>([]);

  /* 錨點量測（滾動位置對應展台）；resize 重算 */
  useEffect(() => {
    const measure = () => {
      anchorsRef.current = measureAnchors();
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* 分流決策：A 直接嘗試；B 經電池/記憶體 gate（手動開啟略過電池）；C 全 2D */
  useEffect(() => {
    let cancelled = false;
    const wantAttempt =
      tier === 'A' ? true : tier === 'B' ? pref !== 'off' && !is3DBlocked() : false;

    if (!wantAttempt) {
      setTryStage(false);
      setStage3D(false);
      setLoading(false);
      readyRef.current = false;
      return;
    }

    const run = async () => {
      if (tier === 'B') {
        const ok = await levelBAllowed(pref === 'on');
        if (cancelled) return;
        if (!ok) {
          setLoading(false);
          return; // 電池/記憶體不足 → 維持 2D
        }
      }
      if (cancelled) return;
      anchorsRef.current = measureAnchors();
      readyRef.current = false;
      setLoading(true);
      setTryStage(true);
      /* 載入逾時：手機 2 秒、桌機 2.5 秒 */
      const ms = tier === 'B' ? 2000 : 2500;
      timeoutRef.current = window.setTimeout(() => {
        if (!readyRef.current) {
          setTryStage(false);
          setLoading(false);
        }
      }, ms);
    };
    run();

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [tier, pref]);

  const handleReady = () => {
    readyRef.current = true;
    anchorsRef.current = measureAnchors();
    setLoading(false);
    setStage3D(true); // 交叉淡入 400ms
  };

  const handleFail = useCallback(() => {
    /* 熱節流：30 秒內兩度降級 → 本 session 封鎖 3D */
    const now = performance.now();
    const times = failTimesRef.current.filter((t) => now - t < 30000);
    times.push(now);
    failTimesRef.current = times;
    if (times.length >= 2) block3DForSession();

    readyRef.current = false;
    setTryStage(false);
    setStage3D(false);
    setLoading(false);
  }, []);

  /* 行動切換鈕：手動開/關 3D（存 sessionStorage；關閉後本 session 不自動啟用） */
  const toggle3D = () => {
    const next = tryStage || stage3D ? 'off' : 'on';
    set3DPref(next);
    setPrefState(next);
  };

  const showToggle = tier === 'B';
  const toggleOn = tryStage || stage3D;

  return (
    <ScrollProgressProvider>
      <Stage3DContext.Provider value={stage3D}>
        <div
          data-stage3d={stage3D ? 'true' : undefined}
          className="min-h-svh bg-px-night text-arcade-text"
        >
          {/* 像素夕陽背景（最底層） */}
          <PixelSky />
          {/* 單一常駐 3D 舞台：fixed 全螢幕、z-0、永遠 pointer-events-none（不攔截捲動） */}
          {tryStage && (
            <div
              className={`pointer-events-none fixed inset-0 z-0 transition-opacity duration-[400ms] ${
                stage3D ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden="true"
            >
              <Suspense fallback={null}>
                <Stage
                  anchorsRef={anchorsRef}
                  tier={tier === 'B' ? 'B' : 'A'}
                  onReady={handleReady}
                  onFail={handleFail}
                />
              </Suspense>
            </div>
          )}

          {/* 2D 碎片場：僅在未啟用 3D 舞台時呈現 */}
          {!stage3D && <FragmentField />}

          {/* 極簡載入指示（左下，避開右下切換鈕） */}
          {loading && (
            <div
              className="fixed bottom-5 left-5 z-40 h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/15 border-t-dopa-cyan"
              role="status"
              aria-label="載入中"
            />
          )}

          {/* 行動裝置 3D/2D 切換鈕（44×44，右下，不遮擋內容） */}
          {showToggle && (
            <button
              type="button"
              onClick={toggle3D}
              aria-pressed={toggleOn}
              aria-label={toggleOn ? '關閉 3D，切換為 2D' : '開啟 3D 立體場景'}
              className={`fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-200 ${
                toggleOn
                  ? 'border-dopa-cyan/70 bg-arcade-panel/80 text-dopa-cyan'
                  : 'border-arcade-faint bg-arcade-panel/80 text-arcade-muted'
              }`}
            >
              <Box className="h-5 w-5" aria-hidden="true" />
            </button>
          )}

          <HudHeader links={hudLinks} email={CONTACT_EMAIL} />
          <main className="relative z-[1]">
            <TitleScreen />
            <PlayerProfile />
            <Education />
            <PlayerStats />
            <MainQuests />
            <SavePoints />
            <SideQuests />
            <Certifications />
            <Archive />
            <StageClear />
          </main>
        </div>
      </Stage3DContext.Provider>
    </ScrollProgressProvider>
  );
}
