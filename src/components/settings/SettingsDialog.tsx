import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { CURRENCIES } from "../../utils/currencyUtils";
import { useAppSettings } from "../../hooks/useAppSettings";
import { useUserSettings } from "../../contexts/UserSettingsContext";
import type { ThemeMode } from "../../types/userSettings";

interface SettingsDialogProps {
    open: boolean;
    onClose: () => void;
}

export const SettingsDialog = ({ open, onClose }: SettingsDialogProps) => {
    const { theme, currency, language, updateCurrency, updateLanguage } = useAppSettings();

    const handleCurrencyChange = (event: SelectChangeEvent) => {
        updateCurrency(event.target.value);
    };

    const handleLanguageChange = (event: SelectChangeEvent) => {
        updateLanguage(event.target.value);
    };

    const { updateSettings } = useUserSettings();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Settings</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
                    {/* Theme Settings */}
                    <Box>
                        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                            <InputLabel id="theme-select-label">Theme</InputLabel>
                            <Select
                                labelId="theme-select-label"
                                id="theme-select"
                                value={theme}
                                label="Theme"
                                onChange={(e) =>
                                    updateSettings({
                                        appearance: { theme: e.target.value as ThemeMode },
                                    })
                                }
                            >
                                <MenuItem value="system">System Default</MenuItem>
                                <MenuItem value="light">Light</MenuItem>
                                <MenuItem value="dark">Dark</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Currency Settings */}
                    <Box>
                        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                            <InputLabel id="currency-select-label">Currency</InputLabel>
                            <Select
                                labelId="currency-select-label"
                                id="currency-select"
                                value={currency}
                                label="Currency"
                                onChange={handleCurrencyChange}
                            >
                                {Object.values(CURRENCIES).map((curr) => (
                                    <MenuItem key={curr.code} value={curr.code}>
                                        {`${curr.name} (${curr.symbol})`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Language Settings */}
                    <Box>
                        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                            <InputLabel id="language-select-label">Language</InputLabel>
                            <Select
                                labelId="language-select-label"
                                id="language-select"
                                value={language}
                                label="Language"
                                onChange={handleLanguageChange}
                            >
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="tl">Filipino</MenuItem>
                                {/* Add more languages as needed */}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};
