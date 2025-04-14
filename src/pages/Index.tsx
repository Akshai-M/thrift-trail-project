import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import TransactionForm from '@/components/TransactionForm';
import TabsView from '@/components/TabsView';
import DashboardCard from '@/components/DashboardCard';
import { Transaction, TransactionFormData } from '@/lib/types';
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTotalExpenses,
  getTotalIncome
} from '@/lib/transactionService';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

const Index = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | undefined>(undefined);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const loadedTransactions = getTransactions();
    setTransactions(loadedTransactions);
    
    const expenses = getTotalExpenses();
    const income = getTotalIncome();
    
    setTotalExpenses(expenses);
    setTotalIncome(income);
    setBalance(income - expenses);
  }, []);

  const handleAddTransaction = (data: TransactionFormData) => {
    const newTransaction = addTransaction(data);
    setTransactions([newTransaction, ...transactions]);
    
    if (data.type === 'expense') {
      setTotalExpenses(prev => prev + data.amount);
      setBalance(prev => prev - data.amount);
    } else {
      setTotalIncome(prev => prev + data.amount);
      setBalance(prev => prev + data.amount);
    }
  };

  const handleUpdateTransaction = (data: TransactionFormData) => {
    if (!currentTransaction) return;
    
    const oldTransaction = currentTransaction;
    const updatedTransaction = {
      ...data,
      id: oldTransaction.id
    };
    
    updateTransaction(updatedTransaction);
    
    setTransactions(transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
    
    if (oldTransaction.type === 'expense') {
      setTotalExpenses(prev => prev - oldTransaction.amount);
      if (data.type === 'expense') {
        setTotalExpenses(prev => prev + data.amount);
      } else {
        setTotalIncome(prev => prev + data.amount);
      }
    } else {
      setTotalIncome(prev => prev - oldTransaction.amount);
      if (data.type === 'expense') {
        setTotalExpenses(prev => prev + data.amount);
      } else {
        setTotalIncome(prev => prev + data.amount);
      }
    }
    
    setBalance(totalIncome - totalExpenses +
      (oldTransaction.type === 'expense' ? oldTransaction.amount : -oldTransaction.amount) +
      (data.type === 'expense' ? -data.amount : data.amount));
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    if (!transactionToDelete) return;
    
    deleteTransaction(id);
    
    setTransactions(transactions.filter(t => t.id !== id));
    
    if (transactionToDelete.type === 'expense') {
      setTotalExpenses(prev => prev - transactionToDelete.amount);
      setBalance(prev => prev + transactionToDelete.amount);
    } else {
      setTotalIncome(prev => prev - transactionToDelete.amount);
      setBalance(prev => prev - transactionToDelete.amount);
    }
    
    toast({
      title: "Transaction deleted",
      description: `${transactionToDelete.description} has been removed.`,
    });
  };

  const handleAddNew = () => {
    setCurrentTransaction(undefined);
    setIsFormOpen(true);
  };

  const handleSaveTransaction = (data: TransactionFormData) => {
    if (currentTransaction) {
      handleUpdateTransaction(data);
    } else {
      handleAddTransaction(data);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total Balance"
            value={formatCurrency(balance)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            }
            className={balance >= 0 ? "border-l-4 border-finance-income" : "border-l-4 border-finance-expense"}
          />
          
          <DashboardCard
            title="Total Income"
            value={formatCurrency(totalIncome)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            className="border-l-4 border-finance-income"
          />
          
          <DashboardCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            }
            className="border-l-4 border-finance-expense"
          />
        </div>
        
        <TabsView
          transactions={transactions}
          onAddTransaction={handleAddNew}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </main>
      
      <TransactionForm 
        open={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveTransaction}
        transaction={currentTransaction}
      />
    </div>
  );
};

export default Index;
