// removed React import
import { X } from 'lucide-react'
import { useTranslation } from '../i18n/I18nContext'
import { type Syllogism } from '../lib/logic'
import { SyllogismSolver } from './SyllogismSolver'
import { SyllogismCard } from './SyllogismCard'
import { useSettings } from '../contexts/SettingsContext'

function LargeZigZagPattern({ syllogism, t }: { syllogism: Syllogism, t: any }) {
  const { premiseOrder } = useSettings()
  const figure = syllogism.figure;
  const reverse = premiseOrder === 'minor-first';

  const mColor = 'var(--term-m)';
  const sColor = 'var(--term-x)';
  const pColor = 'var(--term-y)';
  const lineColor = 'var(--sea-ink-soft)';

  const topRow = figure === 1 || figure === 3 ? ['M', 'P'] : ['P', 'M'];
  const bottomRow = figure === 3 || figure === 4 ? ['M', 'S'] : ['S', 'M'];

  const row1 = reverse ? bottomRow : topRow;
  const row2 = reverse ? topRow : bottomRow;

  const node11 = row1[0];
  const node12 = row1[1];
  const node21 = row2[0];
  const node22 = row2[1];

  const getLabel = (term: string) => {
    if (term === 'M') return t(syllogism.terms.middleTerm as any);
    if (term === 'S') return t(syllogism.terms.minorTerm as any);
    if (term === 'P') return t(syllogism.terms.majorTerm as any);
    return '';
  }

  const getColor = (term: string) => {
    if (term === 'M') return mColor;
    if (term === 'S') return sColor;
    if (term === 'P') return pColor;
    return 'var(--sea-ink)';
  };

  const xLeft = 100;
  const xRight = 300;
  const yTop = 40;
  const yBottom = 100;

  const mTopX = node11 === 'M' ? xLeft : xRight;
  const mBottomX = node21 === 'M' ? xLeft : xRight;

  return (
    <div className="mt-6 bg-[var(--surface)] border-2 border-[var(--line)] rounded-xl flex flex-col items-center px-2 py-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-2 left-3 flex gap-2">
           <span className="text-[10px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-widest">{t('atlas.figure')} {figure}</span>
        </div>
      <svg width="100%" height="140" viewBox="0 0 400 140" className="overflow-visible" style={{ maxWidth: '400px' }}>
        {/* Dash lines connecting terms in the same proposition */}
        <line x1={xLeft} y1={yTop} x2={xRight} y2={yTop} stroke={lineColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
        <line x1={xLeft} y1={yBottom} x2={xRight} y2={yBottom} stroke={lineColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />

        {/* ZigZag M-Line */}
        <line x1={mTopX} y1={yTop} x2={mBottomX} y2={yBottom} stroke={mColor} strokeWidth="5" strokeLinecap="round" />

        {/* Nodes */}
        {[
           { x: xLeft, y: yTop, node: node11 },
           { x: xRight, y: yTop, node: node12 },
           { x: xLeft, y: yBottom, node: node21 },
           { x: xRight, y: yBottom, node: node22 },
        ].map((item, idx) => (
           <g key={idx} transform={`translate(${item.x}, ${item.y})`}>
             <rect x="-70" y="-18" width="140" height="36" rx="18" fill="var(--foam)" stroke={getColor(item.node)} strokeWidth="2.5" />
             <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fill={getColor(item.node)} fontSize="13" fontWeight="bold" fontFamily="var(--font-sans)">
               {getLabel(item.node)}
             </text>
           </g>
        ))}
      </svg>
    </div>
  )
}

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
        className="bg-[var(--surface)] w-[95vw] max-w-[1400px] rounded shadow-2xl border-2 border-[var(--line)] flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200"
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
               <LargeZigZagPattern syllogism={syllogism} t={t} />
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
