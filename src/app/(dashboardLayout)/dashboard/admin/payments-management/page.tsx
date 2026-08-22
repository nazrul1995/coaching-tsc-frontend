"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  DollarSign,
  Filter,
  Loader2,
  Menu,
  Plus,
  RefreshCw,
  Search,
  User,
  Wallet,
  X,
} from "lucide-react";

import Swal from "sweetalert2";
import axiosSecure from "@/lib/axiosSecure";

/* ========================================================================= */
/* TYPES                                                                     */
/* ========================================================================= */

export interface StudentInfo {
  _id: string;
  name?: string;
  roll?: string | number;
  email?: string;
  phone?: string;
  className?: string;
}

export interface FeeCycle {
  _id: string;
  student?: StudentInfo;
  studentId?: StudentInfo;
  amount: number;
  paidAmount: number;
  dueAmount?: number;
  status: "unpaid" | "partial" | "paid" | "overdue" | string;
  cycleStartDate?: string;
  cycleEndDate?: string;
  dueDate?: string;
}

/* ========================================================================= */
/* HELPERS                                                                   */
/* ========================================================================= */

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatMoney = (amount: number = 0) => {
  return `৳${Number(amount || 0).toLocaleString()}`;
};

const getStudent = (fee: FeeCycle) => {
  return fee.student || fee.studentId;
};

const getDueAmount = (fee: FeeCycle) => {
  return (
    fee.dueAmount ??
    Math.max(
      0,
      Number(fee.amount || 0) - Number(fee.paidAmount || 0)
    )
  );
};

/* ========================================================================= */
/* STATUS BADGE                                                              */
/* ========================================================================= */

function PaymentStatusBadge({ status }: { status?: string }) {
  const normalized = String(status || "unpaid").toLowerCase();

  const config = {
    paid: {
      label: "Paid",
      dot: "bg-[#6ffbbe]",
      className:
        "border-[#6ffbbe]/20 bg-[#6ffbbe]/10 text-[#6ffbbe]",
    },
    partial: {
      label: "Partial",
      dot: "bg-amber-400",
      className:
        "border-amber-400/20 bg-amber-400/10 text-amber-300",
    },
    overdue: {
      label: "Overdue",
      dot: "bg-rose-400",
      className:
        "border-rose-400/20 bg-rose-400/10 text-rose-300",
    },
    unpaid: {
      label: "Unpaid",
      dot: "bg-[#adc6ff]",
      className:
        "border-[#adc6ff]/20 bg-[#adc6ff]/10 text-[#adc6ff]",
    },
  }[normalized as "paid" | "partial" | "overdue" | "unpaid"] || {
    label: normalized,
    dot: "bg-white/50",
    className: "border-white/10 bg-white/5 text-white/70",
  };

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

/* ========================================================================= */
/* STAT CARD                                                                 */
/* ========================================================================= */

function PaymentStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  color: "blue" | "green" | "amber" | "rose";
}) {
  const colors = {
    blue: {
      icon: "text-[#adc6ff]",
      bg: "bg-[#adc6ff]/10",
      glow: "bg-[#adc6ff]/10",
    },
    green: {
      icon: "text-[#6ffbbe]",
      bg: "bg-[#6ffbbe]/10",
      glow: "bg-[#6ffbbe]/10",
    },
    amber: {
      icon: "text-amber-300",
      bg: "bg-amber-400/10",
      glow: "bg-amber-400/10",
    },
    rose: {
      icon: "text-rose-400",
      bg: "bg-rose-400/10",
      glow: "bg-rose-400/10",
    },
  };

  const theme = colors[color];

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14]">
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl ${theme.glow}`}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${theme.bg}`}
          >
            <Icon size={20} className={theme.icon} />
          </div>

          <span className="rounded-full border border-white/5 bg-white/[0.03] px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-white/30">
            Lens
          </span>
        </div>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/35">
          {title}
        </p>

        <p className="mt-1 truncate text-2xl font-black tracking-tight text-white sm:text-3xl">
          {value}
        </p>

        <p className="mt-2 text-[11px] text-white/35">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* PAGE                                                                      */
