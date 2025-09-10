import { useState } from "react";
import { useTransactionCalculations } from "../hooks/useTransactionCalculations";
import { useTransactionEdit } from "../hooks/useTransactionEdit";
import { useTransactionForm } from "../hooks/useTransactionForm";
import { useTransactions } from "../hooks/useTransactions";
import { SummaryCards } from "./SummaryCards";
import TransactionFormDialog from "./TransactionFormDialog";
import { TransactionList } from "./TransactionList";
import type { FormValues } from "../types";

const AppContent = () => {
    const { createEmptyTransactionItem } = useTransactionForm();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const { transactions, updateTransaction, addTransaction, deleteTransaction } = useTransactions();

    const { totalEarnings, totalSpendings, balance } = useTransactionCalculations(transactions);

    const {
        isEditDialogOpen,
        initialFormValues,
        handleEditTransaction,
        handleCloseEditDialog,
        handleSaveTransaction,
        handleDeleteTransaction,
    } = useTransactionEdit(updateTransaction.mutateAsync, deleteTransaction.mutateAsync);

    const handleAddTransaction = (values: FormValues) => {
        addTransaction.mutate(values);
        handleCloseAddDialog();
    };

    const handleOpenAddDialog = (date?: string) => {
        if (date) {
            setSelectedDate(date);
            setIsAddDialogOpen(true);
        } else {
            setSelectedDate(null);
            setIsAddDialogOpen(true);
        }
    };

    const handleCloseAddDialog = () => {
        setIsAddDialogOpen(false);
    };

    return (
        <>
            <SummaryCards totalEarnings={totalEarnings} totalSpendings={totalSpendings} balance={balance} />
            <TransactionList
                transactions={transactions}
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                onAddTransaction={handleOpenAddDialog}
            />

            <TransactionFormDialog
                openDialog={isEditDialogOpen}
                handleCloseDialog={handleCloseEditDialog}
                initialValues={initialFormValues}
                onSubmit={handleSaveTransaction}
                isEditing={!!initialFormValues}
            />

            <TransactionFormDialog
                openDialog={isAddDialogOpen}
                handleCloseDialog={handleCloseAddDialog}
                initialValues={
                    selectedDate
                        ? {
                              ...createEmptyTransactionItem(),
                              startDay: new Date(selectedDate).getDate(),
                              endDay: new Date(selectedDate).getDate(),
                              month: new Date(selectedDate).getMonth() + 1,
                              year: new Date(selectedDate).getFullYear(),
                              dayRangeType: "single" as const,
                              items: [
                                  {
                                      id: crypto.randomUUID(),
                                      type: "spendings",
                                      name: "",
                                      amount: "",
                                  },
                              ],
                          }
                        : null
                }
                onSubmit={handleAddTransaction}
                isEditing={false}
            />
        </>
    );
};

export default AppContent;
