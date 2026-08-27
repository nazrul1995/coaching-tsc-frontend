import { ResultGrade } from './result.types';

export const formatPercentage = (value?: number) => `${Number(value || 0).toFixed(2)}%`;

export const gradeTone = (grade?: ResultGrade) => {
  if (grade === 'A+' || grade === 'A') return 'green';
  if (grade === 'A-' || grade === 'B') return 'blue';
  if (grade === 'C' || grade === 'D') return 'amber';
  return 'rose';
};

export const getExamId = (exam: string | { _id: string }) =>
  typeof exam === 'string' ? exam : exam._id;
