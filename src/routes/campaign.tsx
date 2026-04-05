import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from '../i18n/I18nContext'
import { Heart, TrendingUp, Activity, ShieldAlert, Award } from 'lucide-react'
import {
  SYLLOGISM_EXAMPLES,
  type Syllogism,
  generateDiagram,
  validateUserDiagram,
} from '../lib/logic'
import { Gamification, type GameState, MAX_HEARTS } from '../lib/gamification'
import { AudioEngine } from '../lib/audio'
import Confetti from '../components/Confetti'
import MotivatingText from '../components/MotivatingText'
import { HelpModal } from '../components/HelpModal'
import { CopyCode } from '../components/CopyCode'
import { PropositionLogicSequence } from '../components/PropositionLogicSequence'
import { LargeDiagram } from '../components/LargeDiagram'
import { SmallDiagram } from '../components/SmallDiagram'
import { useSettings } from '../contexts/SettingsContext'
import { type CellState } from '../lib/types'

export const Route = createFileRoute('/campaign')({ component: CampaignRoute })

function CampaignHUD({ gameState, t, xpRequired, progressPct }: any) {
  return (
    <div className="max-w-5xl mx-auto mb-10 bg-[var(--surface-strong)] border-2 border-[var(--line)] rounded overflow-hidden shadow-sm flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[var(--line)]">
      {/* Level Section */}
      <div className="p-4 flex items-center gap-4 bg-[var(--sand)] flex-1">
        <div className="w-12 h-12 bg-[var(--sea-ink)] text-white flex items-center justify-center text-xl font-black rounded border-2 border-white/20">
          {gameState.level}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-end mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--sea-ink-soft)]">{t('campaign.level')} PROGRESS</span>
            <span className="text-[10px] font-mono font-bold text-[var(--sea-ink)]">{gameState.xp} / {xpRequired} XP</span>
          </div>
          <div className="h-2 bg-[var(--foam)] border border-[var(--line)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--lagoon)] transition-all duration-700 ease-out" 
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-4 flex items-center justify-around gap-8 min-w-[300px]">
        <div className="text-center">
          <div className="text-[9px] font-black uppercase text-[var(--sea-ink-soft)] mb-1">Vitality</div>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3].map(h => (
              <div key={h} className={`w-5 h-5 flex items-center justify-center rounded border ${h <= gameState.hearts ? 'bg-[var(--hero-a)] border-[var(--palm)] text-[var(--palm)]' : 'bg-transparent border-[var(--line)] text-[var(--line)]'}`}>
                <Heart size={12} fill={h <= gameState.hearts ? 'currentColor' : 'none'} />
              </div>
            ))}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[9px] font-black uppercase text-[var(--sea-ink-soft)] mb-1 relative inline-flex items-center justify-center">
             Momentum
             {gameState.streak > 2 && (
               <span className="absolute -top-1 -right-3 text-[14px]">🔥</span>
             )}
          </div>
          <div className={`flex items-center justify-center gap-1.5 font-mono font-bold text-sm ${gameState.streak > 2 ? 'text-[#FFD166] drop-shadow-[0_0_8px_rgba(255,209,102,0.6)] scale-110 transition-transform' : 'text-[var(--sea-ink)]'}`}>
            <Activity size={14} className={gameState.streak > 2 ? "text-[#FFD166]" : "text-[var(--lagoon)]"} />
            {gameState.streak}x
          </div>
        </div>
        <div className="text-center">
           <div className="text-[9px] font-black uppercase text-[var(--sea-ink-soft)] mb-1">Archive</div>
           <div className="flex items-center justify-center gap-1.5 font-mono font-bold text-sm text-[var(--sea-ink)]">
             <TrendingUp size={14} className="text-[var(--palm)]" />
             {gameState.highestStreak}
           </div>
        </div>
      </div>
    </div>
  )
}

