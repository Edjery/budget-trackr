import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTransactions } from './useTransactions';

export const useTransactionOrder = (selectedDate: string) => {
    const { transactions, updateTransaction } = useTransactions();
    const queryClient = useQueryClient();
    
    // Get transactions for the selected date and sort them by sortOrder
    const filteredTransactions = transactions.filter(t => {
        const matches = t.date === selectedDate;
        return matches;
    });
    
    const sortedTransactions = [...filteredTransactions].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    );

    // Update the order of transactions
    const updateOrder = useCallback(async (activeId: string, overId: string) => {
        if (!selectedDate) return;

        // Get all transactions for the selected date and sort them
        const dateTransactions = transactions
            .filter(t => t.date === selectedDate)
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        
        // Find the indices of the items being moved
        const oldIndex = dateTransactions.findIndex(t => t.id === activeId);
        const newIndex = dateTransactions.findIndex(t => t.id === overId);
        
        if (oldIndex === -1 || newIndex === -1) return;
        
        // Create a new array with the updated order
        const newOrder = [...dateTransactions];
        const [movedItem] = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, movedItem);
        
        // Update sortOrder for each transaction that changed position
        const updates = newOrder.map((transaction, index) => {
            // Only update if the position changed
            if (transaction.sortOrder !== index) {
                return updateTransaction.mutateAsync({
                    id: transaction.id,
                    values: {
                        year: transaction.year,
                        month: transaction.month,
                        dayRangeType: 'single',
                        startDay: new Date(transaction.date).getDate(),
                        endDay: new Date(transaction.date).getDate(),
                        items: [{
                            id: transaction.id,
                            name: transaction.name,
                            amount: transaction.amount,
                            type: transaction.type,
                            sortOrder: index
                        }]
                    }
                });
            }
            return Promise.resolve();
        });
        
        // Wait for all updates to complete
        await Promise.all(updates);
        
        // Invalidate the transactions query to trigger a UI update
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        
    }, [selectedDate, transactions, updateTransaction, queryClient]);

    return {
        sortedTransactions,
        updateOrder,
        isLoading: false
    };
};
