export interface StudentInfo {
  _id: string;
  name?: string;
  roll?: string | number;
  email?: string;
  phone?: string;
  className?: string;
  admissionDate?: string;
  monthlyFee?: number;
}

export interface FeeSummary {
  totalAmount: number;
  totalPaid: number;
  totalCycles: number;
  overdueCycles: number;
  lastPaymentDate?: string;
  studentId: string;
  student?: StudentInfo;
  totalOutstanding: number;
  status: "unpaid" | "partial" | "paid" | "overdue" | string;

}

export interface FeeCycle {
  _id: string;
  student?: StudentInfo;
  studentId?: string;
  amount: number;
  paidAmount: number;
  dueAmount?: number;
  status: "unpaid" | "partial" | "paid" | "overdue" | string;
  cycleStartDate?: string;
  cycleEndDate?: string;
  dueDate?: string;
}

export interface PaymentFormState {
  studentId: string;
  amount: string;
  paymentMethod: string;
  trxId: string;
  remarks: string;
}
