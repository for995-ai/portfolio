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
        {/* 大標：像素階梯陰影（取代光暈） */}
        <p className="px-title px-blink text-[0.62rem] text-px-coral">CONTINUE?</p>
        <GlitchText
          as="h2"
          className="zh-heading mt-4 font-sans text-4xl font-black leading-[1.15] text-px-white md:text-6xl"
        >
          <span style={{ textShadow: '3px 3px 0 #17102b, 6px 6px 0 #d6337f' }}>感謝瀏覽</span>
        </GlitchText>

        <p className="px-title mt-6 text-[0.6rem] text-px-cream md:text-[0.7rem]">
          THANK YOU FOR VISITING
        </p>

        <p className="zh-body mt-4 text-base leading-[1.7] text-px-peach">
          下一階段：研究所
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {/* 聯絡我：--grad-hero 底＋深色字（視覺樣式不變） */}
          <a href="mailto:for995@gmail.com" className="px-btn px-btn--primary">
            聯絡我 ▶
          </a>
          <a href="#title-screen" onClick={replay} className="px-btn">
            回到頂端 ↑
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
