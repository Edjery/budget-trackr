import * as Yup from 'yup';

export interface TransactionItem {
  id: string;
  type: 'earnings' | 'spendings';
  name: string;
  amount: string;
}

export interface Transaction extends TransactionItem {
  date: string;
  month: number;
  year: number;
}

export interface FormValues {
  year: number;
  month: number;
  dayRangeType: 'single' | 'multiple';
  startDay: number;
  endDay: number;
  items: TransactionItem[];
}

export interface SummaryCardsProps {
  totalEarnings: number;
  totalSpendings: number;
}

export interface TransactionFormProps {
  onSubmit: (values: FormValues, formikHelpers: any) => void;
  initialValues: FormValues;
}

export interface TransactionListProps {
  transactions: Transaction[];
}

export const validationSchema = Yup.object().shape({
  year: Yup.number().required('Year is required'),
  month: Yup.number().required('Month is required'),
  dayRangeType: Yup.string()
    .oneOf(['single', 'multiple'])
    .required('Day range type is required'),
  startDay: Yup.number()
    .min(1, 'Must be at least 1')
    .max(31, 'Must be at most 31')
    .required('Start day is required'),
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
        type: Yup.string()
          .oneOf(['earnings', 'spendings'])
          .required('Type is required'),
        name: Yup.string().required('Name is required'),
        amount: Yup.number()
          .typeError('Amount must be a number')
          .positive('Amount must be positive')
          .required('Amount is required'),
      })
    )
    .min(1, 'At least one transaction item is required'),
});
