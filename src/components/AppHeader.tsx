import { AccountBalanceWallet } from '@mui/icons-material';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import React from 'react';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'Budgeting Budgeteer',
  subtitle = 'Track and estimate monthly earnings and spendings for your budget needs',
}) => {
  return (
    <AppBar position="static" sx={{ 
      backgroundColor: '#1976d2',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <Toolbar>
        <AccountBalanceWallet sx={{ 
          mr: 2,
          fontSize: '2rem',
          color: 'white',
        }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography 
            variant="h6" 
            component="h1"
            sx={{
              fontWeight: 600,
              letterSpacing: '0.5px',
              mb: 0.5
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="caption" 
            component="p" 
            sx={{ 
              display: 'block',
              lineHeight: 1.2, 
              opacity: 0.9,
              maxWidth: '600px',
              fontSize: '0.8rem',
              '@media (min-width: 600px)': {
                fontSize: '0.875rem',
              }
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
