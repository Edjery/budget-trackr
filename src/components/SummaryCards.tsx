import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { AttachMoney, MoneyOff, AccountBalance } from '@mui/icons-material';
import type { SummaryCardsProps } from '../types';

export const SummaryCards = ({ totalEarnings, totalSpendings, balance }: SummaryCardsProps) => (
  <Grid container spacing={3} sx={{ mb: 4 }}>
    {/* Balance Card */}
    <Grid size={{xs: 12, sm: 4}} sx={{ '& > *': { width: '100%' } }}>
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <AccountBalance color={balance >= 0 ? 'success' : 'error'} sx={{ mr: 1 }} />
            <Typography variant="h6" color="textSecondary">
              Balance
            </Typography>
          </Box>
          <Typography 
            variant="h4" 
            color={balance >= 0 ? 'success.main' : 'error.main'}
          >
            ${Math.abs(balance).toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    {/* Earnings Card */}
    <Grid size={{xs: 12, sm: 4}} sx={{ '& > *': { width: '100%' } }}>
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <AttachMoney color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" color="textSecondary">
              Total Earnings
            </Typography>
          </Box>
          <Typography variant="h4" color="primary">
            ${totalEarnings.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    {/* Spendings Card */}
    <Grid size={{xs: 12, sm: 4}} sx={{ '& > *': { width: '100%' } }}>
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <MoneyOff color="error" sx={{ mr: 1 }} />
            <Typography variant="h6" color="textSecondary">
              Total Spendings
            </Typography>
          </Box>
          <Typography variant="h4" color="error.main">
            ${totalSpendings.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);
