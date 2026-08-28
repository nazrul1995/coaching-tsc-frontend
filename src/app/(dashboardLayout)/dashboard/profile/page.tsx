'use client'
import { LoadingState } from "@/components/dashboard/common";
import StudentProfile from "@/components/dashboard/student/student-profile/StudentProfile";
import { useAuth } from "@/context/AuthContext";

export default function StudentProfilePage() {
  const {user, isLoading} = useAuth() 
  
  const studentEmail = user?.email;
  
  if(isLoading) return <LoadingState/>
  return (
    <StudentProfile
      studentEmail={studentEmail}
      showBackButton={false}
    />
  );
}
