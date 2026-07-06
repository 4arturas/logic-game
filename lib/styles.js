function injectStyles() {
  var css = `
@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap");

:root {
  --sea-ink: #0f1923; --sea-ink-soft: #4a5568; --lagoon: #3b7dd8; --lagoon-deep: #2563ba;
  --palm: #1a5c3a; --sand: #edeae0; --foam: #f5f3ec;
  --surface: rgba(255,255,255,.93); --surface-strong: rgba(255,255,255,.99);
  --line: rgba(15,25,35,.13); --inset-glint: rgba(255,255,255,.9);
  --kicker: #3b7dd8; --bg-base: #f0ede4;
  --header-bg: rgba(245,243,236,.95); --chip-bg: rgba(255,255,255,.92);
  --chip-line: rgba(15,25,35,.15); --link-bg-hover: rgba(255,255,255,.96);
  --hero-a: rgba(59,125,216,.10); --hero-b: rgba(217,119,6,.07);
  --term-x: #1d4ed8; --term-y: #b91c1c; --term-m: #b45309;
  --font-sans: "Manrope",ui-sans-serif,system-ui,sans-serif;
  --font-mono: "JetBrains Mono","Courier New",ui-monospace,monospace;
}

:root[data-theme="ocean"] {
  --sea-ink: #173a40; --sea-ink-soft: #416166; --lagoon: #4fb8b2; --lagoon-deep: #328f97;
  --palm: #2f6a4a; --sand: #e7f0e8; --foam: #f3faf5;
  --surface: rgba(255,255,255,.74); --surface-strong: rgba(255,255,255,.9);
  --line: rgba(23,58,64,.14); --kicker: rgba(47,106,74,.9); --bg-base: #e7f3ec;
  --header-bg: rgba(251,255,248,.84); --chip-bg: rgba(255,255,255,.8);
  --chip-line: rgba(47,106,74,.18); --link-bg-hover: rgba(255,255,255,.9);
  --hero-a: rgba(79,184,178,.36); --hero-b: rgba(47,106,74,.2);
}
:root[data-theme="forest"] {
  --sea-ink: #1a2e1a; --sea-ink-soft: #3d5a3d; --lagoon: #6b8e4a; --lagoon-deep: #4a6b3a;
  --palm: #3d5a3d; --sand: #e8f0e0; --foam: #f5faf0;
  --surface: rgba(255,255,255,.74); --surface-strong: rgba(255,255,255,.9);
  --line: rgba(58,82,46,.14); --kicker: rgba(75,106,58,.9); --bg-base: #e8f0e0;
  --header-bg: rgba(248,255,240,.84); --chip-bg: rgba(255,255,255,.8);
  --chip-line: rgba(58,82,46,.18); --link-bg-hover: rgba(255,255,255,.9);
  --hero-a: rgba(107,142,74,.36); --hero-b: rgba(75,106,58,.2);
}
:root[data-theme="sunset"] {
  --sea-ink: #4a2a1a; --sea-ink-soft: #6b4a3a; --lagoon: #e67e5a; --lagoon-deep: #c95a3a;
  --palm: #a85a3a; --sand: #f0e8e0; --foam: #faf5f0;
  --surface: rgba(255,255,255,.74); --surface-strong: rgba(255,255,255,.9);
  --line: rgba(74,42,26,.14); --kicker: rgba(168,90,58,.9); --bg-base: #fff5f0;
  --header-bg: rgba(255,250,245,.84); --chip-bg: rgba(255,255,255,.8);
  --chip-line: rgba(201,90,58,.18); --link-bg-hover: rgba(255,255,255,.9);
  --hero-a: rgba(230,126,90,.36); --hero-b: rgba(201,90,58,.2);
}
:root[data-theme="midnight"] {
  --sea-ink: #e8e8e8; --sea-ink-soft: #c0c0c0; --lagoon: #6a8cff; --lagoon-deep: #4a6ce0;
  --palm: #5a6a8a; --sand: #1a1a2e; --foam: #0f0f1a;
  --surface: rgba(30,30,50,.8); --surface-strong: rgba(20,20,35,.92);
  --line: rgba(106,140,255,.18); --kicker: #8a9eff; --bg-base: #0a0a14;
  --header-bg: rgba(15,15,30,.8); --chip-bg: rgba(25,25,45,.9);
  --chip-line: rgba(106,140,255,.24); --link-bg-hover: rgba(35,35,60,.8);
  --hero-a: rgba(106,140,255,.18); --hero-b: rgba(90,106,138,.12);
}
:root[data-theme="cream"] {
  --sea-ink: #3a2a1a; --sea-ink-soft: #5a4a3a; --lagoon: #a89070; --lagoon-deep: #8a7050;
  --palm: #6a5a4a; --sand: #f5f0e8; --foam: #faf8f5;
  --surface: rgba(255,255,255,.74); --surface-strong: rgba(255,255,255,.9);
  --line: rgba(58,42,26,.14); --kicker: rgba(106,80,50,.9); --bg-base: #faf5f0;
  --header-bg: rgba(255,253,248,.84); --chip-bg: rgba(255,255,255,.8);
  --chip-line: rgba(138,112,80,.18); --link-bg-hover: rgba(255,255,255,.9);
  --hero-a: rgba(168,144,112,.36); --hero-b: rgba(138,112,80,.2);
  --term-x: #3b82f6; --term-y: #ef4444; --term-m: #f59e0b;
}
:root[data-theme="clean"] {
  --sea-ink: #1a1a1a; --sea-ink-soft: #666; --lagoon: #06c; --lagoon-deep: #049;
  --palm: #00853f; --sand: #f5f5f5; --foam: #fafafa;
  --surface: rgba(255,255,255,.95); --surface-strong: #fff;
  --line: rgba(0,0,0,.1); --kicker: rgba(0,102,204,.9); --bg-base: #fff;
  --header-bg: rgba(255,255,255,.95); --chip-bg: rgba(255,255,255,.95);
  --chip-line: rgba(0,0,0,.15); --link-bg-hover: rgba(240,240,240,.9);
  --hero-a: rgba(0,102,204,.1); --hero-b: rgba(0,133,63,.05);
  --term-x: #06c; --term-y: #00853f; --term-m: #666;
}
:root[data-theme="focus"] {
  --sea-ink: #2d2d2d; --sea-ink-soft: #5a5a5a; --lagoon: #7c3aed; --lagoon-deep: #5b21b6;
  --palm: #059669; --sand: #f8f7fc; --foam: #faf9ff;
  --surface: rgba(255,255,255,.98); --surface-strong: #fff;
  --line: rgba(124,58,237,.12); --kicker: rgba(124,58,237,.9); --bg-base: #faf9ff;
  --header-bg: rgba(255,255,255,.98); --chip-bg: rgba(255,255,255,.98);
  --chip-line: rgba(124,58,237,.2); --link-bg-hover: rgba(245,243,255,.9);
  --hero-a: rgba(124,58,237,.08); --hero-b: rgba(5,150,105,.04);
  --term-x: #7c3aed; --term-y: #059669; --term-m: #5a5a5a;
}
:root[data-theme="dark"] {
  --sea-ink: #d7ece8; --sea-ink-soft: #afcdc8; --lagoon: #60d7cf; --lagoon-deep: #8de5db;
  --palm: #6ec89a; --sand: #0f1a1e; --foam: #101d22;
  --surface: rgba(16,30,34,.8); --surface-strong: rgba(15,27,31,.92);
  --line: rgba(141,229,219,.18); --kicker: #b8efe5; --bg-base: #0a1418;
  --header-bg: rgba(10,20,24,.8); --chip-bg: rgba(13,28,32,.9);
  --chip-line: rgba(141,229,219,.24); --link-bg-hover: rgba(24,44,49,.8);
  --hero-a: rgba(96,215,207,.18); --hero-b: rgba(110,200,154,.12);
  --term-x: #7eb6ff; --term-y: #ff6b81; --term-m: #fcd34d;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --sea-ink: #d7ece8; --sea-ink-soft: #afcdc8; --lagoon: #60d7cf; --lagoon-deep: #8de5db;
    --palm: #6ec89a; --sand: #0f1a1e; --foam: #101d22;
    --surface: rgba(16,30,34,.8); --surface-strong: rgba(15,27,31,.92);
    --line: rgba(141,229,219,.18); --kicker: #b8efe5; --bg-base: #0a1418;
    --header-bg: rgba(10,20,24,.8); --chip-bg: rgba(13,28,32,.9);
    --chip-line: rgba(141,229,219,.24); --link-bg-hover: rgba(24,44,49,.8);
    --hero-a: rgba(96,215,207,.18); --hero-b: rgba(110,200,154,.12);
    --term-x: #7eb6ff; --term-y: #ff6b81; --term-m: #fcd34d;
  }
}

* { box-sizing: border-box; }
html, body, #app { min-height: 100%; }
body {
  margin: 0; color: var(--sea-ink); font-family: var(--font-sans);
  background-color: var(--bg-base); background: linear-gradient(180deg,var(--foam) 0%,var(--bg-base) 100%);
  overflow-x: hidden; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}
body::before {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: -2;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='220'%3E%3Ccircle cx='110' cy='110' r='76' fill='none' stroke='rgba(15%2C25%2C35%2C0.055)' stroke-width='1.5'/%3E%3Ccircle cx='210' cy='110' r='76' fill='none' stroke='rgba(15%2C25%2C35%2C0.055)' stroke-width='1.5'/%3E%3C/svg%3E");
  background-size: 320px 220px; background-repeat: repeat;
}
body::after {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: -1;
  background-image: linear-gradient(rgba(15,25,35,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(15,25,35,.03) 1px, transparent 1px);
  background-size: 32px 32px;
}
a { color: var(--lagoon-deep); text-decoration-color: rgba(37,99,186,.4); text-decoration-thickness: 1px; text-underline-offset: 2px; }
a:hover { color: var(--lagoon); }
code { font-family: var(--font-mono); font-size: .875em; border: 1px solid var(--line); background: var(--surface-strong); border-radius: 3px; padding: 2px 6px; }
pre code { border: 0; background: transparent; padding: 0; border-radius: 0; font-size: inherit; color: inherit; }
button, a { transition: background-color 160ms ease, color 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease; }
.island-kicker { letter-spacing: .18em; text-transform: uppercase; font-weight: 700; font-size: .67rem; color: var(--kicker); font-family: var(--font-mono); }
@media (max-width: 640px) { .logo-text { display: none; } }
  `;
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}
