import { Box } from "@mui/material";
import AppContent from "./components/AppContent";
import { AppHeader } from "./components/AppHeader";

function App() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppHeader />
            <AppContent />
        </Box>
    );
}

export default App;
