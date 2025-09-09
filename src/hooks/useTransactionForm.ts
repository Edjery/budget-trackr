import type { FormValues, TransactionItem } from '../types';
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

  const createEmptyTransactionItem = (): TransactionItem => ({
    id: Date.now().toString(),
    type: 'spendings',
    name: '',
    amount: ''
  });

  const resetFormValues = (currentValues: Partial<FormValues>): FormValues => ({
    ...getInitialValues(),
    year: currentValues.year ?? getCurrentDateValues().year,
    month: currentValues.month ?? getCurrentDateValues().month,
  });

  return {
    getInitialValues,
    createEmptyTransactionItem,
    resetFormValues
  };
};
