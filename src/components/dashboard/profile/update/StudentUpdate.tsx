'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import {
  User,
  GraduationCap,
  UploadCloud,
  Mail,
  Phone,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import axiosSecure from '@/lib/axiosSecure';
import { uploadImageToImgBB } from '@/lib/imgUpload';

type StudentFormValues = {
  name: string;
  email: string;
  phone: string;
  photo?: FileList;
  className: string;
  batch?: string;
  group?: string;
};

const StudentUpdate = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<StudentFormValues>();

  const photoWatch = watch('photo');

  // Fetch current student data
  const { data: student, isLoading } = useQuery({
    queryKey: ['student', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/students/email/${user?.email}`);
      return res.data.student || res.data;
    },
    enabled: !!user?.email,
  });

  // Pre-fill form when data loads
  useEffect(() => {
    if (student) {
      reset({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        className: student.className || '',
        batch: student.batch || '',
        group: student.group || '',
      });

      if (student.photo) setPreview(student.photo);
    }
  }, [student, reset]);

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
      return axiosSecure.patch(`/students/${student._id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', user?.email] });
      Swal.fire({
        title: '✅ Profile Updated!',
        text: 'Your student profile has been updated successfully.',
        icon: 'success',
        confirmButtonColor: '#adc6ff',
        background: '#0b1326',
        color: '#fff',
        customClass: { popup: 'rounded-3xl border border-white/10' },
      });
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

  const onSubmit = async (data: StudentFormValues) => {
    try {
      let photoUrl = student?.photo || '';

      if (data.photo && data.photo.length > 0) {
        const file = data.photo[0];
        photoUrl = await uploadImageToImgBB(file);
      }

      const payload = {
        name: data.name,
        phone: data.phone,
        photo: photoUrl,
        className: data.className,
        batch: data.batch,
        group: data.group,
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
            <p className="text-white/60 text-sm">Update your identity and photo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/70">Full Name</label>
              <input
                {...register('name')}
                type="text"
                className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-2xl px-5 py-4 text-white w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white/70">Email Address</label>
                <input
                  {...register('email')}
                  type="email"
                  value={user?.email}
                  className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-2xl px-5 py-4 text-white w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white/70">Phone Number</label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-2xl px-5 py-4 text-white w-full"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="lg:col-span-5">
            <label className="text-sm font-semibold text-white/70 block mb-3">Profile Photo</label>
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
              <p className="text-white font-medium text-base mb-1 text-center">
                {preview ? 'Change photo' : 'Upload photo'}
              </p>
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

      {/* Section 2: Academic Information */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 transition-all hover:border-[#adc6ff]/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#6ffbbe]/10 flex items-center justify-center text-[#6ffbbe]">
            <GraduationCap size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Academic Information</h3>
            <p className="text-white/60 text-sm">Your class, batch and group details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white/70">Class</label>
            <input
              {...register('className')}
              type="text"
              placeholder="e.g. Class 10"
              className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-2xl px-5 py-4 text-white w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white/70">Batch</label>
            <input
              {...register('batch')}
              type="text"
              placeholder="e.g. 2025-26"
              className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-2xl px-5 py-4 text-white w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white/70">Group</label>
            <input
              {...register('group')}
              type="text"
              placeholder="e.g. Science"
              className="bg-[#16203a] border border-white/20 focus:border-[#adc6ff] rounded-2xl px-5 py-4 text-white w-full"
            />
          </div>
        </div>
      </section>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-6 z-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="hidden sm:flex items-center gap-3 text-sm">
          <div className="text-white/70 font-medium">Update your student profile</div>
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

export default StudentUpdate;