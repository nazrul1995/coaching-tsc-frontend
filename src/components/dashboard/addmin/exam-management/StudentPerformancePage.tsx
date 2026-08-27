'use client';

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  TrendingUp,
  UserRound,
} from 'lucide-react';
import Swal from 'sweetalert2';

import axiosSecure from '@/lib/axiosSecure';

import {
  DashboardPageHeader,
  DashboardStatCard,
  DashboardStatGrid,
  LoadingState,
  SearchInput,
} from '../common';

import { StudentPerformance } from './result.types';
import { formatPercentage } from './result.helpers';

interface StudentOption {
  _id: string;
  name: string;
  className?: string;
  batch?: string;
  photo?: string;
}

export default function StudentPerformancePage() {
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [studentId, setStudentId] = useState('');
  const [performance, setPerformance] =
    useState<StudentPerformance | null>(null);

  const [search, setSearch] = useState('');

  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingPerformance, setLoadingPerformance] = useState(false);

  /**
   * Load all students
   */
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await axiosSecure.get('/students');

        const data = response.data?.data ?? [];

        setStudents(
          Array.isArray(data) ? data : [],
        );
      } catch (error) {
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    loadStudents();
  }, []);

  /**
   * Load selected student's performance
   */
  useEffect(() => {
    if (!studentId) {
      setPerformance(null);
      return;
    }

    const loadPerformance = async () => {
      setLoadingPerformance(true);

      try {
        const response = await axiosSecure.get(
          `/exams/student/${studentId}/performance`,
        );

        setPerformance(
          response.data?.data
            ? {
                ...response.data,
                data: response.data.data,
              }
            : response.data,
        );
      } catch (error: any) {
        setPerformance(null);

        Swal.fire({
          icon: 'error',
          title: 'Unable to load performance',
          text:
            error?.response?.data?.message ||
            'Please try again.',
          background: '#0b1326',
          color: '#fff',
          confirmButtonColor: '#6ffbbe',
        });
      } finally {
        setLoadingPerformance(false);
      }
    };

    loadPerformance();
  }, [studentId]);

  /**
   * Filter students by search text
   */
  const filteredStudents = students.filter((student) =>
    student.name
      ?.toLowerCase()
      .includes(search.toLowerCase()),
  );

  /**
   * Currently selected student
   */
  const selectedStudent = students.find(
    (student) => student._id === studentId,
  );

  /**
   * Performance data
   */
  const data = performance?.data;

  /**
   * Recent exam results
   */
  const recentResults = data?.results || [];

  return (
    <div className="space-y-6 text-white">
      {/* Page Header */}
      <DashboardPageHeader
        title="Student Performance"
        description="Review published exam performance, averages and recent results for an individual student."
        icon={TrendingUp}
      />

      {/* Student Selection */}
      <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">
          {/* Student Search */}
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-white/35">
              Find Student
            </label>

            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search student name..."
            />

            {/* Student List */}
            <div className="mt-2 max-h-48 overflow-y-auto rounded-2xl border border-white/10 bg-black/10">
              {loadingStudents ? (
                <p className="p-4 text-xs text-white/30">
                  Loading students...
                </p>
              ) : (
                <>
                  {filteredStudents
                    .slice(0, 20)
                    .map((student) => {
                      const isSelected =
                        student._id === studentId;

                      return (
                        <button
                          key={student._id}
                          type="button"
                          onClick={() =>
                            setStudentId(student._id)
                          }
                          className={`flex w-full items-center gap-3 border-b border-white/5 p-3 text-left last:border-0 hover:bg-white/5 ${
                            isSelected
                              ? 'bg-[#6ffbbe]/5'
                              : ''
                          }`}
                        >
                          {/* Student Avatar */}
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5 text-xs font-black text-[#adc6ff]">
                            {student.photo ? (
                              <img
                                src={student.photo}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              student.name?.charAt(0)
                            )}
                          </div>

                          {/* Student Details */}
                          <div>
                            <p className="text-xs font-bold">
                              {student.name}
                            </p>

                            <p className="text-[9px] text-white/30">
                              Class {student.className || '—'}
                              {student.batch
                                ? ` · ${student.batch}`
                                : ''}
                            </p>
                          </div>
                        </button>
                      );
                    })}

                  {!filteredStudents.length && (
                    <p className="p-4 text-xs text-white/30">
                      No students found.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Selected Student */}
          <div className="flex items-center rounded-2xl border border-white/5 bg-gradient-to-br from-[#adc6ff]/5 to-[#6ffbbe]/5 p-5">
            {selectedStudent ? (
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/5 text-lg font-black text-[#adc6ff]">
                  {selectedStudent.photo ? (
                    <img
                      src={selectedStudent.photo}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    selectedStudent.name.charAt(0)
                  )}
                </div>

                {/* Student Info */}
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">
                    Selected Student
                  </p>

                  <h2 className="mt-1 text-xl font-black">
                    {selectedStudent.name}
                  </h2>

                  <p className="mt-1 text-xs text-white/40">
                    Class {selectedStudent.className || '—'}
                    {selectedStudent.batch
                      ? ` · ${selectedStudent.batch}`
                      : ''}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-white/30">
                <UserRound size={22} />

                <span className="text-sm">
                  Select a student to view performance.
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Performance Loading */}
      {loadingPerformance && (
        <LoadingState label="Loading student performance..." />
      )}

      {/* Performance Content */}
      {!loadingPerformance && performance && data && (
        <>
          {/* Statistics */}
          <DashboardStatGrid>
            <DashboardStatCard
              title="Total Exams"
              value={String(data.summary.totalExams)}
              subtitle="Published exams"
              icon={GraduationCap}
              color="blue"
            />

            <DashboardStatCard
              title="Average"
              value={formatPercentage(
                data.summary.averagePercentage,
              )}
              subtitle="Overall average"
              icon={TrendingUp}
              color="green"
            />

            <DashboardStatCard
              title="Weekly Exams"
              value={String(
                data.summary.weeklyExamCount,
              )}
              subtitle="Weekly participation"
              icon={CalendarDays}
              color="amber"
            />

            <DashboardStatCard
              title="Model Tests"
              value={String(
                data.summary.modelTestCount,
              )}
              subtitle="Model test participation"
              icon={BookOpen}
              color="rose"
            />
          </DashboardStatGrid>

          {/* Recent Results */}
          <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025]">
            {/* Section Header */}
            <div className="border-b border-white/10 p-5">
              <h2 className="text-sm font-black">
                Recent Results
              </h2>

              <p className="mt-1 text-[10px] text-white/30">
                Published, non-absent results returned by
                the backend.
              </p>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-5 py-3 text-left text-[9px] uppercase text-white/30">
                      Exam
                    </th>

                    <th className="px-5 py-3 text-left text-[9px] uppercase text-white/30">
                      Date
                    </th>

                    <th className="px-5 py-3 text-right text-[9px] uppercase text-white/30">
                      Marks
                    </th>

                    <th className="px-5 py-3 text-right text-[9px] uppercase text-white/30">
                      Percentage
                    </th>

                    <th className="px-5 py-3 text-right text-[9px] uppercase text-white/30">
                      Grade
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentResults.map((result: any) => (
                    <tr
                      key={result._id}
                      className="border-b border-white/5"
                    >
                      {/* Exam */}
                      <td className="px-5 py-4">
                        <p className="text-xs font-bold">
                          {result.exam?.title || 'Exam'}
                        </p>

                        <p className="text-[9px] text-white/30">
                          {result.exam?.type || ''}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-xs text-white/50">
                        {result.exam?.examDate
                          ? new Date(
                              result.exam.examDate,
                            ).toLocaleDateString()
                          : '—'}
                      </td>

                      {/* Marks */}
                      <td className="px-5 py-4 text-right text-xs font-bold">
                        {result.marks} /{' '}
                        {result.totalMarks}
                      </td>

                      {/* Percentage */}
                      <td className="px-5 py-4 text-right text-xs font-black text-[#6ffbbe]">
                        {formatPercentage(
                          result.percentage,
                        )}
                      </td>

                      {/* Grade */}
                      <td className="px-5 py-4 text-right text-xs font-black text-[#adc6ff]">
                        {result.grade || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {!recentResults.length && (
                <p className="p-8 text-center text-xs text-white/30">
                  No published results found.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
