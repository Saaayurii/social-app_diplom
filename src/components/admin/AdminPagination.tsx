'use client';

import Button from '@/components/ui/Button';

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function AdminPagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: AdminPaginationProps) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  if (totalCount === 0) return null;

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {start} to {end} of {totalCount} results
      </p>

      <div className="flex gap-2">
        <Button
          size="small"
          mode="ghost"
          isDisabled={page <= 1}
          onPress={() => onPageChange(page - 1)}
        >
          Previous
        </Button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (page <= 3) {
            pageNum = i + 1;
          } else if (page >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = page - 2 + i;
          }

          return (
            <Button
              key={pageNum}
              size="small"
              mode={page === pageNum ? 'primary' : 'ghost'}
              onPress={() => onPageChange(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          size="small"
          mode="ghost"
          isDisabled={page >= totalPages}
          onPress={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
