import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'
import { useTranslation } from '../i18n/I18nContext'

export default function Header() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl flex-nowrap items-center justify-between gap-4 py-3 sm:py-4">
        {/* Left spacer */}
        <div className="hidden sm:block sm:w-1/3" />

        {/* Navigation links - center */}
        <div className="flex flex-shrink-0 items-center gap-4 text-sm font-semibold">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            {t('nav.game')}
          </Link>
          <Link
            to="/practice"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            {t('nav.practice')}
          </Link>
          <Link
            to="/campaign"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            {t('nav.campaign')}
          </Link>
          <Link
            to="/game"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            {t('nav.game_quiz')}
          </Link>
        </div>

        {/* Theme and Language toggles - far right */}
        <div className="flex flex-shrink-0 items-center gap-1.5 sm:w-1/3 sm:justify-end">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </nav>
    </header>
  )
}
