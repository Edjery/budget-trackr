import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { FieldArray, useFormikContext } from "formik";
import type { FormValues, TransactionItem } from "../types";
import { useCallback, useEffect, useMemo, memo } from "react";

interface TransactionFormProps {
    isSubmitting: boolean;
}

interface CustomSelectChangeEvent {
    target: {
        name: string;
        value: unknown;
    };
    preventDefault: () => void;
    stopPropagation: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ isSubmitting }) => {
    const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<FormValues>();
    const currentYear = new Date().getFullYear();

    const getDaysInMonth = useCallback((year: number, month: number) => {
        return new Date(year, month, 0).getDate();
    }, []);

    const daysInMonth = useMemo(
        () => getDaysInMonth(values.year, values.month),
        [values.year, values.month, getDaysInMonth]
    );

    const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

    const months = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
    ];

    // Update endDay if it's greater than days in month when month or year changes
    useEffect(() => {
        if (values.endDay > daysInMonth) {
            setFieldValue("endDay", daysInMonth);
        }
    }, [values.month, values.year, daysInMonth, setFieldValue, values.endDay]);

    const handleMonthChange = (e: CustomSelectChangeEvent) => {
        handleChange(e);
        // Reset day range when month changes
        setFieldValue("startDay", 1);
        setFieldValue("endDay", 1);
    };

    const handleYearChange = (e: CustomSelectChangeEvent) => {
        handleChange(e);
        // Reset day range when year changes
        setFieldValue("startDay", 1);
        setFieldValue("endDay", 1);
    };

    const handleDayRangeTypeChange = (e: CustomSelectChangeEvent) => {
        handleChange(e);
        // Reset endDay to startDay when switching to single day
        if (e.target.value === "single") {
            setFieldValue("endDay", values.startDay);
        }
    };

    const handleStartDayChange = (e: CustomSelectChangeEvent) => {
        handleChange(e);
        // Update endDay if it's less than startDay and in multiple days mode
        if (values.dayRangeType === "multiple" && Number(e.target.value) > values.endDay) {
            setFieldValue("endDay", Number(e.target.value));
        }
    };

    // Update endDay if it's greater than days in month when month or year changes
    useEffect(() => {
        if (values.endDay > daysInMonth) {
            setFieldValue("endDay", daysInMonth);
        }
    }, [values.month, values.year, daysInMonth, setFieldValue, values.endDay]);

    // Handle adding a new transaction item
    const handleAddItem = () => {
        const newItem: TransactionItem = {
            id: Date.now().toString(),
            type: "spendings",
            name: "",
            amount: "",
        };
        setFieldValue("items", [...values.items, newItem]);
    };

    // Handle removing a transaction item
    const handleRemoveItem = (index: number) => {
        const newItems = [...values.items];
        newItems.splice(index, 1);
        setFieldValue("items", newItems);
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Date Selection Section */}
            <Box sx={{ mb: 4, p: 3, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                    Date Selection
                </Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <FormControl fullWidth error={Boolean(touched?.year && errors?.year)}>
                            <InputLabel>Year</InputLabel>
                            <Select
                                name="year"
                                value={values.year}
                                onChange={handleYearChange}
                                onBlur={handleBlur}
                                label="Year"
                            >
                                {Array.from({ length: 11 }, (_, i) => currentYear - 5 + i).map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                            {touched.year && errors.year && <FormHelperText>{String(errors.year)}</FormHelperText>}
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <FormControl fullWidth error={Boolean(touched.month && errors.month)}>
                            <InputLabel>Month</InputLabel>
                            <Select
                                name="month"
                                value={values.month}
                                onChange={handleMonthChange}
                                onBlur={handleBlur}
                                label="Month"
                            >
                                {months.map((month) => (
                                    <MenuItem key={month.value} value={month.value}>
                                        {month.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            {touched.month && errors.month && <FormHelperText>{String(errors.month)}</FormHelperText>}
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth error={Boolean(touched.dayRangeType && errors.dayRangeType)}>
                            <InputLabel>Day Range Type</InputLabel>
                            <Select
                                name="dayRangeType"
                                value={values.dayRangeType}
                                onChange={handleDayRangeTypeChange}
                                onBlur={handleBlur}
                                label="Day Range Type"
                            >
                                <MenuItem value="single">Single Day</MenuItem>
                                <MenuItem value="multiple">Multiple Days</MenuItem>
                            </Select>
                            {touched.dayRangeType && errors.dayRangeType && (
                                <FormHelperText>{errors.dayRangeType}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: values.dayRangeType === "single" ? 12 : 6 }}>
                        <FormControl fullWidth error={Boolean(touched.startDay && errors.startDay)}>
                            <InputLabel>Start Day</InputLabel>
                            <Select
                                name="startDay"
                                value={values.startDay}
                                onChange={handleStartDayChange}
                                onBlur={handleBlur}
                                label="Start Day"
                            >
                                {days.map((day) => (
                                    <MenuItem key={day} value={day}>
                                        {day}
                                    </MenuItem>
                                ))}
                            </Select>
                            {touched.startDay && errors.startDay && (
                                <FormHelperText>{String(errors.startDay)}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    {values.dayRangeType === "multiple" && (
                        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                            <FormControl fullWidth error={Boolean(touched.endDay && errors.endDay)}>
                                <InputLabel>End Day</InputLabel>
                                <Select
                                    name="endDay"
                                    value={values.endDay}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="End Day"
                                    disabled={isSubmitting}
                                >
                                    {days
                                        .filter((day) => day >= values.startDay)
                                        .map((day) => (
                                            <MenuItem key={day} value={day}>
                                                {day}
                                            </MenuItem>
                                        ))}
                                </Select>
                                {touched.endDay && errors.endDay && <FormHelperText>{errors.endDay}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    )}
                </Grid>
            </Box>

            {/* Transaction Items Section */}
            <Box sx={{ mt: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6">Transaction Items</Typography>
                </Box>

                <FieldArray name="items">
                    {() => (
                        <Box sx={{ mt: 3 }}>
                            <Box sx={{ mb: 3 }}>
                                {values.items.map((item, index) => (
                                    <Box
                                        key={item.id}
                                        sx={{
                                            mb: 2,
                                            p: 2,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid size={{ xs: 12, sm: 5 }}>
                                                <FormControl
                                                    fullWidth
                                                    error={Boolean(
                                                        touched.items?.[index]?.name &&
                                                            typeof errors.items?.[index] === "object" &&
                                                            errors.items?.[index] &&
                                                            "name" in errors.items[index]!
                                                    )}
                                                >
                                                    <TextField
                                                        name={`items.${index}.name`}
                                                        label="Item Name"
                                                        fullWidth
                                                        size="small"
                                                        value={item.name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        disabled={isSubmitting}
                                                    />
                                                    {touched.items?.[index]?.name &&
                                                        typeof errors.items?.[index] === "object" &&
                                                        errors.items?.[index] &&
                                                        "name" in errors.items[index]! && (
                                                            <FormHelperText>
                                                                {String((errors.items?.[index] as any)?.name)}
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 3 }}>
                                                <FormControl
                                                    fullWidth
                                                    error={Boolean(
                                                        touched.items?.[index]?.type &&
                                                            typeof errors.items?.[index] === "object" &&
                                                            errors.items?.[index] &&
                                                            "type" in errors.items[index]!
                                                    )}
                                                >
                                                    <InputLabel>Type</InputLabel>
                                                    <Select
                                                        name={`items.${index}.type`}
                                                        value={item.type}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        label="Type"
                                                        size="small"
                                                        disabled={isSubmitting}
                                                    >
                                                        <MenuItem value="earnings">Earnings</MenuItem>
                                                        <MenuItem value="spendings">Spendings</MenuItem>
                                                    </Select>
                                                    {touched.items?.[index]?.type &&
                                                        typeof errors.items?.[index] === "object" &&
                                                        errors.items?.[index] &&
                                                        "type" in errors.items[index]! && (
                                                            <FormHelperText>
                                                                {String((errors.items?.[index] as any)?.type)}
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 3 }}>
                                                <FormControl
                                                    fullWidth
                                                    error={Boolean(
                                                        touched.items?.[index]?.amount &&
                                                            typeof errors.items?.[index] === "object" &&
                                                            errors.items?.[index] &&
                                                            "amount" in errors.items[index]!
                                                    )}
                                                >
                                                    <TextField
                                                        name={`items.${index}.amount`}
                                                        label="Amount"
                                                        type="number"
                                                        value={item.amount}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        inputProps={{ step: "0.01", min: "0.01" }}
                                                        fullWidth
                                                        size="small"
                                                        disabled={isSubmitting}
                                                    />
                                                    {touched.items?.[index]?.amount &&
                                                        typeof errors.items?.[index] === "object" &&
                                                        errors.items?.[index] &&
                                                        "amount" in errors.items[index]! && (
                                                            <FormHelperText>
                                                                {String((errors.items?.[index] as any)?.amount)}
                                                            </FormHelperText>
                                                        )}
                                                </FormControl>
                                            </Grid>

                                            <Grid
                                                size={{ xs: 12, sm: 1 }}
                                                sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                            >
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleRemoveItem(index)}
                                                    disabled={values.items.length <= 1 || isSubmitting}
                                                    sx={{ minWidth: "auto" }}
                                                >
                                                    <RemoveIcon />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}

                                <Grid
                                    size={{ xs: 12, sm: 1 }}
                                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                >
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddItem}
                                        disabled={isSubmitting}
                                    >
                                        Add Item
                                    </Button>
                                </Grid>
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    disabled={values.items.length === 0 || isSubmitting}
                                    fullWidth
                                >
                                    Save Transaction{values.dayRangeType === "single" ? "" : "s"}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </FieldArray>
            </Box>
        </Box>
    );
};

export default memo(TransactionForm);
