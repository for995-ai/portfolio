import { GlitchText } from '@/components/arcade/GlitchText';
import { prefersReducedMotion, useInView } from '@/hooks/useInView';

/** Section 8 — 結尾（全站唯一置中標題；漸層文字兩處之二） */
export function StageClear() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  const replay = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('title-screen')?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  return (
    <section
      id="stage-clear"
      aria-label="結尾 感謝瀏覽"
      className="sgap-9 relative overflow-hidden pb-16"
    >
      {/* 中央徑向光暈 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(139,92,255,0.08), transparent 55%)',
        }}
        aria-hidden="true"
      />

      <div
        ref={ref}
        className={`arcade-reveal arcade-reveal-grand arcade-container relative flex flex-col items-center pt-10 text-center md:pt-16 ${
          inView ? 'is-visible' : ''
        }`}
      >
        {/* 大標：光暈＋脈動維持（脈動只作用於獨立光暈層 opacity）；漸層文字移至英文副標 */}
        <div className="relative">
          <span
            className="arcade-pulse-slow pointer-events-none absolute inset-0 select-none font-display text-4xl font-bold tracking-[0.2em] text-dopa-violet/40 blur-xl md:text-6xl"
            aria-hidden="true"
          >
            感謝瀏覽
          </span>
          <GlitchText
            as="h2"
            className="zh-heading relative font-display text-4xl font-bold tracking-[0.2em] text-arcade-text [filter:drop-shadow(0_0_22px_rgba(139,92,255,0.5))] md:text-6xl"
          >
            感謝瀏覽
          </GlitchText>
        </div>

        <p className="en-heading grad-hero-text mt-6 font-display text-base font-bold tracking-[0.15em] md:text-lg">
          THANK YOU FOR VISITING
        </p>

        <p className="zh-body mt-4 text-sm text-arcade-text-sec md:text-base">
          下一階段：研究所
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {/* 聯絡我：--grad-hero 底＋深色字（視覺樣式不變） */}
          <a
            href="mailto:for995@gmail.com"
            className="bg-grad-hero rounded-full px-7 py-3 font-mono text-sm font-bold tracking-[0.15em] text-arcade-bg transition-opacity duration-[120ms] hover:opacity-85"
          >
            [ 聯絡我 ]
          </a>
          {/* 回到頂端：透明底＋cyan 框（視覺樣式不變） */}
          <a
            href="#title-screen"
            onClick={replay}
            className="rounded-full border-2 border-dopa-cyan/70 px-7 py-3 font-mono text-sm font-bold tracking-[0.15em] text-dopa-cyan transition-colors duration-[120ms] hover:bg-dopa-cyan/10"
          >
            [ 回到頂端 ]
          </a>
        </div>
      </div>

      <footer className="relative mt-16 md:mt-24">
        <div className="arcade-container border-t border-arcade-border pt-6 text-center">
          <p className="font-mono text-xs tracking-[0.2em] text-arcade-muted">
            © 2026 蘇洺崴 ｜ SU MING-WEI
          </p>
        </div>
      </footer>
    </section>
  );
}
