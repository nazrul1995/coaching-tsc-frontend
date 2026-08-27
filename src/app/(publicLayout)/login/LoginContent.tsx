'use client';

import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { loginUser, type LoginPayload } from '@/lib/api/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { useAuth } from '@/context/AuthContext';

const demoAccounts: Record<
  'student' | 'teacher' | 'admin' | 'user',
  LoginPayload
> = {
  student: {
    email: 'teststudent@gmail.com',
    password: 'teststudent@gmail.com',
  },
  teacher: {
    email: 'rana@gmail.com',
    password: 'rana@gmail.com',
  },
  admin: {
    email: 'admin@gmail.com',
    password: 'admin@gmail.com',
  },
  user: {
    email: 'admin1@gmail.com',
    password: 'admin1@gmail.com',
  },
};

const LoginContent = () => {
  const {
  register,
  handleSubmit,
  setValue,
  formState: { errors },
} = useForm<LoginPayload>();

const router = useRouter();
const { login } = useAuth();
const params = useSearchParams();

const callbackUrl = params.get('callbackUrl') || '/dashboard';

const { mutate, isPending } = useMutation({
  mutationFn: loginUser,

  onSuccess: (data) => {
    if (!data?.success || !data?.token || !data?.user) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid login response from server',
      });

      return;
    }

    // AuthContext:
    // localStorage + state + frontend cookie
    login(data.token, data.user);

    Swal.fire({
      icon: 'success',
      title: 'Login Successful 🎉',
      text: `Welcome back, ${data.user.name}!`,
      timer: 1200,
      showConfirmButton: false,
    }).then(() => {
      router.replace(callbackUrl);
    });
  },

  onError: (error: any) => {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text:
        error.response?.data?.message ||
        'Invalid email or password',
    });
  },
});

const onSubmit = (formData: LoginPayload) => {
  mutate(formData);
};

  // Demo login
  const handleDemoLogin = (
    role: 'student' | 'teacher' | 'admin' | 'user'
  ) => {
    const account = demoAccounts[role];

    setValue('email', account.email);
    setValue('password', account.password);

    mutate(account);
  };

  return (
    <div className="min-h-screen mt-20 flex items-center justify-center bg-[#0b1326] text-white px-6 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-[-10%] right-[-10%] w-125 h-[500px] bg-[#adc6ff]/20 blur-[120px] rounded-full" />

      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#6ffbbe]/20 blur-[100px] rounded-full" />

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">

        <h1 className="text-4xl font-black mb-2">
          Welcome Back
        </h1>

        <p className="text-white/70 mb-8">
          Login to your account
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Email */}
          <div>
            <label className="text-sm text-white/70">
              Email
            </label>

            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
              })}
              className="w-full mt-2 p-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-[#adc6ff]"
              placeholder="Enter your email"
            />

            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-white/70">
              Password
            </label>

            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Minimum 6 characters',
                },
              })}
              className="w-full mt-2 p-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-[#adc6ff]"
              placeholder="Enter your password"
            />

            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#adc6ff] hover:bg-[#adc6ff]/90 text-[#002e6a] font-semibold px-5 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Demo Login */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/40 uppercase">
              Demo Login
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleDemoLogin('student')}
              className="rounded-xl border border-blue-400/30 bg-blue-500/10 px-3 py-3 text-sm font-semibold text-blue-300 hover:bg-blue-500/20 transition disabled:opacity-50"
            >
              🎓 Student
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => handleDemoLogin('teacher')}
              className="rounded-xl border border-green-400/30 bg-green-500/10 px-3 py-3 text-sm font-semibold text-green-300 hover:bg-green-500/20 transition disabled:opacity-50"
            >
              👨‍🏫 Teacher
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => handleDemoLogin('admin')}
              className="rounded-xl border border-purple-400/30 bg-purple-500/10 px-3 py-3 text-sm font-semibold text-purple-300 hover:bg-purple-500/20 transition disabled:opacity-50"
            >
              🛡️ Admin
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleDemoLogin('user')}
              className="rounded-xl border border-yellow-400/30 bg-yellow-500/10 px-3 py-3 text-sm font-semibold text-yellow-300 hover:bg-yellow-500/20 transition disabled:opacity-50"
            >
              👤 User
            </button>
          </div>

          <p className="text-center text-xs text-white/40 mt-3">
            Use a demo account to quickly explore each dashboard.
          </p>
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm text-white/70 mt-6">
          Don&apos;t have an account?{' '}
          <a
            href="/register"
            className="text-[#adc6ff] hover:text-[#adc6ff]/90 font-semibold"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginContent;