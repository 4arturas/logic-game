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
} from '../lib/logic'
import { HelpModal } from '../components/HelpModal'
import { CopyCode } from '../components/CopyCode'
import { PropositionLogicSequence } from '../components/PropositionLogicSequence'
import { LargeDiagram } from '../components/LargeDiagram'
import { SmallDiagram } from '../components/SmallDiagram'
import { useSettings } from '../contexts/SettingsContext'
import standardSyllogisms from '../data/syllogisms_standard.json'
import customSyllogisms from '../data/syllogisms_custom.json'

export const Route = createFileRoute('/')({ component: PracticeQuiz })

const FIGURE_NAMES: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }

function PracticeQuiz() {
  const { t } = useTranslation()
  const { premiseOrder } = useSettings()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [largeState, setLargeState] = useState<Record<string, any>>({})
  const [smallState, setSmallState] = useState<Record<string, any>>({})
  const [validationResult, setValidationResult] = useState<any>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [selectedSet, setSelectedSet] = useState<'standard' | 'custom'>('standard')
  const [allSyllogisms, setAllSyllogisms] = useState<Syllogism[]>([])
  const [showFigureModal, setShowFigureModal] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const loadSyllogisms = useCallback((set: 'standard' | 'custom') => {
    const data = set === 'standard' ? standardSyllogisms : customSyllogisms
    const sylls = data.map((d: any) => createSyllogism(d.figure as Figure, d.mood as Mood, d.terms))
    setAllSyllogisms(sylls)
    setCurrentIndex(0)
    handleClear()
  }, [])

  useEffect(() => { loadSyllogisms(selectedSet) }, [selectedSet, loadSyllogisms])

  const currentSyllogism = useMemo(() => allSyllogisms[currentIndex % allSyllogisms.length], [allSyllogisms, currentIndex])
  const correctEncoding = useMemo(() => currentSyllogism ? generateDiagram(currentSyllogism) : null, [currentSyllogism])

  const handleClear = () => {
    setLargeState({})
    setSmallState({})
    setValidationResult(null)
  }

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1)
    handleClear()
  }

  const getStatusCodes = useCallback(() => {
    const getStateCode = (state: any, cellIds: number[], prefix: string) => {
      return cellIds.map(id => {
        const key = prefix === 'lg' ? `${prefix}_${id}` : `${prefix}${id}`
        const val = state[key] === 'red' ? '1' : state[key] === 'grey' ? '0' : '-'
        return `${id}-${val}`
      }).join(',')
    }
    return {
      dd: getStateCode(largeState, [9, 10, 11, 12, 13, 14, 15, 16], 'lg'),
      md: getStateCode(smallState, [5, 6, 7, 8], 'c')
    }
  }, [largeState, smallState])

  const handleValidate = () => {
    if (!correctEncoding) return
    const { dd, md } = getStatusCodes()
    const result = validateUserDiagram(`DD=${dd}`, `MD=${md}`, correctEncoding)
    setValidationResult(result)
    if (result.isCorrect) {
      setScore(s => s + 1)
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }
  }

  const getFullSyllogismText = useCallback(() => {
    if (!currentSyllogism) return ''
    const items = premiseOrder === 'major-first'
      ? [currentSyllogism.premises.major, currentSyllogism.premises.minor]
      : [currentSyllogism.premises.minor, currentSyllogism.premises.major]
    
    const format = (prop: any) => {
      const s = t(prop.subject as any)
      const p = t(prop.predicate as any)
      const verb = ['fur', 'tail', 'wings', 'hair', 'bloating'].some(w => prop.predicate.includes(w)) ? t('quiz.have') : t('quiz.are')
      if (prop.quantifier === 'E') return `${t('quiz.no_word')} ${s} ${verb} ${p}.`
      if (prop.quantifier === 'O') return `${t('quiz.some_word')} ${s} ${verb} ${t('quiz.not_word')} ${p}.`
      if (prop.quantifier === 'A') return `${t('quiz.all_word')} ${s} ${verb} ${p}.`
      return `${t('quiz.some_word')} ${s} ${verb} ${p}.`
    }

    return items.map(format).join('\n') + '\n∴ ' + format(currentSyllogism.conclusion)
  }, [currentSyllogism, premiseOrder, t])

  if (!currentSyllogism || !correctEncoding) {
    return <div className="p-20 text-center font-mono opacity-50">{t("quiz.loading")}</div>
  }

  const terms = { x: currentSyllogism.terms.minorTerm, y: currentSyllogism.terms.majorTerm, m: currentSyllogism.terms.middleTerm }
  const codes = getStatusCodes()
  const syllogismText = getFullSyllogismText()

  return (
    <main className="page-wrap px-4 pb-12 pt-14">
      {showFigureModal && (
        <SyllogismSelectModal 
          allSyllogisms={allSyllogisms} 
          currentSyllogism={currentSyllogism}
          onSelect={(s: Syllogism) => {
            const idx = allSyllogisms.findIndex(x => x.id === s.id)
            if (idx !== -1) setCurrentIndex(idx)
            setShowFigureModal(false)
            handleClear()
          }}
          onClose={() => setShowFigureModal(false)}
        />
      )}

      <div className="max-w-[95vw] mx-auto">
        <div className="flex items-center gap-3 mb-8">
           <button 
             onClick={() => setShowFigureModal(true)}
             className="px-4 py-2 bg-[var(--hero-a)] border-2 border-[var(--lagoon)] text-[var(--palm)] rounded font-bold text-xs uppercase tracking-widest hover:bg-[var(--lagoon)] hover:text-white transition-all shadow-sm"
           >
             Select Figure
           </button>
           <div className="h-px flex-1 bg-[var(--line)]" />
           <span className="text-[10px] font-mono font-bold text-[var(--sea-ink-soft)]">
             ACTIVE PARADIGM: FIG {FIGURE_NAMES[currentSyllogism.figure]} • {currentSyllogism.mood}
           </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr_1.2fr] gap-12 items-start">
          
          {/* Column 1: Premise Details */}
          <div className="space-y-6">
            <LocalSyllogismCard 
              syllogism={currentSyllogism} 
              t={t} 
              premiseOrder={premiseOrder}
              selectedSet={selectedSet}
              onSetChange={(val: 'standard' | 'custom') => setSelectedSet(val)}
            />
            <LocalScoreBoard score={score} streak={streak} total={currentIndex + 1} t={t} />
          </div>

          {/* Column 2: Diagrams */}
          <div className="flex flex-col items-center gap-10">
            <div className="relative group p-6 bg-white border border-[var(--line)] rounded shadow-sm">
                <LargeDiagram 
                  state={largeState} 
                  onCellClick={(id) => setLargeState(prev => {
                    const key = id
                    const next = prev[key] === 'red' ? 'grey' : prev[key] === 'grey' ? null : 'red'
                    const newState = { ...prev }; if (next) newState[key] = next; else delete newState[key]; return newState
                  })}
                  minorTerm={terms.x} majorTerm={terms.y} middleTerm={terms.m} t={t}
                />
            </div>
            <div className="relative group p-6 bg-white border border-[var(--line)] rounded shadow-sm">
                <SmallDiagram 
                  state={smallState} 
                  onCellClick={(id) => setSmallState(prev => {
                    const key = id
                    const next = prev[key] === 'red' ? 'grey' : prev[key] === 'grey' ? null : 'red'
                    const newState = { ...prev }; if (next) newState[key] = next; else delete newState[key]; return newState
                  })}
                  minorTerm={terms.x} majorTerm={terms.y} t={t}
                />
            </div>
          </div>

          {/* Column 3: Tools & Feedback */}
          <div className="space-y-6">
             <div className="p-6 bg-[var(--surface-strong)] border-2 border-[var(--line)] rounded">
                <h3 className="island-kicker mb-6" style={{ color: "var(--sea-ink)" }}>Control Protocol</h3>
                <div className="space-y-3">
                   <button 
                     onClick={handleValidate}
                     className="w-full py-2.5 bg-[var(--lagoon)] text-white text-[10px] font-bold uppercase border-2 border-[var(--lagoon)] rounded hover:brightness-110"
                   >
                     {t('quiz.check_answer')}
                   </button>
                   <button 
                     onClick={handleClear}
                     className="w-full py-2.5 bg-transparent text-[var(--sea-ink)] text-[10px] font-bold uppercase border-2 border-[var(--line)] rounded hover:bg-[var(--foam)]"
                   >
                     {t('home.clear_board')}
                   </button>
                   {validationResult?.isCorrect && (
                     <button 
                       onClick={handleNext}
                       className="w-full py-2.5 bg-[var(--palm)] text-white text-[10px] font-bold uppercase border-2 border-[var(--palm)] rounded animate-pulse"
                     >
                       Next Syllogism
                     </button>
                   )}
                </div>

                {validationResult && (
                  <div className={`mt-6 p-4 border-l-4 rounded ${validationResult.isCorrect ? `bg-[var(--hero-a)] border-[var(--palm)]` : `bg-red-50 border-red-500`}`}>
                    <div className="text-[10px] font-black uppercase text-[var(--sea-ink)]">
                      Status: {validationResult.isCorrect ? 'Verified' : 'Invalid'}
                    </div>
                  </div>
                )}
             </div>

             <CopyCode 
               dd={codes.dd} 
               md={codes.md} 
               terms={terms} 
               syllogismText={syllogismText}
               onShowHelp={() => setShowHelp(true)} 
             />
          </div>

        </div>
      </div>
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} onApplyRule={(cells) => setLargeState(p => { const n={...p}; cells.forEach(c => n[`lg_${c}`]=`grey`); return n })} />}
    </main>
  )
}

