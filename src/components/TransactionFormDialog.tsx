import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Form, Formik } from "formik";
import { useTransactionForm } from "../hooks/useTransactionForm";
import useTransactionSubmission from "../hooks/useTransactionSubmission";
import { type FormValues, validationSchema } from "../types";
import TransactionForm from "./TransactionForm";

interface TransactionFormDialogProps {
    openDialog: boolean;
    handleCloseDialog: () => void;
    initialValues: FormValues | null;
    onSubmit: (values: FormValues) => void | Promise<void>;
    isEditing: boolean;
}

const TransactionFormDialog = ({
    openDialog,
    handleCloseDialog,
    initialValues: propInitialValues,
    onSubmit: propOnSubmit,
    isEditing = false,
}: TransactionFormDialogProps) => {
    const { getInitialValues, createEmptyTransactionItem, resetFormValues } = useTransactionForm();
    const { submitTransaction, isSubmitting } = useTransactionSubmission();
    const initialValues = propInitialValues || getInitialValues();

    const handleSubmit = async (
        values: FormValues,
        { resetForm }: { resetForm: (values?: any) => void }
    ): Promise<void> => {
        if (propOnSubmit) {
            await propOnSubmit(values);
        } else {
            await submitTransaction(values, () => {
                resetForm({
                    ...resetFormValues(values),
                    items: [createEmptyTransactionItem()],
                });
            });
        }
    };

    return (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
            <DialogContent>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting: formikIsSubmitting }) => (
                        <Form>
                            <Box sx={{ p: 3 }}>
                                <TransactionForm isSubmitting={isSubmitting || formikIsSubmitting} />
                            </Box>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionFormDialog;
