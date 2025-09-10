import AddIcon from "@mui/icons-material/Add";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Card, CardContent, Collapse, Grid, Typography } from "@mui/material";
import { useState } from "react";
import type { Transaction } from "../types";
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

    const groupedTransactions = transactions.reduce((acc: Record<string, Transaction[]>, transaction) => {
        const dateStr = transaction.date;
        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }
        acc[dateStr].push(transaction);
        return acc;
    }, {});

    return (
        <>
            <Card elevation={3} sx={{ mt: 4, p: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Recent Transactions
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
                                    cursor: "pointer",
                                    bgcolor: "action.hover",
                                    "&:hover": {
                                        bgcolor: "action.selected",
                                        boxShadow: 3,
                                    },
                                    transition: "all 0.2s ease-in-out",
                                }}
                            >
                                <AddIcon fontSize="large" color="action" sx={{ fontSize: 48, mb: 1 }} />
                                <Typography variant="h6" color="text.secondary">
                                    Add New Transaction
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

const DebugView = ({ data }: { data: any }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Box sx={{ mt: 4, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
            <Button
                onClick={() => setExpanded(!expanded)}
                startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ mb: 1 }}
            >
                {expanded ? "Hide Debug Data" : "Show Debug Data"}
            </Button>
            <Collapse in={expanded}>
                <Box
                    component="pre"
                    sx={{
                        p: 2,
                        bgcolor: "background.default",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        overflowX: "auto",
                        fontSize: "0.75rem",
                        fontFamily: "monospace",
                        maxHeight: "400px",
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                    }}
                >
                    {JSON.stringify(data, null, 2)}
                </Box>
            </Collapse>
        </Box>
    );
};
