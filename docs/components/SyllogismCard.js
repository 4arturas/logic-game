window.LogicGame = window.LogicGame || {};

(function() {
  var React = window.React;
  var h = React.createElement;
  var useState = React.useState;

  function SyllogismFigurePattern(props) {
    var figure = props.figure;
    var reverse = props.reverse;

    var mColor = 'var(--term-m)';
    var sColor = 'var(--term-x)';
    var pColor = 'var(--term-y)';
    var lineColor = 'var(--sea-ink-soft)';

    var topRow = figure === 1 || figure === 3 ? ['M', 'P'] : ['P', 'M'];
    var bottomRow = figure === 3 || figure === 4 ? ['M', 'S'] : ['S', 'M'];

    var row1 = reverse ? bottomRow : topRow;
    var row2 = reverse ? topRow : bottomRow;

    var node11 = row1[0], node12 = row1[1];
    var node21 = row2[0], node22 = row2[1];

    function getColor(term) {
      if (term === 'M') return mColor;
      if (term === 'S') return sColor;
      if (term === 'P') return pColor;
      return 'var(--sea-ink)';
    }

    var xLeft = 14, xRight = 50, yTop = 14, yBottom = 38;
    var mTopX = node11 === 'M' ? xLeft : xRight;
    var mBottomX = node21 === 'M' ? xLeft : xRight;

    return h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6px 12px 4px 12px', background: 'white', borderRadius: '4px', border: '1px solid var(--line)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } },
      h('svg', { width: '64', height: '52', viewBox: '0 0 64 52', fill: 'none', style: { overflow: 'visible' } },
        h('line', { x1: xLeft, y1: yTop, x2: xRight, y2: yTop, stroke: lineColor, strokeWidth: '1.5', strokeDasharray: '3 3', opacity: '0.3' }),
        h('line', { x1: xLeft, y1: yBottom, x2: xRight, y2: yBottom, stroke: lineColor, strokeWidth: '1.5', strokeDasharray: '3 3', opacity: '0.3' }),
        h('line', { x1: mTopX, y1: yTop, x2: mBottomX, y2: yBottom, stroke: mColor, strokeWidth: '2.5', strokeLinecap: 'round' }),
        h('g', { transform: 'translate(' + xLeft + ', ' + yTop + ')' },
          h('circle', { cx: '0', cy: '0', r: '9', fill: getColor(node11), stroke: 'white', strokeWidth: '2' }),
          h('text', { x: '0', y: '1', textAnchor: 'middle', dominantBaseline: 'middle', fill: 'white', fontSize: '10', fontWeight: 'bold', fontFamily: 'monospace' }, node11)
        ),
        h('g', { transform: 'translate(' + xRight + ', ' + yTop + ')' },
          h('circle', { cx: '0', cy: '0', r: '9', fill: getColor(node12), stroke: 'white', strokeWidth: '2' }),
          h('text', { x: '0', y: '1', textAnchor: 'middle', dominantBaseline: 'middle', fill: 'white', fontSize: '10', fontWeight: 'bold', fontFamily: 'monospace' }, node12)
        ),
        h('g', { transform: 'translate(' + xLeft + ', ' + yBottom + ')' },
          h('circle', { cx: '0', cy: '0', r: '9', fill: getColor(node21), stroke: 'white', strokeWidth: '2' }),
          h('text', { x: '0', y: '1', textAnchor: 'middle', dominantBaseline: 'middle', fill: 'white', fontSize: '10', fontWeight: 'bold', fontFamily: 'monospace' }, node21)
        ),
        h('g', { transform: 'translate(' + xRight + ', ' + yBottom + ')' },
          h('circle', { cx: '0', cy: '0', r: '9', fill: getColor(node22), stroke: 'white', strokeWidth: '2' }),
          h('text', { x: '0', y: '1', textAnchor: 'middle', dominantBaseline: 'middle', fill: 'white', fontSize: '10', fontWeight: 'bold', fontFamily: 'monospace' }, node22)
        )
      )
    );
  }

  function SyllogismCard(props) {
    var syllogism = props.syllogism;
    var t = props.t;
    var premiseOrder = (props.premiseOrder === undefined) ? 'standard' : props.premiseOrder;

    var _copied = useState(false);
    var copied = _copied[0];
    var setCopied = _copied[1];

    var reverse = premiseOrder === 'minor-first';

    function getTermColor(key) {
      if (key === syllogism.terms.minorTerm) return 'var(--term-x)';
      if (key === syllogism.terms.majorTerm) return 'var(--term-y)';
      if (key === syllogism.terms.middleTerm) return 'var(--term-m)';
      return 'inherit';
    }

    function formatProposition(prop) {
      var sKey = prop.subject;
      var pKey = prop.predicate;
      var s = t(sKey);
      var p = t(pKey);
      var verb = ['fur', 'tail', 'wings', 'hair', 'bloating'].some(function(w) { return pKey.indexOf(w) > -1; }) ? t('quiz.have') : t('quiz.are');

      var sSpan = h('span', { style: { color: getTermColor(sKey), fontWeight: 700 } }, s);
      var pSpan = h('span', { style: { color: getTermColor(pKey), fontWeight: 700 } }, p);
      var space = ' ';

      if (prop.quantifier === 'E') return React.createElement(React.Fragment, null, t('quiz.no_word'), space, sSpan, space, verb, space, pSpan, '.');
      if (prop.quantifier === 'O') return React.createElement(React.Fragment, null, t('quiz.some_word'), space, sSpan, space, verb, space, t('quiz.not_word'), space, pSpan, '.');
      if (prop.quantifier === 'A') return React.createElement(React.Fragment, null, t('quiz.all_word'), space, sSpan, space, verb, space, pSpan, '.');
      return React.createElement(React.Fragment, null, t('quiz.some_word'), space, sSpan, space, verb, space, pSpan, '.');
    }

    function getFullSyllogismText() {
      var items = premiseOrder === 'major-first'
        ? [syllogism.premises.major, syllogism.premises.minor]
        : [syllogism.premises.minor, syllogism.premises.major];

      function format(prop) {
        var s = t(prop.subject);
        var p = t(prop.predicate);
        var verb = ['fur', 'tail', 'wings', 'hair', 'bloating'].some(function(w) { return prop.predicate.indexOf(w) > -1; }) ? t('quiz.have') : t('quiz.are');
        if (prop.quantifier === 'E') return t('quiz.no_word') + ' ' + s + ' ' + verb + ' ' + p + '.';
        if (prop.quantifier === 'O') return t('quiz.some_word') + ' ' + s + ' ' + verb + ' ' + t('quiz.not_word') + ' ' + p + '.';
        if (prop.quantifier === 'A') return t('quiz.all_word') + ' ' + s + ' ' + verb + ' ' + p + '.';
        return t('quiz.some_word') + ' ' + s + ' ' + verb + ' ' + p + '.';
      }

      return items.map(format).join('\n') + '\n\u2234 ' + format(syllogism.conclusion);
    }

    function handleCopy(e) {
      e.stopPropagation();
      try { navigator.clipboard.writeText(getFullSyllogismText()); } catch(e) {}
      setCopied(true);
      setTimeout(function() { setCopied(false); }, 2000);
    }

    var premises = premiseOrder === 'major-first'
      ? [
          { type: 'major', prop: syllogism.premises.major, label: t('quiz.major_premise') },
          { type: 'minor', prop: syllogism.premises.minor, label: t('quiz.minor_premise') },
        ]
      : [
          { type: 'minor', prop: syllogism.premises.minor, label: t('quiz.minor_premise') },
          { type: 'major', prop: syllogism.premises.major, label: t('quiz.major_premise') },
        ];

    var rowStyle = { border: '1px solid var(--line)', borderLeftWidth: '3px', borderRadius: '2px', padding: '7px 10px', marginBottom: '8px' };
    var headerLabelStyle = { fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' };

    return h('div', { style: { background: 'var(--surface-strong)', border: '1.5px solid var(--line)', borderRadius: '8px', overflow: 'hidden' } },
      h('div', { style: { background: 'var(--sand)', borderBottom: '1.5px solid var(--line)', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' } },
        h('div', { style: { flex: 1 } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' } },
            h('span', { style: { color: 'white', fontSize: '10px', fontWeight: 700, padding: '2px 8px', background: 'var(--sea-ink)', fontFamily: 'var(--font-mono)', borderRadius: '3px' } }, 'Fig. ' + syllogism.figure),
            h('span', { style: { color: 'var(--lagoon)', fontSize: '10px', fontWeight: 700, padding: '2px 8px', border: '1px solid var(--lagoon)', fontFamily: 'var(--font-mono)', background: 'var(--foam)', borderRadius: '3px' } }, syllogism.mood),
            syllogism.mnemonic ? h('span', { style: { fontSize: '10px', fontStyle: 'italic', color: 'var(--sea-ink-soft)', fontWeight: 700 } }, syllogism.mnemonic) : null
          ),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } },
            h('button', {
              onClick: handleCopy,
              style: {
                display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px',
                borderRadius: '4px', border: '1px solid', cursor: 'pointer', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                background: copied ? 'var(--palm)' : 'white',
                color: copied ? 'white' : 'var(--sea-ink)',
                borderColor: copied ? 'var(--palm)' : 'var(--line)'
              }
            }, copied ? '\u2713 ' + (t('home.copied') || 'Copied') : '\u{1F4CB} ' + (t('home.copy') || 'Copy'))
          )
        ),
        h(SyllogismFigurePattern, { figure: syllogism.figure, reverse: reverse })
      ),
      h('div', { style: { padding: '10px 12px' } },
        premises.map(function(item) {
          return h('div', { key: item.type, style: Object.assign({}, rowStyle, { borderLeftColor: 'var(--lagoon)', background: 'var(--foam)' }) },
            h('div', { style: Object.assign({}, headerLabelStyle, { color: 'var(--lagoon)' }) }, item.label),
            h('p', { style: { fontSize: '13px', lineHeight: 1.4, margin: '0 0 4px 0', color: 'var(--sea-ink)' } }, formatProposition(item.prop)),
            h(LogicGame.PropositionLogicSequence, { prop: item.prop, syllogism: syllogism })
          );
        }),
        h('div', { style: Object.assign({}, rowStyle, { borderLeftColor: 'var(--palm)', background: 'var(--hero-a)' }) },
          h('div', { style: Object.assign({}, headerLabelStyle, { color: 'var(--palm)' }) }, t('quiz.conclusion') + ' \u2234'),
          h('p', { style: { fontSize: '13px', lineHeight: 1.4, margin: '0 0 4px 0', color: 'var(--sea-ink)' } }, formatProposition(syllogism.conclusion)),
          h(LogicGame.PropositionLogicSequence, { prop: syllogism.conclusion, syllogism: syllogism })
        )
      ),
      h('div', { style: { borderTop: '1.5px solid var(--line)', background: 'var(--sand)', padding: '7px 12px' } },
        h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', textAlign: 'center' } },
          [
            { label: t('quiz.minor_term'), term: syllogism.terms.minorTerm, color: 'var(--term-x)' },
            { label: t('quiz.major_term'), term: syllogism.terms.majorTerm, color: 'var(--term-y)' },
            { label: t('quiz.middle_term'), term: syllogism.terms.middleTerm, color: 'var(--term-m)' },
          ].map(function(item) {
            return h('div', { key: item.label },
              h('div', { style: { color: 'var(--sea-ink-soft)', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '2px' } }, item.label),
              h('div', { style: { color: item.color, fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' } }, t(item.term))
            );
          })
        )
      )
    );
  }

  LogicGame.SyllogismCard = SyllogismCard;
})();
