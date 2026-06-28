var { useState } = React;
var { createRoot } = ReactDOM;

injectStyles();
initExamples(SyllogismsStandard);

try {
  var s = localStorage.getItem('logic_game_settings');
  if (s) {
    var settings = JSON.parse(s);
    if (settings.theme && settings.theme !== 'default') {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
  }
} catch(e) {}

function AppWithHelp() {
  var _help = useState(false);
  var showHelp = _help[0];
  var setShowHelp = _help[1];
  var _page = useState('atlas');
  var currentPage = _page[0];
  var setPage = _page[1];

  function onNavigate(page) { setPage(page); }

  return (
    <I18nProvider>
      <SettingsProvider>
        <>
          <Header onShowHelp={function() { setShowHelp(true); }} onNavigate={onNavigate} currentPage={currentPage} />
          <main style={{ minHeight: 'calc(100vh - 200px)', paddingTop: '24px', paddingBottom: '48px' }}>
            {currentPage === 'atlas' ? <SyllogismsPage key="atlas" /> : <LearnPage key="learn" />}
          </main>
          <Footer />
          {showHelp ? <HelpModal key="help-modal" onClose={function() { setShowHelp(false); }} /> : null}
        </>
      </SettingsProvider>
    </I18nProvider>
  );
}

var root = createRoot(document.getElementById('app'));
root.render(<AppWithHelp />);
