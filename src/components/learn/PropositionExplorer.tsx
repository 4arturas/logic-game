import { useTranslation } from '../../i18n/I18nContext'

interface PropositionExplorerProps {
  type: 'A' | 'E' | 'I' | 'O'
  subject?: string
  predicate?: string
}

const PROPOSITION_INFO = {
  A: {
    nameKey: 'learn.prop_a_name',
    latin: 'AffIrmo',
    symbol: 'A',
    formKey: 'learn.prop_a_form',
    symbolic: 'x₁y\'₀',
    symbolicLabel: 'x(1-y) = 0',
    setNotation: 'x ⊆ y',
    programming: 'if (x && !y) return false',
    sql: 'NOT EXISTS (SELECT 1 FROM things WHERE x = 1 AND y = 0)',
    meaningKey: 'learn.prop_a_meaning',
    cells: {
      xy: 'occupied' as const,
      "xy'": 'empty' as const,
    },
    descriptionKey: 'learn.prop_a_meaning_desc',
  },
  E: {
    nameKey: 'learn.prop_e_name',
    latin: 'nEgo',
    symbol: 'E',
    formKey: 'learn.prop_e_form',
    symbolic: 'x₁y₁ = 0',
    symbolicLabel: 'xy = 0',
    setNotation: 'x ∩ y = ∅',
    programming: 'if (x && y) return false',
    sql: 'NOT EXISTS (SELECT 1 FROM things WHERE x = 1 AND y = 1)',
    meaningKey: 'learn.prop_e_meaning',
    cells: {
      xy: 'empty' as const,
    },
    descriptionKey: 'learn.prop_e_meaning_desc',
  },
  I: {
    nameKey: 'learn.prop_i_name',
    latin: 'affIrmo',
    symbol: 'I',
    formKey: 'learn.prop_i_form',
    symbolic: 'x₁y₁ > 0',
    symbolicLabel: 'xy ≠ 0',
    setNotation: 'x ∩ y ≠ ∅',
    programming: 'return x && y',
    sql: 'EXISTS (SELECT 1 FROM things WHERE x = 1 AND y = 1)',
    meaningKey: 'learn.prop_i_meaning',
    cells: {
      xy: 'occupied' as const,
    },
    descriptionKey: 'learn.prop_i_meaning_desc',
  },
  O: {
    nameKey: 'learn.prop_o_name',
    latin: 'negO',
    symbol: 'O',
    formKey: 'learn.prop_o_form',
    symbolic: 'x₁y\'₁ > 0',
    symbolicLabel: 'x(1-y) ≠ 0',
    setNotation: 'x ⊈ y',
    programming: 'return x && !y',
    sql: 'EXISTS (SELECT 1 FROM things WHERE x = 1 AND y = 0)',
    meaningKey: 'learn.prop_o_meaning',
    cells: {
      "x'y": 'occupied' as const,
    },
    descriptionKey: 'learn.prop_o_meaning_desc',
  },
}

