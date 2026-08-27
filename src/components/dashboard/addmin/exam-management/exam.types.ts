export type ExamType = 'weekly' | 'model_test';
export type ExamStatus = 'draft' | 'published';
export type ExamGroup = 'science' | 'commerce' | 'arts' | 'general';

export interface Exam {
  _id: string;
  title: string;
  type: ExamType;
  subject: string;
  totalMarks: number;
  examDate: string;
  className: string;
  batch?: string;
  group?: ExamGroup;
  status: ExamStatus;
  description?: string;
}

export interface EligibleStudent {
  _id: string;
  name: string;
  photo?: string;
  className: string;
  batch?: string;
  group?: string;
}

export interface ExamResult {
  _id: string;
  exam: string;
  student: EligibleStudent;
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  isAbsent: boolean;
  status: 'draft' | 'published';
  remarks?: string;
}

export interface LeaderboardItem {
  rank: number;
  student: EligibleStudent;
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
}
