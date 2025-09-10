import type { FormValues, TransactionItem, Transaction } from '../types';
import { getCurrentDateValues } from '../utils/dateUtils';

export const useTransactionForm = () => {
  const getInitialValues = (): FormValues => {
    const { year, month, day } = getCurrentDateValues();
    
    return {
      year,
      month,
      dayRangeType: 'single' as const,
      startDay: day,
      endDay: day,
      items: [
        createEmptyTransactionItem()
      ],
    };
  };

  const createEmptyTransactionItem = (sortOrder: number = 0): TransactionItem => ({
    id: Date.now().toString(),
    type: 'spendings',
    name: '',
    amount: '',
    sortOrder
  });

  const resetFormValues = (currentValues: Partial<FormValues>): FormValues => ({
    ...getInitialValues(),
    year: currentValues.year ?? getCurrentDateValues().year,
    month: currentValues.month ?? getCurrentDateValues().month,
  });

  const transactionToFormValues = (transaction: Transaction): FormValues => {
    const date = new Date(transaction.date);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      dayRangeType: 'single' as const,
      startDay: date.getDate(),
      endDay: date.getDate(),
      items: [{
        id: transaction.id,
        type: transaction.type,
        name: transaction.name,
        amount: transaction.amount,
        sortOrder: transaction.sortOrder || 0
      }]
    };
  };

  return {
    getInitialValues,
    createEmptyTransactionItem,
    resetFormValues,
    transactionToFormValues
  };
};
