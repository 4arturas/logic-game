import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type PremiseOrder = 'major-first' | 'minor-first'

interface SettingsContextType {
  premiseOrder: PremiseOrder
  togglePremiseOrder: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const STORAGE_KEY = 'logic-game-premise-order'
const DEFAULT_ORDER: PremiseOrder = 'major-first'

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [premiseOrder, setPremiseOrderState] = useState<PremiseOrder>(DEFAULT_ORDER)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as PremiseOrder
      if (stored === 'major-first' || stored === 'minor-first') {
        setPremiseOrderState(stored)
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

  return (
    <SettingsContext.Provider value={{ premiseOrder, togglePremiseOrder }}>
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
