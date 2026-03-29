import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from '../i18n/I18nContext'
import { type DiagramState, type Terms } from '../contexts/DiagramContext'
import { CopyCode } from '../components/CopyCode'
import { HelpModal } from '../components/HelpModal'

export const Route = createFileRoute('/')({
  component: App,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      x: typeof search.x === 'string' ? search.x : undefined,
      y: typeof search.y === 'string' ? search.y : undefined,
      m: typeof search.m === 'string' ? search.m : undefined,
      large: typeof search.large === 'string' ? search.large : undefined,
      small: typeof search.small === 'string' ? search.small : undefined,
    }
  },
})

type CounterState = 'red' | 'grey' | null

interface SearchParams {
  x?: string
  y?: string
  m?: string
  large?: string
  small?: string
}

function App() {
  const search = useSearch({ from: '/' }) as SearchParams
  const { t } = useTranslation()
  const [terms, setTerms] = useState<Terms>({ x: 'raudoni', y: 'prinokę', m: 'sveiki' })
  const [smallState, setSmallState] = useState<DiagramState>({})
  const [largeState, setLargeState] = useState<DiagramState>({})
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    if (search.x && search.y && search.m && !isConfigured) {
      const newTerms: Terms = { x: search.x, y: search.y, m: search.m }
      setTerms(newTerms)

      if (search.large) {
        try {
          const parsed = JSON.parse(search.large) as DiagramState
          setLargeState(parsed)
        } catch (e) {
          console.error('Failed to parse large state:', e)
        }
      }

      if (search.small) {
        try {
          const parsed = JSON.parse(search.small) as DiagramState
          setSmallState(parsed)
        } catch (e) {
          console.error('Failed to parse small state:', e)
        }
      }

      setIsConfigured(true)
    }
  }, [search, isConfigured])

  const updateLabels = useCallback((field: keyof Terms, value: string) => {
    setTerms(prev => ({ ...prev, [field]: value }))
  }, [])

  const getStatusCodes = useCallback(() => {
    const lgNums = [9, 10, 11, 12, 13, 14, 15, 16]
    const ddStr = lgNums
      .map(n => {
        const val = largeState['lg_' + n] === 'red' ? '1' : largeState['lg_' + n] === 'grey' ? '0' : '-'
        return `${n}-${val}`
      })
      .join(',')

    const smNums = [5, 6, 7, 8]
    const mdStr = smNums
      .map(n => {
        const val = smallState['c' + n] === 'red' ? '1' : smallState['c' + n] === 'grey' ? '0' : '-'
        return `${n}-${val}`
      })
      .join(',')

    return { dd: ddStr, md: mdStr }
  }, [smallState, largeState])

  const statusCodes = getStatusCodes()

  const [showHelp, setShowHelp] = useState(false)

  const cycleCounter = useCallback(
    (type: 'small' | 'large', id: string) => {
      const setState = type === 'small' ? setSmallState : setLargeState
      setState(prev => {
        const currentState = prev[id] || null
        let nextState: CounterState
        if (currentState === null) nextState = 'red'
        else if (currentState === 'red') nextState = 'grey'
        else nextState = null

        const newState = { ...prev }
        if (nextState === null) {
          delete newState[id]
        } else {
          newState[id] = nextState
        }
        return newState
      })
    },
    []
  )

  const handleApplyRule = useCallback((cells: number[]) => {
    setLargeState(prev => {
      const newState = { ...prev }
      cells.forEach(id => {
        newState[`lg_${id}`] = 'grey'
      })
      return newState
    })
  }, [])



  const clearTerms = () => {
    setTerms({ x: '', y: '', m: '' })
  }

  const clearBoard = () => {
    setSmallState({})
    setLargeState({})
  }

  const smallCells = [
    { id: 'c5', x: 5, y: 5, w: 120, h: 120, cx: 65, cy: 65 },
    { id: 'c6', x: 125, y: 5, w: 120, h: 120, cx: 185, cy: 65 },
    { id: 'c7', x: 5, y: 125, w: 120, h: 120, cx: 65, cy: 185 },
    { id: 'c8', x: 125, y: 125, w: 120, h: 120, cx: 185, cy: 185 },
  ]

  interface CellInfo {
    id: string
    x: number
    y: number
    w: number
    h: number
    cx: number
    cy: number
  }

  const largeCells: CellInfo[] = []
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      let cellId = ''
      if (row >= 1 && row <= 2 && col >= 1 && col <= 2) {
        if (row === 1) cellId = col === 1 ? 'lg_11' : 'lg_12'
        else cellId = col === 1 ? 'lg_13' : 'lg_14'
      } else {
        if (row < 2) cellId = col < 2 ? 'lg_9' : 'lg_10'
        else cellId = col < 2 ? 'lg_15' : 'lg_16'
      }
      largeCells.push({
        id: cellId,
        x: 10 + col * 95,
        y: 10 + row * 95,
        w: 95,
        h: 95,
        cx: 57 + col * 95,
        cy: 57 + row * 95,
      })
    }
  }

  const renderCounters = (state: DiagramState, type: 'small' | 'large') => {
    return Object.entries(state).map(([id, counterState]) => {
      const cell = type === 'small' ? smallCells.find(c => c.id === id) : largeCells.find(c => c.id === id)
      if (!cell) return null

      const radius = type === 'large' ? 12 : 16
      const fill = counterState === 'red' ? '#dc2626' : '#6b7280'
      const text = counterState === 'red' ? '1' : '0'

      return (
        <g
          key={id}
          className="counter transition-transform duration-100 ease-in-out pointer-events-none select-none"
          style={{ transformOrigin: 'center' }}
        >
          <circle cx={cell.cx} cy={cell.cy} r={radius} fill={fill} stroke="rgba(0,0,0,0.5)" strokeWidth="2" />
          <text
            x={cell.cx}
            y={cell.cy + radius / 3}
            textAnchor="middle"
            fill="white"
            className="font-bold"
            style={{ fontSize: type === 'large' ? '10px' : '12px', fontFamily: 'Arial, sans-serif' }}
          >
            {text}
          </text>
        </g>
      )
    })
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} onApplyRule={handleApplyRule} />}
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-widest text-gray-800">{t('home.title')}</h1>
          <p className="text-lg text-gray-600 italic">{t('home.subtitle')}</p>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md border-b-4 border-blue-600 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col items-center">
              <label className="font-bold mb-1 text-sm uppercase underline" style={{ color: 'var(--term-x)' }}>{t('home.input.x')}</label>
              <input
                type="text"
                id="input-x"
                value={terms.x}
                onChange={e => updateLabels('x', e.target.value)}
                className="w-full max-w-xs text-lg italic border-b-2 border-gray-600 bg-transparent outline-none text-center transition-colors focus:border-[var(--term-x)]"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="font-bold mb-1 text-sm uppercase underline" style={{ color: 'var(--term-y)' }}>{t('home.input.y')}</label>
              <input
                type="text"
                id="input-y"
                value={terms.y}
                onChange={e => updateLabels('y', e.target.value)}
                className="w-full max-w-xs text-lg italic border-b-2 border-gray-600 bg-transparent outline-none text-center transition-colors focus:border-[var(--term-y)]"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="font-bold mb-1 text-sm uppercase underline" style={{ color: 'var(--term-m)' }}>{t('home.input.m')}</label>
              <input
                type="text"
                id="input-m"
                value={terms.m}
                onChange={e => updateLabels('m', e.target.value)}
                className="w-full max-w-xs text-lg italic border-b-2 border-gray-600 bg-transparent outline-none text-center transition-colors focus:border-[var(--term-m)]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 border-t border-gray-100">
            <button
              onClick={clearTerms}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-bold uppercase border border-gray-300"
            >
              {t('home.clear_terms')}
            </button>
            <button
              onClick={clearBoard}
              className="px-6 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors text-sm font-bold uppercase border border-red-200"
            >
              {t('home.clear_board')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-gray-700">
              <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">{t('home.controls')}</h2>
              <div className="text-sm text-gray-600 space-y-4">
                <ul className="space-y-2 list-none">
                  <li className="flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold mr-2">
                      1
                    </span>
                    {t('home.controls.1_click')}
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white text-[10px] font-bold mr-2">
                      0
                    </span>
                    {t('home.controls.2_clicks')}
                  </li>
                </ul>
              </div>
            </div>

            <CopyCode 
              dd={statusCodes.dd} 
              md={statusCodes.md} 
              terms={terms} 
              translateTerms={false}
              onShowHelp={() => setShowHelp(true)}
            />
          </div>

          <div className="lg:col-span-2 space-y-8 flex flex-col items-center">
            <div className="bg-[#ede9df] p-6 border-2 border-gray-700 shadow-xl" style={{ boxShadow: '5px 5px 15px rgba(0,0,0,0.1)' }}>
              <h3 className="text-center text-gray-500 mb-2 uppercase text-xs tracking-widest font-bold">
                {t('home.large_diagram')}
              </h3>
              <svg id="large-diagram" width="440" height="440" viewBox="0 0 400 400" className="select-none">
                <rect x="10" y="10" width="380" height="380" fill="none" stroke="black" strokeWidth="2" />
                <rect x="105" y="105" width="190" height="190" fill="none" stroke="black" strokeWidth="1.5" />
                <line x1="10" y1="200" x2="390" y2="200" stroke="black" strokeWidth="1.5" />
                <line x1="200" y1="10" x2="200" y2="390" stroke="black" strokeWidth="1.5" />

                <text x="13" y="21" className="num-text text-[11px] fill-[var(--sea-ink-soft)] font-bold select-none" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  9
                </text>
                <text
                  x="387"
                  y="21"
                  textAnchor="end"
                  className="num-text text-[11px] fill-[var(--sea-ink-soft)] font-bold select-none"
                  style={{ fontFamily: '"Courier New", Courier, monospace' }}
                >
                  10
                </text>
                <text
                  x="108"
                  y="117"
                  className="num-text text-[11px] fill-[var(--sea-ink-soft)] font-bold select-none"
                  style={{ fontFamily: '"Courier New", Courier, monospace' }}
                >
                  11
                </text>
                <text
                  x="292"
                  y="117"
                  textAnchor="end"
                  className="num-text text-[11px] fill-[var(--sea-ink-soft)] font-bold select-none"
                  style={{ fontFamily: '"Courier New", Courier, monospace' }}
                >
                  12
                </text>
                <text
                  x="108"
                  y="292"
                  className="num-text text-[11px] fill-[var(--sea-ink-soft)] font-bold select-none"
                  style={{ fontFamily: '"Courier New", Courier, monospace' }}
                >
                  13
                </text>
                <text
                  x="292"
                  y="292"
                  textAnchor="end"
                  className="num-text text-[11px] fill-[var(--sea-ink-soft)] font-bold select-none"
                  style={{ fontFamily: '"Courier New", Courier, monospace' }}
                >
                  14
                </text>
                <text
                  x="13"
                  y="387"
                  className="num-text text-[11px] fill-[var(--sea-ink-soft)] font-bold select-none"
                  style={{ fontFamily: '"Courier New", Courier, monospace' }}
                >
                  15
                </text>
                <text
                  x="387"
                  y="387"
                  textAnchor="end"
                  className="num-text text-[11px] fill-[var(--sea-ink-soft)] font-bold select-none"
                  style={{ fontFamily: '"Courier New", Courier, monospace' }}
                >
                  16
                </text>

                <text
                  x="200"
                  y="85"
                  textAnchor="middle"
                  className="label-text italic text-xl select-none font-bold pointer-events-none"
                  fill="var(--term-x)"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {terms.x}
                </text>
                <text
                  x="200"
                  y="330"
                  textAnchor="middle"
                  className="label-text italic text-xl select-none font-bold pointer-events-none"
                  fill="var(--term-x)"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {terms.x}'
                </text>
                <text
                  x="60"
                  y="208"
                  textAnchor="middle"
                  className="label-text italic text-xl select-none font-bold pointer-events-none"
                  fill="var(--term-y)"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {terms.y}
                </text>
                <text
                  x="340"
                  y="208"
                  textAnchor="middle"
                  className="label-text italic text-xl select-none font-bold pointer-events-none"
                  fill="var(--term-y)"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {terms.y}'
                </text>
                <text
                  x="200"
                  y="208"
                  textAnchor="middle"
                  className="label-text italic text-xl select-none font-bold pointer-events-none"
                  fill="var(--term-m)"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {terms.m}
                </text>

                {largeCells.map(cell => (
                  <rect
                    key={cell.id}
                    x={cell.x}
                    y={cell.y}
                    width={cell.w}
                    height={cell.h}
                    fill="transparent"
                    className="cursor-pointer hover:fill-black/5"
                    onClick={() => cycleCounter('large', cell.id)}
                  />
                ))}

                <g id="large-counters">{renderCounters(largeState, 'large')}</g>
              </svg>
            </div>

            <div className="bg-[#ede9df] p-6 border-2 border-gray-700 shadow-xl" style={{ boxShadow: '5px 5px 15px rgba(0,0,0,0.1)' }}>
              <h3 className="text-center text-gray-500 mb-2 uppercase text-xs tracking-widest font-bold">
                {t('home.small_diagram')}
              </h3>
              <svg id="small-diagram" width="340" height="340" viewBox="0 0 250 250" className="select-none">
                <rect x="5" y="5" width="240" height="240" fill="none" stroke="black" strokeWidth="3" />
                <line x1="5" y1="125" x2="245" y2="125" stroke="black" strokeWidth="1.5" />
                <line x1="125" y1="5" x2="125" y2="245" stroke="black" strokeWidth="1.5" />

                <text
                  x="8"
                  y="17"
                  className="num-text text-[11px] fill-gray-600 font-bold select-none"
                  style={{ fontFamily: '"Courier New", Courier, monospace' }}
                >
                  5
                </text>
                <text
                  x="242"
                  y="17"
                  textAnchor="end"
                  className="num-text text-[11px] fill-gray-600 font-bold select-none"
                  style={{ fontFamily: '"Courier New", Courier, monospace' }}
                >
                  6
                </text>
                <text
                  x="8"
                  y="243"
                  className="num-text text-[11px] fill-gray-600 font-bold select-none"
                  style={{ fontFamily: '"Courier New", Courier, monospace' }}
                >
                  7
                </text>
                <text
                  x="242"
                  y="243"
                  textAnchor="end"
                  className="num-text text-[11px] fill-gray-600 font-bold select-none"
                  style={{ fontFamily: '"Courier New", Courier, monospace' }}
                >
                  8
                </text>

                <text
                  x="125"
                  y="55"
                  textAnchor="middle"
                  className="label-text italic text-xl select-none font-bold pointer-events-none"
                  fill="var(--term-x)"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {terms.x}
                </text>
                <text
                  x="125"
                  y="205"
                  textAnchor="middle"
                  className="label-text italic text-xl select-none font-bold pointer-events-none"
                  fill="var(--term-x)"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {terms.x}'
                </text>
                <text
                  x="40"
                  y="133"
                  textAnchor="middle"
                  className="label-text italic text-xl select-none font-bold pointer-events-none"
                  fill="var(--term-y)"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {terms.y}
                </text>
                <text
                  x="210"
                  y="133"
                  textAnchor="middle"
                  className="label-text italic text-xl select-none font-bold pointer-events-none"
                  fill="var(--term-y)"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {terms.y}'
                </text>

                {smallCells.map(cell => (
                  <rect
                    key={cell.id}
                    x={cell.x}
                    y={cell.y}
                    width={cell.w}
                    height={cell.h}
                    fill="transparent"
                    className="cursor-pointer hover:fill-black/5"
                    onClick={() => cycleCounter('small', cell.id)}
                  />
                ))}

                <g id="small-counters">{renderCounters(smallState, 'small')}</g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0% { transform: translate(0, 0); }
          25% { transform: translate(1px, 1px); }
          50% { transform: translate(-1px, -1px); }
          75% { transform: translate(1px, -1px); }
          100% { transform: translate(0, 0); }
        }
        .hover\\:animate-shake:hover {
          animation: shake 0.1s infinite;
        }
      `}</style>
    </main>
  )
}
