import { Box } from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { validationSchema, type FormValues, type Transaction, type TransactionItem } from "../types";
import { SummaryCards } from "./SummaryCards";
import TransactionForm from "./TransactionForm";
import { TransactionList } from "./TransactionList";

type AppFormValues = Omit<FormValues, "items"> & {
    items: TransactionItem[];
};

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentDay = new Date().getDate();
const initialValues: FormValues = {
    year: currentYear,
    month: currentMonth,
    dayRangeType: "single",
    startDay: currentDay,
    endDay: currentDay,
    items: [
        {
            id: Date.now().toString(),
            type: "spendings",
            name: "",
            amount: "",
        },
    ],
};

const AppContent = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const handleSubmit = (values: AppFormValues, { resetForm }: { resetForm: (values?: any) => void }): void => {
        const newTransactions: Transaction[] = [];
        const month = values.month - 1; // JavaScript months are 0-indexed

        const toLocalDateString = (year: number, month: number, day: number): string => {
            const date = new Date(year, month, day);
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            return localDate.toISOString().split("T")[0];
        };

        if (values.dayRangeType === "single") {
            const dateStr = toLocalDateString(values.year, month, values.startDay);
            values.items.forEach((item) => {
                if (item.name && item.amount) {
                    newTransactions.push({
                        ...item,
                        date: dateStr,
                        month: values.month,
                        year: values.year,
                    });
                }
            });
        } else {
            for (let day = values.startDay; day <= values.endDay; day++) {
                const dateStr = toLocalDateString(values.year, month, day);
                values.items.forEach((item) => {
                    if (item.name && item.amount) {
                        newTransactions.push({
                            ...item,
                            date: dateStr,
                            month: values.month,
                            year: values.year,
                        });
                    }
                });
            }
        }

        if (newTransactions.length > 0) {
            setTransactions((prev: Transaction[]) => [...prev, ...newTransactions]);
        }

        // Reset form after successful submission
        resetForm({
            year: values.year,
            month: values.month,
            dayRangeType: "single",
            startDay: values.startDay,
            endDay: values.endDay,
            items: [
                {
                    id: Date.now().toString(),
                    type: "spendings" as const,
                    name: "",
                    amount: "",
                },
            ],
        });
    };

    // Calculate totals with proper type safety
    const totalEarnings = transactions
        .filter((t: Transaction) => t.type === "earnings")
        .reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount || "0"), 0);

    const totalSpendings = transactions
        .filter((t: Transaction) => t.type === "spendings")
        .reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount || "0"), 0);

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {() => (
                <Form>
                    <Box sx={{ p: 3 }}>
                        <SummaryCards totalEarnings={totalEarnings} totalSpendings={totalSpendings} />
                        <TransactionForm />
                        <TransactionList transactions={transactions} />
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default AppContent;
