import StudentProfile from "@/components/dashboard/student/student-profile/StudentProfile";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudentProfilePage({
  params,
}: PageProps) {
  const { id:studentId } = await params;

  return (
    <StudentProfile studentId={studentId} />
  );
}