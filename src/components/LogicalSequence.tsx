import { useTranslation } from '../i18n/I18nContext'
import { getLogicalSequence, type Syllogism } from '../../logic'

interface LogicalSequenceProps {
  syllogism: Syllogism
}

export function LogicalSequence({ syllogism }: LogicalSequenceProps) {
  const { t } = useTranslation()
  const sequence = getLogicalSequence(syllogism)

  if (!sequence) return null

  const renderTerm = (term: string) => {
    const isComplement = term.endsWith("'")
    const baseTerm = isComplement ? term.slice(0, -1) : term
    
    // map abstract 'x', 'y', 'm' to actual term names from syllogism info
    let termName = ''
    let termColor = 'inherit'
    
    if (baseTerm === 'x') {
      termName = t(syllogism.terms.minorTerm as any)
      termColor = 'var(--term-x)'
    } else if (baseTerm === 'y') {
      termName = t(syllogism.terms.majorTerm as any)
      termColor = 'var(--term-y)'
    } else if (baseTerm === 'm') {
      termName = t(syllogism.terms.middleTerm as any)
      termColor = 'var(--term-m)'
    }

    return (
      <div className="flex flex-col items-center justify-center">
        <span className="font-bold text-2xl" style={{ color: termColor, fontFamily: '"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif' }}>{term}</span>
        <span className="text-gray-600 text-xs">({termName})</span>
      </div>
    )
  }

  return (
    <div className="mt-4 p-4 bg-white/50 rounded-lg border border-dashed border-[var(--lagoon)] animate-fade-in">
      <p className="text-sm font-semibold text-[var(--sea-ink-soft)] mb-3 text-center">
        {t('quiz.logical_sequence_prelude')}
      </p>
      <div className="flex justify-center items-center gap-4 text-lg">
        {sequence.terms.map((term, idx) => (
          <div key={idx} className="flex items-center gap-4">
            {renderTerm(term)}
            {idx < sequence.terms.length - 1 && (
              <div className="text-[var(--palm)] font-black text-2xl pb-4" style={{ fontFamily: '"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", sans-serif' }}>⊆</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
