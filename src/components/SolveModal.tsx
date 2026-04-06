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

  const topRowTypes = figure === 1 || figure === 3 ? ['M', 'P'] : ['P', 'M'];
  const bottomRowTypes = figure === 3 || figure === 4 ? ['M', 'S'] : ['S', 'M'];

  const row1Types = reverse ? bottomRowTypes : topRowTypes;
  const row2Types = reverse ? topRowTypes : bottomRowTypes;

  const premises = reverse 
    ? [syllogism.premises.minor, syllogism.premises.major]
    : [syllogism.premises.major, syllogism.premises.minor];

  const prop1 = premises[0];
  const prop2 = premises[1];

  const getRelationInfo = (prop: any) => {
    let rel = '\u2286';
    let rightIsComplement = false;
    let showEmpty = false;

    if (prop.quantifier === 'E') {
      rightIsComplement = true;
    } else if (prop.quantifier === 'I') {
      rel = '\u2229';
      showEmpty = true;
    } else if (prop.quantifier === 'O') {
      rel = '\u2229';
      rightIsComplement = true;
      showEmpty = true;
    }
    return { rel, rightIsComplement, showEmpty };
  };

  const rel1 = getRelationInfo(prop1);
  const rel2 = getRelationInfo(prop2);

  const getVarInfo = (baseTermType: string, isComplement: boolean) => {
    let variable = '';
    let termColor = 'inherit';
    let translated = '';

    if (baseTermType === 'S') {
      variable = 'x';
      termColor = sColor;
      translated = t(syllogism.terms.minorTerm as any);
    } else if (baseTermType === 'P') {
      variable = 'y';
      termColor = pColor;
      translated = t(syllogism.terms.majorTerm as any);
    } else if (baseTermType === 'M') {
      variable = 'm';
      termColor = mColor;
      translated = t(syllogism.terms.middleTerm as any);
    }

    return {
      text: variable + (isComplement ? "'" : ""),
      color: termColor,
      translated
    };
  };

  const nodes = [
    { xPos: 100, yPos: 40, info: getVarInfo(row1Types[0], false) },
    { xPos: 300, yPos: 40, info: getVarInfo(row1Types[1], rel1.rightIsComplement) },
    { xPos: 100, yPos: 120, info: getVarInfo(row2Types[0], false) },
    { xPos: 300, yPos: 120, info: getVarInfo(row2Types[1], rel2.rightIsComplement) }
  ];

  const mTopIdx = row1Types[0] === 'M' ? 0 : 1;
  const mBottomIdx = row2Types[0] === 'M' ? 2 : 3;

  return (
    <div className="mt-6 bg-[var(--surface)] border-2 border-[var(--line)] rounded-xl flex flex-col items-center px-2 py-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-2 left-3 flex gap-2">
           <span className="text-[10px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-widest">{t('atlas.figure')} {figure}</span>
        </div>
      <svg width="100%" height="160" viewBox="0 0 460 160" className="overflow-visible" style={{ maxWidth: '460px' }}>
        {/* Dash lines connecting terms in the same proposition */}
        <line x1="100" y1="40" x2="300" y2="40" stroke={lineColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
        <line x1="100" y1="120" x2="300" y2="120" stroke={lineColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />

        {/* Relation Signs */}
        <g transform="translate(200, 40)">
           <rect x="-35" y="-26" width="70" height="52" rx="12" fill="var(--surface)" />
           <text x="0" y="2" textAnchor="middle" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="28" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif'>
             {rel1.rel}
           </text>
        </g>
        <g transform="translate(200, 120)">
           <rect x="-35" y="-26" width="70" height="52" rx="12" fill="var(--surface)" />
           <text x="0" y="2" textAnchor="middle" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="28" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif'>
             {rel2.rel}
           </text>
        </g>

        {/* Empty set notations placed explicitly after the right nodes */}
        {rel1.showEmpty && (
           <text x="395" y="42" textAnchor="start" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="22" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif' className="whitespace-nowrap">
             {String.fromCharCode(0x2260)} {String.fromCharCode(0x2205)}
           </text>
        )}
        {rel2.showEmpty && (
           <text x="395" y="122" textAnchor="start" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="22" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif' className="whitespace-nowrap">
             {String.fromCharCode(0x2260)} {String.fromCharCode(0x2205)}
           </text>
        )}

        {/* ZigZag M-Line */}
        <line x1={nodes[mTopIdx].xPos} y1="40" x2={nodes[mBottomIdx].xPos} y2="120" stroke={mColor} strokeWidth="5" strokeLinecap="round" style={{ mixBlendMode: 'multiply' }} opacity="0.8" />

        {/* Nodes */}
        {nodes.map((node, idx) => (
           <g key={idx} transform={`translate(${node.xPos}, ${node.yPos})`}>
             <rect x="-80" y="-22" width="160" height="44" rx="22" fill="var(--foam)" stroke={node.info.color} strokeWidth="2.5" />
             <text x="0" y="-4" textAnchor="middle" dominantBaseline="middle" fill={node.info.color} fontSize="14" fontWeight="900" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", monospace'>
               {node.info.text}
             </text>
             <text x="0" y="12" textAnchor="middle" dominantBaseline="middle" fill={node.info.color} fontSize="11" fontWeight="bold" fontFamily="var(--font-sans)">
               {node.info.translated}
             </text>
           </g>
        ))}
      </svg>
    </div>
  )
}

function FolZigZagPattern({ syllogism, t }: { syllogism: Syllogism, t: any }) {
  const { premiseOrder } = useSettings()
  const figure = syllogism.figure;
  const reverse = premiseOrder === 'minor-first';

  const mColor = 'var(--term-m)';
  const sColor = 'var(--term-x)';
  const pColor = 'var(--term-y)';
  const lineColor = 'var(--sea-ink-soft)';

  const topRowTypes = figure === 1 || figure === 3 ? ['M', 'P'] : ['P', 'M'];
  const bottomRowTypes = figure === 3 || figure === 4 ? ['M', 'S'] : ['S', 'M'];

  const row1Types = reverse ? bottomRowTypes : topRowTypes;
  const row2Types = reverse ? topRowTypes : bottomRowTypes;

  const premises = reverse 
    ? [syllogism.premises.minor, syllogism.premises.major]
    : [syllogism.premises.major, syllogism.premises.minor];

  const prop1 = premises[0];
  const prop2 = premises[1];

  const getFolInfo = (prop: any) => {
    let prefix = '∀x (';
    let rel = '→';
    let rightIsComplement = false;

    if (prop.quantifier === 'E') {
      prefix = '¬∃x (';
      rel = '∧';
      rightIsComplement = false;
    } else if (prop.quantifier === 'I') {
      prefix = '∃x (';
      rel = '∧';
    } else if (prop.quantifier === 'O') {
      prefix = '∃x (';
      rel = '∧';
      rightIsComplement = true;
    }
    return { prefix, rel, rightIsComplement };
  };

  const fol1 = getFolInfo(prop1);
  const fol2 = getFolInfo(prop2);

  const getVarInfo = (baseTermType: string, isComplement: boolean) => {
    let predicate = '';
    let termColor = 'inherit';
    let translated = '';

    if (baseTermType === 'S') {
      predicate = 'S(x)';
      termColor = sColor;
      translated = t(syllogism.terms.minorTerm as any);
    } else if (baseTermType === 'P') {
      predicate = 'P(x)';
      termColor = pColor;
      translated = t(syllogism.terms.majorTerm as any);
    } else if (baseTermType === 'M') {
      predicate = 'M(x)';
      termColor = mColor;
      translated = t(syllogism.terms.middleTerm as any);
    }

    return {
      text: (isComplement ? "¬" : "") + predicate,
      color: termColor,
      translated
    };
  };

  const nodeY1 = 40;
  const nodeY2 = 120;
  const xLeft = 150;
  const xRight = 370;

  const nodes = [
    { xPos: xLeft, yPos: nodeY1, info: getVarInfo(row1Types[0], false) },
    { xPos: xRight, yPos: nodeY1, info: getVarInfo(row1Types[1], fol1.rightIsComplement) },
    { xPos: xLeft, yPos: nodeY2, info: getVarInfo(row2Types[0], false) },
    { xPos: xRight, yPos: nodeY2, info: getVarInfo(row2Types[1], fol2.rightIsComplement) }
  ];

  const mTopIdx = row1Types[0] === 'M' ? 0 : 1;
  const mBottomIdx = row2Types[0] === 'M' ? 2 : 3;

  return (
    <div className="mt-4 bg-[var(--surface)] border-2 border-[var(--line)] rounded-xl flex flex-col items-center px-1 py-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-2 left-3 flex gap-2">
           <span className="text-[10px] font-bold text-[var(--sea-ink-soft)] uppercase tracking-widest">FOL</span>
        </div>
      <svg width="100%" height="160" viewBox="0 0 520 160" className="overflow-visible" style={{ maxWidth: '520px' }}>
        {/* Dash lines connecting terms in the same proposition */}
        <line x1={xLeft} y1={nodeY1} x2={xRight} y2={nodeY1} stroke={lineColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
        <line x1={xLeft} y1={nodeY2} x2={xRight} y2={nodeY2} stroke={lineColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />

        {/* Relation Signs (Middle of dashed lines) */}
        <g transform={`translate(${(xLeft + xRight)/2}, ${nodeY1})`}>
           <rect x="-24" y="-20" width="48" height="40" rx="8" fill="var(--surface)" />
           <text x="0" y="2" textAnchor="middle" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="26" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif'>
             {fol1.rel}
           </text>
        </g>
        <g transform={`translate(${(xLeft + xRight)/2}, ${nodeY2})`}>
           <rect x="-24" y="-20" width="48" height="40" rx="8" fill="var(--surface)" />
           <text x="0" y="2" textAnchor="middle" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="26" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif'>
             {fol2.rel}
           </text>
        </g>

        {/* Quantifier Prefixes */}
        <text x="70" y={nodeY1+2} textAnchor="end" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="24" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif' className="whitespace-nowrap">
          {fol1.prefix}
        </text>
        <text x="70" y={nodeY2+2} textAnchor="end" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="24" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif' className="whitespace-nowrap">
          {fol2.prefix}
        </text>

        {/* Suffixes ")" */}
        <text x="450" y={nodeY1+2} textAnchor="start" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="24" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif'>
          )
        </text>
        <text x="450" y={nodeY2+2} textAnchor="start" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="24" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif'>
          )
        </text>

        {/* ZigZag M-Line */}
        <line x1={nodes[mTopIdx].xPos} y1={nodeY1} x2={nodes[mBottomIdx].xPos} y2={nodeY2} stroke={mColor} strokeWidth="5" strokeLinecap="round" style={{ mixBlendMode: 'multiply' }} opacity="0.8" />

        {/* Nodes */}
        {nodes.map((node, idx) => (
           <g key={idx} transform={`translate(${node.xPos}, ${node.yPos})`}>
             <rect x="-70" y="-22" width="140" height="44" rx="22" fill="var(--foam)" stroke={node.info.color} strokeWidth="2.5" />
             <text x="0" y="-4" textAnchor="middle" dominantBaseline="middle" fill={node.info.color} fontSize="14" fontWeight="900" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", monospace'>
               {node.info.text}
             </text>
             <text x="0" y="12" textAnchor="middle" dominantBaseline="middle" fill={node.info.color} fontSize="11" fontWeight="bold" fontFamily="var(--font-sans)">
               {node.info.translated}
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
               <FolZigZagPattern syllogism={syllogism} t={t} />
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
