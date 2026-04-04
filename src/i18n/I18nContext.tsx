import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { translations, LANGUAGES } from './translations'
import type { Language } from './translations'
import { termTranslations } from './terms'

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
  if (lang && LANGUAGES.includes(lang as Language)) {
    return lang as Language
  }
  return null
}

function isValidLanguage(lang: string): lang is Language {
  return LANGUAGES.includes(lang as Language)
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
      try { localStorage.setItem(STORAGE_KEY, urlLang) } catch {}
    } else {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored && isValidLanguage(stored)) {
          setLanguageState(stored)
        }
      } catch {
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
    } catch {
      // localStorage not available
    }
  }, [])

  const t = useCallback(
    (key: TranslationKey | string): string => {
      const translationKey = key as TranslationKey

      // 1. Check program translations (UI text)
      const langTranslations = translations[language]
      if (langTranslations && translationKey in langTranslations) {
        return langTranslations[translationKey]
      }

      // 2. Check term translations (syllogism terms)
      const terms = termTranslations[language]
      if (terms && key in terms) {
        return terms[key]
      }

      // 3. Return key itself as fallback (for untranslatable terms)
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

// Helper to get available languages
export function getAvailableLanguages(): readonly Language[] {
  return LANGUAGES
}
