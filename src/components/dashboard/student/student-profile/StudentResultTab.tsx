'use client';

import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Result } from '@/types/student';
import StudentResultsTable from './StudentResultTable';


interface StudentResultsTabProps {
  results: Result[];
  limit?: number;
  onViewAll?: () => void;
}

export default function StudentResultsTab({
  results,
  limit,
  onViewAll,
}: StudentResultsTabProps) {
  const visibleResults =
    typeof limit === 'number'
      ? results.slice(0, limit)
      : results;

  return (
    <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          
          <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
            <GraduationCap className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-sm font-black text-white">
              {limit ? 'Recent Exam Results' : 'Examination Results'}
            </h2>

            <p className="mt-1 text-[10px] text-white/30">
              {limit
                ? 'Latest published examination results'
                : 'Complete published examination history'}
            </p>
          </div>

        </div>

        {limit && results.length > limit && onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-[#6ffbbe] transition hover:underline"
          >
            View All
          </button>
        )}
      </div>

      {/* Table */}
      <StudentResultsTable results={visibleResults} />

    </section>
  );
}
