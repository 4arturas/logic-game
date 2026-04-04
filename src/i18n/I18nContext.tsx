import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { translations } from './translations'
import termsLt from '../data/terms_lt.json'

export type Language = 'en' | 'lt'

type TranslationKey = keyof typeof translations['en']

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey | string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const STORAGE_KEY = 'logic-game-language'
const DEFAULT_LANGUAGE: Language = 'lt'

function getUrlLanguage(): Language | null {
  if (typeof window === 'undefined') {
    return null
  }
  const params = new URLSearchParams(window.location.search)
  const lang = params.get('lang')
  if (lang === 'en' || lang === 'lt') {
    return lang
  }
  return null
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Priority: URL param > localStorage > default
    const urlLang = getUrlLanguage()
    if (urlLang) {
      setLanguageState(urlLang)
      localStorage.setItem(STORAGE_KEY, urlLang)
    } else {
      try {
        const stored = localStorage.getItem(STORAGE_KEY) as Language
        if (stored === 'en' || stored === 'lt') {
          setLanguageState(stored)
        }
      } catch (e) {
        // localStorage not available
      }
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, lang)
      }
    } catch (e) {
      // localStorage not available
    }
  }, [])

  const t = useCallback(
    (key: TranslationKey | string): string => {
      // First check main translations
      const translationKey = key as TranslationKey
      if (translationKey in translations[language]) {
        return translations[language][translationKey]
      }
      // For Lithuanian, check term translations
      if (language === 'lt' && key in termsLt) {
        return (termsLt as Record<string, string>)[key] || key
      }
      // Return key itself if not found (English fallback)
      return key
    },
    [language]
  )

  useEffect(() => {
    if (isMounted) {
      document.documentElement.lang = language
    }
  }, [language, isMounted])

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

export function useTranslation() {
  const { t, language, setLanguage } = useI18n()
  return { t, language, setLanguage }
}
