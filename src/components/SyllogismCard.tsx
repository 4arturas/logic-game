import React from 'react'
import { useTranslation } from '../i18n/I18nContext'
import { useSettings } from '../contexts/SettingsContext'
import { type Syllogism } from '../lib/logic'
import { PropositionLogicSequence } from './PropositionLogicSequence'

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
      <div style={{ background: 'var(--sand)', borderBottom: '1.5px solid var(--line)', padding: '10px 12px' }}>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="text-white text-xs font-bold px-2.5 py-0.5" style={{ background: 'var(--sea-ink)', fontFamily: 'var(--font-mono)', borderRadius: '2px' }}>
            Fig.&nbsp;{syllogism.figure}
          </span>
          <span className="text-xs font-bold px-2.5 py-0.5 border" style={{ color: 'var(--lagoon)', borderColor: 'var(--lagoon)', fontFamily: 'var(--font-mono)', background: 'var(--foam)', borderRadius: '2px' }}>
            {syllogism.mood}
          </span>
          {syllogism.mnemonic && (
            <span className="text-xs italic" style={{ color: 'var(--sea-ink-soft)' }}>{syllogism.mnemonic}</span>
          )}
        </div>
        {showSetSelect && onSetChange && (
          <select
            value={selectedSet}
            onChange={onSetChange}
            className="text-xs font-bold outline-none cursor-pointer border w-full"
            style={{ fontFamily: 'var(--font-mono)', background: 'var(--foam)', color: 'var(--sea-ink)', borderColor: 'var(--line)', borderRadius: '2px', padding: '3px 6px' }}
          >
            <option value="standard">Standard Carroll Set (24)</option>
            <option value="custom">Color / Taste / Apple Set (24)</option>
          </select>
        )}
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
