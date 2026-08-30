'use client';

import { useEffect, useState } from 'react';
import axiosSecure from '@/lib/axiosSecure';
import { IAdminOverview, IStudentOverview } from '@/types/dashboard-overview';

export function useAdminOverview() {
  const [data, setData] = useState<IAdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAdminOverview = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axiosSecure.get('/dashboard/admin-overview');
      const overviewData = response.data?.data;

      if (!overviewData) {
        throw new Error('Admin overview ডাটা পাওয়া যায়নি');
      }

      setData(overviewData);
    } catch (error: any) {
      console.error(error);
      setError(
        error?.response?.data?.message ||
          error?.message ||
          'Admin overview fetch করতে সমস্যা হয়েছে'
      );
    } fontFinally: {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOverview();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchAdminOverview,
  };
}


export function useStudentOverview() {
  const [data, setData] = useState<IStudentOverview| null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudentOverview = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axiosSecure.get('/dashboard/student-overview');
      const overviewData = response.data?.data;

      if (!overviewData) {
        throw new Error('Student overview ডাটা পাওয়া যায়নি');
      }

      setData(overviewData);
    } catch (error: any) {
      console.error(error);
      setError(
        error?.response?.data?.message ||
          error?.message ||
          'Student overview fetch করতে সমস্যা হয়েছে'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentOverview();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchStudentOverview,
  };
}