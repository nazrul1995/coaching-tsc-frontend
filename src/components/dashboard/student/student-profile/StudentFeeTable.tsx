'use client';

import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { FeeHistory } from '@/types/student';
import { DataTable, DataTableColumnHeader } from '@/components/common/table';
import { formatDate, formatMoney } from '../../addmin/payment-management';

interface StudentFeeTableProps {
  fees: FeeHistory[];
}

export default function StudentFeeTable({
  fees,
}: StudentFeeTableProps) {
  const columns: ColumnDef<FeeHistory>[] = [
    {
      id: 'cycle',
      accessorFn: (row) => row.cycleStartDate,

      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Billing Cycle"
        />
      ),

      cell: ({ row }) => {
        const fee = row.original;

        return (
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Calendar
              size={12}
              className="text-[#adc6ff]"
            />

            <span className="text-[10px] text-white/60">
              {formatDate(fee.cycleStartDate)}
            </span>

            <ArrowRight
              size={10}
              className="text-white/20"
            />

            <span className="text-[10px] text-white/60">
              {formatDate(fee.cycleEndDate)}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: 'dueDate',

      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Due Date"
        />
      ),

      cell: ({ row }) => (
        <span className="text-[10px] text-white/50">
          {formatDate(row.original.dueDate)}
        </span>
      ),
    },

    {
      accessorKey: 'amount',

      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Amount"
        />
      ),

      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-white">
          {formatMoney(row.original.amount)}
        </span>
      ),
    },

    {
      accessorKey: 'paidAmount',

      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Paid"
        />
      ),

      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-[#6ffbbe]">
          {formatMoney(row.original.paidAmount)}
        </span>
      ),
    },

    {
      id: 'outstanding',

      accessorFn: (row) =>
        Math.max(0, row.amount - row.paidAmount),

      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Outstanding"
        />
      ),

      cell: ({ row }) => {
        const fee = row.original;

        const outstanding = Math.max(
          0,
          fee.amount - fee.paidAmount
        );

        return (
          <span className="font-mono text-xs font-bold text-rose-400">
            {formatMoney(outstanding)}
          </span>
        );
      },
    },

    {
      accessorKey: 'status',

      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
        />
      ),

      cell: ({ row }) => {
        const status = row.original.status;

        const statusClass =
          status === 'paid'
            ? 'bg-emerald-500/10 text-emerald-400'
            : status === 'partial'
            ? 'bg-amber-500/10 text-amber-400'
            : status === 'overdue'
            ? 'bg-rose-500/10 text-rose-400'
            : 'bg-white/10 text-white/50';

        return (
          <span
            className={`rounded-full px-2.5 py-1 text-[9px] font-bold capitalize ${statusClass}`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={fees}
    />
  );
}
