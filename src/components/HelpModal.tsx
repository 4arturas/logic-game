import { useEffect } from 'react'
import { useTranslation } from '../i18n/I18nContext'
import { X } from 'lucide-react'

interface HelpModalProps {
  onClose: () => void
  onApplyRule?: (cells: number[]) => void
}

const HELP_RULES_DATA: Record<number, number[]> = {
  1: [13, 14],
  2: [11, 12],
  3: [11, 12],
  4: [9, 10],
  5: [9, 15],
  6: [12, 14],
  7: [11, 13],
}

export function HelpModal({ onClose, onApplyRule }: HelpModalProps) {
  const { t } = useTranslation()

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-[var(--surface)] w-full max-w-5xl rounded-2xl shadow-2xl border-4 border-[var(--lagoon)] flex flex-col max-h-[90vh] animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-[var(--lagoon)] p-4 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">{t('quiz.help_title')}</h2>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {/* Rules Table */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-sm font-bold text-[var(--lagoon)] uppercase tracking-tight">
                {t('quiz.help_title')}
              </h3>
              {onApplyRule && (
                <span className="text-[10px] text-[var(--sea-ink-soft)] italic animate-pulse">
                  {t('home.copied').toLowerCase() === 'copied!' ? 'Click a rule to apply to diagram' : 'Paspauskite taisyklę, kad pritaikytumėte diagramai'}
                </span>
              )}
            </div>
            <div className="overflow-x-auto shadow-sm rounded-lg border border-[var(--line)]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[var(--foam)] border-b border-[var(--line)]">
                    <th className="text-left py-2 px-4 text-[var(--lagoon)] font-bold uppercase text-[10px]">{t('quiz.help_col1')}</th>
                    <th className="text-left py-2 px-4 text-[var(--lagoon)] font-bold uppercase text-[10px]">{t('quiz.help_col2')}</th>
                    <th className="text-left py-2 px-4 text-[var(--lagoon)] font-bold uppercase text-[10px]">{t('quiz.help_col3')}</th>
                    <th className="text-left py-2 px-4 text-[var(--lagoon)] font-bold uppercase text-[10px] whitespace-nowrap">{t('quiz.help_col4')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)] bg-white">
                  {[1, 2, 3, 4, 5, 6, 7].map((row) => (
                    <tr 
                      key={row} 
                      className={`transition-colors ${onApplyRule ? 'cursor-pointer hover:bg-[var(--lagoon)]/5 active:bg-[var(--lagoon)]/10' : ''}`}
                      onClick={() => onApplyRule && onApplyRule(HELP_RULES_DATA[row])}
                      title={onApplyRule ? "Sprendimo pritaikymas" : undefined}
                    >
                      <td className="py-2.5 px-4 text-xs font-semibold text-[var(--sea-ink)] whitespace-nowrap">
                        {t(`quiz.help_row${row}_1` as any)}
                      </td>
                      <td className="py-2.5 px-4 text-[10px] text-[var(--sea-ink-soft)] italic whitespace-nowrap">
                        {t(`quiz.help_row${row}_2` as any)}
                      </td>
                      <td className="py-2.5 px-4 text-[10px] text-[var(--sea-ink-soft)]">
                        {t(`quiz.help_row${row}_3` as any)}
                      </td>
                      <td className="py-2.5 px-4 text-xs font-mono font-bold text-[var(--palm)] whitespace-nowrap text-right">
                        {t(`quiz.help_row${row}_4` as any)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <hr className="border-[var(--line)] mb-8" />

          {/* Visual Guide Section */}
          <div>
            <h3 className="text-xl font-black text-[var(--lagoon)] uppercase mb-6 flex items-center gap-2">
              <span className="bg-[var(--lagoon)] text-white w-6 h-6 flex items-center justify-center rounded-full text-sm">?</span>
              {t('quiz.help_visual_guide')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              {/* Large Diagram Guide */}
              <div className="space-y-4">
                <div className="bg-[var(--foam)] p-4 rounded-xl border-2 border-[var(--line)]">
                  <h4 className="font-bold text-[var(--sea-ink)] text-center mb-4 text-sm uppercase tracking-tight">
                    {t('home.large_diagram')}
                  </h4>
                  <svg viewBox="0 0 400 400" className="w-full max-w-[300px] mx-auto select-none pointer-events-none grayscale opacity-80">
                    <rect x="10" y="10" width="380" height="380" fill="none" stroke="currentColor" strokeWidth="2" />
                    <rect x="105" y="105" width="190" height="190" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="10" y1="200" x2="390" y2="200" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="200" y1="10" x2="200" y2="390" stroke="currentColor" strokeWidth="1.5" />
                    {/* Numbers */}
                    {[
                      { l: '9', x: 25, y: 35 }, { l: '10', x: 375, y: 35, a: 'end' },
                      { l: '11', x: 120, y: 130 }, { l: '12', x: 280, y: 130, a: 'end' },
                      { l: '13', x: 120, y: 285 }, { l: '14', x: 280, y: 285, a: 'end' },
                      { l: '15', x: 25, y: 380 }, { l: '16', x: 375, y: 380, a: 'end' },
                    ].map(n => (
                      <text key={n.l} x={n.x} y={n.y} textAnchor={n.a as any} className="text-[18px] font-black" fill="currentColor">{n.l}</text>
                    ))}
                    {/* Terms */}
                    <text x="200" y="70" textAnchor="middle" className="italic text-3xl font-serif font-bold" fill="var(--term-x)">x</text>
                    <text x="200" y="345" textAnchor="middle" className="italic text-3xl font-serif font-bold" fill="var(--term-x)">x'</text>
                    <text x="55" y="210" textAnchor="middle" className="italic text-3xl font-serif font-bold" fill="var(--term-y)" transform="rotate(-90 55 210)">y</text>
                    <text x="345" y="210" textAnchor="middle" className="italic text-3xl font-serif font-bold" fill="var(--term-y)" transform="rotate(-90 345 210)">y'</text>
                    <text x="200" y="215" textAnchor="middle" className="italic text-3xl font-serif font-bold" fill="var(--term-m)">m</text>
                  </svg>
                </div>
                <p className="text-xs text-[var(--sea-ink-soft)] leading-relaxed italic border-l-4 border-[var(--lagoon)] pl-3">
                  {t('quiz.help_large_desc')}
                </p>
              </div>

              {/* Small Diagram Guide */}
              <div className="space-y-4">
                <div className="bg-[var(--foam)] p-4 rounded-xl border-2 border-[var(--line)]">
                  <h4 className="font-bold text-[var(--sea-ink)] text-center mb-4 text-sm uppercase tracking-tight">
                    {t('home.small_diagram')}
                  </h4>
                  <svg viewBox="0 0 250 250" className="w-full max-w-[220px] mx-auto select-none pointer-events-none grayscale opacity-80">
                    <rect x="5" y="5" width="240" height="240" fill="none" stroke="currentColor" strokeWidth="2" />
                    <line x1="125" y1="5" x2="125" y2="245" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="5" y1="125" x2="245" y2="125" stroke="currentColor" strokeWidth="1.5" />
                    {/* Numbers */}
                    {[
                      { l: '5', x: 20, y: 30 }, { l: '6', x: 230, y: 30, a: 'end' },
                      { l: '7', x: 20, y: 235 }, { l: '8', x: 230, y: 235, a: 'end' },
                    ].map(n => (
                      <text key={n.l} x={n.x} y={n.y} textAnchor={n.a as any} className="text-[24px] font-black" fill="currentColor">{n.l}</text>
                    ))}
                    {/* Terms */}
                    <text x="125" y="65" textAnchor="middle" className="italic text-4xl font-serif font-bold" fill="var(--term-x)">x</text>
                    <text x="125" y="200" textAnchor="middle" className="italic text-4xl font-serif font-bold" fill="var(--term-x)">x'</text>
                    <text x="45" y="135" textAnchor="middle" className="italic text-4xl font-serif font-bold" fill="var(--term-y)" transform="rotate(-90 45 135)">y</text>
                    <text x="205" y="135" textAnchor="middle" className="italic text-4xl font-serif font-bold" fill="var(--term-y)" transform="rotate(-90 205 135)">y'</text>
                  </svg>
                </div>
                <p className="text-xs text-[var(--sea-ink-soft)] leading-relaxed italic border-l-4 border-[var(--palm)] pl-3">
                  {t('quiz.help_small_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[var(--sand)] p-4 text-center flex-shrink-0">
          <button 
            onClick={onClose}
            className="px-8 py-2 bg-[var(--lagoon)] text-white rounded-lg font-bold uppercase transition-all hover:bg-[var(--lagoon-deep)] shadow-md"
          >
            {t('quiz.reset').toLowerCase() === 'reset' ? 'Close' : 'Uždaryti'}
          </button>
        </div>
      </div>
    </div>
  )
}
