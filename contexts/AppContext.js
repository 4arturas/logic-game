var { createContext, useContext, useState, useEffect } = React;

var I18nContext = createContext({ lang: 'en', t: function(k) { return k; } });
var SettingsContext = createContext({
  premiseOrder: 'standard',
  theme: 'default',
  togglePremiseOrder: function() {},
  setTheme: function() {},
});

function I18nProvider(props) {
  var _lang = useState(function() {
    try {
      var saved = localStorage.getItem('logic_game_lang');
      return saved === 'lt' ? 'lt' : 'en';
    } catch(e) { return 'en'; }
  });
  var lang = _lang[0];
  var setLang = _lang[1];

  useEffect(function() {
    localStorage.setItem('logic_game_lang', lang);
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  function t(key, params) {
    var trans = Translations[lang] || Translations.en;
    var val = trans[key];
    if (val === undefined) val = Translations.en[key] || key;
    if (params) {
      Object.keys(params).forEach(function(k) {
        val = val.replace('{' + k + '}', params[k]);
      });
    }
    return val;
  }

  function toggleLang() {
    setLang(function(prev) { return prev === 'en' ? 'lt' : 'en'; });
  }

  var value = { lang: lang, t: t, toggleLang: toggleLang };
  return <I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>;
}

function SettingsProvider(props) {
  var _settings = useState(function() {
    try {
      var s = localStorage.getItem('logic_game_settings');
      if (s) return JSON.parse(s);
    } catch(e) {}
    return { premiseOrder: 'standard', theme: 'default' };
  });
  var settings = _settings[0];
  var setSettings = _settings[1];

  useEffect(function() {
    localStorage.setItem('logic_game_settings', JSON.stringify(settings));
  }, [settings]);

  function togglePremiseOrder() {
    setSettings(function(prev) {
      return Object.assign({}, prev, { premiseOrder: prev.premiseOrder === 'standard' ? 'reversed' : 'standard' });
    });
  }

  function setTheme(theme) {
    setSettings(function(prev) {
      document.documentElement.setAttribute('data-theme', theme);
      return Object.assign({}, prev, { theme: theme });
    });
  }

  var value = {
    premiseOrder: settings.premiseOrder,
    theme: settings.theme,
    togglePremiseOrder: togglePremiseOrder,
    setTheme: setTheme,
  };

  return <SettingsContext.Provider value={value}>{props.children}</SettingsContext.Provider>;
}

function AppProviders(props) {
  return <I18nProvider><SettingsProvider>{props.children}</SettingsProvider></I18nProvider>;
}
