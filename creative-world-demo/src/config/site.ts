/**
 * Central demo configuration. Every value here is a starting assumption,
 * not a final decision — change it here rather than inside components.
 */
import { projects, type Project } from './projects';

export const site = {
  name: 'Zoey Tan',
  entranceHint: 'A private studio. Turn the key to step inside.',
  welcome: 'Welcome to my creative world.',
  /** Demo positioning line — NOT a confirmed personal brand. */
  positioning: 'Designer exploring interaction, visual design and creative technology.',

  /**
   * Which projects appear, and in what order. This is the hook for future
   * "curated share versions" (e.g. per company / programme).
   * Try ['nightguard-vr', 'project-02'] or add 'project-04' to test 2 / 4 exhibits.
   */
  selectedProjectIds: ['nightguard-vr', 'project-02', 'project-03'] as string[],

  /** Scroll distance of the keyhole fly-through, in viewport heights (brief: ~1–1.5). */
  travelViewports: 1.3,

  /** Max parallax shift in px for the nearest layer (cursor). */
  parallaxMax: 14,

  audio: {
    entrance: `${import.meta.env.BASE_URL}audio/entrance.mp3`,
    studio: `${import.meta.env.BASE_URL}audio/studio.mp3`,
    volume: 0.55,
    /** Studio music volume multiplier while a case panel is open. */
    duckFactor: 0.3,
  },

  /** Remember that the visitor already went through the entrance (no forced replay). */
  rememberEntryKey: 'zoey-demo.entered',
};

/** Palette — mirrors CSS variables in styles/global.css (kept here for SVG use). */
export const palette = {
  ink: '#070b14',
  inkBlue: '#0d1628',
  deepBlue: '#13213a',
  charcoal: '#14161b',
  silver: '#d9e1ea',
  paleCyan: '#a9e4ea',
  cyan: '#6fd0db',
  warm: '#ffc27a',
  warmDeep: '#e98f45',
  leaf: '#1d3b36',
  leafLight: '#3c6b5e',
};

/**
 * Selected projects in configured order. For quick testing of curated
 * versions, `?projects=id1,id2` in the URL overrides the list (demo only).
 */
export function getSelectedProjects(): Project[] {
  const byId = new Map(projects.map((p) => [p.id, p]));
  const fromUrl = new URLSearchParams(window.location.search).get('projects');
  const ids = fromUrl ? fromUrl.split(',').map((s) => s.trim()).filter(Boolean) : site.selectedProjectIds;
  return ids
    .map((id) => byId.get(id))
    .filter((p): p is Project => Boolean(p));
}
