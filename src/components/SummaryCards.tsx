import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { AccountBalance, AttachMoney, MoneyOff } from '@mui/icons-material';
import type { SummaryCardsProps } from '../types';

export const SummaryCards = ({ totalEarnings, totalSpendings }: SummaryCardsProps) => (
  <Grid container spacing={3} sx={{ mb: 4 }}>
    <Grid size={{xs: 12, sm: 4}} sx={{ '& > *': { width: '100%' } }}>
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <AttachMoney color="success" sx={{ mr: 1 }} />
            <Typography color="text.secondary">Income</Typography>
          </Box>
          <Typography variant="h5" color="success.main">
            ${totalEarnings.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    <Grid size={{xs: 12, sm: 4}} sx={{ '& > *': { width: '100%' } }}>
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <MoneyOff color="error" sx={{ mr: 1 }} />
            <Typography color="text.secondary">Expenses</Typography>
          </Box>
          <Typography variant="h5" color="error.main">
            ${totalSpendings.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    <Grid size={{xs: 12, sm: 4}} sx={{ '& > *': { width: '100%' } }}>
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <AccountBalance color="primary" sx={{ mr: 1 }} />
            <Typography color="text.secondary">Balance</Typography>
          </Box>
          <Typography 
            variant="h5" 
            color={totalEarnings - totalSpendings >= 0 ? 'success.main' : 'error.main'}
          >
            ${(totalEarnings - totalSpendings).toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);
