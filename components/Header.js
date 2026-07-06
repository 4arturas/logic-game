var { useState, useContext } = React;

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

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={function() { setIsOpen(!isOpen); }}
        style={{
          cursor: 'pointer', borderRadius: '20px', border: '1px solid var(--chip-line)',
          background: 'var(--chip-bg)', padding: '6px 12px', fontSize: '12px', fontWeight: 600,
          color: 'var(--sea-ink)', display: 'flex', alignItems: 'center', gap: '6px',
          transition: 'all 150ms', boxShadow: '0 4px 12px rgba(30,90,72,0.08)'
        }}>
        <span>{themeObj.icon}</span>
        <span style={{ fontSize: '12px' }}>{themeObj.label}</span>
      </button>
      {isOpen ? (
        <>
          <div onClick={function() { setIsOpen(false); }} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '8px', zIndex: 50, width: '180px', borderRadius: '12px', border: '1px solid var(--chip-line)', background: 'var(--chip-bg)', padding: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
            <div style={{ padding: '4px 8px 8px 8px', fontSize: '11px', fontWeight: 600, color: 'var(--sea-ink-soft)' }}>Select Theme</div>
            {THEMES.map(function(t) {
              var isActive = currentTheme === t.value;
              return (
                <button key={t.value}
                  onClick={function() { setTheme(t.value); setIsOpen(false); }}
                  style={{
                    display: 'flex', width: '100%', alignItems: 'center', gap: '8px', padding: '8px 12px',
                    borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px',
                    background: isActive ? 'rgba(0,0,0,0.06)' : 'transparent',
                    color: isActive ? 'var(--lagoon)' : 'var(--sea-ink)',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'background 120ms'
                  }}>
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                  {isActive ? <span style={{ marginLeft: 'auto', color: 'var(--lagoon)', fontSize: '14px' }}>{'\u2713'}</span> : null}
                </button>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}

function LanguageToggle() {
  var i18n = useContext(I18nContext);
  var isLT = i18n.lang === 'lt';
  return (
    <button onClick={i18n.toggleLang}
      title={'Switch to ' + (isLT ? 'English' : 'Lithuanian')}
      style={{
        cursor: 'pointer', borderRadius: '8px', padding: '4px', border: '1px solid var(--chip-line)',
        background: 'var(--chip-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        lineHeight: 1, transition: 'background 120ms', overflow: 'hidden'
      }}>
      <img alt={isLT ? 'Lithuania' : 'United States'}
        src={isLT
          ? 'https://purecatamphetamine.github.io/country-flag-icons/3x2/LT.svg'
          : 'https://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg'}
        style={{ width: '24px', height: '18px', display: 'block' }} />
    </button>
  );
}

function PremiseOrderToggle() {
  var settings = useContext(SettingsContext);
  return (
    <button onClick={settings.togglePremiseOrder}
      title={'Premise order: ' + settings.premiseOrder}
      style={{
        background: 'var(--chip-bg)', border: '1px solid var(--chip-line)', borderRadius: '6px',
        padding: '4px 6px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '11px',
        fontWeight: 500, color: 'var(--sea-ink-soft)'
      }}>{settings.premiseOrder === 'standard' ? 'M\u00B7m' : 'm\u00B7M'}</button>
  );
}

function VennLogo() {
  return (
    <svg width={34} height={24} viewBox="0 0 34 24" fill="none">
      <circle cx={12} cy={12} r={10} fill="var(--lagoon)" fillOpacity={0.18} stroke="var(--lagoon)" strokeWidth={1.6} />
      <circle cx={22} cy={12} r={10} fill="var(--lagoon)" fillOpacity={0.10} stroke="var(--lagoon)" strokeWidth={1.6} />
      <path d="M17 3.8 A10 10 0 0 1 17 20.2 A10 10 0 0 1 17 3.8 Z" fill="var(--lagoon)" fillOpacity={0.26} />
    </svg>
  );
}

function Header(props) {
  var onShowHelp = props.onShowHelp;
  var onNavigate = props.onNavigate;
  var currentPage = props.currentPage || 'atlas';
  var i18n = useContext(I18nContext);
  var t = i18n.t;

  var navItems = [
    { id: 'atlas', label: 'Atlas' },
    { id: 'learn', label: 'Learn' },
  ];

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--line)',
      background: 'var(--header-bg)', padding: '0 16px', backdropFilter: 'blur(8px)',
      boxShadow: '0 1px 0 rgba(15,25,35,0.06)'
    }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '12px 0', maxWidth: '1400px', margin: '0 auto' }}>
        <a href="#" onClick={function(e) { e.preventDefault(); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', cursor: 'pointer' }}>
          <VennLogo />
          <span className="logo-text" style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: '16px', fontWeight: 600, color: 'var(--sea-ink)', letterSpacing: '-0.01em' }}>
            Carroll <span style={{ color: 'var(--lagoon)' }}>Logic</span>
          </span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
          {navItems.map(function(item) {
            var isActive = currentPage === item.id;
            return (
              <button key={item.id}
                onClick={function() { if (onNavigate) onNavigate(item.id); }}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '12px', padding: '6px 12px',
                  fontWeight: isActive ? 800 : 600, color: isActive ? 'var(--lagoon)' : 'var(--sea-ink)',
                  background: isActive ? 'rgba(0,0,0,0.04)' : 'transparent',
                  border: 'none', borderRadius: '6px', cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.08em', transition: 'all 120ms'
                }}>{item.label}</button>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {onShowHelp ? (
            <button onClick={onShowHelp} title="Help"
              style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'var(--chip-bg)', border: '1px solid var(--chip-line)',
                color: 'var(--sea-ink)', cursor: 'pointer', fontSize: '14px',
                fontWeight: 900, display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: 0, lineHeight: 1
              }}>?</button>
          ) : null}
          <ThemeToggle />
          <PremiseOrderToggle />
          <LanguageToggle />
        </div>
      </nav>
    </header>
  );
}
