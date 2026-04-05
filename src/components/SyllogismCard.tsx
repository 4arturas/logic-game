import React, { useState } from 'react'
import { useSettings } from '../contexts/SettingsContext'
import { type Syllogism } from '../lib/logic'
import { PropositionLogicSequence } from './PropositionLogicSequence'
import { Clipboard, Check } from 'lucide-react'

function SyllogismFigurePattern({ figure, reverse = false }: { figure: number; reverse?: boolean }) {
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

  const getColor = (term: string) => {
    if (term === 'M') return mColor;
    if (term === 'S') return sColor;
    if (term === 'P') return pColor;
    return 'var(--sea-ink)';
  };

  const xLeft = 14;
  const xRight = 50;
  const yTop = 14;
  const yBottom = 38;

  const mTopX = node11 === 'M' ? xLeft : xRight;
  const mBottomX = node21 === 'M' ? xLeft : xRight;

  return (
    <div className={`flex flex-col items-center justify-center pt-2 pb-1.5 px-3 bg-white rounded border border-[var(--line)] shadow-sm`} title={`Figure ${figure} Pattern`}>
      <svg width="64" height="52" viewBox="0 0 64 52" fill="none" className="overflow-visible">
        {/* Dash lines connecting terms in the same proposition */}
        <line x1={xLeft} y1={yTop} x2={xRight} y2={yTop} stroke={lineColor} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
        <line x1={xLeft} y1={yBottom} x2={xRight} y2={yBottom} stroke={lineColor} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />

        {/* ZigZag M-Line */}
        <line x1={mTopX} y1={yTop} x2={mBottomX} y2={yBottom} stroke={mColor} strokeWidth="2.5" strokeLinecap="round" />

        {/* Nodes */}
        <g transform={`translate(${xLeft}, ${yTop})`}>
          <circle cx="0" cy="0" r="9" fill={getColor(node11)} stroke="white" strokeWidth="2" />
          <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">{node11}</text>
        </g>
        <g transform={`translate(${xRight}, ${yTop})`}>
          <circle cx="0" cy="0" r="9" fill={getColor(node12)} stroke="white" strokeWidth="2" />
          <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">{node12}</text>
        </g>
        <g transform={`translate(${xLeft}, ${yBottom})`}>
          <circle cx="0" cy="0" r="9" fill={getColor(node21)} stroke="white" strokeWidth="2" />
          <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">{node21}</text>
        </g>
        <g transform={`translate(${xRight}, ${yBottom})`}>
          <circle cx="0" cy="0" r="9" fill={getColor(node22)} stroke="white" strokeWidth="2" />
          <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">{node22}</text>
        </g>
      </svg>
    </div>
  )
}

interface SyllogismCardProps {
  syllogism: Syllogism
  t: (key: any) => string
  selectedSet?: string
  onSetChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  showSetSelect?: boolean
}

