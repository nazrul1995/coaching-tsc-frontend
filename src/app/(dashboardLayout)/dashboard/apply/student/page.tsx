'use client';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { User, UploadCloud, X, GraduationCap } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import axiosSecure from '@/lib/axiosSecure';
import { uploadImageToImgBB } from '@/lib/imgUpload';
import { useRouter } from 'next/navigation';

type StudentFormValues = {
  name: string;
  email: string;
  phone: string;
  institution: string;
  className: string;
  batch?: string;
  group?: 'science' | 'commerce' | 'arts' | '';
  photo?: FileList;
};

const StudentApplicationForm = () => {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StudentFormValues>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const selectedClass = watch('className');
  const photoWatch = watch('photo');

  // Show Batch & Group only for Class 9-12
  const isHigherClass = selectedClass && parseInt(selectedClass) >= 9;

  // Live Photo Preview
  useEffect(() => {
    if (photoWatch?.[0]) {
      const file = photoWatch[0];

      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', 'Image size must be less than 5MB', 'error');
        setValue('photo', undefined as any);
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [photoWatch, setValue]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user, reset]);

  // Mutation
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await axiosSecure.post('/students', payload);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: '✅ Success!',
        text: 'Your student profile has been submitted successfully.',
        icon: 'success',
        confirmButtonColor: '#adc6ff',
        background: '#0b1326',
        color: '#fff',
        customClass: { popup: 'rounded-3xl border border-white/10' },
      });
      reset();
      setPreview(null);
      router.push('/dashboard/profile');
    },
    onError: (error: any) => {
      Swal.fire({
        title: '❌ Failed',
        text: error?.response?.data?.message || 'Something went wrong',
        icon: 'error',
        confirmButtonColor: '#adc6ff',
        background: '#0b1326',
      });
    },
  });

  const onSubmit = async (data: StudentFormValues) => {
    try {
      let photoUrl = '';

      if (data.photo?.[0]) {
        photoUrl = await uploadImageToImgBB(data.photo[0]);
      }

      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        institution: data.institution,
        className: data.className,
        batch: isHigherClass ? data.batch : undefined,
        group: isHigherClass ? data.group : undefined,
        photo: photoUrl,
      };

      mutation.mutate(payload);
    } catch (err) {
      Swal.fire('Error', 'Image upload failed', 'error');
    }
  };

  if (authLoading) {
    return <div className="text-white text-center py-20">Loading...</div>;
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
            <p className="text-white/60 text-sm">Your identity and contact details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/70">Full Name</label>
              <input
                {...register('name')}
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
                  className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-2xl px-5 py-4 text-white w-full"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white/70">Phone Number</label>
                <input
                  {...register('phone', { required: 'Phone number is required' })}
                  type="tel"
                  className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-2xl px-5 py-4 text-white w-full"
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/70">Institution</label>
              <input
                {...register('institution', { required: 'Institution is required' })}
                type="text"
                placeholder="e.g. Dhaka City College"
                className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-2xl px-5 py-4 text-white w-full"
              />
              {errors.institution && <p className="text-red-400 text-sm mt-1">{errors.institution.message}</p>}
            </div>
          </div>

          {/* Photo Upload */}
          <div className="lg:col-span-5">
            <label className="text-sm font-semibold text-white/70 block mb-3">Profile Photo</label>
            <label
              htmlFor="photo-upload"
              className="border-2 border-dashed border-white/30 hover:border-[#adc6ff]/50 rounded-3xl flex flex-col items-center justify-center py-12 px-6 bg-white/5 transition-all cursor-pointer group w-full"
            >
              {preview ? (
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden mb-4">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setPreview(null);
                      setValue('photo', undefined as any);
                    }}
                    className="absolute top-2 right-2 bg-red-500 p-1 rounded-full text-white hover:bg-red-600"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-active:scale-95 transition-transform">
                  <UploadCloud size={36} className="text-[#adc6ff]" />
                </div>
              )}
              <p className="text-white font-medium text-base mb-1">Drag &amp; drop or click to upload</p>
              <p className="text-white/50 text-xs">JPG, PNG • Max 5MB • Min 400×400px</p>
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

      {/* Section 2: Academic Information */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 transition-all hover:border-[#adc6ff]/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#6ffbbe]/10 flex items-center justify-center text-[#6ffbbe]">
            <GraduationCap size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Academic Information</h3>
            <p className="text-white/60 text-sm">Your current academic details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white/70">Class</label>
            <select
              {...register('className', { required: 'Class is required' })}
              className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl px-5 py-4 text-white transition-all outline-none appearance-none w-full"
            >
              <option value="">Select Class</option>
              {Array.from({ length:7 }, (_, i) => i + 6).map((num) => (
                <option key={num} value={num}>
                  Class {num}
                </option>
              ))}
            </select>
            {errors.className && <p className="text-red-400 text-sm mt-1">{errors.className.message}</p>}
          </div>

          {/* Conditional Fields */}
          {isHigherClass && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white/70">Batch</label>
                <input
                  {...register('batch', { required: 'Batch is required' })}
                  placeholder="e.g. SSC-2025"
                  className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl px-5 py-4 text-white w-full"
                />
                {errors.batch && <p className="text-red-400 text-sm mt-1">{errors.batch.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white/70">Group</label>
                <select
                  {...register('group', { required: 'Group is required' })}
                  className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-3xl px-5 py-4 text-white transition-all outline-none appearance-none w-full"
                >
                  <option value="">Select Group</option>
                  <option value="science">Science</option>
                  <option value="commerce">Commerce</option>
                  <option value="arts">Arts</option>
                </select>
                {errors.group && <p className="text-red-400 text-sm mt-1">{errors.group.message}</p>}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Sticky Submit Button */}
      <div className="sticky bottom-6 z-50 flex justify-end">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="px-12 py-4 rounded-3xl font-semibold bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] text-[#0b1326] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#adc6ff]/30 text-lg disabled:opacity-70"
        >
          {mutation.isPending ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
};

export default StudentApplicationForm;