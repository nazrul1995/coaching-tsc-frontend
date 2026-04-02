'use client';
import { StudentProfile } from "@/components/dashboard/profile/StudentProfile";
import { TeacherProfile } from "@/components/dashboard/profile/TeacherProfile";
import { UserProfile } from "@/components/dashboard/profile/UserProfile";
import { useAuth } from "@/context/AuthContext";

const ProfilePage = () => {
  const { user, isLoading } = useAuth();

  // 🔥 Replace with API later
  const studentData = {
    name: "Abid Islam",
    email: "abid@gmail.com",
    phone: "01540170227",
    className: "10",
    batch: "SSC-2026",
    group: "science",
    photo: "https://i.ibb.co/qLGHjp13/IMG-20210828-171044.jpg",
  };

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

      {user?.role === "user" && <UserProfile user={user} />}

      {user?.role === "student" && <StudentProfile data={studentData} />}

      {user?.role === "teacher" && <TeacherProfile data={studentData} />}

    </div>
  );
};

export default ProfilePage;