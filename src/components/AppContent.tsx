import { Box } from '@mui/material';
import { Form, Formik } from 'formik';
import { useTransactionForm } from '../hooks/useTransactionForm';
import { useTransactionSubmission } from '../hooks/useTransactionSubmission';
import { useTransactionCalculations } from '../hooks/useTransactionCalculations';
import { validationSchema, type FormValues } from '../types';
import { SummaryCards } from './SummaryCards';
import TransactionForm from './TransactionForm';
import { TransactionList } from './TransactionList';

const AppContent = () => {
  const { getInitialValues, createEmptyTransactionItem, resetFormValues } = useTransactionForm();
  const { transactions, submitTransaction, isSubmitting } = useTransactionSubmission();
  const { totalEarnings, totalSpendings, balance } = useTransactionCalculations(transactions);
  const initialValues = getInitialValues();

  const handleSubmit = async (
    values: FormValues, 
    { resetForm }: { resetForm: (values?: any) => void }
  ): Promise<void> => {
    await submitTransaction(values, () => {
      resetForm({
        ...resetFormValues(values),
        items: [createEmptyTransactionItem()]
      });
    });
  };


    return (
        <Formik 
        initialValues={initialValues} 
        validationSchema={validationSchema} 
        onSubmit={handleSubmit}
      >
        {({ isSubmitting: formikIsSubmitting }) => (
                <Form>
                    <Box sx={{ p: 3 }}>
                        <SummaryCards 
                          totalEarnings={totalEarnings} 
                          totalSpendings={totalSpendings} 
                          balance={balance} 
                        />
                        <TransactionForm isSubmitting={isSubmitting || formikIsSubmitting} />
                        <TransactionList transactions={transactions} />
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default AppContent;
