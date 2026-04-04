import { useState, useCallback } from 'react'
import { useTranslation } from '../../i18n/I18nContext'

export type CellState = 'empty' | 'occupied' | null

interface VennDiagramProps {
  type: 'biliteral' | 'triliteral'
  onStateChange?: (state: Record<string, CellState>) => void
  initialState?: Record<string, CellState>
  readOnly?: boolean
}

// Venn diagram uses overlapping circles
// Biliteral: 2 circles (x and y)
// Triliteral: 3 circles (x, y, m)

const VENN_BILITERAL = {
  circleX: { cx: 70, cy: 100, r: 55 },
  circleY: { cx: 130, cy: 100, r: 55 },
  // 4 regions
  regions: [
    { id: 'not_x_not_y', label: "¬x ∧ ¬y", cx: 30, cy: 30 },    // outside both
    { id: 'x_not_y', label: "x ∧ ¬y", cx: 55, cy: 100 },        // x only
    { id: 'not_x_y', label: "¬x ∧ y", cx: 145, cy: 100 },       // y only
    { id: 'x_and_y', label: "x ∧ y", cx: 100, cy: 100 },        // intersection
  ]
}

const VENN_TRILITERAL = {
  circleX: { cx: 100, cy: 70, r: 50 },
  circleY: { cx: 70, cy: 130, r: 50 },
  circleM: { cx: 130, cy: 130, r: 50 },
}

