'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CreditCard, Search, RefreshCw, DollarSign, AlertCircle, 
  CheckCircle2, Clock, Calendar, ArrowRight, Loader2, User,
  PlusCircle, Filter, X, ArrowUpDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Swal from 'sweetalert2';
import axiosSecure from '@/lib/axiosSecure';

interface StudentInfo {
  _id: string;
  name?: string;
  roll?: string | number;
  email?: string;
  phone?: string;
  className?: string;
}

interface FeeCycle {
  _id: string;
  student?: StudentInfo;
  studentId?: StudentInfo;
  amount: number;
  paidAmount: number;
  dueAmount?: number;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue' | string;
  cycleStartDate?: string;
  cycleEndDate?: string;
  dueDate?: string;
}

interface FinancialSummary {
  totalCollected: number;
  totalPending: number;
  overdueCount: number;
}

type SortField = 'student' | 'amount' | 'dueDate';
type SortOrder = 'asc' | 'desc';

export default function PaymentsPage() {
  const [fees, setFees] = useState<FeeCycle[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalCollected: 0,
    totalPending: 0,
    overdueCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  
  // Custom Table Controls (Pure React State)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [paymentModal, setPaymentModal] = useState<{ open: boolean; fee: FeeCycle | null }>({
    open: false,
    fee: null,
  });

  const [paymentForm, setPaymentForm] = useState({
    studentId: '',
    amount: '',
    paymentMethod: 'cash',
    trxId: '',
    remarks: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [feesRes, summaryRes] = await Promise.all([
        axiosSecure.get('/payments'),
        axiosSecure.get('/payments/summary'),
      ]);

      if (feesRes.data?.success || feesRes.data) {
        const rawList = feesRes.data?.data || feesRes.data;
        setFees(Array.isArray(rawList) ? rawList : []);
      }

      if (summaryRes.data?.success || summaryRes.data) {
        const rawSummary = summaryRes.data?.data || summaryRes.data;
        setSummary({
          totalCollected: Number(rawSummary?.totalCollected) || 0,
          totalPending: Number(rawSummary?.totalPending) || 0,
          overdueCount: Number(rawSummary?.overdueCount) || 0,
        });
      }
    } catch (err) {
      console.warn('API Fetch error:', err);
      setFees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSyncFees = async () => {
    setSyncing(true);
    try {
      const res = await axiosSecure.post('/payments/sync-fees');
      if (res.data?.success || res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Cycles Synchronized',
          text: res.data?.message || 'Student fee cycles updated successfully.',
          background: '#0b1326',
          color: '#fff',
          confirmButtonColor: '#adc6ff',
          customClass: { popup: 'border border-white/10 rounded-3xl shadow-2xl backdrop-blur-2xl' },
        });
        fetchData();
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Sync Failed',
        text: err?.response?.data?.message || 'Could not synchronize fee cycles.',
        background: '#0b1326',
        color: '#fff',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleOpenCollectModal = (fee: FeeCycle | null = null) => {
    const targetStudent = fee?.student || fee?.studentId;
    const dueBalance = fee ? (fee.dueAmount ?? Math.max(0, (fee.amount || 0) - (fee.paidAmount || 0))) : '';

    setPaymentModal({ open: true, fee });
    setPaymentForm({
      studentId: targetStudent?._id || '',
      amount: dueBalance !== '' ? String(dueBalance) : '',
      paymentMethod: 'cash',
      trxId: '',
      remarks: '',
    });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(paymentForm.amount);

    if (!paymentForm.studentId) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Student ID',
        text: 'Please select or provide a valid Student ID.',
        background: '#0b1326',
        color: '#fff',
      });
      return;
    }

    if (!paymentForm.amount || isNaN(numericAmount) || numericAmount <= 0) return;

    setSubmitting(true);
    try {
      const res = await axiosSecure.post('/payments/pay', {
        studentId: paymentForm.studentId,
        amount: numericAmount,
        paymentMethod: paymentForm.paymentMethod,
        trxId: paymentForm.trxId,
        remarks: paymentForm.remarks,
      });

      if (res.data?.success || res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Payment Recorded',
          text: `Successfully processed ৳${numericAmount}`,
          background: '#0b1326',
          color: '#fff',
          confirmButtonColor: '#6ffbbe',
          customClass: { popup: 'border border-white/10 rounded-3xl shadow-2xl' },
        });

        setPaymentModal({ open: false, fee: null });
        fetchData();
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: err?.response?.data?.message || 'Failed to record transaction.',
        background: '#0b1326',
        color: '#fff',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusBadge = (statusStr?: string) => {
    const status = String(statusStr).toLowerCase();
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#6ffbbe]/10 text-[#6ffbbe] border border-[#6ffbbe]/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Paid
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Partial
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#adc6ff]/10 text-[#adc6ff] border border-[#adc6ff]/20">
            <Clock className="w-3.5 h-3.5" /> Unpaid
          </span>
        );
    }
  };

  // 1. Filtering Logic
  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const student = fee.student || fee.studentId;
      const name = student?.name?.toLowerCase() || '';
      const email = student?.email?.toLowerCase() || '';
      const phone = student?.phone?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();

      const matchesSearch = name.includes(query) || email.includes(query) || phone.includes(query);
      const matchesStatus = statusFilter === 'ALL' || String(fee.status).toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [fees, searchQuery, statusFilter]);

  // 2. Sorting Logic
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedFees = useMemo(() => {
    if (!sortField) return filteredFees;

    return [...filteredFees].sort((a, b) => {
      let aVal: any = '';
      let bVal: any = '';

      if (sortField === 'student') {
        aVal = (a.student || a.studentId)?.name || '';
        bVal = (b.student || b.studentId)?.name || '';
      } else if (sortField === 'amount') {
        aVal = a.amount || 0;
        bVal = b.amount || 0;
      } else if (sortField === 'dueDate') {
        aVal = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        bVal = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredFees, sortField, sortOrder]);

  // 3. Pagination Logic
  const totalPages = Math.ceil(sortedFees.length / pageSize) || 1;
  const paginatedFees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedFees.slice(start, start + pageSize);
  }, [sortedFees, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#adc6ff]/20 to-[#6ffbbe]/20 flex items-center justify-center text-[#adc6ff] border border-white/10">
              <CreditCard className="w-5 h-5" />
            </div>
            Fee & Payment Portal
          </h1>
          <p className="text-sm text-white/60 mt-1">Manage student tuition billing, cycle generation, and history</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => handleOpenCollectModal(null)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-3xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] text-[#0b1326] font-semibold text-sm transition-all hover:opacity-90 shadow-lg shadow-[#6ffbbe]/10 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Collect Payment
          </button>

          <button
            onClick={handleSyncFees}
            disabled={syncing}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-3xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium text-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Sync Fee Cycles
          </button>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Total Collected</p>
            <h3 className="text-2xl font-bold text-[#6ffbbe] mt-2">৳{(summary.totalCollected || 0).toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#6ffbbe]/10 border border-[#6ffbbe]/20 flex items-center justify-center text-[#6ffbbe]">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Total Pending</p>
            <h3 className="text-2xl font-bold text-amber-300 mt-2">৳{(summary.totalPending || 0).toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Overdue Accounts</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-2">{summary.overdueCount || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search student, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#adc6ff]/50 text-sm transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <Filter className="w-4 h-4 text-white/40 shrink-0 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#0b1326] border border-white/10 text-white text-sm focus:outline-none focus:border-[#adc6ff]/50 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <button
            onClick={fetchData}
            className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 transition-all cursor-pointer shrink-0"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Pure shadcn Table Component */}
      <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[750px] text-white/80">
            <TableHeader className="bg-white/5 border-b border-white/10">
              <TableRow className="border-b-white/10 hover:bg-transparent">
                <TableHead className="text-white/50 text-xs uppercase tracking-wider h-12 font-semibold">
                  <button
                    onClick={() => handleSort('student')}
                    className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                  >
                    Student <ArrowUpDown className="w-3 h-3 text-white/40" />
                  </button>
                </TableHead>

                <TableHead className="text-white/50 text-xs uppercase tracking-wider h-12 font-semibold">
                  Cycle Period
                </TableHead>

                <TableHead className="text-white/50 text-xs uppercase tracking-wider h-12 font-semibold">
                  <button
                    onClick={() => handleSort('dueDate')}
                    className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                  >
                    Due Date <ArrowUpDown className="w-3 h-3 text-white/40" />
                  </button>
                </TableHead>

                <TableHead className="text-white/50 text-xs uppercase tracking-wider h-12 font-semibold">
                  <button
                    onClick={() => handleSort('amount')}
                    className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                  >
                    Amount <ArrowUpDown className="w-3 h-3 text-white/40" />
                  </button>
                </TableHead>

                <TableHead className="text-white/50 text-xs uppercase tracking-wider h-12 font-semibold">
                  Paid
                </TableHead>

                <TableHead className="text-white/50 text-xs uppercase tracking-wider h-12 font-semibold">
                  Due
                </TableHead>

                <TableHead className="text-white/50 text-xs uppercase tracking-wider h-12 font-semibold">
                  Status
                </TableHead>

                <TableHead className="text-white/50 text-xs uppercase tracking-wider h-12 font-semibold text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-white/5">
              {loading ? (
                <TableRow className="border-b-white/5 hover:bg-transparent">
                  <TableCell colSpan={8} className="h-32 text-center text-white/40">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#adc6ff]" />
                    Fetching payment records...
                  </TableCell>
                </TableRow>
              ) : paginatedFees.length === 0 ? (
                <TableRow className="border-b-white/5 hover:bg-transparent">
                  <TableCell colSpan={8} className="h-32 text-center text-white/40">
                    No payment records found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedFees.map((fee) => {
                  const student = fee.student || fee.studentId || {};
                  const dueBalance = fee.dueAmount ?? Math.max(0, (fee.amount || 0) - (fee.paidAmount || 0));
                  const isCompleted = String(fee.status).toLowerCase() === 'paid';

                  return (
                    <TableRow key={fee._id} className="border-b-white/5 hover:bg-white/5 transition-colors">
                      {/* Student */}
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#adc6ff]/20 to-[#6ffbbe]/20 flex items-center justify-center text-[#adc6ff] font-semibold text-xs border border-white/10 shrink-0">
                            {student?.name ? String(student.name).substring(0, 2).toUpperCase() : <User className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate">{student?.name || 'Unknown Student'}</p>
                            <p className="text-xs text-white/40 truncate">
                              Class {student?.className ?? 'N/A'} {student?.phone ? `• ${student.phone}` : ''}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Cycle Period */}
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1.5 text-xs text-white/70 whitespace-nowrap">
                          <Calendar className="w-3.5 h-3.5 text-[#adc6ff] shrink-0" />
                          {formatDate(fee.cycleStartDate)} <ArrowRight className="w-3 h-3 text-white/30 shrink-0" /> {formatDate(fee.cycleEndDate)}
                        </div>
                      </TableCell>

                      {/* Due Date */}
                      <TableCell className="py-4">
                        <span className="text-xs text-white/70 whitespace-nowrap">{formatDate(fee.dueDate)}</span>
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="py-4 font-semibold text-white whitespace-nowrap">
                        ৳{fee.amount || 0}
                      </TableCell>

                      {/* Paid */}
                      <TableCell className="py-4 font-semibold text-[#6ffbbe] whitespace-nowrap">
                        ৳{fee.paidAmount || 0}
                      </TableCell>

                      {/* Due */}
                      <TableCell className="py-4 font-semibold text-rose-400 whitespace-nowrap">
                        ৳{dueBalance}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-4">
                        {getStatusBadge(fee.status)}
                      </TableCell>

                      {/* Action */}
                      <TableCell className="py-4 text-right whitespace-nowrap">
                        {!isCompleted ? (
                          <button
                            onClick={() => handleOpenCollectModal(fee)}
                            className="px-4 py-2 rounded-2xl bg-[#6ffbbe]/10 hover:bg-[#6ffbbe]/20 text-[#6ffbbe] border border-[#6ffbbe]/20 text-xs font-semibold transition-all cursor-pointer"
                          >
                            Collect Fee
                          </button>
                        ) : (
                          <span className="text-xs text-white/30 font-medium">Completed</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Custom Pagination Footer */}
        {!loading && sortedFees.length > 0 && (
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <div>
              Showing {Math.min((currentPage - 1) * pageSize + 1, sortedFees.length)} to{' '}
              {Math.min(currentPage * pageSize, sortedFees.length)} of {sortedFees.length} entries
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:hover:bg-white/5 cursor-pointer text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-white">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:hover:bg-white/5 cursor-pointer text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Collect Fee Modal */}
      {paymentModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#0b1326] border border-white/10 p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#adc6ff]" />
                Collect Payment
              </h3>
              <button
                type="button"
                onClick={() => setPaymentModal({ open: false, fee: null })}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {paymentModal.fee && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-white/80">
                <p className="text-white/40 font-semibold uppercase tracking-wider">Target Account</p>
                <p className="font-bold text-white text-base">
                  {(paymentModal.fee?.student || paymentModal.fee?.studentId)?.name || 'Unknown'}
                </p>
                <div className="flex justify-between border-t border-white/5 pt-2">
                  <span>Cycle Amount: ৳{paymentModal.fee?.amount || 0}</span>
                  <span className="text-[#6ffbbe] font-medium">Paid: ৳{paymentModal.fee?.paidAmount || 0}</span>
                </div>
                <p className="text-rose-400 font-bold pt-1">
                  Remaining Balance: ৳
                  {paymentModal.fee?.dueAmount ?? Math.max(0, (paymentModal.fee?.amount || 0) - (paymentModal.fee?.paidAmount || 0))}
                </p>
              </div>
            )}

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1.5">Student ID</label>
                <input
                  type="text"
                  required
                  placeholder="Enter Student ID"
                  value={paymentForm.studentId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, studentId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#adc6ff]/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1.5">Payment Amount (৳)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Enter Amount"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#adc6ff]/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1.5">Payment Method</label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0b1326] border border-white/10 text-white text-sm focus:outline-none focus:border-[#adc6ff]/50 cursor-pointer"
                  >
                    <option value="cash">Cash</option>
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="bank">Bank</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1.5">TrxID (Optional)</label>
                  <input
                    type="text"
                    placeholder="TRX12345"
                    value={paymentForm.trxId}
                    onChange={(e) => setPaymentForm({ ...paymentForm, trxId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#adc6ff]/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1.5">Remarks (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Monthly tuition fee"
                  value={paymentForm.remarks}
                  onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#adc6ff]/50 transition-all"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setPaymentModal({ open: false, fee: null })}
                  className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 font-medium text-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] text-[#0b1326] font-semibold text-sm transition-all shadow-lg shadow-[#6ffbbe]/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}