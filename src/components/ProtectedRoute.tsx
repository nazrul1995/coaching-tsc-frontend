'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: ('student' | 'teacher' | 'guardian' | 'admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isLoggedIn, user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        // Not logged in - redirect to login
        Swal.fire({
          icon: 'warning',
          title: 'Login Required',
          text: 'Please login to access this page',
          timer: 2000,
          showConfirmButton: false,
        });
        router.push('/login');
        return;
      }

      // Check role if required
      if (requiredRole && user && !requiredRole.includes(user.role)) {
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'You do not have permission to access this page',
          timer: 2000,
          showConfirmButton: false,
        });
        router.push('/');
        return;
      }
    }
  }, [isLoggedIn, isLoading, requiredRole, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1326]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#adc6ff]" />
          <p className="text-white/70 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};
