'use client';

import { useEffect, useState } from 'react';
import axiosSecure from '@/lib/axiosSecure';
import { StudentDetailsResponse } from '@/types/student';
import { StudentPaymentHistoryResponse } from '@/components/dashboard/common/StPaymentHistory';

export function useStudentDetails(email?: string) {
  const [data, setData] =useState<StudentDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) {
      setError('Student email পাওয়া যায়নি');
      setLoading(false);
      return;
    }

    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await axiosSecure.get(
          '/students/details',
          {
            params: {
              email,
            },
          }
        );

        const studentData = response.data?.data;

        if (!studentData) {
          throw new Error(
            'Student details পাওয়া যায়নি'
          );
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
  }, [email]);

  return {
    data,
    loading,
    error,
  };
}
export const useStudentPaymentHistory = (userId?: string) => {
  const [data, setData] = useState<StudentPaymentHistoryResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("Student ID পাওয়া যায়নি");
      setLoading(false);
      return;
    }

    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosSecure.get(
          `/payments/student/${userId}`,
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Payment history পাওয়া যায়নি"
          );
        }

        setData(response.data);
      } catch (error: any) {
        console.error(error);

        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Payment history fetch করতে সমস্যা হয়েছে"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory(userId);
  }, [userId]);

  return {
    data,
    loading,
    error,
  };
};


