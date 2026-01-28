// Supported locale codes
export const locales = ['en', 'es', 'hy', 'ru', 'uk'] as const;
export type Locale = typeof locales[number];

// Default locale
export const defaultLocale: Locale = 'en';

// Locale metadata
export interface LocaleInfo {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const localeInfoMap: Record<Locale, LocaleInfo> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    dir: 'ltr',
  },
  hy: {
    code: 'hy',
    name: 'Armenian',
    nativeName: 'Hayeren',
    flag: '🇦🇲',
    dir: 'ltr',
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    dir: 'ltr',
  },
  uk: {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    flag: '🇺🇦',
    dir: 'ltr',
  },
};

// Translation dictionary type
export type TranslationDictionary = Record<string, string>;

// All translations type
export type Translations = Record<Locale, TranslationDictionary>;
