import React from 'react';
import {
  Award,
  BarChart3,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import { DashboardStatCard } from '../../common';


interface AcademicSummary {
  totalExams: number;
  participated: number;
  absent: number;
  totalObtainedMarks: number;
  averagePercentage: number;
  highestPercentage: number;
}

interface StudentAcademicStatsProps {
  academicSummary: AcademicSummary;
}

export default function StudentAcademicStats({
  academicSummary,
}: StudentAcademicStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardStatCard
        title="Total Exams"
        value={academicSummary.totalExams}
        subtitle={`${academicSummary.participated} participated`}
        icon={GraduationCap}
        accent="blue"
      />

      <DashboardStatCard
        title="Average Score"
        value={`${academicSummary.averagePercentage}%`}
        subtitle={`Best ${academicSummary.highestPercentage}%`}
        icon={BarChart3}
        accent="green"
      />

      <DashboardStatCard
        title="Total Marks"
        value={academicSummary.totalObtainedMarks}
        subtitle="Obtained marks"
        icon={Award}
        accent="amber"
      />

      <DashboardStatCard
        title="Attendance"
        value={`${academicSummary.participated}/${academicSummary.totalExams}`}
        subtitle={`${academicSummary.absent} absent`}
        icon={CheckCircle2}
        accent="purple"
      />
    </div>
  );
}
