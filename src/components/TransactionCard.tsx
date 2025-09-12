import { Box, Card, CardContent, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getLocaleByLanguage } from "../constants/languages";
import useSettings from "../hooks/useSettings";
import type { Transaction } from "../types";
import { formatCurrency } from "../utils/currencyUtils";

interface TransactionCardProps {
    date: string;
    transactions: Transaction[];
    onTransactionClick: (date: string) => void;
}

export const TransactionCard = ({ date, transactions, onTransactionClick }: TransactionCardProps) => {
    const { t } = useTranslation();
    const { settings } = useSettings();
    const total = transactions.reduce((sum, t) => {
        const amount = parseFloat(t.amount);
        return t.type === "earnings" ? sum + amount : sum - amount;
    }, 0);

    return (
        <Card
            onClick={() => onTransactionClick(date)}
            sx={{
                height: "100%",
                minHeight: "14rem",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                "&:hover": {
                    boxShadow: 3,
                },
                transition: "all 0.2s ease-in-out",
            }}
        >
            <CardContent sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column" }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                        {new Date(date).toLocaleDateString(getLocaleByLanguage(settings?.language) || "en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </Typography>
                </Box>

                <Box sx={{ flex: 1, overflow: "auto", mb: 2 }}>
                    {[...transactions]
                        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                        .slice(0, 3)
                        .map((transaction, index) => (
                            <Box key={index} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" noWrap sx={{ maxWidth: "70%" }}>
                                    {transaction.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color={transaction.type === "earnings" ? "success.main" : "error.main"}
                                    sx={{ fontWeight: "medium" }}
                                >
                                    {transaction.type === "earnings" ? "+" : "-"}
                                    {formatCurrency(parseFloat(transaction.amount), settings?.currency.code)}
                                </Typography>
                            </Box>
                        ))}
                    {transactions.length > 3 && (
                        <Typography variant="caption" color="text.secondary">
                            {t("common.more", { count: transactions.length - 3 })}
                        </Typography>
                    )}
                </Box>

                <Box
                    sx={{
                        mt: "auto",
                        pt: 1,
                        borderTop: 1,
                        borderColor: "divider",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="subtitle2">{t("common.total")}:</Typography>
                    <Typography
                        variant="subtitle1"
                        color={total >= 0 ? "success.main" : "error.main"}
                        sx={{ fontWeight: "bold" }}
                    >
                        {formatCurrency(total, settings?.currency.code)}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};
