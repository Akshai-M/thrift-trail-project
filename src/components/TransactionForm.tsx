
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Transaction, TransactionFormData } from '@/lib/types';
import { format } from 'date-fns';

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: TransactionFormData) => void;
  transaction?: Transaction;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  open, 
  onClose, 
  onSave,
  transaction 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    type: 'expense'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set form data when editing an existing transaction
  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.description,
        type: transaction.type
      });
    } else {
      // Reset form data for new transactions
      setFormData({
        amount: 0,
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        type: 'expense'
      });
    }
  }, [transaction, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTypeChange = (value: 'expense' | 'income') => {
    setFormData(prev => ({
      ...prev,
      type: value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      toast({
        title: transaction ? 'Transaction updated' : 'Transaction added',
        description: `${formData.description} - $${formData.amount.toFixed(2)}`,
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Transaction Type</Label>
            <RadioGroup 
              defaultValue={formData.type} 
              value={formData.type}
              onValueChange={(value) => handleTypeChange(value as 'expense' | 'income')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="text-finance-expense">Expense</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="text-finance-income">Income</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount" className={errors.amount ? 'text-destructive' : ''}>
              Amount
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              className={errors.amount ? 'border-destructive' : ''}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date" className={errors.date ? 'text-destructive' : ''}>
              Date
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'border-destructive' : ''}
            />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description" className={errors.description ? 'text-destructive' : ''}>
              Description
            </Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {transaction ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
