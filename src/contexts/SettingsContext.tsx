import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type PremiseOrder = 'major-first' | 'minor-first'

interface SettingsContextType {
  premiseOrder: PremiseOrder
  togglePremiseOrder: () => void
  audioEnabled: boolean
  toggleAudio: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const STORAGE_KEY = 'logic-game-premise-order'
const AUDIO_STORAGE_KEY = 'logic-game-audio-enabled'
const DEFAULT_ORDER: PremiseOrder = 'major-first'

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [premiseOrder, setPremiseOrderState] = useState<PremiseOrder>(DEFAULT_ORDER)
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as PremiseOrder
      if (stored === 'major-first' || stored === 'minor-first') {
        setPremiseOrderState(stored)
      }
      const storedAudio = localStorage.getItem(AUDIO_STORAGE_KEY)
      if (storedAudio === 'false') {
        setAudioEnabled(false)
      }
    } catch (e) {
      // localStorage not available
    }
  }, [])

  const togglePremiseOrder = useCallback(() => {
    setPremiseOrderState(prev => {
      const next: PremiseOrder = prev === 'major-first' ? 'minor-first' : 'major-first'
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, next)
        }
      } catch (e) {
        // localStorage not available
      }
      return next
    })
  }, [])

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => {
      const next = !prev
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUDIO_STORAGE_KEY, String(next))
        }
      } catch (e) {
        // localStorage not available
      }
      return next
    })
  }, [])

  return (
    <SettingsContext.Provider value={{ premiseOrder, togglePremiseOrder, audioEnabled, toggleAudio }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
