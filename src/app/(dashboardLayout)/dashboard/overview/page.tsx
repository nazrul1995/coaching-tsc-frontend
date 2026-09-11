'use client';

import React from 'react';
import { LoadingState } from '@/components/dashboard/common';
import { useAuth } from '@/context/AuthContext';

const Overview = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingState />;

  const role = user?.role?.toLowerCase();

  return (
    <div className="p-6 text-white">
      {role === 'admin' && <h1>Admin Dashboard</h1>}

      {role === 'teacher' && <h1>Teacher Dashboard</h1>}

      {role === 'student' && <h1>Student Dashboard</h1>}
    </div>
  );
};

export default Overview;
