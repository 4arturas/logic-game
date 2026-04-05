import { useState, useCallback } from 'react'
import { useTranslation } from '../../i18n/I18nContext'

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
// Using DD cell IDs: 9=xym', 10=xy'm', 11=xym, 12=xy'm, 13=x'ym, 14=x'y'm, 15=x'ym', 16=x'y'm'
const OUTER_CELLS = [
  { id: 'lg_9', x: 15, y: 15, w: 85, h: 85, cx: 25, cy: 25, label: "xym'" },      // top-left, m'
  { id: 'lg_10', x: 100, y: 15, w: 85, h: 85, cx: 175, cy: 25, label: "xy'm'" },    // top-right, m'
  { id: 'lg_15', x: 15, y: 100, w: 85, h: 85, cx: 25, cy: 175, label: "x'ym'" },    // bottom-left, m'
  { id: 'lg_16', x: 100, y: 100, w: 85, h: 85, cx: 175, cy: 175, label: "x'y'm'" }, // bottom-right, m'
]

const INNER_CELLS = [
  { id: 'lg_11', x: 35, y: 35, w: 65, h: 65, cx: 75, cy: 75, label: "xym" },       // top-left, m
  { id: 'lg_12', x: 100, y: 35, w: 65, h: 65, cx: 125, cy: 75, label: "xy'm" },    // top-right, m
  { id: 'lg_13', x: 35, y: 100, w: 65, h: 65, cx: 75, cy: 125, label: "x'ym" },    // bottom-left, m
  { id: 'lg_14', x: 100, y: 100, w: 65, h: 65, cx: 125, cy: 125, label: "x'y'm" }, // bottom-right, m
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

        {/* Cell number labels - near circle border at 45° angles */}
        <g style={{ fontSize: '9px', fontWeight: 700, fill: 'var(--sea-ink-soft)', opacity: 0.5 }}>
          {/* Outer cells (m') - just outside circle border */}
          <text x={49} y={52} textAnchor="middle">9</text>
          <text x={151} y={52} textAnchor="middle">10</text>
          <text x={49} y={154} textAnchor="middle">15</text>
          <text x={151} y={154} textAnchor="middle">16</text>
          {/* Inner cells (m) - just inside circle border */}
          <text x={59} y={62} textAnchor="middle">11</text>
          <text x={141} y={62} textAnchor="middle">12</text>
          <text x={59} y={144} textAnchor="middle">13</text>
          <text x={141} y={144} textAnchor="middle">14</text>
        </g>

        {/* Labels - matching Carroll's notation */}
        {showLabels && (
          <>
            {/* X labels - TOP = x, BOTTOM = x' */}
            <text x={100} y={18} textAnchor="middle" style={{ fontSize: '14px', fontWeight: 800, fill: 'var(--term-x)' }}>
              {xLabel}
            </text>
            <text x={100} y={192} textAnchor="middle" style={{ fontSize: '14px', fontWeight: 800, fill: 'var(--term-x)', opacity: 0.6 }}>
              {xLabel}'
            </text>

            {/* Y labels - LEFT = y, RIGHT = y' */}
            <text x={18} y={100} textAnchor="middle" style={{ fontSize: '14px', fontWeight: 800, fill: 'var(--term-y)' }} transform="rotate(-90 18 100)">
              {yLabel}
            </text>
            <text x={182} y={100} textAnchor="middle" style={{ fontSize: '14px', fontWeight: 800, fill: 'var(--term-y)', opacity: 0.6 }} transform="rotate(90 182 100)">
              {yLabel}'
            </text>

            {/* M labels - m inside circle (center), m' near each corner */}
            {/* Big "m" in the center of the circle */}
            <text x={100} y={105} textAnchor="middle" style={{ fontSize: '16px', fontWeight: 800, fill: 'var(--term-m)', opacity: 0.5 }}>
              {mLabel}
            </text>
            {/* m' labels near each corner */}
            <text x={16} y={16} style={{ fontSize: '11px', fontWeight: 700, fill: 'var(--sea-ink-soft)' }}>
              m'
            </text>
            <text x={180} y={16} style={{ fontSize: '11px', fontWeight: 700, fill: 'var(--sea-ink-soft)' }}>
              m'
            </text>
            <text x={16} y={194} style={{ fontSize: '11px', fontWeight: 700, fill: 'var(--sea-ink-soft)' }}>
              m'
            </text>
            <text x={180} y={194} style={{ fontSize: '11px', fontWeight: 700, fill: 'var(--sea-ink-soft)' }}>
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
