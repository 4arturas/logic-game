import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { useTranslation } from '../i18n/I18nContext'
import {
  SYLLOGISM_EXAMPLES,
  type Syllogism,
  generateDiagram,
  validateUserDiagram,
} from '../../logic'
import { HelpModal } from '../components/HelpModal'
import { CopyCode } from '../components/CopyCode'
import { PropositionLogicSequence } from '../components/PropositionLogicSequence'

export const Route = createFileRoute('/game')({ component: Game })

type CounterState = 'red' | 'grey' | null

interface CellState {
  [id: string]: CounterState
}

interface Terms {
  x: string
  y: string
  m: string
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  requirement: number
}

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

interface GameHistoryEntry {
  id: string
  date: string
  syllogism: string
  score: number
  correct: boolean
  timeSpent: number
}

const BADGES: Badge[] = [
  { id: 'first_win', name: 'First Steps', description: 'Win your first game', icon: '🌟', unlocked: false, requirement: 1 },
  { id: 'win_10', name: 'Dedicated', description: 'Win 10 games', icon: '🏆', unlocked: false, requirement: 10 },
  { id: 'win_25', name: 'Logic Master', description: 'Win 25 games', icon: '👑', unlocked: false, requirement: 25 },
  { id: 'win_50', name: 'Carroll Expert', description: 'Win 50 games', icon: '🎓', unlocked: false, requirement: 50 },
  { id: 'streak_5', name: 'On Fire', description: 'Get a 5-game streak', icon: '🔥', unlocked: false, requirement: 5 },
  { id: 'streak_10', name: 'Unstoppable', description: 'Get a 10-game streak', icon: '💫', unlocked: false, requirement: 10 },
  { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐', unlocked: false, requirement: 5 },
  { id: 'level_10', name: 'Legend', description: 'Reach level 10', icon: '🌈', unlocked: false, requirement: 10 },
]

const STORAGE_KEY = 'logic-game-progress'

function loadGameState(): GameState {
  if (typeof window === 'undefined') {
    return getInitialState()
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...getInitialState(),
        ...parsed,
        badges: parsed.badges || BADGES,
      }
    }
  } catch (e) {
    console.error('Failed to load game state:', e)
  }
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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save game state:', e)
  }
}

function checkBadges(state: GameState): Badge[] {
  return state.badges.map(badge => {
    if (badge.unlocked) return badge
    
    let unlocked = false
    switch (badge.id) {
      case 'first_win':
        unlocked = state.gamesWon >= badge.requirement
        break
      case 'win_10':
        unlocked = state.gamesWon >= badge.requirement
        break
      case 'win_25':
        unlocked = state.gamesWon >= badge.requirement
        break
      case 'win_50':
        unlocked = state.gamesWon >= badge.requirement
        break
      case 'streak_5':
        unlocked = state.bestStreak >= badge.requirement
        break
      case 'streak_10':
        unlocked = state.bestStreak >= badge.requirement
        break
      case 'level_5':
        unlocked = state.currentLevel >= badge.requirement
        break
      case 'level_10':
        unlocked = state.currentLevel >= badge.requirement
        break
    }
    
    return { ...badge, unlocked }
  })
}

// Sound effects using Web Audio API
function playSound(type: 'correct' | 'wrong' | 'badge' | 'level' | 'click') {
  if (typeof window === 'undefined') return
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    switch (type) {
      case 'correct':
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1)
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
        break
      case 'wrong':
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.2)
        break
      case 'badge':
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime + 0.15)
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.3)
        oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.45)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.6)
        break
      case 'level':
        [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
          const osc = audioContext.createOscillator()
          const gain = audioContext.createGain()
          osc.connect(gain)
          gain.connect(audioContext.destination)
          osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.1)
          gain.gain.setValueAtTime(0.3, audioContext.currentTime + i * 0.1)
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.2)
          osc.start(audioContext.currentTime + i * 0.1)
          osc.stop(audioContext.currentTime + i * 0.1 + 0.2)
        })
        break
      case 'click':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.05)
        break
    }
  } catch (e) {
    console.error('Failed to play sound:', e)
  }
}

