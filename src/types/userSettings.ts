import type { Currency } from '../utils/currencyUtils';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserSettings {
    appearance: {
        theme: ThemeMode;
    };
    currency: Currency;
    language: string;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
    appearance: {
        theme: 'system',
    },
    currency: {
        code: 'PHP',
        symbol: '₱',
        name: 'Philippine Peso',
        locale: 'en-PH'
    },
    language: 'en',
};
