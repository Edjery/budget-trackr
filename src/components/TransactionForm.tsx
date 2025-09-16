import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
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
import { FieldArray, useFormikContext } from "formik";
import { memo, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { FormValues, TransactionItem } from "../types";

// Month names for localization
const MONTHS = [
    { value: 1, key: "january" },
    { value: 2, key: "february" },
    { value: 3, key: "march" },
    { value: 4, key: "april" },
    { value: 5, key: "may" },
    { value: 6, key: "june" },
    { value: 7, key: "july" },
    { value: 8, key: "august" },
    { value: 9, key: "september" },
    { value: 10, key: "october" },
    { value: 11, key: "november" },
    { value: 12, key: "december" },
];

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
    const { t } = useTranslation();
    const { values, errors, touched, handleChange, handleBlur, setFieldValue } = useFormikContext<FormValues>();
    const currentYear = new Date().getFullYear();

    // Localized month names
    const months = useMemo(
        () =>
            MONTHS.map((month) => ({
                value: month.value,
                label: t(`common.months.${month.key}`),
            })),
        [t]
    );

    const getDaysInMonth = useCallback((year: number, month: number) => {
        return new Date(year, month, 0).getDate();
    }, []);

    const daysInMonth = useMemo(
        () => getDaysInMonth(values.year, values.month),
        [values.year, values.month, getDaysInMonth]
    );

    const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

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

    // Sort items by sortOrder
    const sortedItems = [...values.items].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    // Handle adding a new transaction item
    const handleAddItem = () => {
        const newItem: TransactionItem = {
            id: Date.now().toString(),
            type: "spendings",
            name: "",
            amount: "",
            sortOrder:
                values.items.length > 0 ? Math.max(...values.items.map((item) => item.sortOrder || 0), 0) + 1 : 0,
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
        <Box>
            {/* Date Selection Section */}
            <Box sx={{ mb: 4, p: 3, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                    {t("transaction.form.dateSection")}
                </Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ width: "100%" }}>
                        <FormControl fullWidth error={Boolean(touched?.year && errors?.year)}>
                            <InputLabel>{t("transaction.year")}</InputLabel>
                            <Select
                                name="year"
                                value={values.year}
                                onChange={handleYearChange}
                                onBlur={handleBlur}
                                label={t("transaction.year")}
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
                            <InputLabel>{t("transaction.month")}</InputLabel>
                            <Select
                                name="month"
                                value={values.month}
                                onChange={handleMonthChange}
                                onBlur={handleBlur}
                                label={t("transaction.month")}
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

                    <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ width: "100%" }}>
                        <FormControl fullWidth error={Boolean(touched.dayRangeType && errors.dayRangeType)}>
                            <InputLabel>{t("transaction.day")}</InputLabel>
                            <Select
                                name="dayRangeType"
                                value={values.dayRangeType}
                                onChange={handleDayRangeTypeChange}
                                onBlur={handleBlur}
                                label={t("transaction.day")}
                            >
                                <MenuItem value="single">{t("transaction.dayRange.single")}</MenuItem>
                                <MenuItem value="multiple">{t("transaction.dayRange.multiple")}</MenuItem>
                            </Select>
                            {touched.dayRangeType && errors.dayRangeType && (
                                <FormHelperText>{errors.dayRangeType}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid
                        size={{ xs: 12, sm: 6, md: values.dayRangeType === "single" ? 12 : 6 }}
                        sx={{ width: "100%" }}
                    >
                        <FormControl fullWidth error={Boolean(touched.startDay && errors.startDay)}>
                            <InputLabel>{t("transaction.startDay")}</InputLabel>
                            <Select
                                name="startDay"
                                value={values.startDay}
                                onChange={handleStartDayChange}
                                onBlur={handleBlur}
                                label={t("transaction.startDay")}
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
                                <InputLabel>{t("transaction.endDay")}</InputLabel>
                                <Select
                                    name="endDay"
                                    value={values.endDay}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label={t("transaction.endDay")}
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
                <FieldArray name="items">
                    {({}) => (
                        <Box>
                            {sortedItems.map((item, index) => (
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
                                                    label={t("transaction.form.itemName")}
                                                    fullWidth
                                                    size="small"
                                                    value={item.name}
                                                    onChange={(e) => {
                                                        const trimmedValue = e.target.value.trim();
                                                        handleChange({
                                                            target: {
                                                                name: `items.${index}.name`,
                                                                value: trimmedValue,
                                                            },
                                                        });
                                                    }}
                                                    onBlur={(e) => {
                                                        const trimmedValue = e.target.value.trim();
                                                        if (trimmedValue !== e.target.value) {
                                                            handleChange({
                                                                target: {
                                                                    name: `items.${index}.name`,
                                                                    value: trimmedValue,
                                                                },
                                                            });
                                                        }
                                                        handleBlur(e);
                                                    }}
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
                                                <InputLabel>{t("transaction.form.type")}</InputLabel>
                                                <Select
                                                    name={`items.${index}.type`}
                                                    value={item.type}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    label={t("transaction.form.type")}
                                                    size="small"
                                                    disabled={isSubmitting}
                                                >
                                                    <MenuItem value="earnings">{t("transaction.earnings")}</MenuItem>
                                                    <MenuItem value="spendings">{t("transaction.spendings")}</MenuItem>
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
                                                    label={t("transaction.form.amount")}
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

                            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleAddItem}
                                    disabled={isSubmitting}
                                >
                                    {t("transaction.form.addItem")}
                                </Button>
                            </Grid>
                        </Box>
                    )}
                </FieldArray>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={values.items.length === 0 || isSubmitting}
                        fullWidth
                    >
                        {t(`transaction.form.saveButton.${values.items.length > 1 ? "multiple" : "single"}`)}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default memo(TransactionForm);
