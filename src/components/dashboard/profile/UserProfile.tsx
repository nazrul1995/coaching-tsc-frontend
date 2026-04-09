"use client";

import { useAuth, User } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export const UserProfile = () => {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="bg-white/5 p-8 rounded-3xl flex gap-6 items-center">
      {/* profile info */}
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => router.push("/dashboard/apply/student")}
          className="flex-1 rounded-xl px-6 py-3 font-semibold text-black bg-gradient-to-r from-[#7aa2ff] to-[#adc6ff]"
        >
          🎓 Apply as Student
        </button>

        <button
          onClick={() => router.push("/dashboard/apply/teacher")}
          className="flex-1 rounded-xl px-6 py-3 font-semibold text-white border border-white/20 bg-white/5"
        >
          🧑‍🏫 Apply as Teacher
        </button>
      </div>
    </div>
  );
};