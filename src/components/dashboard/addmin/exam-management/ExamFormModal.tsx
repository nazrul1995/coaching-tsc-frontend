'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Loader2, BookOpen } from 'lucide-react';
import { Exam } from '@/components/dashboard/addmin/exam-management';

interface ExamFormModalProps {
  open: boolean;
  submitting: boolean;
  initialData?: Exam | null;
  onClose: () => void;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
}

interface ExamFormInputs {
  title: string;
  type: string;
  className: string;
  subject: string;
  batch: string;
  group: string;
  totalMarks: number;
  passMarks: number;
  examDate: string;
  description?: string;
}

const defaultValues: ExamFormInputs = {
  title: '',
  type: 'weekly',
  className: '',
  subject: '',
  batch: '',
  group: 'general',
  totalMarks: 100,
  passMarks: 40,
  examDate: new Date().toISOString().split('T')[0],
  description: '',
};

export default function ExamFormModal({
  open,
  submitting,
  initialData,
  onClose,
  onSubmit,
}: ExamFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExamFormInputs>({
    defaultValues,
  });

  // Handle Form Pre-fill for Edit or Reset for Create
  useEffect(() => {
    if (open) {
      if (initialData) {
        // Format ISO Date or timestamp string to YYYY-MM-DD format for <input type="date" />
        const formattedDate = initialData.examDate
          ? new Date(initialData.examDate).toISOString().split('T')[0]
          : defaultValues.examDate;

        reset({
          title: initialData.title || '',
          type: initialData.type || 'weekly',
          className: initialData.className || '',
          subject: initialData.subject || '',
          batch: initialData.batch || '',
          group: initialData.group || 'general',
          totalMarks: initialData.totalMarks || 100,
          examDate: formattedDate,
          description: initialData.description || '',
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [open, initialData, reset]);

  if (!open) return null;

  const handleFormSubmit = async (data: ExamFormInputs) => {
    const payload = {
      ...data,
      totalMarks: Number(data.totalMarks),
      passMarks: Number(data.passMarks),
    };
    await onSubmit(payload);
  };

  const isEditMode = Boolean(initialData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1326] p-6 text-white shadow-2xl md:p-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6ffbbe]/10 text-[#6ffbbe]">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditMode ? 'Update Exam Details' : 'Create New Exam'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditMode
                  ? 'Modify exam details and save updates.'
                  : 'Fill in the details to setup a new exam.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Exam Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-6 space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Exam Title *</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              placeholder="e.g. Weekly Model Test - 01"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
            />
            {errors.title && (
              <span className="text-xs text-red-400">{errors.title.message}</span>
            )}
          </div>

          {/* Type & Subject */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">Exam Type *</label>
              <select
                {...register('type', { required: true })}
                className="w-full rounded-2xl border border-white/10 bg-[#0b1326] px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
              >
                <option value="weekly">Weekly Tutorial</option>
                <option value="monthly">Monthly Exam</option>
                <option value="model_test">Model Test</option>
                <option value="term_final">Term Final</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">Subject *</label>
              <input
                type="text"
                {...register('subject', { required: 'Subject is required' })}
                placeholder="e.g. Physics"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
              />
              {errors.subject && (
                <span className="text-xs text-red-400">{errors.subject.message}</span>
              )}
            </div>
          </div>

          {/* Class, Batch & Group */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">Class *</label>
              <input
                type="text"
                {...register('className', { required: 'Class is required' })}
                placeholder="e.g. 10"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
              />
              {errors.className && (
                <span className="text-xs text-red-400">{errors.className.message}</span>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">Batch</label>
              <input
                type="text"
                {...register('batch')}
                placeholder="e.g. 2026"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">Group</label>
              <select
                {...register('group')}
                className="w-full rounded-2xl border border-white/10 bg-[#0b1326] px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
              >
                <option value="general">General</option>
                <option value="science">Science</option>
                <option value="commerce">Business Studies</option>
                <option value="arts">Humanities</option>
              </select>
            </div>
          </div>

          {/* Total Marks, Pass Marks & Exam Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">Total Marks *</label>
              <input
                type="number"
                {...register('totalMarks', { required: true, min: 1 })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">Pass Marks *</label>
              <input
                type="number"
                {...register('passMarks', { required: true, min: 0 })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[#slate-300] text-xs font-medium">Exam Date *</label>
              <input
                type="date"
                {...register('examDate', { required: true })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Description / Instructions</label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Add exam instructions or notes..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] px-6 py-2.5 text-xs font-black text-[#0b1326] shadow-lg shadow-[#6ffbbe]/10 transition-transform active:scale-95 disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {isEditMode ? 'Update Exam' : 'Create Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}