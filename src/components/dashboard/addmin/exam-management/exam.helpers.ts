import { ExamStatus, ExamType } from './exam.types';

export const formatExamDate = (value?: string) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const examTypeLabel = (type: ExamType) => type === 'model_test' ? 'Model Test' : 'Weekly';
export const examStatusLabel = (status: ExamStatus) => status === 'published' ? 'Published' : 'Draft';
