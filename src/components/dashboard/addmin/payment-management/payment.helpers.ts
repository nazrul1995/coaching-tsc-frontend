import { FeeCycle, StudentInfo } from './payment.types';

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatMoney = (amount: number = 0) => `৳${Number(amount || 0).toLocaleString()}`;

export const getStudent = (
  fee: FeeCycle
): StudentInfo | undefined => {
  return fee.student;
};
export const getDueAmount = (fee: FeeCycle) => fee.dueAmount ?? Math.max(0, Number(fee.amount || 0) - Number(fee.paidAmount || 0));

export const getInitials = (name?: string) => name
  ? name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase()
  : 'ST';
