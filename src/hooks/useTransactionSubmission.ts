import { useState, useCallback, useEffect } from 'react';
import { toLocalDateString } from '../utils/dateUtils';
import type { Transaction, FormValues } from '../types';

export const useTransactionSubmission = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // Load transactions from localStorage on initial render
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

    // Process transactions based on day range type
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

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  const submitTransaction = useCallback(async (
    values: FormValues,
    onSuccess?: () => void
  ) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Ensure endDay matches startDay when dayRangeType is 'single'
      const formValues = {
        ...values,
        endDay: values.dayRangeType === 'single' ? values.startDay : values.endDay
      };

      const newTransactions = processTransactionItems(formValues);
      
      if (newTransactions.length > 0) {
        setTransactions(prev => [...prev, ...newTransactions]);
      }

      onSuccess?.();
      return { success: true, transactions: newTransactions };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to submit transaction');
      setError(error);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  }, [processTransactionItems]);

  return {
    transactions,
    isSubmitting,
    error,
    submitTransaction,
    setTransactions, // In case we need to modify transactions from outside
  };
};

export default useTransactionSubmission;
