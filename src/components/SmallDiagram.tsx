
export interface DiagramState {
  [id: string]: 'red' | 'grey' | null
}

interface SmallDiagramProps {
  state: DiagramState
  onCellClick?: (id: string) => void
  minorTerm: string
  majorTerm: string
  t: (key: any) => string
  isReadOnly?: boolean
}

export function SmallDiagram({
  state,
  onCellClick,
  minorTerm,
  majorTerm,
  t,
  isReadOnly = false,
}: SmallDiagramProps) {
  const smallCells = [
    { id: 'c5', cx: 65, cy: 65, x: 5, y: 5, w: 120, h: 120 },
    { id: 'c6', cx: 185, cy: 65, x: 125, y: 5, w: 120, h: 120 },
    { id: 'c7', cx: 65, cy: 185, x: 5, y: 125, w: 120, h: 120 },
    { id: 'c8', cx: 185, cy: 185, x: 125, y: 125, w: 120, h: 120 },
  ]

  const renderCounters = () => {
    return Object.entries(state).map(([id, st]) => {
      const cell = smallCells.find(c => c.id === id)
      if (!cell || !st) return null
      const radius = 16
      const fill = st === 'red' ? '#dc2626' : '#6b7280'
      return (
        <g key={id} className="pointer-events-none select-none">
          <circle cx={cell.cx} cy={cell.cy} r={radius} fill={fill} stroke="rgba(0,0,0,0.5)" strokeWidth="2" />
          <text x={cell.cx} y={cell.cy + radius / 3} textAnchor="middle" fill="white" className="font-bold" style={{ fontSize: '12px' }}>
            {st === 'red' ? '1' : '0'}
          </text>
        </g>
      )
    })
  }

  return (
    <div className="bg-[var(--surface)] p-6 rounded-2xl shadow-xl w-full flex flex-col items-center border border-[var(--chip-line)] overflow-hidden">
      <svg width="280" height="280" viewBox="0 0 250 250" className="select-none mx-auto">
        <rect x="5" y="5" width="240" height="240" fill="none" stroke="black" strokeWidth="2" />
        <line x1="5" y1="125" x2="245" y2="125" stroke="black" strokeWidth="1.5" />
        <line x1="125" y1="5" x2="125" y2="245" stroke="black" strokeWidth="1.5" />
        
        {/* Cell numbers */}
        <text x="8" y="17" className="text-[11px] font-bold select-none pointer-events-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>5</text>
        <text x="242" y="17" textAnchor="end" className="text-[11px] font-bold select-none pointer-events-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>6</text>
        <text x="8" y="243" className="text-[11px] font-bold select-none pointer-events-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>7</text>
        <text x="242" y="243" textAnchor="end" className="text-[11px] font-bold select-none pointer-events-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>8</text>
        
        {/* Labels */}
        <text x="125" y="55" textAnchor="middle" className="italic text-2xl font-serif font-bold pointer-events-none" fill="var(--term-x)">{t(minorTerm as any)}</text>
        <text x="125" y="205" textAnchor="middle" className="italic text-2xl font-serif font-bold pointer-events-none" fill="var(--term-x)">{t(minorTerm as any)}'</text>
        <text x="35" y="135" textAnchor="middle" className="italic text-2xl font-serif font-bold pointer-events-none" fill="var(--term-y)" transform="rotate(-90 35 135)">{t(majorTerm as any)}</text>
        <text x="215" y="135" textAnchor="middle" className="italic text-2xl font-serif font-bold pointer-events-none" fill="var(--term-y)" transform="rotate(-90 215 135)">{t(majorTerm as any)}'</text>
        
        {!isReadOnly && smallCells.map(c => (
          <rect
            key={c.id}
            x={c.x}
            y={c.y}
            width={c.w}
            height={c.h}
            fill="transparent"
            className="cursor-pointer hover:fill-black/5"
            onClick={() => onCellClick?.(c.id)}
          />
        ))}
        <g>{renderCounters()}</g>
      </svg>
    </div>
  )
}
