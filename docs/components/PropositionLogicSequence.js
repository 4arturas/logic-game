window.LogicGame = window.LogicGame || {};

(function() {
  var React = window.React;
  var h = React.createElement;

  function PropositionLogicSequence(props) {
    var prop = props.prop;
    var syllogism = props.syllogism;

    function getVariable(term) {
      var isComplement = term.indexOf("'") > -1;
      var baseTerm = isComplement ? term.slice(0, -1) : term;
      var variable = '';
      var termColor = 'inherit';

      if (baseTerm === 'x' || baseTerm === (syllogism.terms ? syllogism.terms.minorTerm : null)) {
        variable = 'x';
        termColor = 'var(--term-x)';
      } else if (baseTerm === 'y' || baseTerm === (syllogism.terms ? syllogism.terms.majorTerm : null)) {
        variable = 'y';
        termColor = 'var(--term-y)';
      } else if (baseTerm === 'm' || baseTerm === (syllogism.terms ? syllogism.terms.middleTerm : null)) {
        variable = 'm';
        termColor = 'var(--term-m)';
      }

      return { text: variable + (isComplement ? "'" : ""), color: termColor };
    }

    var relationSign = '\u2286';
    var rightTermStr = prop.predicate;

    if (prop.quantifier === 'E') {
      rightTermStr = prop.predicate + "'";
    } else if (prop.quantifier === 'I') {
      relationSign = '\u2229';
    } else if (prop.quantifier === 'O') {
      relationSign = '\u2229';
      rightTermStr = prop.predicate + "'";
    }

    var leftVar = getVariable(prop.subject);
    var rightVar = getVariable(rightTermStr);

    return h('div', { style: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '15px', lineHeight: 1, fontFamily: '"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif', padding: '2px 0' } },
      h('span', { style: { color: leftVar.color } }, leftVar.text),
      h('span', { style: { color: 'var(--palm)' } }, relationSign),
      h('span', { style: { color: rightVar.color } }, rightVar.text),
      (prop.quantifier === 'I' || prop.quantifier === 'O')
        ? h('span', { style: { color: 'var(--sea-ink)', whiteSpace: 'nowrap', fontSize: '13px' } }, '\u2260 \u2205')
        : null
    );
  }

  LogicGame.PropositionLogicSequence = PropositionLogicSequence;
})();
