import { Box } from "@mui/material";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useState } from "react";
import { useTransactionCalculations } from "../hooks/useTransactionCalculations";
import { useTransactionEdit } from "../hooks/useTransactionEdit";
import { useTransactionForm } from "../hooks/useTransactionForm";
import { useTransactions } from "../hooks/useTransactions";
import type { FormValues } from "../types";
import { DateSearchBar } from "./DateSearchBar";
import DebugView from "./DebugView";
import { SummaryCards } from "./SummaryCards";
import TransactionFormDialog from "./TransactionFormDialog";
import { TransactionList } from "./TransactionList";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface DateRange {
    start: Dayjs | null;
    end: Dayjs | null;
}

const AppContent = () => {
    const { createEmptyTransactionItem } = useTransactionForm();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>({
        start: null,
        end: null,
    });

    const { transactions, updateTransaction, addTransaction, deleteTransaction } = useTransactions();
    const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);

    // Filter transactions based on date range if provided
    const filteredTransactions = (() => {
        if (!dateRange.start && !dateRange.end) return transactions;

        const startDate = dateRange.start?.startOf("day");
        const endDate = dateRange.end?.endOf("day");

        return transactions.filter((tx) => {
            const txDate = dayjs(tx.date);
            const isAfterStart = !startDate || txDate.isSameOrAfter(startDate, "day");
            const isBeforeEnd = !endDate || txDate.isSameOrBefore(endDate, "day");
            return isAfterStart && isBeforeEnd;
        });
    })();

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
        <Box
            sx={{
                pt: 6,
                px: 1,
                pb: 3,
            }}
        >
            <SummaryCards totalEarnings={totalEarnings} totalSpendings={totalSpendings} balance={balance} />
            <DateSearchBar dateRange={dateRange} onDateChange={setDateRange} />
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
            <DebugView />
        </Box>
    );
};

export default AppContent;
