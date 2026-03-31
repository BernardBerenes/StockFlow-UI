import type { PaginationMetadata } from '@/types/product';

interface PaginationProps {
  metadata: PaginationMetadata;
  onPageChange: (page: number) => void;
}

export default function Pagination({ metadata, onPageChange }: PaginationProps) {
  const { page, total, total_page, size } = metadata;
  const startItem = (page - 1) * size + 1;
  const endItem = Math.min(page * size, total);

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const maxVisible = 5;

    if (total_page <= maxVisible) {
      for (let i = 1; i <= total_page; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');

      const start = Math.max(2, page - 1);
      const end = Math.min(total_page - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (page < total_page - 2) pages.push('...');
      pages.push(total_page);
    }

    return pages;
  };

  if (total_page <= 1 && total <= size) return null;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-slate-200">
      {/* Info */}
      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-700">{startItem}</span> to{' '}
        <span className="font-semibold text-slate-700">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-700">{total}</span> products
      </p>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((p, index) =>
          p === '...' ? (
            <span key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center text-sm text-slate-400">
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                p === page
                  ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-md shadow-violet-500/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer'
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= total_page}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
