var { useState, useMemo, useContext } = React;

function SyllogismSolver(props) {
  var syllogism = props.syllogism;
  var onCorrect = props.onCorrect;
  var onNext = props.onNext;
  var showNextButton = props.showNextButton !== false;
  var initialLargeState = props.initialLargeState || {};
  var initialSmallState = props.initialSmallState || {};
  var t = props.t;
  var premiseOrder = (props.premiseOrder === undefined) ? 'standard' : props.premiseOrder;

  var _largeState = useState(initialLargeState);
  var largeState = _largeState[0];
  var setLargeState = _largeState[1];

  var _smallState = useState(initialSmallState);
  var smallState = _smallState[0];
  var setSmallState = _smallState[1];

  var _valResult = useState(null);
  var validationResult = _valResult[0];
  var setValidationResult = _valResult[1];

  var _helpState = useState(false);
  var showHelp = _helpState[0];
  var setShowHelp = _helpState[1];

  var _answerState = useState(false);
  var showAnswer = _answerState[0];
  var setShowAnswer = _answerState[1];

  var correctEncoding = useMemo(function() {
    return Logic.generateDiagram(syllogism);
  }, [syllogism]);

  function cycleCounter(type, id) {
    if (validationResult && validationResult.isCorrect) return;
    var setState = type === 'small' ? setSmallState : setLargeState;
    setState(function(prev) {
      var currentState = prev[id] || null;
      var nextState = currentState === null ? 'red' : (currentState === 'red' ? 'grey' : null);
      var newState = Object.assign({}, prev);
      if (nextState === null) delete newState[id];
      else newState[id] = nextState;
      return newState;
    });
  }

  function getStatusCodes() {
    function getStateCode(state, cellIds, prefix) {
      return cellIds.map(function(id) {
        var key = prefix === 'lg' ? prefix + '_' + id : prefix + id;
        var val = state[key] === 'red' ? '1' : state[key] === 'grey' ? '0' : '-';
        return id + '-' + val;
      }).join(',');
    }
    return {
      dd: getStateCode(largeState, [9,10,11,12,13,14,15,16], 'lg'),
      md: getStateCode(smallState, [5,6,7,8], 'c')
    };
  }

  function handleValidate() {
    var codes = getStatusCodes();
    var result = Logic.validateUserDiagram('DD=' + codes.dd, 'MD=' + codes.md, correctEncoding);
    setValidationResult(result);
    if (result.isCorrect) {
      if (onCorrect) onCorrect();
    }
  }

  function handleClear() {
    setLargeState({});
    setSmallState({});
    setValidationResult(null);
    setShowAnswer(false);
  }

  var statusCodes = getStatusCodes();

  var syllogismText = (function() {
    var items = premiseOrder === 'reversed'
      ? [syllogism.premises.minor, syllogism.premises.major]
      : [syllogism.premises.major, syllogism.premises.minor];

    function format(prop) {
      var s = t(prop.subject);
      var p = t(prop.predicate);
      var verb = t('quiz.are');
      if (prop.quantifier === 'E') return t('quiz.no_word') + ' ' + s + ' ' + verb + ' ' + p + '.';
      if (prop.quantifier === 'O') return t('quiz.some_word') + ' ' + s + ' ' + verb + ' ' + t('quiz.not_word') + ' ' + p + '.';
      if (prop.quantifier === 'A') return t('quiz.all_word') + ' ' + s + ' ' + verb + ' ' + p + '.';
      return t('quiz.some_word') + ' ' + s + ' ' + verb + ' ' + p + '.';
    }

    return items.map(format).join('\n') + '\n\u2234 ' + format(syllogism.conclusion);
  })();

  function LargeZigZagPattern() {
    var figure = syllogism.figure;
    var reverse = premiseOrder === 'reversed';
    var mColor = 'var(--term-m)';
    var sColor = 'var(--term-x)';
    var pColor = 'var(--term-y)';
    var lineColor = 'var(--sea-ink-soft)';

    var topRowTypes = figure === 1 || figure === 3 ? ['M', 'P'] : ['P', 'M'];
    var bottomRowTypes = figure === 3 || figure === 4 ? ['M', 'S'] : ['S', 'M'];

    var row1Types = reverse ? bottomRowTypes : topRowTypes;
    var row2Types = reverse ? topRowTypes : bottomRowTypes;

    var premises = reverse
      ? [syllogism.premises.minor, syllogism.premises.major]
      : [syllogism.premises.major, syllogism.premises.minor];

    var prop1 = premises[0];
    var prop2 = premises[1];

    function getRelationInfo(prop) {
      var rel = '\u2286';
      var rightIsComplement = false;
      var showEmpty = false;
      if (prop.quantifier === 'E') { rightIsComplement = true; }
      else if (prop.quantifier === 'I') { rel = '\u2229'; showEmpty = true; }
      else if (prop.quantifier === 'O') { rel = '\u2229'; rightIsComplement = true; showEmpty = true; }
      return { rel: rel, rightIsComplement: rightIsComplement, showEmpty: showEmpty };
    }

    var rel1 = getRelationInfo(prop1);
    var rel2 = getRelationInfo(prop2);

    function getVarInfo(baseTermType, isComplement) {
      var variable = '';
      var termColor = 'inherit';
      var translated = '';
      if (baseTermType === 'S') { variable = 'x'; termColor = sColor; translated = t(syllogism.terms.minorTerm); }
      else if (baseTermType === 'P') { variable = 'y'; termColor = pColor; translated = t(syllogism.terms.majorTerm); }
      else if (baseTermType === 'M') { variable = 'm'; termColor = mColor; translated = t(syllogism.terms.middleTerm); }
      return { text: variable + (isComplement ? "'" : ''), color: termColor, translated: translated };
    }

    var nodes = [
      { xPos: 100, yPos: 40, info: getVarInfo(row1Types[0], false) },
      { xPos: 300, yPos: 40, info: getVarInfo(row1Types[1], rel1.rightIsComplement) },
      { xPos: 100, yPos: 120, info: getVarInfo(row2Types[0], false) },
      { xPos: 300, yPos: 120, info: getVarInfo(row2Types[1], rel2.rightIsComplement) }
    ];

    var mTopIdx = row1Types[0] === 'M' ? 0 : 1;
    var mBottomIdx = row2Types[0] === 'M' ? 2 : 3;

    return (
      <div style={{ background: 'var(--surface)', border: '2px solid var(--line)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 8px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '8px', left: '12px', display: 'flex', gap: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('atlas.figure') + ' ' + figure}</span>
        </div>
        <svg width="100%" height="160" viewBox="0 0 460 160" style={{ overflow: 'visible', maxWidth: '460px' }}>
          <line x1="100" y1="40" x2="300" y2="40" stroke={lineColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
          <line x1="100" y1="120" x2="300" y2="120" stroke={lineColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
          <g transform="translate(200, 40)">
            <rect x="-35" y="-26" width="70" height="52" rx="12" fill="var(--surface)" />
            <text x="0" y="2" textAnchor="middle" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="28" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif'>{rel1.rel}</text>
          </g>
          <g transform="translate(200, 120)">
            <rect x="-35" y="-26" width="70" height="52" rx="12" fill="var(--surface)" />
            <text x="0" y="2" textAnchor="middle" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="28" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif'>{rel2.rel}</text>
          </g>
          {rel1.showEmpty ? <text x="395" y="42" textAnchor="start" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="22" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif'>{'\u2260 \u2205'}</text> : null}
          {rel2.showEmpty ? <text x="395" y="122" textAnchor="start" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="22" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif'>{'\u2260 \u2205'}</text> : null}
          <line x1={nodes[mTopIdx].xPos.toString()} y1="40" x2={nodes[mBottomIdx].xPos.toString()} y2="120" stroke={mColor} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
          {nodes.map(function(node, idx) {
            return (
              <g key={idx} transform={'translate(' + node.xPos + ', ' + node.yPos + ')'}>
                <rect x="-80" y="-22" width="160" height="44" rx="22" fill="var(--foam)" stroke={node.info.color} strokeWidth="2.5" />
                <text x="0" y="-4" textAnchor="middle" dominantBaseline="middle" fill={node.info.color} fontSize="14" fontWeight="900" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", monospace'>{node.info.text}</text>
                <text x="0" y="12" textAnchor="middle" dominantBaseline="middle" fill={node.info.color} fontSize="11" fontWeight="bold" fontFamily='var(--font-sans)'>{node.info.translated}</text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  function FolZigZagPattern() {
    var figure = syllogism.figure;
    var reverse = premiseOrder === 'reversed';
    var mColor = 'var(--term-m)';
    var sColor = 'var(--term-x)';
    var pColor = 'var(--term-y)';
    var lineColor = 'var(--sea-ink-soft)';

    var topRowTypes = figure === 1 || figure === 3 ? ['M', 'P'] : ['P', 'M'];
    var bottomRowTypes = figure === 3 || figure === 4 ? ['M', 'S'] : ['S', 'M'];

    var row1Types = reverse ? bottomRowTypes : topRowTypes;
    var row2Types = reverse ? topRowTypes : bottomRowTypes;

    var premises = reverse
      ? [syllogism.premises.minor, syllogism.premises.major]
      : [syllogism.premises.major, syllogism.premises.minor];

    var prop1 = premises[0];
    var prop2 = premises[1];

    function getFolInfo(prop) {
      var prefix = '\u2200x (';
      var rel = '\u2192';
      var rightIsComplement = false;
      if (prop.quantifier === 'E') { prefix = '\u00AC\u2203x ('; rel = '\u2227'; }
      else if (prop.quantifier === 'I') { prefix = '\u2203x ('; rel = '\u2227'; }
      else if (prop.quantifier === 'O') { prefix = '\u2203x ('; rel = '\u2227'; rightIsComplement = true; }
      return { prefix: prefix, rel: rel, rightIsComplement: rightIsComplement };
    }

    var fol1 = getFolInfo(prop1);
    var fol2 = getFolInfo(prop2);

    function getVarInfo(baseTermType, isComplement) {
      var predicate = '';
      var termColor = 'inherit';
      var translated = '';
      if (baseTermType === 'S') { predicate = 'S(x)'; termColor = sColor; translated = t(syllogism.terms.minorTerm); }
      else if (baseTermType === 'P') { predicate = 'P(x)'; termColor = pColor; translated = t(syllogism.terms.majorTerm); }
      else if (baseTermType === 'M') { predicate = 'M(x)'; termColor = mColor; translated = t(syllogism.terms.middleTerm); }
      return { text: (isComplement ? '\u00AC' : '') + predicate, color: termColor, translated: translated };
    }

    var nodeY1 = 40, nodeY2 = 120, xLeft = 150, xRight = 370;

    var nodes = [
      { xPos: xLeft, yPos: nodeY1, info: getVarInfo(row1Types[0], false) },
      { xPos: xRight, yPos: nodeY1, info: getVarInfo(row1Types[1], fol1.rightIsComplement) },
      { xPos: xLeft, yPos: nodeY2, info: getVarInfo(row2Types[0], false) },
      { xPos: xRight, yPos: nodeY2, info: getVarInfo(row2Types[1], fol2.rightIsComplement) }
    ];

    var mTopIdx = row1Types[0] === 'M' ? 0 : 1;
    var mBottomIdx = row2Types[0] === 'M' ? 2 : 3;

    return (
      <div style={{ background: 'var(--surface)', border: '2px solid var(--line)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 8px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '8px', left: '12px', display: 'flex', gap: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>FOL</span>
        </div>
        <svg width="100%" height="160" viewBox="0 0 520 160" style={{ overflow: 'visible', maxWidth: '520px' }}>
          <line x1={xLeft.toString()} y1={nodeY1.toString()} x2={xRight.toString()} y2={nodeY1.toString()} stroke={lineColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
          <line x1={xLeft.toString()} y1={nodeY2.toString()} x2={xRight.toString()} y2={nodeY2.toString()} stroke={lineColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
          <g transform={'translate(' + ((xLeft + xRight) / 2) + ', ' + nodeY1 + ')'}>
            <rect x="-24" y="-20" width="48" height="40" rx="8" fill="var(--surface)" />
            <text x="0" y="2" textAnchor="middle" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="26" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif'>{fol1.rel}</text>
          </g>
          <g transform={'translate(' + ((xLeft + xRight) / 2) + ', ' + nodeY2 + ')'}>
            <rect x="-24" y="-20" width="48" height="40" rx="8" fill="var(--surface)" />
            <text x="0" y="2" textAnchor="middle" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="26" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif'>{fol2.rel}</text>
          </g>
          <text x="70" y={(nodeY1 + 2).toString()} textAnchor="end" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="24" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif'>{fol1.prefix}</text>
          <text x="70" y={(nodeY2 + 2).toString()} textAnchor="end" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="24" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif'>{fol2.prefix}</text>
          <text x="450" y={(nodeY1 + 2).toString()} textAnchor="start" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="24" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif'> )</text>
          <text x="450" y={(nodeY2 + 2).toString()} textAnchor="start" dominantBaseline="middle" fill="var(--sea-ink)" fontSize="24" fontWeight="bold" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", serif'> )</text>
          <line x1={nodes[mTopIdx].xPos.toString()} y1={nodeY1.toString()} x2={nodes[mBottomIdx].xPos.toString()} y2={nodeY2.toString()} stroke={mColor} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
          {nodes.map(function(node, idx) {
            return (
              <g key={idx} transform={'translate(' + node.xPos + ', ' + node.yPos + ')'}>
                <rect x="-70" y="-22" width="140" height="44" rx="22" fill="var(--foam)" stroke={node.info.color} strokeWidth="2.5" />
                <text x="0" y="-4" textAnchor="middle" dominantBaseline="middle" fill={node.info.color} fontSize="14" fontWeight="900" fontFamily='"Segoe UI Symbol", "DejaVu Sans", "Arial Unicode MS", "Times New Roman", monospace'>{node.info.text}</text>
                <text x="0" y="12" textAnchor="middle" dominantBaseline="middle" fill={node.info.color} fontSize="11" fontWeight="bold" fontFamily='var(--font-sans)'>{node.info.translated}</text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', width: '100%', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '16px' }}>
          <SyllogismCard syllogism={syllogism} t={t} premiseOrder={premiseOrder} />
          <LargeZigZagPattern />
          <FolZigZagPattern />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', padding: '8px', background: 'var(--sand)', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '10px', color: 'var(--sea-ink-soft)' }}>
            <span style={{ fontWeight: 700 }}>FOL key:</span>
            <span>            <span><span style={{ fontWeight: 700, color: 'var(--lagoon)' }}>{'\u2200'}</span>x = for all x</span>
            <span><span style={{ fontWeight: 700, color: 'var(--lagoon)' }}>{'\u2203'}</span>x = there exists x</span>
            <span><span style={{ fontWeight: 700, color: 'var(--term-x)' }}>{'\u00AC\u2203'}</span>x = there does not exist x</span>
            <span><span style={{ fontWeight: 700, color: 'var(--term-x)' }}>{'\u00AC'}</span> = not</span>
            <span><span style={{ fontWeight: 700, color: 'var(--palm)' }}>{'\u2192'}</span> = implies</span>
            <span><span style={{ fontWeight: 700, color: 'var(--palm)' }}>{'\u2227'}</span> = and</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <span className="island-kicker">{t('home.large_diagram')}</span>
          </div>
          <LargeDiagram
            state={largeState}
            onCellClick={function(id) { cycleCounter('large', id); }}
            minorTerm={syllogism.terms.minorTerm}
            majorTerm={syllogism.terms.majorTerm}
            middleTerm={syllogism.terms.middleTerm}
            t={t}
            isReadOnly={validationResult && validationResult.isCorrect}
          />
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <span className="island-kicker">{t('home.small_diagram')}</span>
          </div>
          <SmallDiagram
            state={smallState}
            onCellClick={function(id) { cycleCounter('small', id); }}
            minorTerm={syllogism.terms.minorTerm}
            majorTerm={syllogism.terms.majorTerm}
            middleTerm={syllogism.terms.middleTerm}
            t={t}
            isReadOnly={validationResult && validationResult.isCorrect}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '16px' }}>
          <div style={{ padding: '24px', borderRadius: '8px', background: 'var(--surface-strong)', border: '1px solid var(--line)', borderLeft: '4px solid var(--sea-ink)' }}>
            <h3 className="island-kicker" style={{ color: 'var(--sea-ink)', marginBottom: '16px', margin: '0 0 16px 0' }}>{t('home.controls')}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
              <button onClick={handleValidate}
                disabled={validationResult && validationResult.isCorrect}
                style={{
                  padding: '8px 24px', borderRadius: '6px', fontSize: '10px', fontWeight: 900,
                  textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                  background: (validationResult && validationResult.isCorrect) ? 'var(--sand)' : 'var(--lagoon)',
                  color: (validationResult && validationResult.isCorrect) ? 'var(--sea-ink-soft)' : 'white'
                }}>{t('quiz.check_answer')}</button>
              <button onClick={handleClear} style={{
                padding: '8px 24px', borderRadius: '6px', fontSize: '10px', fontWeight: 900,
                textTransform: 'uppercase', border: '1px solid var(--line)', cursor: 'pointer',
                background: 'var(--foam)', color: 'var(--sea-ink)'
              }}>{t('home.clear_board')}</button>
              {(showNextButton && onNext) ? (
                <button onClick={onNext} style={{
                  padding: '8px 24px', borderRadius: '6px', fontSize: '10px', fontWeight: 900,
                  textTransform: 'uppercase', border: '1px solid var(--palm)', cursor: 'pointer',
                  background: 'var(--hero-a)', color: 'var(--palm)'
                }}>{t('quiz.next')}</button>
              ) : null}
            </div>
            {validationResult ? (
              <div style={{
                padding: '16px', borderRadius: '6px', borderLeft: '4px solid',
                background: validationResult.isCorrect ? 'var(--hero-a)' : 'rgba(220,38,38,0.08)',
                borderColor: validationResult.isCorrect ? 'var(--palm)' : '#dc2626',
                marginTop: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 900, color: validationResult.isCorrect ? 'var(--palm)' : '#dc2626' }}>
                    {validationResult.isCorrect ? '\u2713' : '\u2717'}
                  </span>
                  <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '10px', color: validationResult.isCorrect ? 'var(--palm)' : '#dc2626' }}>
                    {validationResult.isCorrect ? t('quiz.correct') : t('quiz.not_correct')}
                  </span>
                </div>
                {(!validationResult.isCorrect && validationResult.errors.length > 0) ? (
                  <ul style={{ margin: '0 0 8px 0', padding: '0 0 0 16px', fontSize: '9px', color: '#dc2626' }}>
                    {validationResult.errors.slice(0, 3).map(function(err, i) {
                      return <li key={i}>{err}</li>;
                    })}
                  </ul>
                ) : null}
                {(!validationResult.isCorrect) ? (
                  <button onClick={function() { setShowAnswer(!showAnswer); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '9px', fontWeight: 700, textDecoration: 'underline', color: '#dc2626', padding: 0 }}>
                    {showAnswer ? 'Hide Answer' : t('quiz.show_answer')}
                  </button>
                ) : null}
                {(showAnswer && !validationResult.isCorrect) ? (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', marginTop: '8px', opacity: 0.8 }}>
                    <div>DD={correctEncoding.dd}</div>
                    <div>MD={correctEncoding.md}</div>
                  </div>
                ) : null}
              </div>
            ) : null}
            <div style={{ marginTop: '16px' }}>
              <CopyCode dd={statusCodes.dd} md={statusCodes.md}
                terms={{ x: syllogism.terms.minorTerm, y: syllogism.terms.majorTerm, m: syllogism.terms.middleTerm }}
                syllogismText={syllogismText}
                onShowHelp={function() { setShowHelp(true); }} t={t} />
            </div>
          </div>
        </div>
      </div>
      {showHelp ? <HelpModal onClose={function() { setShowHelp(false); }} /> : null}
    </div>
  );
}
