import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from '../i18n/I18nContext'
import { Award, Target, Zap, ShieldCheck } from 'lucide-react'
import {
  SYLLOGISM_EXAMPLES,
  type Syllogism,
  generateDiagram,
  validateUserDiagram,
} from '../lib/logic'
import { HelpModal } from '../components/HelpModal'
import { CopyCode } from '../components/CopyCode'
import { PropositionLogicSequence } from '../components/PropositionLogicSequence'
import { LargeDiagram } from '../components/LargeDiagram'
import { SmallDiagram } from '../components/SmallDiagram'
import { useSettings } from '../contexts/SettingsContext'
import { type CellState } from '../lib/types'

export const Route = createFileRoute('/game')({ component: Game })

// ----------------------------------------------------------------------------
// TYPES & CONSTANTS
// ----------------------------------------------------------------------------

interface Badge { id: string; name: string; description: string; icon: any; unlocked: boolean; requirement: number }
interface GameHistoryEntry { id: string; date: string; syllogism: string; score: number; correct: boolean; timeSpent: number }
interface GameState {
  totalScore: number
  streak: number
  bestStreak: number
  gamesPlayed: number
  gamesWon: number
  currentLevel: number
  xp: number
  xpToNextLevel: number
  badges: Badge[]
  history: GameHistoryEntry[]
}

const BADGES: Badge[] = [
  { id: 'first_win', name: 'Initiate', description: 'Complete first verification', icon: Target, unlocked: false, requirement: 1 },
  { id: 'win_10', name: 'Logician', description: 'Complete 10 verifications', icon: ShieldCheck, unlocked: false, requirement: 10 },
  { id: 'win_25', name: 'Scholar', description: 'Complete 25 verifications', icon: Award, unlocked: false, requirement: 25 },
  { id: 'streak_5', name: 'Momentum', description: 'Maintain 5-streak', icon: Zap, unlocked: false, requirement: 5 },
]

const STORAGE_KEY = 'logic-game-progress'

// ----------------------------------------------------------------------------
// UTILS
// ----------------------------------------------------------------------------

function loadGameState(): GameState {
  if (typeof window === 'undefined') return getInitialState()
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...getInitialState(), ...parsed }
    }
  } catch (e) { console.error(e) }
  return getInitialState()
}

function getInitialState(): GameState {
  return {
    totalScore: 0,
    streak: 0,
    bestStreak: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    currentLevel: 1,
    xp: 0,
    xpToNextLevel: 100,
    badges: BADGES,
    history: [],
  }
}

function saveGameState(state: GameState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch (e) { console.error(e) }
}

function playSound(type: 'correct' | 'wrong' | 'click') {
  if (typeof window === 'undefined') return
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    oscillator.connect(gainNode); gainNode.connect(audioContext.destination)
    if (type === 'correct') {
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(783, audioContext.currentTime + 0.1)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    } else if (type === 'wrong') {
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    } else {
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime)
    }
    oscillator.start(); oscillator.stop(audioContext.currentTime + 0.2)
  } catch (e) {}
}

// ----------------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------------

function GameHUD({ state }: { state: GameState }) {
  const progress = (state.xp / state.xpToNextLevel) * 100
  return (
    <div className="max-w-6xl mx-auto mb-10 bg-[var(--surface-strong)] border-2 border-[var(--line)] rounded overflow-hidden shadow-sm flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[var(--line)]">
      <div className="p-4 flex items-center gap-4 bg-[var(--sand)] flex-1">
        <div className="w-12 h-12 bg-[var(--sea-ink)] text-white flex items-center justify-center text-xl font-black rounded border-2 border-white/20">
          {state.currentLevel}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-end mb-1">
            <span className="text-[9px] font-black uppercase text-[var(--sea-ink-soft)]">Logic Grade</span>
            <span className="text-[10px] font-mono font-bold text-[var(--sea-ink)]">{state.xp} / {state.xpToNextLevel} XP</span>
          </div>
          <div className="h-1.5 bg-[var(--foam)] border border-[var(--line)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--lagoon)] transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
      <div className="p-4 grid grid-cols-3 gap-8 min-w-[320px] bg-white">
        <div className="text-center">
          <div className="text-[9px] font-black uppercase text-[var(--sea-ink-soft)] mb-1">Archives</div>
          <div className="text-xl font-black text-[var(--sea-ink)]">{state.gamesWon}</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] font-black uppercase text-[var(--sea-ink-soft)] mb-1">Streak</div>
          <div className="text-xl font-black text-[var(--palm)]">{state.streak}x</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] font-black uppercase text-[var(--sea-ink-soft)] mb-1">Total XP</div>
          <div className="text-xl font-black text-[var(--lagoon)]">{state.totalScore}</div>
        </div>
      </div>
    </div>
  )
}

