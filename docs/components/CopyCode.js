window.LogicGame = window.LogicGame || {};

(function() {
  var React = window.React;
  var h = React.createElement;
  var useState = React.useState;

  function CopyCode(props) {
    var dd = props.dd;
    var md = props.md;
    var terms = props.terms;
    var syllogismText = props.syllogismText;
    var onShowHelp = props.onShowHelp;
    var t = props.t || function(k) { return k; };

    var _useState = useState(false);
    var copied = _useState[0];
    var setCopied = _useState[1];

    function handleCopy() {
      var getTerm = function(val) { return t(val); };
      var textToCopy = (syllogismText ? t('home.copy_prefix') + '\n' + syllogismText + '\n\n' : '') +
        t('home.terms_label') + '\nx: ' + getTerm(terms.x) + '\ny: ' + getTerm(terms.y) + '\nm: ' + getTerm(terms.m) + '\n\n' +
        t('home.solution_label') + '\nDD=' + dd + '\nMD=' + md;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(function() { setCopied(false); }, 2000);
    }

    return h('div', { style: { background: 'var(--surface)', padding: '16px', borderRadius: '12px', border: '2px solid var(--chip-line)' } },
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' } },
        h('h3', { style: { fontSize: '10px', fontWeight: 900, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 } }, t('home.code')),
        h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
          onShowHelp ? h('span', { onClick: onShowHelp, style: { cursor: 'pointer', fontSize: '16px' } }, '\u2753') : null,
          h('button', {
            onClick: handleCopy,
            style: {
              background: copied ? 'var(--palm)' : 'var(--lagoon)',
              color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px',
              fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em',
              cursor: 'pointer'
            }
          }, copied ? t('home.copied') : t('home.copy'))
        )
      ),
      h('div', { style: { fontFamily: 'var(--font-mono)', fontSize: '10px', display: 'flex', flexDirection: 'column', gap: '8px' } },
        h('div', { style: { background: 'var(--foam)', padding: '10px', borderRadius: '8px', border: '1px solid var(--chip-line)', wordBreak: 'break-all' } },
          h('span', { style: { color: 'var(--lagoon)', fontWeight: 'bold', marginRight: '4px' } }, 'DD='),
          h('span', { style: { color: 'var(--sea-ink)' } }, dd)
        ),
        h('div', { style: { background: 'var(--foam)', padding: '10px', borderRadius: '8px', border: '1px solid var(--chip-line)', wordBreak: 'break-all' } },
          h('span', { style: { color: 'var(--lagoon)', fontWeight: 'bold', marginRight: '4px' } }, 'MD='),
          h('span', { style: { color: 'var(--sea-ink)' } }, md)
        )
      )
    );
  }

  LogicGame.CopyCode = CopyCode;
})();