function LocalSyllogismCard({ syllogism, t, premiseOrder, selectedSet, onSetChange }: any) {
  const formatProp = (prop: any) => {
    const s = <span style={{ color: prop.subject === syllogism.terms.minorTerm ? 'var(--term-x)' : prop.subject === syllogism.terms.majorTerm ? 'var(--term-y)' : 'var(--term-m)', fontWeight: 700 }}>{t(prop.subject)}</span>
    const p = <span style={{ color: prop.predicate === syllogism.terms.minorTerm ? 'var(--term-x)' : prop.predicate === syllogism.terms.majorTerm ? 'var(--term-y)' : 'var(--term-m)', fontWeight: 700 }}>{t(prop.predicate)}</span>
    const verb = ['fur', 'tail', 'wings', 'hair', 'bloating'].some(w => prop.predicate.includes(w)) ? t('quiz.have') : t('quiz.are')
    if (prop.quantifier === 'E') return <>{t('quiz.no_word')} {s} {verb} {p}.</>
    if (prop.quantifier === 'O') return <>{t('quiz.some_word')} {s} {verb} {t('quiz.not_word')} {p}.</>
    if (prop.quantifier === 'A') return <>{t('quiz.all_word')} {s} {verb} {p}.</>
    return <>{t('quiz.some_word')} {s} {verb} {p}.</>
  }
  const items = premiseOrder === 'major-first' 
    ? [{ p: syllogism.premises.major, l: t('quiz.major_premise') }, { p: syllogism.premises.minor, l: t('quiz.minor_premise') }]
    : [{ p: syllogism.premises.minor, l: t('quiz.minor_premise') }, { p: syllogism.premises.major, l: t('quiz.major_premise') }]

  return (
    <div className="bg-[var(--surface-strong)] border-2 border-[var(--line)] rounded overflow-hidden shadow-sm">
      <div className="p-3 bg-[var(--sand)] border-b border-[var(--line)] flex justify-between items-center">
         <span className="text-[10px] font-black uppercase text-[var(--sea-ink-soft)] font-mono">Archive Data</span>
         <select 
           value={selectedSet} 
           onChange={e => onSetChange(e.target.value)}
           className="text-[9px] font-bold uppercase bg-transparent outline-none cursor-pointer text-[var(--lagoon)]"
         >
           <option value="standard">Standard</option>
           <option value="custom">Custom</option>
         </select>
      </div>
      <div className="p-5 space-y-4">
        {items.map((item, i) => (
          <div key={i} className="pl-3 border-l-2 border-[var(--lagoon)]">
             <div className="text-[9px] uppercase font-bold text-[var(--lagoon)] mb-1">{item.l}</div>
             <p className="text-sm italic font-serif text-[var(--sea-ink)] leading-snug">{formatProp(item.p)}</p>
             <PropositionLogicSequence prop={item.p} syllogism={syllogism} />
          </div>
        ))}
        <div className="pl-3 border-l-2 border-[var(--palm)] bg-[var(--hero-a)] p-2 rounded">
           <div className="text-[9px] uppercase font-bold text-[var(--palm)] mb-1">{t("quiz.conclusion")} ∴</div>
           <p className="text-sm italic font-serif text-[var(--sea-ink)] leading-snug">{formatProp(syllogism.conclusion)}</p>
           <PropositionLogicSequence prop={syllogism.conclusion} syllogism={syllogism} />
        </div>
      </div>
    </div>
  )
}

