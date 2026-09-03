'use client';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  CreditCard,
  Plus,
  RefreshCw,
} from 'lucide-react';

import Swal from 'sweetalert2';

import axiosSecure from '@/lib/axiosSecure';

import {
  FeeCycle,
  FeeSummary,
  formatMoney,
  PaymentCollectionModal,
  PaymentFormState,
  PaymentStats,
  PaymentTable,
} from '@/components/dashboard/addmin/payment-management';

import {
  DashboardPageHeader,
  DashboardToolbar,
  FilterSelect,
  LoadingState,
  RefreshButton,
  SearchInput,
} from '@/components/dashboard/common';



/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PaymentsPage() {
  /* ---------------------------------------------------------------------- */
  /* Payment Data                                                           */
  /* ---------------------------------------------------------------------- */

  const [allPayments, setAllPayments] =
    useState<FeeSummary[]>([]);

  const [summary, setSummary] = useState({
    totalCollected: 0,
    totalPending: 0,
    overdueCount: 0,
  });

  /* ---------------------------------------------------------------------- */
  /* UI State                                                               */
  /* ---------------------------------------------------------------------- */

  const [loading, setLoading] =
    useState(true);

  const [syncing, setSyncing] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  /* ---------------------------------------------------------------------- */
  /* Filters                                                                */
  /* ---------------------------------------------------------------------- */

  const [search, setSearch] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('all');

  /* ---------------------------------------------------------------------- */
  /* History View                                                           */
  /* ---------------------------------------------------------------------- */

  const [historyStudentId, setHistoryStudentId] =
    useState<string | null>(null);

  /* ---------------------------------------------------------------------- */
  /* Payment Modal                                                          */
  /* ---------------------------------------------------------------------- */

  const [fee, setFee] =
    useState<FeeCycle | null>(null);

  const [open, setOpen] =
    useState(false);

  const [form, setForm] =
    useState<PaymentFormState>({
      studentId: '',
      amount: '',
      paymentMethod: 'cash',
      trxId: '',
      remarks: '',
    });

  /* ---------------------------------------------------------------------- */
  /* Fetch Payment Data                                                     */
  /* ---------------------------------------------------------------------- */

  const fetchData = async () => {
    setLoading(true);

    try {
      const [
        summaryRes,
        allPaymentsRes,
      ] = await Promise.all([
        axiosSecure.get(
          '/payments/summary'
        ),
        axiosSecure.get(
          '/payments/all'
        ),
      ]);

      /* -------------------------------------------------------------- */
      /* Payment Records                                                */
      /* -------------------------------------------------------------- */

      const paymentsData =
        allPaymentsRes.data?.data ??
        allPaymentsRes.data ??
        [];

      const payments: FeeSummary[] =
        Array.isArray(paymentsData)
          ? paymentsData
          : [];

      setAllPayments(payments);

      /* -------------------------------------------------------------- */
      /* Summary                                                         */
      /* -------------------------------------------------------------- */

      const s = summaryRes.data?.data ?? summaryRes.data ?? {};

      const calculatedCollected =
        payments.reduce(
          (sum, item) =>
            sum +
            Number(
              item.totalPaid || 0
            ),
          0
        );

      const calculatedPending =
        payments.reduce(
          (sum, item) =>
            sum +
            Number(
              item.totalOutstanding || 0
            ),
          0
        );

      const calculatedOverdue =
        payments.reduce(
          (count, item) =>
            count +
            Number(
              item.overdueCycles || 0
            ),
          0
        );

      setSummary({
        totalCollected:
          Number(s.totalCollected) ||
          calculatedCollected,

        totalPending:
          Number(s.totalPending) ||
          calculatedPending,

        overdueCount:
          Number(s.overdueCount) ||
          calculatedOverdue,
      });
    } catch (error) {
      console.error(
        'Payment fetch error:',
        error
      );

      setAllPayments([]);

      setSummary({
        totalCollected: 0,
        totalPending: 0,
        overdueCount: 0,
      });

      Swal.fire({
        icon: 'error',
        title: 'Unable to load payments',
        text:
          'Please check your connection and try again.',
        background: '#0b1326',
        color: '#fff',
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Initial Fetch                                                          */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Filter Records                                                         */
  /* ---------------------------------------------------------------------- */

  const filtered = useMemo(() => {
    const q =
      search.trim().toLowerCase();

    return allPayments.filter(
      (fee) => {
        const student =
          fee.student;

        /* ------------------------------------------------------------ */
        /* Search                                                        */
        /* ------------------------------------------------------------ */

        const matchSearch =
          !q ||
          student?.name
            ?.toLowerCase()
            .includes(q) ||
          student?.email
            ?.toLowerCase()
            .includes(q) ||
          student?.phone
            ?.toLowerCase()
            .includes(q) ||
          String(
            student?.roll || ''
          )
            .toLowerCase()
            .includes(q) ||
          String(
            student?.className || ''
          )
            .toLowerCase()
            .includes(q) ||
          String(
            student?._id || ''
          )
            .toLowerCase()
            .includes(q) ||
          String(
            fee.studentId || ''
          )
            .toLowerCase()
            .includes(q);

        /* ------------------------------------------------------------ */
        /* Status                                                        */
        /* ------------------------------------------------------------ */

        const outstanding =
          Number(
            fee.totalOutstanding || 0
          );

        const overdue =
          Number(
            fee.overdueCycles || 0
          );

        const totalAmount =
          Number(
            fee.totalAmount || 0
          );

        const totalPaid =
          Number(
            fee.totalPaid || 0
          );

        let currentStatus =
          'paid';

        if (overdue > 0) {
          currentStatus =
            'overdue';
        } else if (
          outstanding > 0 &&
          totalPaid > 0
        ) {
          currentStatus =
            'partial';
        } else if (
          outstanding > 0 &&
          totalPaid === 0
        ) {
          currentStatus =
            'unpaid';
        } else if (
          totalAmount > 0 &&
          totalPaid >= totalAmount
        ) {
          currentStatus =
            'paid';
        }

        const statusMatch =
          statusFilter === 'all' ||
          currentStatus ===
            statusFilter;

        return (
          matchSearch &&
          statusMatch
        );
      }
    );
  }, [
    allPayments,
    search,
    statusFilter,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Total Cycles                                                           */
  /* ---------------------------------------------------------------------- */

  const totalCycles = useMemo(() => {
    return allPayments.reduce(
      (total, fee) =>
        total +
        Number(
          fee.totalCycles || 0
        ),
      0
    );
  }, [allPayments]);

  /* ---------------------------------------------------------------------- */
  /* Open Collection Modal                                                 */
  /* ---------------------------------------------------------------------- */

const openCollect = (
  selected: FeeSummary | null = null
) => {
  if (!selected) {
    setFee(null);

    setForm({
      studentId: '',
      amount: '',
      paymentMethod: 'cash',
      trxId: '',
      remarks: '',
    });

    setOpen(true);

    return;
  }

  /*
   * FeeSummary → FeeCycle
   *
   * PaymentTable summary data পাঠায়।
   * Collection modal cycle-shaped data নেয়।
   */
  const cycle: FeeCycle = {
    _id: selected.studentId,

    studentId:
      selected.studentId,

    student:
      selected.student,

    amount:
      Number(
        selected.totalAmount || 0
      ),

    paidAmount:
      Number(
        selected.totalPaid || 0
      ),

    dueAmount:
      Number(
        selected.totalOutstanding || 0
      ),

    status:
      selected.status,

    totalAmount:
      selected.totalAmount,

    totalPaid:
      selected.totalPaid,

    totalOutstanding:
      selected.totalOutstanding,

    totalCycles:
      selected.totalCycles,

    overdueCycles:
      selected.overdueCycles,

    lastPaymentDate:
      selected.lastPaymentDate,
  };

  setFee(cycle);

  setForm({
    studentId:
      selected.student?._id ||
      selected.studentId ||
      '',

    amount: String(
      Number(
        selected.totalOutstanding || 0
      )
    ),

    paymentMethod: 'cash',

    trxId: '',

    remarks: '',
  });

  setOpen(true);
};


  /* ---------------------------------------------------------------------- */
  /* Close Collection Modal                                                */
  /* ---------------------------------------------------------------------- */

  const closeCollect = () => {
    if (submitting) return;

    setOpen(false);
    setFee(null);

    setForm({
      studentId: '',
      amount: '',
      paymentMethod: 'cash',
      trxId: '',
      remarks: '',
    });
  };

  /* ---------------------------------------------------------------------- */
  /* Open Student History                                                  */
  /* ---------------------------------------------------------------------- */

  const openHistory = (
    studentId: string) => {
    if (!studentId) return;

    setHistoryStudentId(
      studentId
    );
  };

  /* ---------------------------------------------------------------------- */
  /* Close Student History                                                 */
  /* ---------------------------------------------------------------------- */

  const closeHistory = () => {
    setHistoryStudentId(null);
  };

  /* ---------------------------------------------------------------------- */
  /* Sync Fee Cycles                                                        */
  /* ---------------------------------------------------------------------- */

  const sync = async () => {
    if (syncing) return;

    setSyncing(true);

    try {
      const response =
        await axiosSecure.post(
          '/payments/sync-fees'
        );

      await Swal.fire({
        icon: 'success',
        title: 'Fees synchronized',
        text:
          response.data?.message ||
          'Student fee records have been updated successfully.',
        background: '#0b1326',
        color: '#fff',
        confirmButtonColor:
          '#6ffbbe',
      });

      await fetchData();
    } catch (error: any) {
      console.error(
        'Sync error:',
        error
      );

      Swal.fire({
        icon: 'error',
        title: 'Sync failed',
        text:
          error?.response?.data
            ?.message ||
          'Could not synchronize fee records.',
        background: '#0b1326',
        color: '#fff',
      });
    } finally {
      setSyncing(false);
    }
  };


  /* Submit Payment                                                         */
  /* ---------------------------------------------------------------------- */

  const submit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const amount =
      Number(form.amount);

    /* -------------------------------------------------------------- */
    /* Validation                                                     */
    /* -------------------------------------------------------------- */

    if (
      !form.studentId.trim() ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid payment',
        text:
          'Student ID and a valid amount are required.',
        background: '#0b1326',
        color: '#fff',
      });

      return;
    }

    /* -------------------------------------------------------------- */
    /* Prevent Overpayment                                            */
    /* -------------------------------------------------------------- */

    if (
      fee &&
      amount >
        Number(
          fee.totalOutstanding || 0
        )
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid amount',
        text: `Maximum payable amount is ${formatMoney(
          fee.totalOutstanding
        )}.`,
        background: '#0b1326',
        color: '#fff',
      });

      return;
    }

    setSubmitting(true);

    try {
      const response =
        await axiosSecure.post(
          '/payments/pay',
          {
            studentId:
              form.studentId.trim(),

            amount,

            paymentMethod:
              form.paymentMethod,

            trxId:
              form.trxId.trim(),

            remarks:
              form.remarks.trim(),
          }
        );

      if (
        response.data?.success ||
        response.status === 200
      ) {
        await Swal.fire({
          icon: 'success',
          title: 'Payment recorded',
          text: `Successfully processed ${formatMoney(
            amount
          )}.`,
          background: '#0b1326',
          color: '#fff',
          confirmButtonColor:
            '#6ffbbe',
        });

        closeCollect();

        await fetchData();
      }
    } catch (error: any) {
      console.error(
        'Payment error:',
        error
      );

      Swal.fire({
        icon: 'error',
        title: 'Payment failed',
        text:
          error?.response?.data
            ?.message ||
          'Failed to record payment.',
        background: '#0b1326',
        color: '#fff',
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <LoadingState
        message="Loading payment records..."
      />
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="min-h-full w-full space-y-6 overflow-x-hidden text-white">

      {/* ================================================================== */}
      {/* PAGE HEADER                                                        */}
      {/* ================================================================== */}

      <DashboardPageHeader
        eyebrow={
          historyStudentId
            ? 'Student Finance'
            : 'Finance Management'
        }
        title={
          historyStudentId
            ? 'Payment History'
            : 'Payments'
        }
        description={
          historyStudentId
            ? 'View the complete payment history, fee cycles and outstanding balance for this student.'
            : 'Manage student tuition payments, outstanding balances and collection records.'
        }
        icon={CreditCard}
        actions={
          !historyStudentId ? (
            <>
              {/* Sync */}
              <button
                type="button"
                onClick={sync}
                disabled={syncing}
                className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-white/70 transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={
                    syncing
                      ? 'animate-spin'
                      : ''
                  }
                />

                {syncing
                  ? 'Syncing...'
                  : 'Sync Fees'}
              </button>

              {/* Collect */}
              <button
                type="button"
                onClick={() =>
                  openCollect()
                }
                className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] px-5 text-xs font-black text-[#0b1326] transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <Plus size={16} />
                Collect Payment
              </button>
            </>
          ) : null
        }
      />
        <>
          {/* ============================================================ */}
          {/* PAYMENT STATS                                                */}
          {/* ============================================================ */}

          <PaymentStats
            totalCollected={
              summary.totalCollected
            }
            totalPending={
              summary.totalPending
            }
            overdueCount={
              summary.overdueCount
            }
            activeCycles={
              totalCycles
            }
          />

          {/* ============================================================ */}
          {/* PAYMENT RECORDS                                              */}
          {/* ============================================================ */}

          <section className="overflow-hidden">

            {/* -------------------------------------------------------- */}
            {/* Toolbar                                                  */}
            {/* -------------------------------------------------------- */}

            <DashboardToolbar className="mb-6 rounded-2xl border border-white/[0.07] bg-transparent">

              {/* Title */}
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-sm font-black text-white sm:text-base">
                    Payment Records
                  </h2>

                  <p className="mt-1 text-[10px] text-white/30">
                    {filtered.length}{' '}
                    of{' '}
                    {allPayments.length}{' '}
                    students
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex w-full flex-col gap-2 sm:flex-row xl:w-auto">

                <SearchInput
                  value={search}
                  onChange={
                    setSearch
                  }
                  placeholder="Search student..."
                  className="w-full sm:min-w-60"
                />

                <FilterSelect
                  value={
                    statusFilter
                  }
                  onChange={
                    setStatusFilter
                  }
                  options={[
                    {
                      label:
                        'All Status',
                      value:
                        'all',
                    },
                    {
                      label:
                        'Paid',
                      value:
                        'paid',
                    },
                    {
                      label:
                        'Partial',
                      value:
                        'partial',
                    },
                    {
                      label:
                        'Unpaid',
                      value:
                        'unpaid',
                    },
                    {
                      label:
                        'Overdue',
                      value:
                        'overdue',
                    },
                  ]}
                />

                <RefreshButton
                  onClick={
                    fetchData
                  }
                  loading={
                    loading
                  }
                />
              </div>
            </DashboardToolbar>

            {/* -------------------------------------------------------- */}
            {/* Table                                                    */}
            {/* -------------------------------------------------------- */}

            <PaymentTable
              fees={filtered}
              onCollect={
                openCollect
              }
              onViewHistory={
                openHistory
              }
            />
          </section>
        </>

      {/* ================================================================== */}
      {/* PAYMENT COLLECTION MODAL                                          */}
      {/* ================================================================== */}

      <PaymentCollectionModal
        open={open}
        fee={fee}
        form={form}
        submitting={
          submitting
        }
        onChange={(patch) =>
          setForm(
            (prev) => ({
              ...prev,
              ...patch,
            })
          )
        }
        onClose={
          closeCollect
        }
        onSubmit={
          submit
        }
      />
    </div>
  );
}
