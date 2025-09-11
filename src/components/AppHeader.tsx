import { AccountBalanceWallet, Settings, Brightness4, Brightness7 } from "@mui/icons-material";
import { AppBar, Box, Toolbar, Typography, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { SettingsDialog } from "./settings/SettingsDialog";

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
    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "#1976d2",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
        >
            <Toolbar>
                <AccountBalanceWallet
                    sx={{
                        mr: 2,
                        fontSize: "2rem",
                        color: "white",
                    }}
                />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography
                        variant="h6"
                        component="h1"
                        sx={{
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                            mb: 0.5,
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="caption"
                        component="p"
                        sx={{
                            display: "block",
                            lineHeight: 1.2,
                            opacity: 0.9,
                            maxWidth: "600px",
                            fontSize: "0.8rem",
                            mr: 2,
                            "@media (min-width: 600px)": {
                                fontSize: "0.875rem",
                            },
                        }}
                    >
                        {subtitle}
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Tooltip title={`Toggle ${darkMode ? "Light" : "Dark"} Mode`}>
                    <IconButton color="inherit" onClick={onToggleDarkMode} aria-label="toggle dark mode">
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                </Tooltip>
                <Tooltip title="Settings">
                    <IconButton color="inherit" onClick={() => setSettingsOpen(true)} aria-label="settings">
                        <Settings />
                    </IconButton>
                </Tooltip>
            </Toolbar>
            <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </AppBar>
    );
};

export default AppHeader;
