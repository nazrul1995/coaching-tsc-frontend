'use client';

import React from 'react';
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  User,
} from 'lucide-react';

import { FeeCycle, PaymentFormState } from './payment.types';
import {
  formatMoney,
  getDueAmount,
  getStudent,
} from './payment.helpers';
import { DashboardModal } from '../../common';

interface Props {
  open: boolean;
  fee: FeeCycle | null;
  form: PaymentFormState;
  submitting: boolean;

  onChange: (patch: Partial<PaymentFormState>) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function PaymentCollectionModal({
  open,
  fee,
  form,
  submitting,
  onChange,
  onClose,
  onSubmit,
}: Props) {
  return (
    <DashboardModal
      open={open}
      onClose={onClose}
      title="Collect Payment"
      description="Record a student payment"
      maxWidth="sm:max-w-lg"
    >
      <div>
        {/* Selected Student */}
        {fee && (
          <div className="mb-5 rounded-2xl border border-[#adc6ff]/10 bg-gradient-to-br from-[#adc6ff]/5 to-[#6ffbbe]/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#adc6ff]/10">
                <User
                  size={17}
                  className="text-[#adc6ff]"
                />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">
                  Target Student
                </p>

                <p className="text-sm font-black text-white">
                  {getStudent(fee)?.name || 'Unknown Student'}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {/* Cycle Amount */}
              <div className="rounded-xl bg-black/10 p-3">
                <p className="text-[8px] uppercase tracking-wider text-white/25">
                  Cycle
                </p>

                <p className="mt-1 font-mono text-xs font-bold text-white">
                  {formatMoney(fee.amount)}
                </p>
              </div>

              {/* Remaining Amount */}
              <div className="rounded-xl bg-black/10 p-3">
                <p className="text-[8px] uppercase tracking-wider text-white/25">
                  Remaining
                </p>

                <p className="mt-1 font-mono text-xs font-bold text-rose-400">
                  {formatMoney(getDueAmount(fee))}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Form */}
        <form
          onSubmit={onSubmit}
          className="space-y-4"
        >
          {/* Student ID */}
          <Field label="Student ID">
            <input
              required
              value={form.studentId}
              onChange={(e) =>
                onChange({
                  studentId: e.target.value,
                })
              }
              placeholder="Enter student ID"
              className={input}
            />
          </Field>

          {/* Payment Amount */}
          <Field label="Payment Amount">
            <input
              required
              min="1"
              type="number"
              value={form.amount}
              onChange={(e) =>
                onChange({
                  amount: e.target.value,
                })
              }
              placeholder="0"
              className={`${input} pl-8`}
            />
          </Field>

          {/* Payment Method & Transaction ID */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Payment Method">
              <select
                value={form.paymentMethod}
                onChange={(e) =>
                  onChange({
                    paymentMethod: e.target.value,
                  })
                }
                className={input}
              >
                <option value="cash">Cash</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="bank">Bank</option>
              </select>
            </Field>

            <Field label="Transaction ID">
              <input
                value={form.trxId}
                onChange={(e) =>
                  onChange({
                    trxId: e.target.value,
                  })
                }
                placeholder="Optional"
                className={input}
              />
            </Field>
          </div>

          {/* Remarks */}
          <Field label="Remarks">
            <textarea
              rows={3}
              value={form.remarks}
              onChange={(e) =>
                onChange({
                  remarks: e.target.value,
                })
              }
              placeholder="Optional payment note..."
              className={`${input} h-auto py-3`}
            />
          </Field>

          {/* Actions */}
          <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border border-white/10 bg-white/[0.035] text-xs font-bold text-white/50"
            >
              Cancel
            </button>

            <button
              disabled={submitting}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] text-xs font-black text-[#0b1326] disabled:opacity-50"
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
    </DashboardModal>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared Styles                                                             */
/* -------------------------------------------------------------------------- */

const input =
  'h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] px-3.5 text-xs text-white outline-none placeholder:text-white/20 focus:border-[#adc6ff]/40';

/* -------------------------------------------------------------------------- */
/* Form Field                                                                */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40">
        {label}
      </label>

      {children}
    </div>
  );
}
