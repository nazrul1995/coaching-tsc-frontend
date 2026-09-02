"use client"

import { LoadingState } from "@/components/dashboard/common";
import StudentPaymentHistory from "@/components/dashboard/common/StPaymentHistory";
import { useAuth } from "@/context/AuthContext";

const StudentPage = () => {
  const {user, isLoading} = useAuth()
  const studentId = user?._id
  if(isLoading) return <LoadingState/>
  return (
    <div>
      <StudentPaymentHistory studentId={studentId}/>
    </div>
  );
};

export default StudentPage;