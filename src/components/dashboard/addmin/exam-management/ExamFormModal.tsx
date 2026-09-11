'use client';

import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  X,
  Loader2,
  BookOpen,
  GraduationCap,
  Users,
  Hash,
} from 'lucide-react';

import { Exam } from '@/components/dashboard/addmin/exam-management';

interface ExamFormModalProps {
  open: boolean;
  submitting: boolean;
  initialData?: Exam | null;
  onClose: () => void;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
}

interface ExamFormInputs {
  type: string;
  className: string;
  subject: string;
  batch: string;
  group: string;
  isGeneral: boolean;
  tutorialNumber: number;
  totalMarks: number;
  passMarks: number;
  examDate: string;
  description?: string;
}

const defaultValues: ExamFormInputs = {
  type: 'weekly',
  className: '',
  subject: '',
  batch: '',
  group: 'general',
  isGeneral: true,
  tutorialNumber: 1,
  totalMarks: 100,
  passMarks: 40,
  examDate: new Date().toISOString().split('T')[0],
  description: '',
};

const GROUP_OPTIONS = [
  {
    value: 'science',
    label: 'Science',
  },
  {
    value: 'commerce',
    label: 'Business Studies',
  },
  {
    value: 'arts',
    label: 'Humanities',
  },
];

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
    control,
    formState: { errors },
  } = useForm<ExamFormInputs>({
    defaultValues,
  });

  // -----------------------------------------
  // Watch Class & General Subject
  // -----------------------------------------

  const selectedClass = useWatch({
    control,
    name: 'className',
  });

  const isGeneral = useWatch({
    control,
    name: 'isGeneral',
  });

  // -----------------------------------------
  // Class 9-12?
  // -----------------------------------------

  const isHigherClass = ['9', '10', '11', '12'].includes(
    selectedClass
  );

  // -----------------------------------------
  // Reset / Edit Form
  // -----------------------------------------

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      const formattedDate = initialData.examDate
        ? new Date(initialData.examDate).toISOString().split('T')[0]
        : defaultValues.examDate;

      reset({
        type: initialData.type || 'weekly',

        className: initialData.className || '',

        subject: initialData.subject || '',

        batch:
          initialData.batch && ['9', '10', '11', '12'].includes(initialData.className)
            ? initialData.batch
            : '',

        group: initialData.group || 'general',

        isGeneral:
          typeof initialData.isGeneral === 'boolean'
            ? initialData.isGeneral
            : true,

        tutorialNumber:
          initialData.tutorialNumber || 1,

        totalMarks:
          initialData.totalMarks || 100,

        passMarks:
          initialData.passMarks || 40,
 
        examDate: formattedDate,

        description:
          initialData.description || '',
      });
    } else {
      reset(defaultValues);
    }
  }, [open, initialData, reset]);

  // -----------------------------------------
  // If class changes to 6-8,
  // batch should not be submitted
  // -----------------------------------------

  useEffect(() => {
    if (!isHigherClass) {
      // We don't need setValue here.
      // Submit handler will remove batch.
    }
  }, [isHigherClass]);

  if (!open) return null;

  // -----------------------------------------
  // Submit
  // -----------------------------------------

  const handleFormSubmit = async (data: ExamFormInputs) => {
    const higherClass = ['9', '10', '11', '12'].includes(
      data.className
    );

    const payload = {
      type: data.type,

      className: data.className,

      subject: data.subject.trim(),

      // Batch only for Class 9-12
      batch: higherClass ? data.batch.trim() : undefined,

      // General subject doesn't need group
      group: data.isGeneral ? 'general' : data.group,

      isGeneral: data.isGeneral,

      tutorialNumber: Number(data.tutorialNumber),

      totalMarks: Number(data.totalMarks),

      passMarks: Number(data.passMarks),

      examDate: data.examDate,

      description: data.description?.trim() || undefined,
    };

    await onSubmit(payload);
  };

  const isEditMode = Boolean(initialData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1326] p-6 text-white shadow-2xl md:p-8">

        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6ffbbe]/10 text-[#6ffbbe]">
              <BookOpen size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditMode
                  ? 'Update Exam'
                  : 'Create New Exam'}
              </h2>

              <p className="text-xs text-slate-400">
                {isEditMode
                  ? 'Modify exam details and save updates.'
                  : 'Setup a new exam for students.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* -------------------------------- */}
        {/* Form */}
        {/* -------------------------------- */}

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="mt-6 space-y-5"
        >

          {/* -------------------------------- */}
          {/* Exam Type */}
          {/* -------------------------------- */}

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Exam Type *
            </label>

            <select
              {...register('type', {
                required: 'Exam type is required',
              })}
              className="w-full rounded-2xl border border-white/10 bg-[#0b1326] px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
            >
              <option value="weekly">
                Weekly Tutorial
              </option>

              <option value="model_test">
                Model Test
              </option>
            </select>
          </div>

          {/* -------------------------------- */}
          {/* Class & Tutorial Number */}
          {/* -------------------------------- */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Class */}

            <div>
              <label className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-300">
                <GraduationCap size={14} />
                Class *
              </label>

              <select
                {...register('className', {
                  required: 'Class is required',
                })}
                className="w-full rounded-2xl border border-white/10 bg-[#0b1326] px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
              >
                <option value="">
                  Select Class
                </option>

                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>

              {errors.className && (
                <span className="text-xs text-red-400">
                  {errors.className.message}
                </span>
              )}
            </div>

            {/* Tutorial Number */}

            <div>
              <label className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-300">
                <Hash size={14} />
                Tutorial Number *
              </label>

              <input
                type="number"
                min={1}
                {...register('tutorialNumber', {
                  required: 'Tutorial number is required',
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: 'Tutorial number must be at least 1',
                  },
                })}
                placeholder="e.g. 1"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
              />

              {errors.tutorialNumber && (
                <span className="text-xs text-red-400">
                  {errors.tutorialNumber.message}
                </span>
              )}
            </div>
          </div>

          {/* -------------------------------- */}
          {/* Subject */}
          {/* -------------------------------- */}

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Subject *
            </label>

            <input
              type="text"
              {...register('subject', {
                required: 'Subject is required',
                validate: (value) =>
                  value.trim().length > 0 ||
                  'Subject is required',
              })}
              placeholder="e.g. General Math"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
            />

            {errors.subject && (
              <span className="text-xs text-red-400">
                {errors.subject.message}
              </span>
            )}

            <p className="mt-1 text-[10px] text-slate-500">
              Example: General Math, English 1st Paper,
              Higher Mathematics
            </p>
          </div>

          {/* -------------------------------- */}
          {/* General Subject */}
          {/* -------------------------------- */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6ffbbe]/10 text-[#6ffbbe]">
                  <Users size={17} />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    General Subject
                  </p>

                  <p className="mt-0.5 text-[11px] leading-4 text-slate-400">
                    Enable this when all groups of the
                    selected class can take this exam.
                  </p>
                </div>

              </div>

              <label className="relative inline-flex cursor-pointer items-center">

                <input
                  type="checkbox"
                  {...register('isGeneral')}
                  className="peer sr-only"
                />

                <div className="h-6 w-11 rounded-full bg-white/10 transition peer-checked:bg-[#6ffbbe] peer-focus:outline-none" />

                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5 peer-checked:bg-[#0b1326]" />

              </label>

            </div>
          </div>

          {/* -------------------------------- */}
          {/* Batch & Group */}
          {/* -------------------------------- */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Batch */}

            {isHigherClass && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  Batch *
                </label>

                <input
                  type="text"
                  {...register('batch', {
                    required: isHigherClass
                      ? 'Batch is required for Class 9-12'
                      : false,
                  })}
                  placeholder="e.g. 2026"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
                />

                <p className="mt-1 text-[10px] text-slate-500">
                  Batch is required for Class 9-12.
                </p>

                {errors.batch && (
                  <span className="text-xs text-red-400">
                    {errors.batch.message}
                  </span>
                )}
              </div>
            )}

            {/* Group */}

            {!isGeneral && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  Group *
                </label>

                <select
                  {...register('group', {
                    required: !isGeneral
                      ? 'Group is required'
                      : false,
                  })}
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1326] px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
                >
                  <option value="">
                    Select Group
                  </option>

                  {GROUP_OPTIONS.map((group) => (
                    <option
                      key={group.value}
                      value={group.value}
                    >
                      {group.label}
                    </option>
                  ))}
                </select>

                {errors.group && (
                  <span className="text-xs text-red-400">
                    {errors.group.message}
                  </span>
                )}
              </div>
            )}

          </div>

          {/* -------------------------------- */}
          {/* Info */}
          {/* -------------------------------- */}

          <div className="rounded-2xl border border-blue-400/10 bg-blue-400/[0.04] p-3">

            <p className="text-[11px] leading-5 text-blue-200/70">

              {isGeneral ? (
                <>
                  <strong className="text-blue-200">
                    General subject:
                  </strong>{' '}
                  Students from all groups will be eligible.
                </>
              ) : (
                <>
                  <strong className="text-blue-200">
                    Group-specific subject:
                  </strong>{' '}
                  Only students from the selected group will
                  be eligible.
                </>
              )}

            </p>

          </div>

          {/* -------------------------------- */}
          {/* Marks & Date */}
          {/* -------------------------------- */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            {/* Total Marks */}

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Total Marks *
              </label>

              <input
                type="number"
                min={1}
                {...register('totalMarks', {
                  required: 'Total marks is required',
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: 'Must be greater than 0',
                  },
                })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
              />

              {errors.totalMarks && (
                <span className="text-xs text-red-400">
                  {errors.totalMarks.message}
                </span>
              )}
            </div>

            {/* Pass Marks */}

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Pass Marks *
              </label>

              <input
                type="number"
                min={0}
                {...register('passMarks', {
                  required: 'Pass marks is required',
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: 'Cannot be negative',
                  },
                })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
              />

              {errors.passMarks && (
                <span className="text-xs text-red-400">
                  {errors.passMarks.message}
                </span>
              )}
            </div>

            {/* Exam Date */}

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Exam Date *
              </label>

              <input
                type="date"
                {...register('examDate', {
                  required: 'Exam date is required',
                })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
              />

              {errors.examDate && (
                <span className="text-xs text-red-400">
                  {errors.examDate.message}
                </span>
              )}
            </div>

          </div>

          {/* -------------------------------- */}
          {/* Description */}
          {/* -------------------------------- */}

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Description / Instructions
            </label>

            <textarea
              rows={3}
              {...register('description')}
              placeholder="Add exam instructions or notes..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[#6ffbbe] focus:outline-none"
            />
          </div>

          {/* -------------------------------- */}
          {/* Auto Title Preview */}
          {/* -------------------------------- */}

          <div className="rounded-2xl border border-[#6ffbbe]/10 bg-[#6ffbbe]/[0.04] p-4">

            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6ffbbe]/70">
              Exam title
            </p>

            <p className="mt-1 text-sm font-bold text-white/80">
              Automatically generated after submission
            </p>

            <p className="mt-1 text-[10px] text-white/30">
              Example: Class 9 - Weekly Tutorial 1 -
              English 1st Paper
            </p>

          </div>

          {/* -------------------------------- */}
          {/* Actions */}
          {/* -------------------------------- */}

          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 px-5 py-2.5 text-xs font-bold text-slate-300 transition-colors hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] px-6 py-2.5 text-xs font-black text-[#0b1326] shadow-lg shadow-[#6ffbbe]/10 transition-transform active:scale-95 disabled:opacity-50"
            >
              {submitting && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              {isEditMode
                ? 'Update Exam'
                : 'Create Exam'}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
