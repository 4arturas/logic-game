var { useContext } = React;

function Footer(props) {
  var i18n = useContext(I18nContext);
  var t = i18n.t;
  return (
    <footer className="site-footer" style={{ padding: '32px 16px', marginTop: '48px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <p style={{ color: 'var(--sea-ink-soft)', fontSize: '11px', margin: 0, opacity: 0.7 }}>
          {t('footer.copyright').replace('{year}', new Date().getFullYear())}
        </p>
      </div>
    </footer>
  );
}
