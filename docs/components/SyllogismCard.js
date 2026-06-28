var { useState } = React;

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

  function node(x, y, term) {
    return (
      <g transform={'translate(' + x + ', ' + y + ')'}>
        <circle cx="0" cy="0" r="9" fill={getColor(term)} stroke="white" strokeWidth="2" />
        <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">{term}</text>
      </g>
    );
  }

  return (
    <div style={{ flexShrink: 0, width: '64px', height: '52px' }}>
      <svg width="64" height="52" viewBox="0 0 64 52" fill="none" style={{ overflow: 'visible' }}>
        <line x1={xLeft} y1={yTop} x2={xRight} y2={yTop} stroke={lineColor} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
        <line x1={xLeft} y1={yBottom} x2={xRight} y2={yBottom} stroke={lineColor} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
        <line x1={mTopX} y1={yTop} x2={mBottomX} y2={yBottom} stroke={mColor} strokeWidth="2.5" strokeLinecap="round" />
        {node(xLeft, yTop, node11)}
        {node(xRight, yTop, node12)}
        {node(xLeft, yBottom, node21)}
        {node(xRight, yBottom, node22)}
      </svg>
    </div>
  );
}

function SyllogismCard(props) {
  var syllogism = props.syllogism;
  var t = props.t;
  var premiseOrder = (props.premiseOrder === undefined) ? 'standard' : props.premiseOrder;

  var _copied = useState(false);
  var copied = _copied[0];
  var setCopied = _copied[1];

  var reverse = premiseOrder === 'reversed';

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
    var sSpan = <span style={{ color: getTermColor(sKey), fontWeight: 700 }}>{s}</span>;
    var pSpan = <span style={{ color: getTermColor(pKey), fontWeight: 700 }}>{p}</span>;
    if (prop.quantifier === 'E') return <>{t('quiz.no_word')} {sSpan} {verb} {pSpan}.</>;
    if (prop.quantifier === 'O') return <>{t('quiz.some_word')} {sSpan} {verb} {t('quiz.not_word')} {pSpan}.</>;
    if (prop.quantifier === 'A') return <>{t('quiz.all_word')} {sSpan} {verb} {pSpan}.</>;
    return <>{t('quiz.some_word')} {sSpan} {verb} {pSpan}.</>;
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

  return (
    <div style={{ background: 'var(--surface)', border: '2px solid var(--line)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(15,25,35,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px 16px 12px 16px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 900, background: 'var(--lagoon)', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fig. {syllogism.figure}</span>
            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: 'var(--foam)', color: 'var(--sea-ink)', border: '1px solid var(--line)', fontFamily: 'var(--font-mono)' }}>{syllogism.mood}</span>
            {syllogism.mnemonic ? <span style={{ fontSize: '11px', fontStyle: 'italic', fontFamily: 'var(--font-serif)', color: 'var(--sea-ink-soft)' }}>{syllogism.mnemonic}</span> : null}
          </div>
          <div>
            <button onClick={handleCopy}
              style={{
                padding: '4px 10px', borderRadius: '4px', fontSize: '9px', fontWeight: 700,
                cursor: 'pointer', border: '1px solid',
                background: copied ? 'var(--palm)' : 'white',
                color: copied ? 'white' : 'var(--sea-ink)',
                borderColor: copied ? 'var(--palm)' : 'var(--line)',
                transition: 'all 200ms'
              }}>
              {copied ? '\u2713 ' + (t('home.copied') || 'Copied') : '\u{1F4CB} ' + (t('home.copy') || 'Copy')}
            </button>
          </div>
        </div>
        <SyllogismFigurePattern figure={syllogism.figure} reverse={reverse} />
      </div>
      <div style={{ padding: '12px 16px' }}>
        {premises.map(function(item) {
          return (
            <div key={item.type} style={{ position: 'relative', padding: '10px 12px', marginBottom: '6px', borderRadius: '8px', borderLeft: '3px solid var(--lagoon)', background: 'var(--foam)' }}>
              <div style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--lagoon)', marginBottom: '4px' }}>{item.label}</div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--sea-ink)', fontFamily: 'var(--font-serif)', lineHeight: 1.5 }}>{formatProposition(item.prop)}</p>
              <PropositionLogicSequence prop={item.prop} syllogism={syllogism} />
            </div>
          );
        })}
        <div style={{ position: 'relative', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid var(--palm)', background: 'var(--hero-a)' }}>
          <div style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--palm)', marginBottom: '4px' }}>{t('quiz.conclusion') + ' \u2234'}</div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--sea-ink)', fontFamily: 'var(--font-serif)', lineHeight: 1.5 }}>{formatProposition(syllogism.conclusion)}</p>
          <PropositionLogicSequence prop={syllogism.conclusion} syllogism={syllogism} />
        </div>
      </div>
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line)', background: 'var(--sand)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {[
            { label: t('quiz.minor_term'), term: syllogism.terms.minorTerm, color: 'var(--term-x)' },
            { label: t('quiz.major_term'), term: syllogism.terms.majorTerm, color: 'var(--term-y)' },
            { label: t('quiz.middle_term'), term: syllogism.terms.middleTerm, color: 'var(--term-m)' },
          ].map(function(item) {
            return (
              <div key={item.label}>
                <div style={{ fontSize: '8px', fontWeight: 700, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>{item.label}</div>
                <div style={{ fontSize: '12px', fontWeight: 900, color: item.color, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>{t(item.term)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
