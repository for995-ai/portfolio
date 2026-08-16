import { useState } from 'react';
import { COMPETITIONS, CERTIFICATIONS } from '@/data/portfolioV2';
import { Lightbox } from './Lightbox';
import { Pagination, usePagination } from './Pagination';
import { useInView } from '@/hooks/useInView';

// ── Competition certificate images ────────────────────────────────────────────
// NOTE: three files are stored with a literal "- " filename prefix; it must be
// preserved here or the images 404.

const COMP_IMAGES: Partial<Record<string, string>> = {
  C5: '/images/- 2025第十四屆全國連鎖加盟產業創新提案競賽暨高中職學校小論文競賽-C.打造具連鎖潛力的創業品牌企劃組 優勝.png',
  C8: '/images/- 2024僑光行流盃「全國大國大專校院曁高中職創意行銷」競賽 大專院校-創新廣告金句組-佳作.png',
  C3: '/images/- 「第十屆全國大專院校B2B 跨境電商暨 AI 創新提案競賽」AI創新提案組-參賽證明.png',
  C4: '/images/第五屆潛力種子盃個股研究競賽-參賽證明.png',
  C6: '/images/2025「集點子大賽」徵選-參賽證明.png',
  C7: '/images/2025 第九屆 全國大專校院Healthy x Happy 創新創業競賽-參賽證明.png',
};

const CERT_IMAGES: Record<string, string> = {
  E1: '/images/ICDL 國際認證 - IT Security 資訊安全.png',
  E2: '/images/CSEPT 大學院校英語能力測驗 第一級.png',
};

// ── Gallery model ─────────────────────────────────────────────────────────────

interface GalleryItem {
  key:    string;
  title:  string;
  result: string;
  src:    string;
}

/** Awards first (medalled results lead), then participation, then certificates. */
const COMP_ITEMS: GalleryItem[] = COMPETITIONS
  .filter(c => !!COMP_IMAGES[c.id])
  .map(c => ({ key: c.id, title: c.work, result: c.result, src: COMP_IMAGES[c.id]! }))
  .sort((a, b) => Number(a.result === '參賽') - Number(b.result === '參賽'));

const CERT_ITEMS: GalleryItem[] = CERTIFICATIONS
  .filter(c => !!CERT_IMAGES[c.id])
  .map(c => ({ key: c.id, title: c.name, result: c.issuer, src: CERT_IMAGES[c.id] }));

const GALLERY_ITEMS: GalleryItem[] = [...COMP_ITEMS, ...CERT_ITEMS];

// ── Card ──────────────────────────────────────────────────────────────────────

function GalleryCard({ item, onOpen }: { item: GalleryItem; onOpen: (i: GalleryItem) => void }) {
  const isMedal = item.result !== '參賽';

  return (
    <button
      type="button"
      aria-label={`查看 ${item.title} 圖片`}
      onClick={() => onOpen(item)}
      className="v2-card v2-award-card"
    >
      <div className="v2-award-media">
        <img src={item.src} alt={item.title} loading="lazy" decoding="async" />
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

export function Awards() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05 });
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const { page, totalPages, pageItems, onPrevious, onNext } =
    usePagination(GALLERY_ITEMS, 'awards');

  return (
    <div ref={ref} className={`v2-reveal ${inView ? 'is-visible' : ''}`}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {pageItems.map(item => (
          <GalleryCard key={item.key} item={item} onOpen={setLightbox} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrevious={onPrevious}
        onNext={onNext}
        label="獎項證明分頁"
      />

      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.title} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
