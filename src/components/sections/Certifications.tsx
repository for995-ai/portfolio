import { useState } from 'react';
import { Lightbox, type LightboxImage } from '@/components/arcade/Lightbox';
import { useInView } from '@/hooks/useInView';
import { CERTIFICATIONS } from '@/data/portfolioData';

function CertificationCard({
  title,
  img,
  index,
  onOpen,
}: {
  title: string;
  img?: string;
  index: number;
  onOpen: (image: LightboxImage) => void;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <div
      ref={ref}
      className={`arcade-reveal arcade-reveal-swift ${inView ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${(index % 3) * 30}ms` }}
    >
      {/* 1px 虛線 faint 邊框（刻意的粗糙感），hover 轉實線＋輕微上浮 */}
      <button
        type="button"
        onClick={() => img && onOpen({ src: img, title })}
        aria-label={`放大檢視 ${title}`}
        className="group block h-full w-full cursor-zoom-in overflow-hidden rounded-[8px] border border-dashed border-arcade-faint bg-arcade-panel text-left transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-solid hover:border-arcade-muted"
      >
        <div className="relative aspect-[4/3] border-b border-arcade-border bg-arcade-surface">
          {img && (
            <img
              src={encodeURI(img)}
              alt={title}
              loading="lazy"
              className="h-full w-full object-contain p-2.5"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-arcade-bg/70 opacity-0 transition-opacity duration-[220ms] group-hover:opacity-100">
            <span className="rounded-full border border-white/40 bg-arcade-panel px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.2em] text-arcade-text">
              [ 查看證照 ]
            </span>
          </div>
        </div>
        <div className="p-3.5">
          <h3 className="zh-heading font-sans text-sm text-arcade-text">{title}</h3>
        </div>
      </button>
    </div>
  );
}

/**
 * CERTIFICATIONS：標題極小（text-xs），幾乎只是個標籤（結構刻意不同於他區）。
 * 緊湊網格＋虛線邊框。
 */
export function Certifications() {
  const label = useInView<HTMLParagraphElement>();

  return (
    <section id="certifications" aria-label="專業證照" className="sgap-7">
      <div className="arcade-container">
        <h2
          ref={label.ref}
          className={`arcade-reveal mb-4 inline-block rounded-sm border border-arcade-faint px-2 py-1 font-mono text-xs font-bold tracking-[0.3em] text-arcade-muted ${
            label.inView ? 'is-visible' : ''
          }`}
        >
          證照
        </h2>

        <CertGrid />
      </div>
    </section>
  );
}

function CertGrid() {
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATIONS.map((cert, i) => (
          <CertificationCard
            key={cert.title}
            title={cert.title}
            img={cert.img}
            index={i}
            onOpen={setLightboxImage}
          />
        ))}
      </div>
      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </>
  );
}
