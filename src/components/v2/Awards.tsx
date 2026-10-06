import { useState } from 'react';
import { publicUrl } from '@/lib/publicUrl';
import { EVIDENCE_CATEGORIES, GALLERY_ITEMS, type EvidenceCategory, type GalleryItem } from '@/data/awardEvidence';
import { Lightbox } from './Lightbox';
import { Pagination, usePagination } from './Pagination';
import { useInView } from '@/hooks/useInView';
import { ResilientImage } from './ResilientImage';

// Empty categories stay private until formal evidence is added to the data.
const AVAILABLE_CATEGORIES = EVIDENCE_CATEGORIES.filter(category =>
  GALLERY_ITEMS.some(item => item.category === category.id),
);

// ── Card ──────────────────────────────────────────────────────────────────────

function GalleryCard({ item, onOpen }: { item: GalleryItem; onOpen: (i: GalleryItem) => void }) {
  const isMedal = item.category === 'competition' && item.result !== '參賽';

  return (
    <button
      type="button"
      aria-label={`查看 ${item.title} 圖片`}
      onClick={() => onOpen(item)}
      className="v2-card v2-award-card"
    >
      <div className="v2-award-media">
        <ResilientImage
          src={publicUrl(item.thumbnailSrc)}
          alt={item.title}
          width={960}
          height={540}
          loading="lazy"
          decoding="async"
          {...{ fetchpriority: 'low' }}
        />
        <span className="v2-award-zoom" aria-hidden>⤢</span>
      </div>

      <div className="v2-award-body">
        <p className="v2-award-title">{item.title}</p>
        <p className="v2-award-result" data-medal={isMedal}>{item.result}</p>
      </div>
    </button>
  );
}

// ── Main Awards component ─────────────────────────────────────────────────────

function EvidenceGallery({ items }: { items: readonly GalleryItem[] }) {
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const { page, totalPages, pageItems, onPrevious, onNext } =
    usePagination(items, 'awards');

  return (
    <div id="awards-gallery">
      <div className="v2-evidence-grid grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {pageItems.map(item => (
          <GalleryCard key={item.key} item={item} onOpen={setLightbox} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrevious={onPrevious}
        onNext={onNext}
        label="獎項與證明分頁"
      />

      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.title} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}

export function Awards() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05 });
  const [category, setCategory] = useState<EvidenceCategory>('competition');
  const items = GALLERY_ITEMS.filter(item => item.category === category);

  return (
    <div ref={ref} className={`v2-reveal ${inView ? 'is-visible' : ''}`}>
      <div className="v2-evidence-filter" role="group" aria-label="證明分類">
        {AVAILABLE_CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className="v2-page-btn v2-evidence-filter-btn"
            aria-pressed={category === id}
            aria-controls="awards-gallery"
            onClick={() => setCategory(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* A category change resets the shared pager to page 1. */}
      <EvidenceGallery key={category} items={items} />
    </div>
  );
}
