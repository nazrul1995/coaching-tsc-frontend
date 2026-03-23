'use client';

import { registerUser } from '@/lib/api/auth';
import { uploadImageToImgBB } from '@/lib/imgUpload';
import { Button } from '@base-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

type FormData = {
  name: string;
  email: string;
  password: string;
  role: string;
  image?: string;
  imageFile?: FileList;
  error?: string;
};

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
  console.log("SUCCESS DATA 👉", data);

  if (!data?.token) {
    console.error("TOKEN NOT FOUND ❌", data);
    return;
  }

  localStorage.setItem('token', data.token);
  router.push('/');
},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (error: any) => {
  console.log("ERROR 👉", error.response?.data);
},
  });

 const onSubmit = async (formData: FormData) => {
  try {
    let imageUrl = formData.image;

    // ✅ If user uploads file
    if (formData.imageFile && formData.imageFile.length > 0) {
      Swal.fire({
        title: 'Uploading image...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      imageUrl = await uploadImageToImgBB(formData.imageFile[0]);
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      image: imageUrl, // ✅ final image
    };

    mutate(payload);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Image Upload Failed',
      text: 'Try again',
    });
  }
};

  return (
    <div className="min-h-screen mt-20 flex items-center justify-center bg-[#0b1326] text-white px-6 py-20 relative overflow-hidden">

      {/* Glow background */}
      <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-[#adc6ff]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-100 h-100 bg-[#6ffbbe]/20 blur-[100px] rounded-full" />

      <div className="relative z-10 w-full max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">

        <h1 className="text-4xl font-black mb-2 tracking-tight">
          Create Your Account
        </h1>
        <p className="text-white/70 mb-8">
          Join Lens Coaching
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Name */}
          <div>
            <label className="text-sm text-white/70">Full Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full mt-2 p-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-[#6ffbbe]"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-white/70">Email</label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              className="w-full mt-2 p-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-[#6ffbbe]"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-white/70">Password</label>
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Minimum 6 characters',
                },
              })}
              type="password"
              className="w-full mt-2 p-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-[#6ffbbe]"
              placeholder="Create password"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="text-sm text-white/70">Role</label>
            <select
              {...register('role', { required: 'Role is required' })}
              className="w-full mt-2 p-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none"
            >
              <option value="" className='text-white bg-gray-500'>Select Role</option>
              <option value="student" className='text-white bg-gray-500'>Student</option>
              <option value="teacher" className='text-white bg-gray-500'>Teacher</option>
              <option value="guardian" className='text-white bg-gray-500'>Guardian</option>
            </select>
            {errors.role && (
              <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label className="text-sm text-white/70">Profile Image URL</label>
            <input
              {...register('image')}
              className="w-full mt-2 p-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none"
              placeholder="Paste image link (optional)"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm text-white/70">Or Upload Image</label>
            <input
              type="file"
              accept="image/*"
              {...register('imageFile')}
              className="w-full mt-2 text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#adc6ff] file:text-[#002e6a] hover:file:bg-[#adc6ff]/90"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="bg-[#adc6ff] hover:bg-[#adc6ff]/90 text-[#002e6a] font-semibold px-5 py-3 rounded-xl w-full transition-all"
          >
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;