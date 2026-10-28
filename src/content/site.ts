import type { SectionCopy, SiteMeta } from '../types/content';

export const site: SiteMeta = {
  name: 'Zoey Tan',
  domain: 'zoeyt.dev',
  status: 'Portfolio in progress',
  focus: ['Design', 'Interaction', 'Front-end development'],
};

/** Order here = order on the page. */
export const sections: SectionCopy[] = [
  { id: 'work', title: 'Work', emptyText: 'Coming soon.' },
  { id: 'about', title: 'About', emptyText: 'Coming soon.' },
  { id: 'contact', title: 'Contact', emptyText: 'Coming soon.' },
];
