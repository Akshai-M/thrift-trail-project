
export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: 'expense' | 'income';
}

export type TransactionFormData = Omit<Transaction, 'id'>;
