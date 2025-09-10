import { useState, useCallback } from 'react';
import type { Transaction, FormValues } from '../types';
import { useTransactionForm } from './useTransactionForm';
import { toLocalDateString } from '../utils/dateUtils';

export const useTransactionEdit = (updateTransaction: (id: string, values: FormValues) => Promise<void>) => {
    const { transactionToFormValues } = useTransactionForm();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [initialFormValues, setInitialFormValues] = useState<FormValues | null>(null);

    const handleEditTransaction = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        const formValues = transactionToFormValues(transaction);
        setInitialFormValues(formValues);
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setEditingTransaction(null);
        setInitialFormValues(null);
    };

    const handleSaveTransaction = useCallback(async (values: FormValues) => {
        if (!editingTransaction) return;
        
        try {
            // Convert form values back to transaction format
            const updatedTransaction: Transaction = {
                ...editingTransaction,
                name: values.items[0]?.name || '',
                amount: values.items[0]?.amount || '0',
                type: values.items[0]?.type || 'spendings',
                date: toLocalDateString(values.year, values.month, values.startDay),
                month: values.month,
                year: values.year,
            };

            // Update the transaction
            await updateTransaction(editingTransaction.id, values);
            
            // Update local storage
            const storedTransactions = localStorage.getItem('transactions');
            if (storedTransactions) {
                const transactions: Transaction[] = JSON.parse(storedTransactions);
                const updatedTransactions = transactions.map(tx => 
                    tx.id === editingTransaction.id ? updatedTransaction : tx
                );
                localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
            }
            
            handleCloseEditDialog();
        } catch (error) {
            console.error('Failed to update transaction:', error);
            // You might want to add error handling here, like showing a toast notification
        }
    }, [editingTransaction, updateTransaction]);

    return {
        isEditDialogOpen,
        editingTransaction,
        initialFormValues,
        handleEditTransaction,
        handleCloseEditDialog,
        handleSaveTransaction,
    };
};
