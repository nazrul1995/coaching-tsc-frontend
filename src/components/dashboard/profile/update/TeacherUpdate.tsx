'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import {
  User,
  Briefcase,
  Calendar,
  UploadCloud,
  Link as LinkIcon,
  Globe,
  Twitter,
  Facebook,
  Linkedin,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import axiosSecure from '@/lib/axiosSecure';
import { uploadImageToImgBB } from '@/lib/imgUpload';
import { useRouter } from 'next/navigation';

type TeacherFormValues = {
  name: string;
  email: string;
  phone: string;
  photo?: FileList;
  bio: string;
  qualification: string;
  experience: string;
  subjects: string;
  teachingLevel?: string[];
  availableDays?: string[];
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
};

const TeacherUpdate = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TeacherFormValues>();

  const photoWatch = watch('photo');

  // Fetch current teacher data
  const { data: teacher, isLoading } = useQuery({
    queryKey: ['teacher', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/teachers/email/${user?.email}`);
      return res.data.teacher || res.data;
    },
    enabled: !!user?.email,
  });

  // Pre-fill form
  useEffect(() => {
    if (teacher) {
      reset({
        name: teacher.name || '',
        phone: teacher.phone || '',
        bio: teacher.bio || '',
        qualification: teacher.qualification || '',
        experience: teacher.experience?.toString() || '',
        subjects: Array.isArray(teacher.subjects)
          ? teacher.subjects.join(', ')
          : teacher.subjects || '',
        teachingLevel: teacher.teachingLevel || ['HSC (Higher Secondary)'],
        availableDays: teacher.availableDays || ['Wed', 'Thu', 'Fri'],
        linkedin: teacher.linkedin || '',
        facebook: teacher.facebook || '',
        twitter: teacher.twitter || '',
        website: teacher.website || '',
      });

      if (teacher.photo || teacher.photoUrl) {
        setPreview(teacher.photo || teacher.photoUrl);
      }
    }
  }, [teacher, reset]);

  // Live photo preview
  useEffect(() => {
    if (photoWatch && photoWatch.length > 0) {
      const file = photoWatch[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [photoWatch]);

  // Update mutation
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      return axiosSecure.patch(`/teachers/${teacher._id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', user?.email] });
      Swal.fire({
        title: '✅ Profile Updated!',
        text: 'Your teacher profile has been updated successfully.',
        icon: 'success',
        confirmButtonColor: '#adc6ff',
        background: '#0b1326',
        color: '#fff',
        customClass: { popup: 'rounded-3xl border border-white/10' },
      });
      router.push("/dashboard/profile")
    },
    onError: (error: any) => {
      console.error(error);
      Swal.fire({
        title: '❌ Update Failed',
        text: error?.response?.data?.message || 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonColor: '#adc6ff',
        background: '#0b1326',
        color: '#fff',
      });
    },
  });

  const onSubmit = async (data: TeacherFormValues) => {
    console.log('%c✅ UPDATE FORM SUBMITTED', 'color:#adc6ff; font-weight:bold');
    console.dir(data);

    try {
      let photoUrl = teacher?.photo || teacher?.photoUrl || '';

      if (data.photo && data.photo.length > 0) {
        const file = data.photo[0];
        photoUrl = await uploadImageToImgBB(file);
      }

      const payload = {
        name: data.name,
        phone: data.phone,
        photo: photoUrl,
        bio: data.bio,
        qualification: data.qualification,
        experience: data.experience,
        subjects: data.subjects.split(',').map((s) => s.trim()),
        teachingLevel: data.teachingLevel || [],
        availableDays: data.availableDays || [],
        linkedin: data.linkedin,
        facebook: data.facebook,
        twitter: data.twitter,
        website: data.website,
      };

      mutation.mutate(payload);
    } catch (error) {
      Swal.fire('Error', 'Failed to upload profile photo', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-white/70">
        Loading your profile...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-5xl mx-auto space-y-8 pb-8 px-4 sm:px-0"
    >
      {/* Section 1: Personal Information */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 transition-all hover:border-[#adc6ff]/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#adc6ff]/10 flex items-center justify-center text-[#adc6ff]">
            <User size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Personal Information</h3>
            <p className="text-white/60 text-sm">Update your identity and digital presence</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/70">Full Legal Name</label>
              <input
                {...register('name')}
                type="text"
                className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-2xl px-5 py-4 text-white placeholder:text-white/40 transition-all outline-none w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white/70">Email Address</label>
                <input
                  {...register('email')}
                  type="email"
                  className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-2xl px-5 py-4 text-white placeholder:text-white/40 transition-all outline-none w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white/70">Phone Number</label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-2xl px-5 py-4 text-white placeholder:text-white/40 transition-all outline-none w-full"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload with Preview */}
          <div className="lg:col-span-5">
            <label className="text-sm font-semibold text-white/70 block mb-3">Professional Portrait</label>
            <label
              htmlFor="photo-upload"
              className="border-2 border-dashed border-white/30 hover:border-[#adc6ff]/50 rounded-3xl flex flex-col items-center justify-center py-10 sm:py-12 px-6 bg-white/5 transition-all cursor-pointer group w-full relative overflow-hidden"
            >
              {preview ? (
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden mb-4">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-active:scale-95 transition-transform">
                  <UploadCloud size={36} className="text-[#adc6ff]" />
                </div>
              )}
              <p className="text-white font-medium text-base mb-1 text-center">Change Photo</p>
              <p className="text-white/50 text-xs text-center">JPG, PNG • Max 5MB</p>
              <input
                {...register('photo')}
                id="photo-upload"
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
              />
            </label>
          </div>
        </div>
      </section>

      {/* Section 2: Professional Background */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 transition-all hover:border-[#adc6ff]/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#6ffbbe]/10 flex items-center justify-center text-[#6ffbbe]">
            <Briefcase size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Professional Background</h3>
            <p className="text-white/60 text-sm">Qualifications and teaching history</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white/70">Professional Bio</label>
            <textarea
              {...register('bio')}
              rows={4}
              className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl px-5 py-4 text-white placeholder:text-white/40 resize-none transition-all outline-none w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/70">Highest Qualification</label>
              <select {...register('qualification')} className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl px-5 py-4 text-white transition-all outline-none appearance-none w-full">
                <option value="">Select qualification</option>
                <option value="PhD / Doctorate">PhD / Doctorate</option>
                <option value="Masters Degree">Masters Degree</option>
                <option value="Bachelors Degree">Bachelors Degree</option>
                <option value="Professional Cert">Professional Cert</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/70">Experience (Years)</label>
              <input {...register('experience')} type="number" min="0" className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl px-5 py-4 text-white placeholder:text-white/40 transition-all outline-none w-full" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/70">Primary Subjects</label>
              <input {...register('subjects')} type="text" placeholder="Physics, Math, ICT" className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl px-5 py-4 text-white placeholder:text-white/40 transition-all outline-none w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Teaching Preferences */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 transition-all hover:border-[#adc6ff]/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#adc6ff]/10 flex items-center justify-center text-[#adc6ff]">
            <Calendar size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Teaching Preferences</h3>
            <p className="text-white/60 text-sm">Availability and target levels</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <label className="text-sm font-semibold text-white/70 block mb-6">Target Levels</label>
            <div className="flex flex-wrap gap-3">
              {['SSC (Secondary)', 'HSC (Higher Secondary)', 'University Admission', 'Engineering Prep'].map((level) => (
                <label key={level} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/20 hover:border-[#adc6ff]/40 rounded-3xl cursor-pointer transition-all peer">
                  <input type="checkbox" value={level} {...register('teachingLevel')} className="accent-[#adc6ff]" />
                  <span className="text-sm text-white peer-checked:text-[#adc6ff] transition-colors">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-white/70 block mb-6">Availability Days</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <label key={day} className="flex flex-col items-center justify-center p-3 sm:p-4 border border-white/20 hover:border-[#adc6ff]/40 bg-white/5 rounded-3xl cursor-pointer transition-all">
                  <input type="checkbox" value={day} {...register('availableDays')} className="accent-[#adc6ff] mb-2 scale-110" />
                  <span className="text-xs font-medium text-white">{day}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Professional Links */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 transition-all hover:border-[#adc6ff]/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#adc6ff]/10 flex items-center justify-center text-[#adc6ff]">
            <LinkIcon size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Professional Links</h3>
            <p className="text-white/60 text-sm">Social proof and academic portfolio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <Linkedin size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
            <input {...register('linkedin')} type="url" placeholder="LinkedIn URL" className="w-full bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl py-4 pl-12 pr-5 text-white placeholder:text-white/40 transition-all outline-none" />
          </div>

          <div className="relative">
            <Globe size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
            <input {...register('website')} type="url" placeholder="Personal Website" className="w-full bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl py-4 pl-12 pr-5 text-white placeholder:text-white/40 transition-all outline-none" />
          </div>

          <div className="relative">
            <Twitter size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
            <input {...register('twitter')} type="url" placeholder="Twitter / X Profile" className="w-full bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl py-4 pl-12 pr-5 text-white placeholder:text-white/40 transition-all outline-none" />
          </div>

          <div className="relative">
            <Facebook size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
            <input {...register('facebook')} type="url" placeholder="Facebook Page" className="w-full bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl py-4 pl-12 pr-5 text-white placeholder:text-white/40 transition-all outline-none" />
          </div>
        </div>
      </section>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-6 z-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="hidden sm:flex items-center gap-3 text-sm">
          <div className="text-white/70 font-medium">Update your teacher profile</div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex-1 sm:flex-none px-8 py-4 rounded-2xl font-semibold bg-white/10 hover:bg-white/20 transition-colors text-white text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 sm:flex-none px-10 py-4 rounded-2xl font-semibold bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] text-[#0b1326] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#adc6ff]/30 text-sm disabled:opacity-70"
          >
            {mutation.isPending ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TeacherUpdate;