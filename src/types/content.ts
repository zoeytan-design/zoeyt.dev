/**
 * Content types. All editable copy lives in src/content/ and is typed here,
 * so layout components never hard-code text.
 */

export interface SiteMeta {
  name: string;
  domain: string;
  /** Short line under the name, e.g. "Portfolio in progress". */
  status: string;
  /** Focus areas, used for metadata and future copy. */
  focus: string[];
}

export interface WorkItem {
  /** URL-safe unique id, e.g. "infection-echo". */
  slug: string;
  title: string;
  year?: number;
  role?: string;
  summary: string;
  tags?: string[];
  /** Optional external link (live demo, case study, repo). */
  url?: string;
}

export interface ContactLink {
  label: string;
  href: string;
}

export interface SectionCopy {
  /** Used as the HTML id and nav anchor. */
  id: 'work' | 'about' | 'contact';
  title: string;
  /** Shown when the section has no content yet. */
  emptyText: string;
}
