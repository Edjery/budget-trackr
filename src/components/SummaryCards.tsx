import { AccountBalance, AttachMoney, MoneyOff, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Card, CardContent, Grid, Typography, IconButton, Tooltip } from "@mui/material";
import type { SummaryCardsProps } from "../types";
import { formatCurrency } from "../utils/currencyUtils";
import { useSettings } from "../hooks/useSettings";

interface SummaryCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: "primary" | "success" | "error";
    isVisible: boolean;
    isBalance?: boolean;
    onToggleVisibility: () => void;
}

const SummaryCard = ({ title, value, icon, color, isVisible, isBalance, onToggleVisibility }: SummaryCardProps) => {
    const { settings } = useSettings();

    return (
        <Grid size={{ xs: 12, sm: 4 }}>
            <Card elevation={3} sx={{ height: "100%" }}>
                <CardContent>
                    <Box display="flex" alignItems="center" mb={2} justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                            {icon}
                            <Typography variant="h6" color={color} sx={{ ml: 1 }}>
                                {title}
                            </Typography>
                        </Box>
                        <Tooltip title={isVisible ? "Hide card" : "Show card"}>
                            <IconButton
                                onClick={onToggleVisibility}
                                size="small"
                                color="inherit"
                                aria-label={isVisible ? "Hide card" : "Show card"}
                            >
                                {isVisible ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Typography
                        variant="h4"
                        color={isVisible && isBalance ? (value > 0 ? "success" : "error") : color}
                        sx={{
                            minHeight: "2.5em",
                            display: "flex",
                            alignItems: "center",
                            transition: "opacity 0.3s ease",
                            opacity: isVisible ? 1 : 0.7,
                            fontVariantNumeric: "tabular-nums",
                            fontFeatureSettings: '"tnum"',
                        }}
                    >
                        {isVisible ? formatCurrency(value, settings?.currency.code) : "•••••••••"}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};

export const SummaryCards = ({ totalEarnings, totalSpendings, balance }: SummaryCardsProps) => {
    const { settings, updateSettings } = useSettings();

    const handleToggleVisibility = (card: "balance" | "earnings" | "spendings") => {
        updateSettings({
            visibility: {
                balance: settings.visibility?.balance ?? true,
                earnings: settings.visibility?.earnings ?? true,
                spendings: settings.visibility?.spendings ?? true,
                [card]: !(settings.visibility?.[card] ?? true),
            },
        });
    };

    return (
        <Grid container spacing={3} sx={{ my: 4 }}>
            <SummaryCard
                title="Balance"
                value={balance}
                icon={<AccountBalance color="success" />}
                color="success"
                isVisible={settings.visibility?.balance ?? true}
                onToggleVisibility={() => handleToggleVisibility("balance")}
                isBalance
            />
            <SummaryCard
                title="Total Earnings"
                value={totalEarnings}
                icon={<AttachMoney color="primary" />}
                color="primary"
                isVisible={settings.visibility?.earnings ?? true}
                onToggleVisibility={() => handleToggleVisibility("earnings")}
            />
            <SummaryCard
                title="Total Spendings"
                value={totalSpendings}
                icon={<MoneyOff color="error" />}
                color="error"
                isVisible={settings.visibility?.spendings ?? true}
                onToggleVisibility={() => handleToggleVisibility("spendings")}
            />
        </Grid>
    );
};
