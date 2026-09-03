'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock3,
  CreditCard,
  DollarSign,
  Receipt,
  Wallet,
} from 'lucide-react';
import Swal from 'sweetalert2';


import {
  DashboardTableWrapper,
  LoadingState,
} from '@/components/dashboard/common';
import { formatDate, formatMoney } from '../addmin/payment-management';
import { useStudentPaymentHistory } from '@/hooks/useStudentDetails';


/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface PaymentHistoryItem {
  _id: string;
  student: string;
  cycleStartDate: string;
  cycleEndDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  dueAmount: number;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue' | string;
  createdAt: string;
  updatedAt: string;
  paymentDate?: string;
}

export interface StudentPaymentHistoryResponse {
  success: boolean;

  student: {
    id: string;
    name: string;
    admissionDate: string;
    monthlyFee: number;
  };

  summary: {
    totalAmount: number;
    totalPaid: number;
    totalOutstanding: number;
  };

  history: PaymentHistoryItem[];
}

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

interface Props {
  studentId: string;
  onBack?: () => void;
  onViewHistory?: (studentId: string) => void;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function StudentPaymentHistory({
  studentId,
  onBack,
}: Props) {
const {data:studentPaymentHistory,loading} = useStudentPaymentHistory(studentId);
  if (loading) {
    return (
      <LoadingState message="Loading payment history..." />
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Empty                                                                  */
  /* ---------------------------------------------------------------------- */

  if (!studentPaymentHistory) {
    return null;
  }
  const {
    student,
    summary,
    history,
  } = studentPaymentHistory;

  const paidPercentage =
    summary.totalAmount > 0
      ? Math.min(
          100,
          Math.round(
            (summary.totalPaid /
              summary.totalAmount) *
              100
          )
        )
      : 0;

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="space-y-6 text-white">

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft size={16} />
            </button>
          )}

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#adc6ff]/60">
              Payment History
            </p>

            <h1 className="mt-1 text-xl font-black text-white">
              {student.name?.trim() ||
                'Student'}
            </h1>

            <p className="mt-1 text-[10px] text-white/30">
              Complete tuition payment history
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Student Info                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#adc6ff]/20 to-[#6ffbbe]/10 text-xs font-black text-[#adc6ff]">
              {student.name
                ?.trim()
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-black text-white">
                {student.name?.trim()}
              </p>

              <p className="mt-1 text-[9px] text-white/30">
                Student ID: {student.id}
              </p>

              <p className="mt-1 text-[9px] text-white/30">
                Admission:{' '}
                {formatDate(
                  student.admissionDate
                )}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.05] bg-black/10 px-4 py-3">
            <p className="text-[8px] font-bold uppercase tracking-wider text-white/25">
              Monthly Fee
            </p>

            <p className="mt-1 font-mono text-sm font-black text-white">
              {formatMoney(student.monthlyFee)}
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Summary                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

        <SummaryCard
          icon={Receipt}
          label="Total Amount"
          value={formatMoney(
            summary.totalAmount
          )}
          tone="text-white"
          iconTone="text-[#adc6ff]"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Total Paid"
          value={formatMoney(
            summary.totalPaid
          )}
          tone="text-[#6ffbbe]"
          iconTone="text-[#6ffbbe]"
        />

        <SummaryCard
          icon={Wallet}
          label="Outstanding"
          value={formatMoney(
            summary.totalOutstanding
          )}
          tone={
            summary.totalOutstanding > 0
              ? 'text-rose-400'
              : 'text-[#6ffbbe]'
          }
          iconTone={
            summary.totalOutstanding > 0
              ? 'text-rose-400'
              : 'text-[#6ffbbe]'
          }
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Progress                                                            */}
      {/* ------------------------------------------------------------------ */}

      <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/25">
              Payment Progress
            </p>

            <p className="mt-1 text-sm font-black text-white">
              {paidPercentage}% completed
            </p>
          </div>

