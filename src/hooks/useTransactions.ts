import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { FormValues, Transaction } from '../types';
import { toLocalDateString } from '../utils/dateUtils';

type TransactionInput = Omit<Transaction, 'id'>;

const TRANSACTIONS_QUERY_KEY = ['transactions'];

export const useTransactions = () => {
  const queryClient = useQueryClient();

  // Get all transactions
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: async () => {
      const stored = localStorage.getItem('transactions');
      return stored ? JSON.parse(stored) : [];
    },
  });

  // Add a new transaction
  const addTransaction = useMutation<Transaction, Error, FormValues>({
    mutationFn: async (values) => {
      const newTransactions: TransactionInput[] = [];
      const baseId = Date.now();
      const existingTransactions = queryClient.getQueryData<Transaction[]>(TRANSACTIONS_QUERY_KEY) || [];
      
      const addTransactionItem = (dateStr: string, item: typeof values.items[0]) => {
        if (item.name && item.amount) {
          // Count existing items with the same date to determine sortOrder
          const itemsForDate = existingTransactions.filter(tx => tx.date === dateStr);
          const sortOrder = itemsForDate.length > 0 
            ? Math.max(...itemsForDate.map(tx => tx.sortOrder || 0)) + 1 
            : 0;
            
          newTransactions.push({
            name: item.name,
            amount: item.amount,
            type: item.type,
            date: dateStr,
            month: values.month,
            year: values.year,
            sortOrder,
          });
        }
      };

      if (values.dayRangeType === 'single') {
        const dateStr = toLocalDateString(values.year, values.month, values.startDay);
        values.items.forEach(item => addTransactionItem(dateStr, item));
      } else {
        for (let day = values.startDay; day <= values.endDay; day++) {
          const dateStr = toLocalDateString(values.year, values.month, day);
          values.items.forEach(item => addTransactionItem(dateStr, item));
        }
      }

      // Add IDs to the transactions
      const transactionsWithIds = newTransactions.map((tx, index) => ({
        ...tx,
        id: `${baseId}-${index}`,
      }));

      // Update the cache and local storage
      const currentData = queryClient.getQueryData<Transaction[]>(TRANSACTIONS_QUERY_KEY) || [];
      const updatedTransactions = [...currentData, ...transactionsWithIds];
      
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      queryClient.setQueryData(TRANSACTIONS_QUERY_KEY, updatedTransactions);
      
      return transactionsWithIds[0];
    },
  });

  // Update an existing transaction
  const updateTransaction = useMutation<Transaction, Error, { id: string; values: FormValues }, { previousTransactions?: Transaction[] }>({
    mutationFn: async ({ id, values }) => {
      const currentData = queryClient.getQueryData<Transaction[]>(TRANSACTIONS_QUERY_KEY) || [];
      const updatedTransaction: Transaction = {
        id,
        name: values.items[0]?.name || '',
        amount: values.items[0]?.amount || '0',
        type: values.items[0]?.type || 'spending',
        date: toLocalDateString(values.year, values.month, values.startDay),
        month: values.month,
        year: values.year,
        sortOrder: values.items[0]?.sortOrder || 0,
      };

      const updatedTransactions = currentData.map(tx => 
        tx.id === id ? updatedTransaction : tx
      );

      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      queryClient.setQueryData(TRANSACTIONS_QUERY_KEY, updatedTransactions);
      
      return updatedTransaction;
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: TRANSACTIONS_QUERY_KEY });

      // Snapshot the previous value
      const previousTransactions = queryClient.getQueryData<Transaction[]>(TRANSACTIONS_QUERY_KEY);

      // Optimistically update to the new value
      queryClient.setQueryData<Transaction[]>(TRANSACTIONS_QUERY_KEY, (old = []) =>
        old.map(tx => 
          tx.id === variables.id 
            ? {
                ...tx,
                name: variables.values.items[0]?.name || tx.name,
                amount: variables.values.items[0]?.amount || tx.amount,
                type: variables.values.items[0]?.type || tx.type,
                date: toLocalDateString(variables.values.year, variables.values.month, variables.values.startDay),
                month: variables.values.month,
                year: variables.values.year,
              }
            : tx
        )
      );

      return { previousTransactions };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousTransactions) {
        queryClient.setQueryData(TRANSACTIONS_QUERY_KEY, context.previousTransactions);
      }
    },
    onSettled: () => {
      // Sync with localStorage after mutation is complete
      const currentData = queryClient.getQueryData<Transaction[]>(TRANSACTIONS_QUERY_KEY);
      if (currentData) {
        localStorage.setItem('transactions', JSON.stringify(currentData));
      }
      // Refetch to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });

  // Delete a transaction
  const deleteTransaction = useMutation<boolean, Error, string, { previousTransactions?: Transaction[] }>({
    mutationFn: async (id: string) => {
      const currentData = queryClient.getQueryData<Transaction[]>(TRANSACTIONS_QUERY_KEY) || [];
      const updatedTransactions = currentData.filter(tx => tx.id !== id);
      
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      queryClient.setQueryData(TRANSACTIONS_QUERY_KEY, updatedTransactions);
      
      return true;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      const previousTransactions = queryClient.getQueryData<Transaction[]>(TRANSACTIONS_QUERY_KEY);
      
      queryClient.setQueryData<Transaction[]>(
        TRANSACTIONS_QUERY_KEY,
        (old = []) => old.filter((tx) => tx.id !== id)
      );

      return { previousTransactions };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(TRANSACTIONS_QUERY_KEY, context.previousTransactions);
      }
    },
    onSettled: () => {
      const currentData = queryClient.getQueryData<Transaction[]>(TRANSACTIONS_QUERY_KEY);
      if (currentData) {
        localStorage.setItem('transactions', JSON.stringify(currentData));
      }
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
