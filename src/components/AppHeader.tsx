import { AccountBalanceWallet, Settings, Brightness4, Brightness7 } from "@mui/icons-material";
import { AppBar, Box, Toolbar, Typography, IconButton, Tooltip, useTheme } from "@mui/material";
import React, { useState } from "react";
import { SettingsDialog } from "./settings/SettingsDialog";
import type { AppTheme } from "../theme";

interface AppHeaderProps {
    title?: string;
    subtitle?: string;
    darkMode: boolean;
    onToggleDarkMode: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    title = "Budgeting Budgeteer",
    subtitle = "Track and estimate monthly earnings and spendings for your budget needs",
    darkMode,
    onToggleDarkMode,
}) => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const theme = useTheme() as AppTheme;

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: theme.zIndex.drawer + 1,
                backgroundColor: "custom.header.background",
                boxShadow: 1,
                height: theme.custom.header.height,
                justifyContent: "center",
            }}
        >
            <Toolbar>
                <AccountBalanceWallet
                    sx={{
                        mr: 2,
                        fontSize: "2rem",
                        color: "primary.contrastText",
                    }}
                />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography
                        variant="h6"
                        component="h1"
                        sx={{
                            fontWeight: 600,
                            letterSpacing: 0.5,
                            mb: 0.5,
                            color: "primary.contrastText",
                        }}
                        data-testid="app-title"
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="caption"
                        component="p"
                        sx={{
                            color: "primary.contrastText",
                            opacity: 0.8,
                            fontSize: "0.75rem",
                            lineHeight: 1.2,
                            display: { xs: "none", sm: "block" },
                        }}
                    >
                        {subtitle}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tooltip title={darkMode ? "Light mode" : "Dark mode"}>
                        <IconButton
                            color="inherit"
                            onClick={onToggleDarkMode}
                            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                            size="large"
                        >
                            {darkMode ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Settings">
                        <IconButton
                            color="inherit"
                            onClick={() => setSettingsOpen(true)}
                            aria-label="Open settings"
                            size="large"
                        >
                            <Settings />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
            <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </AppBar>
    );
};

export default AppHeader;
