import { useCallback, useEffect } from 'react';
import { useSettings } from './useSettings';
import { CURRENCIES } from '../utils/currencyUtils';

export const useAppSettings = () => {
    const { 
        settings, 
        updateSettings, 
        updateTheme, 
        updateCurrency, 
        updateLanguage,
        isUpdating,
        error
    } = useSettings();

    // Handle system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = () => {
            if (settings.appearance.theme === 'system') {
                updateTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [settings.appearance.theme, updateTheme]);

    const toggleTheme = () => {
        const newTheme = settings.appearance.theme === 'dark' ? 'light' : 'dark';
        updateTheme(newTheme);
    };

    // Wrapper for currency update to ensure proper formatting
    const handleCurrencyUpdate = useCallback((code: string) => {
        const currency = CURRENCIES[code] || {
            code,
            symbol: '$',
            name: 'US Dollar',
            locale: 'en-US'
        };
        updateCurrency(currency);
    }, [updateCurrency]);

    // Initialize currency on first load if needed
    useEffect(() => {
        if (settings.currency?.code && !CURRENCIES[settings.currency.code]) {
            handleCurrencyUpdate('PHP');
        }
    }, [settings.currency?.code, handleCurrencyUpdate]);

    return {
        settings,
        updateSettings,
        isDarkMode: settings.appearance.theme === 'dark',
        theme: settings.appearance.theme,
        currency: settings.currency?.code || 'PHP',
        language: settings.language || 'en',
        updateCurrency: handleCurrencyUpdate,
        updateLanguage,
        toggleTheme,
        isLoading: isUpdating,
        error
    };
};
