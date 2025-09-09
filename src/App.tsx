import { Box } from "@mui/material";
import { AppHeader } from "./components/AppHeader";
import AppContent from "./components/AppContent";

function App() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppHeader />
            <AppContent />
        </Box>
    );
}

export default App;
