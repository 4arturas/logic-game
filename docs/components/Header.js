window.LogicGame = window.LogicGame || {};

(function() {
  var React = window.React;
  var h = React.createElement;
  var useState = React.useState;
  var useContext = React.useContext;
  var useEffect = React.useEffect;
  var SettingsContext = LogicGame.SettingsContext;
  var I18nContext = LogicGame.I18nContext;

  var THEMES = [
    { value: 'ocean', label: 'Ocean', icon: '\u{1F30A}' },
    { value: 'forest', label: 'Forest', icon: '\u{1F333}' },
    { value: 'sunset', label: 'Sunset', icon: '\u{1F307}' },
    { value: 'midnight', label: 'Midnight', icon: '\u{1F319}' },
    { value: 'cream', label: 'Cream', icon: '\u{1F370}' },
    { value: 'clean', label: 'Clean', icon: '\u{2728}' },
    { value: 'focus', label: 'Focus', icon: '\u{1F3AF}' },
    { value: 'dark', label: 'Dark', icon: '\u{1F31F}' },
  ];

  function ThemeToggle() {
    var settings = useContext(SettingsContext);
    var currentTheme = settings.theme;
    var setTheme = settings.setTheme;
    var _open = useState(false);
    var isOpen = _open[0];
    var setIsOpen = _open[1];
    var themeObj = THEMES.find(function(t) { return t.value === currentTheme; }) || THEMES[0];

    return h('div', { style: { position: 'relative' } },
      h('button', {
        onClick: function() { setIsOpen(!isOpen); },
        style: {
          cursor: 'pointer', borderRadius: '20px', border: '1px solid var(--chip-line)',
          background: 'var(--chip-bg)', padding: '6px 12px', fontSize: '12px', fontWeight: 600,
          color: 'var(--sea-ink)', display: 'flex', alignItems: 'center', gap: '6px',
          transition: 'all 150ms', boxShadow: '0 4px 12px rgba(30,90,72,0.08)'
        }
      },
        h('span', null, themeObj.icon),
        h('span', { style: { fontSize: '12px' } }, themeObj.label)
      ),
      isOpen ? h(React.Fragment, null,
        h('div', { onClick: function() { setIsOpen(false); }, style: { position: 'fixed', inset: 0, zIndex: 40 } }),
        h('div', { style: { position: 'absolute', right: 0, top: '100%', marginTop: '8px', zIndex: 50, width: '180px', borderRadius: '12px', border: '1px solid var(--chip-line)', background: 'var(--chip-bg)', padding: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } },
          h('div', { style: { padding: '4px 8px 8px 8px', fontSize: '11px', fontWeight: 600, color: 'var(--sea-ink-soft)' } }, 'Select Theme'),
          THEMES.map(function(t) {
            var isActive = currentTheme === t.value;
            return h('button', {
              key: t.value,
              onClick: function() { setTheme(t.value); setIsOpen(false); },
              style: {
                display: 'flex', width: '100%', alignItems: 'center', gap: '8px', padding: '8px 12px',
                borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px',
                background: isActive ? 'rgba(0,0,0,0.06)' : 'transparent',
                color: isActive ? 'var(--lagoon)' : 'var(--sea-ink)',
                fontWeight: isActive ? 600 : 400,
                transition: 'background 120ms'
              }
            },
              h('span', null, t.icon),
              h('span', null, t.label),
              isActive ? h('span', { style: { marginLeft: 'auto', color: 'var(--lagoon)', fontSize: '14px' } }, '\u2713') : null
            );
          })
        )
      ) : null
    );
  }

  function LTIcon() {
    return h('svg', { width: '24', height: '18', viewBox: '0 0 24 18' },
      h('rect', { width: '100%', height: '100%', fill: '#C60C30' }),
      h('rect', { x: '0', y: '6', width: '24', height: '6', fill: '#FFB915' }),
      h('rect', { x: '0', y: '0', width: '24', height: '6', fill: '#FFB915' })
    );
  }

  function GBIcon() {
    return h('svg', { width: '24', height: '18', viewBox: '0 0 24 18' },
      h('rect', { width: '100%', height: '100%', fill: '#012169' }),
      h('path', {
        d: 'M0 0 L24 18 M24 0 L0 18',
        stroke: '#FFFFFF', strokeWidth: '3'
      }),
      h('path', {
        d: 'M0 0 L24 18 M24 0 L0 18',
        stroke: '#C60C30', strokeWidth: '1.5'
      }),
      h('path', {
        d: 'M12 0 L12 18 M0 9 L24 9',
        stroke: '#FFFFFF', strokeWidth: '4'
      }),
      h('path', {
        d: 'M12 0 L12 18 M0 9 L24 9',
        stroke: '#C60C30', strokeWidth: '2'
      })
    );
  }

  function LanguageToggle() {
    var i18n = useContext(I18nContext);
    var isLT = i18n.lang === 'lt';
    return h('button', {
      onClick: i18n.toggleLang,
      title: 'Switch to ' + (isLT ? 'English' : 'Lithuanian'),
      style: {
        cursor: 'pointer', borderRadius: '8px', padding: '4px', border: '1px solid var(--chip-line)',
        background: 'var(--chip-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        lineHeight: 1, transition: 'background 120ms',
        overflow: 'hidden'
      }
    }, isLT ? h(LTIcon, null) : h(GBIcon, null));
  }

  function PremiseOrderToggle() {
    var settings = useContext(SettingsContext);
    return h('button', {
      onClick: settings.togglePremiseOrder,
      title: 'Premise order: ' + settings.premiseOrder,
      style: {
        background: 'var(--chip-bg)', border: '1px solid var(--chip-line)', borderRadius: '6px',
        padding: '4px 6px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '11px',
        fontWeight: 500, color: 'var(--sea-ink-soft)'
      }
    }, settings.premiseOrder === 'standard' ? 'M\u00B7m' : 'm\u00B7M');
  }

  function VennLogo() {
    return h('svg', { width: 34, height: 24, viewBox: '0 0 34 24', fill: 'none' },
      h('circle', { cx: 12, cy: 12, r: 10, fill: 'var(--lagoon)', fillOpacity: 0.18, stroke: 'var(--lagoon)', strokeWidth: 1.6 }),
      h('circle', { cx: 22, cy: 12, r: 10, fill: 'var(--lagoon)', fillOpacity: 0.10, stroke: 'var(--lagoon)', strokeWidth: 1.6 }),
      h('path', { d: 'M17 3.8 A10 10 0 0 1 17 20.2 A10 10 0 0 1 17 3.8 Z', fill: 'var(--lagoon)', fillOpacity: 0.26 })
    );
  }

  function Header(props) {
    var i18n = useContext(I18nContext);
    var t = i18n.t;

    return h('header', {
      style: {
        position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--line)',
        background: 'var(--header-bg)', padding: '0 16px', backdropFilter: 'blur(8px)',
        boxShadow: '0 1px 0 rgba(15,25,35,0.06)'
      }
    },
      h('nav', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '12px 0', maxWidth: '1400px', margin: '0 auto' } },
        h('a', { href: '#', onClick: function(e) { e.preventDefault(); }, style: { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', cursor: 'pointer' } },
          h(VennLogo, null),
          h('span', { className: 'logo-text', style: { fontFamily: '"Fraunces", Georgia, serif', fontSize: '16px', fontWeight: 600, color: 'var(--sea-ink)', letterSpacing: '-0.01em' } },
            'Carroll ',
            h('span', { style: { color: 'var(--lagoon)' } }, 'Logic')
          )
        ),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 } },
          h('span', {
            style: {
              fontFamily: 'var(--font-mono)', fontSize: '12px', padding: '6px 8px',
              fontWeight: 700, color: 'var(--sea-ink)'
            }
          }, 'Atlas')
        ),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 } },
          h(ThemeToggle, null),
          h(PremiseOrderToggle, null),
          h(LanguageToggle, null)
        )
      )
    );
  }

  LogicGame.Header = Header;
})();
