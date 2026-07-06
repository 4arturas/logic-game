window.LogicGame = window.LogicGame || {};

(function() {
  var React = window.React;
  var h = React.createElement;

  var I18nContext = React.createContext({ lang: 'en', t: function(k) { return k; } });

  function I18nProvider(props) {
    var _this = this;
    var translations = LogicGame.Translations;
    var _useState = React.useState(function() {
      try {
        var saved = localStorage.getItem('logic_game_lang');
        return saved === 'lt' ? 'lt' : 'en';
      } catch(e) { return 'en'; }
    });
    var lang = _useState[0];
    var setLang = _useState[1];

    React.useEffect(function() {
      localStorage.setItem('logic_game_lang', lang);
      document.documentElement.setAttribute('lang', lang);
    }, [lang]);

    function t(key, params) {
      var trans = translations[lang] || translations.en;
      var val = trans[key];
      if (val === undefined) val = translations.en[key] || key;
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
    return h(I18nContext.Provider, { value: value }, props.children);
  }

  LogicGame.I18nContext = I18nContext;
  LogicGame.I18nProvider = I18nProvider;
})();