// ----------------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------------

function ProgressBar({ value, max, color = 'bg-[var(--lagoon)]' }: { value: number; max: number; color?: string }) {
  const percentage = Math.min(100, (value / max) * 100)
  return (
    <div className="w-full bg-[var(--sand)] rounded-full h-3 overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

function LevelBadge({ level }: { level: number }) {
  const icons = ['🌱', '🌿', '🌳', '⭐', '🌟', '💫', '🏆', '👑', '💎', '🌈']
  const icon = icons[Math.min(level - 1, icons.length - 1)]
  
  return (
    <div className="text-center">
      <div className="text-4xl mb-1">{icon}</div>
      <div className="text-sm font-bold text-[var(--sea-ink)]">Level {level}</div>
    </div>
  )
}

function BadgeDisplay({ badge, isNew }: { badge: Badge; isNew?: boolean }) {
  return (
    <div className={`relative p-3 rounded-lg border-2 transition-all duration-300 ${
      badge.unlocked 
        ? 'bg-[var(--surface)] border-[var(--lagoon)]' 
        : 'bg-[var(--sand)] border-[var(--line)] opacity-50'
    } ${isNew ? 'animate-bounce' : ''}`}>
      <div className="text-3xl text-center mb-1">{badge.icon}</div>
      <div className="text-xs font-bold text-center text-[var(--sea-ink)]">{badge.name}</div>
      <div className="text-[10px] text-center text-[var(--sea-ink-soft)]">{badge.description}</div>
      {badge.unlocked && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--lagoon)] rounded-full flex items-center justify-center text-[8px] text-white">✓</div>
      )}
    </div>
  )
}

function NewBadgeModal({ badge, onClose }: { badge: Badge; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-[var(--surface)] p-8 rounded-2xl shadow-2xl border-4 border-[var(--lagoon)] animate-scale-in text-center">
        <div className="text-6xl mb-4 animate-bounce">{badge.icon}</div>
        <h2 className="text-2xl font-bold text-[var(--palm)] mb-2">New Badge Unlocked!</h2>
        <p className="text-lg font-semibold text-[var(--sea-ink)]">{badge.name}</p>
        <p className="text-sm text-[var(--sea-ink-soft)]">{badge.description}</p>
      </div>
    </div>
  )
}

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-full animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            backgroundColor: ['#4fb8b2', '#2f6a4a', '#e7f0e8', '#f3faf5'][Math.floor(Math.random() * 4)],
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

// ----------------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------------

