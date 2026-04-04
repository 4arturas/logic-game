interface PropositionExplorerProps {
  type: 'A' | 'E' | 'I' | 'O'
  subject?: string
  predicate?: string
}

const PROPOSITION_INFO = {
  A: {
    name: 'Universal Affirmative',
    latin: 'AffIrmo',
    symbol: 'A',
    form: 'All x are y',
    meaning: 'Every member of class x is also a member of class y',
    cells: {
      xy: 'occupied' as const,
      "xy'": 'empty' as const,
    },
    description: 'The compartment where x exists but y does not (xy\') is empty.',
  },
  E: {
    name: 'Universal Negative',
    latin: 'nEgo',
    symbol: 'E',
    form: 'No x are y',
    meaning: 'No member of class x is also a member of class y',
    cells: {
      xy: 'empty' as const,
    },
    description: 'The compartment where both x and y exist (xy) is empty.',
  },
  I: {
    name: 'Particular Affirmative',
    latin: 'affIrmo',
    symbol: 'I',
    form: 'Some x are y',
    meaning: 'At least one member of class x is also a member of class y',
    cells: {
      xy: 'occupied' as const,
    },
    description: 'There is at least one thing in the xy compartment.',
  },
  O: {
    name: 'Particular Negative',
    latin: 'negO',
    symbol: 'O',
    form: 'Some x are not y',
    meaning: 'At least one member of class x is not a member of class y',
    cells: {
      "x'y": 'occupied' as const,
    },
    description: 'There is at least one thing in the x\'y compartment.',
  },
}

export function PropositionExplorer({ type }: PropositionExplorerProps) {
  const info = PROPOSITION_INFO[type]

  const renderDiagram = () => {
    const cellStates: Record<string, 'empty' | 'occupied'> = {}
    
    if (type === 'A') {
      cellStates["xy'"] = 'empty'
    } else if (type === 'E') {
      cellStates.xy = 'empty'
    } else if (type === 'I') {
      cellStates.xy = 'occupied'
    } else if (type === 'O') {
      cellStates["x'y"] = 'occupied'
    }

    return (
      <svg width={180} height={180} viewBox="0 0 200 200" className="select-none">
        {/* Outer rectangle */}
        <rect x={10} y={10} width={180} height={180} fill="none" stroke="currentColor" strokeWidth={2} className="text-[var(--line)]" />
        <line x1={10} y1={100} x2={190} y2={100} stroke="currentColor" strokeWidth={1.5} className="text-[var(--line)]" />
        <line x1={100} y1={10} x2={100} y2={190} stroke="currentColor" strokeWidth={1.5} className="text-[var(--line)]" />

        {/* Cell backgrounds */}
        <rect x={10} y={10} width={90} height={90} fill="transparent" />
        <rect x={100} y={10} width={90} height={90} fill="transparent" />
        <rect x={10} y={100} width={90} height={90} fill="transparent" />
        <rect x={100} y={100} width={90} height={90} fill="transparent" />

        {/* Highlight the relevant cell */}
        {type === 'A' && (
          <rect x={100} y={10} width={90} height={90} fill="#fef3c7" opacity={0.5} />
        )}
        {type === 'E' && (
          <rect x={100} y={100} width={90} height={90} fill="#fef3c7" opacity={0.5} />
        )}
        {type === 'I' && (
          <rect x={100} y={100} width={90} height={90} fill="#fef3c7" opacity={0.5} />
        )}
        {type === 'O' && (
          <rect x={10} y={100} width={90} height={90} fill="#fef3c7" opacity={0.5} />
        )}

        {/* Counters */}
        {Object.entries(cellStates).map(([cell, state]) => {
          let cx = 145, cy = 145 // xy (bottom-right)
          if (cell === "xy'") { cx = 145; cy = 55 }
          else if (cell === "x'y") { cx = 55; cy = 145 }
          else if (cell === "x'y'") { cx = 55; cy = 55 }

          const color = state === 'occupied' ? '#ef4444' : '#6b7280'
          const fillColor = state === 'occupied' ? '#fecaca' : '#e5e7eb'

          return (
            <g key={cell}>
              <circle cx={cx} cy={cy} r={20} fill={fillColor} stroke={color} strokeWidth={2.5} />
              <circle cx={cx} cy={cy} r={14} fill={color} opacity={0.25} />
              {state === 'empty' && (
                <>
                  <line x1={cx - 10} y1={cy - 10} x2={cx + 10} y2={cy + 10} stroke={color} strokeWidth={2.5} />
                  <line x1={cx + 10} y1={cy - 10} x2={cx - 10} y2={cy + 10} stroke={color} strokeWidth={2.5} />
                </>
              )}
              {state === 'occupied' && (
                <circle cx={cx} cy={cy} r={6} fill={color} />
              )}
            </g>
          )
        })}

        {/* Labels */}
        <text x={145} y={30} style={{ fontSize: '13px', fontWeight: 700 }} className="fill-[var(--lagoon)]">x</text>
        <text x={55} y={30} style={{ fontSize: '13px', fontWeight: 700 }} className="fill-[var(--sea-ink-soft)]">x'</text>
        <text x={170} y={145} style={{ fontSize: '13px', fontWeight: 700 }} className="fill-[var(--lagoon)]">y</text>
        <text x={170} y={65} style={{ fontSize: '13px', fontWeight: 700 }} className="fill-[var(--sea-ink-soft)]">y'</text>
      </svg>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      {/* Diagram */}
      <div className="flex-shrink-0">
        {renderDiagram()}
      </div>

      {/* Explanation */}
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg ${
            type === 'A' ? 'bg-[var(--lagoon)]' :
            type === 'E' ? 'bg-red-600' :
            type === 'I' ? 'bg-[var(--palm)]' :
            'bg-amber-600'
          }`}>
            {info.symbol}
          </div>
          <div>
            <div className="font-bold text-[var(--sea-ink)]">{info.name}</div>
            <div className="text-xs text-[var(--sea-ink-soft)] italic">From Latin: {info.latin}</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[var(--foam)] border border-[var(--line)]">
          <div className="text-xs font-semibold uppercase text-[var(--sea-ink-soft)] mb-1">Form</div>
          <div className="text-base font-bold text-[var(--sea-ink)] italic" style={{ fontFamily: 'var(--font-serif)' }}>
            {info.form}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-[var(--sea-ink-soft)] mb-1">Meaning</div>
          <div className="text-sm text-[var(--sea-ink)]">{info.meaning}</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-[var(--sea-ink-soft)] mb-1">Diagram Explanation</div>
          <div className="text-sm text-[var(--sea-ink)]">{info.description}</div>
        </div>
      </div>
    </div>
  )
}
