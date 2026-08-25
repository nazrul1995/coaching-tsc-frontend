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

export interface PaymentFormState {
  studentId: string;
  amount: string;
  paymentMethod: string;
  trxId: string;
  remarks: string;
}
