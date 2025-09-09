import { Box } from '@mui/material';
import { Form, Formik } from 'formik';
import { useTransactionForm } from '../hooks/useTransactionForm';
import { useTransactionSubmission } from '../hooks/useTransactionSubmission';
import { validationSchema, type FormValues } from '../types';
import { SummaryCards } from './SummaryCards';
import TransactionForm from './TransactionForm';
import { TransactionList } from './TransactionList';

const AppContent = () => {
  const { getInitialValues, createEmptyTransactionItem, resetFormValues } = useTransactionForm();
  const { transactions, submitTransaction, isSubmitting } = useTransactionSubmission();
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

  const { earnings: totalEarnings, spendings: totalSpendings } = transactions.reduce(
    (acc, t) => {
      const amount = parseFloat(t.amount || '0');
      if (t.type === 'earnings') {
        acc.earnings += amount;
      } else {
        acc.spendings += amount;
      }
      return acc;
    },
    { earnings: 0, spendings: 0 }
  );

    return (
        <Formik 
        initialValues={initialValues} 
        validationSchema={validationSchema} 
        onSubmit={handleSubmit}
      >
        {({ isSubmitting: formikIsSubmitting }) => (
                <Form>
                    <Box sx={{ p: 3 }}>
                        <SummaryCards totalEarnings={totalEarnings} totalSpendings={totalSpendings} />
                        <TransactionForm isSubmitting={isSubmitting || formikIsSubmitting} />
                        <TransactionList transactions={transactions} />
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default AppContent;
