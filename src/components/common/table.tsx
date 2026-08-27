"use client";

import React, { useState } from "react";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal, Search } from "lucide-react";

export interface RowAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
}

export interface FacetedFilterOption {
  label: string;
  value: string;
}

export interface FacetedFilter {
  columnId: string;
  title: string;
  icon?: React.ReactNode;
  options: FacetedFilterOption[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowActions?: RowAction<TData>[];
  filters?: FacetedFilter[];
}

// Header with sorting toggle
export function DataTableColumnHeader<TData, TValue>({ column, title }: { column: Column<TData, TValue>; title: string }) {
  return (
    <button
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white"
    >
      {title}
      <ArrowUpDown className="size-3 text-[#adc6ff]" />
    </button>
  );
}

// Main Table Component
export function DataTable<TData, TValue>({ columns, data, rowActions, filters }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all records..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:border-[#adc6ff]/50 focus:outline-none"
          />
        </div>

        {filters && filters.length > 0 && (
          <div className="flex items-center gap-2">
            {filters.map((filter) => (
              <select
                key={filter.columnId}
                onChange={(e) => table.getColumn(filter.columnId)?.setFilterValue(e.target.value || undefined)}
                className="rounded-2xl border border-white/10 bg-[#0b1326] px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="">All {filter.title}s</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0b1326]/40">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-white/5">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3.5 font-semibold text-white/80">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
                {rowActions && <th className="px-4 py-3.5 text-right text-white/60">Actions</th>}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-white/5">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3.5 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-4 py-3.5 text-right relative">
                      <button
                        onClick={() => setActiveMenuIndex(activeMenuIndex === idx ? null : idx)}
                        className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-white/60 hover:text-white"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>

                      {activeMenuIndex === idx && (
                        <div className="absolute right-4 top-10 z-20 w-36 rounded-2xl border border-white/10 bg-[#0b1326] p-1.5 shadow-2xl">
                          {rowActions.map((action, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => {
                                action.onClick(row.original);
                                setActiveMenuIndex(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-white hover:bg-white/10"
                            >
                              {action.icon}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)} className="py-8 text-center text-white/40">
                  No payment records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-3 py-2 text-xs text-white/60">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}