function BadgeGallery({ badges }: { badges: Badge[] }) {
  return (
    <div className="max-w-6xl mx-auto mb-10 grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map(b => (
        <div key={b.id} className={`p-4 border-2 rounded flex items-center gap-3 transition-all ${b.unlocked ? 'bg-white border-[var(--palm)] opacity-100' : 'bg-[var(--foam)] border-[var(--line)] opacity-40'}`}>
          <div className={`p-2 rounded ${b.unlocked ? 'bg-[var(--hero-a)] text-[var(--palm)]' : 'bg-[var(--sand)] text-[var(--sea-ink-soft)]'}`}>
            <b.icon size={18} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-[var(--sea-ink)] leading-none mb-0.5">{b.name}</div>
            <div className="text-[8px] font-medium text-[var(--sea-ink-soft)] uppercase tracking-tighter leading-none">{b.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function SyllogismPanel({ syllogism, t, premiseOrder }: { syllogism: Syllogism; t: any; premiseOrder: string }) {
  const formatProp = (prop: any) => {
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
         <span className="text-[10px] font-black uppercase text-[var(--sea-ink-soft)] font-mono">Game Variant</span>
         <span className="px-2 py-0.5 bg-white border border-[var(--line)] text-[var(--sea-ink)] text-[9px] font-mono font-bold rounded">
           {syllogism.mood}-{syllogism.figure}
         </span>
      </div>
      <div className="p-6 space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="pl-4 border-l-4 border-[var(--lagoon)]">
             <p className="text-base font-serif italic text-[var(--sea-ink)] leading-relaxed mb-1">{formatProp(item.prop)}</p>
             <PropositionLogicSequence prop={item.prop} syllogism={syllogism} />
          </div>
        ))}
        <div className="pl-4 border-l-4 border-[var(--palm)] bg-[var(--hero-a)] p-3 rounded">
           <div className="text-[10px] font-bold text-[var(--palm)] uppercase mb-1">Conclusion ∴</div>
           <p className="text-base font-serif italic text-[var(--sea-ink)] leading-relaxed mb-1">{formatProp(syllogism.conclusion)}</p>
           <PropositionLogicSequence prop={syllogism.conclusion} syllogism={syllogism} />
        </div>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------------------
// PAGE COMPONENT
// ----------------------------------------------------------------------------

function Game() {
  const { t } = useTranslation()
  const { premiseOrder } = useSettings()
  const [gameState, setGameState] = useState<GameState>(getInitialState)
  const [currentSyllogism, setCurrentSyllogism] = useState<Syllogism | null>(null)
  const [largeState, setLargeState] = useState<CellState>({})
  const [smallState, setSmallState] = useState<CellState>({})
  const [isComplete, setIsComplete] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [showHelp, setShowHelp] = useState(false)

  const startNewGame = useCallback(() => {
    const random = SYLLOGISM_EXAMPLES[Math.floor(Math.random() * SYLLOGISM_EXAMPLES.length)]
    setCurrentSyllogism(random); setLargeState({}); setSmallState({}); setIsComplete(false); setIsCorrect(null); setStartTime(Date.now())
  }, [])

  useEffect(() => { setGameState(loadGameState()); startNewGame() }, [startNewGame])
  useEffect(() => { if (gameState.gamesPlayed > 0) saveGameState(gameState) }, [gameState])

  const handleValidate = () => {
    if (!currentSyllogism || isComplete) return
    const correctEncoding = generateDiagram(currentSyllogism)
    const getStateCode = (state: CellState, cellIds: number[], prefix: string) => {
      return cellIds.map(id => {
        const key = prefix === 'lg' ? `${prefix}_${id}` : `c${id}`
        const val = state[key] === 'red' ? '1' : state[key] === 'grey' ? '0' : '-'
        return `${id}-${val}`
      }).join(',')
    }
    const userDD = `DD=${getStateCode(largeState, [9, 10, 11, 12, 13, 14, 15, 16], 'lg')}`
    const userMD = `MD=${getStateCode(smallState, [5, 6, 7, 8], 'c')}`
    const result = validateUserDiagram(userDD, userMD, correctEncoding)
    const correct = result.isCorrect; setIsComplete(true); setIsCorrect(correct)
    
    if (correct) {
      playSound('correct')
      const xpGained = 15 + (gameState.streak * 5)
      let nextXp = gameState.xp + xpGained; let nextLevel = gameState.currentLevel; let nextXpToNext = gameState.xpToNextLevel
      if (nextXp >= nextXpToNext) { nextLevel++; nextXp -= nextXpToNext; nextXpToNext = Math.floor(nextXpToNext * 1.5) }
      
      const newBadges = gameState.badges.map(b => {
        if (b.unlocked) return b
        if (b.id === 'first_win' && gameState.gamesWon + 1 >= 1) return { ...b, unlocked: true }
        if (b.id === 'win_10' && gameState.gamesWon + 1 >= 10) return { ...b, unlocked: true }
        if (b.id === 'streak_5' && gameState.streak + 1 >= 5) return { ...b, unlocked: true }
        return b
      })

      const timeSpent = (Date.now() - startTime) / 1000
      setGameState(prev => ({
        ...prev, totalScore: prev.totalScore + xpGained, streak: prev.streak + 1,
        bestStreak: Math.max(prev.streak + 1, prev.bestStreak), gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: prev.gamesWon + 1, xp: nextXp, currentLevel: nextLevel, xpToNextLevel: nextXpToNext, badges: newBadges,
        history: [{ id: Date.now().toString(), date: new Date().toISOString(), syllogism: `${currentSyllogism!.figure}-${currentSyllogism!.mood}`, score: xpGained, correct: true, timeSpent }, ...prev.history.slice(0, 49)]
      }))
    } else {
      playSound('wrong')
      const timeSpent = (Date.now() - startTime) / 1000
      setGameState(prev => ({ ...prev, streak: 0, gamesPlayed: prev.gamesPlayed + 1,
        history: [{ id: Date.now().toString(), date: new Date().toISOString(), syllogism: `${currentSyllogism!.figure}-${currentSyllogism!.mood}`, score: 0, correct: false, timeSpent }, ...prev.history.slice(0, 49)]
      }))
    }
  }

  if (!currentSyllogism) return null

  return (
    <main className="page-wrap px-4 pb-20 pt-8 min-h-screen">
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} onApplyRule={(cells) => setLargeState(p => { const n={...p}; cells.forEach(c => n[`lg_${c}`]='grey'); return n })} />}
      
      <GameHUD state={gameState} />
      <BadgeGallery badges={gameState.badges} />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[var(--lagoon)]">
               <ShieldCheck size={20} />
               <span className="text-xs font-black uppercase tracking-widest font-mono">Formal Verification</span>
            </div>
            <h1 className="text-4xl font-black text-[var(--sea-ink)] leading-none italic" style={{ fontFamily: 'var(--font-serif)' }}>
              Syllogism Laboratory
            </h1>
          </div>

          <SyllogismPanel syllogism={currentSyllogism} t={t} premiseOrder={premiseOrder} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button
               onClick={handleValidate}
               disabled={isComplete}
               className={`py-4 rounded font-bold uppercase tracking-widest text-sm transition-all shadow-md ${
                 isComplete ? (isCorrect ? 'bg-[var(--palm)] text-white' : 'bg-red-600 text-white') : 'bg-[var(--lagoon)] text-white hover:brightness-110'
               }`}
             >
               {isComplete ? (isCorrect ? 'VERIFIED ✓' : 'ABORTED ✗') : 'Validate Logic'}
             </button>
             <button
               onClick={startNewGame}
               className="py-4 bg-[var(--foam)] border-2 border-[var(--line)] text-[var(--sea-ink)] rounded font-bold uppercase tracking-widest text-sm hover:bg-[var(--sand)] transition-all"
             >
               Next Sample
             </button>
          </div>

          <CopyCode 
            dd={`DD=${[9,10,11,12,13,14,15,16].map(id => `${id}-${largeState['lg_'+id]==='red'?'1':largeState['lg_'+id]==='grey'?'0':'-'}`).join(',')}`}
            md={`MD=${[5,6,7,8].map(id => `${id}-${smallState['c'+id]==='red'?'1':smallState['c'+id]==='grey'?'0':'-'}`).join(',')}`}
            terms={{ x: currentSyllogism.terms.minorTerm, y: currentSyllogism.terms.majorTerm, m: currentSyllogism.terms.middleTerm }}
            onShowHelp={() => setShowHelp(true)}
          />
        </div>

        <div className="flex flex-col items-center gap-10">
           <div className="bg-white p-8 border-2 border-[var(--line)] rounded-lg shadow-inner">
              <LargeDiagram
                state={largeState}
                onCellClick={(id) => {
                  if (isComplete) return
                  setLargeState(prev => {
                    const key = id; const cur = prev[key] || null
                    const next = cur === null ? 'red' : cur === 'red' ? 'grey' : null
                    const n = { ...prev }; if (next) n[key] = next; else delete n[key]; return n
                  })
                }}
                minorTerm={currentSyllogism.terms.minorTerm} majorTerm={currentSyllogism.terms.majorTerm} middleTerm={currentSyllogism.terms.middleTerm} t={t}
              />
           </div>
           <div className="bg-white p-8 border-2 border-[var(--line)] rounded-lg shadow-inner">
              <SmallDiagram
                state={smallState}
                onCellClick={(id) => {
                  if (isComplete) return
                  setSmallState(prev => {
                    const key = id; const cur = prev[key] || null
                    const next = cur === null ? 'red' : cur === 'red' ? 'grey' : null
                    const n = { ...prev }; if (next) n[key] = next; else delete n[key]; return n
                  })
                }}
                minorTerm={currentSyllogism.terms.minorTerm} majorTerm={currentSyllogism.terms.majorTerm} t={t}
              />
           </div>
        </div>
      </div>
    </main>
  )
}
