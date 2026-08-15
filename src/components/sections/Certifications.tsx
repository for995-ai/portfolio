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
        className="px-card group flex h-full w-full cursor-zoom-in flex-col overflow-hidden text-left transition-transform duration-150 hover:-translate-y-1"
      >
        <div className="relative m-3 mb-0 aspect-[4/3] shrink-0 overflow-hidden rounded-[2px] border-[3px] border-px-ink bg-px-deep">
          {img && (
            <img
              src={encodeURI(img)}
              alt={title}
              loading="lazy"
              className="h-full w-full object-contain p-2.5"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-px-night/75 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <span className="px-tag px-tag--cream !text-[0.5rem]">[ 查看證照 ]</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="zh-heading font-sans text-[0.95rem] leading-[1.6] text-px-white">
            {title}
          </h3>
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
          className={`arcade-reveal px-tag mb-4 ${label.inView ? 'is-visible' : ''}`}
        >
          CERTS ／證照
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
