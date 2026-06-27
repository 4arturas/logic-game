window.LogicGame = window.LogicGame || {};

(function() {
  var React = window.React;
  var h = React.createElement;

  var SettingsContext = React.createContext({
    premiseOrder: 'standard',
    theme: 'default',
    togglePremiseOrder: function() {},
    setTheme: function() {},
  });

  function SettingsProvider(props) {
    var _useState = React.useState(function() {
      try {
        var s = localStorage.getItem('logic_game_settings');
        if (s) return JSON.parse(s);
      } catch(e) {}
      return { premiseOrder: 'standard', theme: 'default' };
    });
    var settings = _useState[0];
    var setSettings = _useState[1];

    React.useEffect(function() {
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

    return h(SettingsContext.Provider, { value: value }, props.children);
  }

  LogicGame.SettingsContext = SettingsContext;
  LogicGame.SettingsProvider = SettingsProvider;
})();
