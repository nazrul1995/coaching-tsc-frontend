export interface IAdminOverview {
  metrics: {
    totalStudents: number;
    totalExams: number;
    publishedExams: number;
    totalRevenue: number;
    totalOutstanding: number;
  };
  financialSummary: {
    paidCycles: number;
    unpaidCycles: number;
    overdueCycles: number;
    partialCycles: number;
  };
  recentExamResults: Array<{
    examId: string;
    title: string;
    className: string;
    examDate: string;
    totalParticipants: number;
    passedParticipants: number;
    averagePercentage: number;
  }>;
}

export interface IStudentOverview {
  studentProfile: {
    id: string;
    name: string;
    email: string;
    className: string;
    batch?: string;
    group?: string;
    photo?: string;
  };
  academicOverview: {
    totalExamsTaken: number;
    averagePercentage: number;
    highestPercentage: number;
    rankInClass: number | null;
    rankInCoaching: number | null;
  };
  financialOverview: {
    totalPaid: number;
    totalDue: number;
    unpaidCyclesCount: number;
    overdueCyclesCount: number;
  };
  recentResults: Array<{
    resultId: string;
    examTitle: string;
    subject: string;
    marks: number;
    totalMarks: number;
    percentage: number;
    grade: string;
    isAbsent: boolean;
    examDate: string;
  }>;
}