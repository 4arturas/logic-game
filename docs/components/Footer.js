window.LogicGame = window.LogicGame || {};

(function() {
  var React = window.React;
  var h = React.createElement;
  var useContext = React.useContext;

  function Footer(props) {
    var I18nContext = LogicGame.I18nContext;
    var i18n = useContext(I18nContext);
    var t = i18n.t;
    return h('footer', { className: 'site-footer', style: { padding: '32px 16px', marginTop: '48px' } },
      h('div', { style: { maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' } },
        h('p', { style: { color: 'var(--sea-ink-soft)', fontSize: '11px', margin: 0, opacity: 0.7 } },
          t('footer.copyright').replace('{year}', new Date().getFullYear())
        )
      )
    );
  }

  LogicGame.Footer = Footer;
})();
