export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserSettings {
    appearance: {
        theme: ThemeMode;
    };
    currency: {
        code: string;
    };
    language: string;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
    appearance: {
        theme: 'system',
    },
    currency: {
        code: 'PHP',
    },
    language: 'en',
};
