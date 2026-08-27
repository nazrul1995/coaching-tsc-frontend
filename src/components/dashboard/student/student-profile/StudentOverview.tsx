'use client';

import { AcademicSummary, Ranking, Result } from '@/types/student';
import React, { useMemo } from 'react';
import StudentRanking from './StudentRanking';
import StudentResultsTab from './StudentResultTab';
import StudentAcademicStats from './StudentAcademicStats';
import StudentAttendanceChart from './StudentAttendanceChart';
import StudentPerformanceChart from './StudentPerformanceChart';


interface Props {
  academicSummary: AcademicSummary;
  ranking: Ranking;
  results: Result[];
  onViewResults: () => void;
}

export default function StudentOverview({
  academicSummary,
  ranking,
  results,
  onViewResults,
}: Props) {
  const performanceData = useMemo(() => {
    return [...results]
      .filter((result) => !result.isAbsent)
      .reverse()
      .map((result) => ({
        name:
          result.exam?.title?.slice(0, 18) ||
          'Exam',
        percentage: result.percentage,
        marks: result.marks,
        totalMarks: result.totalMarks,
        date: result.exam?.examDate,
      }));
  }, [results]);

  const attendanceData = [
    {
      name: 'Participated',
      value: academicSummary.participated,
    },
    {
      name: 'Absent',
      value: academicSummary.absent,
    },
  ];

  return (
    <div className="space-y-6">

      <StudentAcademicStats
        academicSummary={academicSummary}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">

        <StudentPerformanceChart
          data={performanceData}
        />

        <StudentAttendanceChart
          data={attendanceData}
          totalExams={academicSummary.totalExams}
        />

      </div>

      <StudentRanking ranking={ranking} />

      <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025]">

        <div className="flex items-center justify-between border-b border-white/10 p-5">

          <div>
            <h2 className="text-sm font-black">
              Recent Exam Results
            </h2>

            <p className="mt-1 text-[10px] text-white/30">
              Latest published results
            </p>
          </div>

          <button
            onClick={onViewResults}
            className="text-xs font-semibold text-[#6ffbbe] hover:underline"
          >
            View All
          </button>

        </div>

        <StudentResultsTab
          results={results.slice(0, 5)}
        />

      </section>

    </div>
  );
}
