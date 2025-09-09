import { useMemo } from 'react';
import type { Transaction } from '../types';

export const useTransactionCalculations = (transactions: Transaction[]) => {
  const { totalEarnings, totalSpendings } = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        const amount = parseFloat(transaction.amount || '0');
        if (transaction.type === 'earnings') {
          acc.totalEarnings += amount;
        } else {
          acc.totalSpendings += amount;
        }
        return acc;
      },
      { totalEarnings: 0, totalSpendings: 0 }
    );
  }, [transactions]);

  const balance = totalEarnings - totalSpendings;

  return {
    totalEarnings,
    totalSpendings,
    balance,
  };
};

export default useTransactionCalculations;
