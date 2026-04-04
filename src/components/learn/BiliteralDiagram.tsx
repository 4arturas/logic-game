import { useState, useCallback } from 'react'

export type CellState = 'empty' | 'occupied' | null

interface BiliteralDiagramProps {
  xLabel?: string
  yLabel?: string
  onStateChange?: (state: Record<string, CellState>) => void
  initialState?: Record<string, CellState>
  readOnly?: boolean
  showLabels?: boolean
}

const CELL_POSITIONS = {
  topLeft: { cx: 75, cy: 75, label: "x'y'" },
  topRight: { cx: 125, cy: 75, label: "xy'" },
  bottomLeft: { cx: 75, cy: 125, label: "x'y" },
  bottomRight: { cx: 125, cy: 125, label: "xy" },
}

export function BiliteralDiagram({
  xLabel = "x",
  yLabel = "y",
  onStateChange,
  initialState = {},
  readOnly = false,
  showLabels = true,
}: BiliteralDiagramProps) {
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
        
        {/* Horizontal divider */}
        <line x1={10} y1={100} x2={190} y2={100} stroke="currentColor" strokeWidth={1.5} className="text-[var(--line)]" />
        
        {/* Vertical divider */}
        <line x1={100} y1={10} x2={100} y2={190} stroke="currentColor" strokeWidth={1.5} className="text-[var(--line)]" />

        {/* Cell backgrounds */}
        {Object.entries(CELL_POSITIONS).map(([id, pos]) => (
          <rect
            key={id}
            x={id.includes('Left') ? 10 : 100}
            y={id.includes('top') ? 10 : 100}
            width={90}
            height={90}
            fill="transparent"
            className={!readOnly ? 'cursor-pointer hover:fill-[var(--foam)]' : ''}
            onClick={() => handleCellClick(id)}
          />
        ))}

        {/* Counters */}
        {Object.entries(CELL_POSITIONS).map(([id, pos]) => 
          renderCounter(id, pos.cx, pos.cy)
        )}

        {/* Labels */}
        {showLabels && (
          <>
            {/* X label */}
            <text x={145} y={30} className="text-xs font-bold fill-[var(--lagoon)]" style={{ fontSize: '14px', fontWeight: 700 }}>
              {xLabel}
            </text>
            <text x={55} y={30} className="text-xs font-bold fill-[var(--sea-ink-soft)]" style={{ fontSize: '14px', fontWeight: 700 }}>
              {xLabel}'
            </text>
            
            {/* Y label */}
            <text x={170} y={145} className="text-xs font-bold fill-[var(--lagoon)]" style={{ fontSize: '14px', fontWeight: 700 }}>
              {yLabel}
            </text>
            <text x={170} y={75} className="text-xs font-bold fill-[var(--sea-ink-soft)]" style={{ fontSize: '14px', fontWeight: 700 }}>
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
