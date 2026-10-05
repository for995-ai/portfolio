import { COMPETITIONS, CERTIFICATIONS } from './portfolioV2';

export type EvidenceCategory = 'competition' | 'certification' | 'leadership' | 'service';

export interface GalleryItem {
  key: string;
  category: EvidenceCategory;
  title: string;
  result: string;
  src: string;
  thumbnailSrc: string;
  documentPath?: string;
}

export const EVIDENCE_CATEGORIES: readonly { id: EvidenceCategory; label: string }[] = [
  { id: 'competition', label: '競賽獎項' },
  { id: 'certification', label: '專業證照' },
  { id: 'leadership', label: '幹部證明' },
  { id: 'service', label: '服務證明' },
];

// Preserve the literal "- " prefix on the existing certificate filenames.
const COMP_IMAGES: Partial<Record<string, string>> = {
  C1: '/images/awards/2026-global-brand-starry-run-honorable-mention.png',
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

const THUMBNAILS: Record<string, string> = {
  C1: '/images/optimized/cards/award-c1.webp',
  C5: '/images/optimized/cards/award-c5.webp',
  C8: '/images/optimized/cards/award-c8.webp',
  C3: '/images/optimized/cards/award-c3.webp',
  C4: '/images/optimized/cards/award-c4.webp',
  C6: '/images/optimized/cards/award-c6.webp',
  C7: '/images/optimized/cards/award-c7.webp',
  E1: '/images/optimized/cards/cert-e1.webp',
  E2: '/images/optimized/cards/cert-e2.webp',
};

const DOCUMENTS: Partial<Record<string, string>> = {
  C1: '/documents/awards/2026-global-brand/starry-run-honorable-mention.pdf',
};

/** Award results lead, preserving competition order within each group. */
const COMP_ITEMS: GalleryItem[] = COMPETITIONS
  .filter(c => !!COMP_IMAGES[c.id])
  .map(c => ({
    key: c.id,
    category: 'competition' as const,
    title: c.work,
    result: c.result,
    src: COMP_IMAGES[c.id]!,
    thumbnailSrc: THUMBNAILS[c.id],
    documentPath: DOCUMENTS[c.id],
  }))
  .sort((a, b) => Number(a.result === '參賽') - Number(b.result === '參賽'));

const CERT_ITEMS: GalleryItem[] = CERTIFICATIONS
  .filter(c => !!CERT_IMAGES[c.id])
  .map(c => ({
    key: c.id,
    category: 'certification',
    title: c.name,
    result: c.issuer,
    src: CERT_IMAGES[c.id],
    thumbnailSrc: THUMBNAILS[c.id],
  }));

/**
 * Add future formal leadership/service certificates here with their full image,
 * thumbnail and optional original document. Activity photos are not evidence.
 * A populated category appears in the public filter automatically.
 */
export const ADDITIONAL_EVIDENCE: readonly GalleryItem[] = [];

export const GALLERY_ITEMS: readonly GalleryItem[] = [
  ...COMP_ITEMS,
  ...CERT_ITEMS,
  ...ADDITIONAL_EVIDENCE,
];
