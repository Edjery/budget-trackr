import type { Language } from "../types";

export const LANGUAGES: Record<string, Language> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English"
  },
  ph: {
    code: "ph",
    name: "Filipino",
    nativeName: "Filipino"
  }
} as const;
