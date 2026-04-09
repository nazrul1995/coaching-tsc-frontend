"use client";

import { useAuth } from "@/context/AuthContext";
import axiosSecure from "@/lib/axiosSecure";
import Image from "next/image";
import { useEffect, useState } from "react";

type StudentData = {
  name: string;
  email: string;
  phone: string;
  className: string;
  batch?: string;
  group?: string;
  photo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const StudentProfile = () => {
  const { user, isLoading } = useAuth();

  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(
          `/students/email/${user?.email}`
        );

        const data = res.data as { student: StudentData };
        setStudentData(data.student);
      } catch (err) {
        console.error(err);
        setError("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email && !isLoading) {
      fetchStudentData();
    }
  }, [user?.email, isLoading]);

  // 🔄 Loading state
  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  // ❌ Error state
  if (error) {
    return <p className="text-center text-red-400 mt-10">{error}</p>;
  }

  // 🚫 No data
  if (!studentData) {
    return <p className="text-center mt-10">No student data found</p>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* TOP PROFILE CARD */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-lg flex flex-col md:flex-row gap-8 items-center md:items-start">
      
        {/* PROFILE IMAGE */}
        <div className="relative">
          <Image
            src={studentData.photo || "/default-avatar.png"}
            alt="student"
            width={130}
            height={130}
            className="rounded-full ring-4 ring-[#7aa2ff]/40 object-cover"
            unoptimized
          />

          <button className="absolute bottom-0 right-0 bg-[#7aa2ff] text-black px-3 py-1 text-xs rounded-full shadow hover:scale-105">
            Edit
          </button>
        </div>

        {/* BASIC INFO */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold">{studentData.name}</h2>
          <p className="text-white/60">{studentData.email}</p>

          <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
              🎓 Class {studentData.className}
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm capitalize">
              📚 {studentData.group}
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
              🏫 {studentData.batch}
            </span>
          </div>

          <button className="mt-5 px-6 py-2 rounded-xl bg-gradient-to-r from-[#7aa2ff] to-[#adc6ff] text-black font-semibold hover:scale-105 transition">
            Edit Profile
          </button>
        </div>
      </div>

      {/* DETAILS GRID */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* PERSONAL INFO */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Personal Info</h3>
          <div className="space-y-2 text-white/70">
            <p>📞 Phone: <span className="text-white">{studentData.phone || "--"}</span></p>
            <p>🎂 Age: <span className="text-white">--</span></p>
            <p>🏠 Address: <span className="text-white">--</span></p>
          </div>
        </div>

        {/* ACADEMIC INFO */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Academic Info</h3>
          <div className="space-y-2 text-white/70">
            <p>📘 Class: <span className="text-white">{studentData.className}</span></p>
            <p>🏫 Batch: <span className="text-white">{studentData.batch}</span></p>
            <p>📚 Group: <span className="text-white capitalize">{studentData.group}</span></p>
          </div>
        </div>

        {/* ACCOUNT INFO */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Account Info</h3>

          <div className="grid md:grid-cols-3 gap-4 text-white/70">
            <p>
              🗓 Joined:{" "}
              <span className="text-white">
                {studentData.createdAt
                  ? new Date(studentData.createdAt).toLocaleDateString()
                  : "--"}
              </span>
            </p>

            <p>
              🔄 Updated:{" "}
              <span className="text-white">
                {studentData.updatedAt
                  ? new Date(studentData.updatedAt).toLocaleDateString()
                  : "--"}
              </span>
            </p>

            <p>
              ✅ Status:{" "}
              <span className="text-green-400">Active</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};