import AddIcon from "@mui/icons-material/Add";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Card, CardContent, Collapse, Grid, Typography } from "@mui/material";
import { useState } from "react";
import type { Transaction } from "../types";
import TransactionDetailsDialog from "./TransactionDetailsDialog";

interface TransactionListProps {
    transactions: Transaction[];
    onEditTransaction?: (transaction: Transaction) => void;
    onAddTransaction?: () => void;
}

export const TransactionList = ({ transactions, onEditTransaction, onAddTransaction }: TransactionListProps) => {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCardClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsDialogOpen(true);
    };

    const handleCloseDetailsDialog = () => {
        setIsDialogOpen(false);
        setTimeout(() => setSelectedTransaction(null), 300); // Wait for dialog animation
    };

    const handleEdit = () => {
        if (selectedTransaction && onEditTransaction) {
            onEditTransaction(selectedTransaction);
            handleCloseDetailsDialog();
        }
    };

    const handleOpenAddDialog = onAddTransaction || (() => {});

    const groupedTransactions = transactions.reduce((acc: Record<string, Transaction[]>, transaction) => {
        const dateStr = transaction.date;
        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }
        acc[dateStr].push(transaction);
        return acc;
    }, {});

    const calculateTotal = (transactions: Transaction[]): number => {
        return transactions.reduce((sum: number, t: Transaction) => {
            const amount = parseFloat(t.amount);
            return t.type === "earnings" ? sum + amount : sum - amount;
        }, 0);
    };

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
                                onClick={handleOpenAddDialog}
                                sx={{
                                    height: "100%",
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
                        {transactions.length === 0 ? null : (
                            <>
                                {Object.entries(groupedTransactions)
                                    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                                    .map(([date, dateTransactions]) => {
                                        const total = calculateTotal(dateTransactions);
                                        return (
                                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={date}>
                                                <Card
                                                    variant="outlined"
                                                    sx={{
                                                        height: "100%",
                                                        maxHeight: "15rem",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        bgcolor: "background.paper",
                                                        transition: "all 0.2s ease-in-out",
                                                        "&:hover": {
                                                            boxShadow: 3,
                                                            transform: "translateY(-2px)",
                                                        },
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => {
                                                        if (dateTransactions.length > 0) {
                                                            handleCardClick(dateTransactions[0]);
                                                        }
                                                    }}
                                                >
                                                    {/* Header with Date */}
                                                    <Box
                                                        sx={{
                                                            p: 2,
                                                            pb: 1,
                                                            borderBottom: "1px solid",
                                                            borderColor: "divider",
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="subtitle1"
                                                            fontWeight="medium"
                                                            color="primary"
                                                        >
                                                            {new Date(date).toLocaleDateString("en-PH", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            })}
                                                        </Typography>
                                                    </Box>
                                                    {/* Scrollable Content */}
                                                    <Box
                                                        sx={{
                                                            flex: "1 1 auto",
                                                            overflowY: "auto",
                                                            p: 2,
                                                            "&::-webkit-scrollbar": {
                                                                width: "6px",
                                                            },
                                                            "&::-webkit-scrollbar-track": {
                                                                background: "transparent",
                                                            },
                                                            "&::-webkit-scrollbar-thumb": {
                                                                background: "#888",
                                                                borderRadius: "4px",
                                                                "&:hover": {
                                                                    background: "#555",
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                gap: 1,
                                                                mb: 1,
                                                            }}
                                                        >
                                                            {dateTransactions.map((transaction) => (
                                                                <Box
                                                                    key={transaction.id}
                                                                    sx={{
                                                                        display: "flex",
                                                                        justifyContent: "space-between",
                                                                        alignItems: "center",
                                                                        py: 0.5,
                                                                    }}
                                                                >
                                                                    <Typography variant="body2">
                                                                        {transaction.name}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="body2"
                                                                        color={
                                                                            transaction.type === "earnings"
                                                                                ? "success.main"
                                                                                : "error.main"
                                                                        }
                                                                        fontWeight="medium"
                                                                    >
                                                                        {transaction.type === "earnings" ? "+" : "-"}$
                                                                        {parseFloat(transaction.amount).toFixed(2)}
                                                                    </Typography>
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                    {/* Fixed Footer with Total */}
                                                    <Box
                                                        sx={{
                                                            p: 2,
                                                            bgcolor: "background.paper",
                                                            borderTop: "1px solid",
                                                            borderColor: "divider",
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            zIndex: 1,
                                                            boxShadow: "0 -2px 8px rgba(0,0,0,0.05)",
                                                        }}
                                                    >
                                                        <Typography variant="subtitle2" fontWeight="bold">
                                                            Total:
                                                        </Typography>
                                                        <Typography
                                                            variant="subtitle1"
                                                            fontWeight="bold"
                                                            color={total >= 0 ? "success.main" : "error.main"}
                                                        >
                                                            {total >= 0 ? "+" : "-"} ${Math.abs(total).toFixed(2)}
                                                        </Typography>
                                                    </Box>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                            </>
                        )}
                    </Grid>
                </CardContent>
            </Card>
            <DebugView data={transactions} />

            <TransactionDetailsDialog
                open={isDialogOpen}
                onClose={handleCloseDetailsDialog}
                transaction={selectedTransaction}
                onEdit={handleEdit}
                onAddTransaction={onAddTransaction}
                transactions={transactions}
            />
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
            >
                {expanded ? "Hide Debug Data" : "Show Debug Data"}
            </Button>
            <Collapse in={expanded}>
                <pre
                    style={{
                        marginTop: "1rem",
                        padding: "1rem",
                        background: "#f5f5f5",
                        borderRadius: "4px",
                        overflowX: "auto",
                        fontSize: "0.875rem",
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                    }}
                >
                    {JSON.stringify(data, null, 2)}
                </pre>
            </Collapse>
        </Box>
    );
};
