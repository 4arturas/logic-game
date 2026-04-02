import { useSettings } from '../contexts/SettingsContext'

export default function PremiseOrderToggle() {
  const { premiseOrder, togglePremiseOrder } = useSettings()
  const isMajorFirst = premiseOrder === 'major-first'

  return (
    <button
      onClick={togglePremiseOrder}
      className="flex items-center justify-center rounded-xl p-1 px-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] cursor-pointer font-mono font-bold text-sm"
      title={`Premise order: ${isMajorFirst ? 'Y \u2192 X (Major first)' : 'X \u2192 Y (Minor first)'}. Click to switch.`}
    >
      <div className="flex items-center gap-1">
        {/* Y button */}
        <span
          className={`px-1.5 py-0.5 rounded transition-all ${
            isMajorFirst
              ? 'bg-[var(--term-y)] text-white font-bold'
              : 'text-[var(--term-y)] hover:bg-[var(--foam)]'
          }`}
        >
          Y
        </span>
        
        <span className="text-[10px] opacity-50">/</span>
        
        {/* X button */}
        <span
          className={`px-1.5 py-0.5 rounded transition-all ${
            !isMajorFirst
              ? 'bg-[var(--term-x)] text-white font-bold'
              : 'text-[var(--term-x)] hover:bg-[var(--foam)]'
          }`}
        >
          X
        </span>
      </div>
    </button>
  )
}
