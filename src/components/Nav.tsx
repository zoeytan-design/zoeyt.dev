import type { SectionCopy } from '../types/content';

export function Nav({ sections }: { sections: SectionCopy[] }) {
  return (
    <nav className="nav" aria-label="Sections">
      <ul className="nav__list">
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`}>{s.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
