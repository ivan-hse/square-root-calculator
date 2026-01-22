import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { Translations, LanguageInfo } from './types';

interface I18nContextType {
  t: Translations;
  currentLanguage: string;
  availableLanguages: LanguageInfo[];
  setLanguage: (code: string) => Promise<void>;
  addLanguage: (info: LanguageInfo, translations: Translations) => void;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

const loadedTranslations: Map<string, Translations> = new Map();
const registeredLanguages: Map<string, LanguageInfo> = new Map();

// Dynamic language loader - loads from public/locales at runtime
async function loadLanguage(code: string): Promise<Translations> {
  if (loadedTranslations.has(code)) {
    return loadedTranslations.get(code)!;
  }

  try {
    const response = await fetch(
      `${import.meta.env.BASE_URL}locales/${code}.json`
    );
    if (!response.ok) {
      throw new Error(`Failed to load language: ${code}`);
    }
    const translations: Translations = await response.json();
    loadedTranslations.set(code, translations);
    return translations;
  } catch (error) {
    console.error(`Error loading language ${code}:`, error);
    throw error;
  }
}

// Register built-in languages
const defaultLanguages: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'es', name: 'Spanish', nativeName: 'Espanol' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
];

defaultLanguages.forEach((lang) => registeredLanguages.set(lang.code, lang));

interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: string;
}

export function I18nProvider({
  children,
  defaultLanguage = 'en',
}: I18nProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableLanguages, setAvailableLanguages] = useState<LanguageInfo[]>(
    Array.from(registeredLanguages.values())
  );

  const setLanguage = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      const t = await loadLanguage(code);
      setTranslations(t);
      setCurrentLanguage(code);
      localStorage.setItem('preferred-language', code);
    } catch {
      console.error(`Failed to switch to language: ${code}`);
      if (code !== 'en') {
        const fallback = await loadLanguage('en');
        setTranslations(fallback);
        setCurrentLanguage('en');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addLanguage = useCallback(
    (info: LanguageInfo, newTranslations: Translations) => {
      registeredLanguages.set(info.code, info);
      loadedTranslations.set(info.code, newTranslations);
      setAvailableLanguages(Array.from(registeredLanguages.values()));
    },
    []
  );

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    const browserLanguage = navigator.language.split('-')[0];
    const initialLanguage =
      savedLanguage ||
      (registeredLanguages.has(browserLanguage)
        ? browserLanguage
        : defaultLanguage);

    setLanguage(initialLanguage);
  }, [defaultLanguage, setLanguage]);

  if (!translations) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
    );
  }

  return (
    <I18nContext.Provider
      value={{
        t: translations,
        currentLanguage,
        availableLanguages,
        setLanguage,
        addLanguage,
        isLoading,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
