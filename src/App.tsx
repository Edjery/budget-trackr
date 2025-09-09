import { useState } from 'react';
import { AccountBalance, AccountBalanceWallet, Add as AddIcon, AttachMoney, MoneyOff } from '@mui/icons-material';
import { AppBar, Box, Button, Card, CardContent, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Toolbar, Typography } from '@mui/material';
import { Field, FieldArray, Form, Formik, type FormikHelpers } from 'formik';
import * as Yup from 'yup';

interface TransactionItem {
  id: string;
  type: 'earnings' | 'spendings';
  name: string;
  amount: string;
}

interface FormValues {
  year: number;
  month: number;
  dayRangeType: 'single' | 'multiple';
  startDay: number;
  endDay: number;
  items: TransactionItem[];
}

// Validation Schema
const validationSchema = Yup.object().shape({
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
const initialValues: FormValues = {
  year: currentYear,
  month: new Date().getMonth() + 1,
  dayRangeType: 'single',
  startDay: new Date().getDate(),
  endDay: new Date().getDate(),
  items: [
    {
      id: Date.now().toString(),
      type: 'spendings',
      name: '',
      amount: '',
    },
  ],
};

interface Transaction extends TransactionItem {
  date: string;
  month: number;
  year: number;
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleSubmit = (values: FormValues, { resetForm }: FormikHelpers<FormValues>): void => {
    const newTransactions: Transaction[] = [];
    const month = values.month - 1; // JavaScript months are 0-indexed

    // Helper function to create a date string in local timezone
    const toLocalDateString = (year: number, month: number, day: number): string => {
      const date = new Date(year, month, day);
      // Use toISOString and then take the date part to ensure consistent formatting
      const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      return localDate.toISOString().split('T')[0];
    };

    if (values.dayRangeType === 'single') {
      const dateStr = toLocalDateString(values.year, month, values.startDay);
      values.items.forEach((item) => {
        newTransactions.push({
          ...item,
          date: dateStr,
          month: values.month,
          year: values.year,
        });
      });
    } else {
      for (let day = values.startDay; day <= values.endDay; day++) {
        const dateStr = toLocalDateString(values.year, month, day);
        values.items.forEach((item) => {
          newTransactions.push({
            ...item,
            date: dateStr,
            month: values.month,
            year: values.year,
          });
        });
      }
    }
    setTransactions((prev: Transaction[]) => [...prev, ...newTransactions]);

    // Reset form after successful submission
    resetForm({
      values: {
        ...initialValues,
        items: [
          {
            id: Date.now().toString(),
            type: 'spendings',
            name: '',
            amount: '',
          },
        ],
      },
    });
  };

  // Calculate totals with proper type safety
  const totalEarnings = transactions
    .filter((t: Transaction) => t.type === 'earnings')
    .reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount || '0'), 0);

  const totalSpendings = transactions
    .filter((t: Transaction) => t.type === 'spendings')
    .reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount || '0'), 0);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <AccountBalanceWallet sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Budget Trackr
          </Typography>
        </Toolbar>
      </AppBar>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
          <Form>
            <Box sx={{ p: 3 }}>
              {/* Summary Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Income Card */}
                <Grid size={{ xs: 12, sm: 4 }} sx={{ '& > *': { width: '100%' } }}>
                  <Card elevation={3}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <AttachMoney color="success" sx={{ mr: 1 }} />
                        <Typography color="text.secondary">Income</Typography>
                      </Box>
                      <Typography variant="h5" color="success.main">
                        ${totalEarnings.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {transactions.length ? 'This month' : 'No transactions yet'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Expenses Card */}
                <Grid size={{ xs: 12, sm: 4 }} sx={{ '& > *': { width: '100%' } }}>
                  <Card elevation={3}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <MoneyOff color="error" sx={{ mr: 1 }} />
                        <Typography color="text.secondary">Expenses</Typography>
                      </Box>
                      <Typography variant="h5" color="error.main">
                        ${totalSpendings.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {transactions.length ? 'This month' : 'No transactions yet'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Balance Card */}
                <Grid size={{ xs: 12, sm: 4 }} sx={{ '& > *': { width: '100%' } }}>
                  <Card elevation={3}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <AccountBalance color="primary" sx={{ mr: 1 }} />
                        <Typography color="text.secondary">Balance</Typography>
                      </Box>
                      <Typography variant="h5" color="primary.main">
                        ${(totalEarnings - totalSpendings).toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Available to spend
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Transaction Form */}
              <Card elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>Add Transaction</Typography>

                <FieldArray name="items">
                  {({ push, remove }) => (
                    <>
                      {/* Year Selection */}
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 2 }}>
                          <FormControl fullWidth size="small" error={touched.year && Boolean(errors.year)}>
                            <InputLabel>Year</InputLabel>
                            <Field
                              as={Select}
                              name="year"
                              label="Year"
                              value={values.year}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((year) => (
                                <MenuItem key={year} value={year}>
                                  {year}
                                </MenuItem>
                              ))}
                            </Field>
                            <FormHelperText>{touched.year && errors.year}</FormHelperText>
                          </FormControl>
                        </Grid>

                        {/* Month Selection */}
                        <Grid size={{ xs: 12, md: 3 }}>
                          <FormControl fullWidth size="small" error={touched.month && Boolean(errors.month)}>
                            <InputLabel>Month</InputLabel>
                            <Field
                              as={Select}
                              name="month"
                              label="Month"
                              value={values.month}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                <MenuItem key={month} value={month}>
                                  {new Date(values.year, month - 1).toLocaleString('default', { month: 'long' })}
                                </MenuItem>
                              ))}
                            </Field>
                            <FormHelperText>{touched.month && errors.month}</FormHelperText>
                          </FormControl>
                        </Grid>
                        
                        {/* Single/Multiple Day Toggle */}
                        <Grid size={{xs: 12, md: 8}} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography component="span" sx={{ mr: 2 }}>Day Range:</Typography>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button 
                              type="button"
                              variant={values.dayRangeType === 'single' ? 'contained' : 'outlined'}
                              size="small"
                              onClick={(): void => { void setFieldValue('dayRangeType', 'single'); }}
                            >
                              Single Day
                            </Button>
                            <Button 
                              type="button"
                              variant={values.dayRangeType === 'multiple' ? 'contained' : 'outlined'}
                              size="small"
                              onClick={(): void => { void setFieldValue('dayRangeType', 'multiple'); }}
                            >
                              Multiple Days
                            </Button>
                          </Box>
                        </Grid>
                        
                        {/* Day Selection */}
                        <Grid size={{xs: 12}} sx={{ mt: 2 }}>
                          <Grid container spacing={2}>
                            {values.dayRangeType === 'single' ? (
                              <Grid size={{xs: 12, sm: 4, md: 3}}>
                                <FormControl fullWidth size="small" error={touched.startDay && Boolean(errors.startDay)}>
                                  <InputLabel>Select Day</InputLabel>
                                  <Field
                                    as={Select}
                                    name="startDay"
                                    label="Select Day"
                                    value={values.startDay}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  >
                                    {Array.from({length: 31}, (_, i) => i + 1).map((day) => (
                                      <MenuItem key={day} value={day}>{day}</MenuItem>
                                    ))}
                                  </Field>
                                  <FormHelperText>{touched.startDay && errors.startDay}</FormHelperText>
                                </FormControl>
                              </Grid>
                            ) : (
                              <>
                                <Grid size={{xs: 12, sm: 6, md: 3}}>
                                  <FormControl fullWidth size="small" error={touched.startDay && Boolean(errors.startDay)}>
                                    <InputLabel>Start Day</InputLabel>
                                    <Field
                                      as={Select}
                                      name="startDay"
                                      label="Start Day"
                                      value={values.startDay}
                                      onChange={(e: React.ChangeEvent<{ value: unknown }>): void => {
                                        const newStartDay = Number(e.target.value);
                                        setFieldValue('startDay', newStartDay);
                                        if (newStartDay > values.endDay) {
                                          setFieldValue('endDay', newStartDay);
                                        }
                                      }}
                                      onBlur={handleBlur}
                                    >
                                      {Array.from({length: 31}, (_, i) => i + 1).map((day) => (
                                        <MenuItem key={`start-${day}`} value={day}>{day}</MenuItem>
                                      ))}
                                    </Field>
                                    <FormHelperText>{touched.startDay && errors.startDay}</FormHelperText>
                                  </FormControl>
                                </Grid>
                                <Grid size={{xs: 12, sm: 6, md: 3}}>
                                  <FormControl fullWidth size="small" error={touched.endDay && Boolean(errors.endDay)}>
                                    <InputLabel>End Day</InputLabel>
                                    <Field
                                      as={Select}
                                      name="endDay"
                                      label="End Day"
                                      value={values.endDay}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    >
                                      {Array.from({length: 31}, (_, i) => i + 1)
                                        .filter(day => day >= values.startDay)
                                        .map((day) => (
                                          <MenuItem key={`end-${day}`} value={day}>{day}</MenuItem>
                                        ))}
                                    </Field>
                                    <FormHelperText>{touched.endDay && errors.endDay}</FormHelperText>
                                  </FormControl>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                      
                      {/* Transaction Items */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>Transaction Items</Typography>
                        
                        {values.items.map((item, index) => (
                          <Grid container spacing={2} key={item.id} sx={{ mb: 2, alignItems: 'center' }}>
                            <Grid size={{xs: 12, sm: 4, md: 3}}>
                              <FormControl 
                                fullWidth 
                                size="small" 
                                error={Boolean(
                                  errors.items?.[index] && 
                                  touched.items?.[index] &&
                                  (errors.items[index] as { type?: string })?.type &&
                                  touched.items[index]?.type
                                )}
                              >
                                <InputLabel>Type</InputLabel>
                                <Field
                                  as={Select}
                                  name={`items.${index}.type`}
                                  label="Type"
                                  value={item.type}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                >
                                  <MenuItem value="earnings">Earnings</MenuItem>
                                  <MenuItem value="spendings">Spendings</MenuItem>
                                </Field>
                                <FormHelperText>
                                  {touched.items?.[index]?.type && 
                                  (errors.items?.[index] as { type?: string })?.type}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                            <Grid size={{xs: 12, sm: 4, md: 4}}>
                              <TextField
                                fullWidth
                                name={`items.${index}.name`}
                                label="Item Name"
                                variant="outlined"
                                size="small"
                                value={item.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  Boolean(
                                    errors.items?.[index] && 
                                    touched.items?.[index] &&
                                    (errors.items[index] as { name?: string })?.name &&
                                    touched.items[index]?.name
                                  )
                                }
                                helperText={
                                  touched.items?.[index]?.name && 
                                  (errors.items?.[index] as { name?: string })?.name
                                }
                              />
                            </Grid>
                            <Grid size={{xs: 12, sm: 3, md: 3}}>
                              <TextField
                                fullWidth
                                name={`items.${index}.amount`}
                                label="Amount"
                                type="number"
                                variant="outlined"
                                size="small"
                                InputProps={{
                                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                                }}
                                value={item.amount}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  Boolean(
                                    errors.items?.[index] && 
                                    touched.items?.[index] &&
                                    (errors.items[index] as { amount?: string })?.amount &&
                                    touched.items[index]?.amount
                                  )
                                }
                                helperText={
                                  touched.items?.[index]?.amount && 
                                  (errors.items?.[index] as { amount?: string })?.amount
                                }
                              />
                            </Grid>
                            <Grid size={{xs: 12, sm: 1, md: 2}} sx={{ textAlign: 'right' }}>
                              <Button 
                                type="button"
                                variant="outlined" 
                                color="error" 
                                size="small"
                                onClick={(): void => { remove(index); }}
                                disabled={values.items.length === 1}
                              >
                                Remove
                              </Button>
                            </Grid>
                          </Grid>
                        ))}
                        
                        <Button 
                          type="button"
                          variant="outlined" 
                          color="primary" 
                          size="small"
                          onClick={(): void => push({ id: Date.now().toString(), type: 'earnings' as const, name: '', amount: '' })}
                          startIcon={<AddIcon />}
                          sx={{ mt: 1 }}
                        >
                          Add Item
                        </Button>
                        {typeof errors.items === 'string' && (
                          <Typography color="error" variant="caption" display="block" gutterBottom>
                            {errors.items}
                          </Typography>
                        )}
                      </Box>
                      
                      <Button 
                        type="submit"
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        size="large"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Transactions'}
                      </Button>
                    </>
                  )}
                </FieldArray>
              </Card>

              {/* Transaction List */}
              <Card elevation={3} sx={{ mt: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
                  
                  {transactions.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center" py={4}>
                      No transactions yet. Add one above!
                    </Typography>
                  ) : (
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: '16px',
                      width: '100%'
                    }}>
                      {Object.entries(
                        transactions.reduce((acc: Record<string, Transaction[]>, transaction) => {
                          // Use the stored date string directly to avoid timezone issues
                          const dateStr = transaction.date;
                          if (!acc[dateStr]) {
                            acc[dateStr] = [];
                          }
                          acc[dateStr].push(transaction);
                          return acc;
                        }, {})
                      )
                      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                      .map(([date, dateTransactions]) => (
                          <div key={date}>
                            <Card 
                              variant="outlined" 
                              sx={{ 
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="subtitle1" fontWeight="medium">
                                    {new Date(date).toLocaleDateString('en-US', { 
                                      weekday: 'long',
                                      month: 'long', 
                                      day: 'numeric',
                                      year: 'numeric' 
                                    })}
                                  </Typography>
                                  <Box sx={{ mt: 1, mb: 2, borderBottom: '1px solid', borderColor: 'divider' }} />
                                </Box>
                                
                                {dateTransactions.map((transaction) => (
                                  <Box 
                                    key={transaction.id}
                                    sx={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      mb: 1.5,
                                      p: 1,
                                      borderRadius: 1,
                                      bgcolor: 'action.hover',
                                      '&:last-child': { mb: 0 }
                                    }}
                                  >
                                    <Typography variant="body2">
                                      {transaction.name}
                                    </Typography>
                                    <Typography 
                                      variant="body2" 
                                      color={transaction.type === 'earnings' ? 'success.main' : 'error.main'}
                                      fontWeight="medium"
                                    >
                                      {transaction.type === 'earnings' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                                    </Typography>
                                  </Box>
                                ))}
                                
                                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                      Daily Total:
                                    </Typography>
                                    <Typography 
                                      variant="subtitle1"
                                      fontWeight="bold"
                                      color={dateTransactions.reduce((sum, t) => sum + (t.type === 'earnings' ? parseFloat(t.amount) : -parseFloat(t.amount)), 0) >= 0 ? 'success.main' : 'error.main'}
                                    >
                                      {dateTransactions.reduce((sum, t) => sum + (t.type === 'earnings' ? parseFloat(t.amount) : -parseFloat(t.amount)), 0) >= 0 ? '+' : ''}
                                      ${Math.abs(dateTransactions.reduce((sum, t) => sum + (t.type === 'earnings' ? parseFloat(t.amount) : -parseFloat(t.amount)), 0)).toFixed(2)}
                                    </Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}

export default App;
