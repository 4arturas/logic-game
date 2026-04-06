import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from '../i18n/I18nContext'
import { 
  generateDiagram, 
  validateUserDiagram, 
  type Syllogism 
} from '../lib/logic'
import { type CellState, type CounterState } from '../lib/types'
import { LargeDiagram } from './LargeDiagram'
import { SmallDiagram } from './SmallDiagram'
import { CopyCode } from './CopyCode'
import { HelpModal } from './HelpModal'
import { useSettings } from '../contexts/SettingsContext'
import confetti from 'canvas-confetti'
import { AudioEngine } from '../lib/audio'
import MotivatingText from './MotivatingText'

interface SyllogismSolverProps {
  syllogism: Syllogism
  onCorrect?: () => void
  onNext?: () => void
  showNextButton?: boolean
  initialLargeState?: CellState
  initialSmallState?: CellState
}

export function SyllogismSolver({
  syllogism,
  onCorrect,
  onNext,
  showNextButton = true,
  initialLargeState = {},
  initialSmallState = {}
}: SyllogismSolverProps) {
  const { t } = useTranslation()
  const { premiseOrder } = useSettings()
  const [largeState, setLargeState] = useState<CellState>(initialLargeState)
  const [smallState, setSmallState] = useState<CellState>(initialSmallState)
  const [validationResult, setValidationResult] = useState<{ isCorrect: boolean; errors: string[] } | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [motivationState, setMotivationState] = useState<{ triggerId: number, type: 'correct' | 'incorrect' }>({ triggerId: 0, type: 'correct' })

  const correctEncoding = useMemo(() => generateDiagram(syllogism), [syllogism])

  const cycleCounter = useCallback((type: 'small' | 'large', id: string) => {
    if (validationResult?.isCorrect) return

    const setState = type === 'small' ? setSmallState : setLargeState
    setState(prev => {
      const currentState = prev[id] || null
      let nextState: CounterState = currentState === null ? 'red' : currentState === 'red' ? 'grey' : null
      
      const newState = { ...prev }
      if (nextState === null) delete newState[id]
      else newState[id] = nextState
      return newState
    })
  }, [validationResult])

  const handleApplyRule = useCallback((cells: number[]) => {
    setLargeState(prev => {
      const newState = { ...prev }
      cells.forEach(id => { newState[`lg_${id}`] = 'grey' })
      return newState
    })
  }, [])

  const getStatusCodes = useCallback(() => {
    const getStateCode = (state: CellState, cellIds: number[], prefix: string) => {
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
    const { dd, md } = getStatusCodes()
    const result = validateUserDiagram(`DD=${dd}`, `MD=${md}`, correctEncoding)
    setValidationResult(result)

    setMotivationState(prev => ({
      triggerId: prev.triggerId + 1,
      type: result.isCorrect ? 'correct' : 'incorrect'
    }))

    if (result.isCorrect) {
      AudioEngine.playCorrect()

      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFD166', '#06D6A0', '#118AB2']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFD166', '#EF476F', '#118AB2']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      if (onCorrect) onCorrect()
    } else {
      AudioEngine.playError()
    }
  }

  const handleClear = () => {
    setLargeState({})
    setSmallState({})
    setValidationResult(null)
    setShowAnswer(false)
  }

  const statusCodes = getStatusCodes()

  const getFullSyllogismText = useCallback(() => {
    const items = premiseOrder === 'major-first'
      ? [syllogism.premises.major, syllogism.premises.minor]
      : [syllogism.premises.minor, syllogism.premises.major]
    
    const format = (prop: any) => {
      const s = t(prop.subject as any)
      const p = t(prop.predicate as any)
      const verb = ['fur', 'tail', 'wings', 'hair', 'bloating'].some(w => prop.predicate.includes(w)) ? t('quiz.have') : t('quiz.are')
      if (prop.quantifier === 'E') return `${t('quiz.no_word')} ${s} ${verb} ${p}.`
      if (prop.quantifier === 'O') return `${t('quiz.some_word')} ${s} ${verb} ${t('quiz.not_word')} ${p}.`
      if (prop.quantifier === 'A') return `${t('quiz.all_word')} ${s} ${verb} ${p}.`
      return `${t('quiz.some_word')} ${s} ${verb} ${p}.`
    }

    return items.map(format).join('\n') + '\n∴ ' + format(syllogism.conclusion)
  }, [syllogism, premiseOrder, t])

  const syllogismText = getFullSyllogismText()

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-start">
        
        {/* Left: Diagrams */}
        <div className="flex flex-col items-center gap-6">
          <LargeDiagram
            state={largeState}
            onCellClick={(id) => cycleCounter('large', id)}
            minorTerm={syllogism.terms.minorTerm}
            majorTerm={syllogism.terms.majorTerm}
            middleTerm={syllogism.terms.middleTerm}
            t={t}
            isReadOnly={validationResult?.isCorrect}
          />
          <SmallDiagram
            state={smallState}
            onCellClick={(id) => cycleCounter('small', id)}
            minorTerm={syllogism.terms.minorTerm}
            majorTerm={syllogism.terms.majorTerm}
            t={t}
            isReadOnly={validationResult?.isCorrect}
          />
        </div>

        {/* Right: Controls and Feedback */}
        <div className="space-y-6 w-full">
          <div className="p-6 rounded border" style={{ background: 'var(--surface-strong)', borderColor: 'var(--line)', borderLeft: '4px solid var(--sea-ink)' }}>
            <h3 className="island-kicker mb-4" style={{ color: 'var(--sea-ink)' }}>{t('home.controls')}</h3>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={handleValidate}
                disabled={validationResult?.isCorrect}
                className="px-6 py-2 rounded text-xs font-bold uppercase border transition-all"
                style={validationResult?.isCorrect 
                  ? { background: 'var(--sand)', color: 'var(--sea-ink-soft)', borderColor: 'var(--line)' }
                  : { background: 'var(--lagoon)', color: 'white', borderColor: 'var(--lagoon)' }}
              >
                {t('quiz.check_answer')}
              </button>
              <button
                onClick={handleClear}
                disabled={validationResult?.isCorrect}
                className="px-6 py-2 rounded text-xs font-bold uppercase border"
                style={{ background: 'var(--foam)', color: 'var(--sea-ink)', borderColor: 'var(--line)' }}
              >
                {t('home.clear_board')}
              </button>
              {showNextButton && onNext && (
                <button
                  onClick={onNext}
                  className="px-6 py-2 rounded text-xs font-bold uppercase border"
                  style={{ background: 'var(--hero-a)', color: 'var(--palm)', borderColor: 'var(--palm)' }}
                >
                  {t('quiz.next')}
                </button>
              )}
            </div>

            {validationResult && (
              <div className="mt-4 p-4 rounded border-l-4 transition-all animate-in fade-in slide-in-from-top-2"
                style={{ 
                  background: validationResult.isCorrect ? 'var(--hero-a)' : 'rgba(220,38,38,0.08)',
                  borderColor: validationResult.isCorrect ? 'var(--palm)' : '#dc2626'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-black" style={{ color: validationResult.isCorrect ? 'var(--palm)' : '#dc2626' }}>
                    {validationResult.isCorrect ? '✓' : '✗'}
                  </span>
                  <span className="font-bold uppercase text-xs" style={{ color: validationResult.isCorrect ? 'var(--palm)' : '#dc2626' }}>
                    {validationResult.isCorrect ? t('quiz.correct') : t('quiz.not_correct')}
                  </span>
                </div>
                {!validationResult.isCorrect && validationResult.errors.length > 0 && (
                  <ul className="mb-2 space-y-0.5">
                    {validationResult.errors.slice(0, 3).map((err, i) => (
                      <li key={i} className="text-[10px] font-mono" style={{ color: '#dc2626' }}>
                        · {err}
                      </li>
                    ))}
                    {validationResult.errors.length > 3 && (
                      <li className="text-[10px] font-mono opacity-60" style={{ color: '#dc2626' }}>
                        · …and {validationResult.errors.length - 3} more
                      </li>
                    )}
                  </ul>
                )}
                {!validationResult.isCorrect && (
                  <button 
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="text-[10px] font-bold underline opacity-70 hover:opacity-100"
                    style={{ color: '#dc2626' }}
                  >
                    {showAnswer ? 'Hide Answer' : t('quiz.show_answer')}
                  </button>
                )}
                {showAnswer && !validationResult.isCorrect && (
                  <div className="mt-3 font-mono text-[10px] space-y-1 opacity-80">
                    <div>DD={correctEncoding.dd}</div>
                    <div>MD={correctEncoding.md}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <CopyCode 
            dd={statusCodes.dd} 
            md={statusCodes.md} 
            terms={{ x: syllogism.terms.minorTerm, y: syllogism.terms.majorTerm, m: syllogism.terms.middleTerm }}
            syllogismText={syllogismText}
            onShowHelp={() => setShowHelp(true)}
          />
        </div>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} onApplyRule={handleApplyRule} />}
      <MotivatingText triggerId={motivationState.triggerId} type={motivationState.type} />
    </div>
  )
}
