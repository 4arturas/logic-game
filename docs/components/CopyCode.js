var { useState } = React;

function CopyCode(props) {
  var dd = props.dd;
  var md = props.md;
  var terms = props.terms;
  var syllogismText = props.syllogismText;
  var onShowHelp = props.onShowHelp;
  var t = props.t || function(k) { return k; };

  var _copied = useState(false);
  var copied = _copied[0];
  var setCopied = _copied[1];

  function handleCopy() {
    var getTerm = function(val) { return t(val); };
    var textToCopy = (syllogismText ? t('home.copy_prefix') + '\n' + syllogismText + '\n\n' : '') +
      t('home.terms_label') + '\nx: ' + getTerm(terms.x) + '\ny: ' + getTerm(terms.y) + '\nm: ' + getTerm(terms.m) + '\n\n' +
      t('home.solution_label') + '\nDD=' + dd + '\nMD=' + md;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(function() { setCopied(false); }, 2000);
  }

  return (
    <div style={{ background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--line)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid var(--line)', background: 'var(--sand)' }}>
        <h3 style={{ margin: 0, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--sea-ink-soft)' }}>{t('home.code')}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onShowHelp ? <span onClick={onShowHelp} style={{ cursor: 'pointer', fontSize: '14px', lineHeight: 1 }}>{'\u2753'}</span> : null}
          <button onClick={handleCopy} style={{
            padding: '4px 12px', borderRadius: '4px', border: 'none',
            background: copied ? 'var(--palm)' : 'var(--lagoon)',
            color: 'white', cursor: 'pointer', fontSize: '9px', fontWeight: 700,
            transition: 'background 200ms'
          }}>
            {copied ? t('home.copied') : t('home.copy')}
          </button>
        </div>
      </div>
      <div style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '10px', lineHeight: 1.8 }}>
        <div><span style={{ color: 'var(--sea-ink-soft)', fontWeight: 700 }}>DD=</span><span style={{ color: 'var(--lagoon)' }}>{dd}</span></div>
        <div><span style={{ color: 'var(--sea-ink-soft)', fontWeight: 700 }}>MD=</span><span style={{ color: 'var(--lagoon)' }}>{md}</span></div>
      </div>
    </div>
  );
}
