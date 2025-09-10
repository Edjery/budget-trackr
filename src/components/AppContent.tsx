import { useState } from "react";
import { useTransactionCalculations } from "../hooks/useTransactionCalculations";
import { useTransactionEdit } from "../hooks/useTransactionEdit";
import { useTransactions } from "../hooks/useTransactions";
import { SummaryCards } from "./SummaryCards";
import TransactionFormDialog from "./TransactionFormDialog";
import { TransactionList } from "./TransactionList";
import type { FormValues } from "../types";

const AppContent = () => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const { transactions, updateTransaction, addTransaction } = useTransactions();

    const { totalEarnings, totalSpendings, balance } = useTransactionCalculations(transactions);

    const { isEditDialogOpen, initialFormValues, handleEditTransaction, handleCloseEditDialog, handleSaveTransaction } =
        useTransactionEdit(updateTransaction.mutateAsync);

    const handleAddTransaction = (values: FormValues) => {
        addTransaction.mutate(values);
        handleCloseAddDialog();
    };

    const handleOpenAddDialog = () => {
        setIsAddDialogOpen(true);
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
                initialValues={null}
                onSubmit={handleAddTransaction}
                isEditing={false}
            />
        </>
    );
};

export default AppContent;
