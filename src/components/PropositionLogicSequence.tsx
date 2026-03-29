import type { Syllogism } from '../../logic'


interface PropositionLogicSequenceProps {
  prop: { quantifier: string; subject: string; predicate: string }
  syllogism: Syllogism
}

export function PropositionLogicSequence({ prop, syllogism }: PropositionLogicSequenceProps) {
  const getVariable = (term: string) => {
    const isComplement = term.endsWith("'")
    const baseTerm = isComplement ? term.slice(0, -1) : term
    
    let variable = ''
    let termColor = 'inherit'
    
    if (baseTerm === 'x' || baseTerm === syllogism.terms.minorTerm) {
      variable = 'x'
      termColor = 'var(--term-x)'
    } else if (baseTerm === 'y' || baseTerm === syllogism.terms.majorTerm) {
      variable = 'y'
      termColor = 'var(--term-y)'
    } else if (baseTerm === 'm' || baseTerm === syllogism.terms.middleTerm) {
      variable = 'm'
      termColor = 'var(--term-m)'
    }

    return {
      text: variable + (isComplement ? "'" : ""),
      color: termColor
    }
  }

  let relationSign = '⊆'
  let rightTermStr = prop.predicate

  if (prop.quantifier === 'E') {
    rightTermStr = prop.predicate + "'"
  } else if (prop.quantifier === 'I') {
    relationSign = '∩'
  } else if (prop.quantifier === 'O') {
    relationSign = '∩'
    rightTermStr = prop.predicate + "'"
  }

  const leftVar = getVariable(prop.subject)
  const rightVar = getVariable(rightTermStr)

  return (
    <div className="flex justify-center items-center gap-2 font-serif font-bold text-xl leading-none">
      <span style={{ color: leftVar.color }}>{leftVar.text}</span>
      <span className="text-[var(--palm)]">{relationSign}</span>
      <span style={{ color: rightVar.color }}>{rightVar.text}</span>
      {(prop.quantifier === 'I' || prop.quantifier === 'O') && (
        <span className="text-[var(--sea-ink)] whitespace-nowrap">≠ ∅</span>
      )}
    </div>
  )
}
