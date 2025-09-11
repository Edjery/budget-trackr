import { useCallback, useEffect } from 'react';
import { useTranslation as useI18nTranslation, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import type { TFunction } from 'i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useSettings from './useSettings';

const SETTINGS_QUERY_KEY = ['settings'];
const TRANSLATIONS_QUERY_KEY = ['i18n', 'translations'];

// Type for the translation data
interface TranslationData {
    t: TFunction;
    currentLanguage: string;
    isInitialized: boolean;
}

// Fetches the current translations
const fetchTranslations = async (language: string): Promise<TranslationData> => {
    // Create a minimal i18n instance for the translation function
    const instance = i18n.createInstance();
    await instance
        .use(initReactI18next)
        .init({
            lng: language,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            },
            resources: {
                [language]: {
                    translation: {}
                }
            }
        });
    
    return {
        t: instance.t,
        currentLanguage: language,
        isInitialized: true
    };
};

export const useAppTranslation = () => {
    const queryClient = useQueryClient();
    const { settings } = useSettings();
    const { t: i18nT, i18n } = useI18nTranslation();
    
    // Query for translations
    const { data: translationData, isLoading } = useQuery<TranslationData>({
        queryKey: [...TRANSLATIONS_QUERY_KEY, settings?.language || 'en'],
        queryFn: () => fetchTranslations(settings?.language || 'en'),
        enabled: !!settings?.language,
        staleTime: Infinity,
    });
    
    // React to settings changes
    useEffect(() => {
        if (settings?.language && settings.language !== i18n.language) {
            i18n.changeLanguage(settings.language);
            // Invalidate translations query when language changes
            queryClient.invalidateQueries({ queryKey: TRANSLATIONS_QUERY_KEY });
        }
    }, [settings?.language, i18n, queryClient]);

    const changeLanguage = useCallback(async (lng: string) => {
        // Update i18n immediately for better UX
        await i18n.changeLanguage(lng);
        
        // Update the settings in the query cache
        queryClient.setQueryData(SETTINGS_QUERY_KEY, (old: any) => ({
            ...old,
            language: lng
        }));
        
        // Persist the change
        localStorage.setItem('userSettings', JSON.stringify({
            ...settings,
            language: lng
        }));

        // Invalidate translations query
        await queryClient.invalidateQueries({ queryKey: TRANSLATIONS_QUERY_KEY });
    }, [i18n, queryClient, settings]);

    // Use the translation function from the query if available, fallback to i18next
    const t = translationData?.t || i18nT;
    
    return {
        t,
        i18n,
        changeLanguage,
        currentLanguage: settings?.language || i18n.language,
        isInitialized: translationData?.isInitialized || false,
        isLoading
    };
};

// Re-export the original useTranslation for backward compatibility
export { useTranslation } from 'react-i18next';
