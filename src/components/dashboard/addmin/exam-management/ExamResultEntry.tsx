'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Check, Loader2, UserX } from 'lucide-react';
import Swal from 'sweetalert2';

import axiosSecure from '@/lib/axiosSecure';
import { EligibleStudent, Exam, ExamResult } from './exam.types';

interface Props {
  exam: Exam | null;
  open: boolean;
  onClose: () => void;
}

export default function ExamResultEntry({
  exam,
  open,
  onClose,
}: Props) {
  const [students, setStudents] = useState<EligibleStudent[]>([]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [absent, setAbsent] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /**
   * Load eligible students when modal opens
   */
useEffect(() => {
  if (!open || !exam) return;

  const loadData = async () => {
    setLoading(true);

    try {
      const [studentsResponse, resultsResponse] =
        await Promise.all([
          axiosSecure.get(
            `/exams/${exam._id}/eligible-students`,
          ),
          axiosSecure.get(
            `/exams/${exam._id}/results`,
          ),
        ]);

      const eligibleStudents =
        studentsResponse.data?.data || [];

      const existingResults =
        resultsResponse.data?.data || [];

      setStudents(eligibleStudents);

      const marksMap: Record<string, string> = {};
      const absentMap: Record<string, boolean> = {};

      existingResults.forEach((result: ExamResult) => {
        const studentId = result.student?._id;

        if (!studentId) return;

        absentMap[studentId] = result.isAbsent;

        if (!result.isAbsent) {
          marksMap[studentId] = String(
            result.marks ?? '',
          );
        }
      });

      setMarks(marksMap);
      setAbsent(absentMap);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: `${error}`,
        text: 'Failed to load eligible students or existing results.',
        background: '#0b1326',
        color: '#fff',
      });
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [open, exam?._id]);



  /**
   * Total number of students
   */
  const count = students.length;

  /**
   * Number of students whose result is completed
   */
  const completed = useMemo(() => {
    return students.filter((student) => {
      const isAbsent = absent[student._id];
      const hasMarks =
        marks[student._id] !== undefined &&
        marks[student._id] !== '';

      return isAbsent || hasMarks;
    }).length;
  }, [students, marks, absent]);

  /**
   * Save all exam results
   */
 const save = async () => {
  if (!exam) return;

  const incomplete = students.some((student) => {
    const isAbsent = !!absent[student._id];
    const value = marks[student._id];

    return !isAbsent && (value === undefined || value === '');
  });

  if (incomplete) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete results',
      text: 'Please enter marks or mark the student as absent.',
      background: '#0b1326',
      color: '#fff',
    });

    return;
  }

const results = students
  .filter((student) => {
    const isAbsent = !!absent[student._id];
    const hasMarks =
      marks[student._id] !== undefined &&
      marks[student._id] !== '';

    return isAbsent || hasMarks;
  })
  .map((student) => ({
    studentId: student._id,
    isAbsent: !!absent[student._id],
    marks: absent[student._id]
      ? 0
      : Number(marks[student._id]),
  }));


  const invalid = results.some((result) => {
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
      title: 'Invalid marks',
      text: `Marks must be between 0 and ${exam.totalMarks}.`,
      background: '#0b1326',
      color: '#fff',
    });

    return;
  }

  setSaving(true);

  try {
    const response = await axiosSecure.post(
      '/exams/results/bulk',
      {
        examId: exam._id,
        results,
      },
    );

    await Swal.fire({
      icon: response.data?.failed ? 'warning' : 'success',
      title: 'Results saved',
      text:
        response.data?.message ||
        `${response.data?.inserted || 0} result(s) added.`,
      background: '#0b1326',
      color: '#fff',
      confirmButtonColor: '#6ffbbe',
    });

    onClose();
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Could not save results',
      text:
        error?.response?.data?.message ||
        'Please try again.',
      background: '#0b1326',
      color: '#fff',
    });
  } finally {
    setSaving(false);
  }
};


  /**
   * Don't render anything when modal is closed
   */
  if (!open || !exam) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-white/10 bg-[#0b1326] sm:max-w-4xl sm:rounded-[2rem]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0b1326]/95 px-5 py-4 backdrop-blur-xl">
          <div>
            <h3 className="text-sm font-black text-white">
              Enter Results
            </h3>

            <p className="text-[10px] text-white/30">
              {exam.title} · {completed}/{count} completed
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/50"
          >
            Close
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2
              className="animate-spin text-[#6ffbbe]"
              size={24}
            />
          </div>
        ) : (
          <>
            {/* Students Table */}
            <div className="p-4 sm:p-5">
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full min-w-[650px]">
                  <thead>
                    <tr className="bg-white/[0.03]">
                      <th className="px-4 py-3 text-left text-[9px] uppercase text-white/30">
                        Student
                      </th>

                      <th className="px-4 py-3 text-right text-[9px] uppercase text-white/30">
                        Marks / {exam.totalMarks}
                      </th>

                      <th className="px-4 py-3 text-center text-[9px] uppercase text-white/30">
                        Absent
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student) => {
                      const isAbsent = !!absent[student._id];

                      return (
                        <tr
                          key={student._id}
                          className="border-t border-white/5"
                        >
                          {/* Student Info */}
                          <td className="px-4 py-3">
                            <p className="text-xs font-bold text-white">
                              {student.name}
                            </p>

                            <p className="text-[9px] text-white/30">
                              Class {student.className}
                              {student.batch
                                ? ` · ${student.batch}`
                                : ''}
                            </p>
                          </td>

                          {/* Marks */}
                          <td className="px-4 py-3 text-right">
                            <input
                              disabled={isAbsent}
                              type="number"
                              min="0"
                              max={exam.totalMarks}
                              value={marks[student._id] ?? ''}
                              onChange={(event) => {
                                setMarks((previous) => ({
                                  ...previous,
                                  [student._id]:
                                    event.target.value,
                                }));
                              }}
                              className="h-9 w-28 rounded-lg border border-white/10 bg-white/[0.035] px-3 text-right text-xs text-white outline-none disabled:opacity-30"
                            />
                          </td>

                          {/* Absent Button */}
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setAbsent((previous) => ({
                                  ...previous,
                                  [student._id]: !previous[
                                    student._id
                                  ],
                                }));
                              }}
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border ${
                                isAbsent
                                  ? 'border-rose-400/20 bg-rose-400/10 text-rose-300'
                                  : 'border-white/10 text-white/30'
                              }`}
                            >
                              {isAbsent ? (
                                <UserX size={14} />
                              ) : (
                                <Check size={14} />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Empty State */}
                {!students.length && (
                  <div className="p-12 text-center text-xs text-white/35">
                    No eligible students found.
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-white/10 p-4">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-xl border border-white/10 px-4 text-xs font-bold text-white/50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={save}
                disabled={saving || !students.length}
                className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] px-5 text-xs font-black text-[#0b1326] disabled:opacity-50"
              >
                {saving && (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                )}

                Save Results
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
