import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import usePagination from "../hooks/usePagination";
import type { Transaction } from "../types";
import DebugView from "./DebugView";
import { TransactionCard } from "./TransactionCard";
import TransactionDetailsDialog from "./TransactionDetailsDialog";

interface TransactionListProps {
    transactions: Transaction[];
    onEditTransaction?: (transaction: Transaction) => void;
    onDeleteTransaction?: (transaction: Transaction) => void;
    onAddTransaction?: (date?: string) => void;
}

export const TransactionList = ({
    transactions,
    onEditTransaction,
    onDeleteTransaction,
    onAddTransaction,
}: TransactionListProps) => {
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCardClick = (date: string) => {
        setSelectedDate(date);
        setIsDialogOpen(true);
    };

    const handleCloseDetailsDialog = () => {
        setIsDialogOpen(false);
        setTimeout(() => setSelectedDate(null), 300);
    };

    // Group transactions by date first
    const groupedByDate = transactions.reduce((acc: Record<string, Transaction[]>, transaction) => {
        const dateStr = transaction.date;
        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }
        acc[dateStr].push(transaction);
        return acc;
    }, {});

    // Sort dates in descending order (newest first)
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Paginate the dates
    const { paginatedItems: paginatedDates, loadMore, hasMore } = usePagination<string>(sortedDates, 11);

    // Create the final grouped transactions object with only the paginated dates
    const groupedTransactions = paginatedDates.reduce((acc: Record<string, Transaction[]>, date) => {
        acc[date] = groupedByDate[date];
        return acc;
    }, {});

    return (
        <>
            <Card elevation={3} sx={{ mt: 4, p: { xs: 1, sm: 2 } }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {t("transaction.form.list.title")}
                    </Typography>

                    <Grid container spacing={2}>
                        {/* Add Item Button */}
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <Card
                                onClick={() => onAddTransaction?.()}
                                sx={{
                                    height: "100%",
                                    minHeight: "14rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    bgcolor: "action.hover",
                                    "&:hover": {
                                        bgcolor: "action.selected",
                                        boxShadow: 3,
                                    },
                                    transition: "all 0.2s ease-in-out",
                                    padding: 2,
                                }}
                            >
                                <AddIcon fontSize="large" color="action" sx={{ fontSize: 48, mb: 1 }} />
                                <Typography variant="h6" color="text.secondary">
                                    {t("transaction.form.list.addButton")}
                                </Typography>
                            </Card>
                        </Grid>
                        {transactions.length === 0
                            ? null
                            : Object.entries(groupedTransactions)
                                  .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                                  .map(([date, dateTransactions]) => (
                                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={date}>
                                          <TransactionCard
                                              date={date}
                                              transactions={dateTransactions}
                                              onTransactionClick={() => handleCardClick(date)}
                                          />
                                      </Grid>
                                  ))}
                    </Grid>
                    {hasMore && (
                        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                            <Button variant="outlined" onClick={loadMore} sx={{ mt: 2 }}>
                                {t("transaction.form.list.loadMore")}
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
            <DebugView data={transactions} />
            {selectedDate && (
                <TransactionDetailsDialog
                    open={isDialogOpen}
                    onClose={handleCloseDetailsDialog}
                    transaction={{ date: selectedDate } as Transaction}
                    onEdit={onEditTransaction}
                    onDelete={onDeleteTransaction}
                    onAddTransaction={onAddTransaction}
                    transactions={transactions}
                />
            )}
        </>
    );
};
