import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserSettings } from "../types/userSettings";
import { DEFAULT_USER_SETTINGS } from "../types/userSettings";

const SETTINGS_QUERY_KEY = ['settings'];

const loadSettings = (): UserSettings => {
    try {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            // Merge with defaults to ensure all required fields are present
            return {
                ...DEFAULT_USER_SETTINGS,
                ...parsed,
                appearance: {
                    ...DEFAULT_USER_SETTINGS.appearance,
                    ...(parsed.appearance || {})
                },
                currency: {
                    ...DEFAULT_USER_SETTINGS.currency,
                    ...(parsed.currency || {})
                }
            };
        }
    } catch (error) {
        console.error('Error loading settings from localStorage:', error);
    }
    return DEFAULT_USER_SETTINGS;
};

export const useSettings = () => {
    const queryClient = useQueryClient();

    // Get settings query
    const { data: settings = DEFAULT_USER_SETTINGS, isLoading, error } = useQuery<UserSettings>({
        queryKey: SETTINGS_QUERY_KEY,
        queryFn: loadSettings,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Update settings mutation
    const { mutate: updateSettings, isPending: isUpdating } = useMutation({
        mutationFn: async (newSettings: Partial<UserSettings>) => {
            // Get current settings to merge with new ones
            const currentSettings = queryClient.getQueryData<UserSettings>(SETTINGS_QUERY_KEY) || settings;
            const mergedSettings = { ...currentSettings, ...newSettings };
            // Save to localStorage
            try {
                localStorage.setItem('userSettings', JSON.stringify(mergedSettings));
            } catch (error) {
                console.error('Failed to save settings to localStorage:', error);
                throw error; // Re-throw to trigger onError if needed
            }
            
            return mergedSettings;
        },
        onSuccess: (data) => {
            // Update the query cache with the new data
            queryClient.setQueryData(SETTINGS_QUERY_KEY, data);
        },
    });

    // Individual update functions
    const updateTheme = (theme: UserSettings['appearance']['theme']) => {
        updateSettings({
            ...settings,
            appearance: {
                ...settings.appearance,
                theme
            }
        });
    };

    const updateCurrency = (currency: UserSettings['currency']) => {
        updateSettings({
            ...settings,
            currency: {
                ...settings.currency,
                ...currency
            }
        });
    };

    const updateLanguage = (language: string) => {
        updateSettings({
            ...settings,
            language
        });
    };

    return {
        settings,
        updateSettings,
        updateTheme,
        updateCurrency,
        updateLanguage,
        isLoading,
        isUpdating,
        error
    };
};

export default useSettings;
