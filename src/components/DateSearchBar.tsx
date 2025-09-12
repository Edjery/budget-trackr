import { Box, Card, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface DateRange {
    start: Dayjs | null;
    end: Dayjs | null;
}

interface DateSearchBarProps {
    onDateChange: (range: DateRange) => void;
    dateRange: DateRange;
}

export const DateSearchBar = ({ onDateChange, dateRange }: DateSearchBarProps) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { start, end } = dateRange;

    const handleStartDateChange = useCallback(
        (date: Dayjs | null) => {
            onDateChange({ ...dateRange, start: date });
        },
        [dateRange, onDateChange]
    );

    const handleEndDateChange = useCallback(
        (date: Dayjs | null) => {
            onDateChange({ ...dateRange, end: date });
        },
        [dateRange, onDateChange]
    );

    return (
        <Card elevation={3} sx={{ mt: 4, p: 2 }}>
            <Box sx={{ p: 2, backgroundColor: "background.paper" }}>
                <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                    <Typography variant="h6" color="textSecondary" sx={{ display: "flex", alignItems: "center" }}>
                        {t("dateRange.selectDateRange")}
                    </Typography>
                    <DatePicker
                        label={`${t("dateRange.from")} ${start ? "" : t("dateRange.earliest")}`}
                        value={start}
                        onChange={handleStartDateChange}
                        slotProps={{
                            textField: {
                                size: "small",
                                placeholder: t("dateRange.earliest"),
                            },
                            actionBar: {
                                actions: ["clear"],
                            },
                        }}
                    />
                    <DatePicker
                        label={`${t("dateRange.to")} ${end ? "" : t("dateRange.latest")}`}
                        value={end}
                        onChange={handleEndDateChange}
                        slotProps={{
                            textField: {
                                size: "small",
                                placeholder: t("dateRange.latest"),
                            },
                            actionBar: {
                                actions: ["clear"],
                            },
                        }}
                        minDate={start || undefined}
                    />
                </Stack>
            </Box>
        </Card>
    );
};
