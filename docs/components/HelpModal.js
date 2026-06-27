window.LogicGame = window.LogicGame || {};

(function() {
  var React = window.React;
  var h = React.createElement;
  var useState = React.useState;
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

    var _tab = useState('rules');
    var activeTab = _tab[0];
    var setActiveTab = _tab[1];

    var TABS = [
      { id: 'rules', label: t('quiz.help_title') },
      { id: 'symbols', label: t('quiz.help_symbols_title') },
      { id: 'guide', label: t('quiz.help_visual_guide') },
      { id: 'method', label: t('quiz.help_method_title') },
    ];

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
          background: 'var(--surface)', width: '100%', maxWidth: '1000px', borderRadius: '8px',
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
        // Tab bar
        h('div', { style: { display: 'flex', borderBottom: '1px solid var(--line)', background: 'var(--sand)', flexShrink: 0, overflowX: 'auto' } },
          TABS.map(function(tab) {
            var isActive = activeTab === tab.id;
            return h('button', {
              key: tab.id,
              onClick: function() { setActiveTab(tab.id); },
              style: {
                padding: '8px 16px', border: 'none', cursor: 'pointer', fontSize: '9px',
                fontWeight: isActive ? 800 : 600,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: isActive ? 'var(--sea-ink)' : 'var(--sea-ink-soft)',
                background: isActive ? 'var(--surface)' : 'transparent',
                borderBottom: isActive ? '2px solid var(--lagoon)' : '2px solid transparent',
                transition: 'all 120ms', whiteSpace: 'nowrap'
              }
            }, tab.label);
          })
        ),
        h('div', { style: { padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px' } },

          // Rules Table
          activeTab === 'rules' ? h('section', { key: 'rules' },
            h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--lagoon)', paddingBottom: '4px', marginBottom: '16px' } },
              h('h3', { style: { fontSize: '10px', fontWeight: 900, color: 'var(--lagoon)', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 } }, t('quiz.help_title')),
              onApplyRule ? h('span', { style: { fontSize: '9px', fontWeight: 700, color: 'var(--palm)', textTransform: 'uppercase', letterSpacing: '0.1em' } }, t('home.copied').toLowerCase() === 'copied!' ? 'Click to apply rule' : 'Spustel\u0117kite taisykl\u0119') : null
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
                h('tbody', null,
                  [1,2,3,4,5,6,7].map(function(row) {
                    return h('tr', {
                      key: row,
                      onClick: function() { if (onApplyRule) onApplyRule(HELP_RULES_DATA[row]); },
                      style: { cursor: onApplyRule ? 'pointer' : 'default', borderBottom: '1px solid var(--line)' }
                    },
                      h('td', { style: { padding: '10px 12px', fontSize: '15px', fontWeight: 700, color: 'var(--sea-ink)' } }, t('quiz.help_row' + row + '_1')),
                      h('td', { style: { padding: '10px 12px', fontSize: '13px', color: 'var(--sea-ink-soft)', fontStyle: 'italic' } }, t('quiz.help_row' + row + '_2')),
                      h('td', { style: { padding: '10px 12px', fontSize: '11px', color: 'var(--sea-ink-soft)' } }, t('quiz.help_row' + row + '_3')),
                      h('td', { style: { padding: '10px 12px', fontSize: '14px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--palm)', textAlign: 'right' } }, t('quiz.help_row' + row + '_4'))
                    );
                  })
                )
              )
            )
          ) : null,

          // Logical Symbols
          activeTab === 'symbols' ? h('section', { key: 'symbols' },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--palm)', paddingBottom: '4px', marginBottom: '24px' } },
              h('span', { style: { width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--hero-a)', border: '1px solid var(--palm)', color: 'var(--palm)', borderRadius: '50%', fontSize: '12px', fontStyle: 'italic' } }, '\u2229'),
              h('h3', { style: { fontSize: '10px', fontWeight: 900, color: 'var(--palm)', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 } }, t('quiz.help_symbols_title'))
            ),
            h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' } },
              [
                { symbol: '\u2286', desc: t('quiz.help_symbol_subset'), color: 'var(--palm)' },
                { symbol: '\u2229', desc: t('quiz.help_symbol_intersection'), color: 'var(--palm)' },
                { symbol: '\u2260 \u2205', desc: t('quiz.help_symbol_not_empty'), color: 'var(--sea-ink)' },
                { symbol: "'", desc: t('quiz.help_symbol_complement'), color: 'var(--term-x)' },
              ].map(function(item, idx) {
                return h('div', { key: idx, style: { background: 'var(--surface-strong)', padding: '16px', borderRadius: '8px', border: '2px solid var(--line)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' } },
                  h('div', { style: { fontSize: '24px', fontWeight: 900, color: item.color, fontFamily: 'var(--font-mono)' } }, item.symbol),
                  h('div', { style: { fontSize: '13px', fontWeight: 700, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.02em' } }, item.desc)
                );
              })
            )
          ) : null,

          // Visual Guide
          activeTab === 'guide' ? h('section', { key: 'guide' },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--sea-ink)', paddingBottom: '4px', marginBottom: '24px' } },
              h('span', { style: { width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--sand)', border: '1px solid var(--line)', color: 'var(--sea-ink)', borderRadius: '50%', fontSize: '10px', fontWeight: 900 } }, '!'),
              h('h3', { style: { fontSize: '10px', fontWeight: 900, color: 'var(--sea-ink)', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 } }, t('quiz.help_visual_guide'))
            ),
            h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' } },

              // Large Diagram Guide
              h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
                h('div', { style: { background: 'white', padding: '24px', borderRadius: '8px', border: '2px solid var(--line)', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                  h('h4', { style: { fontSize: '13px', fontWeight: 900, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px', fontFamily: 'var(--font-mono)' } }, t('home.large_diagram') + ' SCHEMATICS'),
                  h('svg', { viewBox: '0 0 400 400', style: { width: '100%', maxWidth: '280px', opacity: 0.8 } },
                    h('rect', { x: 10, y: 10, width: 380, height: 380, fill: 'none', stroke: 'var(--line)', strokeWidth: 2 }),
                    h('rect', { x: 105, y: 105, width: 190, height: 190, fill: 'none', stroke: 'var(--line)', strokeWidth: 1.5 }),
                    h('line', { x1: 10, y1: 200, x2: 390, y2: 200, stroke: 'var(--line)', strokeWidth: 1.5 }),
                    h('line', { x1: 200, y1: 10, x2: 200, y2: 390, stroke: 'var(--line)', strokeWidth: 1.5 }),
                    h('text', { x: 200, y: 70, textAnchor: 'middle', fill: 'var(--term-x)', fontSize: '28', fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontWeight: 700 }, 'x'),
                    h('text', { x: 200, y: 345, textAnchor: 'middle', fill: 'var(--term-x)', fontSize: '28', fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontWeight: 700 }, "x'"),
                    h('text', { x: 55, y: 210, textAnchor: 'middle', fill: 'var(--term-y)', fontSize: '28', fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontWeight: 700, transform: 'rotate(-90 55 210)' }, 'y'),
                    h('text', { x: 345, y: 210, textAnchor: 'middle', fill: 'var(--term-y)', fontSize: '28', fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontWeight: 700, transform: 'rotate(-90 345 210)' }, "y'"),
                    h('text', { x: 200, y: 215, textAnchor: 'middle', fill: 'var(--term-m)', fontSize: '28', fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontWeight: 700 }, 'm'),
                    [9,10,11,12,13,14,15,16].map(function(n) {
                      var positions = {
                        9: { x: 25, y: 35, a: 'start' }, 10: { x: 375, y: 35, a: 'end' },
                        11: { x: 120, y: 130, a: 'start' }, 12: { x: 280, y: 130, a: 'end' },
                        13: { x: 120, y: 285, a: 'start' }, 14: { x: 280, y: 285, a: 'end' },
                        15: { x: 25, y: 380, a: 'start' }, 16: { x: 375, y: 380, a: 'end' },
                      };
                      var p = positions[n];
                      return h('text', { key: n, x: p.x, y: p.y, textAnchor: p.a, fill: 'var(--sea-ink-soft)', fontSize: '14', fontWeight: 900, fontFamily: 'var(--font-mono)' }, n.toString());
                    })
                  )
                ),
                h('p', { style: { fontSize: '13px', color: 'var(--sea-ink-soft)', lineHeight: 1.6, fontStyle: 'italic', borderLeft: '2px solid var(--lagoon)', paddingLeft: '12px', margin: 0 } }, t('quiz.help_large_desc'))
              ),

              // Small Diagram Guide
              h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
                h('div', { style: { background: 'white', padding: '24px', borderRadius: '8px', border: '2px solid var(--line)', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                  h('h4', { style: { fontSize: '13px', fontWeight: 900, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px', fontFamily: 'var(--font-mono)' } }, t('home.small_diagram') + ' SCHEMATICS'),
                  h('svg', { viewBox: '0 0 250 250', style: { width: '100%', maxWidth: '220px', opacity: 0.8 } },
                    h('rect', { x: 5, y: 5, width: 240, height: 240, fill: 'none', stroke: 'var(--line)', strokeWidth: 2 }),
                    h('line', { x1: 125, y1: 5, x2: 125, y2: 245, stroke: 'var(--line)', strokeWidth: 1.5 }),
                    h('line', { x1: 5, y1: 125, x2: 245, y2: 125, stroke: 'var(--line)', strokeWidth: 1.5 }),
                    h('text', { x: 125, y: 65, textAnchor: 'middle', fill: 'var(--term-x)', fontSize: '28', fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontWeight: 700 }, 'x'),
                    h('text', { x: 125, y: 200, textAnchor: 'middle', fill: 'var(--term-x)', fontSize: '28', fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontWeight: 700 }, "x'"),
                    h('text', { x: 45, y: 135, textAnchor: 'middle', fill: 'var(--term-y)', fontSize: '28', fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontWeight: 700, transform: 'rotate(-90 45 135)' }, 'y'),
                    h('text', { x: 205, y: 135, textAnchor: 'middle', fill: 'var(--term-y)', fontSize: '28', fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontWeight: 700, transform: 'rotate(-90 205 135)' }, "y'"),
                    [5,6,7,8].map(function(n) {
                      var positions = {
                        5: { x: 20, y: 30, a: 'start' }, 6: { x: 230, y: 30, a: 'end' },
                        7: { x: 20, y: 235, a: 'start' }, 8: { x: 230, y: 235, a: 'end' },
                      };
                      var p = positions[n];
                      return h('text', { key: n, x: p.x, y: p.y, textAnchor: p.a, fill: 'var(--sea-ink-soft)', fontSize: '16', fontWeight: 900, fontFamily: 'var(--font-mono)' }, n.toString());
                    })
                  )
                ),
                h('p', { style: { fontSize: '13px', color: 'var(--sea-ink-soft)', lineHeight: 1.6, fontStyle: 'italic', borderLeft: '2px solid var(--palm)', paddingLeft: '12px', margin: 0 } }, t('quiz.help_small_desc'))
              )
            )
          ) : null,

          // Carroll's Method section
          activeTab === 'method' ? h('section', { key: 'method' },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--lagoon)', paddingBottom: '4px', marginBottom: '24px' } },
              h('span', { style: { width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--foam)', border: '1px solid var(--lagoon)', color: 'var(--lagoon)', borderRadius: '50%', fontSize: '10px', fontWeight: 900, fontFamily: 'var(--font-serif)', fontStyle: 'italic' } }, 'C'),
              h('h3', { style: { fontSize: '10px', fontWeight: 900, color: 'var(--lagoon)', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 } }, t('quiz.help_method_title'))
            ),
            h('p', { style: { fontSize: '13px', color: 'var(--sea-ink-soft)', lineHeight: 1.7, marginBottom: '20px' } }, t('quiz.help_method_intro')),
            [1,2,3,4].map(function(i) {
              return h('div', { key: i, style: { marginBottom: '16px', padding: '12px 16px', background: 'var(--surface-strong)', borderRadius: '8px', border: '1px solid var(--line)' } },
                h('h4', { style: { fontSize: '14px', fontWeight: 800, color: 'var(--sea-ink)', marginBottom: '8px', margin: '0 0 8px 0', fontFamily: 'var(--font-mono)' } }, t('quiz.help_method_rule' + i + '_title')),
                h('div', { style: { fontSize: '13px', color: 'var(--sea-ink-soft)', lineHeight: 1.7 } },
                  t('quiz.help_method_rule' + i + '_desc').split('\n').reduce(function(acc, part, idx, arr) {
                    if (part === '') { acc.push(h('br', { key: 'b' + i + '_' + idx })); return acc; }
                    acc.push(part);
                    if (idx < arr.length - 1 && arr[idx + 1] !== '') acc.push(h('br', { key: 'br' + i + '_' + idx }));
                    return acc;
                  }, [])
                )
              );
            }),
            h('div', { style: { marginTop: '24px', padding: '16px', background: 'var(--sand)', borderRadius: '8px', border: '2px solid var(--lagoon)' } },
              h('h4', { style: { fontSize: '14px', fontWeight: 800, color: 'var(--lagoon)', marginBottom: '8px', margin: '0 0 8px 0', fontFamily: 'var(--font-mono)' } }, t('quiz.help_method_summary_title')),
              h('div', { style: { fontSize: '13px', color: 'var(--sea-ink-soft)', lineHeight: 1.7 } },
                t('quiz.help_method_summary_desc').split('\n').reduce(function(acc, part, idx, arr) {
                  if (part === '') { acc.push(h('br', { key: 's_b_' + idx })); return acc; }
                  acc.push(part);
                  if (idx < arr.length - 1 && arr[idx + 1] !== '') acc.push(h('br', { key: 's_br_' + idx }));
                  return acc;
                }, [])
              )
            )
          ) : null
        ),
        h('div', { style: { padding: '12px 24px', borderTop: '1px solid var(--line)', background: 'var(--sand)', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 } },
          h('button', {
            onClick: onClose,
            style: {
              padding: '8px 24px', background: 'var(--sea-ink)', color: 'white', border: 'none',
              borderRadius: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
              fontSize: '9px', cursor: 'pointer'
            }
          }, t('quiz.help_close'))
        )
      )
    );
  }

  LogicGame.HelpModal = HelpModal;
})();
