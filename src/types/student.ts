export type Group = "science" | "commerce" | "arts";

export interface Student {
  _id: string;
  name: string;
  email: string;
  guradianName: string;
  phone: string;
  institution: string;
  className: string;
  batch?: string;
  group?: string;
  admissionDate: string;
  photo?: string;
  monthlyFee?: number;
}

export interface AcademicSummary {
  totalExams: number;
  participated: number;
  absent: number;
  totalObtainedMarks: number;
  averagePercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
  weeklyExamCount: number;
  modelTestCount: number;
}

export interface RankingItem {
  rank: number | null;
  totalStudents: number;
  rankedStudents: number;
  averagePercentage: number;
}

export interface Ranking {
  group: RankingItem;
  batch: RankingItem;
  class: RankingItem;
  coaching: RankingItem;
  hasRanking: boolean;
}

export interface FeeSummary {
  monthlyFee: number;
  totalFeeAmount: number;
  totalPaidAmount: number;
  totalOutstanding: number;
  paidCycles: number;
  partialCycles: number;
  overdueCycles: number;
  unpaidCycles: number;
}

export interface ExamInfo {
  _id: string;
  title: string;
  type: string;
  totalMarks: number;
  examDate: string;
  className: string;
  batch?: string;
  group?: string;
}

export interface Result {
  _id: string;
  exam: ExamInfo;
  student: string;
  subjectResults: unknown[];
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  isAbsent: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeeHistory {
  _id: string;
  student: string;
  cycleStartDate: string;
  cycleEndDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentDetailsResponse {
  student: Student;
  academicSummary: AcademicSummary;
  ranking: Ranking;
  feeSummary: FeeSummary;
  results: Result[];
  feeHistory: FeeHistory[];
}

export type StudentProfileTab =
  | 'overview'
  | 'results'
  | 'fees'
  | 'info';

