import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import AppContent from "./components/AppContent";
import { AppHeader } from "./components/AppHeader";
import { useSettings } from "./hooks/useSettings";
import { createAppTheme } from "./theme";

function App() {
    const { settings, updateTheme } = useSettings();
    const darkMode = settings?.appearance?.theme === "dark";

    const theme = useMemo(() => createAppTheme(darkMode ? "dark" : "light"), [darkMode]);

    const toggleDarkMode = () => {
        const newTheme = darkMode ? "light" : "dark";
        updateTheme(newTheme);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                }}
            >
                <AppHeader onToggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <AppContent />
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default App;
