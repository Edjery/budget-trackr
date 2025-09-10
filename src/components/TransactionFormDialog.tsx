import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
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
            <DialogTitle sx={{ m: 0, p: 2 }}>
                {isEditing ? "Edit Transaction" : "Add New Transaction"}
                <IconButton
                    aria-label="close"
                    onClick={handleCloseDialog}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting: formikIsSubmitting }) => (
                        <Form>
                            <TransactionForm isSubmitting={isSubmitting || formikIsSubmitting} />
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionFormDialog;
