
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TransactionList from './TransactionList';
import ExpenseChart from './ExpenseChart';
import IncomeExpenseChart from './IncomeExpenseChart';
import { Transaction } from '@/lib/types';

interface TabsViewProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

const TabsView: React.FC<TabsViewProps> = ({
  transactions,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction
}) => {
  return (
    <Tabs defaultValue="transactions" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
        <TabsTrigger value="monthly-expenses">Monthly Expenses</TabsTrigger>
        <TabsTrigger value="income-expenses">Income vs Expenses</TabsTrigger>
      </TabsList>
      
      <TabsContent value="transactions" className="space-y-4">
        <TransactionList
          transactions={transactions}
          onAddTransaction={onAddTransaction}
          onEditTransaction={onEditTransaction}
          onDeleteTransaction={onDeleteTransaction}
        />
      </TabsContent>
      
      <TabsContent value="monthly-expenses" className="space-y-4">
        <ExpenseChart />
      </TabsContent>
      
      <TabsContent value="income-expenses" className="space-y-4">
        <IncomeExpenseChart />
      </TabsContent>
    </Tabs>
  );
};

export default TabsView;
