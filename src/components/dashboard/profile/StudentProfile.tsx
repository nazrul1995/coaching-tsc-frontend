'use client';

import { useAuth } from "@/context/AuthContext";
import axiosSecure from "@/lib/axiosSecure";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Mail,
  Phone,
  GraduationCap,
  Users,
  Calendar,
  Edit
} from "lucide-react";

import { Button } from "@/components/ui/button";

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
};

const StudentProfile = () => {
  const { user, isLoading } = useAuth();

  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await axiosSecure.get(`/students/email/${user?.email}`);
        setStudent(res.data.student);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email && !isLoading) {
      fetchStudentData();
    }
  }, [user?.email, isLoading]);

  // Loading
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-white/70 text-lg">Loading your profile...</div>
      </div>
    );
  }

  // No profile
  if (!student) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🎓</div>
        <h2 className="text-2xl font-bold text-white mb-2">No Profile Found</h2>
        <p className="text-white/60 mb-8">
          You haven&apos;t created a student profile yet.
        </p>
        <Link href="/dashboard/student-form">
          <Button className="bg-[#adc6ff] text-[#0b1326] hover:bg-[#adc6ff]/90">
            Create Student Profile
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">

      {/* HERO */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">

        {/* Photo */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-3xl overflow-hidden border-4 border-[#adc6ff]/30">
          {student.photo ? (
            <Image src={student.photo} alt={student.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-[#adc6ff]/20 to-[#6ffbbe]/20">
              {student.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold text-white mb-3">
            {student.name}
          </h1>

          <span className="px-4 py-1 bg-[#adc6ff]/10 text-[#adc6ff] text-sm rounded-xl">
            STUDENT
          </span>

          {/* Contact */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/70 text-sm mt-4">
            <div className="flex items-center gap-2">
              <Mail size={18} />
              {student.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone size={18} />
              {student.phone}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 flex justify-center md:justify-start gap-8 text-sm">
            <div>
              <div className="text-[#6ffbbe] font-semibold">
                {student.className}
              </div>
              <div className="text-white/50 text-xs">Class</div>
            </div>

            {student.group && (
              <div>
                <div className="text-[#adc6ff] font-semibold">
                  {student.group}
                </div>
                <div className="text-white/50 text-xs">Group</div>
              </div>
            )}

            {student.batch && (
              <div>
                <div className="text-white font-semibold">
                  {student.batch}
                </div>
                <div className="text-white/50 text-xs">Batch</div>
              </div>
            )}
          </div>
        </div>

        {/* Edit */}
        <Link href="/dashboard/profile-edit">
          <Button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-6 rounded-3xl">
            <Edit size={20} />
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Academic Info */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="text-[#6ffbbe]" />
            <h3 className="text-2xl font-bold text-white">
              Academic Information
            </h3>
          </div>

          <div className="space-y-6 text-white">
            <div>
              <div className="text-white/50 text-sm">Class</div>
              <div className="text-lg">{student.className}</div>
            </div>

            {student.group && (
              <div>
                <div className="text-white/50 text-sm">Group</div>
                <div className="text-lg">{student.group}</div>
              </div>
            )}

            {student.batch && (
              <div>
                <div className="text-white/50 text-sm">Batch</div>
                <div className="text-lg">{student.batch}</div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Info */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="text-[#adc6ff]" />
            <h3 className="text-2xl font-bold text-white">
              Activity Info
            </h3>
          </div>

          <div className="space-y-6 text-white">
            <div>
              <div className="text-white/50 text-sm">Joined</div>
              <div className="text-lg">
                {new Date(student.createdAt || "").toLocaleDateString()}
              </div>
            </div>

            <div>
              <div className="text-white/50 text-sm">Last Updated</div>
              <div className="text-lg">
                {new Date(student.updatedAt || "").toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-white/40 text-xs">
        Last updated:{" "}
        {new Date(student.updatedAt || "").toLocaleDateString()}
      </div>
    </div>
  );
};

export default StudentProfile;