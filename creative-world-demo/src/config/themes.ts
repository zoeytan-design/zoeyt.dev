/**
 * Palette proposals for the chapter sections. Each chapter alternates
 * between `deep` (dark ground) and `paper` (light ground), like flipping
 * the lights in a gallery. The studio scene keeps its night palette.
 *
 * Pick one by setting `defaultTheme`, or preview with ?theme=night|cobalt|moss.
 */
export interface Theme {
  id: string;
  name: string;
  note: string;
  deep: string; // dark ground
  deepText: string; // text on dark
  paper: string; // light ground
  paperText: string; // text on light
  accent: string; // lines, numbers, highlights
  warm: string; // small warm accent (lamp light)
}

export const themes: Theme[] = [
  {
    id: 'night',
    name: 'Night Studio',
    note: 'Ink blue + paper white, cyan lines, warm lamp accents. Closest to the studio scene.',
    deep: '#0b1530',
    deepText: '#e9eef3',
    paper: '#eee8dc',
    paperText: '#0f1a33',
    accent: '#8fd3dc',
    warm: '#f2b56b',
  },
  {
    id: 'cobalt',
    name: 'Cobalt Garden',
    note: 'Saturated cobalt + cream, two-colour contrast with an amber spark.',
    deep: '#1f31a5',
    deepText: '#f5ecd6',
    paper: '#f5ecd6',
    paperText: '#1f31a5',
    accent: '#f5ecd6',
    warm: '#f0a94f',
  },
  {
    id: 'moss',
    name: 'Moss & Moon',
    note: 'Deep forest green + bone, moonlit sage lines. More nature, softer tech.',
    deep: '#10261f',
    deepText: '#e8e4d8',
    paper: '#e8e4d8',
    paperText: '#10261f',
    accent: '#b9d7c3',
    warm: '#e0a85c',
  },
];

export const defaultTheme = 'night';

export function initialThemeId(): string {
  const q = new URLSearchParams(window.location.search).get('theme');
  if (q && themes.some((t) => t.id === q)) return q;
  try {
    const saved = localStorage.getItem('zoey-demo.theme');
    if (saved && themes.some((t) => t.id === saved)) return saved;
  } catch {
    /* ignore */
  }
  return defaultTheme;
}

export function applyTheme(id: string) {
  const t = themes.find((x) => x.id === id) ?? themes[0];
  const r = document.documentElement.style;
  r.setProperty('--c-deep', t.deep);
  r.setProperty('--c-deep-text', t.deepText);
  r.setProperty('--c-paper', t.paper);
  r.setProperty('--c-paper-text', t.paperText);
  r.setProperty('--c-accent', t.accent);
  r.setProperty('--c-warm', t.warm);
  try {
    localStorage.setItem('zoey-demo.theme', t.id);
  } catch {
    /* ignore */
  }
}
