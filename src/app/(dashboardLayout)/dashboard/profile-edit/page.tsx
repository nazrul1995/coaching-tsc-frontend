'use client';
import StudentUpdate from "@/components/dashboard/profile/update/StudentUpdate";
import TeacherUpdate from "@/components/dashboard/profile/update/TeacherUpdate";
import { useAuth } from "@/context/AuthContext";

const ProfileUpdate = () => {
  const { user, isLoading } = useAuth();
  console.log(user)
  if (isLoading) {
    return (
      <div className="text-white text-center mt-20">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-red-400 text-center mt-20">
        User not found
      </div>
    );
  }
  console.log("User data in ProfilePage:", user);
  return (
    <div className="min-h-screen bg-[#0b1326] text-white p-6">
      {user?.role === "student" && <StudentUpdate />}
      {user?.role === "teacher" && <TeacherUpdate/>}
    </div>
  );
};

export default ProfileUpdate;