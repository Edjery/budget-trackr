import { useCallback, useEffect, useState } from 'react';
import type { FormValues, Transaction } from '../types';
import { toLocalDateString } from '../utils/dateUtils';

export const useTransactionSubmission = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('transactions');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const processTransactionItems = useCallback((values: FormValues): Transaction[] => {
    const newTransactions: Transaction[] = [];
    
    const addTransaction = (dateStr: string, item: typeof values.items[0]) => {
      if (item.name && item.amount) {
        newTransactions.push({
          ...item,
          date: dateStr,
          month: values.month,
          year: values.year,
        });
      }
    };

    if (values.dayRangeType === 'single') {
      const dateStr = toLocalDateString(values.year, values.month, values.startDay);
      values.items.forEach(item => addTransaction(dateStr, item));
    } else {
      for (let day = values.startDay; day <= values.endDay; day++) {
        const dateStr = toLocalDateString(values.year, values.month, day);
        values.items.forEach(item => addTransaction(dateStr, item));
      }
    }

    return newTransactions;
  }, []);

  const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      setTransactions(prevTransactions => {
        const updatedTransactions = prevTransactions.map(tx => 
          tx.id === id ? { ...tx, ...updates } : tx
        );
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        }
        return updatedTransactions;
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update transaction'));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const submitTransaction = useCallback(async (values: FormValues, onSuccess?: () => void) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const newTransactions = processTransactionItems(values);
      
      setTransactions(prevTransactions => {
        const updatedTransactions = [...prevTransactions, ...newTransactions];
        if (typeof window !== 'undefined') {
          localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        }
        return updatedTransactions;
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [processTransactionItems]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  return {
    transactions,
    isSubmitting,
    error,
    submitTransaction,
    updateTransaction,
    setTransactions,
  };
};

export default useTransactionSubmission;
