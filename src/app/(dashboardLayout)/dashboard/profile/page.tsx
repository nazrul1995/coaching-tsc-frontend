'use client';
import { StudentProfile } from "@/components/dashboard/profile/StudentProfile";
import TeacherProfile from "@/components/dashboard/profile/TeacherProfile";
import { UserProfile } from "@/components/dashboard/profile/UserProfile";
import { useAuth } from "@/context/AuthContext";

const ProfilePage = () => {
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

      {user?.role === "user" && <UserProfile />}

      {user?.role === "student" && <StudentProfile />}

      {user?.role === "teacher" && <TeacherProfile />}

    </div>
  );
};

export default ProfilePage;