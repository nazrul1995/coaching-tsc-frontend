'use client';

import { useEffect, useState } from 'react';
import axiosSecure from '@/lib/axiosSecure';
import { StudentDetailsResponse } from '@/types/student';

export function useStudentDetails(studentId?: string) {
  const [data, setData] =
    useState<StudentDetailsResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!studentId) {
      setError('Student ID পাওয়া যায়নি');
      setLoading(false);
      return;
    }

    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await axiosSecure.get(
          `/students/${studentId}/details`
        );

        const studentData = response.data?.data;

        if (!studentData) {
          throw new Error('Student details পাওয়া যায়নি');
        }

        setData(studentData);
      } catch (error: any) {
        console.error(error);

        setError(
          error?.response?.data?.message ||
            error?.message ||
            'Student details fetch করতে সমস্যা হয়েছে'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  return {
    data,
    loading,
    error,
  };
}