function LocalScoreBoard({ score, streak, total }: any) {
  return (
    <div className="grid grid-cols-2 gap-px bg-[var(--line)] border-2 border-[var(--line)] rounded overflow-hidden">
       <div className="bg-white p-4 text-center">
          <div className="text-[9px] uppercase font-bold text-[var(--sea-ink-soft)] mb-1">Score</div>
          <div className="text-xl font-black text-[var(--sea-ink)]">{score}/{total}</div>
       </div>
       <div className="bg-white p-4 text-center">
          <div className="text-[9px] uppercase font-bold text-[var(--sea-ink-soft)] mb-1">Streak</div>
          <div className="text-xl font-black text-[var(--palm)]">{streak} 🔥</div>
       </div>
    </div>
  )
}

function SyllogismSelectModal({ allSyllogisms, currentSyllogism, onSelect, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded border-2 border-[var(--line)] w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b bg-[var(--sand)] flex justify-between">
           <span className="font-bold uppercase text-xs">Pick Paradigm</span>
           <button onClick={onClose}>✕</button>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-2">
           {allSyllogisms.map((s: any) => (
             <button 
               key={s.id} 
               onClick={() => onSelect(s)}
               className={`p-3 text-left border rounded text-[10px] font-mono transition-colors ${currentSyllogism.id === s.id ? `bg-[var(--hero-a)] border-[var(--palm)]` : `hover:bg-[var(--foam)]`}`}
             >
               FIG {FIGURE_NAMES[s.figure]} • {s.mood}
               <div className="italic text-[var(--sea-ink-soft)] mt-1">{s.mnemonic}</div>
             </button>
           ))}
        </div>
      </div>
    </div>
  )
}