function Game() {
  const { t } = useTranslation()
  const [gameState, setGameState] = useState<GameState>(getInitialState)
  const [currentSyllogism, setCurrentSyllogism] = useState<Syllogism | null>(null)
  const [terms, setTerms] = useState<Terms>({ x: '', y: '', m: '' })
  const [largeState, setLargeState] = useState<CellState>({})
  const [smallState, setSmallState] = useState<CellState>({})
  const [isComplete, setIsComplete] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const [newBadge, setNewBadge] = useState<Badge | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showBadges, setShowBadges] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const correctEncoding = useMemo(() => {
    if (!currentSyllogism) return null
    return generateDiagram(currentSyllogism)
  }, [currentSyllogism])

  // Load game state on mount
  useEffect(() => {
    setGameState(loadGameState())
    startNewGame()
  }, [])

  // Save game state when it changes
  useEffect(() => {
    if (gameState.gamesPlayed > 0) {
      saveGameState(gameState)
    }
  }, [gameState])

  const startNewGame = useCallback(() => {
    const shuffled = [...SYLLOGISM_EXAMPLES].sort(() => Math.random() - 0.5)
    const syllogism = shuffled[0]
    setCurrentSyllogism(syllogism)
    setTerms({
      x: syllogism.terms.minorTerm,
      y: syllogism.terms.majorTerm,
      m: syllogism.terms.middleTerm,
    })
    setLargeState({})
    setSmallState({})
    setIsComplete(false)
    setIsCorrect(null)
    setStartTime(Date.now())
  }, [])

  const cycleCounter = useCallback((type: 'small' | 'large', id: string) => {
    if (isComplete) return
    playSound('click')

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
  }, [isComplete])

  const handleValidate = useCallback(() => {
    if (!correctEncoding || isComplete) return

    const getStateCode = (state: CellState, cellIds: number[], prefix: string) => {
      return cellIds
        .map(id => {
          const key = `${prefix}_${id}`
          const val = state[key] === 'red' ? '1' : state[key] === 'grey' ? '0' : '-'
          return `${id}-${val}`
        })
        .join(',')
    }

    const userDD = `DD=${getStateCode(largeState, [9, 10, 11, 12, 13, 14, 15, 16], 'lg')}`
    const userMD = `MD=${getStateCode(smallState, [5, 6, 7, 8], 'c')}`

    const result = validateUserDiagram(userDD, userMD, correctEncoding)
    const correct = result.isCorrect
    const timeSpent = (Date.now() - startTime) / 1000

    setIsComplete(true)
    setIsCorrect(correct)

    if (correct) {
      playSound('correct')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)

      const xpGained = 10 + Math.floor(gameState.streak * 2)
      const newTotalScore = gameState.totalScore + 10 + gameState.streak
      const newStreak = gameState.streak + 1
      const newGamesWon = gameState.gamesWon + 1
      const newXp = gameState.xp + xpGained
      const levelUp = newXp >= gameState.xpToNextLevel

      let newGameState: GameState = {
        ...gameState,
        totalScore: newTotalScore,
        streak: newStreak,
        bestStreak: Math.max(newStreak, gameState.bestStreak),
        gamesPlayed: gameState.gamesPlayed + 1,
        gamesWon: newGamesWon,
        xp: newXp,
        history: [
          {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            syllogism: `${currentSyllogism!.figure}-${currentSyllogism!.mood}`,
            score: 10 + gameState.streak,
            correct: true,
            timeSpent,
          },
          ...gameState.history.slice(0, 49),
        ],
      }

      if (levelUp) {
        playSound('level')
        newGameState = {
          ...newGameState,
          currentLevel: gameState.currentLevel + 1,
          xp: newXp - gameState.xpToNextLevel,
          xpToNextLevel: Math.floor(gameState.xpToNextLevel * 1.5),
        }
      }

      const updatedBadges = checkBadges(newGameState)
      const newBadges = updatedBadges.filter(b => b.unlocked && !gameState.badges.find(b2 => b2.id === b.id && b2.unlocked))
      
      newGameState.badges = updatedBadges
      setGameState(newGameState)

      if (newBadges.length > 0) {
        setNewBadge(newBadges[0])
        playSound('badge')
      }
    } else {
      playSound('wrong')
      setGameState({
        ...gameState,
        streak: 0,
        gamesPlayed: gameState.gamesPlayed + 1,
        history: [
          {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            syllogism: `${currentSyllogism!.figure}-${currentSyllogism!.mood}`,
            score: 0,
            correct: false,
            timeSpent,
          },
          ...gameState.history.slice(0, 49),
        ],
      })
    }
  }, [correctEncoding, largeState, smallState, isComplete, startTime, gameState, currentSyllogism])

  const handleApplyRule = useCallback((cells: number[]) => {
    playSound('click')
    setLargeState(prev => {
      const newState = { ...prev }
      cells.forEach(id => {
        newState[`lg_${id}`] = 'grey'
      })
      return newState
    })
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

  const statusCodes = useMemo(() => getStatusCodes(), [getStatusCodes])

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

  const renderCounters = (state: CellState, type: 'small' | 'large') => {
    const cells = type === 'large' ? largeCells : smallCells
    return Object.entries(state).map(([id, counterState]) => {
      const cell = cells.find(c => c.id === id)
      if (!cell || !counterState) return null
      const radius = type === 'large' ? 12 : 16
      const fill = counterState === 'red' ? '#dc2626' : '#6b7280'
      const text = counterState === 'red' ? '1' : '0'
      return (
        <g key={id} className="pointer-events-none select-none">
          <circle cx={cell.cx} cy={cell.cy} r={radius} fill={fill} stroke="rgba(0,0,0,0.5)" strokeWidth="2" />
          <text x={cell.cx} y={cell.cy + radius / 3} textAnchor="middle" fill="white" className="font-bold" style={{ fontSize: type === 'large' ? '10px' : '12px', fontFamily: 'Arial, sans-serif' }}>
            {text}
          </text>
        </g>
      )
    })
  }

  if (!currentSyllogism) {
    return (
      <main className="page-wrap px-4 pb-8 pt-14">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-gray-500">{t('quiz.loading')}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      {showConfetti && <Confetti />}
      {newBadge && <NewBadgeModal badge={newBadge} onClose={() => setNewBadge(null)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} onApplyRule={handleApplyRule} />}

      <div className="max-w-[90vw] mx-auto">
        {/* Header with Level and Stats */}
        <div className="bg-[var(--surface)] p-6 rounded-xl shadow-lg border-2 border-[var(--chip-line)] mb-6">
          <div className="flex items-center justify-between mb-4">
            <LevelBadge level={gameState.currentLevel} />
            <div className="flex-1 mx-8">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--sea-ink-soft)]">XP</span>
                <span className="text-[var(--sea-ink)] font-bold">{gameState.xp} / {gameState.xpToNextLevel}</span>
              </div>
              <ProgressBar value={gameState.xp} max={gameState.xpToNextLevel} />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[var(--lagoon)]">{gameState.totalScore}</div>
              <div className="text-sm text-[var(--sea-ink-soft)]">Total Score</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[var(--palm)]">{gameState.gamesWon}/{gameState.gamesPlayed}</div>
              <div className="text-xs text-[var(--sea-ink-soft)]">Games Won</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500">{gameState.streak} 🔥</div>
              <div className="text-xs text-[var(--sea-ink-soft)]">Current Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--lagoon-deep)]">{gameState.bestStreak}</div>
              <div className="text-xs text-[var(--sea-ink-soft)]">Best Streak</div>
            </div>
            <div>
              <button 
                onClick={() => setShowBadges(!showBadges)}
                className="text-2xl hover:scale-110 transition-transform"
              >
                🏅
              </button>
              <div className="text-xs text-[var(--sea-ink-soft)]">Badges</div>
            </div>
          </div>
        </div>

        {/* Badges Panel */}
        {showBadges && (
          <div className="bg-[var(--surface)] p-6 rounded-xl shadow-lg border-2 border-[var(--chip-line)] mb-6">
            <h3 className="text-xl font-bold text-[var(--sea-ink)] mb-4">Your Badges</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {gameState.badges.map(badge => (
                <BadgeDisplay key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Syllogism and Controls */}
          <div className="space-y-4">
            {/* Syllogism Card */}
            <div className="bg-[var(--surface)] p-4 rounded-xl shadow-md border border-[var(--chip-line)]">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[var(--lagoon)] text-white px-2 py-1 rounded-full text-xs font-bold">
                  Figure {currentSyllogism.figure}
                </span>
                <span className="bg-[var(--foam)] text-[var(--palm)] px-2 py-1 rounded-full text-xs font-mono font-bold border border-[var(--chip-line)]">
                  {currentSyllogism.mood}
                </span>
              </div>
              <div className="space-y-4 text-sm mt-4">
                <div className="bg-[var(--foam)] p-3 rounded-lg border border-[var(--chip-line)]">
                  <span className="text-xs text-[var(--lagoon)] font-semibold">Major Premise:</span>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-2 mt-1">
                    <p className="text-[var(--sea-ink)] text-center md:text-left">
                      <span style={{ color: 'var(--term-m)', fontWeight: 'bold', textDecoration: 'underline' }}>{t(currentSyllogism.premises.major.subject as any)}</span> - <span style={{ color: 'var(--term-y)', fontWeight: 'bold', textDecoration: 'underline' }}>{t(currentSyllogism.premises.major.predicate as any)}</span>
                    </p>
                    <div className="bg-white/60 px-3 rounded text-sm border border-dashed border-[var(--lagoon)] shadow-sm scale-90 origin-right">
                      <PropositionLogicSequence prop={currentSyllogism.premises.major} syllogism={currentSyllogism} />
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--foam)] p-3 rounded-lg border border-[var(--chip-line)]">
                  <span className="text-xs text-[var(--lagoon)] font-semibold">Minor Premise:</span>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-2 mt-1">
                    <p className="text-[var(--sea-ink)] text-center md:text-left">
                      <span style={{ color: 'var(--term-m)', fontWeight: 'bold', textDecoration: 'underline' }}>{t(currentSyllogism.premises.minor.subject as any)}</span> - <span style={{ color: 'var(--term-x)', fontWeight: 'bold', textDecoration: 'underline' }}>{t(currentSyllogism.premises.minor.predicate as any)}</span>
                    </p>
                    <div className="bg-white/60 px-3 rounded text-sm border border-dashed border-[var(--lagoon)] shadow-sm scale-90 origin-right">
                      <PropositionLogicSequence prop={currentSyllogism.premises.minor} syllogism={currentSyllogism} />
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--hero-a)]/30 p-3 rounded-lg border border-[var(--lagoon)]">
                  <span className="text-xs text-[var(--palm)] font-semibold">Conclusion:</span>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-2 mt-1">
                    <p className="text-[var(--sea-ink)] text-center md:text-left">
                      <span style={{ color: 'var(--term-x)', fontWeight: 'bold', textDecoration: 'underline' }}>{t(currentSyllogism.conclusion.subject as any)}</span> - <span style={{ color: 'var(--term-y)', fontWeight: 'bold', textDecoration: 'underline' }}>{t(currentSyllogism.conclusion.predicate as any)}</span>
                    </p>
                    <div className="bg-white/60 px-3 rounded text-sm border border-dashed border-[var(--palm)] shadow-sm scale-90 origin-right">
                      <PropositionLogicSequence prop={currentSyllogism.conclusion} syllogism={currentSyllogism} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Term Display */}
            <div className="bg-[var(--foam)] p-4 rounded-xl shadow-md border border-[var(--chip-line)]">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="text-xs text-[var(--sea-ink-soft)]">Minor (x)</div>
                  <div className="font-semibold underline" style={{ color: 'var(--term-x)' }}>{t(terms.x as any)}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--sea-ink-soft)]">Major (y)</div>
                  <div className="font-semibold underline" style={{ color: 'var(--term-y)' }}>{t(terms.y as any)}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--sea-ink-soft)]">Middle (m)</div>
                  <div className="font-semibold underline" style={{ color: 'var(--term-m)' }}>{t(terms.m as any)}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleValidate}
                disabled={isComplete}
                className={`flex-1 px-4 py-3 rounded-lg font-bold uppercase transition-all ${
                  isComplete
                    ? 'bg-[var(--sand)] text-[var(--sea-ink-soft)] cursor-not-allowed'
                    : 'bg-[var(--lagoon)] text-white hover:bg-[var(--lagoon-deep)] hover:scale-105'
                }`}
              >
                Check
              </button>
              <button
                onClick={startNewGame}
                className="px-4 py-3 bg-[var(--foam)] text-[var(--sea-ink)] rounded-lg font-bold uppercase border border-[var(--chip-line)] hover:bg-[var(--sand)] transition-all"
              >
                Next
              </button>
            </div>

            {/* Result Display */}
            {isComplete && (
              <div className={`p-4 rounded-xl border-2 ${
                isCorrect
                  ? 'bg-[var(--foam)] border-[var(--palm)]'
                  : 'bg-[var(--sand)] border-[var(--lagoon-deep)]'
              }`}>
                <div className="text-center">
                  {isCorrect ? (
                    <>
                      <div className="text-4xl mb-2">✓</div>
                      <div className="text-xl font-bold text-[var(--palm)]">Correct!</div>
                      <div className="text-sm text-[var(--sea-ink-soft)]">+{10 + gameState.streak - 1} points</div>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl mb-2">✗</div>
                      <div className="text-xl font-bold text-[var(--lagoon-deep)]">Try Again!</div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Status Code Display */}
            <CopyCode 
              dd={statusCodes.dd} 
              md={statusCodes.md} 
              terms={terms} 
              syllogismText={formatSyllogismText()} 
              onShowHelp={() => setShowHelp(true)}
            />
          </div>

          {/* Right: Diagrams */}
          <div className="lg:col-span-2 space-y-4">
            {/* Large Diagram */}
            <div className="bg-[var(--sand)] p-6 rounded-2xl border-2 border-[var(--sea-ink)] shadow-xl">
              <h3 className="text-center text-[var(--sea-ink-soft)] mb-3 uppercase text-xs tracking-widest font-bold">
                Large Diagram (DD)
              </h3>
              <svg width="440" height="440" viewBox="0 0 400 400" className="select-none mx-auto">
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
                <text x="200" y="85" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-x)" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{t(terms.x as any)}</text>
                <text x="200" y="330" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-x)" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{t(terms.x as any)}'</text>
                <text x="60" y="208" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-y)" style={{ fontFamily: "'Times New Roman', Times, serif", writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', transformOrigin: '60px 208px' }}>{t(terms.y as any)}</text>
                <text x="340" y="208" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-y)" style={{ fontFamily: "'Times New Roman', Times, serif", writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', transformOrigin: '340px 208px' }}>{t(terms.y as any)}'</text>
                <text x="200" y="208" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-m)" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{t(terms.m as any)}</text>
                {!isComplete && largeCells.map(cell => (
                  <rect key={cell.id} x={cell.x} y={cell.y} width={cell.w} height={cell.h} fill="transparent" className="cursor-pointer hover:fill-black/5" onClick={() => cycleCounter('large', cell.id)} />
                ))}
                <g>{renderCounters(largeState, 'large')}</g>
              </svg>
            </div>

            {/* Small Diagram */}
            <div className="bg-[var(--sand)] p-6 rounded-2xl border-2 border-[var(--sea-ink)] shadow-xl">
              <h3 className="text-center text-[var(--sea-ink-soft)] mb-3 uppercase text-xs tracking-widest font-bold">
                Small Diagram (MD)
              </h3>
              <svg width="340" height="340" viewBox="0 0 250 250" className="select-none mx-auto">
                <rect x="5" y="5" width="240" height="240" fill="none" stroke="black" strokeWidth="2" />
                <line x1="5" y1="125" x2="245" y2="125" stroke="black" strokeWidth="1.5" />
                <line x1="125" y1="5" x2="125" y2="245" stroke="black" strokeWidth="1.5" />
                {/* Cell numbers */}
                <text x="8" y="17" className="text-[11px] font-bold select-none pointer-events-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>5</text>
                <text x="242" y="17" textAnchor="end" className="text-[11px] font-bold select-none pointer-events-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>6</text>
                <text x="8" y="243" className="text-[11px] font-bold select-none pointer-events-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>7</text>
                <text x="242" y="243" textAnchor="end" className="text-[11px] font-bold select-none pointer-events-none" fill="var(--sea-ink-soft)" style={{ fontFamily: '"Courier New", Courier, monospace' }}>8</text>
                <text x="125" y="55" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-x)" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{t(terms.x as any)}</text>
                <text x="125" y="205" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-x)" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{t(terms.x as any)}'</text>
                <text x="40" y="133" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-y)" style={{ fontFamily: "'Times New Roman', Times, serif", writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', transformOrigin: '40px 133px' }}>{t(terms.y as any)}</text>
                <text x="210" y="133" textAnchor="middle" className="italic text-xl select-none font-bold pointer-events-none" fill="var(--term-y)" style={{ fontFamily: "'Times New Roman', Times, serif", writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', transformOrigin: '210px 133px' }}>{t(terms.y as any)}'</text>
                {!isComplete && smallCells.map(cell => (
                  <rect key={cell.id} x={cell.x} y={cell.y} width={cell.w} height={cell.h} fill="transparent" className="cursor-pointer hover:fill-black/5" onClick={() => cycleCounter('small', cell.id)} />
                ))}
                <g>{renderCounters(smallState, 'small')}</g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes scale-in {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
      `}</style>
    </main>
  )
}
