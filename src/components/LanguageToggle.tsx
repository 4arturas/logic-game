import { useI18n } from '../i18n/I18nContext'
import { useNavigate, useLocation } from '@tanstack/react-router'
import LT from 'country-flag-icons/react/3x2/LT'
import GB from 'country-flag-icons/react/3x2/GB'

export default function LanguageToggle() {
  const { language, setLanguage } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'lt' : 'en'
    setLanguage(newLang)
    
    // Update URL with language param, preserving other search params
    navigate({
      to: location.pathname as any,
      search: (prev: any) => ({ ...prev, lang: newLang }),
      replace: true,
    })
  }

  return (
    <button
      onClick={toggleLanguage}
      className="cursor-pointer rounded-xl p-1 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] font-bold text-sm uppercase flex items-center gap-1 overflow-hidden"
      title={`Switch to ${language === 'en' ? 'Lithuanian' : 'English'}`}
    >
      {language === 'en' ? (
        <LT title="Lithuania" className="w-6 h-5" />
      ) : (
        <GB title="United Kingdom" className="w-6 h-5" />
      )}
    </button>
  )
}
