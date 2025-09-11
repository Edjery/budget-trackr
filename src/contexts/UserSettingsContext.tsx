import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { UserSettings } from "../types/userSettings";
import { DEFAULT_USER_SETTINGS } from "../types/userSettings";

interface UserSettingsContextType {
    settings: UserSettings;
    updateSettings: (newSettings: Partial<UserSettings>) => void;
    isDarkMode: boolean;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

const STORAGE_KEY = "userSettings";

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Load settings from localStorage on initial render
    useEffect(() => {
        const savedSettings = localStorage.getItem(STORAGE_KEY);
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                setSettings(parsedSettings);
            } catch (error) {
                console.error("Failed to parse saved settings", error);
            }
        }
    }, []);

    // Update dark mode based on system preference and user settings
    useEffect(() => {
        const root = window.document.documentElement;
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        const theme =
            settings.appearance.theme === "system" ? (systemPrefersDark ? "dark" : "light") : settings.appearance.theme;

        const darkMode = theme === "dark";
        setIsDarkMode(darkMode);

        if (darkMode) {
            root.classList.add("dark");
            root.classList.remove("light");
        } else {
            root.classList.add("light");
            root.classList.remove("dark");
        }
    }, [settings.appearance.theme]);

    // Save settings to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error("Failed to save settings", error);
        }
    }, [settings]);

    const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
        setSettings((prev) => ({
            ...prev,
            ...newSettings,
            appearance: {
                ...prev.appearance,
                ...(newSettings.appearance || {}),
            },
            currency: {
                ...prev.currency,
                ...(newSettings.currency || {}),
            },
        }));
    }, []);

    return (
        <UserSettingsContext.Provider value={{ settings, updateSettings, isDarkMode }}>
            {children}
        </UserSettingsContext.Provider>
    );
};

export const useUserSettings = (): UserSettingsContextType => {
    const context = useContext(UserSettingsContext);
    if (context === undefined) {
        throw new Error("useUserSettings must be used within a UserSettingsProvider");
    }
    return context;
};
