import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from '../i18n/I18nContext'
import { type DiagramState, type Terms } from '../contexts/DiagramContext'
import { CopyCode } from '../components/CopyCode'
import { HelpModal } from '../components/HelpModal'
import { LargeDiagram } from '../components/LargeDiagram'
import { SmallDiagram } from '../components/SmallDiagram'
import { type CounterState } from '../lib/types'

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
            <LargeDiagram
              state={largeState}
              onCellClick={(id) => cycleCounter('large', id)}
              minorTerm={terms.x}
              majorTerm={terms.y}
              middleTerm={terms.m}
              t={(s) => s}
            />

            <SmallDiagram
              state={smallState}
              onCellClick={(id) => cycleCounter('small', id)}
              minorTerm={terms.x}
              majorTerm={terms.y}
              t={(s) => s}
            />
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
