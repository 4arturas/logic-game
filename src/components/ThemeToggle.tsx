import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'

export type ThemeMode = 'ocean' | 'forest' | 'sunset' | 'midnight' | 'cream' | 'clean' | 'focus' | 'dark'

const THEMES: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'ocean', label: 'Ocean', icon: '🌊' },
  { value: 'forest', label: 'Forest', icon: '🌲' },
  { value: 'sunset', label: 'Sunset', icon: '🌅' },
  { value: 'midnight', label: 'Midnight', icon: '🌙' },
  { value: 'cream', label: 'Cream', icon: '🍦' },
  { value: 'clean', label: 'Clean', icon: '✨' },
  { value: 'focus', label: 'Focus', icon: '🎯' },
  { value: 'dark', label: 'Dark', icon: '🌑' },
]

const VALID_THEMES = THEMES.map(t => t.value)

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'ocean'
  }

  const stored = window.localStorage.getItem('theme')
  if (stored && VALID_THEMES.includes(stored as ThemeMode)) {
    return stored as ThemeMode
  }

  return 'ocean'
}

function applyThemeMode(mode: ThemeMode) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  
  if (mode === 'dark') {
    root.classList.add('dark')
    root.setAttribute('data-theme', 'dark')
    root.style.colorScheme = 'dark'
  } else {
    root.setAttribute('data-theme', mode)
    root.style.colorScheme = 'light'
  }
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('ocean')
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Check URL first, then localStorage
    const params = new URLSearchParams(window.location.search)
    const urlTheme = params.get('theme')
    
    if (urlTheme && VALID_THEMES.includes(urlTheme as ThemeMode)) {
      setMode(urlTheme as ThemeMode)
      applyThemeMode(urlTheme as ThemeMode)
    } else {
      const initialMode = getInitialMode()
      setMode(initialMode)
      applyThemeMode(initialMode)
    }
  }, [])

  useEffect(() => {
    applyThemeMode(mode)
    window.localStorage.setItem('theme', mode)
  }, [mode])

  function cycleTheme() {
    const currentIndex = THEMES.findIndex(t => t.value === mode)
    const nextIndex = (currentIndex + 1) % THEMES.length
    const nextMode = THEMES[nextIndex].value
    setMode(nextMode)
    updateUrl(nextMode)
  }

  function selectTheme(theme: ThemeMode) {
    setMode(theme)
    updateUrl(theme)
    setIsOpen(false)
  }

  function updateUrl(theme: ThemeMode) {
    navigate({
      to: location.pathname as any,
      search: (prev: any) => ({ ...prev, theme }),
      replace: true,
    })
  }

  const currentTheme = THEMES.find(t => t.value === mode)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Theme: ${currentTheme?.label}. Click to change theme.`}
        title={`Theme: ${currentTheme?.label}`}
        className="cursor-pointer rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
      >
        <span className="mr-1">{currentTheme?.icon}</span>
        {currentTheme?.label}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl border border-[var(--chip-line)] bg-[var(--chip-bg)] p-2 shadow-lg">
            <div className="mb-2 px-2 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
              Select Theme
            </div>
            {THEMES.map(theme => (
              <button
                key={theme.value}
                onClick={() => selectTheme(theme.value)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  mode === theme.value
                    ? 'bg-[var(--lagoon)]/20 font-semibold text-[var(--palm)]'
                    : 'text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)]'
                }`}
              >
                <span>{theme.icon}</span>
                <span>{theme.label}</span>
                {mode === theme.value && (
                  <span className="ml-auto text-[var(--palm)]">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
