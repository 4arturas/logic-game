import { useState, useCallback } from 'react'
import { useTranslation } from '../../i18n/I18nContext'

export type CellState = 'empty' | 'occupied' | null

interface BiliteralDiagramProps {
  xLabel?: string
  yLabel?: string
  onStateChange?: (state: Record<string, CellState>) => void
  initialState?: Record<string, CellState>
  readOnly?: boolean
  showLabels?: boolean
}

// Carroll's notation: TOP=x, BOTTOM=x', LEFT=y, RIGHT=y'
// Four cells: xy (top-left), xy' (top-right), x'y (bottom-left), x'y' (bottom-right)
// Cell centers: each cell is 90x90, starting at (10,10)
// Using MD cell IDs: 5=xy, 6=xy', 7=x'y, 8=x'y'
const CELL_POSITIONS = [
  { key: 'topLeft', id: 'c5', cx: 55, cy: 55, label: "xy", x: 10, y: 10 },
  { key: 'topRight', id: 'c6', cx: 145, cy: 55, label: "xy'", x: 100, y: 10 },
  { key: 'bottomLeft', id: 'c7', cx: 55, cy: 145, label: "x'y", x: 10, y: 100 },
  { key: 'bottomRight', id: 'c8', cx: 145, cy: 145, label: "x'y'", x: 100, y: 100 },
] as const

export function BiliteralDiagram({
  xLabel = "x",
  yLabel = "y",
  onStateChange,
  initialState = {},
  readOnly = false,
  showLabels = true,
}: BiliteralDiagramProps) {
  const { t } = useTranslation()
  const [cellStates, setCellStates] = useState<Record<string, CellState>>(initialState)

  const handleCellClick = useCallback((cellId: string) => {
    if (readOnly) return
    
    setCellStates(prev => {
      const current = prev[cellId] || null
      const next = current === null ? 'occupied' : current === 'occupied' ? 'empty' : null
      const newState = { ...prev }
      if (next) newState[cellId] = next
      else delete newState[cellId]
      onStateChange?.(newState)
      return newState
    })
  }, [readOnly, onStateChange])

  const handleCounterClick = useCallback((e: React.MouseEvent, cellId: string) => {
    e.stopPropagation()
    if (readOnly) return
    
    setCellStates(prev => {
      const current = prev[cellId] || null
      const next = current === null ? 'occupied' : current === 'occupied' ? 'empty' : null
      const newState = { ...prev }
      if (next) newState[cellId] = next
      else delete newState[cellId]
      onStateChange?.(newState)
      return newState
    })
  }, [readOnly, onStateChange])

  const renderCounter = (cellId: string, cx: number, cy: number) => {
    const state = cellStates[cellId]
    if (!state) return null

    const color = state === 'occupied' ? '#ef4444' : '#6b7280'
    const fillColor = state === 'occupied' ? '#fecaca' : '#e5e7eb'

    return (
      <g
        onClick={(e) => handleCounterClick(e, cellId)}
        className="cursor-pointer"
      >
        <circle cx={cx} cy={cy} r={18} fill={fillColor} stroke={color} strokeWidth={2} />
        <circle cx={cx} cy={cy} r={12} fill={color} opacity={0.3} />
        {state === 'empty' && (
          <>
            <line x1={cx - 8} y1={cy - 8} x2={cx + 8} y2={cy + 8} stroke={color} strokeWidth={2} />
            <line x1={cx + 8} y1={cy - 8} x2={cx - 8} y2={cy + 8} stroke={color} strokeWidth={2} />
          </>
        )}
        {state === 'occupied' && (
          <circle cx={cx} cy={cy} r={5} fill={color} />
        )}
      </g>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={200}
        height={200}
        viewBox="0 0 200 200"
        className="select-none"
      >
        {/* Outer rectangle */}
        <rect x={10} y={10} width={180} height={180} fill="none" stroke="currentColor" strokeWidth={2} className="text-[var(--line)]" />
        
        {/* Horizontal divider (x top / x' bottom) */}
        <line x1={10} y1={100} x2={190} y2={100} stroke="currentColor" strokeWidth={1.5} className="text-[var(--line)]" />
        
        {/* Vertical divider (y left / y' right) */}
        <line x1={100} y1={10} x2={100} y2={190} stroke="currentColor" strokeWidth={1.5} className="text-[var(--line)]" />

        {/* Cell backgrounds */}
        {CELL_POSITIONS.map(cell => (
          <rect
            key={cell.key}
            x={cell.x}
            y={cell.y}
            width={90}
            height={90}
            fill="transparent"
            className={!readOnly ? 'cursor-pointer hover:fill-[var(--foam)]' : ''}
            onClick={() => handleCellClick(cell.id)}
          />
        ))}

        {/* Counters */}
        {CELL_POSITIONS.map(cell =>
          renderCounter(cell.id, cell.cx, cell.cy)
        )}

        {/* Cell number labels - at far corners of each cell */}
        <g style={{ fontSize: '9px', fontWeight: 700, fill: 'var(--sea-ink-soft)', opacity: 0.5 }}>
          <text x={12} y={18} textAnchor="start">5</text>
          <text x={188} y={18} textAnchor="end">6</text>
          <text x={12} y={194} textAnchor="start">7</text>
          <text x={188} y={194} textAnchor="end">8</text>
        </g>

        {/* Labels - matching Carroll's notation */}
        {showLabels && (
          <>
            {/* X labels - TOP = x, BOTTOM = x' */}
            <text x={100} y={25} textAnchor="middle" style={{ fontSize: '15px', fontWeight: 800, fill: 'var(--term-x)' }}>
              {xLabel}
            </text>
            <text x={100} y={188} textAnchor="middle" style={{ fontSize: '15px', fontWeight: 800, fill: 'var(--term-x)', opacity: 0.6 }}>
              {xLabel}'
            </text>

            {/* Y labels - LEFT = y, RIGHT = y' */}
            <text x={25} y={100} textAnchor="middle" style={{ fontSize: '15px', fontWeight: 800, fill: 'var(--term-y)' }} transform="rotate(-90 25 100)">
              {yLabel}
            </text>
            <text x={175} y={100} textAnchor="middle" style={{ fontSize: '15px', fontWeight: 800, fill: 'var(--term-y)', opacity: 0.6 }} transform="rotate(90 175 100)">
              {yLabel}'
            </text>
          </>
        )}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-red-200 border border-red-500 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            </div>
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
          <span className="text-[var(--sea-ink-soft)]">{t('None (empty)')}</span>
        </div>
      </div>
    </div>
  )
}
