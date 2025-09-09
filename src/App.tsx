import { AppBar, Toolbar, Typography, Box } from '@mui/material';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          {/* <AccountBalanceWalletIcon sx={{ mr: 2 }} /> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Budget Trackr
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        {/* Main content will go here */}
      </Box>
    </Box>
  );
}

export default App;
