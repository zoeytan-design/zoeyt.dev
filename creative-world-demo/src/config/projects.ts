/**
 * Project data — the single source of truth for every exhibit in the studio
 * and every row in the Work list. Exhibits are generated from this data;
 * nothing about count or order is hard-coded in the animation.
 *
 * Everything here is DEMO CONTENT. Replace freely.
 */

export type PreviewSpec =
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'placeholder'; variant: 'vr' | 'interface' | 'experiment' | 'generic'; hue: number };

export interface CaseSection {
  heading: string;
  body: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  /** Year or period, optional */
  year?: string;
  preview: PreviewSpec;
  summary: string;
  /** Facts only. Leave empty rather than inventing details. */
  tags?: string[];
  caseContent?: CaseSection[];
  /** True while the entry is a stand-in (shows the "Demo content" badge). */
  isDemoContent: boolean;
}

export const projects: Project[] = [
  {
    id: 'nightguard-vr',
    title: 'NightGuard VR',
    category: 'VR · Rehabilitation game prototype',
    preview: { kind: 'placeholder', variant: 'vr', hue: 190 },
    summary:
      'A VR rehabilitation game prototype built in Unity for Meta Quest 3, played through hand interaction.',
    tags: ['Unity', 'Meta Quest 3', 'Hand interaction'],
    caseContent: [
      {
        heading: 'Known facts',
        body: 'Prototype of a VR rehabilitation game. Built with Unity, targeting Meta Quest 3, using hand interaction as the main input.',
      },
      {
        heading: 'To be written',
        body: 'Goals, process, research, testing and outcomes have not been provided yet. This section is intentionally left empty rather than filled with invented results.',
      },
    ],
    isDemoContent: true,
  },
  {
    id: 'project-02',
    title: 'Project 02',
    category: 'UI / UX case study',
    preview: { kind: 'placeholder', variant: 'interface', hue: 205 },
    summary: 'Placeholder slot for a UI/UX case study.',
    caseContent: [
      {
        heading: 'Placeholder',
        body: 'This case study has not been written yet. Replace this entry in src/config/projects.ts.',
      },
    ],
    isDemoContent: true,
  },
  {
    id: 'project-03',
    title: 'Project 03',
    category: 'Visual / interactive experiment',
    preview: { kind: 'placeholder', variant: 'experiment', hue: 168 },
    summary: 'Placeholder slot for a visual or interactive experiment.',
    caseContent: [
      {
        heading: 'Placeholder',
        body: 'This experiment has not been documented yet. Replace this entry in src/config/projects.ts.',
      },
    ],
    isDemoContent: true,
  },
  // Extra placeholder, unused by default — add its id to selectedProjectIds to test 4 exhibits.
  {
    id: 'project-04',
    title: 'Project 04',
    category: 'Placeholder',
    preview: { kind: 'placeholder', variant: 'generic', hue: 225 },
    summary: 'Spare placeholder used to test layouts with more exhibits.',
    caseContent: [{ heading: 'Placeholder', body: 'Spare entry for layout testing.' }],
    isDemoContent: true,
  },
];