export function PropositionExplorer({ type }: PropositionExplorerProps) {
  const { t } = useTranslation()
  const info = PROPOSITION_INFO[type]

  const renderDiagram = () => {
    const cellStates: Record<string, 'empty' | 'occupied'> = {}
    
    // Carroll's notation: TOP=x, BOTTOM=x', LEFT=y, RIGHT=y'
    // xy = top-left, xy' = top-right, x'y = bottom-left, x'y' = bottom-right
    
    if (type === 'A') {
      // "All x are y" → xy' (top-right) is empty
      cellStates["xy'"] = 'empty'
    } else if (type === 'E') {
      // "No x are y" → xy (top-left) is empty
      cellStates.xy = 'empty'
    } else if (type === 'I') {
      // "Some x are y" → xy (top-left) has counter
      cellStates.xy = 'occupied'
    } else if (type === 'O') {
      // "Some x are not y" → x'y (bottom-left) has counter
      cellStates["x'y"] = 'occupied'
    }

    return (
      <svg width={180} height={180} viewBox="0 0 200 200" className="select-none">
        {/* Outer rectangle */}
        <rect x={10} y={10} width={180} height={180} fill="none" stroke="currentColor" strokeWidth={2} className="text-[var(--line)]" />
        <line x1={10} y1={100} x2={190} y2={100} stroke="currentColor" strokeWidth={1.5} className="text-[var(--line)]" />
        <line x1={100} y1={10} x2={100} y2={190} stroke="currentColor" strokeWidth={1.5} className="text-[var(--line)]" />

        {/* Cell backgrounds - TOP=x, BOTTOM=x', LEFT=y, RIGHT=y' */}
        <rect x={10} y={10} width={90} height={90} fill="transparent" />
        <rect x={100} y={10} width={90} height={90} fill="transparent" />
        <rect x={10} y={100} width={90} height={90} fill="transparent" />
        <rect x={100} y={100} width={90} height={90} fill="transparent" />

        {/* Highlight the relevant cell */}
        {type === 'A' && (
          <rect x={100} y={10} width={90} height={90} fill="#fef3c7" opacity={0.5} />
        )}
        {type === 'E' && (
          <rect x={10} y={10} width={90} height={90} fill="#fef3c7" opacity={0.5} />
        )}
        {type === 'I' && (
          <rect x={10} y={10} width={90} height={90} fill="#fef3c7" opacity={0.5} />
        )}
        {type === 'O' && (
          <rect x={10} y={100} width={90} height={90} fill="#fef3c7" opacity={0.5} />
        )}

        {/* Counters - CORRECTED positions */}
        {Object.entries(cellStates).map(([cell, state]) => {
          // Carroll's notation: TOP=x, BOTTOM=x', LEFT=y, RIGHT=y'
          let cx = 55, cy = 55   // xy = top-left
          if (cell === "xy'") { cx = 145; cy = 55 }    // top-right
          else if (cell === "x'y") { cx = 55; cy = 145 }  // bottom-left
          else if (cell === "x'y'") { cx = 145; cy = 145 } // bottom-right

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

        {/* Labels - Carroll's notation: TOP=x, BOTTOM=x', LEFT=y, RIGHT=y' */}
        <text x={100} y={28} textAnchor="middle" style={{ fontSize: '14px', fontWeight: 800, fill: 'var(--term-x)' }}>x</text>
        <text x={100} y={188} textAnchor="middle" style={{ fontSize: '14px', fontWeight: 800, fill: 'var(--term-x)', opacity: 0.6 }}>x'</text>
        <text x={25} y={100} textAnchor="middle" style={{ fontSize: '14px', fontWeight: 800, fill: 'var(--term-y)' }} transform="rotate(-90 25 100)">y</text>
        <text x={175} y={100} textAnchor="middle" style={{ fontSize: '14px', fontWeight: 800, fill: 'var(--term-y)', opacity: 0.6 }} transform="rotate(90 175 100)">y'</text>
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
            <div className="font-bold text-[var(--sea-ink)]">{t(info.nameKey)}</div>
            <div className="text-xs text-[var(--sea-ink-soft)] italic">{t('learn.from_latin')} {info.latin}</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[var(--foam)] border border-[var(--line)]">
          <div className="text-xs font-semibold uppercase text-[var(--sea-ink-soft)] mb-1">{t('learn.form_label')}</div>
          <div className="text-base font-bold text-[var(--sea-ink)] italic" style={{ fontFamily: 'var(--font-serif)' }}>
            {t(info.formKey)}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[var(--foam)] border border-[var(--line)]">
          <div className="text-xs font-semibold uppercase text-[var(--sea-ink-soft)] mb-1">{t('learn.symbolic_label')}</div>
          <div className="flex items-center gap-3">
            <span className="text-base font-mono font-bold text-[var(--lagoon)]">
              {info.symbolic}
            </span>
            <span className="text-xs text-[var(--sea-ink-soft)]">
              ({info.symbolicLabel})
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[var(--foam)] border border-[var(--line)]">
          <div className="text-xs font-semibold uppercase text-[var(--sea-ink-soft)] mb-1">{t('learn.set_notation_label')}</div>
          <span className="text-lg font-serif font-bold text-[var(--term-x)]">
            {info.setNotation}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[var(--foam)] border border-[var(--line)]">
          <div className="text-xs font-semibold uppercase text-[var(--sea-ink-soft)] mb-1">{t('learn.programming_label')}</div>
          <code className="text-sm font-mono text-[var(--palm)] block">
            {info.programming}
          </code>
        </div>

        <div className="p-3 rounded-lg bg-[var(--foam)] border border-[var(--line)]">
          <div className="text-xs font-semibold uppercase text-[var(--sea-ink-soft)] mb-1">{t('learn.sql_label')}</div>
          <code className="text-sm font-mono text-[var(--palm)] block overflow-x-auto">
            {info.sql}
          </code>
        </div>

        <div>
          <div className="text-xs font-semibold text-[var(--sea-ink-soft)] mb-1">{t('learn.meaning_label')}</div>
          <div className="text-sm text-[var(--sea-ink)]">{t(info.meaningKey)}</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-[var(--sea-ink-soft)] mb-1">{t('learn.diagram_explanation_label')}</div>
          <div className="text-sm text-[var(--sea-ink)]">{t(info.descriptionKey)}</div>
        </div>
      </div>
    </div>
  )
}
