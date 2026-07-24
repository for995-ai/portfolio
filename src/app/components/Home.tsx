import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { LevelIndicator, type LevelAnchor } from '@/components/arcade/LevelIndicator';
import { FragmentField } from '@/components/arcade/FragmentDecor';
import { ScrollProgressProvider } from '@/hooks/useScrollProgress';
import { Stage3DContext } from '@/hooks/stage3d';
import { supports3D } from '@/components/arcade/gamepad3d/capability';
import { TitleScreen } from '@/components/sections/TitleScreen';
import { PlayerStats } from '@/components/sections/PlayerStats';
import { MainQuests } from '@/components/sections/MainQuests';
import { SavePoints } from '@/components/sections/SavePoints';
import { SideQuests } from '@/components/sections/SideQuests';
import { Certifications } from '@/components/sections/Certifications';
import { Archive } from '@/components/sections/Archive';
import { StageClear } from '@/components/sections/StageClear';

/* three.js 與舞台一律動態 import，不進首屏主 bundle */
const Stage = lazy(() => import('@/three/Stage'));

const levels: LevelAnchor[] = [
  { id: 'level-1', label: '', name: '技能' },
  { id: 'level-2', label: '', name: '專案' },
  { id: 'level-3', label: '', name: '經歷' },
  { id: 'level-4', label: '', name: '活動' },
  { id: 'certifications', label: '', name: '證照' },
  { id: 'archive', label: '', name: '文章' },
];

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
    /* 區塊中段對齊展台（首尾取邊界） */
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const center = i === 0 ? 0 : i === 6 ? max : top - window.innerHeight * 0.35;
    return Math.min(Math.max(center / max, 0), 1);
  });
  /* 保證嚴格遞增 */
  for (let i = 1; i < anchors.length; i++) {
    if (anchors[i] <= anchors[i - 1]) anchors[i] = anchors[i - 1] + 0.001;
  }
  return anchors;
}

/** 單頁滾動：暗色電玩 UI 推甄作品集（3D 舞台 / 完整 2D 降級） */
export function Home() {
  /* tryStage：閘門通過且未失敗；stage3D：3D 已就緒（交叉淡入後） */
  const [tryStage, setTryStage] = useState(false);
  const [stage3D, setStage3D] = useState(false);
  const [loading, setLoading] = useState(false);
  const anchorsRef = useRef<number[]>([0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1]);
  const readyRef = useRef(false);

  useEffect(() => {
    if (!supports3D()) return;
    const measure = () => {
      anchorsRef.current = measureAnchors();
    };
    measure();
    window.addEventListener('resize', measure);

    setTryStage(true);
    setLoading(true);
    /* 3D 資源 2.5 秒未就緒 → 放棄，使用完整 2D 版本 */
    const timer = setTimeout(() => {
      if (!readyRef.current) {
        setTryStage(false);
        setLoading(false);
      }
    }, 2500);

    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(timer);
    };
  }, []);

  const handleReady = () => {
    readyRef.current = true;
    anchorsRef.current = measureAnchors();
    setLoading(false);
    setStage3D(true); // 交叉淡入 400ms
  };

  const handleFail = () => {
    readyRef.current = false;
    setTryStage(false);
    setStage3D(false);
    setLoading(false);
  };

  return (
    <ScrollProgressProvider>
      <Stage3DContext.Provider value={stage3D}>
        <div
          data-stage3d={stage3D ? 'true' : undefined}
          className="min-h-svh bg-arcade-bg text-arcade-text"
        >
          {/* 單一常駐 3D 舞台：fixed 全螢幕、z-0，HTML 內容疊於其上 */}
          {tryStage && (
            <div
              className={`fixed inset-0 z-0 transition-opacity duration-[400ms] ${
                stage3D ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              aria-hidden="true"
            >
              <Suspense fallback={null}>
                <Stage anchorsRef={anchorsRef} onReady={handleReady} onFail={handleFail} />
              </Suspense>
            </div>
          )}

          {/* 2D 碎片場：僅在未啟用 3D 舞台時呈現（3D 的零件取代其角色） */}
          {!stage3D && <FragmentField />}

          {/* 極簡載入指示 */}
          {loading && (
            <div
              className="fixed bottom-5 right-5 z-40 h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/15 border-t-dopa-cyan"
              role="status"
              aria-label="載入中"
            />
          )}

          <LevelIndicator levels={levels} />
          <main className="relative z-[1]">
            <TitleScreen />
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
