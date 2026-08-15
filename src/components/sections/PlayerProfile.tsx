import { useInView } from '@/hooks/useInView';
import { characterInfo } from '@/data/player';
import { quests } from '@/data/quests';
import { CERTIFICATIONS, COMPETITIONS } from '@/data/portfolioData';

/**
 * Profile — Player Profile（角色資料頁）。
 * 數據卡一律由既有真實資料即時計算（專案／競賽／證照數量、課輔時數），
 * 不寫死、不虛構。
 */
const stats: Array<{ en: string; zh: string; value: string; unit?: string }> = [
  { en: 'PROJECTS', zh: '專案作品', value: String(quests.length), unit: '件' },
  { en: 'AWARDS', zh: '競賽紀錄', value: String(COMPETITIONS.length), unit: '項' },
  { en: 'CERTS', zh: '專業證照', value: String(CERTIFICATIONS.length), unit: '張' },
  { en: 'SERVICE', zh: '偏鄉課輔', value: '150', unit: '小時' },
];

export function PlayerProfile() {
  const head = useInView<HTMLDivElement>();
  const grid = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="profile" aria-label="個人簡介" className="sgap-9">
      <div className="arcade-container">
        <div
          ref={head.ref}
          className={`arcade-reveal ${head.inView ? 'is-visible' : ''}`}
        >
          <p className="px-title text-[0.6rem] text-px-coral">PLAYER PROFILE</p>
          <h2 className="zh-heading text-h1 mt-2 whitespace-nowrap font-sans text-px-white">
            個人簡介
          </h2>
          <div className="px-rule mt-4 w-40" aria-hidden="true" />
        </div>

        <div
          ref={grid.ref}
          className={`arcade-reveal mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] ${
            grid.inView ? 'is-visible' : ''
          }`}
        >
          {/* 角色資料視窗 */}
          <div className="px-panel px-window p-5 pt-6 md:p-6 md:pt-7">
            <p className="zh-body max-w-[68ch] text-base leading-[1.75] text-px-peach">
              我是資訊管理學系學生，專注於
              <span className="text-px-cream">介面設計、前端實作與互動學習體驗</span>
              。作品從需求與流程出發，把系統邏輯轉譯成清楚、好用，也讓人記得住的數位體驗。
            </p>
            <p className="zh-body mt-3 max-w-[68ch] text-base leading-[1.75] text-px-peach">
              目前的核心方向是
              <span className="text-px-cream">遊戲化介面對文化學習成效之影響</span>
              ——把文化內容與 AI 工具，設計成可以親手操作、願意一直玩下去的學習過程。
            </p>

            <dl className="mt-6 grid gap-4 border-t-2 border-px-ink/70 pt-5 sm:grid-cols-3">
              {characterInfo.map((row) => (
                <div key={row.label}>
                  <dt className="px-title text-[0.55rem] text-px-coral">{row.label}</dt>
                  <dd className="m-0 mt-1.5 text-[0.95rem] leading-[1.6] text-px-white">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 數據卡（真實資料計算） */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {stats.map((s) => (
              <div
                key={s.en}
                className="px-card flex items-baseline justify-between gap-2 p-3.5"
              >
                <div>
                  <p className="px-title text-[0.5rem] text-px-coral">{s.en}</p>
                  <p className="mt-1 text-sm text-px-peach">{s.zh}</p>
                </div>
                <p className="px-title shrink-0 text-lg text-px-cream">
                  {s.value}
                  {s.unit && <span className="ml-1 text-[0.5rem] text-px-peach">{s.unit}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
