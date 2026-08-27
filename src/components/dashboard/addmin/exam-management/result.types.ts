export type ResultGrade = 'A+' | 'A' | 'A-' | 'B' | 'C' | 'D' | 'F';

export interface ResultStudent {
  _id: string;
  name: string;
  photo?: string;
  className?: string;
  batch?: string;
  group?: string;
}

export interface ExamResultRecord {
  _id: string;
  exam: string | { _id: string; title?: string; type?: string; examDate?: string };
  student: ResultStudent;
  totalMarks: number;
  totalFullMarks?: number;
  percentage: number;
  grade: ResultGrade;
  isAbsent: boolean;
  remarks?: string;
  createdAt?: string;
}

export interface LeaderboardRow {
  rank: number;
  student: ResultStudent;
  totalMarks?: number;
  totalFullMarks?: number;
  percentage?: number;
  grade?: ResultGrade;
  averagePercentage?: number;
  totalExams?: number;
}
