import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useTranslation } from '../i18n/I18nContext'
import {
  createSyllogism,
  type Syllogism,
  type Figure,
  type Mood,
  generateDiagram,
  validateUserDiagram,
} from '../lib/logic'
import { HelpModal } from '../components/HelpModal'
import { CopyCode } from '../components/CopyCode'
import { PropositionLogicSequence } from '../components/PropositionLogicSequence'
import { LargeDiagram } from '../components/LargeDiagram'
import { SmallDiagram } from '../components/SmallDiagram'
import { useSettings } from '../contexts/SettingsContext'
import { type CellState, type CounterState } from '../lib/types'
import standardSyllogisms from '../data/syllogisms_standard.json'
import customSyllogisms from '../data/syllogisms_custom.json'

export const Route = createFileRoute('/practice')({ component: PracticeQuiz })


interface Terms {
  x: string
  y: string
  m: string
}

// ----------------------------------------------------------------------------
// HELPER COMPONENTS
// ----------------------------------------------------------------------------

const FIGURE_NAMES: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }
const FIGURE_PATTERNS: Record<number, string> = { 1: 'M–P / S–M', 2: 'P–M / S–M', 3: 'M–P / M–S', 4: 'P–M / M–S' }
const FIGURE_COLORS: Record<number, string> = {
  1: 'var(--lagoon)',
  2: 'var(--palm)',
  3: '#7c3aed',
  4: '#b45309',
}