export function VennDiagram({
  type,
  onStateChange,
  initialState = {},
  readOnly = false,
}: VennDiagramProps) {
  const { t } = useTranslation()
  const [cellStates, setCellStates] = useState<Record<string, CellState>>(initialState)

  const handleRegionClick = useCallback((regionId: string) => {
    if (readOnly) return
    
    setCellStates(prev => {
      const current = prev[regionId] || null
      const next = current === null ? 'occupied' : current === 'occupied' ? 'empty' : null
      const newState = { ...prev }
      if (next) newState[regionId] = next
      else delete newState[regionId]
      onStateChange?.(newState)
      return newState
    })
  }, [readOnly, onStateChange])

  const renderCounter = (cx: number, cy: number, state: CellState, regionId: string) => {
    if (!state) return null

    const color = state === 'occupied' ? '#ef4444' : '#6b7280'
    const fillColor = state === 'occupied' ? '#fecaca' : '#e5e7eb'

    return (
      <g
        onClick={(e) => { e.stopPropagation(); handleRegionClick(regionId) }}
        className="cursor-pointer"
      >
        <circle cx={cx} cy={cy} r={16} fill={fillColor} stroke={color} strokeWidth={2} />
        <circle cx={cx} cy={cy} r={10} fill={color} opacity={0.3} />
        {state === 'empty' && (
          <>
            <line x1={cx - 7} y1={cy - 7} x2={cx + 7} y2={cy + 7} stroke={color} strokeWidth={2} />
            <line x1={cx + 7} y1={cy - 7} x2={cx - 7} y2={cy + 7} stroke={color} strokeWidth={2} />
          </>
        )}
        {state === 'occupied' && (
          <circle cx={cx} cy={cy} r={4} fill={color} />
        )}
      </g>
    )
  }

  if (type === 'biliteral') {
    return (
      <div className="flex flex-col items-center gap-4">
        <svg width={200} height={200} viewBox="0 0 200 200" className="select-none">
          {/* Universe rectangle */}
          <rect x={5} y={5} width={190} height={190} fill="none" stroke="currentColor" strokeWidth={1.5} className="text-[var(--line)]" />
          
          {/* Circle x */}
          <circle cx={70} cy={100} r={55} fill="rgba(29,78,216,0.08)" stroke="var(--term-x)" strokeWidth={2} />
          <text x={45} y={95} className="font-bold" style={{ fontSize: '14px', fontWeight: 700, fill: 'var(--term-x)' }}>x</text>
          
          {/* Circle y */}
          <circle cx={130} cy={100} r={55} fill="rgba(29,78,216,0.08)" stroke="var(--term-y)" strokeWidth={2} />
          <text x={165} y={95} className="font-bold" style={{ fontSize: '14px', fontWeight: 700, fill: 'var(--term-y)' }}>y</text>

          {/* Clickable regions */}
          {/* x ∩ y (intersection) */}
          <ellipse cx={100} cy={100} rx={20} ry={35} fill="transparent"
            className={!readOnly ? 'cursor-pointer' : ''}
            onClick={() => handleRegionClick('x_and_y')} />
          
          {/* x only */}
          <ellipse cx={55} cy={100} rx={20} ry={35} fill="transparent"
            className={!readOnly ? 'cursor-pointer' : ''}
            onClick={() => handleRegionClick('x_not_y')} />
          
          {/* y only */}
          <ellipse cx={145} cy={100} rx={20} ry={35} fill="transparent"
            className={!readOnly ? 'cursor-pointer' : ''}
            onClick={() => handleRegionClick('not_x_y')} />
          
          {/* Outside both */}
          <rect x={5} y={5} width={190} height={190} fill="transparent"
            className={!readOnly ? 'cursor-pointer' : ''}
            onClick={() => handleRegionClick('not_x_not_y')} />

          {/* Counters */}
          {Object.entries(cellStates).map(([id, state]) => {
            const region = VENN_BILITERAL.regions.find(r => r.id === id)
            if (!region) return null
            return renderCounter(region.cx, region.cy, state, id)
          })}
        </svg>

        <div className="text-xs text-center text-[var(--sea-ink-soft)]">
          {t('Two-circle Venn diagram — click regions to place counters')}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-red-200 border border-red-500 relative">
              <div className="absolute inset-0 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /></div>
            </div>
            <span className="text-[var(--sea-ink-soft)]">{t('Some exist')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-500 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-0.5 bg-gray-500 rotate-45 absolute" />
                <div className="w-3 h-0.5 bg-gray-500 -rotate-45 absolute" />
              </div>
            </div>
            <span className="text-[var(--sea-ink-soft)]">{t('Empty')}</span>
          </div>
        </div>
      </div>
    )
  }

  // Triliteral Venn (3 circles)
  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={200} height={200} viewBox="0 0 200 200" className="select-none">
        {/* Universe rectangle */}
        <rect x={5} y={5} width={190} height={190} fill="none" stroke="currentColor" strokeWidth={1.5} className="text-[var(--line)]" />
        
        {/* Circle x (top) */}
        <circle cx={100} cy={70} r={50} fill="rgba(29,78,216,0.06)" stroke="var(--term-x)" strokeWidth={2} />
        <text x={100} y={35} textAnchor="middle" className="font-bold" style={{ fontSize: '13px', fontWeight: 700, fill: 'var(--term-x)' }}>x</text>
        
        {/* Circle y (bottom-left) */}
        <circle cx={70} cy={130} r={50} fill="rgba(29,78,216,0.06)" stroke="var(--term-y)" strokeWidth={2} />
        <text x={35} y={160} className="font-bold" style={{ fontSize: '13px', fontWeight: 700, fill: 'var(--term-y)' }}>y</text>
        
        {/* Circle m (bottom-right) */}
        <circle cx={130} cy={130} r={50} fill="rgba(29,78,216,0.06)" stroke="var(--palm)" strokeWidth={2} strokeDasharray="4 2" />
        <text x={165} y={160} className="font-bold" style={{ fontSize: '13px', fontWeight: 700, fill: 'var(--palm)' }}>m</text>
      </svg>

      <div className="text-xs text-center text-[var(--sea-ink-soft)]">
        {t('Three-circle Venn diagram — shows 8 regions')}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-red-200 border border-red-500 relative">
            <div className="absolute inset-0 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /></div>
          </div>
          <span className="text-[var(--sea-ink-soft)]">{t('Some exist')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-500 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-0.5 bg-gray-500 rotate-45 absolute" />
              <div className="w-3 h-0.5 bg-gray-500 -rotate-45 absolute" />
            </div>
          </div>
          <span className="text-[var(--sea-ink-soft)]">{t('Empty')}</span>
        </div>
      </div>
    </div>
  )
}
