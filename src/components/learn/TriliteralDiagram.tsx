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

// Carroll's triliteral diagram: 8 cells
// Outer square divided by x/y axes, with m as inner circle
const CELLS = [
  { id: 1, x: 20, y: 20, w: 80, h: 80, cx: 60, cy: 60, label: "x'y'm'" },
  { id: 2, x: 100, y: 20, w: 80, h: 80, cx: 140, cy: 60, label: "xym'" },
  { id: 3, x: 20, y: 100, w: 80, h: 80, cx: 60, cy: 140, label: "x'ym'" },
  { id: 4, x: 100, y: 100, w: 80, h: 80, cx: 140, cy: 140, label: "xym'" },
  { id: 5, x: 40, y: 40, w: 60, h: 60, cx: 70, cy: 70, label: "x'y'm" },
  { id: 6, x: 100, y: 40, w: 60, h: 60, cx: 130, cy: 70, label: "xym" },
  { id: 7, x: 40, y: 100, w: 60, h: 60, cx: 70, cy: 130, label: "x'ym" },
  { id: 8, x: 100, y: 100, w: 60, h: 60, cx: 130, cy: 130, label: "xym" },
]

// Inner cell positions for the m circle
const INNER_CELLS = [
  { id: 5, cx: 70, cy: 70 },  // x'y'm (top-left of inner)
  { id: 6, cx: 130, cy: 70 }, // xym (top-right of inner)
  { id: 7, cx: 70, cy: 130 }, // x'ym (bottom-left of inner)
  { id: 8, cx: 130, cy: 130 },// xym (bottom-right of inner)
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
        
        {/* Horizontal divider (x axis) */}
        <line x1={5} y1={100} x2={195} y2={100} stroke="currentColor" strokeWidth={1.5} className="text-[var(--line)]" />
        
        {/* Vertical divider (y axis) */}
        <line x1={100} y1={5} x2={100} y2={195} stroke="currentColor" strokeWidth={1.5} className="text-[var(--line)]" />

        {/* m circle - represents middle term */}
        <circle cx={100} cy={100} r={65} fill="none" stroke="currentColor" strokeWidth={2} strokeDasharray="4 2" className="text-[var(--lagoon)]" />

        {/* Clickable cell areas */}
        {CELLS.map(cell => (
          <rect
            key={cell.id}
            x={cell.x}
            y={cell.y}
            width={cell.w}
            height={cell.h}
            fill="transparent"
            className={!readOnly ? 'cursor-pointer hover:fill-[var(--foam)]' : ''}
            onClick={() => handleCellClick(cell.id.toString())}
          />
        ))}

        {/* Counters for outer cells (outside m circle) */}
        {[
          { id: '1', cx: 45, cy: 45 },  // x'y'm'
          { id: '2', cx: 155, cy: 45 }, // xym'
          { id: '3', cx: 45, cy: 155 }, // x'ym'
          { id: '4', cx: 155, cy: 155 },// xym'
        ].map(({ id, cx, cy }) => renderCounter(id, cx, cy))}

        {/* Counters for inner cells (inside m circle) */}
        {[
          { id: '5', cx: 70, cy: 70 },  // x'y'm
          { id: '6', cx: 130, cy: 70 }, // xym
          { id: '7', cx: 70, cy: 130 }, // x'ym
          { id: '8', cx: 130, cy: 130 },// xym
        ].map(({ id, cx, cy }) => renderCounter(id, cx, cy))}

        {/* Labels */}
        {showLabels && (
          <>
            {/* X labels */}
            <text x={145} y={25} className="fill-[var(--lagoon)]" style={{ fontSize: '13px', fontWeight: 700 }}>
              {xLabel}
            </text>
            <text x={55} y={25} className="fill-[var(--sea-ink-soft)]" style={{ fontSize: '13px', fontWeight: 700 }}>
              {xLabel}'
            </text>
            
            {/* Y labels */}
            <text x={175} y={145} className="fill-[var(--lagoon)]" style={{ fontSize: '13px', fontWeight: 700 }}>
              {yLabel}
            </text>
            <text x={175} y={65} className="fill-[var(--sea-ink-soft)]" style={{ fontSize: '13px', fontWeight: 700 }}>
              {yLabel}'
            </text>

            {/* M label */}
            <text x={155} y={95} className="fill-[var(--palm)]" style={{ fontSize: '12px', fontWeight: 700 }}>
              {mLabel}
            </text>
            <text x={155} y={115} className="fill-[var(--palm)]" style={{ fontSize: '12px', fontWeight: 700 }}>
              {mLabel}'
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
