import { useEffect } from 'react';
import { useUserSettings } from '../contexts/UserSettingsContext';
import { CURRENCIES, setCurrency } from '../utils/currencyUtils';

export const useAppSettings = () => {
    const { settings, updateSettings, isDarkMode } = useUserSettings();

    // Update currency when settings change
    useEffect(() => {
        if (settings.currency?.code) {
            setCurrency(settings.currency.code);
        }
    }, [settings.currency?.code]);

    // Handle system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = () => {
            if (settings.appearance.theme === 'system') {
                updateSettings({
                    appearance: { theme: 'system' }
                });
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [settings.appearance.theme, updateSettings]);

    const toggleTheme = () => {
        const newTheme = settings.appearance.theme === 'dark' 
            ? 'light' 
            : settings.appearance.theme === 'light' 
                ? 'system' 
                : 'dark';
        
        updateSettings({
            appearance: { theme: newTheme }
        });
    };

    const updateCurrency = (currencyCode: string) => {
        if (CURRENCIES[currencyCode]) {
            updateSettings({
                currency: { code: currencyCode }
            });
        }
    };

    const updateLanguage = (language: string) => {
        updateSettings({
            language
        });
    };

    return {
        theme: settings.appearance.theme,
        isDarkMode,
        currency: settings.currency.code,
        language: settings.language,
        toggleTheme,
        updateCurrency,
        updateLanguage,
    };
};
