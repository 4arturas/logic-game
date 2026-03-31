import React from 'react'
import { X } from 'lucide-react'
import { useTranslation } from '../i18n/I18nContext'
import { type Syllogism } from '../lib/logic'
import { SyllogismSolver } from './SyllogismSolver'
import { SyllogismCard } from './SyllogismCard'

interface SolveModalProps {
  syllogism: Syllogism
  onClose: () => void
}

export function SolveModal({ syllogism, onClose }: SolveModalProps) {
  const { t } = useTranslation()

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--surface)] w-full max-w-6xl rounded shadow-2xl border-2 border-[var(--line)] flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--line)] bg-[var(--sand)]">
          <div className="flex items-center gap-3">
            <span className="bg-[var(--sea-ink)] text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
              SOLVER
            </span>
            <h2 className="text-sm font-black uppercase tracking-widest text-[var(--sea-ink)]">
              {syllogism.mnemonic} ({syllogism.mood}-{syllogism.figure})
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-[var(--foam)] rounded transition-colors text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-10 items-start">
            <div className="lg:sticky lg:top-0">
               <SyllogismCard syllogism={syllogism} t={t} />
               <div className="mt-6 p-4 rounded border border-dashed border-[var(--line)] bg-[var(--foam)]">
                 <p className="text-[10px] text-[var(--sea-ink-soft)] leading-relaxed italic">
                   {t('quiz.help_large_desc')}
                 </p>
               </div>
            </div>
            
            <div className="w-full">
              <SyllogismSolver 
                syllogism={syllogism} 
                showNextButton={false}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--line)] bg-[var(--sand)] flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-[var(--foam)] text-[var(--sea-ink)] border border-[var(--line)] rounded text-xs font-bold uppercase transition-all hover:bg-[var(--sand)]"
          >
            {t('quiz.reset').toLowerCase() === 'reset' ? 'Close' : 'Uždaryti'}
          </button>
        </div>
      </div>
    </div>
  )
}
