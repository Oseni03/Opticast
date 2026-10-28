'use client';

interface EpisodesPaginationProps {
  page: number;
  pageCount: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function EpisodesPagination({
  page,
  pageCount,
  onPrev,
  onNext,
}: EpisodesPaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className="mt-[24px] flex flex-wrap items-center justify-center gap-[14px]"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={onPrev}
        className="min-h-[44px] px-[18px] rounded-6 border border-[#e7e4d6] bg-transparent text-[#5a5a66] font-bold text-[15px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="font-mono text-[12px] tracking-wider uppercase text-[#5a5a66]">
        Page {page} of {pageCount}
      </span>
      <button
        type="button"
        disabled={page >= pageCount}
        onClick={onNext}
        className="min-h-[44px] px-[18px] rounded-6 border border-[#403e0a] bg-transparent text-[#403e0a] font-bold text-[15px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </nav>
  );
}
