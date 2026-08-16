import { useCallback, useMemo, useState } from 'react';

/** Every paginated section shows at most this many items per page. */
export const PAGE_SIZE = 6;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  /** Accessible name, e.g. "專案作品分頁". */
  label: string;
}

/**
 * Shared pager used by Projects, Awards and Experience. Bubble styling, with
 * disabled ends rather than wrap-around so the position in the set stays clear.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  label,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const atStart = currentPage === 1;
  const atEnd   = currentPage === totalPages;

  return (
    <nav
      aria-label={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '32px',
      }}
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={atStart}
        className="v2-page-btn"
        aria-label="上一頁"
      >
        ← 上一頁
      </button>

      <span className="v2-page-indicator" aria-live="polite">
        {currentPage} / {totalPages}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={atEnd}
        className="v2-page-btn"
        aria-label="下一頁"
      >
        下一頁 →
      </button>
    </nav>
  );
}

/**
 * Page state plus the slice for the current page.
 *
 * `anchorId` is the section to scroll back to on page change, so the reader
 * lands on the heading rather than mid-grid.
 */
export function usePagination<T>(items: readonly T[], anchorId: string, pageSize = PAGE_SIZE) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  const goTo = useCallback((next: number) => {
    setPage(next);
    const el = document.getElementById(anchorId);
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, [anchorId]);

  const onPrevious = useCallback(() => { if (page > 1) goTo(page - 1); }, [page, goTo]);
  const onNext     = useCallback(() => { if (page < totalPages) goTo(page + 1); }, [page, totalPages, goTo]);

  return { page, totalPages, pageItems, onPrevious, onNext };
}
