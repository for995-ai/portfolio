import { useState } from 'react';
import { SavePointNode } from '@/components/arcade/SavePointNode';
import { Lightbox, type LightboxImage } from '@/components/arcade/Lightbox';
import { useInView } from '@/hooks/useInView';
import { savePoints } from '@/data/savePoints';

/**
 * Section 4 — SavePoints：標題旋轉 90 度垂直放在左側（桌機），
 * 時間軸佔滿右側（結構刻意不同於他區）。軸線 cyan→violet 漸層。
 */
export function SavePoints() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05 });
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  return (
    <section id="level-3" aria-label="經歷" className="sgap-10">
      <div className="arcade-container">
        <div className="md:grid md:grid-cols-[56px_minmax(0,1fr)] md:gap-8">
          {/* 桌機：垂直標題；手機：一般橫排 */}
          <div className="md:hidden">
            <p className="px-title text-[0.6rem] text-px-coral">QUEST LOG</p>
            <h2 className="zh-heading text-h2 mt-2 whitespace-nowrap font-sans text-px-white">
              經歷
            </h2>
            <div className="px-rule mt-4 w-40" aria-hidden="true" />
          </div>
          <h2
            className="px-title hidden text-[0.62rem] text-px-coral md:block md:[writing-mode:vertical-rl]"
            aria-hidden="true"
          >
            QUEST LOG ／ 經歷
          </h2>

          <div ref={ref} className="relative mt-8 md:mt-0">
            {/* 軸線底＋發光軸線（cyan→violet 漸層，進場由上往下點亮 600ms） */}
            <div
              className="absolute bottom-2 left-[13px] top-2 w-px bg-arcade-border"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-2 left-[13px] top-2 w-px origin-top"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(0,240,255,0.7), rgba(139,92,255,0.45))',
                transform: inView ? 'scaleY(1)' : 'scaleY(0)',
                transition: 'transform 600ms ease-out',
              }}
              aria-hidden="true"
            />

            <ol className="m-0 list-none p-0">
              {savePoints.map((point, i) => (
                <SavePointNode
                  key={point.id}
                  point={point}
                  index={i}
                  visible={inView}
                  onOpenImage={setLightboxImage}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>

      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </section>
  );
}