export function SyllogismCard({ 
  syllogism, 
  t, 
  selectedSet, 
  onSetChange,
  showSetSelect = false
}: SyllogismCardProps) {
  const { premiseOrder } = useSettings()
  const [copied, setCopied] = useState(false)

  const getFullSyllogismText = () => {
    const items = premiseOrder === 'major-first'
      ? [syllogism.premises.major, syllogism.premises.minor]
      : [syllogism.premises.minor, syllogism.premises.major]
    
    const format = (prop: any) => {
      const s = t(prop.subject as any)
      const p = t(prop.predicate as any)
      const verb = ['fur', 'tail', 'wings', 'hair', 'bloating'].some(w => prop.predicate.includes(w)) ? t('quiz.have') : t('quiz.are')
      if (prop.quantifier === 'E') return `${t('quiz.no_word')} ${s} ${verb} ${p}.`
      if (prop.quantifier === 'O') return `${t('quiz.some_word')} ${s} ${verb} ${t('quiz.not_word')} ${p}.`
      if (prop.quantifier === 'A') return `${t('quiz.all_word')} ${s} ${verb} ${p}.`
      return `${t('quiz.some_word')} ${s} ${verb} ${p}.`
    }

    return items.map(format).join('\n') + '\n∴ ' + format(syllogism.conclusion)
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(getFullSyllogismText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatProposition = (prop: { quantifier: string; subject: string; predicate: string }) => {
    const sKey = prop.subject
    const pKey = prop.predicate
    const s = t(sKey as any)
    const p = t(pKey as any)

    const getTermColor = (key: string) => {
      if (key === syllogism.terms.minorTerm) return 'var(--term-x)'
      if (key === syllogism.terms.majorTerm) return 'var(--term-y)'
      if (key === syllogism.terms.middleTerm) return 'var(--term-m)'
      return 'inherit'
    }

    const sSpan = <span style={{ color: getTermColor(sKey), fontWeight: 700 }}>{s}</span>
    const pSpan = <span style={{ color: getTermColor(pKey), fontWeight: 700 }}>{p}</span>
    const verb = ['fur', 'tail', 'wings', 'hair', 'bloating'].some(w => prop.predicate.includes(w)) ? t('quiz.have') : t('quiz.are')

    if (prop.quantifier === 'E') return <>{t('quiz.no_word')} {sSpan} {verb} {pSpan}.</>
    if (prop.quantifier === 'O') return <>{t('quiz.some_word')} {sSpan} {verb} {t('quiz.not_word')} {pSpan}.</>
    if (prop.quantifier === 'A') return <>{t('quiz.all_word')} {sSpan} {verb} {pSpan}.</>
    return <>{t('quiz.some_word')} {sSpan} {verb} {pSpan}.</>
  }

  const premises = premiseOrder === 'major-first'
    ? [
        { type: 'major', prop: syllogism.premises.major, label: t('quiz.major_premise') },
        { type: 'minor', prop: syllogism.premises.minor, label: t('quiz.minor_premise') },
      ]
    : [
        { type: 'minor', prop: syllogism.premises.minor, label: t('quiz.minor_premise') },
        { type: 'major', prop: syllogism.premises.major, label: t('quiz.major_premise') },
      ]

  return (
    <div style={{ background: 'var(--surface-strong)', border: '1.5px solid var(--line)', borderRadius: '4px', overflow: 'hidden' }}>

      {/* Header: figure + mood + mnemonic */}
      <div style={{ background: 'var(--sand)', borderBottom: '1.5px solid var(--line)', padding: '12px 14px' }} className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-3">
          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white text-xs font-bold px-2.5 py-1" style={{ background: 'var(--sea-ink)', fontFamily: 'var(--font-mono)', borderRadius: '3px' }}>
              Fig.&nbsp;{syllogism.figure}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 border" style={{ color: 'var(--lagoon)', borderColor: 'var(--lagoon)', fontFamily: 'var(--font-mono)', background: 'var(--foam)', borderRadius: '3px' }}>
              {syllogism.mood}
            </span>
            {syllogism.mnemonic && (
              <span className="text-xs italic" style={{ color: 'var(--sea-ink-soft)', fontWeight: 700 }}>
                {syllogism.mnemonic}
              </span>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all active:scale-95 border ${
                copied ? 'bg-[var(--palm)] text-white border-[var(--palm)]' : 'bg-white text-[var(--sea-ink)] border-[var(--line)] hover:border-[var(--lagoon)] hover:text-[var(--lagoon)]'
              }`}
              title={t('home.copy' as any)}
            >
              {copied ? <Check size={14} /> : <Clipboard size={14} />}
              <span className="text-[10px] font-bold uppercase">{copied ? t('home.copied' as any) : t('home.copy' as any)}</span>
            </button>
            {showSetSelect && onSetChange && (
              <select
                value={selectedSet}
                onChange={onSetChange}
                className="text-xs font-bold outline-none cursor-pointer border"
                style={{ fontFamily: 'var(--font-mono)', background: 'var(--foam)', color: 'var(--sea-ink)', borderColor: 'var(--line)', borderRadius: '3px', padding: '5px 8px' }}
              >
                <option value="standard">Standard Carroll Set (24)</option>
                <option value="custom">Color / Taste / Apple Set (24)</option>
              </select>
            )}
          </div>
        </div>

        {/* Large Pattern Graphic */}
        <div className="shrink-0">
          <SyllogismFigurePattern figure={syllogism.figure} reverse={premiseOrder === 'minor-first'} />
        </div>
      </div>

      {/* Premise + Conclusion rows */}
      <div style={{ padding: '10px 12px' }} className="space-y-2">
        {premises.map(item => (
          <div key={item.type} style={{ borderLeft: '3px solid var(--lagoon)', background: 'var(--foam)', border: '1px solid var(--line)', borderLeftWidth: '3px', borderLeftColor: 'var(--lagoon)', borderRadius: '2px', padding: '7px 10px' }}>
            <div className="island-kicker mb-1" style={{ color: 'var(--lagoon)', fontSize: '0.62rem' }}>{item.label}</div>
            <p className="text-sm leading-snug mb-1" style={{ color: 'var(--sea-ink)', margin: 0 }}>
              {formatProposition(item.prop)}
            </p>
            <PropositionLogicSequence prop={item.prop} syllogism={syllogism} />
          </div>
        ))}

        {/* Conclusion */}
        <div style={{ border: '1px solid var(--line)', borderLeftWidth: '3px', borderLeftColor: 'var(--palm)', background: 'var(--hero-a)', borderRadius: '2px', padding: '7px 10px' }}>
          <div className="island-kicker mb-1" style={{ color: 'var(--palm)', fontSize: '0.62rem' }}>
            {t('quiz.conclusion')}&nbsp;∴
          </div>
          <p className="text-sm leading-snug mb-1" style={{ color: 'var(--sea-ink)', margin: 0 }}>
            {formatProposition(syllogism.conclusion)}
          </p>
          <PropositionLogicSequence prop={syllogism.conclusion} syllogism={syllogism} />
        </div>
      </div>

      {/* Terms footer */}
      <div style={{ borderTop: '1.5px solid var(--line)', background: 'var(--sand)', padding: '7px 12px' }}>
        <div className="grid grid-cols-3 gap-1 text-center">
          {([
            { label: t('quiz.minor_term'), term: syllogism.terms.minorTerm, color: 'var(--term-x)' },
            { label: t('quiz.major_term'), term: syllogism.terms.majorTerm, color: 'var(--term-y)' },
            { label: t('quiz.middle_term'), term: syllogism.terms.middleTerm, color: 'var(--term-m)' },
          ] as const).map(({ label, term, color }) => (
            <div key={label}>
              <div style={{ color: 'var(--sea-ink-soft)', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>{label}</div>
              <div className="text-xs font-bold truncate" style={{ color, fontFamily: 'var(--font-mono)' }}>{t(term as any)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
