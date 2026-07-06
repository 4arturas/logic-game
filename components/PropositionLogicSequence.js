function PropositionLogicSequence(props) {
  var prop = props.prop;
  var syllogism = props.syllogism;

  function getVariable(term) {
    var isComplement = term.indexOf("'") > -1;
    var baseTerm = isComplement ? term.slice(0, -1) : term;
    var variable = '';
    var termColor = 'inherit';
    if (baseTerm === 'x' || baseTerm === (syllogism.terms ? syllogism.terms.minorTerm : null)) {
      variable = 'x'; termColor = 'var(--term-x)';
    } else if (baseTerm === 'y' || baseTerm === (syllogism.terms ? syllogism.terms.majorTerm : null)) {
      variable = 'y'; termColor = 'var(--term-y)';
    } else if (baseTerm === 'm' || baseTerm === (syllogism.terms ? syllogism.terms.middleTerm : null)) {
      variable = 'm'; termColor = 'var(--term-m)';
    }
    return { text: variable + (isComplement ? "'" : ''), color: termColor };
  }

  var relationSign = '\u2286';
  var rightTermStr = prop.predicate;

  if (prop.quantifier === 'E') { rightTermStr = prop.predicate + "'"; }
  else if (prop.quantifier === 'I') { relationSign = '\u2229'; }
  else if (prop.quantifier === 'O') { relationSign = '\u2229'; rightTermStr = prop.predicate + "'"; }

  var leftVar = getVariable(prop.subject);
  var rightVar = getVariable(rightTermStr);

  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', padding: '4px 8px', background: 'var(--surface)', borderRadius: '4px', border: '1px solid var(--line)' }}>
      <span style={{ color: leftVar.color, fontWeight: 900 }}>{leftVar.text}</span>
      <span style={{ color: 'var(--palm)', fontWeight: 700 }}>{relationSign}</span>
      <span style={{ color: rightVar.color, fontWeight: 900 }}>{rightVar.text}</span>
      {(prop.quantifier === 'I' || prop.quantifier === 'O')
        ? <span style={{ color: 'var(--sea-ink)', fontSize: '10px', fontWeight: 700, marginLeft: '2px' }}>{'\u2260 \u2205'}</span>
        : null}
    </div>
  );
}
