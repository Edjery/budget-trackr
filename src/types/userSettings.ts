import type { Currency } from '../utils/currencyUtils';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserSettings {
    appearance: {
        theme: ThemeMode;
        fontSize: number;
        compactMode: boolean;
    };
    currency: Currency;
    notifications: {
        email: boolean;
        push: boolean;
        lowBalance: boolean;
        monthlyReport: boolean;
    };
    security: {
        autoLock: number; // minutes of inactivity before auto-lock, 0 to disable
        biometrics: boolean;
    };
    visibility: {
        balance: boolean;
        earnings: boolean;
        spendings: boolean;
    };
    language: string;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
    appearance: {
        theme: 'system',
        fontSize: 12,
        compactMode: false,
    },
    currency: {
        code: 'PHP',
        symbol: '₱',
        name: 'Philippine Peso',
        locale: 'en-PH'
    },
    notifications: {
        email: false,
        push: false,
        lowBalance: false,
        monthlyReport: false,
    },
    security: {
        autoLock: 0,
        biometrics: false,
    },
    visibility: {
        balance: true,
        earnings: true,
        spendings: true,
    },
    language: 'en',
};