/* ========================================================================= */

export default function PaymentsPage() {
  const [fees, setFees] = useState<FeeCycle[]>([]);

  const [summary, setSummary] = useState({
    totalCollected: 0,
    totalPending: 0,
    overdueCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    fee: FeeCycle | null;
  }>({
    open: false,
    fee: null,
  });

  const [paymentForm, setPaymentForm] = useState({
    studentId: "",
    amount: "",
    paymentMethod: "cash",
    trxId: "",
    remarks: "",
  });

  const [submitting, setSubmitting] = useState(false);

  /* ----------------------------------------------------------------------- */
  /* FETCH                                                                   */
  /* ----------------------------------------------------------------------- */

  const fetchData = async () => {
    setLoading(true);

    try {
      const [feesRes, summaryRes] = await Promise.all([
        axiosSecure.get("/payments"),
        axiosSecure.get("/payments/summary"),
      ]);

      const rawFees = feesRes.data?.data ?? feesRes.data ?? [];

      setFees(Array.isArray(rawFees) ? rawFees : []);

      const rawSummary =
        summaryRes.data?.data ?? summaryRes.data ?? {};

      setSummary({
        totalCollected: Number(rawSummary?.totalCollected) || 0,
        totalPending: Number(rawSummary?.totalPending) || 0,
        overdueCount: Number(rawSummary?.overdueCount) || 0,
      });
    } catch (error) {
      console.error("Payment fetch error:", error);

      setFees([]);

      Swal.fire({
        icon: "error",
        title: "Unable to load payments",
        text: "Please check your connection and try again.",
        background: "#0b1326",
        color: "#fff",
        confirmButtonColor: "#6ffbbe",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ----------------------------------------------------------------------- */
  /* FILTER                                                                  */
  /* ----------------------------------------------------------------------- */

  const filteredFees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return fees.filter((fee) => {
      const student = getStudent(fee);

      const matchesSearch =
        !query ||
        student?.name?.toLowerCase().includes(query) ||
        student?.email?.toLowerCase().includes(query) ||
        student?.phone?.toLowerCase().includes(query) ||
        String(student?.roll || "")
          .toLowerCase()
          .includes(query) ||
        String(student?._id || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        String(fee.status).toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [fees, search, statusFilter]);

  /* ----------------------------------------------------------------------- */
  /* SYNC                                                                    */
  /* ----------------------------------------------------------------------- */

  const handleSyncFees = async () => {
    if (syncing) return;

    setSyncing(true);

    try {
      const response = await axiosSecure.post(
        "/payments/sync-fees"
      );

      if (response.data?.success || response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Cycles synchronized",
          text:
            response.data?.message ||
            "Fee cycles have been updated successfully.",
          background: "#0b1326",
          color: "#fff",
          confirmButtonColor: "#6ffbbe",
        });

        await fetchData();
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Sync failed",
        text:
          error?.response?.data?.message ||
          "Could not synchronize fee cycles.",
        background: "#0b1326",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSyncing(false);
    }
  };

  /* ----------------------------------------------------------------------- */
  /* OPEN MODAL                                                              */
  /* ----------------------------------------------------------------------- */

  const handleOpenCollectModal = (fee: FeeCycle | null = null) => {
    const student = fee ? getStudent(fee) : undefined;

    setPaymentModal({
      open: true,
      fee,
    });

    setPaymentForm({
      studentId: student?._id || "",
      amount: fee ? String(getDueAmount(fee)) : "",
      paymentMethod: "cash",
      trxId: "",
      remarks: "",
    });
  };

  /* ----------------------------------------------------------------------- */
  /* SUBMIT PAYMENT                                                          */
  /* ----------------------------------------------------------------------- */

  const handlePaymentSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const numericAmount = Number(paymentForm.amount);

    if (!paymentForm.studentId.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Student ID required",
        text: "Please enter a valid student ID.",
        background: "#0b1326",
        color: "#fff",
      });

      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Invalid amount",
        text: "Please enter a payment amount greater than zero.",
        background: "#0b1326",
        color: "#fff",
      });

      return;
    }

    setSubmitting(true);

    try {
      const response = await axiosSecure.post("/payments/pay", {
        studentId: paymentForm.studentId.trim(),
        amount: numericAmount,
        paymentMethod: paymentForm.paymentMethod,
        trxId: paymentForm.trxId.trim(),
        remarks: paymentForm.remarks.trim(),
      });

      if (response.data?.success || response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Payment recorded",
          text: `Successfully processed ${formatMoney(
            numericAmount
          )}.`,
          background: "#0b1326",
          color: "#fff",
          confirmButtonColor: "#6ffbbe",
        });

        setPaymentModal({
          open: false,
          fee: null,
        });

        setPaymentForm({
          studentId: "",
          amount: "",
          paymentMethod: "cash",
          trxId: "",
          remarks: "",
        });

        await fetchData();
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Payment failed",
        text:
          error?.response?.data?.message ||
          "Failed to record payment.",
        background: "#0b1326",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ----------------------------------------------------------------------- */
  /* LOADING                                                                 */
  /* ----------------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#6ffbbe]/10 bg-[#6ffbbe]/5">
            <Loader2
              size={25}
              className="animate-spin text-[#6ffbbe]"
            />
          </div>

          <p className="text-xs font-medium text-white/30">
            Loading payment records...
          </p>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------------------- */
  /* RENDER                                                                  */
  /* ----------------------------------------------------------------------- */

  return (
    <div className="min-h-full w-full overflow-x-hidden text-white">
      {/* ================================================================ */}
      {/* HEADER                                                           */}
      {/* ================================================================ */}

      <section className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#adc6ff]/15 to-[#6ffbbe]/10">
                <CreditCard
                  size={15}
                  className="text-[#adc6ff]"
                />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#adc6ff]/60">
                Finance Management
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
              Payments
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-white/40 sm:text-sm">
              Manage student tuition payments, outstanding balances,
              fee cycles and collection records.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            <button
              type="button"
              onClick={handleSyncFees}
              disabled={syncing}
              className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-white/70 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={syncing ? "animate-spin" : ""}
              />

              {syncing ? "Syncing..." : "Sync Cycles"}
            </button>

            <button
              type="button"
              onClick={() => handleOpenCollectModal()}
              className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] px-5 text-xs font-black text-[#0b1326] shadow-[0_8px_30px_rgba(111,251,190,0.08)] transition hover:scale-[1.01] hover:opacity-90"
            >
              <Plus size={16} />
              Collect Payment
            </button>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* STATS                                                             */}
      {/* ================================================================ */}

      <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PaymentStatCard
          title="Total Collected"
          value={formatMoney(summary.totalCollected)}
          subtitle="Successfully collected"
          icon={DollarSign}
          color="green"
        />

        <PaymentStatCard
          title="Pending Balance"
          value={formatMoney(summary.totalPending)}
          subtitle="Awaiting collection"
          icon={Wallet}
          color="amber"
        />

        <PaymentStatCard
          title="Overdue Accounts"
          value={String(summary.overdueCount)}
          subtitle="Requires attention"
          icon={AlertCircle}
          color="rose"
        />

        <PaymentStatCard
          title="Active Cycles"
          value={String(fees.length)}
          subtitle="Current fee records"
          icon={Calendar}
          color="blue"
        />
      </section>

      {/* ================================================================ */}
      {/* QUICK FINANCIAL OVERVIEW                                          */}
      {/* ================================================================ */}

      <section className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#adc6ff]/[0.07] via-white/[0.025] to-[#6ffbbe]/[0.05] p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#adc6ff]/10 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/35">
                  Financial Overview
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {formatMoney(summary.totalCollected)}
                </h2>

                <p className="mt-1 text-xs text-[#6ffbbe]/70">
                  Total revenue collected
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#adc6ff]/10">
                <CreditCard
                  size={20}
                  className="text-[#adc6ff]"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/5 bg-black/10 p-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">
                  Pending
                </p>

                <p className="mt-1 text-sm font-black text-amber-300">
                  {formatMoney(summary.totalPending)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/10 p-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">
                  Overdue
                </p>

                <p className="mt-1 text-sm font-black text-rose-400">
                  {summary.overdueCount}
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/10 p-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">
                  Records
                </p>

                <p className="mt-1 text-sm font-black text-[#adc6ff]">
                  {fees.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#adc6ff]/10">
              <Clock
                size={18}
                className="text-[#adc6ff]"
              />
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
            <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.025] p-3">
              <div className="flex items-center gap-2">
                <AlertCircle
                  size={15}
                  className="text-rose-400"
                />

                <span className="text-[11px] text-white/60">
                  Overdue
                </span>
              </div>

              <span className="text-xs font-black text-rose-400">
                {summary.overdueCount}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.025] p-3">
              <div className="flex items-center gap-2">
                <Clock
                  size={15}
                  className="text-amber-300"
                />

                <span className="text-[11px] text-white/60">
                  Pending
                </span>
              </div>

              <span className="text-xs font-black text-amber-300">
                {formatMoney(summary.totalPending)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* TABLE HEADER                                                      */}
      {/* ================================================================ */}

      <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025]">
        <div className="border-b border-white/[0.07] p-4 sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-sm font-black text-white sm:text-base">
                Payment Records
              </h2>

              <p className="mt-1 text-[10px] text-white/30">
                {filteredFees.length} of {fees.length} records
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row xl:w-auto">
              {/* Search */}
              <div className="relative w-full sm:min-w-[240px]">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search student..."
                  className="h-10 w-full rounded-xl border border-white/10 bg-black/10 pl-9 pr-3 text-xs text-white outline-none placeholder:text-white/25 focus:border-[#adc6ff]/30"
                />
              </div>

              {/* Status */}
              <div className="relative">
                <Filter
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className="h-10 w-full appearance-none rounded-xl border border-white/10 bg-[#0b1326] pl-9 pr-9 text-xs text-white outline-none focus:border-[#adc6ff]/30 sm:w-[150px]"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="overdue">Overdue</option>
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/25"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP TABLE                                                 */}
        {/* ============================================================ */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.015]">
                <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-white/30">
                  Student
                </th>

                <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-white/30">
                  Cycle
                </th>

                <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-white/30">
                  Due Date
                </th>

                <th className="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-wider text-white/30">
                  Amount
                </th>

                <th className="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-wider text-white/30">
                  Paid
                </th>

                <th className="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-wider text-white/30">
                  Due
                </th>

                <th className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-white/30">
                  Status
                </th>

                <th className="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-wider text-white/30">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredFees.map((fee) => {
                const student = getStudent(fee);
                const due = getDueAmount(fee);

                const initials = student?.name
                  ? student.name
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                  : "ST";

                return (
                  <tr
                    key={fee._id}
                    className="border-b border-white/[0.045] transition-colors hover:bg-white/[0.025]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#adc6ff]/15 to-[#6ffbbe]/10 text-[10px] font-black text-[#adc6ff]">
                          {initials}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[170px] truncate text-xs font-bold text-white">
                            {student?.name || "Unknown Student"}
                          </p>

                          <p className="mt-0.5 max-w-[180px] truncate text-[9px] text-white/30">
                            {student?.email ||
                              student?.phone ||
                              `ID: ${student?._id || "N/A"}`}
                          </p>
                        </div>
                      </div>
                    </td>

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

                    <td className="px-4 py-4 text-[10px] text-white/50">
                      {formatDate(fee.dueDate)}
                    </td>

                    <td className="px-4 py-4 text-right font-mono text-xs font-bold text-white">
                      {formatMoney(fee.amount)}
                    </td>

                    <td className="px-4 py-4 text-right font-mono text-xs font-bold text-[#6ffbbe]">
                      {formatMoney(fee.paidAmount)}
                    </td>

                    <td className="px-4 py-4 text-right font-mono text-xs font-bold text-rose-400">
                      {formatMoney(due)}
                    </td>

                    <td className="px-4 py-4">
                      <PaymentStatusBadge
                        status={fee.status}
                      />
                    </td>

                    <td className="px-4 py-4 text-right">
                      {due > 0 ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenCollectModal(fee)
                          }
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

          {filteredFees.length === 0 && (
            <div className="flex min-h-[240px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                <Search
                  size={19}
                  className="text-white/25"
                />
              </div>

              <p className="mt-3 text-xs font-bold text-white/60">
                No payment records found
              </p>

              <p className="mt-1 text-[10px] text-white/25">
                Try changing your search or status filter.
              </p>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* MOBILE CARDS                                                  */}
        {/* ============================================================ */}

        <div className="space-y-3 p-3 md:hidden">
          {filteredFees.map((fee) => {
            const student = getStudent(fee);
            const due = getDueAmount(fee);

            const initials = student?.name
              ? student.name
                  .split(" ")
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()
              : "ST";

            return (
              <div
                key={fee._id}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
              >
                {/* Student */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#adc6ff]/15 to-[#6ffbbe]/10 text-[10px] font-black text-[#adc6ff]">
                    {initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                          {student?.name ||
                            "Unknown Student"}
                        </p>

                        <p className="mt-0.5 truncate text-[9px] text-white/30">
                          {student?.email ||
                            student?.phone ||
                            `ID: ${student?._id || "N/A"}`}
                        </p>
                      </div>

                      <PaymentStatusBadge
                        status={fee.status}
                      />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-white/5 bg-black/10 p-3">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-white/25">
                      Cycle
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-white/60">
                      {formatDate(fee.cycleStartDate)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-black/10 p-3">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-white/25">
                      Due Date
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-white/60">
                      {formatDate(fee.dueDate)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-black/10 p-3">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-white/25">
                      Amount
                    </p>

                    <p className="mt-1 font-mono text-xs font-bold text-white">
                      {formatMoney(fee.amount)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-black/10 p-3">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-white/25">
                      Paid
                    </p>

                    <p className="mt-1 font-mono text-xs font-bold text-[#6ffbbe]">
                      {formatMoney(fee.paidAmount)}
                    </p>
                  </div>

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

                {/* Action */}
                {due > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenCollectModal(fee)
                    }
                    className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] text-[10px] font-black text-[#0b1326]"
                  >
                    <DollarSign size={14} />
                    Collect Payment
                  </button>
                )}
              </div>
            );
          })}

          {filteredFees.length === 0 && (
            <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
              <Search
                size={20}
                className="text-white/20"
              />

              <p className="mt-3 text-xs font-bold text-white/50">
                No payment records found
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* PAYMENT MODAL                                                    */}
      {/* ================================================================ */}

      {paymentModal.open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPaymentModal({
                open: false,
                fee: null,
              });
            }
          }}
        >
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-white/10 bg-[#0b1326] shadow-2xl sm:max-w-lg sm:rounded-[2rem]">
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.07] bg-[#0b1326]/95 px-5 py-4 backdrop-blur-xl sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#adc6ff]/10">
                  <CreditCard
                    size={18}
                    className="text-[#adc6ff]"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-black text-white">
                    Collect Payment
                  </h3>

                  <p className="text-[9px] text-white/30">
                    Record a student payment
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPaymentModal({
                    open: false,
                    fee: null,
                  })
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {/* Target account */}
              {paymentModal.fee && (
                <div className="mb-5 rounded-2xl border border-[#adc6ff]/10 bg-gradient-to-br from-[#adc6ff]/5 to-[#6ffbbe]/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#adc6ff]/10">
                      <User
                        size={17}
                        className="text-[#adc6ff]"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">
                        Target Student
                      </p>

                      <p className="truncate text-sm font-black text-white">
                        {getStudent(paymentModal.fee)
                          ?.name || "Unknown Student"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-black/10 p-3">
                      <p className="text-[8px] uppercase tracking-wider text-white/25">
                        Cycle
                      </p>

                      <p className="mt-1 font-mono text-xs font-bold text-white">
                        {formatMoney(
                          paymentModal.fee.amount
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-black/10 p-3">
                      <p className="text-[8px] uppercase tracking-wider text-white/25">
                        Remaining
                      </p>

                      <p className="mt-1 font-mono text-xs font-bold text-rose-400">
                        {formatMoney(
                          getDueAmount(paymentModal.fee)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form
                onSubmit={handlePaymentSubmit}
                className="space-y-4"
              >
                {/* Student ID */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40">
                    Student ID
                  </label>

                  <input
                    type="text"
                    required
                    value={paymentForm.studentId}
                    onChange={(event) =>
                      setPaymentForm((previous) => ({
                        ...previous,
                        studentId: event.target.value,
                      }))
                    }
                    placeholder="Enter student ID"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] px-3.5 text-xs text-white outline-none placeholder:text-white/20 focus:border-[#adc6ff]/40"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40">
                    Payment Amount
                  </label>

                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6ffbbe]">
                      ৳
                    </span>

                    <input
                      type="number"
                      required
                      min="1"
                      value={paymentForm.amount}
                      onChange={(event) =>
                        setPaymentForm((previous) => ({
                          ...previous,
                          amount: event.target.value,
                        }))
                      }
                      placeholder="0"
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-8 pr-3 text-sm font-bold text-white outline-none placeholder:text-white/20 focus:border-[#6ffbbe]/40"
                    />
                  </div>
                </div>

                {/* Method + Trx */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40">
                      Payment Method
                    </label>

                    <select
                      value={paymentForm.paymentMethod}
                      onChange={(event) =>
                        setPaymentForm((previous) => ({
                          ...previous,
                          paymentMethod:
                            event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-xl border border-white/10 bg-[#0b1326] px-3 text-xs text-white outline-none focus:border-[#adc6ff]/40"
                    >
                      <option value="cash">Cash</option>
                      <option value="bkash">bKash</option>
                      <option value="nagad">Nagad</option>
                      <option value="bank">Bank</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40">
                      Transaction ID
                    </label>

                    <input
                      type="text"
                      value={paymentForm.trxId}
                      onChange={(event) =>
                        setPaymentForm((previous) => ({
                          ...previous,
                          trxId: event.target.value,
                        }))
                      }
                      placeholder="Optional"
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] px-3 text-xs text-white outline-none placeholder:text-white/20 focus:border-[#adc6ff]/40"
                    />
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40">
                    Remarks
                  </label>

                  <textarea
                    rows={3}
                    value={paymentForm.remarks}
                    onChange={(event) =>
                      setPaymentForm((previous) => ({
                        ...previous,
                        remarks: event.target.value,
                      }))
                    }
                    placeholder="Optional payment note..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-3 text-xs text-white outline-none placeholder:text-white/20 focus:border-[#adc6ff]/40"
                  />
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentModal({
                        open: false,
                        fee: null,
                      })
                    }
                    className="h-11 rounded-xl border border-white/10 bg-white/[0.035] text-xs font-bold text-white/50 transition hover:bg-white/[0.07] hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] text-xs font-black text-[#0b1326] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={15} />
                        Confirm Payment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}