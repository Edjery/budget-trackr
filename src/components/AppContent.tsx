import { Box } from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { validationSchema, type FormValues, type Transaction } from '../types';
import { useTransactionForm } from '../hooks/useTransactionForm';
import { toLocalDateString } from '../utils/dateUtils';
import { SummaryCards } from './SummaryCards';
import TransactionForm from './TransactionForm';
import { TransactionList } from './TransactionList';

const AppContent = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { getInitialValues, createEmptyTransactionItem, resetFormValues } = useTransactionForm();
  const initialValues = getInitialValues();

  const processTransactionItems = (values: FormValues): Transaction[] => {
    const newTransactions: Transaction[] = [];
    
    const addTransaction = (dateStr: string, item: typeof values.items[0]) => {
      if (item.name && item.amount) {
        newTransactions.push({
          ...item,
          date: dateStr,
          month: values.month,
          year: values.year,
        });
      }
    };

    if (values.dayRangeType === 'single') {
      const dateStr = toLocalDateString(values.year, values.month, values.startDay);
      values.items.forEach(item => addTransaction(dateStr, item));
    } else {
      for (let day = values.startDay; day <= values.endDay; day++) {
        const dateStr = toLocalDateString(values.year, values.month, day);
        values.items.forEach(item => addTransaction(dateStr, item));
      }
    }

    return newTransactions;
  };

  const handleSubmit = async (
    values: FormValues, 
    { resetForm }: { resetForm: (values?: any) => void }
  ): Promise<void> => {
    // Ensure endDay matches startDay when dayRangeType is 'single'
    const formValues = {
      ...values,
      endDay: values.dayRangeType === 'single' ? values.startDay : values.endDay
    };

    const newTransactions = processTransactionItems(formValues);
    
    if (newTransactions.length > 0) {
      setTransactions(prev => [...prev, ...newTransactions]);
    }

    resetForm({
      ...resetFormValues(formValues),
      items: [createEmptyTransactionItem()]
    });
  };

  const calculateTotals = () => {
    return transactions.reduce(
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
  };

  const { earnings: totalEarnings, spendings: totalSpendings } = calculateTotals();

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
