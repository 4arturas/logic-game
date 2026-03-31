import { useSettings } from '../contexts/SettingsContext'

export default function PremiseOrderToggle() {
  const { premiseOrder, togglePremiseOrder } = useSettings()

  return (
    <button
      onClick={togglePremiseOrder}
      className="flex items-center justify-center rounded-xl p-1 px-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] font-mono font-bold text-sm"
      title={`Switch premise order (currently ${premiseOrder === 'major-first' ? 'Y \u2192 X' : 'X \u2192 Y'})`}
    >
      <div className="flex items-center gap-1">
        <span style={{ color: premiseOrder === 'major-first' ? 'var(--term-y)' : 'var(--term-x)' }}>
          {premiseOrder === 'major-first' ? 'Y' : 'X'}
        </span>
        <span className="text-[10px] opacity-70">/</span>
        <span style={{ color: premiseOrder === 'major-first' ? 'var(--term-x)' : 'var(--term-y)' }}>
          {premiseOrder === 'major-first' ? 'X' : 'Y'}
        </span>
      </div>
    </button>
  )
}
