'use client';

import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock3,
  DollarSign,
  Eye,
  GraduationCap,
  Search,
  Wallet,
} from 'lucide-react';

import { FeeSummary } from './payment.types';

import {
  formatDate,
  formatMoney,
  getInitials,
} from './payment.helpers';

import {
  DashboardTableWrapper,
  EmptyState,
} from '../../common';

interface Props {
  fees: FeeSummary[];
  onCollect: (fee: FeeSummary) => void;
  onViewHistory: (studentId: string) => void;
}

export default function PaymentTable({
  fees,
  onCollect,
  onViewHistory,
}: Props) {
  return (
    <DashboardTableWrapper className="overflow-hidden rounded-3xl">
      {/* ================================================================== */}
      {/* Desktop Table                                                      */}
      {/* ================================================================== */}

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1250px] border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              {[
                'Student',
                'Class',
                'Monthly Fee',
                'Cycles',
                'Total Amount',
                'Paid',
                'Outstanding',
                'Overdue',
                'Last Payment',
                'Action',
              ].map((header, index) => (
                <th
                  key={header}
                  className={`px-5 py-4 text-${
                    [2, 3, 4, 5, 6, 7].includes(index)
                      ? 'right'
                      : index === 9
                        ? 'right'
                        : 'left'
                  } text-[9px] font-black uppercase tracking-[0.14em] text-white/25`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {fees.map((fee) => {
              const student = fee.student;

              const totalAmount = Number(fee.totalAmount ?? 0);
              const totalPaid = Number(fee.totalPaid ?? 0);
              const outstanding = Number(
                fee.totalOutstanding ?? 0
              );
              const overdue = Number(
                fee.overdueCycles ?? 0
              );

              const paidPercentage =
                totalAmount > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (totalPaid / totalAmount) * 100
                      )
                    )
                  : 0;

              const isComplete = outstanding <= 0;

              const studentId =
                student?._id ||
                fee.studentId ||
                '';

              return (
                <tr
                  key={studentId}
                  className="group border-b border-white/[0.045] transition-all duration-200 hover:bg-white/[0.025]"
                >
                  {/* ====================================================== */}
                  {/* Student                                                 */}
                  {/* ====================================================== */}

                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#adc6ff]/20 to-[#6ffbbe]/10 text-[10px] font-black text-[#adc6ff] ring-1 ring-white/[0.05]">
                          {getInitials(student?.name)}
                        </div>

                        {isComplete && (
                          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#101827] bg-[#6ffbbe]">
                            <CheckCircle2
                              size={9}
                              className="text-[#07131a]"
                            />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[180px] truncate text-xs font-bold text-white">
                          {student?.name?.trim() ||
                            'Unknown Student'}
                        </p>

                        <p className="mt-1 max-w-[190px] truncate text-[9px] text-white/30">
                          {student?.email ||
                            student?.phone ||
                            `ID: ${studentId || 'N/A'}`}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ====================================================== */}
                  {/* Class                                                   */}
                  {/* ====================================================== */}

                  <td className="px-5 py-5">
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-1.5">
                      <GraduationCap
                        size={12}
                        className="text-[#adc6ff]/70"
                      />

                      <span className="text-[10px] font-bold text-white/60">
                        Class {student?.className || 'N/A'}
                      </span>
                    </div>
                  </td>

                  {/* ====================================================== */}
                  {/* Monthly Fee                                             */}
                  {/* ====================================================== */}

                  <td className="px-5 py-5 text-right">
                    <p className="font-mono text-xs font-bold text-white">
                      {formatMoney(
                        student?.monthlyFee ?? 0
                      )}
                    </p>

                    <p className="mt-1 text-[8px] text-white/20">
                      / month
                    </p>
                  </td>

                  {/* ====================================================== */}
                  {/* Cycles                                                  */}
                  {/* ====================================================== */}

                  <td className="px-5 py-5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-white/70">
                        {fee.totalCycles ?? 0}
                      </span>

                      <span className="text-[8px] uppercase tracking-wider text-white/20">
                        cycles
                      </span>
                    </div>
                  </td>

                  {/* ====================================================== */}
                  {/* Total Amount                                            */}
                  {/* ====================================================== */}

                  <td className="px-5 py-5 text-right">
                    <p className="font-mono text-xs font-bold text-white">
                      {formatMoney(totalAmount)}
                    </p>
                  </td>

                  {/* ====================================================== */}
                  {/* Paid                                                    */}
                  {/* ====================================================== */}

                  <td className="px-5 py-5 text-right">
                    <p className="font-mono text-xs font-bold text-[#6ffbbe]">
                      {formatMoney(totalPaid)}
                    </p>

                    <div className="mt-2 ml-auto h-1 w-16 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe]"
                        style={{
                          width: `${paidPercentage}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-[8px] text-white/20">
                      {paidPercentage}% paid
                    </p>
                  </td>

                  {/* ====================================================== */}
                  {/* Outstanding                                             */}
                  {/* ====================================================== */}

                  <td className="px-5 py-5 text-right">
                    {outstanding > 0 ? (
                      <p className="font-mono text-xs font-bold text-rose-400">
                        {formatMoney(outstanding)}
                      </p>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#6ffbbe]/60">
                        <CheckCircle2 size={11} />
                        Cleared
                      </span>
                    )}
                  </td>

                  {/* ====================================================== */}
                  {/* Overdue                                                 */}
                  {/* ====================================================== */}

                  <td className="px-5 py-5 text-right">
                    {overdue > 0 ? (
                      <span className="inline-flex min-w-[30px] items-center justify-center rounded-lg border border-rose-400/10 bg-rose-400/[0.07] px-2 py-1.5 text-[10px] font-black text-rose-400">
                        {overdue}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#6ffbbe]/50">
                        <CheckCircle2 size={11} />
                        0
                      </span>
                    )}
                  </td>

                  {/* ====================================================== */}
                  {/* Last Payment                                            */}
                  {/* ====================================================== */}

                  <td className="px-5 py-5">
                    {fee.lastPaymentDate ? (
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <Calendar
                          size={11}
                          className="text-[#adc6ff]/60"
                        />

                        <span className="text-[9px] font-semibold text-white/45">
                          {formatDate(
                            fee.lastPaymentDate
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[9px] text-white/20">
                        No payment
                      </span>
                    )}
                  </td>

                  {/* ====================================================== */}
                  {/* Action                                                  */}
                  {/* ====================================================== */}

                  <td className="px-5 py-5">
                    <div className="flex items-center justify-end gap-2">
                      {/* History */}

                      <button
                        type="button"
                        onClick={() =>
                          studentId &&
                          onViewHistory(studentId)
                        }
                        disabled={!studentId}
                        title="View payment history"
                        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#adc6ff]/10 bg-[#adc6ff]/[0.05] px-3 text-[9px] font-black text-[#adc6ff] transition-all hover:border-[#adc6ff]/25 hover:bg-[#adc6ff]/10 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Eye size={12} />
                        History
                      </button>

                      {/* Collect */}

                      {outstanding > 0 ? (
                        <button
                          type="button"
                          onClick={() =>
                            onCollect(fee)
                          }
                          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#6ffbbe]/10 bg-[#6ffbbe]/[0.06] px-3 text-[9px] font-black text-[#6ffbbe] transition-all hover:border-[#6ffbbe]/20 hover:bg-[#6ffbbe]/10"
                        >
                          <DollarSign size={12} />
                          Collect
                        </button>
                      ) : (
                        <span className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#6ffbbe]/10 bg-[#6ffbbe]/[0.03] px-3 text-[9px] font-bold text-[#6ffbbe]/40">
                          <CheckCircle2 size={12} />
                          Complete
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================================================================== */}
      {/* Mobile Cards                                                       */}
      {/* ================================================================== */}

      <div className="space-y-3 p-3 lg:hidden">
        {fees.map((fee) => {
          const student = fee.student;

          const totalAmount = Number(
            fee.totalAmount ?? 0
          );

          const totalPaid = Number(
            fee.totalPaid ?? 0
          );

          const outstanding = Number(
            fee.totalOutstanding ?? 0
          );

          const overdue = Number(
            fee.overdueCycles ?? 0
          );

          const paidPercentage =
            totalAmount > 0
              ? Math.min(
                  100,
                  Math.round(
                    (totalPaid / totalAmount) * 100
                  )
                )
              : 0;

          const isComplete =
            outstanding <= 0;

          const studentId =
            student?._id ||
            fee.studentId ||
            '';

          return (
            <div
              key={studentId}
              className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]"
            >
              {/* ======================================================== */}
              {/* Card Header                                                */}
              {/* ======================================================== */}

              <div className="border-b border-white/[0.05] p-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#adc6ff]/20 to-[#6ffbbe]/10 text-[11px] font-black text-[#adc6ff]">
                      {getInitials(student?.name)}
                    </div>

                    {isComplete && (
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#101827] bg-[#6ffbbe]">
                        <CheckCircle2
                          size={9}
                          className="text-[#07131a]"
                        />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                          {student?.name?.trim() ||
                            'Unknown Student'}
                        </p>

                        <p className="mt-1 truncate text-[9px] text-white/30">
                          {student?.email ||
                            student?.phone ||
                            `ID: ${studentId || 'N/A'}`}
                        </p>
                      </div>

                      {isComplete ? (
                        <span className="shrink-0 rounded-lg bg-[#6ffbbe]/[0.07] px-2 py-1 text-[8px] font-black uppercase tracking-wider text-[#6ffbbe]">
                          Paid
                        </span>
                      ) : overdue > 0 ? (
                        <span className="shrink-0 rounded-lg bg-rose-400/[0.08] px-2 py-1 text-[8px] font-black uppercase tracking-wider text-rose-400">
                          Overdue
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-lg bg-amber-400/[0.08] px-2 py-1 text-[8px] font-black uppercase tracking-wider text-amber-400">
                          Due
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* Main Balance                                               */}
              {/* ======================================================== */}

              <div className="p-4">
                <div className="rounded-2xl border border-white/[0.06] bg-black/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/25">
                        Outstanding
                      </p>

                      <p
                        className={`mt-1 font-mono text-xl font-black ${
                          outstanding > 0
                            ? 'text-rose-400'
                            : 'text-[#6ffbbe]'
                        }`}
                      >
                        {formatMoney(outstanding)}
                      </p>
                    </div>

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        outstanding > 0
                          ? 'bg-rose-400/10 text-rose-400'
                          : 'bg-[#6ffbbe]/10 text-[#6ffbbe]'
                      }`}
                    >
                      {outstanding > 0 ? (
                        <Wallet size={18} />
                      ) : (
                        <CheckCircle2 size={18} />
                      )}
                    </div>
                  </div>

                  {/* Progress */}

                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[8px] text-white/25">
                        Payment progress
                      </span>

                      <span className="font-mono text-[8px] font-bold text-white/40">
                        {paidPercentage}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] transition-all"
                        style={{
                          width: `${paidPercentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* ====================================================== */}
                {/* Details                                                  */}
                {/* ====================================================== */}

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <InfoCard
                    label="Class"
                    icon={GraduationCap}
                  >
                    <p className="mt-1 text-xs font-bold text-white/70">
                      Class{' '}
                      {student?.className ||
                        'N/A'}
                    </p>
                  </InfoCard>

                  <InfoCard
                    label="Monthly Fee"
                    icon={DollarSign}
                  >
                    <p className="mt-1 font-mono text-xs font-bold text-white/70">
                      {formatMoney(
                        student?.monthlyFee ?? 0
                      )}
                    </p>
                  </InfoCard>

                  <InfoCard
                    label="Total Cycles"
                    icon={Clock3}
                  >
                    <p className="mt-1 font-mono text-xs font-bold text-white/70">
                      {fee.totalCycles ?? 0}
                    </p>
                  </InfoCard>

                  <InfoCard
                    label="Total Amount"
                    icon={DollarSign}
                  >
                    <p className="mt-1 font-mono text-xs font-bold text-white/70">
                      {formatMoney(totalAmount)}
                    </p>
                  </InfoCard>

                  <InfoCard
                    label="Total Paid"
                    icon={CheckCircle2}
                  >
                    <p className="mt-1 font-mono text-xs font-bold text-[#6ffbbe]">
                      {formatMoney(totalPaid)}
                    </p>
                  </InfoCard>

                  <InfoCard
                    label="Overdue Cycles"
                    icon={Clock3}
                  >
                    <p
                      className={`mt-1 font-mono text-xs font-bold ${
                        overdue > 0
                          ? 'text-rose-400'
                          : 'text-white/50'
                      }`}
                    >
                      {overdue}
                    </p>
                  </InfoCard>
                </div>

                {/* ====================================================== */}
                {/* Last Payment                                             */}
                {/* ====================================================== */}

                <div className="mt-2 flex items-center justify-between rounded-xl border border-white/[0.05] bg-black/10 px-3 py-3">
                  <div className="flex items-center gap-2">
                    <Calendar
                      size={12}
                      className="text-[#adc6ff]/60"
                    />

                    <span className="text-[8px] font-bold uppercase tracking-wider text-white/25">
                      Last Payment
                    </span>
                  </div>

                  <span className="text-[9px] font-semibold text-white/50">
                    {fee.lastPaymentDate
                      ? formatDate(
                          fee.lastPaymentDate
                        )
                      : 'No payment'}
                  </span>
                </div>

                {/* ====================================================== */}
                {/* Mobile Actions                                           */}
                {/* ====================================================== */}

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      studentId &&
                      onViewHistory(studentId)
                    }
                    disabled={!studentId}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#adc6ff]/10 bg-[#adc6ff]/[0.06] text-[10px] font-black text-[#adc6ff] transition-all hover:bg-[#adc6ff]/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Eye size={14} />
                    History
                  </button>

                  {outstanding > 0 ? (
                    <button
                      type="button"
                      onClick={() =>
                        onCollect(fee)
                      }
                      className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] text-[10px] font-black text-[#0b1326] shadow-lg shadow-[#6ffbbe]/5 transition-transform active:scale-[0.98]"
                    >
                      <DollarSign size={14} />
                      Collect
                    </button>
                  ) : (
                    <div className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#6ffbbe]/10 bg-[#6ffbbe]/[0.04] text-[10px] font-black text-[#6ffbbe]/60">
                      <CheckCircle2 size={14} />
                      Complete
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================================================================== */}
      {/* Empty State                                                        */}
      {/* ================================================================== */}

      {fees.length === 0 && (
        <EmptyState
          title="No payment records found"
          description="Try changing your search or status filter."
          icon={Search}
        />
      )}
    </DashboardTableWrapper>
  );
}

/* ========================================================================== */
/* Mobile Info Card                                                           */
/* ========================================================================== */

function InfoCard({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-black/10 p-3">
      <div className="flex items-center gap-1.5">
        <Icon
          size={10}
          className="text-white/20"
        />

        <p className="text-[8px] font-bold uppercase tracking-wider text-white/25">
          {label}
        </p>
      </div>

      {children}
    </div>
  );
}
