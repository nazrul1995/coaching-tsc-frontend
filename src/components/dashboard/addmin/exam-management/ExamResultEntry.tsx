'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Check, Loader2, Search, UserX, AlertCircle, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { AxiosError } from 'axios';

import axiosSecure from '@/lib/axiosSecure';
import { EligibleStudent, Exam, ExamResult } from './exam.types';

interface Props {
  exam: Exam | null;
  open: boolean;
  onClose: () => void;
}

export default function ExamResultEntry({ exam, open, onClose }: Props) {
  const [students, setStudents] = useState<EligibleStudent[]>([]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [absent, setAbsent] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /**
   * Fetch eligible students and existing results on open
   */
  useEffect(() => {
    if (!open || !exam) return;

    const loadData = async () => {
      setLoading(true);
      setSearchQuery('');

      try {
        const [studentsResponse, resultsResponse] = await Promise.all([
          axiosSecure.get(`/exams/${exam._id}/eligible-students`),
          axiosSecure.get(`/exams/${exam._id}/results`),
        ]);

        const eligibleStudents: EligibleStudent[] =
          studentsResponse.data?.data || [];
        const existingResults: ExamResult[] =
          resultsResponse.data?.data || [];

        setStudents(eligibleStudents);

        const marksMap: Record<string, string> = {};
        const absentMap: Record<string, boolean> = {};

        existingResults.forEach((result) => {
          const studentId = result.student?._id;
          if (!studentId) return;

          absentMap[studentId] = Boolean(result.isAbsent);

          if (!result.isAbsent) {
            marksMap[studentId] =
              result.marks !== undefined && result.marks !== null
                ? String(result.marks)
                : '';
          }
        });

        setMarks(marksMap);
        setAbsent(absentMap);
      } catch (error) {
        const message =
          error instanceof AxiosError
            ? error.response?.data?.message
            : error instanceof Error
            ? error.message
            : 'Failed to load eligible students or existing results.';

        Swal.fire({
          icon: 'error',
          title: 'Error Loading Data',
          text: message,
          background: '#0b1326',
          color: '#fff',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [open, exam]);

  /**
   * Filtered student roster (including Roll & Student ID)
   */
 const filteredStudents = useMemo(() => {
  if (!searchQuery.trim()) return students;
  const query = searchQuery.toLowerCase();
  return students.filter(
    (s) =>
      s.name.toLowerCase().includes(query) ||
      s.className?.toLowerCase().includes(query) ||
      s.batch?.toLowerCase().includes(query) ||
      s.roll?.toString().includes(query) ||
      s.studentId?.toString().toLowerCase().includes(query)
  );
}, [students, searchQuery]);

  const count = students.length;

  /**
   * Count completed entries across entire roster
   */
  const completed = useMemo(() => {
    return students.filter((student) => {
      const isAbsent = absent[student._id];
      const hasMarks =
        marks[student._id] !== undefined && marks[student._id] !== '';

      return isAbsent || hasMarks;
    }).length;
  }, [students, marks, absent]);

  /**
   * Refactored Toggle Absent State without nested state updater callbacks
   */
  const handleToggleAbsent = (studentId: string) => {
    const isCurrentlyAbsent = Boolean(absent[studentId]);
    const nextAbsentState = !isCurrentlyAbsent;

    setAbsent((prev) => ({ ...prev, [studentId]: nextAbsentState }));

    if (nextAbsentState) {
      setMarks((prevMarks) => {
        const updated = { ...prevMarks };
        delete updated[studentId];
        return updated;
      });
    }
  };

  /**
   * Mark all remaining unentered students as absent
   */
  const handleMarkUnenteredAsAbsent = () => {
    setAbsent((prev) => {
      const nextAbsent = { ...prev };
      students.forEach((student) => {
        const hasMarks =
          marks[student._id] !== undefined && marks[student._id] !== '';
        if (!hasMarks) {
          nextAbsent[student._id] = true;
        }
      });
      return nextAbsent;
    });
  };

  /**
   * Handle Enter key navigation across filtered inputs
   */
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextInput = document.getElementById(
        `mark-input-${currentIndex + 1}`
      );
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  /**
   * Bulk Save Results
   */
  const save = async () => {
    if (!exam) return;

    const incomplete = students.some((student) => {
      const isAbsent = Boolean(absent[student._id]);
      const value = marks[student._id];

      return !isAbsent && (value === undefined || value === '');
    });

    if (incomplete) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Results',
        text: 'Please enter marks or set absent status for all eligible students.',
        background: '#0b1326',
        color: '#fff',
      });
      return;
    }

    const resultsPayload = students.map((student) => {
      const isAbsent = Boolean(absent[student._id]);
      return {
        studentId: student._id,
        isAbsent,
        marks: isAbsent ? 0 : Number(marks[student._id]),
      };
    });

    const invalid = resultsPayload.some((result) => {
      if (result.isAbsent) return false;
      return (
        !Number.isFinite(result.marks) ||
        result.marks < 0 ||
        result.marks > exam.totalMarks
      );
    });

    if (invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Marks',
        text: `Marks must be valid numbers between 0 and ${exam.totalMarks}.`,
        background: '#0b1326',
        color: '#fff',
      });
      return;
    }

    setSaving(true);

    try {
      const response = await axiosSecure.post('/exams/results/bulk', {
        examId: exam._id,
        results: resultsPayload,
      });

      await Swal.fire({
        icon: response.data?.failed ? 'warning' : 'success',
        title: 'Results Saved',
        text:
          response.data?.message ||
          `${resultsPayload.length} result(s) processed successfully.`,
        background: '#0b1326',
        color: '#fff',
        confirmButtonColor: '#6ffbbe',
      });

      onClose();
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : 'Could not save exam results. Please try again.';

      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: message,
        background: '#0b1326',
        color: '#fff',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!open || !exam) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/80 backdrop-blur-md sm:items-center sm:p-4 animate-in fade-in duration-200">
      <div className="flex max-h-[95vh] h-full sm:h-auto w-full flex-col overflow-hidden rounded-t-[2rem] border border-white/10 bg-[#0b1326] sm:max-w-4xl sm:rounded-[2rem] shadow-2xl">
        {/* Mobile Grab Bar Indicator */}
        <div className="flex w-full items-center justify-center pt-2 pb-1 sm:hidden">
          <div className="h-1 w-12 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 bg-[#0b1326]/95 px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0 flex-1 pr-3">
            <h3 className="text-sm font-black text-white sm:text-base truncate">
              Enter Results
            </h3>
            <p className="text-[11px] text-white/50 truncate">
              {exam.title} · <span className="text-[#6ffbbe] font-bold">{completed}</span>/{count} completed
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/60 hover:bg-white/5 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Toolbar (Search & Actions) */}
        {!loading && count > 0 && (
          <div className="flex flex-col gap-2.5 border-b border-white/5 bg-white/[0.015] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={15} />
              <input
                type="text"
                placeholder="Search name, roll, class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 text-xs text-white outline-none placeholder:text-white/30 focus:border-[#6ffbbe]/50"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              {searchQuery && (
                <span className="text-[11px] text-white/40">
                  Found: {filteredStudents.length}
                </span>
              )}
              <button
                type="button"
                onClick={handleMarkUnenteredAsAbsent}
                className="text-[11px] font-semibold text-rose-300 hover:text-rose-200 active:scale-95 transition"
              >
                Mark remaining as Absent
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        {loading ? (
          <div className="flex min-h-[320px] flex-1 items-center justify-center">
            <Loader2 className="animate-spin text-[#6ffbbe]" size={32} />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* MOBILE CARD VIEW (screens < sm) */}
              <div className="grid grid-cols-1 gap-3 sm:hidden">
                {filteredStudents.map((student, index) => {
                  const isAbsent = Boolean(absent[student._id]);
                  const currentMark = marks[student._id] ?? '';
                  const isOutOfBounds =
                    currentMark !== '' &&
                    (Number(currentMark) < 0 || Number(currentMark) > exam.totalMarks);

                  return (
                    <div
                      key={student._id}
                      className={`flex flex-col gap-3 rounded-xl border p-3.5 transition ${
                        isAbsent
                          ? 'border-rose-500/20 bg-rose-500/[0.03]'
                          : 'border-white/10 bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-white">{student.name}</p>
                          <p className="text-[11px] text-white/40 mt-0.5">
                            Class {student.className}
                            {student.batch ? ` · ${student.batch}` : ''}
                          </p>
                        </div>
                        <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-mono text-white/50">
                          #{index + 1}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/5">
                        {/* Toggle Absent Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleAbsent(student._id)}
                          className={`flex h-11 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition ${
                            isAbsent
                              ? 'border-rose-400/30 bg-rose-400/15 text-rose-300'
                              : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {isAbsent ? <UserX size={16} /> : <Check size={16} />}
                          <span>{isAbsent ? 'Absent' : 'Present'}</span>
                        </button>

                        {/* Marks Input */}
                        <div className="relative flex items-center justify-end">
                          {isOutOfBounds && (
                            <AlertCircle
                              size={15}
                              className="absolute left-2.5 text-rose-400 animate-pulse pointer-events-none"
                            />
                          )}
                          <input
                            id={`mark-input-mobile-${index}`}
                            disabled={isAbsent}
                            type="number"
                            inputMode="decimal"
                            min="0"
                            max={exam.totalMarks}
                            value={currentMark}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMarks((prev) => ({
                                ...prev,
                                [student._id]: val,
                              }));
                            }}
                            placeholder={isAbsent ? 'ABS' : `0 / ${exam.totalMarks}`}
                            className={`h-11 w-32 rounded-xl border px-3 text-right text-xs font-medium text-white outline-none transition disabled:opacity-30 ${
                              isOutOfBounds
                                ? 'border-rose-500 bg-rose-500/10 pr-3 pl-8'
                                : 'border-white/10 bg-white/[0.04] focus:border-[#6ffbbe]/50'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP TABLE VIEW (screens >= sm) */}
              <div className="hidden overflow-hidden rounded-2xl border border-white/10 sm:block">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/[0.03]">
                      <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-white/40">
                        Student
                      </th>
                      <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider text-white/40">
                        Marks / {exam.totalMarks}
                      </th>
                      <th className="px-4 py-3 text-center text-[10px] uppercase tracking-wider text-white/40">
                        Absent
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/5">
                    {filteredStudents.map((student, index) => {
                      const isAbsent = Boolean(absent[student._id]);
                      const currentMark = marks[student._id] ?? '';
                      const isOutOfBounds =
                        currentMark !== '' &&
                        (Number(currentMark) < 0 ||
                          Number(currentMark) > exam.totalMarks);

                      return (
                        <tr
                          key={student._id}
                          className="transition hover:bg-white/[0.02]"
                        >
                          <td className="px-4 py-3">
                            <p className="text-xs font-bold text-white">
                              {student.name}
                            </p>
                            <p className="text-[10px] text-white/40">
                              Class {student.className}
                              {student.batch ? ` · ${student.batch}` : ''}
                            </p>
                          </td>

                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex items-center justify-end gap-2">
                              {isOutOfBounds && (
                                <AlertCircle
                                  size={14}
                                  className="text-rose-400 animate-pulse"
                                />
                              )}
                              <input
                                id={`mark-input-${index}`}
                                disabled={isAbsent}
                                type="number"
                                inputMode="decimal"
                                min="0"
                                max={exam.totalMarks}
                                value={currentMark}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setMarks((prev) => ({
                                    ...prev,
                                    [student._id]: val,
                                  }));
                                }}
                                placeholder={isAbsent ? 'ABS' : '0'}
                                className={`h-9 w-28 rounded-lg border px-3 text-right text-xs text-white outline-none transition disabled:opacity-30 ${
                                  isOutOfBounds
                                    ? 'border-rose-500/50 bg-rose-500/10'
                                    : 'border-white/10 bg-white/[0.035] focus:border-[#6ffbbe]/50'
                                }`}
                              />
                            </div>
                          </td>

                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleAbsent(student._id)}
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                                isAbsent
                                  ? 'border-rose-400/30 bg-rose-400/15 text-rose-300'
                                  : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white'
                              }`}
                            >
                              {isAbsent ? (
                                <UserX size={15} />
                              ) : (
                                <Check size={15} />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredStudents.length === 0 && (
                <div className="p-12 text-center text-xs text-white/40">
                  {students.length === 0
                    ? 'No eligible students found for this exam.'
                    : 'No students matching your search criteria.'}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-white/10 bg-[#0b1326]/95 p-4 sm:px-6">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-xl border border-white/10 px-4 text-xs font-bold text-white/60 hover:bg-white/5 transition sm:h-10"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={save}
                disabled={saving || !students.length}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] px-5 text-xs font-black text-[#0b1326] transition hover:opacity-90 active:scale-98 disabled:opacity-50 sm:flex-none sm:h-10"
              >
                {saving && <Loader2 size={15} className="animate-spin" />}
                <span>Save Results</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}