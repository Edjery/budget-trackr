import type { Language } from "../types";

export const LANGUAGES: Record<string, Language> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    locale: "en-US"
  },
  ph: {
    code: "ph",
    name: "Filipino",
    nativeName: "Filipino",
    locale: "fil-PH"
  }
} as const;

export const getLocaleByLanguage = (languageCode: string): string => {
  return LANGUAGES[languageCode]?.locale || LANGUAGES.en.locale;
};
