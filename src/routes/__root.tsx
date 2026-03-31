import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { I18nProvider } from '../i18n/I18nContext'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { SettingsProvider } from '../contexts/SettingsContext'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var params=new URLSearchParams(window.location.search);var urlTheme=params.get('theme');var validThemes=['ocean','forest','sunset','midnight','cream','dark'];var mode=urlTheme&&validThemes.includes(urlTheme)?urlTheme:(stored&&validThemes.includes(stored)?stored:'ocean');var root=document.documentElement;root.setAttribute('data-theme',mode);root.style.colorScheme=mode==='dark'?'dark':'light';root.classList.remove('light','dark');if(mode==='dark'){root.classList.add('dark');}}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]" suppressHydrationWarning>
        <I18nProvider>
          <SettingsProvider>
            <Header />
            {children}
            <Footer />
          </SettingsProvider>
        </I18nProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