          <span className="font-mono text-xs font-black text-[#6ffbbe]">
            {formatMoney(summary.totalPaid)}
          </span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] transition-all duration-500"
            style={{
              width: `${paidPercentage}%`,
            }}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* History                                                             */}
      {/* ------------------------------------------------------------------ */}

      <DashboardTableWrapper className="overflow-hidden rounded-3xl">

        <div className="border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-white">
                Payment Timeline
              </h2>

              <p className="mt-1 text-[9px] text-white/25">
                {history.length} payment cycles
              </p>
            </div>

            <CreditCard
              size={17}
              className="text-[#adc6ff]/50"
            />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[850px] border-collapse">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.015]">
                {[
                  'Cycle',
                  'Due Date',
                  'Amount',
                  'Paid',
                  'Due',
                  'Status',
                  'Payment Date',
                ].map((header) => (
                  <th
                    key={header}
                    className="px-5 py-3 text-left text-[8px] font-black uppercase tracking-[0.14em] text-white/25"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {history.map((item) => (
                <HistoryRow
                  key={item._id}
                  item={item}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="space-y-2 p-3 md:hidden">
          {history.map((item) => (
            <HistoryCard
              key={item._id}
              item={item}
            />
          ))}
        </div>

      </DashboardTableWrapper>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Summary Card                                                               */
/* -------------------------------------------------------------------------- */

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
  iconTone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone: string;
  iconTone: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.14em] text-white/25">
            {label}
          </p>

          <p
            className={`mt-2 font-mono text-base font-black ${tone}`}
          >
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04]">
          <Icon
            size={16}
            className={iconTone}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Status Badge                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const config = {
    paid: {
      label: 'Paid',
      className:
        'bg-[#6ffbbe]/[0.07] text-[#6ffbbe] border-[#6ffbbe]/10',
      icon: CheckCircle2,
    },

    partial: {
      label: 'Partial',
      className:
        'bg-amber-400/[0.07] text-amber-400 border-amber-400/10',
      icon: Clock3,
    },

    unpaid: {
      label: 'Unpaid',
      className:
        'bg-rose-400/[0.07] text-rose-400 border-rose-400/10',
      icon: Wallet,
    },

    overdue: {
      label: 'Overdue',
      className:
        'bg-rose-500/[0.09] text-rose-400 border-rose-400/10',
      icon: Clock3,
    },
  };

  const current =
    config[
      status as keyof typeof config
    ] ?? config.unpaid;

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[8px] font-black uppercase tracking-wider ${current.className}`}
    >
      <Icon size={10} />
      {current.label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Desktop History Row                                                        */
/* -------------------------------------------------------------------------- */

function HistoryRow({
  item,
}: {
  item: PaymentHistoryItem;
}) {
  return (
    <tr className="border-b border-white/[0.045] transition hover:bg-white/[0.02]">

      {/* Cycle */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Calendar
            size={12}
            className="text-[#adc6ff]/60"
          />

          <span className="text-[9px] font-semibold text-white/50">
            {formatDate(item.cycleStartDate)}
          </span>

          <span className="text-white/15">
            →
          </span>

          <span className="text-[9px] font-semibold text-white/50">
            {formatDate(item.cycleEndDate)}
          </span>
        </div>
      </td>

      {/* Due Date */}
      <td className="px-5 py-4">
        <span className="text-[9px] text-white/45">
          {formatDate(item.dueDate)}
        </span>
      </td>

      {/* Amount */}
      <td className="px-5 py-4">
        <span className="font-mono text-xs font-bold text-white">
          {formatMoney(item.amount)}
        </span>
      </td>

      {/* Paid */}
      <td className="px-5 py-4">
        <span className="font-mono text-xs font-bold text-[#6ffbbe]">
          {formatMoney(item.paidAmount)}
        </span>
      </td>

      {/* Due */}
      <td className="px-5 py-4">
        <span
          className={`font-mono text-xs font-bold ${
            item.dueAmount > 0
              ? 'text-rose-400'
              : 'text-white/25'
          }`}
        >
          {formatMoney(item.dueAmount)}
        </span>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <StatusBadge status={item.status} />
      </td>

      {/* Payment Date */}
      <td className="px-5 py-4">
        {item.paymentDate ? (
          <span className="text-[9px] text-white/45">
            {formatDate(item.paymentDate)}
          </span>
        ) : (
          <span className="text-[9px] text-white/20">
            —
          </span>
        )}
      </td>
    </tr>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile History Card                                                        */
/* -------------------------------------------------------------------------- */

function HistoryCard({
  item,
}: {
  item: PaymentHistoryItem;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[8px] font-black uppercase tracking-wider text-white/25">
            Payment Cycle
          </p>

          <div className="mt-1 flex items-center gap-1.5">
            <Calendar
              size={11}
              className="text-[#adc6ff]/60"
            />

            <span className="text-[9px] font-bold text-white/55">
              {formatDate(item.cycleStartDate)}
            </span>

            <span className="text-white/15">
              →
            </span>

            <span className="text-[9px] font-bold text-white/55">
              {formatDate(item.cycleEndDate)}
            </span>
          </div>
        </div>

        <StatusBadge status={item.status} />
      </div>

      {/* Amounts */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <MiniAmount
          label="Amount"
          value={formatMoney(item.amount)}
          tone="text-white"
        />

        <MiniAmount
          label="Paid"
          value={formatMoney(item.paidAmount)}
          tone="text-[#6ffbbe]"
        />

        <MiniAmount
          label="Due"
          value={formatMoney(item.dueAmount)}
          tone={
            item.dueAmount > 0
              ? 'text-rose-400'
              : 'text-white/30'
          }
        />
      </div>

      {/* Dates */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-black/10 p-3">
          <p className="text-[8px] uppercase tracking-wider text-white/20">
            Due Date
          </p>

          <p className="mt-1 text-[9px] font-semibold text-white/45">
            {formatDate(item.dueDate)}
          </p>
        </div>

        <div className="rounded-xl bg-black/10 p-3">
          <p className="text-[8px] uppercase tracking-wider text-white/20">
            Payment Date
          </p>

          <p className="mt-1 text-[9px] font-semibold text-white/45">
            {item.paymentDate
              ? formatDate(item.paymentDate)
              : 'Not paid'}
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mini Amount                                                                */
/* -------------------------------------------------------------------------- */

function MiniAmount({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-black/10 p-3">
      <p className="text-[7px] font-bold uppercase tracking-wider text-white/20">
        {label}
      </p>

      <p
        className={`mt-1 font-mono text-[10px] font-black ${tone}`}
      >
        {value}
      </p>
    </div>
  );
}
