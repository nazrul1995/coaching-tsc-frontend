'use client';
import React, { useState, useEffect } from 'react';
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

import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import axiosSecure from '@/lib/axiosSecure';
import { uploadImageToImgBB } from '@/lib/imgUpload';

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

const TeacherApplicationForm = () => {
  const { user, isLoading } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TeacherFormValues>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      teachingLevel: ['HSC (Higher Secondary)'],
      availableDays: ['Wed', 'Thu', 'Fri'],
    },
  });

  // Watch photo for live preview
  const photoWatch = watch('photo');

  // Generate image preview when file is selected
  useEffect(() => {
    if (photoWatch && photoWatch.length > 0) {
      const file = photoWatch[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Cleanup
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [photoWatch]);

  // TanStack Mutation
  const mutation = useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      phone: string;
      photoUrl: string;
      bio: string;
      qualification: string;
      experience: string;
      subjects: string[];
      teachingLevel: string[];
      linkedin?: string;
      facebook?: string;
      twitter?: string;
      website?: string;
    }) => {
      const response = await axiosSecure.post('/teachers', payload);
      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: '✅ Application Submitted!',
        text: 'We will review your profile and get back to you within 3-5 business days.',
        icon: 'success',
        confirmButtonColor: '#adc6ff',
        background: '#0b1326',
        color: '#fff',
        customClass: { popup: 'rounded-3xl border border-white/10' },
      });
      reset();
      setPreview(null);
    },
    onError: (error: any) => {
      console.error('Submission error:', error);
      Swal.fire({
        title: '❌ Submission Failed',
        text: error?.response?.data?.message || 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonColor: '#adc6ff',
        background: '#0b1326',
        color: '#fff',
      });
    },
  });

  // Submit Handler with proper photo handling + console log
  const onSubmit = async (data: TeacherFormValues) => {
    console.dir(data, { depth: null });

    try {
      let photoUrl = '';

      if (data.photo && data.photo.length > 0) {
        const file = data.photo[0];
        photoUrl = await uploadImageToImgBB(file);
      }

      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        photoUrl,
        bio: data.bio,
        qualification: data.qualification,
        experience: data.experience,
        subjects: data.subjects.split(',').map(s => s.trim()),
        teachingLevel: data.teachingLevel || [],
        availableDays: data.availableDays,
        linkedin: data.linkedin,
        facebook: data.facebook,
        twitter: data.twitter,
        website: data.website,
      };

      mutation.mutate(payload);
    } catch (error) {
      console.error('Image upload error:', error);
      Swal.fire('Error', 'Failed to upload profile photo', 'error');
    }
  };

 
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, reset]);
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-white/70">
        Loading your information...
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
            <p className="text-white/60 text-sm">Your identity and digital presence</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/70">Full Legal Name</label>
              <input
                {...register('name')}
                type="text"
                readOnly
                className="bg-[#16203a] border border-white/20 rounded-2xl px-5 py-4 text-white w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white/70">Email Address</label>
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-2xl px-5 py-4 text-white placeholder:text-white/40 transition-all outline-none w-full"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white/70">Phone Number</label>
                <input
                  {...register('phone', { required: 'Phone number is required' })}
                  type="tel"
                  placeholder="+880 1XXX-XXXXXX"
                  className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-2xl px-5 py-4 text-white placeholder:text-white/40 transition-all outline-none w-full"
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
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
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-active:scale-95 transition-transform">
                  <UploadCloud size={36} className="text-[#adc6ff]" />
                </div>
              )}

              <p className="text-white font-medium text-base mb-1 text-center">
                {preview ? 'Change photo' : 'Drag & drop your photo'}
              </p>
              <p className="text-white/50 text-xs text-center">
                JPG, PNG • Max 5MB • Min 400×400px
              </p>

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
              {...register('bio', { required: 'Professional bio is required' })}
              rows={4}
              placeholder="Briefly describe your teaching philosophy and career highlights..."
              className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl px-5 py-4 text-white placeholder:text-white/40 resize-none transition-all outline-none w-full"
            />
            {errors.bio && <p className="text-red-400 text-sm mt-1">{errors.bio.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/70">Highest Qualification</label>
              <select
                {...register('qualification', { required: 'Qualification is required' })}
                className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl px-5 py-4 text-white transition-all outline-none appearance-none w-full"
              >
                <option value="">Select qualification</option>
                <option value="PhD / Doctorate">PhD / Doctorate</option>
                <option value="Masters Degree">Masters Degree</option>
                <option value="Bachelors Degree">Bachelors Degree</option>
                <option value="Professional Cert">Professional Cert</option>
              </select>
              {errors.qualification && <p className="text-red-400 text-sm mt-1">{errors.qualification.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/70">Experience (Years)</label>
              <input
                {...register('experience', { required: 'Experience is required' })}
                type="number"
                min="0"
                placeholder="5"
                className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl px-5 py-4 text-white placeholder:text-white/40 transition-all outline-none w-full"
              />
              {errors.experience && <p className="text-red-400 text-sm mt-1">{errors.experience.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/70">Primary Subjects</label>
              <input
                {...register('subjects', { required: 'Primary subjects are required' })}
                type="text"
                placeholder="Physics, Math, ICT"
                className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl px-5 py-4 text-white placeholder:text-white/40 transition-all outline-none w-full"
              />
              {errors.subjects && <p className="text-red-400 text-sm mt-1">{errors.subjects.message}</p>}
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
                <label
                  key={level}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/20 hover:border-[#adc6ff]/40 rounded-3xl cursor-pointer transition-all peer"
                >
                  <input
                    type="checkbox"
                    value={level}
                    {...register('teachingLevel')}
                    className="accent-[#adc6ff]"
                  />
                  <span className="text-sm text-white peer-checked:text-[#adc6ff] transition-colors">
                    {level}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-white/70 block mb-6">Availability Days</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <label
                  key={day}
                  className="flex flex-col items-center justify-center p-3 sm:p-4 border border-white/20 hover:border-[#adc6ff]/40 bg-white/5 rounded-3xl cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    value={day}
                    {...register('availableDays')}
                    className="accent-[#adc6ff] mb-2 scale-110"
                  />
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
            <input
              {...register('linkedin')}
              type="url"
              placeholder="LinkedIn URL"
              className="w-full bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl py-4 pl-12 pr-5 text-white placeholder:text-white/40 transition-all outline-none"
            />
          </div>

          <div className="relative">
            <Globe size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              {...register('website')}
              type="url"
              placeholder="Personal Website"
              className="w-full bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl py-4 pl-12 pr-5 text-white placeholder:text-white/40 transition-all outline-none"
            />
          </div>

          <div className="relative">
            <Twitter size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              {...register('twitter')}
              type="url"
              placeholder="Twitter / X Profile"
              className="w-full bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl py-4 pl-12 pr-5 text-white placeholder:text-white/40 transition-all outline-none"
            />
          </div>

          <div className="relative">
            <Facebook size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              {...register('facebook')}
              type="url"
              placeholder="Facebook Page"
              className="w-full bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl py-4 pl-12 pr-5 text-white placeholder:text-white/40 transition-all outline-none"
            />
          </div>
        </div>
      </section>

      {/* Sticky Action Bar - Fixed */}
      <div className="sticky bottom-6 z-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="hidden sm:flex items-center gap-3 text-sm">
          <div className="text-white/70 font-medium">Ready to join our faculty?</div>
          <div className="text-white/40 text-xs">All data is logged to console for debugging</div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 sm:flex-none px-10 py-4 rounded-2xl font-semibold bg-linear-to-r from-[#adc6ff] to-[#6ffbbe] text-[#0b1326] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#adc6ff]/30 text-sm disabled:opacity-70"
          >
            {mutation.isPending ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TeacherApplicationForm;