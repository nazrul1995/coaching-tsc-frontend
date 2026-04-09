'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import axiosSecure from '@/lib/axiosSecure';
import {
  Briefcase,
  Calendar,
  Link as LinkIcon,
  Globe,
  Twitter,
  Facebook,
  Linkedin,
  Edit,
  Mail,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const TeacherProfile = () => {
  const { user, isLoading: authLoading } = useAuth();

  // Fetch teacher's full profile
  const { data: teacher, isLoading: teacherLoading } = useQuery({
    queryKey: ['teacher-profile', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/teachers/email/${user?.email}`);
      return res.data.teacher || res.data; // adjust if your backend wraps it differently
    },
    enabled: !!user?.email && !authLoading,
  });

  if (authLoading || teacherLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-white/70 text-lg">Loading your profile...</div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">👋</div>
        <h2 className="text-2xl font-bold text-white mb-2">No Profile Found</h2>
        <p className="text-white/60 mb-8">You haven&apos;t created a teacher profile yet.</p>
        <Link href="/dashboard/teacher-application">
          <Button className="bg-[#adc6ff] text-[#0b1326] hover:bg-[#adc6ff]/90">
            Create Teacher Profile
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Hero Profile Header */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">
        {/* Photo */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-3xl overflow-hidden border-4 border-[#adc6ff]/30 flex-shrink-0">
          {teacher.photoUrl ? (
            <Image
              src={teacher.photoUrl}
              alt={teacher.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#adc6ff]/20 to-[#6ffbbe]/20 flex items-center justify-center text-7xl">
              {teacher.name?.charAt(0).toUpperCase() || 'T'}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
            <h1 className="text-4xl font-bold text-white">{teacher.name}</h1>
            <span className="px-4 py-1 bg-[#6ffbbe]/10 text-[#6ffbbe] text-sm font-semibold rounded-2xl">
              TEACHER
            </span>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/70 text-sm mb-6">
            <div className="flex items-center gap-2">
              <Mail size={18} />
              <span>{teacher.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={18} />
              <span>{teacher.phone}</span>
            </div>
          </div>

          <p className="text-white/80 max-w-2xl mx-auto md:mx-0 leading-relaxed">
            {teacher.bio || 'No bio added yet.'}
          </p>

          {/* Quick Stats */}
          <div className="mt-8 flex justify-center md:justify-start gap-8 text-sm">
            <div>
              <div className="text-[#6ffbbe] font-semibold">{teacher.experience || 0} Years</div>
              <div className="text-white/50 text-xs">Experience</div>
            </div>
            <div>
              <div className="text-[#adc6ff] font-semibold">{teacher.qualification}</div>
              <div className="text-white/50 text-xs">Qualification</div>
            </div>
            <div>
              <div className="text-white font-semibold">
                {teacher.subjects?.length || 0} Subjects
              </div>
              <div className="text-white/50 text-xs">Taught</div>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <Link href="/dashboard/teacher-application">
          <Button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-6 rounded-3xl">
            <Edit size={20} />
            Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Professional Background */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="text-[#6ffbbe]" size={24} />
            <h3 className="text-2xl font-bold text-white">Professional Background</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-white/50 text-sm mb-1">Highest Qualification</div>
              <div className="text-white text-xl">{teacher.qualification}</div>
            </div>
            <div>
              <div className="text-white/50 text-sm mb-1">Experience</div>
              <div className="text-white text-xl">{teacher.experience} Years</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-white/50 text-sm mb-3">Primary Subjects</div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(teacher.subjects)
                  ? teacher.subjects.map((sub: string, i: number) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-white/10 text-white text-sm rounded-2xl"
                      >
                        {sub}
                      </span>
                    ))
                  : teacher.subjects?.split(',').map((sub: string, i: number) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-white/10 text-white text-sm rounded-2xl"
                      >
                        {sub.trim()}
                      </span>
                    ))}
              </div>
            </div>
          </div>
        </div>

        {/* Teaching Preferences */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-[#adc6ff]" size={24} />
            <h3 className="text-2xl font-bold text-white">Teaching Preferences</h3>
          </div>

          <div className="space-y-8">
            {/* Target Levels */}
            <div>
              <div className="text-white/50 text-sm mb-3">Target Levels</div>
              <div className="flex flex-wrap gap-2">
                {teacher.teachingLevel?.map((level: string) => (
                  <span
                    key={level}
                    className="px-5 py-2 bg-[#adc6ff]/10 text-[#adc6ff] text-sm rounded-3xl"
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability Days */}
            <div>
              <div className="text-white/50 text-sm mb-3">Available Days</div>
              <div className="flex flex-wrap gap-2">
                {teacher.availableDays?.map((day: string) => (
                  <span
                    key={day}
                    className="px-4 py-2 bg-white/10 text-white text-xs font-medium rounded-2xl"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Links */}
        <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <LinkIcon className="text-[#adc6ff]" size={24} />
            <h3 className="text-2xl font-bold text-white">Professional Links</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teacher.linkedin && (
              <a
                href={teacher.linkedin}
                target="_blank"
                className="flex items-center gap-3 px-5 py-4 bg-white/5 hover:bg-white/10 rounded-3xl transition-colors"
              >
                <Linkedin className="text-[#adc6ff]" size={22} />
                <div>
                  <div className="text-white text-sm font-medium">LinkedIn</div>
                  <div className="text-white/50 text-xs truncate max-w-[160px]">
                    {teacher.linkedin}
                  </div>
                </div>
              </a>
            )}

            {teacher.website && (
              <a
                href={teacher.website}
                target="_blank"
                className="flex items-center gap-3 px-5 py-4 bg-white/5 hover:bg-white/10 rounded-3xl transition-colors"
              >
                <Globe className="text-[#6ffbbe]" size={22} />
                <div>
                  <div className="text-white text-sm font-medium">Website</div>
                  <div className="text-white/50 text-xs truncate max-w-[160px]">
                    {teacher.website}
                  </div>
                </div>
              </a>
            )}

            {teacher.twitter && (
              <a
                href={teacher.twitter}
                target="_blank"
                className="flex items-center gap-3 px-5 py-4 bg-white/5 hover:bg-white/10 rounded-3xl transition-colors"
              >
                <Twitter className="text-[#adc6ff]" size={22} />
                <div>
                  <div className="text-white text-sm font-medium">Twitter / X</div>
                  <div className="text-white/50 text-xs truncate max-w-[160px]">
                    {teacher.twitter}
                  </div>
                </div>
              </a>
            )}

            {teacher.facebook && (
              <a
                href={teacher.facebook}
                target="_blank"
                className="flex items-center gap-3 px-5 py-4 bg-white/5 hover:bg-white/10 rounded-3xl transition-colors"
              >
                <Facebook className="text-[#adc6ff]" size={22} />
                <div>
                  <div className="text-white text-sm font-medium">Facebook</div>
                  <div className="text-white/50 text-xs truncate max-w-[160px]">
                    {teacher.facebook}
                  </div>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center text-white/40 text-xs">
      <p>        Last updated: {new Date(teacher.updatedAt).toLocaleDateString()} 
</p>
<Link href={`/dashboard/teacher-application?id=${teacher._id}`}>
  edit now
</Link>
      </div>
    </div>
  );
};

export default TeacherProfile;