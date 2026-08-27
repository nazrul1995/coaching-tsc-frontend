'use client';

import React from 'react';
import { CheckCircle2, FileEdit } from 'lucide-react';
import { ExamStatus } from './exam.types';

export default function ExamStatusBadge({ status }: { status: ExamStatus }) {
  const published = status === 'published';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${published ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300' : 'border-amber-400/20 bg-amber-400/10 text-amber-300'}`}>
      {published ? <CheckCircle2 size={11} /> : <FileEdit size={11} />}
      {published ? 'Published' : 'Draft'}
    </span>
  );
}
