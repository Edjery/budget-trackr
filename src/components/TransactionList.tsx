import { Box, Card, CardContent, Typography } from "@mui/material";
import type { Transaction } from "../types";

export const TransactionList = ({ transactions }: { transactions: Transaction[] }) => {
    const groupedTransactions = transactions.reduce((acc: Record<string, Transaction[]>, transaction) => {
        const dateStr = transaction.date;
        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }
        acc[dateStr].push(transaction);
        return acc;
    }, {});

    return (
        <Card elevation={3} sx={{ mt: 4 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Recent Transactions
                </Typography>

                {transactions.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center" py={4}>
                        No transactions yet. Add one above!
                    </Typography>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: "16px",
                            width: "100%",
                        }}
                    >
                        {Object.entries(groupedTransactions)
                            .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                            .map(([date, dateTransactions]) => (
                                <div key={date}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            bgcolor: "background.paper",
                                            "&:hover": {
                                                boxShadow: 2,
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 2 }}>
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight="medium"
                                                color="primary"
                                                sx={{ mb: 1 }}
                                            >
                                                {new Date(date).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </Typography>

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
                                                    <Typography variant="body2">{transaction.name}</Typography>
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
                                                    color={
                                                        dateTransactions.reduce(
                                                            (sum, t) =>
                                                                sum +
                                                                (t.type === "earnings"
                                                                    ? parseFloat(t.amount)
                                                                    : -parseFloat(t.amount)),
                                                            0
                                                        ) >= 0
                                                            ? "success.main"
                                                            : "error.main"
                                                    }
                                                >
                                                    {dateTransactions.reduce(
                                                        (sum, t) =>
                                                            sum +
                                                            (t.type === "earnings"
                                                                ? parseFloat(t.amount)
                                                                : -parseFloat(t.amount)),
                                                        0
                                                    ) >= 0
                                                        ? "+"
                                                        : ""}
                                                    $
                                                    {Math.abs(
                                                        dateTransactions.reduce(
                                                            (sum, t) =>
                                                                sum +
                                                                (t.type === "earnings"
                                                                    ? parseFloat(t.amount)
                                                                    : -parseFloat(t.amount)),
                                                            0
                                                        )
                                                    ).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
