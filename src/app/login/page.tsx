'use client';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

type LoginData = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      if (!data?.token) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Token not received!',
        });
        return;
      }

      // Save token
      localStorage.setItem('token', data.token);

      // Success Alert
      Swal.fire({
        icon: 'success',
        title: 'Login Successful 🎉',
        text: 'Welcome back!',
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirect
      setTimeout(() => {
        router.push('/');
      }, 1500);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'Invalid credentials',
      });
    },
  });

  const onSubmit = (formData: LoginData) => {
    mutate(formData);
  };

  return (
    <div className="min-h-screen mt-20 flex items-center justify-center bg-[#0b1326] text-white px-6 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#adc6ff]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#6ffbbe]/20 blur-[100px] rounded-full" />

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">

        <h1 className="text-4xl font-black mb-2">Welcome Back</h1>
        <p className="text-white/70 mb-8">Login to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Email */}
          <div>
            <label className="text-sm text-white/70">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
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
            <label className="text-sm text-white/70">Password</label>
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

          {/* Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#adc6ff] hover:bg-[#adc6ff]/90 text-[#002e6a] font-semibold px-5 py-3 rounded-xl transition-all"
          >
            {isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;