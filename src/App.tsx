import { useState } from 'react';
import { AccountBalanceWallet } from '@mui/icons-material';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { SummaryCards } from './components/SummaryCards';
import type { FormValues } from './types';
import type { Transaction as TransactionType } from './types';

interface TransactionItem {
  id: string;
  type: 'earnings' | 'spendings';
  name: string;
  amount: string;
}

type AppFormValues = Omit<FormValues, 'items'> & {
  items: TransactionItem[];
};

// Validation Schema
const validationSchema = Yup.object<FormValues>().shape({
  year: Yup.number().required('Year is required'),
  month: Yup.number().required('Month is required'),
  dayRangeType: Yup.string().oneOf(['single', 'multiple']).required('Day range type is required'),
  startDay: Yup.number().min(1, 'Must be at least 1').max(31, 'Must be at most 31').required('Start day is required'),
  endDay: Yup.number()
    .min(Yup.ref('startDay'), 'End day must be after or equal to start day')
    .max(31, 'Must be at most 31')
    .when('dayRangeType', {
      is: 'multiple',
      then: (schema) => schema.required('End day is required for multiple days'),
    }),
  items: Yup.array()
    .of(
      Yup.object().shape({
        type: Yup.string().oneOf(['earnings', 'spendings']).required('Type is required'),
        name: Yup.string().required('Name is required'),
        amount: Yup.number()
          .typeError('Amount must be a number')
          .positive('Amount must be positive')
          .required('Amount is required'),
      })
    )
    .min(1, 'At least one transaction item is required'),
});

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const currentDay = new Date().getDate();

const initialValues: FormValues = {
  year: currentYear,
  month: currentMonth,
  dayRangeType: 'single',
  startDay: currentDay,
  endDay: currentDay,
  items: [
    {
      id: Date.now().toString(),
      type: 'spendings',
      name: '',
      amount: '',
    },
  ],
};

interface AppTransaction extends TransactionType {
  date: string;
  month: number;
  year: number;
}

function App() {
  const [transactions, setTransactions] = useState<AppTransaction[]>([]);

  const handleSubmit = (values: AppFormValues, { resetForm }: { resetForm: (values?: any) => void }): void => {
    const newTransactions: AppTransaction[] = [];
    const month = values.month - 1; // JavaScript months are 0-indexed

    const toLocalDateString = (year: number, month: number, day: number): string => {
      const date = new Date(year, month, day);
      const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      return localDate.toISOString().split('T')[0];
    };

    if (values.dayRangeType === 'single') {
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
      setTransactions((prev: AppTransaction[]) => [...prev, ...newTransactions]);
    }

    // Reset form after successful submission
    resetForm({
      year: values.year,
      month: values.month,
      dayRangeType: 'single',
      startDay: values.startDay,
      endDay: values.endDay,
      items: [
        {
          id: Date.now().toString(),
          type: 'spendings' as const,
          name: '',
          amount: '',
        },
      ],
    });
  };

  // Calculate totals with proper type safety
  const totalEarnings = transactions
    .filter((t: AppTransaction) => t.type === 'earnings')
    .reduce((sum: number, t: AppTransaction) => sum + parseFloat(t.amount || '0'), 0);

  const totalSpendings = transactions
    .filter((t: AppTransaction) => t.type === 'spendings')
    .reduce((sum: number, t: AppTransaction) => sum + parseFloat(t.amount || '0'), 0);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <AccountBalanceWallet sx={{ mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              Budgeting Budgeteer
            </Typography>
            <Typography variant="caption" component="div" sx={{ lineHeight: 1, opacity: 0.8 }}>
              Track and estimate monthly earnings and spendings for your budget needs
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <Box sx={{ p: 3 }}>
              {/* Summary Cards */}
              <SummaryCards totalEarnings={totalEarnings} totalSpendings={totalSpendings} />

              {/* Transaction Form */}
              <TransactionForm />

              {/* Transaction List */}
              <TransactionList transactions={transactions} />
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}

export default App;
