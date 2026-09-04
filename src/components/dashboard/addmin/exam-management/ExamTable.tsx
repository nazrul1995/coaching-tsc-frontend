'use client';

import React from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  FileSpreadsheet,
  Trash2,
} from 'lucide-react';

import { Exam } from '@/components/dashboard/addmin/exam-management';

interface ExamTableProps {
  exams: Exam[];
  onPublish: (exam: Exam) => void;
  onOpen: (exam: Exam) => void;
  onResults: (exam: Exam) => void;
  onEdit: (exam: Exam) => void;
  onDelete: (exam: Exam) => void;
}

export default function ExamTable({
  exams,
  onPublish,
  onOpen,
  onResults,
  onEdit,
  onDelete,
}: ExamTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b1326] shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-4 font-bold">
                Exam Info
              </th>
              <th scope="col" className="px-6 py-4 font-bold">
                Class & Batch
              </th>
              <th scope="col" className="px-6 py-4 font-bold">
                Marks & Date
              </th>
              <th scope="col" className="px-6 py-4 font-bold">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-right font-bold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {exams.map((exam) => {
              const isDraft = exam.status === 'draft';
              const isPublished = exam.status === 'published';

              return (
                <tr
                  key={exam._id}
                  className="group transition-colors hover:bg-white/[0.02]"
                >
                  {/* Title & Subject */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-white group-hover:text-[#6ffbbe] transition-colors">
                      {exam.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="capitalize">{exam.subject}</span>
                      <span>•</span>
                      <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-300">
                        {exam.type?.replace('_', ' ')}
                      </span>
                    </div>
                  </td>

                  {/* Class, Batch & Group */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white">
                      Class {exam.className}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {exam.batch ? `Batch ${exam.batch}` : 'All Batches'}
                      {exam.group && (
                        <span className="capitalize"> ({exam.group})</span>
                      )}
                    </div>
                  </td>

                  {/* Marks & Date */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-white">
                      {exam.totalMarks} Marks
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <Calendar size={13} className="text-slate-500" />
                      <span>
                        {exam.examDate
                          ? new Date(exam.examDate).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )
                          : 'N/A'}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {isPublished ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6ffbbe]/10 px-3 py-1 text-xs font-medium text-[#6ffbbe]">
                        <CheckCircle size={12} />
                        Published
                      </span>
                    ) : isDraft ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                        <Clock size={12} />
                        Draft
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-3 py-1 text-xs font-medium text-slate-400">
                        {exam.status}
                      </span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Publish Button (Draft Only) */}
                      {isDraft && (
                        <button
                          type="button"
                          onClick={() => onPublish(exam)}
                          title="Publish Exam"
                          className="rounded-xl border border-[#6ffbbe]/20 bg-[#6ffbbe]/10 px-3 py-1.5 text-xs font-bold text-[#6ffbbe] hover:bg-[#6ffbbe]/20 transition-colors"
                        >
                          Publish
                        </button>
                      )}

                      {/* Enter Results Button */}
                      <button
                        type="button"
                        onClick={() => onResults(exam)}
                        title="Enter / View Results"
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <FileSpreadsheet size={15} />
                      </button>

                      {/* View Workflow Panel */}
                      <button
                        type="button"
                        onClick={() => onOpen(exam)}
                        title="Workflow Overview"
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <Eye size={15} />
                      </button>

                      {/* Edit Exam */}
                      <button
                        type="button"
                        onClick={() => onEdit(exam)}
                        title="Edit Exam"
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-colors"
                      >
                        <Edit size={15} />
                      </button>

                      {/* Delete Exam */}
                      <button
                        type="button"
                        onClick={() => onDelete(exam)}
                        title="Delete Exam"
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}