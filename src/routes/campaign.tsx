import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from '../i18n/I18nContext'
import { Heart, Star, Sparkles, TrendingUp } from 'lucide-react'
import {
  SYLLOGISM_EXAMPLES,
  type Syllogism,
  generateDiagram,
  validateUserDiagram,
} from '../lib/logic'
import { Gamification, type GameState, MAX_HEARTS } from '../lib/gamification'
import { AudioEngine } from '../lib/audio'
import Confetti from '../components/Confetti'
import { HelpModal } from '../components/HelpModal'
import { CopyCode } from '../components/CopyCode'
import { PropositionLogicSequence } from '../components/PropositionLogicSequence'
import { LargeDiagram } from '../components/LargeDiagram'
import { SmallDiagram } from '../components/SmallDiagram'
import { useSettings } from '../contexts/SettingsContext'
import { type CellState, type CounterState } from '../lib/types'

export const Route = createFileRoute('/campaign')({ component: CampaignRoute })


function SyllogismSimpleCard({ syllogism, t }: { syllogism: Syllogism; t: (key: any) => string }) {
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
    <div className="bg-[var(--surface)] p-6 rounded-xl shadow-md border-2 border-[var(--palm)] relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-[var(--palm)] text-white px-4 py-1 rounded-bl-lg font-bold text-sm shadow">
        Fig {syllogism.figure} • {syllogism.mood}
      </div>
      <div className="space-y-4 pt-4">
        {[
          ...(premiseOrder === 'major-first'
            ? [
                { type: 'major', prop: syllogism.premises.major },
                { type: 'minor', prop: syllogism.premises.minor }
              ]
            : [
                { type: 'minor', prop: syllogism.premises.minor },
                { type: 'major', prop: syllogism.premises.major }
              ]),
        ].map((item) => (
          <div key={item.type} className="p-3 bg-[var(--foam)] rounded-lg text-center font-bold text-lg text-[var(--sea-ink)] shadow-sm">
            <div className="flex flex-col items-center justify-center gap-2">
              <p>{formatProposition(item.prop)}</p>
              <div className="bg-white/60 px-4 rounded-lg border border-dashed border-[var(--lagoon)] shadow-sm overflow-hidden scale-90 -mb-2">
                <PropositionLogicSequence prop={item.prop} syllogism={syllogism} />
              </div>
            </div>
          </div>
        ))}
        <div className="p-3 border-2 border-[var(--lagoon)] rounded-lg text-center font-black text-xl text-[var(--lagoon-deep)] bg-[var(--hero-a)]/30">
          <div className="flex flex-col items-center justify-center gap-2">
            <p>∴ {formatProposition(syllogism.conclusion)}</p>
            <div className="bg-white/60 px-4 rounded-lg border border-dashed border-[var(--palm)] shadow-sm overflow-hidden scale-90 -mb-2">
              <PropositionLogicSequence prop={syllogism.conclusion} syllogism={syllogism} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CampaignRoute() {
  const { t } = useTranslation()
  const { premiseOrder } = useSettings()
  const [gameState, setGameState] = useState<GameState>(Gamification.defaultState())
  const [currentSyllogism, setCurrentSyllogism] = useState<Syllogism | null>(null)
  
  const [largeState, setLargeState] = useState<CellState>({})
  const [smallState, setSmallState] = useState<CellState>({})
  const [validationResult, setValidationResult] = useState<{ isCorrect: boolean } | null>(null)
  
  const [showConfetti, setShowConfetti] = useState(false)
  const [levelUpModal, setLevelUpModal] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)

  // Initialize
  useEffect(() => {
    const saved = Gamification.load()
    setGameState(saved)
    pickNextSyllogism(saved.level)
  }, [])

  const pickNextSyllogism = (level: number) => {
    const constraints = Gamification.getChallengeConstraints(level)
    const allowed = SYLLOGISM_EXAMPLES.filter(s => constraints.allowedFigures.includes(s.figure))
    const randomSync = allowed[Math.floor(Math.random() * allowed.length)]
    setCurrentSyllogism(randomSync)
    setLargeState({})
    setSmallState({})
    setValidationResult(null)
    setStartTime(Date.now())
  }

  const getStatusCodes = useCallback(() => {
    const getStateCode = (state: CellState, cellIds: number[], prefix: string) => {
      return cellIds.map(id => {
        const key = prefix === 'lg' ? `${prefix}_${id}` : `${prefix}${id}`
        const val = state[key] === 'red' ? '1' : state[key] === 'grey' ? '0' : '-'
        return `${id}-${val}`
      }).join(',')
    }

    const ddStr = getStateCode(largeState, [9, 10, 11, 12, 13, 14, 15, 16], 'lg')
    const mdStr = getStateCode(smallState, [5, 6, 7, 8], 'c')

    return { dd: ddStr, md: mdStr }
  }, [smallState, largeState])

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

  const cycleCounter = useCallback((type: 'small' | 'large', id: string) => {
    if (validationResult !== null) return
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
      cells.forEach(id => {
        newState[`lg_${id}`] = 'grey'
      })
      return newState
    })
  }, [])

  const handleValidate = () => {
    if (!currentSyllogism) return

    const correctEncoding = generateDiagram(currentSyllogism)
    
    const { dd, md } = getStatusCodes()
    const userDD = `DD=${dd}`
    const userMD = `MD=${md}`

    const result = validateUserDiagram(userDD, userMD, correctEncoding)
    setValidationResult(result)

    if (result.isCorrect) {
      AudioEngine.playCorrect()
      const timeTaken = Date.now() - startTime
      const xpGained = Gamification.calculateXP(true, gameState.streak, timeTaken)
      
      let nextXp = gameState.xp + xpGained
      let nextStreak = gameState.streak + 1
      let nextLevel = gameState.level
      let highest = Math.max(gameState.highestStreak, nextStreak)
      let leveledUp = false

      if (Gamification.checkLevelUp(nextXp, nextLevel)) {
        nextLevel++
        leveledUp = true
      }

      const newState = { ...gameState, xp: nextXp, level: nextLevel, streak: nextStreak, highestStreak: highest, hearts: MAX_HEARTS }
      setGameState(newState)
      Gamification.save(newState)
      
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)

      if (leveledUp) {
        AudioEngine.playLevelUp()
        setLevelUpModal(true)
      } else {
        setTimeout(() => pickNextSyllogism(nextLevel), 2000)
      }

    } else {
      AudioEngine.playError()
      let nextHearts = gameState.hearts - 1
      const newState = { ...gameState, streak: 0, hearts: nextHearts }
      
      if (nextHearts <= 0) {
        // Game Over reset for this level
        newState.hearts = MAX_HEARTS
      }
      
      setGameState(newState)
      Gamification.save(newState)
    }
  }


  if (!currentSyllogism) return <div className="text-center pt-20">Loading...</div>

  const xpRequired = Gamification.getNextBoundary(gameState.level)
  const xpPrev = Gamification.getNextBoundary(gameState.level - 1) === Infinity ? 0 : Gamification.getNextBoundary(gameState.level - 1)
  const progressPct = Math.min(100, Math.max(0, ((gameState.xp - xpPrev) / (xpRequired - xpPrev)) * 100)) || 0

  return (
    <main className="page-wrap px-4 pb-8 pt-6 relative min-h-screen">
      {showConfetti && <Confetti />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} onApplyRule={handleApplyRule} />}
      
      {/* Top HUD */}
      <div className="max-w-4xl mx-auto mb-8 bg-[var(--surface)] p-4 rounded-2xl shadow-lg border border-[var(--chip-line)] flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-[var(--lagoon)] text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-black shadow-inner border-4 border-white/20">
            {gameState.level}
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider">{t('campaign.level')}</div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-[var(--palm)]" />
              <span className="font-bold text-[var(--sea-ink)] whitespace-nowrap">{gameState.xp} / {xpRequired} {t('campaign.xp')}</span>
            </div>
            <div className="w-full h-2 bg-[var(--line)] rounded-full mt-1 overflow-hidden min-w-[120px]">
              <div className="h-full bg-gradient-to-r from-[var(--lagoon)] to-[var(--palm)] transition-all duration-500 ease-out" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>
        
        <div className="flex gap-6 items-center">
          <div className="flex flex-col items-center">
             <div className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase">{t('campaign.hearts')}</div>
             <div className="flex gap-1 mt-1">
               {[1, 2, 3].map(h => (
                 <Heart key={h} className={`w-6 h-6 ${h <= gameState.hearts ? 'text-red-500 fill-red-500 animate-pulse' : 'text-gray-300'}`} />
               ))}
             </div>
          </div>
          <div className="flex flex-col items-center">
             <div className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase">{t('quiz.streak')}</div>
             <div className="flex items-center gap-1 mt-1 text-orange-500 font-bold text-lg">
               <TrendingUp className="w-5 h-5" /> {gameState.streak}
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Challenge */}
        <div className="space-y-6">
          <h1 className="text-3xl font-black text-[var(--sea-ink)]">{t('campaign.title')}</h1>
          <p className="text-[var(--sea-ink-soft)] font-medium">{t('campaign.subtitle')}</p>
          <SyllogismSimpleCard syllogism={currentSyllogism} t={t} />

          {/* Status Code / Copy Area */}
          <CopyCode 
            dd={statusCodes.dd} 
            md={statusCodes.md} 
            terms={{
              x: currentSyllogism.terms.minorTerm,
              y: currentSyllogism.terms.majorTerm,
              m: currentSyllogism.terms.middleTerm
            }} 
            syllogismText={formatSyllogismText()} 
            onShowHelp={() => setShowHelp(true)}
          />

          <button
            onClick={handleValidate}
            disabled={validationResult?.isCorrect}
            className={`w-full py-4 rounded-xl font-black text-xl uppercase tracking-widest shadow-lg transition-transform active:scale-95 ${
              validationResult?.isCorrect ? 'bg-[var(--palm)] text-white cursor-default'
              : 'bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)] text-white'
            }`}
          >
            {validationResult?.isCorrect ? t('campaign.perfect') : t('quiz.check_answer')}
          </button>
          
          {validationResult && !validationResult.isCorrect && (
             <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow">
               <h3 className="text-red-800 font-bold">{t('quiz.not_correct')}</h3>
               <button onClick={() => { setValidationResult(null); if (gameState.hearts <= 0) pickNextSyllogism(gameState.level); }} className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded font-semibold text-sm">
                 {gameState.hearts <= 0 ? t('campaign.game_over') : t('campaign.try_again')}
               </button>
             </div>
          )}
        </div>

        {/* Right: Boards */}
        <div className="flex flex-col items-center gap-6">
          <LargeDiagram
            state={largeState}
            onCellClick={(id) => cycleCounter('large', id)}
            minorTerm={currentSyllogism.terms.minorTerm}
            majorTerm={currentSyllogism.terms.majorTerm}
            middleTerm={currentSyllogism.terms.middleTerm}
            t={t}
            isReadOnly={validationResult?.isCorrect}
          />

          <SmallDiagram
            state={smallState}
            onCellClick={(id) => cycleCounter('small', id)}
            minorTerm={currentSyllogism.terms.minorTerm}
            majorTerm={currentSyllogism.terms.majorTerm}
            t={t}
            isReadOnly={validationResult?.isCorrect}
          />
        </div>
      </div>

      {/* Level Up Modal */}
      {levelUpModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[var(--lagoon)] to-[var(--palm)]"></div>
            <Star className="w-20 h-20 text-yellow-400 mx-auto mb-4 drop-shadow-lg" fill="currentColor" />
            <h2 className="text-4xl font-black text-[var(--sea-ink)] mb-2 uppercase tracking-tight">{t('campaign.level_up')}</h2>
            <p className="text-[var(--sea-ink-soft)] font-medium mb-8 text-lg">You reached Level {gameState.level}!</p>
            <button
               onClick={() => { setLevelUpModal(false); pickNextSyllogism(gameState.level); }}
               className="w-full py-4 bg-[var(--lagoon)] hover:bg-[var(--lagoon-deep)] text-white font-black text-xl rounded-xl shadow-lg transition-transform active:scale-95 uppercase tracking-wider"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
