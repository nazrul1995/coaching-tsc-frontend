export interface StudentInfo {
  _id: string;
  userId: string;

  name?: string;
  roll?: string | number;
  email?: string;
  phone?: string;

  className?: string;
  admissionDate?: string;
  monthlyFee?: number;
}

/* -------------------------------------------------------------------------- */
/* Fee Summary                                                                */
/* -------------------------------------------------------------------------- */

export interface FeeSummary {
  studentId: string;

  student?: StudentInfo;

  totalAmount: number;
  totalPaid: number;
  totalOutstanding: number;

  totalCycles: number;
  overdueCycles: number;

  lastPaymentDate?: string;

  status:
    | 'unpaid'
    | 'partial'
    | 'paid'
    | 'overdue'
    | string;
}

/* -------------------------------------------------------------------------- */
/* Fee Cycle                                                                  */
/* -------------------------------------------------------------------------- */

export interface FeeCycle {
  _id: string;

  studentId?: string;
  student?: StudentInfo;

  amount: number;
  paidAmount: number;

  dueAmount?: number;

  status:
    | 'unpaid'
    | 'partial'
    | 'paid'
    | 'overdue'
    | string;

  cycleStartDate?: string;
  cycleEndDate?: string;
  dueDate?: string;

  /*
   * Summary fields
   *
   * এগুলো optional রাখা হয়েছে যাতে FeeSummary
   * থেকে FeeCycle তৈরি/ব্যবহার করতে সমস্যা না হয়।
   */
  totalAmount?: number;
  totalPaid?: number;
  totalOutstanding?: number;

  totalCycles?: number;
  overdueCycles?: number;

  lastPaymentDate?: string;
}

/* -------------------------------------------------------------------------- */
/* Payment Form                                                               */
/* -------------------------------------------------------------------------- */

export interface PaymentFormState {
  studentId: string;
  amount: string;
  paymentMethod: string;
  trxId: string;
  remarks: string;
}
