import { AccountBalance, AttachMoney, MoneyOff } from "@mui/icons-material";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import type { SummaryCardsProps } from "../types";
import { formatCurrency } from "../utils/currencyUtils";
import { useSettings } from "../hooks/useSettings";

interface SummaryCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: "primary" | "success" | "error";
    isBalance?: boolean;
}

const SummaryCard = ({ title, value, icon, color, isBalance = false }: SummaryCardProps) => {
    const { settings } = useSettings();
    const textColor = isBalance ? (value >= 0 ? "success.main" : "error.main") : `${color}.main`;

    return (
        <Grid size={{ xs: 12, sm: 4 }}>
            <Card elevation={3} sx={{ height: "100%" }}>
                <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                        {icon}
                        <Typography variant="h6" color={color} sx={{ ml: 1 }}>
                            {title}
                        </Typography>
                    </Box>
                    <Typography variant="h4" color={textColor}>
                        {formatCurrency(value, settings?.currency.code)}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};

export const SummaryCards = ({ totalEarnings, totalSpendings, balance }: SummaryCardsProps) => (
    <Grid container spacing={3} sx={{ my: 4 }}>
        <SummaryCard
            title="Balance"
            value={balance}
            icon={<AccountBalance color={balance >= 0 ? "success" : "error"} />}
            color={balance >= 0 ? "success" : "error"}
            isBalance
        />
        <SummaryCard
            title="Total Earnings"
            value={totalEarnings}
            icon={<AttachMoney color="primary" />}
            color="primary"
        />
        <SummaryCard title="Total Spendings" value={totalSpendings} icon={<MoneyOff color="error" />} color="error" />
    </Grid>
);
