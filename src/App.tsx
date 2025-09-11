import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useMemo, useEffect, useState } from "react";
import AppContent from "./components/AppContent";
import { AppHeader } from "./components/AppHeader";
import { useSettings } from "./hooks/useSettings";

function App() {
    const { settings, updateTheme } = useSettings();
    const [darkMode, setDarkMode] = useState(settings?.appearance?.theme === "dark");

    // Update dark mode when settings change
    useEffect(() => {
        if (settings?.appearance?.theme) {
            setDarkMode(settings.appearance.theme === "dark");
        }
    }, [settings?.appearance?.theme]);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? "dark" : "light",
                    primary: {
                        main: "#1976d2",
                    },
                    secondary: {
                        main: "#9c27b0",
                    },
                },
            }),
        [darkMode]
    );

    const toggleDarkMode = () => {
        const newTheme = darkMode ? "light" : "dark";
        updateTheme(newTheme);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ flexGrow: 1 }}>
                <AppHeader onToggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                <AppContent />
            </Box>
        </ThemeProvider>
    );
}

export default App;
