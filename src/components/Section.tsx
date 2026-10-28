import type { ReactNode } from 'react';
import type { SectionCopy } from '../types/content';

interface SectionProps {
  copy: SectionCopy;
  isEmpty: boolean;
  children?: ReactNode;
}

export function Section({ copy, isEmpty, children }: SectionProps) {
  const headingId = `${copy.id}-heading`;
  return (
    <section id={copy.id} className="section" aria-labelledby={headingId}>
      <h2 id={headingId} className="section__title">
        {copy.title}
      </h2>
      {isEmpty ? <p className="section__empty">{copy.emptyText}</p> : children}
    </section>
  );
}
