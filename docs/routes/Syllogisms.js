window.LogicGame = window.LogicGame || {};

(function() {
  var React = window.React;
  var h = React.createElement;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useContext = React.useContext;

  function SyllogismsPage(props) {
    var I18nContext = LogicGame.I18nContext;
    var i18n = useContext(I18nContext);
    var t = i18n.t;
    var SettingsContext = LogicGame.SettingsContext;
    var settings = useContext(SettingsContext);

    var _search = useState('');
    var search = _search[0];
    var setSearch = _search[1];
    var _answerKey = useState(0);
    var answerKey = _answerKey[0];
    var setAnswerKey = _answerKey[1];

    var STORAGE_KEY = 'logic_game_selected_syllogism';

    function restoreSelection() {
      try {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          var found = LogicGame.SyllogismExamples.find(function(s) { return s.id === saved; });
          if (found) return found;
        }
      } catch(e) {}
      return null;
    }

    var _selectedSyllogism = useState(restoreSelection);
    var selectedSyllogism = _selectedSyllogism[0];
    var setSelectedSyllogism = _selectedSyllogism[1];

    var _showSolver = useState(false);
    var showSolver = _showSolver[0];
    var setShowSolver = _showSolver[1];

    function persistSelection(syl) {
      try {
        if (syl) localStorage.setItem(STORAGE_KEY, syl.id);
        else localStorage.removeItem(STORAGE_KEY);
      } catch(e) {}
    }

    var syllogisms = useMemo(function() {
      return LogicGame.SyllogismExamples || [];
    }, []);

    var groupedSyllogisms = useMemo(function() {
      var res = { 1: [], 2: [], 3: [], 4: [] };
      syllogisms.forEach(function(s) {
        if (!search ||
            s.mood.toLowerCase().indexOf(search) > -1 ||
            (s.mnemonic || '').toLowerCase().indexOf(search) > -1) {
          res[s.figure].push(s);
        }
      });
      return res;
    }, [syllogisms, search]);

    function handleSyllogismClick(syl) {
      setSelectedSyllogism(syl);
      persistSelection(syl);
      setShowSolver(true);
      setAnswerKey(function(k) { return k + 1; });
    }

    function handleBack() {
      setShowSolver(false);
    }

    var FIGURE_LABELS = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };

    if (showSolver && selectedSyllogism) {
      return h('div', { style: { maxWidth: '1600px', margin: '0 auto', padding: '16px' } },
        h('button', {
          onClick: handleBack,
          style: { background: 'none', border: 'none', color: 'var(--lagoon)', cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '16px', padding: 0 }
        }, '\u2190 ' + t('atlas.title')),
        h(LogicGame.SyllogismSolver, {
          syllogism: selectedSyllogism,
          t: t,
          premiseOrder: settings.premiseOrder,
          key: 'solver-' + answerKey
        })
      );
    }

    return h('div', { style: { maxWidth: '1600px', margin: '0 auto', padding: '16px' } },
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '2px solid var(--line)', paddingBottom: '32px', marginBottom: '48px' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--lagoon)' } },
          h('span', { style: { fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' } }, t('atlas.footer.label')),
        ),
        h('h1', { style: { fontSize: '32px', fontWeight: 900, color: 'var(--sea-ink)', margin: 0, fontStyle: 'italic', fontFamily: 'var(--font-serif)' } }, t('atlas.title')),
        h('p', { style: { fontSize: '13px', color: 'var(--sea-ink-soft)', margin: 0, maxWidth: '500px', lineHeight: 1.6 } }, t('atlas.subtitle')),
        h('input', {
          type: 'text',
          placeholder: t('atlas.search_placeholder'),
          value: search,
          onChange: function(e) { setSearch(e.target.value.toLowerCase()); },
          style: {
            padding: '8px 12px 8px 36px', borderRadius: '8px', border: '2px solid var(--line)',
            width: '100%', maxWidth: '320px', fontSize: '13px',
            background: 'var(--foam)', color: 'var(--sea-ink)',
            fontFamily: 'var(--font-mono)', outline: 'none'
          }
        })
      ),

      h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px 48px' } },
        [1, 2, 3, 4].map(function(fig) {
          var items = groupedSyllogisms[fig];
          return h('section', { key: fig, style: { width: '100%' } },
            h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '8px', marginBottom: 0 } },
              h('h2', { style: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', fontWeight: 700, color: 'var(--sea-ink)', margin: 0 } },
                h('span', { style: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--sand)', border: '1px solid var(--line)', borderRadius: '8px', fontSize: '11px', fontWeight: 900, fontFamily: 'var(--font-mono)' } }, FIGURE_LABELS[fig]),
                t('atlas.figure') + ' ' + FIGURE_LABELS[fig]
              ),
              h('span', { style: { fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' } }, items.length + ' ' + t('atlas.syllogisms_count').replace('{count}', ''))
            ),
            h('div', { style: { background: 'var(--surface-strong)', border: '2px solid var(--line)', borderRadius: '8px', overflow: 'hidden' } },
              h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' } },
                h('thead', null,
                  h('tr', { style: { background: 'var(--sand)', borderBottom: '1px solid var(--line)' } },
                    h('th', { style: { padding: '8px 12px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--sea-ink-soft)', textAlign: 'left' } }, t('atlas.table.mood')),
                    h('th', { style: { padding: '8px 12px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--sea-ink-soft)', textAlign: 'left' } }, t('atlas.table.mnemonic')),
                    h('th', { style: { padding: '8px 12px', textAlign: 'right' } })
                  )
                ),
                h('tbody', { style: {} },
                  items.length > 0 ? items.map(function(syl) {
                    var isSelected = selectedSyllogism && selectedSyllogism.id === syl.id;
                    return h('tr', {
                      key: syl.id,
                      onClick: function() { handleSyllogismClick(syl); },
                      style: { cursor: 'pointer', borderBottom: '1px solid var(--line)', transition: 'background 160ms ease', background: isSelected ? 'var(--foam)' : 'transparent' },
                      onMouseEnter: function(e) { if (!isSelected) e.currentTarget.style.background = 'var(--sand)'; },
                      onMouseLeave: function(e) { e.currentTarget.style.background = isSelected ? 'var(--foam)' : 'transparent'; }
                    },
                      h('td', { style: { padding: '10px 12px' } },
                        h('span', { style: { display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, background: isSelected ? 'var(--lagoon)' : 'var(--foam)', border: '1px solid var(--line)', color: isSelected ? 'white' : 'var(--lagoon)' } }, syl.mood)
                      ),
                      h('td', { style: { padding: '10px 12px' } },
                        h('span', { style: { fontSize: '13px', fontStyle: 'italic', fontFamily: 'var(--font-serif)', color: isSelected ? 'var(--lagoon)' : 'var(--sea-ink)', fontWeight: isSelected ? 700 : 400 } }, syl.mnemonic || syl.name)
                      ),
                      h('td', { style: { padding: '10px 12px', textAlign: 'right' } },
                        isSelected
                          ? h('span', { style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '4px', background: 'var(--lagoon)', color: 'white', fontSize: '11px', fontWeight: 700 } }, '\u2713')
                          : h('span', { style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '4px', border: '1px solid transparent', color: 'var(--sea-ink-soft)', fontSize: '13px' } }, '\u2192')
                      )
                    );
                  }) : h('tr', null,
                    h('td', { colSpan: 3, style: { padding: '24px', textAlign: 'center', fontSize: '11px', color: 'var(--sea-ink-soft)', fontStyle: 'italic' } }, t('atlas.no_results'))
                  )
                )
              )
            )
          );
        })
      ),

      h('div', { style: { marginTop: '80px', padding: '32px', border: '2px dashed var(--line)', borderRadius: '12px', background: 'var(--foam)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' } },
        h('div', { style: { fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--sea-ink-soft)', marginBottom: '16px' } }, t('atlas.footer.label')),
        h('blockquote', { style: { fontSize: '13px', color: 'var(--sea-ink)', fontStyle: 'italic', fontFamily: 'var(--font-serif)', maxWidth: '500px', lineHeight: 1.6, margin: '0 0 16px 0' } }, t('atlas.footer.quote')),
        h('div', { style: { display: 'flex', gap: '40px', marginTop: '16px' } },
          h('div', { style: { textAlign: 'center' } },
            h('div', { style: { fontSize: '24px', fontWeight: 700, color: 'var(--lagoon)' } }, '24'),
            h('div', { style: { fontSize: '9px', fontWeight: 700, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' } }, t('atlas.footer.total_valid'))
          ),
          h('div', { style: { textAlign: 'center' } },
            h('div', { style: { fontSize: '24px', fontWeight: 700, color: 'var(--palm)' } }, '4'),
            h('div', { style: { fontSize: '9px', fontWeight: 700, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' } }, t('atlas.footer.logical_figures'))
          ),
          h('div', { style: { textAlign: 'center' } },
            h('div', { style: { fontSize: '24px', fontWeight: 700, color: 'var(--sea-ink)' } }, '6'),
            h('div', { style: { fontSize: '9px', fontWeight: 700, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' } }, t('atlas.footer.moods_per_figure'))
          )
        )
      )
    );
  }

  LogicGame.SyllogismsPage = SyllogismsPage;
})();
