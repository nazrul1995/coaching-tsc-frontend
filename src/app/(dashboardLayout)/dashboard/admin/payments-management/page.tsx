'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Clock,
  CreditCard,
  Plus,
  RefreshCw,
} from 'lucide-react';
import Swal from 'sweetalert2';

import axiosSecure from '@/lib/axiosSecure';
import { FeeCycle, formatMoney, getDueAmount, getStudent, PaymentCollectionModal, PaymentFormState, PaymentStats, PaymentTable } from '@/components/dashboard/addmin/payment-management';
import { DashboardPageHeader, DashboardToolbar, FilterSelect, LoadingState, RefreshButton, SearchInput } from '@/components/dashboard/common';


export default function PaymentsPage() {
  const [fees, setFees] = useState<FeeCycle[]>([]);

  const [summary, setSummary] = useState({
    totalCollected: 0,
    totalPending: 0,
    overdueCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [fee, setFee] = useState<FeeCycle | null>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<PaymentFormState>({
    studentId: '',
    amount: '',
    paymentMethod: 'cash',
    trxId: '',
    remarks: '',
  });

  // Fetch payment data
  const fetchData = async () => {
    setLoading(true);

    try {
      const [feesRes, summaryRes] = await Promise.all([
        axiosSecure.get('/payments'),
        axiosSecure.get('/payments/summary'),
      ]);

      const raw = feesRes.data?.data ?? feesRes.data ?? [];

      setFees(Array.isArray(raw) ? raw : []);

      const s = summaryRes.data?.data ?? summaryRes.data ?? {};

      setSummary({
        totalCollected: Number(s.totalCollected) || 0,
        totalPending: Number(s.totalPending) || 0,
        overdueCount: Number(s.overdueCount) || 0,
      });
    } catch (error) {
      console.error(error);

      setFees([]);

      Swal.fire({
        icon: 'error',
        title: 'Unable to load payments',
        text: 'Please check your connection and try again.',
        background: '#0b1326',
        color: '#fff',
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Filter payment records
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return fees.filter((f) => {
      const student = getStudent(f);

      const match =
        !q ||
        student?.name?.toLowerCase().includes(q) ||
        student?.email?.toLowerCase().includes(q) ||
        student?.phone?.toLowerCase().includes(q) ||
        String(student?.roll || '')
          .toLowerCase()
          .includes(q) ||
        String(student?._id || '')
          .toLowerCase()
          .includes(q);

      const statusMatch =
        statusFilter === 'all' ||
        String(f.status).toLowerCase() === statusFilter;

      return match && statusMatch;
    });
  }, [fees, search, statusFilter]);

  // Open payment collection modal
  const openCollect = (selected: FeeCycle | null = null) => {
    setFee(selected);

    setForm({
      studentId: selected ? getStudent(selected)?._id || '' : '',
      amount: selected ? String(getDueAmount(selected)) : '',
      paymentMethod: 'cash',
      trxId: '',
      remarks: '',
    });

    setOpen(true);
  };

  // Sync fee cycles
  const sync = async () => {
    if (syncing) return;

    setSyncing(true);

    try {
      const response = await axiosSecure.post('/payments/sync-fees');

      await Swal.fire({
        icon: 'success',
        title: 'Cycles synchronized',
        text:
          response.data?.message ||
          'Fee cycles have been updated successfully.',
        background: '#0b1326',
        color: '#fff',
        confirmButtonColor: '#6ffbbe',
      });

      await fetchData();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Sync failed',
        text:
          error?.response?.data?.message ||
          'Could not synchronize fee cycles.',
        background: '#0b1326',
        color: '#fff',
      });
    } finally {
      setSyncing(false);
    }
  };

  // Submit payment
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const amount = Number(form.amount);

    if (!form.studentId.trim() || amount <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid payment',
        text: 'Student ID and a valid amount are required.',
        background: '#0b1326',
        color: '#fff',
      });

      return;
    }

    setSubmitting(true);

    try {
      const response = await axiosSecure.post('/payments/pay', {
        studentId: form.studentId.trim(),
        amount,
        paymentMethod: form.paymentMethod,
        trxId: form.trxId.trim(),
        remarks: form.remarks.trim(),
      });

      if (response.data?.success || response.status === 200) {
        await Swal.fire({
          icon: 'success',
          title: 'Payment recorded',
          text: `Successfully processed ${formatMoney(amount)}.`,
          background: '#0b1326',
          color: '#fff',
          confirmButtonColor: '#6ffbbe',
        });

        setOpen(false);
        setFee(null);

        setForm({
          studentId: '',
          amount: '',
          paymentMethod: 'cash',
          trxId: '',
          remarks: '',
        });

        await fetchData();
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Payment failed',
        text:
          error?.response?.data?.message ||
          'Failed to record payment.',
        background: '#0b1326',
        color: '#fff',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingState message="Loading payment records..." />;
  }

  return (
    <div className="min-h-full w-full overflow-x-hidden text-white space-y-6">
      {/* Page Header */}
      <DashboardPageHeader
        eyebrow="Finance Management"
        title="Payments"
        description="Manage student tuition payments, outstanding balances, fee cycles and collection records."
        icon={CreditCard}
        actions={
          <>
            <button
              onClick={sync}
              disabled={syncing}
              className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-white/70 disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={syncing ? 'animate-spin' : ''}
              />

              {syncing ? 'Syncing...' : 'Sync Cycles'}
            </button>

            <button
              onClick={() => openCollect()}
              className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] px-5 text-xs font-black text-[#0b1326]"
            >
              <Plus size={16} />
              Collect Payment
            </button>
          </>
        }
      />

      {/* Payment Stats */}
      <PaymentStats
        totalCollected={summary.totalCollected}
        totalPending={summary.totalPending}
        overdueCount={summary.overdueCount}
        activeCycles={fees.length}
      />

      {/* Financial Overview */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-linear-to-br from-[#adc6ff]/[0.07] via-white/[0.025] to-[#6ffbbe]/[0.05] p-5 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/35">
            Financial Overview
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {formatMoney(summary.totalCollected)}
          </h2>

          <p className="mt-1 text-xs text-[#6ffbbe]/70">
            Total revenue collected
          </p>

          <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Mini
              label="Pending"
              value={formatMoney(summary.totalPending)}
              tone="text-amber-300"
            />

            <Mini
              label="Overdue"
              value={summary.overdueCount}
              tone="text-rose-400"
            />

            <Mini
              label="Records"
              value={fees.length}
              tone="text-[#adc6ff]"
            />
          </div>
        </div>

        {/* Collection Overview */}
        <div className="rounded-3xl border border-white/8 bg-white/2.5 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#adc6ff]/10">
              <Clock size={18} className="text-[#adc6ff]" />
            </div>

            <div>
              <p className="text-xs font-bold text-white">
                Collection Overview
              </p>

              <p className="text-[10px] text-white/30">
                Outstanding payment status
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <Row
              icon={AlertCircle}
              label="Overdue"
              value={summary.overdueCount}
              tone="text-rose-400"
            />

            <Row
              icon={Clock}
              label="Pending"
              value={formatMoney(summary.totalPending)}
              tone="text-amber-300"
            />
          </div>
        </div>
      </section>

      {/* Payment Records */}
      <section className="overflow-hidden rounded-3xl border border-white/8 bg-white/2.5">
        <DashboardToolbar className="rounded-none border-0 mb-10 border-white/[0.07] bg-transparent">
          <div className='flex items-center gap-3'>
            <h2 className="text-sm font-black text-white sm:text-base">
              Payment Records
            </h2>

            <p className="mt-1 text-[10px] text-white/30">
              {filtered.length} of {fees.length} records
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row xl:w-auto">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search student..."
              className="w-full sm:min-w-60"
            />

            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Paid', value: 'paid' },
                { label: 'Partial', value: 'partial' },
                { label: 'Unpaid', value: 'unpaid' },
                { label: 'Overdue', value: 'overdue' },
              ]}
            />

            <RefreshButton
              onClick={fetchData}
              loading={loading}
            />
          </div>
        </DashboardToolbar>

        <PaymentTable
          fees={filtered}
          onCollect={openCollect}
        />
      </section>

      {/* Payment Collection Modal */}
      <PaymentCollectionModal
        open={open}
        fee={fee}
        form={form}
        submitting={submitting}
        onChange={(patch) =>
          setForm((prev) => ({
            ...prev,
            ...patch,
          }))
        }
        onClose={() => setOpen(false)}
        onSubmit={submit}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helper Components                                                          */
/* -------------------------------------------------------------------------- */

function Mini({
  label,
  value,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/10 p-3">
      <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">
        {label}
      </p>

      <p className={`mt-1 text-sm font-black ${tone}`}>
        {value}
      </p>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.025] p-3">
      <div className="flex items-center gap-2">
        <Icon size={15} className={tone} />

        <span className="text-[11px] text-white/60">
          {label}
        </span>
      </div>

      <span className={`text-xs font-black ${tone}`}>
        {value}
      </span>
    </div>
  );
}
