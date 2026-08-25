'use client';

import React from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  DollarSign,
  Search,
} from 'lucide-react';

import PaymentStatusBadge from './PaymentStatusBadge';

import { FeeCycle } from './payment.types';

import {
  formatDate,
  formatMoney,
  getDueAmount,
  getInitials,
  getStudent,
} from './payment.helpers';

import {
  DashboardTableWrapper,
  EmptyState,
} from '../../common';

interface Props {
  fees: FeeCycle[];
  onCollect: (fee: FeeCycle) => void;
}

export default function PaymentTable({
  fees,
  onCollect,
}: Props) {
  return (
    <DashboardTableWrapper className="rounded-3xl">
      {/* ------------------------------------------------------------------ */}
      {/* Desktop Table                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.015]">
              {[
                'Student',
                'Cycle',
                'Due Date',
                'Amount',
                'Paid',
                'Due',
                'Status',
                'Action',
              ].map((header, index) => (
                <th
                  key={header}
                  className={`px-4 py-3 text-${
                    index >= 3 && index <= 5
                      ? 'right'
                      : 'left'
                  } text-[9px] font-bold uppercase tracking-wider text-white/30`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {fees.map((fee) => {
              const student = getStudent(fee);
              const due = getDueAmount(fee);

              return (
                <tr
                  key={fee._id}
                  className="border-b border-white/[0.045] transition-colors hover:bg-white/[0.025]"
                >
                  {/* Student */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#adc6ff]/15 to-[#6ffbbe]/10 text-[10px] font-black text-[#adc6ff]">
                        {getInitials(student?.name)}
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[170px] truncate text-xs font-bold text-white">
                          {student?.name || 'Unknown Student'}
                        </p>

                        <p className="mt-0.5 max-w-[180px] truncate text-[9px] text-white/30">
                          {student?.email ||
                            student?.phone ||
                            `ID: ${student?._id || 'N/A'}`}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Cycle */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 whitespace-nowrap text-[10px] text-white/50">
                      <Calendar
                        size={12}
                        className="text-[#adc6ff]"
                      />

                      {formatDate(fee.cycleStartDate)}

                      <ArrowRight
                        size={10}
                        className="text-white/20"
                      />

                      {formatDate(fee.cycleEndDate)}
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="px-4 py-4 text-[10px] text-white/50">
                    {formatDate(fee.dueDate)}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-4 text-right font-mono text-xs font-bold text-white">
                    {formatMoney(fee.amount)}
                  </td>

                  {/* Paid */}
                  <td className="px-4 py-4 text-right font-mono text-xs font-bold text-[#6ffbbe]">
                    {formatMoney(fee.paidAmount)}
                  </td>

                  {/* Due */}
                  <td className="px-4 py-4 text-right font-mono text-xs font-bold text-rose-400">
                    {formatMoney(due)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <PaymentStatusBadge
                      status={fee.status}
                    />
                  </td>

                  {/* Action */}
                  <td className="px-4 py-4 text-right">
                    {due > 0 ? (
                      <button
                        type="button"
                        onClick={() => onCollect(fee)}
                        className="rounded-xl border border-[#6ffbbe]/10 bg-[#6ffbbe]/5 px-3 py-2 text-[10px] font-bold text-[#6ffbbe] transition hover:bg-[#6ffbbe]/10"
                      >
                        Collect
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#6ffbbe]/50">
                        <CheckCircle2 size={12} />
                        Complete
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile Cards                                                       */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-3 p-3 md:hidden">
        {fees.map((fee) => {
          const student = getStudent(fee);
          const due = getDueAmount(fee);

          return (
            <div
              key={fee._id}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
            >
              {/* Student Header */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#adc6ff]/15 to-[#6ffbbe]/10 text-[10px] font-black text-[#adc6ff]">
                  {getInitials(student?.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2">
                    <p className="truncate text-sm font-bold text-white">
                      {student?.name || 'Unknown Student'}
                    </p>

                    <PaymentStatusBadge
                      status={fee.status}
                    />
                  </div>

                  <p className="mt-0.5 truncate text-[9px] text-white/30">
                    {student?.email ||
                      student?.phone ||
                      `ID: ${student?._id || 'N/A'}`}
                  </p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {/* Cycle */}
                <InfoCard label="Cycle">
                  <p className="mt-1 text-[10px] font-semibold text-white/60">
                    {formatDate(fee.cycleStartDate)}
                  </p>
                </InfoCard>

                {/* Due Date */}
                <InfoCard label="Due Date">
                  <p className="mt-1 text-[10px] font-semibold text-white/60">
                    {formatDate(fee.dueDate)}
                  </p>
                </InfoCard>

                {/* Amount */}
                <InfoCard label="Amount">
                  <p className="mt-1 font-mono text-xs font-bold text-white">
                    {formatMoney(fee.amount)}
                  </p>
                </InfoCard>

                {/* Paid */}
                <InfoCard label="Paid">
                  <p className="mt-1 font-mono text-xs font-bold text-[#6ffbbe]">
                    {formatMoney(fee.paidAmount)}
                  </p>
                </InfoCard>

                {/* Remaining Due */}
                <div className="col-span-2 rounded-xl border border-rose-400/10 bg-rose-400/[0.03] p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-white/25">
                      Remaining Due
                    </p>

                    <p className="font-mono text-sm font-black text-rose-400">
                      {formatMoney(due)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Collect Payment */}
              {due > 0 && (
                <button
                  type="button"
                  onClick={() => onCollect(fee)}
                  className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] text-[10px] font-black text-[#0b1326]"
                >
                  <DollarSign size={14} />
                  Collect Payment
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Empty State                                                        */}
      {/* ------------------------------------------------------------------ */}

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

/* -------------------------------------------------------------------------- */
/* Mobile Info Card                                                          */
/* -------------------------------------------------------------------------- */

function InfoCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/10 p-3">
      <p className="text-[8px] font-bold uppercase tracking-wider text-white/25">
        {label}
      </p>

      {children}
    </div>
  );
}
