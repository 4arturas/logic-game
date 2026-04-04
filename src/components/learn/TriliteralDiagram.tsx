import { useState, useCallback } from 'react'

export type CellState = 'empty' | 'occupied' | null

interface TriliteralDiagramProps {
  xLabel?: string
  yLabel?: string
  mLabel?: string
  onStateChange?: (state: Record<string, CellState>) => void
  initialState?: Record<string, CellState>
  readOnly?: boolean
  showLabels?: boolean
}

// Carroll's notation for triliteral diagram:
// TOP=x, BOTTOM=x', LEFT=y, RIGHT=y', INSIDE CIRCLE=m, OUTSIDE CIRCLE=m'
// 8 cells total (4 inside m circle, 4 outside m circle)
// m counters are inside the circle, m' counters are near the square corners
const OUTER_CELLS = [
  { id: '1', x: 15, y: 15, w: 85, h: 85, cx: 25, cy: 25, label: "xym'" },      // top-left, near corner
  { id: '2', x: 100, y: 15, w: 85, h: 85, cx: 175, cy: 25, label: "xy'm'" },    // top-right, near corner
  { id: '3', x: 15, y: 100, w: 85, h: 85, cx: 25, cy: 175, label: "x'ym'" },    // bottom-left, near corner
  { id: '4', x: 100, y: 100, w: 85, h: 85, cx: 175, cy: 175, label: "x'y'm'" }, // bottom-right, near corner
]

const INNER_CELLS = [
  { id: '5', x: 35, y: 35, w: 65, h: 65, cx: 75, cy: 75, label: "xym" },       // top-left, inside circle
  { id: '6', x: 100, y: 35, w: 65, h: 65, cx: 125, cy: 75, label: "xy'm" },    // top-right, inside circle
  { id: '7', x: 35, y: 100, w: 65, h: 65, cx: 75, cy: 125, label: "x'ym" },    // bottom-left, inside circle
  { id: '8', x: 100, y: 100, w: 65, h: 65, cx: 125, cy: 125, label: "x'y'm" }, // bottom-right, inside circle
]

export function TriliteralDiagram({
  xLabel = "x",
  yLabel = "y",
  mLabel = "m",
  onStateChange,
  initialState = {},
  readOnly = false,
  showLabels = true,
}: TriliteralDiagramProps) {
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

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={200}
        height={200}
        viewBox="0 0 200 200"
        className="select-none"
      >
        {/* Outer rectangle */}
        <rect x={5} y={5} width={190} height={190} fill="none" stroke="currentColor" strokeWidth={2} className="text-[var(--line)]" />
        
        {/* Horizontal divider (x top / x' bottom) */}
        <line x1={5} y1={100} x2={195} y2={100} stroke="currentColor" strokeWidth={1.5} className="text-[var(--line)]" />
        
        {/* Vertical divider (y left / y' right) */}
        <line x1={100} y1={5} x2={100} y2={195} stroke="currentColor" strokeWidth={1.5} className="text-[var(--line)]" />

        {/* m circle - represents middle term */}
        <circle cx={100} cy={100} r={65} fill="none" stroke="currentColor" strokeWidth={2} strokeDasharray="4 2" className="text-[var(--lagoon)]" />

        {/* Clickable cell areas - outer cells */}
        {OUTER_CELLS.map(cell => (
          <rect
            key={cell.id}
            x={cell.x}
            y={cell.y}
            width={cell.w}
            height={cell.h}
            fill="transparent"
            className={!readOnly ? 'cursor-pointer' : ''}
            onClick={() => handleCellClick(cell.id)}
          />
        ))}

        {/* Clickable cell areas - inner cells */}
        {INNER_CELLS.map(cell => (
          <rect
            key={cell.id}
            x={cell.x}
            y={cell.y}
            width={cell.w}
            height={cell.h}
            fill="transparent"
            className={!readOnly ? 'cursor-pointer' : ''}
            onClick={() => handleCellClick(cell.id)}
          />
        ))}

        {/* Counters for outer cells (outside m circle) */}
        {OUTER_CELLS.map(({ id, cx, cy }) => renderCounter(id, cx, cy))}

        {/* Counters for inner cells (inside m circle) */}
        {INNER_CELLS.map(({ id, cx, cy }) => renderCounter(id, cx, cy))}

        {/* Labels - matching Carroll's notation */}
        {showLabels && (
          <>
            {/* X labels - TOP = x, BOTTOM = x' */}
            <text x={100} y={22} textAnchor="middle" style={{ fontSize: '13px', fontWeight: 700, fill: 'var(--lagoon)' }}>
              {xLabel}
            </text>
            <text x={100} y={188} textAnchor="middle" style={{ fontSize: '13px', fontWeight: 700, fill: 'var(--sea-ink-soft)' }}>
              {xLabel}'
            </text>

            {/* Y labels - LEFT = y, RIGHT = y' */}
            <text x={22} y={100} textAnchor="middle" style={{ fontSize: '13px', fontWeight: 700, fill: 'var(--lagoon)' }} transform="rotate(-90 22 100)">
              {yLabel}
            </text>
            <text x={178} y={100} textAnchor="middle" style={{ fontSize: '13px', fontWeight: 700, fill: 'var(--sea-ink-soft)' }} transform="rotate(90 178 100)">
              {yLabel}'
            </text>

            {/* M labels - m inside circle (center), m' near each corner */}
            {/* Big "m" in the center of the circle */}
            <text x={100} y={105} textAnchor="middle" className="fill-[var(--palm)]" style={{ fontSize: '18px', fontWeight: 800, opacity: 0.5 }}>
              {mLabel}
            </text>
            {/* m' labels near each corner */}
            <text x={18} y={18} className="fill-[var(--sea-ink-soft)]" style={{ fontSize: '11px', fontWeight: 700 }}>
              m'
            </text>
            <text x={178} y={18} className="fill-[var(--sea-ink-soft)]" style={{ fontSize: '11px', fontWeight: 700 }}>
              m'
            </text>
            <text x={18} y={190} className="fill-[var(--sea-ink-soft)]" style={{ fontSize: '11px', fontWeight: 700 }}>
              m'
            </text>
            <text x={178} y={190} className="fill-[var(--sea-ink-soft)]" style={{ fontSize: '11px', fontWeight: 700 }}>
              m'
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
          <span className="text-[var(--sea-ink-soft)]">Some exist</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-500 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-0.5 bg-gray-500 rotate-45" />
            </div>
          </div>
          <span className="text-[var(--sea-ink-soft)]">None (empty)</span>
        </div>
      </div>
    </div>
  )
}
