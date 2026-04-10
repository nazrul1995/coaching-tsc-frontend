'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { User, UploadCloud, X } from 'lucide-react';
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
  className: string;
  batch?: string;
  group?: 'science' | 'commerce' | 'arts' | '';
  photo?: FileList;
};

const StudentApplicationForm = () => {
  const { user, isLoading } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StudentFormValues>();

  const selectedClass = watch('className');
  const photoWatch = watch('photo');

  // Show Batch & Group only for Class 9-12
  const isHigherClass = selectedClass && parseInt(selectedClass) >= 9;

  // Photo Preview
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
      setPhotoFile(file);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [photoWatch, setValue]);

  // Reset form with user data
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await axiosSecure.post('/students', payload);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: '✅ Success!',
        text: 'Your application has been submitted successfully.',
        icon: 'success',
        confirmButtonColor: '#adc6ff',
        background: '#0b1326',
        color: '#fff',
      });
      reset();
      setPreview(null);
      setPhotoFile(null);
      router.push('/dashboard/profile')
    },
    onError: (error: any) => {
      Swal.fire({
        title: '❌ Failed',
        text: error?.response?.data?.message || 'Something went wrong',
        icon: 'error',
      });
    },
  });

  const onSubmit = async (data: StudentFormValues) => {
    try {
      let photoUrl = '';
      if (photoFile) {
        photoUrl = await uploadImageToImgBB(photoFile);
      }

      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        className: data.className,
        batch: isHigherClass ? data.batch : " ",
        group: isHigherClass ? data.group : " ",
        photo: photoUrl,
      };

      mutation.mutate(payload);
    } catch (err) {
      Swal.fire('Error', 'Image upload failed', 'error');
    }
  };

  if (isLoading) return <div className="text-white text-center py-20">Loading...</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto space-y-8 px-4 pb-12"
    >
      {/* Personal Info */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <User className="text-[#adc6ff]" size={28} />
          <h3 className="text-2xl font-bold text-white">Personal Information</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
            <input {...register('name')} readOnly className="input-field" />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              className="input-field"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Phone Number</label>
            <input
              {...register('phone', { required: 'Phone number is required' })}
              type="tel"
              className="input-field"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Class</label>
            <select
              {...register('className', { required: 'Please select class' })}
              className="input-field"
            >
              <option value="">Select Class</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  Class {num}
                </option>
              ))}
            </select>
            {errors.className && <p className="text-red-500 text-sm mt-1">{errors.className.message}</p>}
          </div>

          {/* Conditional Fields - Only for Class 9-12 */}
          {isHigherClass && (
            <>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Batch</label>
                <input
                  {...register('batch', { required: 'Batch is required for Class 9-12' })}
                  placeholder="e.g. SSC-2025, HSC-2026"
                  className="input-field"
                />
                {errors.batch && <p className="text-red-500 text-sm mt-1">{errors.batch.message}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Group</label>
                <select
                  {...register('group', { required: 'Please select group' })}
                  className="input-field"
                >
                  <option value="">Select Group</option>
                  <option value="science">Science</option>
                  <option value="commerce">Commerce</option>
                  <option value="arts">Arts</option>
                </select>
                {errors.group && <p className="text-red-500 text-sm mt-1">{errors.group.message}</p>}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Photo Upload */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <UploadCloud className="text-[#adc6ff]" size={28} />
          <h3 className="text-2xl font-bold text-white">Profile Photo</h3>
        </div>

        <label className="upload-box cursor-pointer">
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/20 rounded-3xl hover:border-[#adc6ff]/60 transition-all">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-36 h-36 rounded-2xl object-cover shadow-xl"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setPreview(null);
                    setPhotoFile(null);
                    setValue('photo', undefined as any);
                  }}
                  className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 p-1.5 rounded-full text-white"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <>
                <UploadCloud size={56} className="text-white/50 mb-4" />
                <p className="text-white/70 text-lg">Upload Profile Photo</p>
                <p className="text-xs text-white/40 mt-1">PNG or JPG • Max 5MB</p>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            {...register('photo')}
            className="hidden"
          />
        </label>
      </section>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full py-4 rounded-2xl bg-[#adc6ff] hover:bg-[#9ab8ff] text-black font-bold text-lg disabled:opacity-70"
      >
        {mutation.isPending ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
};

export default StudentApplicationForm;