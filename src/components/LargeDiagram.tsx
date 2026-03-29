
export interface DiagramState {
  [id: string]: 'red' | 'grey' | null
}

interface LargeDiagramProps {
  state: DiagramState
  onCellClick?: (id: string) => void
  minorTerm: string
  majorTerm: string
  middleTerm: string
  t: (key: any) => string
  isReadOnly?: boolean
}

export function LargeDiagram({
  state,
  onCellClick,
  minorTerm,
  majorTerm,
  middleTerm,
  t,
  isReadOnly = false,
}: LargeDiagramProps) {
  const largeCells = [
    { id: 'lg_9',  x: 10, y: 10, w: 95, h: 95, cx: 57,  cy: 57 },
    { id: 'lg_10', x: 295, y: 10, w: 95, h: 95, cx: 343, cy: 57 },
    { id: 'lg_11', x: 105, y: 105, w: 95, h: 95, cx: 152, cy: 152 },
    { id: 'lg_12', x: 200, y: 105, w: 95, h: 95, cx: 247, cy: 152 },
    { id: 'lg_13', x: 105, y: 200, w: 95, h: 95, cx: 152, cy: 247 },
    { id: 'lg_14', x: 200, y: 200, w: 95, h: 95, cx: 247, cy: 247 },
    { id: 'lg_15', x: 10, y: 295, w: 95, h: 95, cx: 57,  cy: 343 },
    { id: 'lg_16', x: 295, y: 295, w: 95, h: 95, cx: 343, cy: 343 },
  ]

  const renderCounters = () => {
    return Object.entries(state).map(([id, st]) => {
      const cell = largeCells.find(c => c.id === id)
      if (!cell || !st) return null
      const radius = 12
      const fill = st === 'red' ? '#dc2626' : '#6b7280'
      return (
        <g key={id} className="pointer-events-none select-none">
          <circle cx={cell.cx} cy={cell.cy} r={radius} fill={fill} stroke="rgba(0,0,0,0.5)" strokeWidth="2" />
          <text x={cell.cx} y={cell.cy + radius / 3} textAnchor="middle" fill="white" className="font-bold" style={{ fontSize: '10px' }}>
            {st === 'red' ? '1' : '0'}
          </text>
        </g>
      )
    })
  }

  return (
    <div className="bg-[var(--surface)] p-6 rounded-2xl shadow-xl w-full flex flex-col items-center border border-[var(--chip-line)] overflow-hidden">
      <svg width="320" height="320" viewBox="0 0 400 400" className="select-none mx-auto">
        <rect x="10" y="10" width="380" height="380" fill="none" stroke="black" strokeWidth="2" />
        <rect x="105" y="105" width="190" height="190" fill="none" stroke="black" strokeWidth="1.5" />
        <line x1="10" y1="200" x2="390" y2="200" stroke="black" strokeWidth="1.5" />
        <line x1="200" y1="10" x2="200" y2="390" stroke="black" strokeWidth="1.5" />
        
        {/* Cell numbers */}
        <text x="13" y="21" className="text-[11px] font-bold select-none pointer-events-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>9</text>
        <text x="387" y="21" textAnchor="end" className="text-[11px] font-bold select-none pointer-events-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>10</text>
        <text x="108" y="117" className="text-[11px] font-bold select-none pointer-events-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>11</text>
        <text x="292" y="117" textAnchor="end" className="text-[11px] font-bold select-none pointer-events-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>12</text>
        <text x="108" y="292" className="text-[11px] font-bold select-none pointer-events-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>13</text>
        <text x="292" y="292" textAnchor="end" className="text-[11px] font-bold select-none pointer-events-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>14</text>
        <text x="13" y="387" className="text-[11px] font-bold select-none pointer-events-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>15</text>
        <text x="387" y="387" textAnchor="end" className="text-[11px] font-bold select-none pointer-events-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>16</text>
        
        {/* Labels */}
        <text x="200" y="85" textAnchor="middle" className="italic text-3xl font-serif font-bold pointer-events-none" fill="var(--term-x)">{t(minorTerm as any)}</text>
        <text x="200" y="335" textAnchor="middle" className="italic text-3xl font-serif font-bold pointer-events-none" fill="var(--term-x)">{t(minorTerm as any)}'</text>
        <text x="50" y="210" textAnchor="middle" className="italic text-3xl font-serif font-bold pointer-events-none" fill="var(--term-y)" transform="rotate(-90 50 210)">{t(majorTerm as any)}</text>
        <text x="350" y="210" textAnchor="middle" className="italic text-3xl font-serif font-bold pointer-events-none" fill="var(--term-y)" transform="rotate(-90 350 210)">{t(majorTerm as any)}'</text>
        <text x="200" y="210" textAnchor="middle" className="italic text-2xl font-serif font-bold pointer-events-none" fill="var(--term-m)">{t(middleTerm as any)}</text>
        
        {!isReadOnly && largeCells.map(c => (
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
