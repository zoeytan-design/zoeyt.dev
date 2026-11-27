import { EXHIBIT_SLOTS, STAGE_H, STAGE_W, metreAt } from '../scene/geometry';
import type { Project } from '../config/projects';
import ProjectPreview from './ProjectPreview';

interface Props {
  projects: Project[];
  k: number;
  interactive: boolean;
  onOpen: (id: string, trigger: HTMLElement) => void;
}

/**
 * Exhibits are generated from project data and placed on floor slots.
 * Size follows perspective (pixels-per-metre at that floor depth).
 * Projects beyond the available slots stay reachable from the Work list.
 */
export default function Exhibits({ projects, k, interactive, onOpen }: Props) {
  const placed = projects.slice(0, EXHIBIT_SLOTS.length);
  // Draw far exhibits first so near ones overlap them.
  const order = placed
    .map((p, i) => ({ p, i, slot: EXHIBIT_SLOTS[i] }))
    .sort((a, b) => a.slot.floorY - b.slot.floorY);

  return (
    <div className={`exhibits${interactive ? ' is-live' : ''}`}>
      {order.map(({ p, i, slot }) => {
        const m = metreAt(slot.floorY) * k;
        const style = {
          left: `${(slot.x / STAGE_W) * 100}%`,
          top: `${(slot.floorY / STAGE_H) * 100}%`,
          '--m': `${m}px`,
        } as React.CSSProperties;
        return (
          <div className="exhibit" style={style} key={p.id}>
            <button
              type="button"
              className="exhibit-btn"
              tabIndex={interactive ? 0 : -1}
              aria-label={`${p.title} — ${p.category}. View project`}
              onClick={(e) => onOpen(p.id, e.currentTarget)}
            >
              <span className="exhibit-frame">
                <ProjectPreview preview={p.preview} compact />
              </span>
              <span className="exhibit-caption">
                <span className="exhibit-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="exhibit-title">{p.title}</span>
                <span className="exhibit-cat">{p.category}</span>
                <span className="exhibit-cta">View project →</span>
              </span>
            </button>
            <span className="exhibit-plinth" aria-hidden="true" />
            <span className="exhibit-shadow" aria-hidden="true" />
          </div>
        );
      })}
    </div>
  );
}
