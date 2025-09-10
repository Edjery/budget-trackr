import { useCallback, useState } from 'react';
import type { Transaction } from '../types';

export const useDateSearch = (transactions: Transaction[]) => {
  const [searchDate, setSearchDate] = useState<Date | null>(null);

  const filteredTransactions = useCallback(() => {
    if (!searchDate) return transactions;
    
    const searchDateStr = searchDate.toISOString().split('T')[0];
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
      return transactionDate === searchDateStr;
    });
  }, [searchDate, transactions]);

  return {
    searchDate,
    setSearchDate,
    filteredTransactions: filteredTransactions(),
    isSearching: searchDate !== null
  };
};
