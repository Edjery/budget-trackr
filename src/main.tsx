import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/i18n";
import App from "./App.tsx";
import { useAppTranslation } from "./hooks/useTranslation";
import { Box, CircularProgress } from "@mui/material";

// Create a client
const queryClient = new QueryClient();

// Initialize i18n
i18n.init();

// Create a wrapper component to handle language initialization
const AppWithTranslation = () => {
    const { isInitialized } = useAppTranslation();

    if (!isInitialized) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    width: "100%",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return <App />;
};

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <I18nextProvider i18n={i18n}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <QueryClientProvider client={queryClient}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <AppWithTranslation />
                    </Suspense>
                </QueryClientProvider>
            </LocalizationProvider>
        </I18nextProvider>
    </StrictMode>
);
