import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { type Syllogism, type Figure, SYLLOGISM_EXAMPLES } from '../lib/logic'
import { LogicGalaxy } from '../components/Atlas3D/LogicGalaxy'
import { SyllogismPanel } from '../components/Atlas3D/SyllogismPanel'

export const Route = createFileRoute('/atlas3d')({
  component: Atlas3DPage,
})

const FIGURE_COLORS: Record<number, string> = {
  1: '#06D6A0',
  2: '#FFD166',
  3: '#EF476F',
  4: '#118AB2',
}
const FIGURE_ROMAN: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }

function Atlas3DPage() {
  const [selectedSyllogism, setSelectedSyllogism] = useState<Syllogism | null>(null)
  const navigate = useNavigate()

  const figureStats = useMemo(() => {
    const res: Record<Figure, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
    SYLLOGISM_EXAMPLES.forEach(s => res[s.figure]++)
    return res
  }, [])

  const handlePractice = (s: Syllogism) => {
    // Navigate to the practice/home route; the user can set the syllogism there
    navigate({ to: '/' })
  }

  return (
    <div className="fixed inset-0 top-[64px] overflow-hidden bg-[#050810]">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <LogicGalaxy
          onSelectSyllogism={setSelectedSyllogism}
          selectedId={selectedSyllogism?.id || null}
        />
      </div>

      {/* HUD — Top-left figure legend */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="space-y-1.5">
          <div className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25 font-mono mb-2">
            Four Figures
          </div>
          {([1, 2, 3, 4] as Figure[]).map(fig => (
            <div key={fig} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: FIGURE_COLORS[fig], boxShadow: `0 0 6px ${FIGURE_COLORS[fig]}` }}
              />
              <div className="text-[10px] font-mono font-bold text-white/50">
                Fig {FIGURE_ROMAN[fig]}
                <span className="text-white/25 ml-1">· {figureStats[fig]} syllogisms</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HUD — Top-right stats */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none" style={{ right: selectedSyllogism ? '388px' : '16px', transition: 'right 0.45s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div className="flex flex-col items-end gap-1">
          <div className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25 font-mono">
            Lewis Carroll Atlas
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-lg font-black text-[#06D6A0]">24</div>
              <div className="text-[7px] font-bold text-white/30 uppercase tracking-widest">syllogisms</div>
            </div>
            <div className="w-px h-7 bg-white/10" />
            <div className="text-center">
              <div className="text-lg font-black text-[#FFD166]">4</div>
              <div className="text-[7px] font-bold text-white/30 uppercase tracking-widest">figures</div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected syllogism mini badge (bottom center) */}
      {selectedSyllogism && (
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
          style={{ right: selectedSyllogism ? '380px' : undefined }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest font-mono"
            style={{
              background: `${FIGURE_COLORS[selectedSyllogism.figure]}18`,
              border: `1px solid ${FIGURE_COLORS[selectedSyllogism.figure]}44`,
              color: FIGURE_COLORS[selectedSyllogism.figure],
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: FIGURE_COLORS[selectedSyllogism.figure] }}
            />
            {selectedSyllogism.mood} · {selectedSyllogism.mnemonic}
          </div>
        </div>
      )}

      {/* Slide-in Side Panel */}
      <SyllogismPanel
        syllogism={selectedSyllogism}
        onClose={() => setSelectedSyllogism(null)}
        onPractice={handlePractice}
      />
    </div>
  )
}
