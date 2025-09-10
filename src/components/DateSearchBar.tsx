import { Box, Card, Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { useCallback } from "react";

interface DateRange {
    start: Dayjs | null;
    end: Dayjs | null;
}

interface DateSearchBarProps {
    onDateChange: (range: DateRange) => void;
    dateRange: DateRange;
}

export const DateSearchBar = ({ onDateChange, dateRange }: DateSearchBarProps) => {
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
                <Stack direction="row" spacing={2}>
                    <Typography variant="h6" color="textSecondary" sx={{ display: "flex", alignItems: "center" }}>
                        Select Date Range:
                    </Typography>
                    <DatePicker
                        label={`From: ${start ? "" : "Oldest"}`}
                        value={start}
                        onChange={handleStartDateChange}
                        slotProps={{
                            textField: {
                                size: "small",
                            },
                            actionBar: {
                                actions: ["clear"],
                            },
                        }}
                    />
                    <DatePicker
                        label={`To: ${end ? "" : "Latest"}`}
                        value={end}
                        onChange={handleEndDateChange}
                        slotProps={{
                            textField: {
                                size: "small",
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
