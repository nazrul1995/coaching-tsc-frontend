'use client'
import AdminOverview from "@/components/dashboard/addmin/AdminOverview";
import StudentHomeOverview from "@/components/dashboard/student/StudentHomeOverview";
import { useAuth } from "@/context/AuthContext";
import TeacherOverView from "./teacher/page";

export default function DashboardPage() {
  const {user} = useAuth()
  const role = user?.role;

  if (role === "admin") {
    return <AdminOverview />;
  }

  if (role === "teacher") {
    return <TeacherOverView />;
  }

  if (role === "student") {
    return <StudentHomeOverview />;
  }

  return (
    <div className="flex h-64 items-center justify-center text-white/60">
      <p>Access Denied. Please sign in with an authorized account.</p>
    </div>
  );
}