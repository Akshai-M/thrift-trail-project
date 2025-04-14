
import { Transaction, TransactionFormData } from './types';

const STORAGE_KEY = 'thrift-trail-transactions';

// Helper to generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get all transactions from localStorage
export const getTransactions = (): Transaction[] => {
  const storedTransactions = localStorage.getItem(STORAGE_KEY);
  return storedTransactions ? JSON.parse(storedTransactions) : [];
};

// Add a new transaction
export const addTransaction = (transaction: TransactionFormData): Transaction => {
  const newTransaction: Transaction = {
    ...transaction,
    id: generateId()
  };
  
  const transactions = getTransactions();
  const updatedTransactions = [newTransaction, ...transactions];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions));
  
  return newTransaction;
};

// Update an existing transaction
export const updateTransaction = (transaction: Transaction): Transaction => {
  const transactions = getTransactions();
  const updatedTransactions = transactions.map(t => 
    t.id === transaction.id ? transaction : t
  );
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions));
  return transaction;
};

// Delete a transaction
export const deleteTransaction = (id: string): void => {
  const transactions = getTransactions();
  const updatedTransactions = transactions.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions));
};

// Get monthly expense data for chart
export const getMonthlyExpenseData = () => {
  const transactions = getTransactions();
  const expenses = transactions.filter(t => t.type === 'expense');
  
  const monthlyData = expenses.reduce((acc: Record<string, number>, transaction) => {
    const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + transaction.amount;
    return acc;
  }, {});
  
  return Object.entries(monthlyData).map(([month, total]) => ({ month, total }));
};

// Get total expenses
export const getTotalExpenses = (): number => {
  const transactions = getTransactions();
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

// Get total income
export const getTotalIncome = (): number => {
  const transactions = getTransactions();
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
};
