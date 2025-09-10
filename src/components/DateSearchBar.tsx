import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { useCallback } from "react";

interface DateSearchBarProps {
    onDateChange: (date: Dayjs | null) => void;
    selectedDate: Dayjs | null;
}

export const DateSearchBar = ({ onDateChange, selectedDate }: DateSearchBarProps) => {
    const handleDateChange = useCallback(
        (date: Dayjs | null) => {
            onDateChange(date);
        },
        [onDateChange]
    );

    return (
        <Box sx={{ p: 2, backgroundColor: "background.paper", borderBottom: 1, borderColor: "divider" }}>
            <DatePicker
                label="Search by date"
                value={selectedDate}
                onChange={handleDateChange}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        size: "small",
                    },
                }}
            />
        </Box>
    );
};
