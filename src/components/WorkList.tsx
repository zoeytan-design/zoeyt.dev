import type { WorkItem } from '../types/content';

export function WorkList({ items }: { items: WorkItem[] }) {
  return (
    <ul className="work-list">
      {items.map((item) => (
        <li key={item.slug} className="work-list__item">
          <h3 className="work-list__title">
            {item.url ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
            ) : (
              item.title
            )}
          </h3>
          {(item.year || item.role) && (
            <p className="work-list__meta">
              {[item.year, item.role].filter(Boolean).join(' · ')}
            </p>
          )}
          <p>{item.summary}</p>
        </li>
      ))}
    </ul>
  );
}
