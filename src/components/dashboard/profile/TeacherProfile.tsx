"use client";

import { useAuth } from "@/context/AuthContext";
import axiosSecure from "@/lib/axiosSecure";
import Image from "next/image";
import { useEffect, useState } from "react";

type TeacherData = {
  name: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  subjects: string[];
  bio?: string;
  photo?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const TeacherProfile = () => {
  const { user, isLoading } = useAuth();

  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);

        const res = await axiosSecure.get(
          `/teachers/email/${user?.email}`
        );

        const raw = res.data.teacher;
        const formatted: TeacherData = {
          ...raw,
          createdAt: raw.createdAt?.$date || raw.createdAt,
          updatedAt: raw.updatedAt?.$date || raw.updatedAt,
        };

        setTeacherData(formatted);
      } catch (err) {
        console.error(err);
        setError("Failed to load teacher data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email && !isLoading) {
      fetchTeacherData();
    }
  }, [user?.email, isLoading]);

  // 🔄 Loading
  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  // ❌ Error
  if (error) {
    return <p className="text-center text-red-400 mt-10">{error}</p>;
  }

  // 🚫 No data
  if (!teacherData) {
    return <p className="text-center mt-10">No teacher data found</p>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* TOP CARD */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
        
        <Image
          src={teacherData.photo || "/default-avatar.png"}
          alt="teacher"
          width={120}
          height={120}
          className="rounded-full object-cover ring-4 ring-[#7aa2ff]/40"
          unoptimized
        />

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold">{teacherData.name}</h2>
          <p className="text-white/60">{teacherData.email}</p>

          <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
              🎓 {teacherData.qualification}
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
              📅 {teacherData.experience} years experience
            </span>
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* BIO */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-3">About</h3>
          <p className="text-white/70">
            {teacherData.bio || "No bio available"}
          </p>
        </div>

        {/* SUBJECTS */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3">Subjects</h3>
          <div className="flex flex-wrap gap-2">
            {teacherData.subjects?.length > 0 ? (
              teacherData.subjects.map((sub, i) => (
                <span key={i} className="px-3 py-1 bg-[#7aa2ff]/20 rounded-full text-sm">
                  📘 {sub}
                </span>
              ))
            ) : (
              <p className="text-white/50">No subjects listed</p>
            )}
          </div>
        </div>

        {/* CONTACT */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <div className="space-y-2 text-white/70">
            <p>📧 {teacherData.email}</p>
            <p>📞 {teacherData.phone}</p>
          </div>
        </div>

        {/* ACCOUNT */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-3">Account Info</h3>

          <div className="grid md:grid-cols-3 gap-4 text-white/70">
            <p>
              🗓 Joined:{" "}
              <span className="text-white">
                {teacherData.createdAt
                  ? new Date(teacherData.createdAt).toLocaleDateString()
                  : "--"}
              </span>
            </p>

            <p>
              🔄 Updated:{" "}
              <span className="text-white">
                {teacherData.updatedAt
                  ? new Date(teacherData.updatedAt).toLocaleDateString()
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