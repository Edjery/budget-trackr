import { useState } from 'react';
import type { Transaction, FormValues } from '../types';
import { useTransactionForm } from './useTransactionForm';
import type { UseMutateFunction } from '@tanstack/react-query';

type UpdateTransactionFn = UseMutateFunction<
  Transaction,
  Error,
  { id: string; values: FormValues },
  unknown
>;

type DeleteTransactionFn = UseMutateFunction<
  boolean,
  Error,
  string,
  unknown
>;

export const useTransactionEdit = (updateTransaction: UpdateTransactionFn, deleteTransaction: DeleteTransactionFn) => {
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

    const handleSaveTransaction = (values: FormValues) => {
        if (!editingTransaction) return;
        
        updateTransaction(
            { id: editingTransaction.id, values },
            {
                onSuccess: () => {
                    handleCloseEditDialog();
                },
                onError: (error) => {
                    console.error('Failed to update transaction:', error);
                    // You might want to add error handling here, like showing a toast notification
                },
            }
        );
    };

    const handleDeleteTransaction = (transaction: Transaction) => {
        deleteTransaction(transaction.id);
        handleCloseEditDialog();
    };

    return {
        isEditDialogOpen,
        editingTransaction,
        initialFormValues,
        handleEditTransaction,
        handleCloseEditDialog,
        handleSaveTransaction,
        handleDeleteTransaction,
    };
};