function SyllogismSelectModal({
  allSyllogisms,
  currentSyllogism,
  onSelectSyllogism,
  onClose,
}: {
  allSyllogisms: Syllogism[]
  currentSyllogism: Syllogism | null
  onSelectSyllogism: (s: Syllogism) => void
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<number | null>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const visibleSyllogisms = activeTab === null
    ? allSyllogisms
    : allSyllogisms.filter(s => s.figure === activeTab)

  const isActive = (s: Syllogism) =>
    currentSyllogism !== null &&
    s.figure === currentSyllogism.figure &&
    s.mood === currentSyllogism.mood

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <style>{`
        @keyframes sylModalIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div
        className="relative bg-[var(--surface)] rounded-2xl shadow-2xl border border-[var(--chip-line)] flex flex-col w-full mx-auto"
        style={{ animation: 'sylModalIn 0.22s cubic-bezier(.22,1,.36,1) both', maxHeight: '95vh', maxWidth: '80rem' }}
      >
        <SyllogismModalInner
          allSyllogisms={allSyllogisms}
          visibleSyllogisms={visibleSyllogisms}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isActive={isActive}
          onSelectSyllogism={onSelectSyllogism}
          onClose={onClose}
        />
      </div>
    </div>
  )
}

// Inner separated so useTranslation() re-renders on every language-change
function SyllogismModalInner({
  allSyllogisms,
  visibleSyllogisms,
  activeTab,
  setActiveTab,
  isActive,
  onSelectSyllogism,
  onClose,
}: {
  allSyllogisms: Syllogism[]
  visibleSyllogisms: Syllogism[]
  activeTab: number | null
  setActiveTab: (v: number | null) => void
  isActive: (s: Syllogism) => boolean
  onSelectSyllogism: (s: Syllogism) => void
  onClose: () => void
}) {
  const { t } = useTranslation()
  const { premiseOrder } = useSettings()

  const formatProp = (
    prop: { quantifier: string; subject: string; predicate: string },
    syl: Syllogism,
  ) => {
    const sText = t(prop.subject as any)
    const pText = t(prop.predicate as any)
    const verb = ['fur', 'tail', 'wings', 'hair', 'bloating'].some(w => prop.predicate.includes(w))
      ? t('quiz.have') : t('quiz.are')
    const getColor = (key: string) => {
      if (key === syl.terms.minorTerm)  return 'var(--term-x)'
      if (key === syl.terms.majorTerm)  return 'var(--term-y)'
      if (key === syl.terms.middleTerm) return 'var(--term-m)'
      return 'inherit'
    }
    const sEl = <span style={{ color: getColor(prop.subject),    fontWeight: 600 }}>{sText}</span>
    const pEl = <span style={{ color: getColor(prop.predicate),  fontWeight: 600 }}>{pText}</span>
    if (prop.quantifier === 'E') return <>{t('quiz.no_word')} {sEl} {verb} {pEl}.</>
    if (prop.quantifier === 'O') return <>{t('quiz.some_word')} {sEl} {verb} {t('quiz.not_word')} {pEl}.</>
    if (prop.quantifier === 'A') return <>{t('quiz.all_word')} {sEl} {verb} {pEl}.</>
    return <>{t('quiz.some_word')} {sEl} {verb} {pEl}.</>
  }

  const getLogic = (
    prop: { quantifier: string; subject: string; predicate: string },
    syl: Syllogism,
  ) => {
    const getVar = (term: string) => {
      const isComp = term.endsWith("'")
      const base   = isComp ? term.slice(0, -1) : term
      let v = '?'; let c = 'inherit'
      if (base === syl.terms.minorTerm)  { v = 'x'; c = 'var(--term-x)' }
      else if (base === syl.terms.majorTerm)  { v = 'y'; c = 'var(--term-y)' }
      else if (base === syl.terms.middleTerm) { v = 'm'; c = 'var(--term-m)' }
      return { text: v + (isComp ? "'" : ''), color: c }
    }
    let rel = '\u2286'
    let rightStr = prop.predicate
    let notEmpty = false
    if (prop.quantifier === 'E') { rightStr = prop.predicate + "'" }
    else if (prop.quantifier === 'I') { rel = '\u2229'; notEmpty = true }
    else if (prop.quantifier === 'O') { rel = '\u2229'; rightStr = prop.predicate + "'"; notEmpty = true }
    const left  = getVar(prop.subject)
    const right = getVar(rightStr)
    return (
      <span className="inline-flex items-center font-mono text-[11px] font-bold gap-0.5">
        <span style={{ color: left.color }}>{left.text}</span>
        <span className="text-[var(--palm)] mx-0.5">{rel}</span>
        <span style={{ color: right.color }}>{right.text}</span>
        {notEmpty && <span className="text-[var(--sea-ink-soft)] ml-0.5">\u2260 \u2205</span>}
      </span>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-7 pt-5 pb-4 border-b border-[var(--line)] flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-[var(--sea-ink)]">Choose a Syllogism</h2>
          <p className="text-xs text-[var(--sea-ink-soft)] mt-0.5">
            Click any syllogism to start solving it
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--foam)] hover:bg-[var(--sand)] transition-colors text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] text-lg font-bold"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      {/* Figure tabs */}
      <div className="flex gap-2 px-7 pt-3 pb-3 border-b border-[var(--line)] flex-shrink-0 flex-wrap">
        <button
          onClick={() => setActiveTab(null)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
            activeTab === null
              ? 'bg-[var(--sea-ink)] text-white border-[var(--sea-ink)]'
              : 'bg-[var(--foam)] text-[var(--sea-ink-soft)] border-[var(--chip-line)] hover:border-[var(--sea-ink)] hover:text-[var(--sea-ink)]'
          }`}
        >
          All ({allSyllogisms.length})
        </button>
        {([1, 2, 3, 4] as const).map(fig => (
          <button
            key={fig}
            onClick={() => setActiveTab(fig)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              activeTab === fig
                ? 'text-white border-transparent'
                : 'bg-[var(--foam)] text-[var(--sea-ink-soft)] border-[var(--chip-line)] hover:text-[var(--sea-ink)] hover:border-[var(--sea-ink)]'
            }`}
            style={activeTab === fig ? { background: FIGURE_COLORS[fig] } : {}}
          >
            Figure {FIGURE_NAMES[fig]}&nbsp;&middot;&nbsp;{FIGURE_PATTERNS[fig]}&nbsp;
            ({allSyllogisms.filter(s => s.figure === fig).length})
          </button>
        ))}
      </div>

      {/* Scrollable grid */}
      <div className="overflow-y-auto flex-1 px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleSyllogisms.map((syl, idx) => {
            const active = isActive(syl)
            const figColor = FIGURE_COLORS[syl.figure]
            const idxKey = `${syl.figure}-${syl.mood}-${idx}`
            const rows = premiseOrder === 'major-first'
              ? [
                  { key: 'major', label: 'P1', prop: syl.premises.major, accent: 'var(--lagoon)', bg: 'transparent' },
                  { key: 'minor', label: 'P2', prop: syl.premises.minor, accent: 'var(--lagoon)', bg: 'transparent' },
                  { key: 'concl', label: '\u2234',  prop: syl.conclusion,      accent: 'var(--palm)',   bg: 'var(--hero-a)' },
                ] as const
              : [
                  { key: 'minor', label: 'P1', prop: syl.premises.minor, accent: 'var(--lagoon)', bg: 'transparent' },
                  { key: 'major', label: 'P2', prop: syl.premises.major, accent: 'var(--lagoon)', bg: 'transparent' },
                  { key: 'concl', label: '\u2234',  prop: syl.conclusion,      accent: 'var(--palm)',   bg: 'var(--hero-a)' },
                ] as const
            return (
              <button
                key={idxKey}
                onClick={() => { onSelectSyllogism(syl); onClose() }}
                className={`text-left rounded-xl border-2 p-4 transition-all hover:shadow-lg w-full ${
                  active ? 'shadow-md' : 'border-[var(--chip-line)] bg-[var(--foam)] hover:border-[var(--lagoon)]/50 hover:bg-[var(--hero-a)]/20'
                }`}
                style={active ? { borderColor: figColor, background: `${figColor}13` } : {}}
              >
                {/* Badge row */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: figColor }}
                  >
                    Fig.&nbsp;{FIGURE_NAMES[syl.figure]}
                  </span>
                  <span
                    className="font-mono font-bold text-sm px-2 py-0.5 rounded-md border flex-shrink-0"
                    style={active
                      ? { color: figColor, borderColor: figColor }
                      : { color: 'var(--sea-ink)', borderColor: 'var(--chip-line)' }
                    }
                  >
                    {syl.mood}
                  </span>
                  {syl.mnemonic && (
                    <span className="text-[11px] italic text-[var(--sea-ink-soft)] truncate min-w-0">
                      {syl.mnemonic}
                    </span>
                  )}
                  {active && (
                    <span className="text-[11px] font-bold ml-auto flex-shrink-0" style={{ color: figColor }}>
                      ✓ Now
                    </span>
                  )}
                </div>

                {/* Proposition rows */}
                <div className="space-y-1.5">
                  {rows.map(({ key, label, prop, accent, bg }) => (
                    <div
                      key={key}
                      className="flex items-stretch rounded-lg overflow-hidden"
                      style={{ border: `1px solid ${accent}44` }}
                    >
                      <div
                        className="flex items-center justify-center w-7 flex-shrink-0 text-[10px] font-bold text-white"
                        style={{ background: accent }}
                      >
                        {label}
                      </div>
                      <div
                        className="flex-1 min-w-0 px-2.5 py-1.5"
                        style={{ background: bg === 'transparent' ? 'var(--surface)' : `${bg}88` }}
                      >
                        <div className="text-[11px] leading-snug text-[var(--sea-ink)]">
                          {formatProp(prop, syl)}
                        </div>
                        <div className="mt-0.5 opacity-80">
                          {getLogic(prop, syl)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-7 py-3 border-t border-[var(--line)] flex-shrink-0 flex items-center justify-between">
        <span className="text-xs text-[var(--sea-ink-soft)]">
          Showing {visibleSyllogisms.length} of {allSyllogisms.length} syllogisms
        </span>
        <button
          onClick={onClose}
          className="text-xs text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </>
  )
}



function SyllogismCard({ syllogism, t, selectedSet, onSetChange }: { syllogism: Syllogism; t: (key: any) => string; selectedSet: string; onSetChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) {
  const { premiseOrder } = useSettings()

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
        {[
          ...(premiseOrder === 'major-first'
            ? [
                { type: 'major', prop: syllogism.premises.major, label: t('quiz.major_premise') },
                { type: 'minor', prop: syllogism.premises.minor, label: t('quiz.minor_premise') }
              ]
            : [
                { type: 'minor', prop: syllogism.premises.minor, label: t('quiz.minor_premise') },
                { type: 'major', prop: syllogism.premises.major, label: t('quiz.major_premise') }
              ]),
        ].map(item => (
          <div key={item.type} className="bg-[var(--foam)] p-3 rounded-lg border border-[var(--chip-line)]">
            <span className="text-xs text-[var(--lagoon)] font-semibold uppercase tracking-wide">{item.label}</span>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-lg text-[var(--sea-ink)] mt-1 flex-1 text-center md:text-left">{formatProposition(item.prop)}</p>
              <div className="bg-white/60 px-4 rounded-lg border border-dashed border-[var(--lagoon)] shadow-sm">
                <PropositionLogicSequence prop={item.prop} syllogism={syllogism} />
              </div>
            </div>
          </div>
        ))}
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
  const { premiseOrder } = useSettings()
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
  const [allSyllogisms, setAllSyllogisms] = useState<Syllogism[]>([])
  const [showHelp, setShowHelp] = useState(false)
  const [showFigureModal, setShowFigureModal] = useState(false)

  const loadSyllogisms = useCallback((set: 'standard' | 'custom') => {
    const data = set === 'standard' ? standardSyllogisms : customSyllogisms
    const syllogisms = data.map(d =>
      createSyllogism(d.figure as Figure, d.mood as Mood, d.terms)
    )
    setAllSyllogisms(syllogisms)
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

  // Direct pick: put selected syllogism first, shuffle the rest behind it
  const handleDirectSyllogismSelect = useCallback((syl: Syllogism) => {
    const rest = allSyllogisms.filter(
      s => !(s.figure === syl.figure && s.mood === syl.mood)
    )
    const shuffledRest = [...rest].sort(() => Math.random() - 0.5)
    setShuffledSyllogisms([syl, ...shuffledRest])
    setCurrentIndex(0)
    setLargeState({})
    setSmallState({})
    setValidationResult(null)
    setShowAnswer(false)
  }, [allSyllogisms])

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

    const m = formatProp(premiseOrder === 'major-first' ? currentSyllogism.premises.major : currentSyllogism.premises.minor)
    const n = formatProp(premiseOrder === 'major-first' ? currentSyllogism.premises.minor : currentSyllogism.premises.major)
    const c = formatProp(currentSyllogism.conclusion)

    return `${m}\n${n}\n∴ ${c}`
  }, [currentSyllogism, t])



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
      {showFigureModal && (
        <SyllogismSelectModal
          allSyllogisms={allSyllogisms}
          currentSyllogism={currentSyllogism}
          onSelectSyllogism={handleDirectSyllogismSelect}
          onClose={() => setShowFigureModal(false)}
        />
      )}
      <div className="max-w-[90vw] mx-auto">

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <button
            id="select-figure-btn"
            onClick={() => setShowFigureModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[var(--lagoon)] bg-[var(--hero-a)] text-[var(--palm)] font-bold text-sm hover:bg-[var(--lagoon)] hover:text-white transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
            Choose Syllogism
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {currentSyllogism && (
            <span className="text-xs text-[var(--sea-ink-soft)]">
              Now: <span className="font-mono font-bold text-[var(--sea-ink)]">Fig.&nbsp;{FIGURE_NAMES[currentSyllogism.figure]} · {currentSyllogism.mood}</span>
            </span>
          )}
        </div>

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
            <LargeDiagram
              state={largeState}
              onCellClick={(id) => cycleCounter('large', id)}
              minorTerm={currentSyllogism.terms.minorTerm}
              majorTerm={currentSyllogism.terms.majorTerm}
              middleTerm={currentSyllogism.terms.middleTerm}
              t={t}
              isReadOnly={isComplete}
            />

            <SmallDiagram
              state={smallState}
              onCellClick={(id) => cycleCounter('small', id)}
              minorTerm={currentSyllogism.terms.minorTerm}
              majorTerm={currentSyllogism.terms.majorTerm}
              t={t}
              isReadOnly={isComplete}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
