var { useState, useEffect, useMemo, useContext } = React;

function SyllogismsPage(props) {
  var i18n = useContext(I18nContext);
  var t = i18n.t;
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
        var found = SyllogismExamples.find(function(s) { return s.id === saved; });
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
    return SyllogismExamples || [];
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
    return (
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '16px' }}>
        <button onClick={handleBack}
          style={{ background: 'none', border: 'none', color: 'var(--lagoon)', cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '16px', padding: 0 }}>
          {'\u2190 ' + t('atlas.title')}
        </button>
        <SyllogismSolver syllogism={selectedSyllogism} t={t}
          premiseOrder={settings.premiseOrder}
          key={'solver-' + answerKey} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '2px solid var(--line)', paddingBottom: '32px', marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--lagoon)' }}>
          <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>{t('atlas.footer.label')}</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--sea-ink)', margin: 0, fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>{t('atlas.title')}</h1>
        <p style={{ fontSize: '13px', color: 'var(--sea-ink-soft)', margin: 0, maxWidth: '500px', lineHeight: 1.6 }}>{t('atlas.subtitle')}</p>
        <input type="text" placeholder={t('atlas.search_placeholder')} value={search}
          onChange={function(e) { setSearch(e.target.value.toLowerCase()); }}
          style={{
            padding: '8px 12px 8px 36px', borderRadius: '8px', border: '2px solid var(--line)',
            width: '100%', maxWidth: '320px', fontSize: '13px',
            background: 'var(--foam)', color: 'var(--sea-ink)',
            fontFamily: 'var(--font-mono)', outline: 'none'
          }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px 48px' }}>
        {[1, 2, 3, 4].map(function(fig) {
          var items = groupedSyllogisms[fig];
          return (
            <section key={fig} style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '8px', marginBottom: 0 }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', fontWeight: 700, color: 'var(--sea-ink)', margin: 0 }}>
                  <span style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--sand)', border: '1px solid var(--line)', borderRadius: '8px', fontSize: '11px', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>{FIGURE_LABELS[fig]}</span>
                  {t('atlas.figure') + ' ' + FIGURE_LABELS[fig]}
                </h2>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{items.length + ' ' + t('atlas.syllogisms_count').replace('{count}', '')}</span>
              </div>
              <div style={{ background: 'var(--surface-strong)', border: '2px solid var(--line)', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: 'var(--sand)', borderBottom: '1px solid var(--line)' }}>
                      <th style={{ padding: '8px 12px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--sea-ink-soft)', textAlign: 'left' }}>{t('atlas.table.mood')}</th>
                      <th style={{ padding: '8px 12px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--sea-ink-soft)', textAlign: 'left' }}>{t('atlas.table.mnemonic')}</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length > 0 ? items.map(function(syl) {
                      var isSelected = selectedSyllogism && selectedSyllogism.id === syl.id;
                      return (
                        <tr key={syl.id} onClick={function() { handleSyllogismClick(syl); }}
                          style={{ cursor: 'pointer', borderBottom: '1px solid var(--line)', transition: 'background 160ms ease', background: isSelected ? 'var(--foam)' : 'transparent' }}
                          onMouseEnter={function(e) { if (!isSelected) e.currentTarget.style.background = 'var(--sand)'; }}
                          onMouseLeave={function(e) { e.currentTarget.style.background = isSelected ? 'var(--foam)' : 'transparent'; }}>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, background: isSelected ? 'var(--lagoon)' : 'var(--foam)', border: '1px solid var(--line)', color: isSelected ? 'white' : 'var(--lagoon)' }}>{syl.mood}</span>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ fontSize: '13px', fontStyle: 'italic', fontFamily: 'var(--font-serif)', color: isSelected ? 'var(--lagoon)' : 'var(--sea-ink)', fontWeight: isSelected ? 700 : 400 }}>{syl.mnemonic || syl.name}</span>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            {isSelected
                              ? <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '4px', background: 'var(--lagoon)', color: 'white', fontSize: '11px', fontWeight: 700 }}>{'\u2713'}</span>
                              : <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '4px', border: '1px solid transparent', color: 'var(--sea-ink-soft)', fontSize: '13px' }}>{'\u2192'}</span>
                            }
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={3} style={{ padding: '24px', textAlign: 'center', fontSize: '11px', color: 'var(--sea-ink-soft)', fontStyle: 'italic' }}>{t('atlas.no_results')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>

      <div style={{ marginTop: '80px', padding: '32px', border: '2px dashed var(--line)', borderRadius: '12px', background: 'var(--foam)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--sea-ink-soft)', marginBottom: '16px' }}>{t('atlas.footer.label')}</div>
        <blockquote style={{ fontSize: '13px', color: 'var(--sea-ink)', fontStyle: 'italic', fontFamily: 'var(--font-serif)', maxWidth: '500px', lineHeight: 1.6, margin: '0 0 16px 0' }}>{t('atlas.footer.quote')}</blockquote>
        <div style={{ display: 'flex', gap: '40px', marginTop: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--lagoon)' }}>24</div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('atlas.footer.total_valid')}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--palm)' }}>4</div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('atlas.footer.logical_figures')}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--sea-ink)' }}>6</div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--sea-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('atlas.footer.moods_per_figure')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
