import { useMemo } from 'react';
import type { Transaction } from '../types';

interface TransactionTotals {
  totalEarnings: number;
  totalSpendings: number;
  balance: number;
}

interface TransactionCalculations extends TransactionTotals {
  currentMonthEarnings: number;
  currentMonthSpendings: number;
  currentMonthBalance: number;
  currentYearEarnings: number;
  currentYearSpendings: number;
  currentYearBalance: number;
}

const calculateTotals = (transactions: Transaction[]): TransactionTotals => {
  return transactions.reduce(
    (acc, transaction) => {
      const amount = parseFloat(transaction.amount || '0');
      if (transaction.type === 'earnings') {
        acc.totalEarnings += amount;
      } else {
        acc.totalSpendings += amount;
      }
      acc.balance = acc.totalEarnings - acc.totalSpendings;
      return acc;
    },
    { totalEarnings: 0, totalSpendings: 0, balance: 0 }
  );
};

export const useTransactionCalculations = (transactions: Transaction[]): TransactionCalculations => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed
  const currentYear = now.getFullYear();

  const {
    totalEarnings,
    totalSpendings,
    balance,
    currentMonthEarnings,
    currentMonthSpendings,
    currentMonthBalance,
    currentYearEarnings,
    currentYearSpendings,
    currentYearBalance
  } = useMemo(() => {
    const currentMonthTransactions = transactions.filter(
      t => t.month === currentMonth && t.year === currentYear
    );
    
    const currentYearTransactions = transactions.filter(
      t => t.year === currentYear
    );

    const allTotals = calculateTotals(transactions);
    const monthTotals = calculateTotals(currentMonthTransactions);
    const yearTotals = calculateTotals(currentYearTransactions);

    return {
      ...allTotals,
      currentMonthEarnings: monthTotals.totalEarnings,
      currentMonthSpendings: monthTotals.totalSpendings,
      currentMonthBalance: monthTotals.balance,
      currentYearEarnings: yearTotals.totalEarnings,
      currentYearSpendings: yearTotals.totalSpendings,
      currentYearBalance: yearTotals.balance
    };
  }, [transactions, currentMonth, currentYear]);

  return {
    totalEarnings,
    totalSpendings,
    balance,
    currentMonthEarnings,
    currentMonthSpendings,
    currentMonthBalance,
    currentYearEarnings,
    currentYearSpendings,
    currentYearBalance
  };
};

export default useTransactionCalculations;
