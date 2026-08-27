'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

interface CoursePaginationProps {
  totalPages: number;
  page: number;
  setPage: (val: number) => void;
}

const CoursePagination: React.FC<CoursePaginationProps> = ({
  totalPages,
  page,
  setPage,
}) => {
  return (
    <div className="flex justify-center gap-2 mt-10 flex-wrap">
      {Array.from({ length: totalPages }).map((_, i) => {
        const pageNum = i + 1;
        return (
          <Button
            key={i}
            variant={page === pageNum ? 'default' : 'outline'}
            className={
              page === pageNum
                ? 'bg-blue-400 text-black'
                : 'border-white/30 text-black'
            }
            onClick={() => setPage(pageNum)}
          >
            {pageNum}
          </Button>
        );
      })}
    </div>
  );
};

export default CoursePagination;