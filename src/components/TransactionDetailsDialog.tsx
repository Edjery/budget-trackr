import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import type { Transaction } from '../types';

interface TransactionDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onEdit: (transaction: Transaction) => void;
  onAddTransaction?: () => void;
  transactions: Transaction[];
}

export const TransactionDetailsDialog = ({
  open,
  onClose,
  transaction: selectedTransaction,
  onEdit,
  onAddTransaction,
  transactions,
}: TransactionDetailsDialogProps) => {
  if (!selectedTransaction) return null;

  // Group transactions by date
  const groupedTransactions = transactions.reduce((acc: Record<string, Transaction[]>, t) => {
    if (!acc[t.date]) {
      acc[t.date] = [];
    }
    acc[t.date].push(t);
    return acc;
  }, {});

  const selectedDateTransactions = selectedTransaction?.date ? groupedTransactions[selectedTransaction.date] || [] : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Transaction Details
          <Button onClick={onClose} color="inherit">
            ✕
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box mb={3}>
          <Typography variant="h6" color="textPrimary" gutterBottom>
            {new Date(selectedTransaction.date).toLocaleDateString('en-PH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDateTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell 
                      align="right"
                      sx={{ color: transaction.type === 'earnings' ? 'success.main' : 'error.main' }}
                    >
                      {transaction.type === 'earnings' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{transaction.type}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(transaction);
                        }}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box mt={2}>
          <Typography variant="subtitle2" color="textSecondary">
            Total for this day: ${selectedDateTransactions.reduce((sum, t) => {
              const amount = parseFloat(t.amount) || 0;
              return t.type === 'earnings' ? sum + amount : sum - amount;
            }, 0).toFixed(2)}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        {onAddTransaction && (
          <Button 
            onClick={onAddTransaction} 
            color="primary"
            variant="outlined"
            startIcon={<AddIcon />}
          >
            Add Transaction
          </Button>
        )}
        <Box>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Close
          </Button>
          {selectedTransaction && (
            <Button
              onClick={() => onEdit(selectedTransaction)}
              color="primary"
              startIcon={<EditIcon />}
              variant="contained"
            >
              Edit
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDetailsDialog;
