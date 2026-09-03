"use client"

import { LoadingState } from "@/components/dashboard/common";
import StudentPaymentHistory from "@/components/dashboard/common/StPaymentHistory";
import { useAuth } from "@/context/AuthContext";

const StudentPage = () => {
  const {user} = useAuth()
  const id = user?._id
 if (!id) {
    return <LoadingState message="Loading student information..." />;
  } 
  return (
    <div>
      <StudentPaymentHistory studentId={id}/>
    </div>
  );
};

export default StudentPage;