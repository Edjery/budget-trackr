import AddIcon from "@mui/icons-material/Add";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Box,
    Button,
    Card,
    CardContent,
    Collapse,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
} from "@mui/material";
import { useState } from "react";
import type { Transaction } from "../types";
import TransactionForm from "./TransactionForm";

export const TransactionList = ({ transactions }: { transactions: Transaction[] }) => {
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
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
                                onClick={handleOpenDialog}
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    minHeight: "200px",
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
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        bgcolor: "background.paper",
                                                        "&:hover": {
                                                            boxShadow: 2,
                                                        },
                                                    }}
                                                >
                                                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                                        <Typography
                                                            variant="subtitle1"
                                                            fontWeight="medium"
                                                            color="primary"
                                                            sx={{ mb: 1 }}
                                                        >
                                                            {new Date(date).toLocaleDateString("en-PH", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            })}
                                                        </Typography>

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

                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                mt: 1,
                                                                pt: 1,
                                                                borderTop: "1px solid",
                                                                borderColor: "divider",
                                                            }}
                                                        >
                                                            <Typography variant="body2" fontWeight="bold">
                                                                Total:
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                fontWeight="bold"
                                                                color={total >= 0 ? "success.main" : "error.main"}
                                                            >
                                                                {total >= 0 ? "+" : ""}${Math.abs(total).toFixed(2)}
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
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

            {/* Add Transaction Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        <TransactionForm isSubmitting={false} />
                    </Typography>
                </DialogContent>
            </Dialog>
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
