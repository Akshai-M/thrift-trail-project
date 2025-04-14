
import React from 'react';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/lib/types';
import { format, parseISO } from 'date-fns';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  onEdit, 
  onDelete 
}) => {
  const { id, amount, date, description, type } = transaction;
  
  const formattedDate = format(parseISO(date), 'MMM dd, yyyy');
  
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          type === 'expense' ? 'bg-finance-expense/10 text-finance-expense' : 'bg-finance-income/10 text-finance-income'
        }`}>
          {type === 'expense' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          )}
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900">{description}</h4>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className={`font-semibold ${
          type === 'expense' ? 'text-finance-expense' : 'text-finance-income'
        }`}>
          {type === 'expense' ? '-' : '+'} ${amount.toFixed(2)}
        </span>
        
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(transaction)}
            className="h-8 w-8 p-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(id)}
            className="h-8 w-8 p-0 text-destructive"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
