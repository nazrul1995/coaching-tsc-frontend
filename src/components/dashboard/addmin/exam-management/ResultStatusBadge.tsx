'use client';
import React from 'react';
import { CheckCircle2, UserX } from 'lucide-react';
import { ResultGrade } from './result.types';

export default function ResultStatusBadge({ grade, isAbsent }: { grade?: ResultGrade; isAbsent?: boolean }) {
  if (isAbsent) return <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/20 bg-rose-400/10 px-2.5 py-1 text-[10px] font-bold uppercase text-rose-300"><UserX size={11}/> Absent</span>;
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-[#6ffbbe]/20 bg-[#6ffbbe]/10 px-2.5 py-1 text-[10px] font-bold uppercase text-[#6ffbbe]"><CheckCircle2 size={11}/> {grade || '—'}</span>;
}
