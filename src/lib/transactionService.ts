
import { Transaction, TransactionFormData } from './types';
import { getCollection, generateObjectId } from './browserStorage';

const COLLECTION_NAME = 'transactions';

// Helper to generate a unique ID
const generateId = (): string => {
  return generateObjectId();
};

// Simulates MongoDB ObjectId for browser storage
class BrowserObjectId {
  private id: string;
  
  constructor(id?: string) {
    this.id = id || generateObjectId();
  }
  
  toString(): string {
    return this.id;
  }
}

// Get all transactions from storage
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    const transactions = await collection.toArray();
    
    return transactions.map(transaction => ({
      id: transaction._id.toString(),
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description,
      type: transaction.type
    }));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

// Add a new transaction
export const addTransaction = async (transaction: TransactionFormData): Promise<Transaction> => {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    const id = generateId();
    
    const newTransaction = {
      _id: new BrowserObjectId(id),
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description,
      type: transaction.type
    };
    
    await collection.insertOne(newTransaction);
    
    return {
      id,
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description,
      type: transaction.type
    };
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};

// Update an existing transaction
export const updateTransaction = async (transaction: Transaction): Promise<Transaction> => {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    const { id, ...transactionData } = transaction;
    
    await collection.updateOne(
      { _id: new BrowserObjectId(id) },
      { $set: transactionData }
    );
    
    return transaction;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

// Delete a transaction
export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    await collection.deleteOne({ _id: new BrowserObjectId(id) });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

// Get monthly expense data for chart
export const getMonthlyExpenseData = async () => {
  try {
    const transactions = await getTransactions();
    const expenses = transactions.filter(t => t.type === 'expense');
    
    const monthlyData = expenses.reduce((acc: Record<string, number>, transaction) => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + transaction.amount;
      return acc;
    }, {});
    
    return Object.entries(monthlyData)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });
  } catch (error) {
    console.error("Error getting monthly expense data:", error);
    return [];
  }
};

// Get monthly income and expense data for chart
export const getMonthlyIncomeExpenseData = async () => {
  try {
    const transactions = await getTransactions();
    
    // Create a map of all months with income and expenses
    const monthlyData = transactions.reduce((acc: Record<string, { income: number; expenses: number }>, transaction) => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
      
      if (!acc[month]) {
        acc[month] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expenses += transaction.amount;
      }
      
      return acc;
    }, {});
    
    // Convert to array and sort by month
    return Object.entries(monthlyData)
      .map(([month, data]) => ({ 
        month, 
        income: data.income, 
        expenses: data.expenses 
      }))
      .sort((a, b) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });
  } catch (error) {
    console.error("Error getting monthly income/expense data:", error);
    return [];
  }
};

// Get total expenses
export const getTotalExpenses = async (): Promise<number> => {
  try {
    const transactions = await getTransactions();
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  } catch (error) {
    console.error("Error getting total expenses:", error);
    return 0;
  }
};

// Get total income
export const getTotalIncome = async (): Promise<number> => {
  try {
    const transactions = await getTransactions();
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  } catch (error) {
    console.error("Error getting total income:", error);
    return 0;
  }
};
