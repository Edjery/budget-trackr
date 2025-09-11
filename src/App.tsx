import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useMemo } from "react";
import AppContent from "./components/AppContent";
import { AppHeader } from "./components/AppHeader";
import { UserSettingsProvider, useUserSettings } from "./contexts/UserSettingsContext";

const AppContentWithTheme = () => {
    const { isDarkMode } = useUserSettings();

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: isDarkMode ? "dark" : "light",
                    primary: {
                        main: "#1976d2",
                    },
                    secondary: {
                        main: "#9c27b0",
                    },
                },
            }),
        [isDarkMode]
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ flexGrow: 1 }}>
                <AppHeader />
                <AppContent />
            </Box>
        </ThemeProvider>
    );
};

function App() {
    return (
        <UserSettingsProvider>
            <AppContentWithTheme />
        </UserSettingsProvider>
    );
}

export default App;
