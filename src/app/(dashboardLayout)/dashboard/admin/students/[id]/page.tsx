import StudentProfile from "@/components/dashboard/student/student-profile/StudentProfile";

interface PageProps {
  searchParams: Promise<{
    studentEmail?: string;
  }>;
}

export default async function StudentProfilePage({
  searchParams,
}: PageProps) {
  const { studentEmail } = await searchParams;

  if (!studentEmail) {
    return (
      <div className="p-6 text-center text-white">
        Student email পাওয়া যায়নি
      </div>
    );
  }

  return (
    <StudentProfile studentEmail={studentEmail} />
  );
}