function SyllogismSimpleCard({ syllogism, t }: { syllogism: Syllogism; t: (key: any) => string }) {
  const { premiseOrder } = useSettings()
  
  const formatProposition = (prop: any) => {
    const getTermColor = (key: string) => {
      if (key === syllogism.terms.minorTerm) return 'var(--term-x)'
      if (key === syllogism.terms.majorTerm) return 'var(--term-y)'
      if (key === syllogism.terms.middleTerm) return 'var(--term-m)'
      return 'inherit'
    }
    const s = <span style={{ color: getTermColor(prop.subject), fontWeight: 700 }}>{t(prop.subject)}</span>
    const p = <span style={{ color: getTermColor(prop.predicate), fontWeight: 700 }}>{t(prop.predicate)}</span>
    const verb = ['fur', 'tail', 'wings', 'hair', 'bloating'].some(w => prop.predicate.includes(w)) ? t('quiz.have') : t('quiz.are')
    
    if (prop.quantifier === 'E') return <>{t('quiz.no_word')} {s} {verb} {p}.</>
    if (prop.quantifier === 'O') return <>{t('quiz.some_word')} {s} {verb} {t('quiz.not_word')} {p}.</>
    if (prop.quantifier === 'A') return <>{t('quiz.all_word')} {s} {verb} {p}.</>
    return <>{t('quiz.some_word')} {s} {verb} {p}.</>
  }

  const items = premiseOrder === 'major-first' 
    ? [{ type: 'major', prop: syllogism.premises.major }, { type: 'minor', prop: syllogism.premises.minor }]
    : [{ type: 'minor', prop: syllogism.premises.minor }, { type: 'major', prop: syllogism.premises.major }]

  return (
    <div className="bg-[var(--surface-strong)] border-2 border-[var(--line)] rounded overflow-hidden shadow-sm">
      <div className="p-3 bg-[var(--sand)] border-b border-[var(--line)] flex justify-between items-center">
         <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-[var(--sea-ink)] text-white text-[9px] font-bold rounded">LEVEL CHALLENGE</span>
            <span className="px-2 py-0.5 bg-white border border-[var(--line)] text-[var(--sea-ink)] text-[9px] font-mono font-bold rounded">
               {syllogism.mood}-{syllogism.figure}
            </span>
         </div>
         <span className="text-[9px] italic font-serif text-[var(--sea-ink-soft)]">{syllogism.mnemonic}</span>
      </div>
      <div className="p-6 space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="pl-4 border-l-4 border-[var(--lagoon)]">
             <p className="text-base font-serif italic text-[var(--sea-ink)] leading-relaxed mb-1">{formatProposition(item.prop)}</p>
             <PropositionLogicSequence prop={item.prop} syllogism={syllogism} />
          </div>
        ))}
        <div className="pl-4 border-l-4 border-[var(--palm)] bg-[var(--hero-a)] p-3 rounded">
           <div className="text-[10px] font-bold text-[var(--palm)] uppercase mb-1">Verification Required ∴</div>
           <p className="text-base font-serif italic text-[var(--sea-ink)] leading-relaxed mb-1">{formatProposition(syllogism.conclusion)}</p>
           <PropositionLogicSequence prop={syllogism.conclusion} syllogism={syllogism} />
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
  const [successTrigger, setSuccessTrigger] = useState(0)
  const [shakeScreen, setShakeScreen] = useState(false)

  // Initialize
  useEffect(() => {
    const saved = Gamification.load()
    setGameState(saved)
    pickNextSyllogism(saved.level)
  }, [])

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
    return { 
      dd: getStateCode(largeState, [9, 10, 11, 12, 13, 14, 15, 16], 'lg'), 
      md: getStateCode(smallState, [5, 6, 7, 8], 'c') 
    }
  }, [smallState, largeState])

  const statusCodes = getStatusCodes()

  const handleValidate = () => {
    if (!currentSyllogism) return
    const correctEncoding = generateDiagram(currentSyllogism)
    const { dd, md } = getStatusCodes()
    const result = validateUserDiagram(`DD=${dd}`, `MD=${md}`, correctEncoding)
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
        nextLevel++; leveledUp = true
      }

      const newState = { ...gameState, xp: nextXp, level: nextLevel, streak: nextStreak, highestStreak: highest, hearts: MAX_HEARTS }
      setGameState(newState); Gamification.save(newState)
      
      setShowConfetti(true)
      setSuccessTrigger(prev => prev + 1)
      setTimeout(() => setShowConfetti(false), 5000)

      if (leveledUp) {
        AudioEngine.playLevelUp(); setLevelUpModal(true)
      } else {
        setTimeout(() => pickNextSyllogism(nextLevel), 2000)
      }
    } else {
      AudioEngine.playError()
      setShakeScreen(true)
      setTimeout(() => setShakeScreen(false), 500)
      
      let nextHearts = gameState.hearts - 1
      const newState = { ...gameState, streak: 0, hearts: nextHearts }
      if (nextHearts <= 0) newState.hearts = MAX_HEARTS
      setGameState(newState); Gamification.save(newState)
    }
  }

  if (!currentSyllogism) return <div className="text-center pt-20 font-mono opacity-50">Transmitting Challenge...</div>

  const xpRequired = Gamification.getNextBoundary(gameState.level)
  const xpPrev = Gamification.getNextBoundary(gameState.level - 1) === Infinity ? 0 : Gamification.getNextBoundary(gameState.level - 1)
  const progressPct = Math.min(100, Math.max(0, ((gameState.xp - xpPrev) / (xpRequired - xpPrev)) * 100)) || 0

  return (
    <main className={`page-wrap px-4 pb-20 pt-8 min-h-screen ${shakeScreen ? 'animate-shake' : ''}`}>
      {showConfetti && <Confetti />}
      <MotivatingText triggerId={successTrigger} />
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} onApplyRule={(cells) => setLargeState(p => { const n={...p}; cells.forEach(c => n[`lg_${c}`]='grey'); return n })} />}
      
      {/* HUD Overview */}
      <CampaignHUD 
        gameState={gameState} 
        t={t} 
        xpRequired={xpRequired} 
        progressPct={progressPct} 
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Challenge & Controls */}
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[var(--lagoon)]">
               <ShieldAlert size={20} />
               <span className="text-xs font-black uppercase tracking-widest font-mono">Mission Control</span>
            </div>
            <h1 className="text-4xl font-black text-[var(--sea-ink)] leading-none italic" style={{ fontFamily: 'var(--font-serif)' }}>
              Journey of Reason
            </h1>
          </div>

          <SyllogismSimpleCard syllogism={currentSyllogism} t={t} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button
               onClick={handleValidate}
               disabled={validationResult?.isCorrect}
               className={`py-4 rounded font-bold uppercase tracking-widest text-sm transition-all shadow-md active:scale-[0.98] ${
                 validationResult?.isCorrect ? 'bg-[var(--palm)] text-white' : 'bg-[var(--lagoon)] text-white hover:brightness-110'
               }`}
             >
               {validationResult?.isCorrect ? 'Logic Verified' : 'Submit Proof'}
             </button>
             <button
               onClick={() => { setLargeState({}); setSmallState({}); setValidationResult(null); }}
               disabled={validationResult?.isCorrect}
               className="py-4 bg-[var(--foam)] border-2 border-[var(--line)] text-[var(--sea-ink)] rounded font-bold uppercase tracking-widest text-sm hover:bg-[var(--sand)] transition-all"
             >
               Clear Slate
             </button>
          </div>
          
          {validationResult && !validationResult.isCorrect && (
             <div className="bg-red-50 border-2 border-red-200 p-4 rounded flex items-center gap-4 animate-in slide-in-from-top-2">
                <div className="w-10 h-10 bg-red-100 text-red-600 flex items-center justify-center rounded-full shrink-0">!</div>
                <div>
                   <h3 className="text-red-900 font-bold text-sm">Contradiction Detected</h3>
                   <p className="text-red-700 text-xs">Verify your cell counters and try again.</p>
                </div>
             </div>
          )}

          <CopyCode
            dd={statusCodes.dd}
            md={statusCodes.md}
            terms={{ x: currentSyllogism.terms.minorTerm, y: currentSyllogism.terms.majorTerm, m: currentSyllogism.terms.middleTerm }}
            syllogismText={getFullSyllogismText()}
            onShowHelp={() => setShowHelp(true)}
          />
        </div>

        {/* Technical Schematics */}
        <div className="flex flex-col items-center gap-10">
           <div className="bg-white p-8 border-2 border-[var(--line)] rounded-lg shadow-inner">
              <LargeDiagram
                state={largeState}
                onCellClick={(id) => setLargeState(prev => {
                  const key = id; const cur = prev[key] || null
                  const next = cur === null ? 'red' : cur === 'red' ? 'grey' : null
                  const n = { ...prev }; if (next) n[key] = next; else delete n[key]; return n
                })}
                minorTerm={currentSyllogism.terms.minorTerm}
                majorTerm={currentSyllogism.terms.majorTerm}
                middleTerm={currentSyllogism.terms.middleTerm}
                t={t}
                isReadOnly={validationResult?.isCorrect}
              />
           </div>
           <div className="bg-white p-8 border-2 border-[var(--line)] rounded-lg shadow-inner">
              <SmallDiagram
                state={smallState}
                onCellClick={(id) => setSmallState(prev => {
                  const key = id; const cur = prev[key] || null
                  const next = cur === null ? 'red' : cur === 'red' ? 'grey' : null
                  const n = { ...prev }; if (next) n[key] = next; else delete n[key]; return n
                })}
                minorTerm={currentSyllogism.terms.minorTerm}
                majorTerm={currentSyllogism.terms.majorTerm}
                t={t}
                isReadOnly={validationResult?.isCorrect}
              />
           </div>
        </div>
      </div>

      {/* Promotion Modal */}
      {levelUpModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--surface)] rounded border-4 border-[var(--lagoon)] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-[var(--lagoon)] text-white mx-auto mb-6 flex items-center justify-center rounded transform rotate-3 shadow-lg">
               <Award size={48} />
            </div>
            <h2 className="text-3xl font-black text-[var(--sea-ink)] mb-2 uppercase tracking-tighter">Level {gameState.level}</h2>
            <div className="text-[10px] font-black uppercase text-[var(--lagoon)] tracking-[0.3em] mb-6">Promotion Verified</div>
            <p className="text-[var(--sea-ink-soft)] font-serif italic mb-8">
               "Logical advancement proceeds with clinical precision. Continue your investigation."
            </p>
            <button
               onClick={() => { setLevelUpModal(false); pickNextSyllogism(gameState.level); }}
               className="w-full py-4 bg-[var(--sea-ink)] hover:bg-black text-white font-bold rounded uppercase tracking-widest text-xs transition-all shadow-md active:scale-95"
            >
              Next Directive
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
