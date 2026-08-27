'use client';

import React, { useState } from 'react';
import { ArrowLeft, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStudentDetails } from '@/hooks/useStudentDetails';
import { StudentProfileTab } from '@/types/student';
import StudentOverview from './StudentOverview';
import StudentResults from './StudentResults';
import StudentFees from './StudentFees';
import StudentInfo from './StudentInfo';
import StudentProfileHeader from './StudentProfileHeader';


interface StudentProfileProps {
  studentId: string;
  showBackButton?: boolean;
}

export default function StudentProfile({
  studentId,
  showBackButton = true,
}: StudentProfileProps) {
  const router = useRouter();

  const {
    data,
    loading,
    error,
  } = useStudentDetails(studentId);

  const [activeTab, setActiveTab] =
    useState<StudentProfileTab>('overview');

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#6ffbbe]" />

          <p className="text-sm text-white/50">
            Loading student profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-10 text-center text-white">
        <XCircle className="mx-auto mb-4 h-10 w-10 text-rose-400" />

        <h2 className="text-lg font-bold">
          Unable to load student
        </h2>

        <p className="mt-2 text-sm text-white/40">
          {error || 'Student details পাওয়া যায়নি'}
        </p>

        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="mt-6 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold hover:bg-white/15"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  const {
    student,
    academicSummary,
    ranking,
    feeSummary,
    results,
    feeHistory,
  } = data;

  return (
    <div className="space-y-6 text-white">
      <StudentProfileHeader
        student={student}
        academicSummary={academicSummary}
        ranking={ranking}
        feeSummary={feeSummary}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'overview' && (
        <StudentOverview
          academicSummary={academicSummary}
          ranking={ranking}
          results={results}
          onViewResults={() =>
            setActiveTab('results')
          }
        />
      )}

      {activeTab === 'results' && (
        <StudentResults results={results} />
      )}

      {activeTab === 'fees' && (
        <StudentFees
          feeSummary={feeSummary}
          feeHistory={feeHistory}
        />
      )}

      {activeTab === 'info' && (
        <StudentInfo
          student={student}
          academicSummary={academicSummary}
        />
      )}

    </div>
  );
}
