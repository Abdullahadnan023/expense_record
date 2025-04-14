export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  location: string;
  payment_type: string;
}

export type ExpenseFormData = Omit<Expense, 'id'>;

export const categories = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other'
] as const;

export const paymentTypes = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'UPI',
  'PhonePe',
  'Google Pay',
  'Paytm',
  'Bank Transfer',
  'Net Banking'
] as const;

export interface User {
  id: number;
  email: string;
}