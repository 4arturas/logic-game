import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'
import PremiseOrderToggle from './PremiseOrderToggle'
import AudioToggle from './AudioToggle'
import { useTranslation } from '../i18n/I18nContext'

/** Venn-diagram logo mark — two overlapping circles, filled accent */
function VennLogo() {
  return (
    <svg
      width="34"
      height="24"
      viewBox="0 0 34 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="var(--lagoon)" fillOpacity="0.18" stroke="var(--lagoon)" strokeWidth="1.6" />
      <circle cx="22" cy="12" r="10" fill="var(--lagoon)" fillOpacity="0.10" stroke="var(--lagoon)" strokeWidth="1.6" />
      {/* intersection tint */}
      <path
        d="M17 3.8 A10 10 0 0 1 17 20.2 A10 10 0 0 1 17 3.8 Z"
        fill="var(--lagoon)"
        fillOpacity="0.26"
      />
    </svg>
  )
}

export default function Header() {
  const { t } = useTranslation()

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-md"
      style={{ boxShadow: '0 1px 0 rgba(15,25,35,0.06)' }}
    >
      <nav className="mx-auto flex max-w-7xl flex-nowrap items-center justify-between gap-4 py-3 sm:py-3.5">

        {/* ── LEFT: Logo + wordmark ── */}
        <Link
          to="/"
          search={{ x: undefined, y: undefined, m: undefined, large: undefined, small: undefined }}
          className="flex items-center gap-2 no-underline flex-shrink-0"
          style={{ textDecoration: 'none' }}
        >
          <VennLogo />
          <span
            className="display-title text-base font-semibold tracking-tight hidden sm:block"
            style={{ color: 'var(--sea-ink)', letterSpacing: '-0.01em' }}
          >
            Carroll{' '}
            <span style={{ color: 'var(--lagoon)' }}>Logic</span>
          </span>
        </Link>

        {/* ── CENTER: Navigation ── */}
        <div className="flex flex-shrink-0 items-center gap-1">
          <Link
            to="/"
            className="nav-link px-3 py-1.5 rounded"
            activeProps={{ className: 'nav-link is-active px-3 py-1.5 rounded' }}
          >
            {t('nav.practice')}
          </Link>
          <span className="text-[var(--line)] select-none">·</span>
          <Link
            to="/campaign"
            className="nav-link px-3 py-1.5 rounded"
            activeProps={{ className: 'nav-link is-active px-3 py-1.5 rounded' }}
          >
            {t('nav.campaign')}
          </Link>
          <span className="text-[var(--line)] select-none">·</span>
          <Link
            to="/game"
            className="nav-link px-3 py-1.5 rounded"
            activeProps={{ className: 'nav-link is-active px-3 py-1.5 rounded' }}
          >
            {t('nav.game_quiz')}
          </Link>
          <span className="text-[var(--line)] select-none">·</span>
          <Link
            to="/syllogisms"
            className="nav-link px-3 py-1.5 rounded"
            activeProps={{ className: 'nav-link is-active px-3 py-1.5 rounded' }}
          >
            {t('nav.syllogisms')}
          </Link>
          <span className="text-[var(--line)] select-none">·</span>
          <Link
            to="/atlas3d"
            className="nav-link px-3 py-1.5 rounded bg-gradient-to-r from-[var(--lagoon)] to-[var(--palm)] bg-clip-text text-transparent opacity-80 hover:opacity-100 font-bold"
            activeProps={{ className: 'nav-link is-active px-3 py-1.5 rounded opacity-100' }}
          >
            3D Atlas
          </Link>
          <span className="text-[var(--line)] select-none">·</span>
          <Link
            to="/learn"
            className="nav-link px-3 py-1.5 rounded"
            activeProps={{ className: 'nav-link is-active px-3 py-1.5 rounded' }}
          >
            {t('nav.learn')}
          </Link>
          <span className="text-[var(--line)] select-none">·</span>
          <Link
            to="/workshop"
            className="nav-link px-3 py-1.5 rounded"
            activeProps={{ className: 'nav-link is-active px-3 py-1.5 rounded' }}
          >
            {t('nav.workshop')}
          </Link>
        </div>

        {/* ── RIGHT: Toggles ── */}
        <div className="flex flex-shrink-0 items-center gap-1.5">
          <AudioToggle />
          <ThemeToggle />
          <PremiseOrderToggle />
          <LanguageToggle />
        </div>

      </nav>
    </header>
  )
}
