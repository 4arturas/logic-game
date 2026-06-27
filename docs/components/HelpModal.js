window.LogicGame = window.LogicGame || {};

(function() {
  var React = window.React;
  var h = React.createElement;
  var useEffect = React.useEffect;
  var useContext = React.useContext;

  var HELP_RULES_DATA = {
    1: [13, 14], 2: [11, 12], 3: [11, 12], 4: [9, 10],
    5: [9, 15], 6: [12, 14], 7: [11, 13],
  };

  function HelpModal(props) {
    var onClose = props.onClose;
    var onApplyRule = props.onApplyRule;
    var I18nContext = LogicGame.I18nContext;
    var i18n = useContext(I18nContext);
    var t = i18n.t;

    useEffect(function() {
      function handleEsc(e) { if (e.key === 'Escape') onClose(); }
      window.addEventListener('keydown', handleEsc);
      return function() { window.removeEventListener('keydown', handleEsc); };
    }, [onClose]);

    return h('div', {
      onClick: onClose,
      style: {
        position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        padding: '16px'
      }
    },
      h('div', {
        onClick: function(e) { e.stopPropagation(); },
        style: {
          background: 'var(--surface)', width: '100%', maxWidth: '900px', borderRadius: '8px',
          border: '2px solid var(--line)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden'
        }
      },
        h('div', { style: { padding: '16px 24px', borderBottom: '1px solid var(--line)', background: 'var(--sand)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
            h('div', { style: { width: 32, height: 32, background: 'var(--sea-ink)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '12px', fontWeight: 900 } }, '?'),
            h('h2', { style: { fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--sea-ink)', margin: 0 } }, t('quiz.help_title'))
          ),
          h('button', { onClick: onClose, style: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--sea-ink-soft)', padding: '4px' } }, '\u2715')
        ),
        h('div', { style: { padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px' } },
          h('section', null,
            h('div', { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--lagoon)', paddingBottom: '4px', marginBottom: '16px' } },
              h('h3', { style: { fontSize: '10px', fontWeight: 900, color: 'var(--lagoon)', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 } }, t('quiz.help_title'))
            ),
            h('div', { style: { overflow: 'hidden', border: '2px solid var(--line)', borderRadius: '8px' } },
              h('table', { style: { width: '100%', borderCollapse: 'collapse' } },
                h('thead', null,
                  h('tr', { style: { background: 'var(--sand)', borderBottom: '1px solid var(--line)' } },
                    h('th', { style: { padding: '8px 12px', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--sea-ink-soft)', textAlign: 'left' } }, t('quiz.help_col1')),
                    h('th', { style: { padding: '8px 12px', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--sea-ink-soft)', textAlign: 'left' } }, t('quiz.help_col2')),
                    h('th', { style: { padding: '8px 12px', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--sea-ink-soft)', textAlign: 'left' } }, t('quiz.help_col3')),
                    h('th', { style: { padding: '8px 12px', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--sea-ink-soft)', textAlign: 'right' } }, t('quiz.help_col4'))
                  )
                ),
                h('tbody', { style: { borderTop: 'none' } },
                  [1,2,3,4,5,6,7].map(function(row) {
                    return h('tr', {
                      key: row,
                      onClick: function() { if (onApplyRule) onApplyRule(HELP_RULES_DATA[row]); },
                      style: { cursor: onApplyRule ? 'pointer' : 'default', borderBottom: '1px solid var(--line)' }
                    },
                      h('td', { style: { padding: '10px 12px', fontSize: '11px', fontWeight: 700, color: 'var(--sea-ink)' } }, t('quiz.help_row' + row + '_1')),
                      h('td', { style: { padding: '10px 12px', fontSize: '9px', color: 'var(--sea-ink-soft)', fontStyle: 'italic' } }, t('quiz.help_row' + row + '_2')),
                      h('td', { style: { padding: '10px 12px', fontSize: '9px', color: 'var(--sea-ink-soft)' } }, t('quiz.help_row' + row + '_3')),
                      h('td', { style: { padding: '10px 12px', fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--palm)', textAlign: 'right' } }, t('quiz.help_row' + row + '_4'))
                    );
                  })
                )
              )
            )
          ),
          h('section', null, h('span', { style: { fontSize: '10px', color: 'var(--sea-ink-soft)' } }, t('quiz.help_large_desc')))
        ),
        h('div', { style: { padding: '12px 24px', borderTop: '1px solid var(--line)', background: 'var(--sand)', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 } },
          h('button', {
            onClick: onClose,
            style: {
              padding: '8px 24px', background: 'var(--sea-ink)', color: 'white', border: 'none',
              borderRadius: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
              fontSize: '9px', cursor: 'pointer'
            }
          }, 'Close Reference')
        )
      )
    );
  }

  LogicGame.HelpModal = HelpModal;
})();
