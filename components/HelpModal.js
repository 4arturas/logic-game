var { useState, useEffect, useContext } = React;

var HELP_RULES_DATA = {
  1: [13, 14], 2: [11, 12], 3: [11, 12], 4: [9, 10],
  5: [9, 15], 6: [12, 14], 7: [11, 13],
};

function HelpModal(props) {
  var onClose = props.onClose;
  var onApplyRule = props.onApplyRule;
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

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,25,35,0.55)', backdropFilter: 'blur(4px)', padding: '16px' }}>
      <div onClick={function(e) { e.stopPropagation(); }} style={{ background: 'var(--surface)', borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.3)', border: '1px solid var(--line)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px 16px 28px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 900, color: 'var(--sea-ink)', border: '2px solid var(--line)' }}>?</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--sea-ink)', margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>{t('quiz.help_title')}</h2>
          </div>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--sand)', border: '1px solid var(--line)', color: 'var(--sea-ink-soft)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, lineHeight: 1, transition: 'all 150ms' }}>{'\u2715'}</button>
        </div>
        <div style={{ display: 'flex', gap: '4px', padding: '0 28px', borderBottom: '1px solid var(--line)', background: 'var(--sand)' }}>
          {TABS.map(function(tab) {
            var isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={function() { setActiveTab(tab.id); }}
                style={{
                  padding: '10px 16px', fontSize: '11px', fontWeight: isActive ? 800 : 600,
                  color: isActive ? 'var(--sea-ink)' : 'var(--sea-ink-soft)',
                  background: isActive ? 'var(--surface)' : 'transparent',
                  border: 'none', borderBottom: isActive ? '2px solid var(--lagoon)' : '2px solid transparent',
                  cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.06em',
                  transition: 'all 150ms', whiteSpace: 'nowrap'
                }}>
                {tab.label}
              </button>
            );
          })}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

          {activeTab === 'rules' ? (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderLeft: '3px solid var(--lagoon)', paddingLeft: '12px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--lagoon)', margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>{t('quiz.help_title')}</h3>
                {onApplyRule ? <span style={{ fontSize: '9px', color: 'var(--sea-ink-soft)', fontFamily: 'var(--font-mono)', background: 'var(--sand)', padding: '2px 8px', borderRadius: '4px' }}>Click to apply rule</span> : null}
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: 'var(--sand)', borderBottom: '1px solid var(--line)' }}>
                      <th style={{ padding: '10px 12px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--sea-ink-soft)', textAlign: 'left' }}>{t('quiz.help_col1')}</th>
                      <th style={{ padding: '10px 12px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--sea-ink-soft)', textAlign: 'left' }}>{t('quiz.help_col2')}</th>
                      <th style={{ padding: '10px 12px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--sea-ink-soft)', textAlign: 'left' }}>{t('quiz.help_col3')}</th>
                      <th style={{ padding: '10px 12px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--sea-ink-soft)', textAlign: 'right' }}>{t('quiz.help_col4')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1,2,3,4,5,6,7].map(function(row) {
                      return (
                        <tr key={row} onClick={function() { if (onApplyRule) onApplyRule(HELP_RULES_DATA[row]); }}
                          style={{ cursor: onApplyRule ? 'pointer' : 'default', borderBottom: '1px solid var(--line)', transition: 'background 120ms' }}
                          onMouseEnter={function(e) { e.currentTarget.style.background = 'var(--foam)'; }}
                          onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>
                          <td style={{ padding: '10px 12px', fontSize: '15px', fontWeight: 700, color: 'var(--sea-ink)' }}>{t('quiz.help_row' + row + '_1')}</td>
                          <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: 400, color: 'var(--sea-ink-soft)' }}>{t('quiz.help_row' + row + '_2')}</td>
                          <td style={{ padding: '10px 12px', fontSize: '11px', fontWeight: 400, color: 'var(--sea-ink-soft)' }}>{t('quiz.help_row' + row + '_3')}</td>
                          <td style={{ padding: '10px 12px', fontSize: '14px', fontWeight: 700, color: 'var(--palm)', textAlign: 'right', fontFamily: 'monospace' }}>{t('quiz.help_row' + row + '_4')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {activeTab === 'symbols' ? (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderLeft: '3px solid var(--palm)', paddingLeft: '12px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--hero-a)', color: 'var(--palm)', fontSize: '16px', fontWeight: 900, fontFamily: 'monospace' }}>{'\u2229'}</span>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--palm)', margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>{t('quiz.help_symbols_title')}</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {[
                  { symbol: '\u2286', desc: t('quiz.help_symbol_subset'), color: 'var(--palm)' },
                  { symbol: '\u2229', desc: t('quiz.help_symbol_intersection'), color: 'var(--palm)' },
                  { symbol: '\u2260 \u2205', desc: t('quiz.help_symbol_not_empty'), color: 'var(--sea-ink)' },
                  { symbol: "'", desc: t('quiz.help_symbol_complement'), color: 'var(--term-x)' },
                ].map(function(item, idx) {
                  return (
                    <div key={idx} style={{ background: 'var(--foam)', borderRadius: '10px', padding: '16px', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '28px', fontWeight: 900, color: item.color, fontFamily: 'monospace', lineHeight: 1 }}>{item.symbol}</div>
                      <div style={{ fontSize: '11px', color: 'var(--sea-ink-soft)', lineHeight: 1.4 }}>{item.desc}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}

          {activeTab === 'guide' ? (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderLeft: '3px solid var(--sea-ink)', paddingLeft: '12px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--sand)', color: 'var(--line)', fontSize: '16px', fontWeight: 900 }}>!</span>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--sea-ink)', margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>{t('quiz.help_visual_guide')}</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <div style={{ background: 'var(--sand)', borderRadius: '8px', padding: '8px', border: '1px solid var(--line)' }}>
                    <h4 style={{ textAlign: 'center', fontSize: '9px', fontWeight: 700, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px 0' }}>{t('home.large_diagram') + ' SCHEMATICS'}</h4>
                    <svg viewBox="0 0 400 400" style={{ width: '100%', height: 'auto' }}>
                      <rect x="10" y="10" width="380" height="380" fill="none" stroke="var(--line)" strokeWidth="2" />
                      <rect x="105" y="105" width="190" height="190" fill="none" stroke="var(--line)" strokeWidth="1.5" />
                      <line x1="10" y1="200" x2="390" y2="200" stroke="var(--line)" strokeWidth="1.5" />
                      <line x1="200" y1="10" x2="200" y2="390" stroke="var(--line)" strokeWidth="1.5" />
                      <text x="200" y="70" textAnchor="middle" fill="var(--term-x)" fontSize="28" fontStyle="italic" fontWeight="700" fontFamily="var(--font-serif)">x</text>
                      <text x="200" y="345" textAnchor="middle" fill="var(--term-x)" fontSize="28" fontStyle="italic" fontWeight="700" fontFamily="var(--font-serif)">x'</text>
                      <text x="55" y="210" textAnchor="middle" fill="var(--term-y)" fontSize="28" fontStyle="italic" fontWeight="700" fontFamily="var(--font-serif)" transform="rotate(-90 55 210)">y</text>
                      <text x="345" y="210" textAnchor="middle" fill="var(--term-y)" fontSize="28" fontStyle="italic" fontWeight="700" fontFamily="var(--font-serif)" transform="rotate(-90 345 210)">y'</text>
                      <text x="200" y="215" textAnchor="middle" fill="var(--term-m)" fontSize="28" fontStyle="italic" fontWeight="700" fontFamily="var(--font-serif)">m</text>
                      {[9,10,11,12,13,14,15,16].map(function(n) {
                        var positions = {
                          9: { x: 25, y: 35, a: 'start' }, 10: { x: 375, y: 35, a: 'end' },
                          11: { x: 120, y: 130, a: 'start' }, 12: { x: 280, y: 130, a: 'end' },
                          13: { x: 120, y: 285, a: 'start' }, 14: { x: 280, y: 285, a: 'end' },
                          15: { x: 25, y: 380, a: 'start' }, 16: { x: 375, y: 380, a: 'end' },
                        };
                        var p = positions[n];
                        return <text key={n} x={p.x} y={p.y} textAnchor={p.a} fill="var(--sea-ink-soft)" fontSize="14" fontWeight="900" fontFamily="var(--font-mono)">{n.toString()}</text>;
                      })}
                    </svg>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--lagoon)', lineHeight: 1.5, margin: '8px 0 0 0', textAlign: 'center' }}>{t('quiz.help_large_desc')}</p>
                </div>
                <div>
                  <div style={{ background: 'var(--sand)', borderRadius: '8px', padding: '8px', border: '1px solid var(--line)' }}>
                    <h4 style={{ textAlign: 'center', fontSize: '9px', fontWeight: 700, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px 0' }}>{t('home.small_diagram') + ' SCHEMATICS'}</h4>
                    <svg viewBox="0 0 250 250" style={{ width: '100%', height: 'auto' }}>
                      <rect x="5" y="5" width="240" height="240" fill="none" stroke="var(--line)" strokeWidth="2" />
                      <line x1="125" y1="5" x2="125" y2="245" stroke="var(--line)" strokeWidth="1.5" />
                      <line x1="5" y1="125" x2="245" y2="125" stroke="var(--line)" strokeWidth="1.5" />
                      <text x="125" y="65" textAnchor="middle" fill="var(--term-x)" fontSize="28" fontStyle="italic" fontWeight="700" fontFamily="var(--font-serif)">x</text>
                      <text x="125" y="200" textAnchor="middle" fill="var(--term-x)" fontSize="28" fontStyle="italic" fontWeight="700" fontFamily="var(--font-serif)">x'</text>
                      <text x="45" y="135" textAnchor="middle" fill="var(--term-y)" fontSize="28" fontStyle="italic" fontWeight="700" fontFamily="var(--font-serif)" transform="rotate(-90 45 135)">y</text>
                      <text x="205" y="135" textAnchor="middle" fill="var(--term-y)" fontSize="28" fontStyle="italic" fontWeight="700" fontFamily="var(--font-serif)" transform="rotate(-90 205 135)">y'</text>
                      {[5,6,7,8].map(function(n) {
                        var positions = {
                          5: { x: 20, y: 30, a: 'start' }, 6: { x: 230, y: 30, a: 'end' },
                          7: { x: 20, y: 235, a: 'start' }, 8: { x: 230, y: 235, a: 'end' },
                        };
                        var p = positions[n];
                        return <text key={n} x={p.x} y={p.y} textAnchor={p.a} fill="var(--sea-ink-soft)" fontSize="16" fontWeight="900" fontFamily="var(--font-mono)">{n.toString()}</text>;
                      })}
                    </svg>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--palm)', lineHeight: 1.5, margin: '8px 0 0 0', textAlign: 'center' }}>{t('quiz.help_small_desc')}</p>
                </div>
              </div>
            </section>
          ) : null}

          {activeTab === 'method' ? (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderLeft: '3px solid var(--lagoon)', paddingLeft: '12px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--foam)', color: 'var(--lagoon)', fontSize: '16px', fontWeight: 900, fontFamily: 'serif' }}>C</span>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--lagoon)', margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>{t('quiz.help_method_title')}</h3>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--sea-ink)', lineHeight: 1.7, margin: '0 0 20px 0' }}>{t('quiz.help_method_intro')}</p>
              {[1,2,3,4].map(function(i) {
                return (
                  <div key={i} style={{ marginBottom: '16px', padding: '12px 16px', background: 'var(--foam)', borderRadius: '8px', borderLeft: '3px solid var(--lagoon)' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--sea-ink)', margin: '0 0 6px 0' }}>{t('quiz.help_method_rule' + i + '_title')}</h4>
                    <div style={{ fontSize: '11px', color: 'var(--sea-ink-soft)', lineHeight: 1.7 }}>
                      {t('quiz.help_method_rule' + i + '_desc').split('\n').reduce(function(acc, part, idx, arr) {
                        if (part === '') { acc.push(<br key={'b' + i + '_' + idx} />); return acc; }
                        acc.push(part);
                        if (idx < arr.length - 1 && arr[idx + 1] !== '') acc.push(<br key={'br' + i + '_' + idx} />);
                        return acc;
                      }, [])}
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: '24px', padding: '16px 20px', background: 'var(--surface-strong)', borderRadius: '8px', border: '2px solid var(--lagoon)' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--lagoon)', margin: '0 0 6px 0' }}>{t('quiz.help_method_summary_title')}</h4>
                <div style={{ fontSize: '11px', color: 'var(--sea-ink-soft)', lineHeight: 1.7 }}>
                  {t('quiz.help_method_summary_desc').split('\n').reduce(function(acc, part, idx, arr) {
                    if (part === '') { acc.push(<br key={'s_b_' + idx} />); return acc; }
                    acc.push(part);
                    if (idx < arr.length - 1 && arr[idx + 1] !== '') acc.push(<br key={'s_br_' + idx} />);
                    return acc;
                  }, [])}
                </div>
              </div>
            </section>
          ) : null}

        </div>
        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 24px', borderRadius: '8px', border: 'none', background: 'var(--lagoon)', color: 'white', cursor: 'pointer', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', transition: 'background 150ms' }}>{t('quiz.help_close')}</button>
        </div>
      </div>
    </div>
  );
}
