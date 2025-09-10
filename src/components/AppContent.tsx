import { useTransactionCalculations } from "../hooks/useTransactionCalculations";
import { useTransactionEdit } from "../hooks/useTransactionEdit";
import { useTransactionSubmission } from "../hooks/useTransactionSubmission";
import { SummaryCards } from "./SummaryCards";
import TransactionFormDialog from "./TransactionFormDialog";
import { TransactionList } from "./TransactionList";

const AppContent = () => {
    const { transactions, updateTransaction } = useTransactionSubmission();
    const { totalEarnings, totalSpendings, balance } = useTransactionCalculations(transactions);

    const { isEditDialogOpen, initialFormValues, handleEditTransaction, handleCloseEditDialog, handleSaveTransaction } =
        useTransactionEdit(updateTransaction);

    return (
        <>
            <SummaryCards totalEarnings={totalEarnings} totalSpendings={totalSpendings} balance={balance} />
            <TransactionList transactions={transactions} onEditTransaction={handleEditTransaction} />

            {initialFormValues && (
                <TransactionFormDialog
                    openDialog={isEditDialogOpen}
                    handleCloseDialog={handleCloseEditDialog}
                    initialValues={initialFormValues}
                    onSubmit={handleSaveTransaction}
                    isEditing={true}
                />
            )}
        </>
    );
};

export default AppContent;
