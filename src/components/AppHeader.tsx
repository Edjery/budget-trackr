import { AccountBalanceWallet, Settings, Brightness4, Brightness7 } from "@mui/icons-material";
import { AppBar, Box, Toolbar, Typography, IconButton, Tooltip, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { SettingsDialog } from "./settings/SettingsDialog";
import type { AppTheme } from "../theme";

// Default props as constants
export const DEFAULT_HEADER_TITLE = "Budgeting Budgeteer";
export const DEFAULT_HEADER_SUBTITLE = "app.subtitle";

interface AppHeaderProps {
    title?: string;
    subtitle?: string;
    darkMode: boolean;
    onToggleDarkMode: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    title = DEFAULT_HEADER_TITLE,
    subtitle = DEFAULT_HEADER_SUBTITLE,
    darkMode,
    onToggleDarkMode,
}) => {
    const { t } = useTranslation();
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
                        noWrap
                        component="div"
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
                        noWrap
                        component="div"
                        sx={{
                            color: "primary.contrastText",
                            opacity: 0.8,
                            fontSize: "0.75rem",
                            lineHeight: 1.2,
                            display: { xs: "none", sm: "block" },
                        }}
                    >
                        {t(subtitle)}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tooltip title={darkMode ? t("settings.appearance.light") : t("settings.appearance.dark")}>
                        <IconButton
                            color="inherit"
                            onClick={onToggleDarkMode}
                            aria-label={
                                darkMode
                                    ? t("settings.appearance.switchToLight")
                                    : t("settings.appearance.switchToDark")
                            }
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
