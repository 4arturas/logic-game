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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-[var(--surface)] w-full max-w-5xl rounded border-2 border-[var(--line)] shadow-2xl flex flex-col max-h-[90vh] animate-scale-in overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--line)] bg-[var(--sand)] flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[var(--sea-ink)] text-white flex items-center justify-center rounded text-xs font-black">?</div>
             <h2 className="text-sm font-black uppercase tracking-widest text-[var(--sea-ink)]">{t('quiz.help_title')}</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[var(--foam)] rounded transition-colors text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-12">
          {/* Rules Table */}
          <section>
            <div className="flex justify-between items-end mb-4 border-b pb-1 border-[var(--lagoon)]">
              <h3 className="text-xs font-black text-[var(--lagoon)] uppercase tracking-[0.2em]">
                {t('quiz.help_title')}
              </h3>
              {onApplyRule && (
                <span className="text-[9px] font-bold text-[var(--palm)] uppercase tracking-widest animate-pulse">
                  {t('home.copied').toLowerCase() === 'copied!' ? 'Click to apply rule' : 'Spustelėkite taisyklę'}
                </span>
              )}
            </div>
            <div className="overflow-hidden border-2 border-[var(--line)] rounded bg-[var(--surface-strong)] shadow-inner">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[var(--sand)] border-b border-[var(--line)]">
                    <th className="py-2 px-4 text-[9px] font-black uppercase tracking-wider text-[var(--sea-ink-soft)]">{t('quiz.help_col1')}</th>
                    <th className="py-2 px-4 text-[9px] font-black uppercase tracking-wider text-[var(--sea-ink-soft)]">{t('quiz.help_col2')}</th>
                    <th className="py-2 px-4 text-[9px] font-black uppercase tracking-wider text-[var(--sea-ink-soft)]">{t('quiz.help_col3')}</th>
                    <th className="py-2 px-4 text-[9px] font-black uppercase tracking-wider text-[var(--sea-ink-soft)] text-right">{t('quiz.help_col4')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {[1, 2, 3, 4, 5, 6, 7].map((row) => (
                    <tr 
                      key={row} 
                      className={`group transition-all ${onApplyRule ? 'cursor-pointer hover:bg-[var(--foam)]' : ''}`}
                      onClick={() => onApplyRule && onApplyRule(HELP_RULES_DATA[row])}
                    >
                      <td className="py-3 px-4 text-xs font-bold text-[var(--sea-ink)]">
                        {t(`quiz.help_row${row}_1` as any)}
                      </td>
                      <td className="py-3 px-4 text-[10px] text-[var(--sea-ink-soft)] italic font-serif">
                        {t(`quiz.help_row${row}_2` as any)}
                      </td>
                      <td className="py-3 px-4 text-[10px] text-[var(--sea-ink-soft)]">
                        {t(`quiz.help_row${row}_3` as any)}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono font-bold text-[var(--palm)] text-right group-hover:scale-110 transition-transform">
                        {t(`quiz.help_row${row}_4` as any)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Logical Symbols Section */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-[var(--palm)] pb-1">
              <span className="w-6 h-6 flex items-center justify-center bg-[var(--hero-a)] border border-[var(--palm)] text-[var(--palm)] rounded-full text-xs font-serif italic">∩</span>
              <h3 className="text-xs font-black text-[var(--palm)] uppercase tracking-[0.2em]">
                {t('quiz.help_symbols_title' as any)}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { symbol: '⊆', desc: t('quiz.help_symbol_subset' as any), color: 'text-[var(--palm)]' },
                { symbol: '∩', desc: t('quiz.help_symbol_intersection' as any), color: 'text-[var(--palm)]' },
                { symbol: '≠ ∅', desc: t('quiz.help_symbol_not_empty' as any), color: 'text-[var(--sea-ink)]' },
                { symbol: "'", desc: t('quiz.help_symbol_complement' as any), color: 'text-[var(--term-x)]' },
              ].map((item, idx) => (
                <div key={idx} className="bg-[var(--surface-strong)] p-4 rounded border-2 border-[var(--line)] flex flex-col items-center text-center gap-2">
                  <div className={`text-2xl font-black ${item.color}`} style={{ fontFamily: 'var(--font-mono)' }}>
                    {item.symbol}
                  </div>
                  <div className="text-[10px] text-[var(--sea-ink-soft)] font-bold uppercase tracking-tighter">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Visual Guide Section */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-[var(--sea-ink)] pb-1">
               <span className="w-6 h-6 flex items-center justify-center bg-[var(--sand)] border border-[var(--line)] text-[var(--sea-ink)] rounded-full text-xs font-black">!</span>
               <h3 className="text-xs font-black text-[var(--sea-ink)] uppercase tracking-[0.2em]">
                 {t('quiz.help_visual_guide')}
               </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Large Diagram Guide */}
              <div className="space-y-4">
                <div className="bg-white p-6 rounded border-2 border-[var(--line)] shadow-inner">
                  <h4 className="font-mono text-[10px] font-black text-[var(--sea-ink-soft)] text-center mb-6 uppercase tracking-widest">
                    {t('home.large_diagram')} SCHEMATICS
                  </h4>
                  <svg viewBox="0 0 400 400" className="w-full max-w-[280px] mx-auto select-none pointer-events-none opacity-80">
                    <rect x="10" y="10" width="380" height="380" fill="none" stroke="var(--line)" strokeWidth="2" />
                    <rect x="105" y="105" width="190" height="190" fill="none" stroke="var(--line)" strokeWidth="1.5" />
                    <line x1="10" y1="200" x2="390" y2="200" stroke="var(--line)" strokeWidth="1.5" />
                    <line x1="200" y1="10" x2="200" y2="390" stroke="var(--line)" strokeWidth="1.5" />
                    {[
                      { l: '9', x: 25, y: 35 }, { l: '10', x: 375, y: 35, a: 'end' },
                      { l: '11', x: 120, y: 130 }, { l: '12', x: 280, y: 130, a: 'end' },
                      { l: '13', x: 120, y: 285 }, { l: '14', x: 280, y: 285, a: 'end' },
                      { l: '15', x: 25, y: 380 }, { l: '16', x: 375, y: 380, a: 'end' },
                    ].map(n => (
                      <text key={n.l} x={n.x} y={n.y} textAnchor={n.a as any} className="text-[14px] font-black font-mono shadow-sm" fill="var(--sea-ink-soft)">{n.l}</text>
                    ))}
                    <text x="200" y="70" textAnchor="middle" className="italic text-3xl font-serif font-bold" fill="var(--term-x)">x</text>
                    <text x="200" y="345" textAnchor="middle" className="italic text-3xl font-serif font-bold" fill="var(--term-x)">x'</text>
                    <text x="55" y="210" textAnchor="middle" className="italic text-3xl font-serif font-bold" fill="var(--term-y)" transform="rotate(-90 55 210)">y</text>
                    <text x="345" y="210" textAnchor="middle" className="italic text-3xl font-serif font-bold" fill="var(--term-y)" transform="rotate(-90 345 210)">y'</text>
                    <text x="200" y="215" textAnchor="middle" className="italic text-3xl font-serif font-bold" fill="var(--term-m)">m</text>
                  </svg>
                </div>
                <p className="text-[10px] text-[var(--sea-ink-soft)] leading-relaxed italic border-l-2 border-[var(--lagoon)] pl-3">
                  {t('quiz.help_large_desc')}
                </p>
              </div>

              {/* Small Diagram Guide */}
              <div className="space-y-4">
                <div className="bg-white p-6 rounded border-2 border-[var(--line)] shadow-inner">
                  <h4 className="font-mono text-[10px] font-black text-[var(--sea-ink-soft)] text-center mb-6 uppercase tracking-widest">
                    {t('home.small_diagram')} SCHEMATICS
                  </h4>
                  <svg viewBox="0 0 250 250" className="w-full max-w-[220px] mx-auto select-none pointer-events-none opacity-80">
                    <rect x="5" y="5" width="240" height="240" fill="none" stroke="var(--line)" strokeWidth="2" />
                    <line x1="125" y1="5" x2="125" y2="245" stroke="var(--line)" strokeWidth="1.5" />
                    <line x1="5" y1="125" x2="245" y2="125" stroke="var(--line)" strokeWidth="1.5" />
                    {[
                      { l: '5', x: 20, y: 30 }, { l: '6', x: 230, y: 30, a: 'end' },
                      { l: '7', x: 20, y: 235 }, { l: '8', x: 230, y: 235, a: 'end' },
                    ].map(n => (
                      <text key={n.l} x={n.x} y={n.y} textAnchor={n.a as any} className="text-[16px] font-black font-mono" fill="var(--sea-ink-soft)">{n.l}</text>
                    ))}
                    <text x="125" y="65" textAnchor="middle" className="italic text-3xl font-serif font-bold" fill="var(--term-x)">x</text>
                    <text x="125" y="200" textAnchor="middle" className="italic text-3xl font-serif font-bold" fill="var(--term-x)">x'</text>
                    <text x="45" y="135" textAnchor="middle" className="italic text-3xl font-serif font-bold" fill="var(--term-y)" transform="rotate(-90 45 135)">y</text>
                    <text x="205" y="135" textAnchor="middle" className="italic text-3xl font-serif font-bold" fill="var(--term-y)" transform="rotate(-90 205 135)">y'</text>
                  </svg>
                </div>
                <p className="text-[10px] text-[var(--sea-ink-soft)] leading-relaxed italic border-l-2 border-[var(--palm)] pl-3">
                  {t('quiz.help_small_desc')}
                </p>
              </div>
            </div>
          </section>
        </div>
        
        <div className="bg-[var(--sand)] p-5 border-t border-[var(--line)] flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-2 bg-[var(--sea-ink)] text-white rounded font-bold uppercase tracking-widest text-[10px] transition-all hover:bg-black shadow-md border border-black"
          >
            {t('quiz.reset').toLowerCase() === 'reset' ? 'Close Reference' : 'Uždaryti žinyną'}
          </button>
        </div>
      </div>
    </div>
  )
}
