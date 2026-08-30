'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Wallet,
  XCircle,
  Loader2,
} from 'lucide-react';

import axiosSecure from '@/lib/axiosSecure';
import { useAuth } from '@/context/AuthContext';

// ======================================================
// TYPES
// ======================================================

type PaymentStatus =
  | 'unpaid'
  | 'partial'
  | 'paid'
  | 'overdue';

interface PaymentHistory {
  _id: string;
  student: string;
  cycleStartDate: string;
  cycleEndDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  paymentDate?: string;
  remarks?: string;
  dueAmount: number;
}

interface PaymentResponse {
  success: boolean;

  student: {
    id: string;
    name: string;
    admissionDate: string;
    monthlyFee: number;
    email?: string;
  };

  summary: {
    totalAmount: number;
    totalPaid: number;
    totalOutstanding: number;
  };

  history: PaymentHistory[];
}

// ======================================================
// HELPERS
// ======================================================

const formatCurrency = (amount: number) => {
  return `৳${amount.toLocaleString('en-BD')}`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getStatusConfig = (
  status: PaymentStatus
) => {
  switch (status) {
    case 'paid':
      return {
        label: 'Paid',
        icon: CheckCircle2,
        className:
          'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
      };

    case 'partial':
      return {
        label: 'Partial',
        icon: Clock3,
        className:
          'border-amber-500/20 bg-amber-500/10 text-amber-400',
      };

    case 'overdue':
      return {
        label: 'Overdue',
        icon: AlertCircle,
        className:
          'border-rose-500/20 bg-rose-500/10 text-rose-400',
      };

    case 'unpaid':
    default:
      return {
        label: 'Unpaid',
        icon: XCircle,
        className:
          'border-white/10 bg-white/5 text-white/50',
      };
  }
};

// ======================================================
// PAGE
// ======================================================

export default function StudentPaymentsPage() {
  const [data, setData] =
    useState<PaymentResponse | null>(null);
    const {user,isLoading} = useAuth()

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  // ====================================================
  // FETCH PAYMENT HISTORY
  // ====================================================

 useEffect(() => {
  // Auth এখনো loading হলে কিছু করবো না
  if (isLoading) return;

  // User না থাকলে API call করার দরকার নেই
  if (!user?.email) {
    setLoading(false);
    setError('Student information পাওয়া যায়নি');
    return;
  }

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axiosSecure.get(
        `/payments/student/${encodeURIComponent(user.email)}`
      );

      if (!response.data?.success) {
        throw new Error(
          'Payment history পাওয়া যায়নি'
        );
      }

      setData(response.data);
    } catch (error: any) {
      console.error(
        'Payment history error:',
        error
      );

      setError(
        error?.response?.data?.message ||
          error?.message ||
          'Payment history load করতে সমস্যা হয়েছে'
      );
    } finally {
      setLoading(false);
    }
  };

  fetchPaymentHistory();
}, [user?.email, isLoading]);

  // ====================================================
  // LOADING
  // ====================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center text-white">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-400" />

          <p className="mt-4 text-sm text-white/40">
            Loading payment history...
          </p>
        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error || !data) {
    return (
      <div className="flex min-h-[500px] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-center text-white">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-400" />

          <h2 className="mt-4 text-lg font-bold">
            Unable to load payments
          </h2>

          <p className="mt-2 text-sm text-white/40">
            {error ||
              'Payment history পাওয়া যায়নি'}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/15"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ====================================================
  // DATA
  // ====================================================

  const {
    student,
    summary,
    history,
  } = data;

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="space-y-6 text-white">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
            <CreditCard className="h-6 w-6 text-emerald-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Payments
            </h1>

            <p className="mt-1 text-sm text-white/40">
              View your fee payment history
              and outstanding balance
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          STUDENT INFO
      ================================================== */}

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/30">
              Student
            </p>

            <h2 className="mt-1 text-xl font-bold">
              {student.name}
            </h2>

            {student.email && (
              <p className="mt-1 text-sm text-white/40">
                {student.email}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-white/30">
                Monthly Fee
              </p>

              <p className="mt-1 font-semibold text-emerald-400">
                {formatCurrency(
                  student.monthlyFee
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-white/30">
                Admission
              </p>

              <p className="mt-1 font-medium text-white/70">
                {formatDate(
                  student.admissionDate
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          SUMMARY
      ================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Fee */}

        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/40">
                Total Fee
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {formatCurrency(
                  summary.totalAmount
                )}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-500/10 p-3">
              <Wallet className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Total Paid */}

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/40">
                Total Paid
              </p>

              <h2 className="mt-2 text-2xl font-bold text-emerald-400">
                {formatCurrency(
                  summary.totalPaid
                )}
              </h2>
            </div>

            <div className="rounded-xl bg-emerald-500/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Outstanding */}

        <div
          className={`rounded-2xl border p-5 ${
            summary.totalOutstanding > 0
              ? 'border-rose-500/20 bg-rose-500/5'
              : 'border-emerald-500/20 bg-emerald-500/5'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/40">
                Outstanding
              </p>

              <h2
                className={`mt-2 text-2xl font-bold ${
                  summary.totalOutstanding > 0
                    ? 'text-rose-400'
                    : 'text-emerald-400'
                }`}
              >
                {formatCurrency(
                  summary.totalOutstanding
                )}
              </h2>
            </div>

            <div
              className={`rounded-xl p-3 ${
                summary.totalOutstanding > 0
                  ? 'bg-rose-500/10'
                  : 'bg-emerald-500/10'
              }`}
            >
              {summary.totalOutstanding > 0 ? (
                <AlertCircle className="h-5 w-5 text-rose-400" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          PAYMENT HISTORY
      ================================================== */}

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">
          <div>
            <h2 className="font-semibold">
              Payment History
            </h2>

            <p className="mt-1 text-xs text-white/30">
              {history.length}{' '}
              {history.length === 1
                ? 'fee cycle'
                : 'fee cycles'}
            </p>
          </div>

          <CalendarDays className="h-5 w-5 text-white/30" />
        </div>

        {/* ==================================================
            DESKTOP TABLE
        ================================================== */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.02]">
              <tr className="text-xs uppercase tracking-wider text-white/30">
                <th className="px-6 py-4">
                  Fee Cycle
                </th>

                <th className="px-6 py-4">
                  Due Date
                </th>

                <th className="px-6 py-4">
                  Amount
                </th>

                <th className="px-6 py-4">
                  Paid
                </th>

                <th className="px-6 py-4">
                  Due
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Payment Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {history.map((fee) => {
                const status =
                  getStatusConfig(
                    fee.status
                  );

                const StatusIcon =
                  status.icon;

                return (
                  <tr
                    key={fee._id}
                    className="transition-colors hover:bg-white/[0.025]"
                  >
                    {/* Cycle */}

                    <td className="px-6 py-5">
                      <p className="font-medium text-white">
                        {formatDate(
                          fee.cycleStartDate
                        )}
                      </p>

                      <p className="mt-1 text-xs text-white/30">
                        to{' '}
                        {formatDate(
                          fee.cycleEndDate
                        )}
                      </p>
                    </td>

                    {/* Due Date */}

                    <td className="px-6 py-5 text-white/60">
                      {formatDate(
                        fee.dueDate
                      )}
                    </td>

                    {/* Amount */}

                    <td className="px-6 py-5 font-medium">
                      {formatCurrency(
                        fee.amount
                      )}
                    </td>

                    {/* Paid */}

                    <td className="px-6 py-5 font-medium text-emerald-400">
                      {formatCurrency(
                        fee.paidAmount
                      )}
                    </td>

                    {/* Due */}

                    <td className="px-6 py-5 font-medium text-amber-400">
                      {formatCurrency(
                        fee.dueAmount
                      )}
                    </td>

                    {/* Status */}

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${status.className}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />

                        {status.label}
                      </span>
                    </td>

                    {/* Payment Date */}

                    <td className="px-6 py-5 text-white/50">
                      {fee.paymentDate
                        ? formatDate(
                            fee.paymentDate
                          )
                        : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ==================================================
            MOBILE CARDS
        ================================================== */}

        <div className="divide-y divide-white/5 md:hidden">
          {history.map((fee) => {
            const status =
              getStatusConfig(
                fee.status
              );

            const StatusIcon =
              status.icon;

            return (
              <div
                key={fee._id}
                className="p-5"
              >
                {/* Top */}

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {formatDate(
                        fee.cycleStartDate
                      )}
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      to{' '}
                      {formatDate(
                        fee.cycleEndDate
                      )}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />

                    {status.label}
                  </span>
                </div>

                {/* Amount Grid */}

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <p className="text-xs text-white/30">
                      Amount
                    </p>

                    <p className="mt-1 font-semibold">
                      {formatCurrency(
                        fee.amount
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-emerald-500/5 p-3">
                    <p className="text-xs text-white/30">
                      Paid
                    </p>

                    <p className="mt-1 font-semibold text-emerald-400">
                      {formatCurrency(
                        fee.paidAmount
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-amber-500/5 p-3">
                    <p className="text-xs text-white/30">
                      Due
                    </p>

                    <p className="mt-1 font-semibold text-amber-400">
                      {formatCurrency(
                        fee.dueAmount
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <p className="text-xs text-white/30">
                      Due Date
                    </p>

                    <p className="mt-1 text-sm font-medium text-white/70">
                      {formatDate(
                        fee.dueDate
                      )}
                    </p>
                  </div>
                </div>

                {/* Payment Date */}

                {fee.paymentDate && (
                  <div className="mt-4 border-t border-white/5 pt-4">
                    <p className="text-xs text-white/30">
                      Payment Date
                    </p>

                    <p className="mt-1 text-sm text-white/60">
                      {formatDate(
                        fee.paymentDate
                      )}
                    </p>
                  </div>
                )}

                {/* Remarks */}

                {fee.remarks && (
                  <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <p className="text-xs text-white/30">
                      Remarks
                    </p>

                    <p className="mt-1 text-sm text-white/60">
                      {fee.remarks}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {history.length === 0 && (
          <div className="px-6 py-16 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-white/15" />

            <h3 className="mt-4 font-semibold text-white/70">
              No payment history
            </h3>

            <p className="mt-1 text-sm text-white/30">
              Your fee records will appear
              here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
