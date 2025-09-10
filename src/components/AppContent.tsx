import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useState } from "react";
import { useTransactionCalculations } from "../hooks/useTransactionCalculations";
import { useTransactionEdit } from "../hooks/useTransactionEdit";
import { useTransactionForm } from "../hooks/useTransactionForm";
import { useTransactions } from "../hooks/useTransactions";
import type { FormValues } from "../types";
import { DateSearchBar } from "./DateSearchBar";
import { SummaryCards } from "./SummaryCards";
import TransactionFormDialog from "./TransactionFormDialog";
import { TransactionList } from "./TransactionList";

const AppContent = () => {
    const { createEmptyTransactionItem } = useTransactionForm();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [searchDate, setSearchDate] = useState<Dayjs | null>(null);

    const { transactions, updateTransaction, addTransaction, deleteTransaction } = useTransactions();

    // Filter transactions based on searchDate if provided
    const filteredTransactions = searchDate
        ? transactions.filter((tx) => {
              const txDate = dayjs(tx.date).startOf("day");
              const searchDateStart = searchDate.startOf("day");
              return txDate.isSame(searchDateStart, "day");
          })
        : transactions;

    const { totalEarnings, totalSpendings, balance } = useTransactionCalculations(filteredTransactions);

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

            <DateSearchBar selectedDate={searchDate} onDateChange={setSearchDate} />

            <TransactionList
                transactions={filteredTransactions}
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
                                      type: "spendings" as const,
                                      name: "",
                                      amount: "",
                                      sortOrder: 0, // Default sort order for new items
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
