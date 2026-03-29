import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { useTranslation } from '../i18n/I18nContext'
import {
  createSyllogism,
  type Syllogism,
  type Figure,
  type Mood,
  generateDiagram,
  validateUserDiagram,
} from '../../logic'
import { HelpModal } from '../components/HelpModal'
import { CopyCode } from '../components/CopyCode'
import { PropositionLogicSequence } from '../components/PropositionLogicSequence'
import standardSyllogisms from '../data/syllogisms_standard.json'
import customSyllogisms from '../data/syllogisms_custom.json'

export const Route = createFileRoute('/practice')({ component: PracticeQuiz })

type CounterState = 'red' | 'grey' | null

interface CellState {
  [id: string]: CounterState
}

interface Terms {
  x: string
  y: string
  m: string
}

// ----------------------------------------------------------------------------
// HELPER COMPONENTS
// ----------------------------------------------------------------------------



function SyllogismCard({ syllogism, t, selectedSet, onSetChange }: { syllogism: Syllogism; t: (key: any) => string; selectedSet: string; onSetChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) {

  const formatProposition = (prop: { quantifier: string; subject: string; predicate: string }) => {
    const sKey = prop.subject
    const pKey = prop.predicate
    const s = t(sKey as any)
    const p = t(pKey as any)
    
    const getTermColor = (key: string) => {
      if (key === syllogism.terms.minorTerm) return 'var(--term-x)'
      if (key === syllogism.terms.majorTerm) return 'var(--term-y)'
      if (key === syllogism.terms.middleTerm) return 'var(--term-m)'
      return 'inherit'
    }

    const sSpan = <span style={{ color: getTermColor(sKey), fontWeight: 'bold', textDecoration: 'underline' }}>{s}</span>
    const pSpan = <span style={{ color: getTermColor(pKey), fontWeight: 'bold', textDecoration: 'underline' }}>{p}</span>

    const verb = ['fur', 'tail', 'wings', 'hair', 'bloating'].some(w => prop.predicate.includes(w)) ? t('quiz.have') : t('quiz.are')
    
    if (prop.quantifier === 'E') return <>{t('quiz.no_word')} {sSpan} {verb} {pSpan}.</>
    if (prop.quantifier === 'O') return <>{t('quiz.some_word')} {sSpan} {verb} {t('quiz.not_word')} {pSpan}.</>
    if (prop.quantifier === 'A') return <>{t('quiz.all_word')} {sSpan} {verb} {pSpan}.</>
    return <>{t('quiz.some_word')} {sSpan} {verb} {pSpan}.</>
  }

  return (
    <div className="bg-[var(--surface)] p-6 rounded-xl shadow-md border border-[var(--chip-line)]">
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-[var(--lagoon)] text-white px-3 py-1 rounded-full text-sm font-bold">
          Figure {syllogism.figure}
        </span>
        <span className="bg-[var(--foam)] text-[var(--palm)] px-3 py-1 rounded-full text-sm font-mono font-bold border border-[var(--chip-line)]">
          {syllogism.mood}
        </span>
        <span className="text-[var(--sea-ink-soft)] font-semibold italic flex-1">{syllogism.mnemonic}</span>
        <select
          value={selectedSet}
          onChange={onSetChange}
          className="bg-[var(--foam)] border border-[var(--line)] rounded-lg px-2 py-1 text-xs font-bold text-[var(--sea-ink)] outline-none cursor-pointer hover:bg-[var(--hero-a)] transition-colors"
        >
          <option value="standard">Standard Carroll Set (24)</option>
          <option value="custom">Color / Taste / Apple Set (24)</option>
        </select>
      </div>

      <div className="space-y-3">
        <div className="bg-[var(--foam)] p-3 rounded-lg border border-[var(--chip-line)]">
          <span className="text-xs text-[var(--lagoon)] font-semibold uppercase tracking-wide">{t('quiz.major_premise')}</span>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-lg text-[var(--sea-ink)] mt-1 flex-1 text-center md:text-left">{formatProposition(syllogism.premises.major)}</p>
            <div className="bg-white/60 px-4 rounded-lg border border-dashed border-[var(--lagoon)] shadow-sm">
              <PropositionLogicSequence prop={syllogism.premises.major} syllogism={syllogism} />
            </div>
          </div>
        </div>
        <div className="bg-[var(--foam)] p-3 rounded-lg border border-[var(--chip-line)]">
          <span className="text-xs text-[var(--lagoon)] font-semibold uppercase tracking-wide">{t('quiz.minor_premise')}</span>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-lg text-[var(--sea-ink)] mt-1 flex-1 text-center md:text-left">{formatProposition(syllogism.premises.minor)}</p>
            <div className="bg-white/60 px-4 rounded-lg border border-dashed border-[var(--lagoon)] shadow-sm">
              <PropositionLogicSequence prop={syllogism.premises.minor} syllogism={syllogism} />
            </div>
          </div>
        </div>
        <div className="bg-[var(--hero-a)]/30 p-3 rounded-lg border border-[var(--lagoon)]">
          <span className="text-xs text-[var(--palm)] font-semibold uppercase tracking-wide">{t('quiz.conclusion')}</span>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-lg text-[var(--sea-ink)] mt-1 flex-1 text-center md:text-left">{formatProposition(syllogism.conclusion)}</p>
            <div className="bg-white/60 px-4 rounded-lg border border-dashed border-[var(--palm)] shadow-sm">
              <PropositionLogicSequence prop={syllogism.conclusion} syllogism={syllogism} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--line)]">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">
            <span className="text-[var(--sea-ink-soft)] block text-xs">{t('quiz.minor_term')}</span>
            <span className="font-semibold underline" style={{ color: 'var(--term-x)' }}>{t(syllogism.terms.minorTerm as any)}</span>
          </div>
          <div className="text-center">
            <span className="text-[var(--sea-ink-soft)] block text-xs">{t('quiz.major_term')}</span>
            <span className="font-semibold underline" style={{ color: 'var(--term-y)' }}>{t(syllogism.terms.majorTerm as any)}</span>
          </div>
          <div className="text-center">
            <span className="text-[var(--sea-ink-soft)] block text-xs">{t('quiz.middle_term')}</span>
            <span className="font-semibold underline" style={{ color: 'var(--term-m)' }}>{t(syllogism.terms.middleTerm as any)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScoreBoard({ score, total, streak, t }: { score: number; total: number; streak: number; t: (key: any) => string }) {
  return (
    <div className="flex gap-4 justify-center mb-6">
      <div className="bg-[var(--surface)] px-4 py-2 rounded-lg shadow border border-[var(--chip-line)]">
        <span className="text-[var(--sea-ink-soft)] text-sm">{t('quiz.score')}</span>
        <p className="text-2xl font-bold text-[var(--lagoon)]">{score}/{total}</p>
      </div>
      <div className="bg-[var(--surface)] px-4 py-2 rounded-lg shadow border border-[var(--chip-line)]">
        <span className="text-[var(--sea-ink-soft)] text-sm">{t('quiz.streak')}</span>
        <p className="text-2xl font-bold text-[var(--palm)]">{streak} 🔥</p>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------------

function PracticeQuiz() {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [terms, setTerms] = useState<Terms>({ x: '', y: '', m: '' })
  const [largeState, setLargeState] = useState<CellState>({})
  const [smallState, setSmallState] = useState<CellState>({})
  const [validationResult, setValidationResult] = useState<{
    isCorrect: boolean
    errors: string[]
    correctDD: string
    correctMD: string
  } | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [selectedSet, setSelectedSet] = useState<'standard' | 'custom'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('practice-syllogism-set') as 'standard' | 'custom') || 'standard'
    }
    return 'standard'
  })
  const [shuffledSyllogisms, setShuffledSyllogisms] = useState<Syllogism[]>([])
  const [showHelp, setShowHelp] = useState(false)

  const loadSyllogisms = useCallback((set: 'standard' | 'custom') => {
    const data = set === 'standard' ? standardSyllogisms : customSyllogisms
    const syllogisms = data.map(d => 
      createSyllogism(d.figure as Figure, d.mood as Mood, d.terms)
    )
    const shuffled = [...syllogisms].sort(() => Math.random() - 0.5)
    setShuffledSyllogisms(shuffled)
    setCurrentIndex(0)
    setLargeState({})
    setSmallState({})
    setValidationResult(null)
    setShowAnswer(false)
  }, [])

  useEffect(() => {
    loadSyllogisms(selectedSet)
  }, [selectedSet, loadSyllogisms])

  const handleSetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSet = e.target.value as 'standard' | 'custom'
    setSelectedSet(newSet)
    if (typeof window !== 'undefined') {
      localStorage.setItem('practice-syllogism-set', newSet)
    }
  }

  const currentSyllogism = useMemo(() => {
    if (!shuffledSyllogisms || shuffledSyllogisms.length === 0) return null
    return shuffledSyllogisms[currentIndex % shuffledSyllogisms.length]
  }, [shuffledSyllogisms, currentIndex])

  useEffect(() => {
    if (currentSyllogism) {
      setTerms({
        x: currentSyllogism.terms.minorTerm,
        y: currentSyllogism.terms.majorTerm,
        m: currentSyllogism.terms.middleTerm,
      })
    }
  }, [currentSyllogism])



  const correctEncoding = useMemo(() => {
    if (!currentSyllogism) return null
    try {
      return generateDiagram(currentSyllogism)
    } catch (error) {
      console.error('Error generating diagram:', error)
      return null
    }
  }, [currentSyllogism])

  const cycleCounter = useCallback(
    (type: 'small' | 'large', id: string) => {
      if (validationResult !== null) return

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
    [validationResult]
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

  const handleValidate = useCallback(() => {
    if (!correctEncoding) return

    const getStateCode = (state: CellState, cellIds: number[], prefix: string) => {
      return cellIds
        .map(id => {
          const key = prefix === 'lg' ? `${prefix}_${id}` : `${prefix}${id}`
          const val = state[key] === 'red' ? '1' : state[key] === 'grey' ? '0' : '-'
          return `${id}-${val}`
        })
        .join(',')
    }

    const userDD = `DD=${getStateCode(largeState, [9, 10, 11, 12, 13, 14, 15, 16], 'lg')}`
    const userMD = `MD=${getStateCode(smallState, [5, 6, 7, 8], 'c')}`

    const result = validateUserDiagram(userDD, userMD, correctEncoding)
    setValidationResult(result)

    if (result.isCorrect) {
      setScore(prev => prev + 1)
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
    }
  }, [correctEncoding, largeState, smallState])

  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true)
    setStreak(0)
  }, [])

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => prev + 1)
    setLargeState({})
    setSmallState({})
    setValidationResult(null)
    setShowAnswer(false)
  }, [])

  const handleReset = useCallback(() => {
    loadSyllogisms(selectedSet)
    setScore(0)
    setStreak(0)
  }, [loadSyllogisms, selectedSet])

  const handleClearBoard = useCallback(() => {
    setLargeState({})
    setSmallState({})
  }, [])

  const getStatusCodes = useCallback(() => {
    const getStateCode = (state: CellState, cellIds: number[], prefix: string) => {
      return cellIds
        .map(id => {
          const key = prefix === 'lg' ? `${prefix}_${id}` : `${prefix}${id}`
          const val = state[key] === 'red' ? '1' : state[key] === 'grey' ? '0' : '-'
          return `${id}-${val}`
        })
        .join(',')
    }

    const ddStr = getStateCode(largeState, [9, 10, 11, 12, 13, 14, 15, 16], 'lg')
    const mdStr = getStateCode(smallState, [5, 6, 7, 8], 'c')

    return { dd: ddStr, md: mdStr }
  }, [largeState, smallState])

  const statusCodes = getStatusCodes()

  const formatSyllogismText = useCallback(() => {
    if (!currentSyllogism) return ''
    
    const formatProp = (prop: { quantifier: string; subject: string; predicate: string }) => {
      const s = t(prop.subject as any)
      const p = t(prop.predicate as any)
      const verb = ['fur', 'tail', 'wings', 'hair', 'bloating'].some(w => prop.predicate.includes(w)) ? t('quiz.have') : t('quiz.are')
      
      if (prop.quantifier === 'E') return `${t('quiz.no_word')} ${s} ${verb} ${p}`
      if (prop.quantifier === 'O') return `${t('quiz.some_word')} ${s} ${verb} ${t('quiz.not_word')} ${p}`
      if (prop.quantifier === 'A') return `${t('quiz.all_word')} ${s} ${verb} ${p}`
      return `${t('quiz.some_word')} ${s} ${verb} ${p}`
    }

    const m = formatProp(currentSyllogism.premises.major)
    const n = formatProp(currentSyllogism.premises.minor)
    const c = formatProp(currentSyllogism.conclusion)

    return `${m}\n${n}\n∴ ${c}`
  }, [currentSyllogism, t])

  // Render counters for diagrams
  const renderCounters = (state: CellState, type: 'small' | 'large') => {
    const largeCells = [
      { id: 'lg_9',  cx: 57,  cy: 57 },
      { id: 'lg_10', cx: 343, cy: 57 },
      { id: 'lg_11', cx: 152, cy: 152 },
      { id: 'lg_12', cx: 247, cy: 152 },
      { id: 'lg_13', cx: 152, cy: 247 },
      { id: 'lg_14', cx: 247, cy: 247 },
      { id: 'lg_15', cx: 57,  cy: 343 },
      { id: 'lg_16', cx: 343, cy: 343 },
    ]

    const smallCells = [
      { id: 'c5', cx: 65, cy: 65 },
      { id: 'c6', cx: 185, cy: 65 },
      { id: 'c7', cx: 65, cy: 185 },
      { id: 'c8', cx: 185, cy: 185 },
    ]

    const cells = type === 'large' ? largeCells : smallCells

    return Object.entries(state).map(([id, counterState]) => {
      const cell = cells.find(c => c.id === id)
      if (!cell || !counterState) return null

      const radius = type === 'large' ? 12 : 16
      const fill = counterState === 'red' ? '#dc2626' : '#6b7280'
      const text = counterState === 'red' ? '1' : '0'

      return (
        <g
          key={id}
          className="transition-transform duration-100 ease-in-out pointer-events-none select-none"
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

  // Large diagram cells for click handling
  const largeCells = [
    { id: 'lg_9',  x: 10,  y: 10,  w: 95, h: 95, cx: 57,  cy: 57 },
    { id: 'lg_10', x: 295, y: 10,  w: 95, h: 95, cx: 343, cy: 57 },
    { id: 'lg_11', x: 105, y: 105, w: 95, h: 95, cx: 152, cy: 152 },
    { id: 'lg_12', x: 200, y: 105, w: 95, h: 95, cx: 247, cy: 152 },
    { id: 'lg_13', x: 105, y: 200, w: 95, h: 95, cx: 152, cy: 247 },
    { id: 'lg_14', x: 200, y: 200, w: 95, h: 95, cx: 247, cy: 247 },
    { id: 'lg_15', x: 10,  y: 295, w: 95, h: 95, cx: 57,  cy: 343 },
    { id: 'lg_16', x: 295, y: 295, w: 95, h: 95, cx: 343, cy: 343 },
  ]

  const smallCells = [
    { id: 'c5', x: 5, y: 5, w: 120, h: 120, cx: 65, cy: 65 },
    { id: 'c6', x: 125, y: 5, w: 120, h: 120, cx: 185, cy: 65 },
    { id: 'c7', x: 5, y: 125, w: 120, h: 120, cx: 65, cy: 185 },
    { id: 'c8', x: 125, y: 125, w: 120, h: 120, cx: 185, cy: 185 },
  ]

  if (!currentSyllogism || !correctEncoding) {
    return (
      <main className="page-wrap px-4 pb-8 pt-14">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-gray-500">{t('quiz.loading')}</p>
        </div>
      </main>
    )
  }

  const isComplete = validationResult !== null

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      <div className="max-w-[90vw] mx-auto">


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Controls and Syllogism */}
          <div className="space-y-6">
            <SyllogismCard syllogism={currentSyllogism} t={t} selectedSet={selectedSet} onSetChange={handleSetChange} />

            {/* Score Board */}
            <ScoreBoard score={score} total={currentIndex + 1} streak={streak} t={t} />

            {/* Controls */}
            <div className="bg-[var(--surface)] p-6 rounded-lg shadow-md border-t-4 border-[var(--sea-ink)]">
              <h2 className="text-xl font-bold mb-4 border-b pb-2 text-[var(--sea-ink)]">{t('home.controls')}</h2>
              <div className="text-sm text-[var(--sea-ink-soft)] space-y-4">
                <ul className="space-y-2 list-none">
                  <li className="flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[var(--lagoon)] text-white text-[10px] font-bold mr-2">
                      1
                    </span>
                    {t('home.controls.1_click')}
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[var(--sea-ink-soft)] text-white text-[10px] font-bold mr-2">
                      0
                    </span>
                    {t('home.controls.2_clicks')}
                  </li>
                </ul>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-[var(--line)]">
                <button
                  onClick={handleValidate}
                  disabled={isComplete}
                  className={`px-6 py-2 rounded transition-colors text-sm font-bold uppercase border ${
                    isComplete
                      ? 'bg-[var(--sand)] text-[var(--sea-ink-soft)] border-[var(--line)] cursor-not-allowed'
                      : 'bg-[var(--lagoon)] text-white border-[var(--lagoon)] hover:bg-[var(--lagoon-deep)]'
                  }`}
                >
                  {t('quiz.check_answer')}
                </button>
                <button
                  onClick={handleClearBoard}
                  disabled={isComplete}
                  className={`px-6 py-2 rounded transition-colors text-sm font-bold uppercase border ${
                    isComplete
                      ? 'bg-[var(--sand)] text-[var(--sea-ink-soft)] border-[var(--line)] cursor-not-allowed'
                      : 'bg-[var(--hero-a)] text-[var(--palm)] border-[var(--palm)] hover:bg-[var(--hero-b)]'
                  }`}
                >
                  {t('home.clear_board')}
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-[var(--sand)] text-[var(--sea-ink)] rounded hover:bg-[var(--foam)] transition-colors text-sm font-bold uppercase border border-[var(--chip-line)]"
                >
                  {t('quiz.reset')}
                </button>
              </div>
            </div>

            {/* Status Code */}
             <CopyCode 
              dd={statusCodes.dd} 
              md={statusCodes.md} 
              terms={terms} 
              syllogismText={formatSyllogismText()} 
              onShowHelp={() => setShowHelp(true)}
            />

            {showHelp && <HelpModal onClose={() => setShowHelp(false)} onApplyRule={handleApplyRule} />}

            {/* Validation/Answer */}
            {validationResult && (
              <div className={`p-6 rounded-xl border-2 ${validationResult.isCorrect ? 'bg-[var(--foam)] border-[var(--palm)]' : 'bg-[var(--sand)] border-[var(--lagoon-deep)]'}`}>
                <div className="flex items-center gap-3 mb-4">
                  {validationResult.isCorrect ? (
                    <>
                      <span className="text-3xl">✓</span>
                      <h3 className="text-xl font-bold text-[var(--palm)]">{t('quiz.correct')}</h3>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl">!</span>
                      <h3 className="text-xl font-bold text-[var(--lagoon-deep)]">{t('quiz.not_correct')}</h3>
                    </>
                  )}
                </div>

                {!validationResult.isCorrect && validationResult.errors.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-[var(--lagoon-deep)] font-semibold mb-2">{t('quiz.differences')}</p>
                    <ul className="text-sm text-[var(--sea-ink-soft)] space-y-1 max-h-32 overflow-y-auto">
                      {validationResult.errors.slice(0, 5).map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                      {validationResult.errors.length > 5 && (
                        <li className="text-[var(--sea-ink-soft)] italic">...and {validationResult.errors.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                )}



                <div className="flex gap-3 mt-4">
                  {!validationResult.isCorrect && (
                    <button
                      onClick={handleShowAnswer}
                      className="px-4 py-2 bg-[var(--lagoon)] text-white rounded-lg hover:bg-[var(--lagoon-deep)] transition-colors font-semibold"
                    >
                      {t('quiz.show_answer')}
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
                      validationResult.isCorrect
                        ? 'bg-[var(--palm)] text-white hover:bg-[var(--palm)]/80'
                        : 'bg-[var(--sea-ink)] text-white hover:bg-[var(--sea-ink-soft)]'
                    }`}
                  >
                    {validationResult.isCorrect ? t('quiz.next') : t('quiz.skip')}
                  </button>
                </div>
              </div>
            )}

            {showAnswer && (
              <div className="bg-[var(--hero-a)] p-6 rounded-xl border-2 border-[var(--lagoon)]">
                <h3 className="text-lg font-bold text-[var(--palm)] mb-4">{t('quiz.correct_answer')}</h3>
                <div className="space-y-3 font-mono text-sm">
                  <div className="bg-[var(--surface)] p-3 rounded border border-[var(--chip-line)]">
                    <span className="text-[var(--lagoon)] font-semibold">DD = </span>
                    <span className="text-[var(--sea-ink)]">{correctEncoding.dd}</span>
                  </div>
                  <div className="bg-[var(--surface)] p-3 rounded border border-[var(--chip-line)]">
                    <span className="text-[var(--lagoon)] font-semibold">MD = </span>
                    <span className="text-[var(--sea-ink)]">{correctEncoding.md}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Diagrams */}
          <div className="lg:col-span-2 space-y-8 flex flex-col items-center">
            {/* Large Diagram */}
            <div className="bg-[var(--sand)] p-6 rounded-2xl border-2 border-[var(--sea-ink)] shadow-xl">
              <h3 className="text-center text-[var(--sea-ink-soft)] mb-2 uppercase text-xs tracking-widest font-bold">
                {t('home.large_diagram')}
              </h3>
              <svg width="440" height="440" viewBox="0 0 400 400" className="select-none mx-auto">
                <rect x="10" y="10" width="380" height="380" fill="none" stroke="black" strokeWidth="2" />
                <rect x="105" y="105" width="190" height="190" fill="none" stroke="black" strokeWidth="1.5" />
                <line x1="10" y1="200" x2="390" y2="200" stroke="black" strokeWidth="1.5" />
                <line x1="200" y1="10" x2="200" y2="390" stroke="black" strokeWidth="1.5" />

                {/* Cell numbers */}
                <text x="13" y="21" className="text-[11px] font-bold select-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>9</text>
                <text x="387" y="21" textAnchor="end" className="text-[11px] font-bold select-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>10</text>
                <text x="108" y="117" className="text-[11px] font-bold select-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>11</text>
                <text x="292" y="117" textAnchor="end" className="text-[11px] font-bold select-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>12</text>
                <text x="108" y="292" className="text-[11px] font-bold select-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>13</text>
                <text x="292" y="292" textAnchor="end" className="text-[11px] font-bold select-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>14</text>
                <text x="13" y="387" className="text-[11px] font-bold select-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>15</text>
                <text x="387" y="387" textAnchor="end" className="text-[11px] font-bold select-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>16</text>

                {/* Labels */}
                <text x="200" y="85" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-x)" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{t(terms.x as any)}</text>
                <text x="200" y="330" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-x)" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{t(terms.x as any)}'</text>
                <text x="60" y="208" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-y)" style={{ fontFamily: "'Times New Roman', Times, serif", writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', transformOrigin: '60px 208px' }}>{t(terms.y as any)}</text>
                <text x="340" y="208" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-y)" style={{ fontFamily: "'Times New Roman', Times, serif", writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', transformOrigin: '340px 208px' }}>{t(terms.y as any)}'</text>
                <text x="200" y="208" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-m)" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{t(terms.m as any)}</text>

                {/* Interactive cells */}
                {!isComplete && largeCells.map(cell => (
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

                {/* Counters */}
                <g>{renderCounters(largeState, 'large')}</g>
              </svg>
            </div>

            {/* Small Diagram */}
            <div className="bg-[var(--sand)] p-6 rounded-2xl border-2 border-[var(--sea-ink)] shadow-xl">
              <h3 className="text-center text-[var(--sea-ink-soft)] mb-2 uppercase text-xs tracking-widest font-bold">
                {t('home.small_diagram')}
              </h3>
              <svg width="340" height="340" viewBox="0 0 250 250" className="select-none mx-auto">
                <rect x="5" y="5" width="240" height="240" fill="none" stroke="black" strokeWidth="2" />
                <line x1="5" y1="125" x2="245" y2="125" stroke="black" strokeWidth="1.5" />
                <line x1="125" y1="5" x2="125" y2="245" stroke="black" strokeWidth="1.5" />

                {/* Cell numbers */}
                <text x="8" y="17" className="text-[11px] font-bold select-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>5</text>
                <text x="242" y="17" textAnchor="end" className="text-[11px] font-bold select-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>6</text>
                <text x="8" y="243" className="text-[11px] font-bold select-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>7</text>
                <text x="242" y="243" textAnchor="end" className="text-[11px] font-bold select-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>8</text>
                {/* Labels */}
                <text x="125" y="55" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-x)" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{t(terms.x as any)}</text>
                <text x="125" y="205" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-x)" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{t(terms.x as any)}'</text>
                <text x="40" y="133" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-y)" style={{ fontFamily: "'Times New Roman', Times, serif", writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', transformOrigin: '40px 133px' }}>{t(terms.y as any)}</text>
                <text x="210" y="133" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-y)" style={{ fontFamily: "'Times New Roman', Times, serif", writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', transformOrigin: '210px 133px' }}>{t(terms.y as any)}'</text>

                {/* Interactive cells */}
                {!isComplete && smallCells.map(cell => (
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

                {/* Counters */}
                <g>{renderCounters(smallState, 'small')}</g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
