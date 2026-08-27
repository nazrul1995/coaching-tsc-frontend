'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Loader2,
  X,
} from 'lucide-react';

import {
  ExamGroup,
  ExamType,
} from './exam.types';

interface Props {
  open: boolean;

  submitting?: boolean;

  onClose: () => void;

  onSubmit: (
    payload: Record<string, unknown>,
  ) => Promise<void> | void;
}

// ======================================================
// Initial Form
// ======================================================

const INITIAL_FORM = {
  type: 'weekly' as ExamType,

  subject: '',

  totalMarks: '100',

  examDate: '',

  className: '10',

  batchYear: '2028',

  group: 'science' as ExamGroup,

  description: '',
};

// ======================================================
// Exam Type Options
// ======================================================

const EXAM_TYPE_OPTIONS: [ExamType, string][] = [
  ['weekly', 'Weekly Tutorial'],
  ['model_test', 'Model Test'],
];

// ======================================================
// Class Options
// ======================================================

const CLASS_OPTIONS = [
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
];

// ======================================================
// Batch Year Options
// ======================================================

const BATCH_YEAR_OPTIONS = Array.from(
  { length: 8 },
  (_, index) =>
    String(2026 + index),
);

// ======================================================
// Component
// ======================================================

export default function ExamFormModal({
  open,
  submitting = false,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState(INITIAL_FORM);

  // ==================================================
  // Class 9-12 হলে batch/group দেখাবে
  // ==================================================

  const showBatchAndGroup = useMemo(() => {
    return ['9', '10', '11', '12'].includes(
      form.className,
    );
  }, [form.className]);

  // ==================================================
  // SSC / HSC
  // ==================================================

  const batchPrefix = useMemo(() => {
    if (
      form.className === '9' ||
      form.className === '10'
    ) {
      return 'SSC';
    }

    if (
      form.className === '11' ||
      form.className === '12'
    ) {
      return 'HSC';
    }

    return '';
  }, [form.className]);


  // ==================================================
  // Modal close
  // ==================================================

  if (!open) {
    return null;
  }

  // ==================================================
  // Generic field change
  // ==================================================

  const handleChange = (
    field: keyof typeof form,
    value: string,
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ==================================================
  // Class Change
  // ==================================================

const handleClassChange = (className: string) => {
  const normalizedClass = String(className);

  const isHigherClass = [
    '9',
    '10',
    '11',
    '12',
  ].includes(normalizedClass);

  let defaultBatchYear = '2028';

  if (
    normalizedClass === '11' ||
    normalizedClass === '12'
  ) {
    defaultBatchYear = '2027';
  }

  setForm((previous) => ({
    ...previous,

    // Always string
    className: normalizedClass,

    // 9-10 → SSC
    // 11-12 → HSC
    batchYear: isHigherClass
      ? defaultBatchYear
      : '',

    // 6-8 হলে group লাগবে না
    group: isHigherClass
      ? previous.group || 'science'
      : 'science',
  }));
};


  // ==================================================
  // Submit
  // ==================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    // ================================================
    // Batch তৈরি
    // ================================================

    let batch: string | undefined;

    if (showBatchAndGroup && batchPrefix) {
      batch =
        `${batchPrefix}-${form.batchYear}`;
    }

    // ================================================
    // Backend payload
    //
    // IMPORTANT:
    // title পাঠানো হচ্ছে না।
    //
    // Backend নিজে title তৈরি করবে।
    // ================================================

    const payload: Record<string, unknown> = {
      type: form.type,

      subject: form.subject.trim(),

      totalMarks: Number(
        form.totalMarks,
      ),

      examDate: form.examDate,

      // Always string
      className: String(
        form.className,
      ),

      description:
        form.description.trim() || undefined,
    };

    // ================================================
    // Batch
    // ================================================

    if (batch) {
      payload.batch = batch;
    }

    // ================================================
    // Group
    // ================================================

    if (
      showBatchAndGroup &&
      form.group
    ) {
      payload.group = form.group;
    }

    // ================================================
    // Submit
    // ================================================

    await onSubmit(payload);

    // ================================================
    // Reset
    // ================================================

    setForm(INITIAL_FORM);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-white/10 bg-[#0b1326] shadow-2xl sm:max-w-2xl sm:rounded-[2rem]">

        {/* ==================================================
            Header
        ================================================== */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.07] bg-[#0b1326]/95 px-5 py-4 backdrop-blur-xl">

          <div>
            <h3 className="text-sm font-black text-white">
              Create Exam
            </h3>

            <p className="text-[9px] text-white/30">
              Exam title will be generated automatically
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/50 hover:bg-white/5 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* ==================================================
            Form
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6"
        >

          {/* ==================================================
              Exam Type
          ================================================== */}

          <SelectField
            label="Exam Type"
            value={form.type}
            onChange={(value) =>
              handleChange(
                'type',
                value,
              )
            }
            options={EXAM_TYPE_OPTIONS}
          />

          {/* ==================================================
              Subject
          ================================================== */}

          <Field
            label="Subject"
            value={form.subject}
            onChange={(value) =>
              handleChange(
                'subject',
                value,
              )
            }
            placeholder="Mathematics"
            required
          />

          {/* ==================================================
              Total Marks
          ================================================== */}

          <Field
            label="Total Marks"
            type="number"
            min="1"
            value={form.totalMarks}
            onChange={(value) =>
              handleChange(
                'totalMarks',
                value,
              )
            }
            required
          />

          {/* ==================================================
              Exam Date
          ================================================== */}

          <Field
            label="Exam Date"
            type="date"
            value={form.examDate}
            onChange={(value) =>
              handleChange(
                'examDate',
                value,
              )
            }
            required
          />

          {/* ==================================================
              Class
          ================================================== */}

          <SelectField
            label="Class"
            value={form.className}
            onChange={handleClassChange}
            options={CLASS_OPTIONS.map(
              (className) => [
                className,
                `Class ${className}`,
              ],
            )}
          />

          {/* ==================================================
              Batch Year
          ================================================== */}

          {showBatchAndGroup && (
            <>
              <SelectField
                label={`Batch Year (${batchPrefix})`}
                value={form.batchYear}
                onChange={(value) =>
                  handleChange(
                    'batchYear',
                    value,
                  )
                }
                options={BATCH_YEAR_OPTIONS.map(
                  (year) => [
                    year,
                    `${batchPrefix}-${year}`,
                  ],
                )}
              />

              {/* ==================================================
                  Group
              ================================================== */}

              <SelectField
                label="Group"
                value={form.group}
                onChange={(value) =>
                  handleChange(
                    'group',
                    value,
                  )
                }
                options={[
                  [
                    'science',
                    'Science',
                  ],
                  [
                    'commerce',
                    'Commerce',
                  ],
                  [
                    'humanities',
                    'Humanities',
                  ],
                ]}
              />
            </>
          )}

          {/* ==================================================
              Generated Series Preview
          ================================================== */}

          {showBatchAndGroup && (
            <div className="sm:col-span-2 rounded-xl border border-[#6ffbbe]/10 bg-[#6ffbbe]/5 p-3">

              <p className="text-[9px] font-bold uppercase tracking-wider text-[#6ffbbe]/50">
                Exam Series
              </p>

              <p className="mt-1 text-xs font-bold text-white">
                {form.type === 'weekly'
                  ? 'Weekly Tutorial'
                  : 'Model Test'}
                {' · '}
                Class {form.className}
                {' · '}
                {batchPrefix}-{form.batchYear}
                {' · '}
                {form.group}
              </p>

              <p className="mt-1 text-[9px] text-white/30">
                Backend will automatically generate the
                serial number.
              </p>
            </div>
          )}

          {/* ==================================================
              Description
          ================================================== */}

          <div className="sm:col-span-2">

            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40">
              Description
            </label>

            <textarea
              rows={3}
              value={form.description}
              onChange={(event) =>
                handleChange(
                  'description',
                  event.target.value,
                )
              }
              placeholder="Optional exam description..."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-3 text-xs text-white outline-none placeholder:text-white/20 focus:border-[#adc6ff]/40"
            />
          </div>

          {/* ==================================================
              Actions
          ================================================== */}

          <div className="grid grid-cols-2 gap-2 pt-2 sm:col-span-2">

            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border border-white/10 text-xs font-bold text-white/50 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] text-xs font-black text-[#0b1326] disabled:opacity-50"
            >

              {submitting && (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              )}

              {submitting
                ? 'Creating...'
                : 'Create Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ======================================================
// Input Field
// ======================================================

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  min,
}: {
  label: string;

  value: string;

  onChange: (
    value: string,
  ) => void;

  placeholder?: string;

  type?: string;

  required?: boolean;

  min?: string;
}) {
  return (
    <div>

      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40">
        {label}
      </label>

      <input
        required={required}
        type={type}
        min={min}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] px-3.5 text-xs text-white outline-none placeholder:text-white/20 focus:border-[#adc6ff]/40"
      />
    </div>
  );
}

// ======================================================
// Select Field
// ======================================================

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;

  value: string;

  onChange: (
    value: string,
  ) => void;

  options: string[][];
}) {
  return (
    <div>

      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="h-11 w-full cursor-pointer rounded-xl border border-white/10 bg-[#0b1326] px-3 text-xs text-white outline-none focus:border-[#adc6ff]/40"
      >

        {options.map(
          ([optionValue, optionLabel]) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
            </option>
          ),
        )}

      </select>
    </div>
  );
}
