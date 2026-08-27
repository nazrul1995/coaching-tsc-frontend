import React from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  CreditCard,
  GraduationCap,
  Mail,
  Phone,
  School,
  User,
  Users,
  XCircle,
} from 'lucide-react';

interface Student {
  name: string;
  email: string;
  phone: string;
  guradianName: string;
  className: string;
  batch?: string;
  group?: string;
  institution: string;
  admissionDate: string;
  monthlyFee?: number;
}

interface AcademicSummary {
  averagePercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
  totalObtainedMarks: number;
}

interface StudentInfoProps {
  student: Student;
  academicSummary: AcademicSummary;
}

export default function StudentInfo({
  student,
  academicSummary,
}: StudentInfoProps) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <InfoSection
        title="Personal Information"
        icon={User}
      >
        <InfoRow
          icon={User}
          label="Full Name"
          value={student.name}
        />

        <InfoRow
          icon={Mail}
          label="Email"
          value={student.email}
        />

        <InfoRow
          icon={Phone}
          label="Phone"
          value={student.phone}
        />

        <InfoRow
          icon={Users}
          label="Guardian"
          value={student.guradianName}
        />
      </InfoSection>

      <InfoSection
        title="Academic Information"
        icon={GraduationCap}
      >
        <InfoRow
          icon={GraduationCap}
          label="Class"
          value={`Class ${student.className}`}
        />

        <InfoRow
          icon={BookOpen}
          label="Batch"
          value={student.batch || 'Not assigned'}
        />

        <InfoRow
          icon={Users}
          label="Group"
          value={student.group || 'General'}
        />

        <InfoRow
          icon={School}
          label="Institution"
          value={student.institution}
        />
      </InfoSection>

      <InfoSection
        title="Admission Information"
        icon={CalendarDays}
      >
        <InfoRow
          icon={CalendarDays}
          label="Admission Date"
          value={formatDate(student.admissionDate)}
        />

        <InfoRow
          icon={CreditCard}
          label="Monthly Fee"
          value={`৳${student.monthlyFee || 0}`}
        />
      </InfoSection>

      <InfoSection
        title="Academic Snapshot"
        icon={BarChart3}
      >
        <InfoRow
          icon={BarChart3}
          label="Average Percentage"
          value={`${academicSummary.averagePercentage}%`}
        />

        <InfoRow
          icon={Award}
          label="Highest Percentage"
          value={`${academicSummary.highestPercentage}%`}
        />

        <InfoRow
          icon={XCircle}
          label="Lowest Percentage"
          value={`${academicSummary.lowestPercentage}%`}
        />

        <InfoRow
          icon={Award}
          label="Total Obtained Marks"
          value={String(
            academicSummary.totalObtainedMarks
          )}
        />
      </InfoSection>
    </div>
  );
}

function InfoSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-[#adc6ff]/10 p-2.5 text-[#adc6ff]">
          <Icon className="h-4 w-4" />
        </div>

        <h2 className="text-sm font-black text-white">
          {title}
        </h2>
      </div>

      <div className="space-y-1">
        {children}
      </div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl px-3 py-3 transition hover:bg-white/[0.025]">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 shrink-0 text-white/25" />

        <span className="text-xs text-white/40">
          {label}
        </span>
      </div>

      <span className="max-w-[55%] truncate text-right text-xs font-semibold text-white/80">
        {value}
      </span>
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return '—';

  return new Date(date).toLocaleDateString(
    'en-GB',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );
}
