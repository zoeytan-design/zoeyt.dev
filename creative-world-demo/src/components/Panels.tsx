import Dialog from './Dialog';
import ProjectPreview from './ProjectPreview';
import type { Project } from '../config/projects';
import { site } from '../config/site';

export function DemoBadge() {
  return <span className="badge">Demo content</span>;
}

/** Lightweight case template shared by all projects. */
export function CasePanel({
  project,
  onClose,
  returnFocus,
}: {
  project: Project | null;
  onClose: () => void;
  returnFocus: HTMLElement | null;
}) {
  return (
    <Dialog
      open={Boolean(project)}
      onClose={onClose}
      title={project?.title ?? ''}
      variant="case"
      returnFocus={returnFocus}
      closeLabel="Back to studio"
    >
      {project && (
        <article className="case">
          <div className="case-preview">
            <ProjectPreview preview={project.preview} />
          </div>
          <div className="case-meta">
            <p className="eyebrow">{project.category}</p>
            {project.isDemoContent && <DemoBadge />}
          </div>
          <p className="case-summary">{project.summary}</p>
          {project.tags && project.tags.length > 0 && (
            <ul className="tags" aria-label="Tools and context">
              {project.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          {project.caseContent?.map((s) => (
            <section key={s.heading} className="case-section">
              <h3>{s.heading}</h3>
              <p>{s.body}</p>
            </section>
          ))}
        </article>
      )}
    </Dialog>
  );
}

export function WorkPanel({
  open,
  projects,
  onClose,
  onSelect,
}: {
  open: boolean;
  projects: Project[];
  onClose: () => void;
  onSelect: (id: string, trigger: HTMLElement) => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} title="Work">
      <p className="muted">{projects.length} selected works · all entries are demo content for now.</p>
      <ol className="work-list">
        {projects.map((p, i) => (
          <li key={p.id}>
            <button type="button" className="work-row" onClick={(e) => onSelect(p.id, e.currentTarget)}>
              <span className="work-thumb">
                <ProjectPreview preview={p.preview} compact />
              </span>
              <span className="work-text">
                <span className="work-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="work-title">{p.title}</span>
                <span className="work-cat">{p.category}</span>
              </span>
              <span className="work-cta">View project →</span>
            </button>
          </li>
        ))}
      </ol>
    </Dialog>
  );
}

export function AboutPanel({
  open,
  onClose,
  onBackToDoor,
}: {
  open: boolean;
  onClose: () => void;
  onBackToDoor: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} title="About">
      <p className="about-name">{site.name}</p>
      <p className="about-line">{site.positioning}</p>
      <p className="muted">
        <DemoBadge /> This positioning line is a working draft for the demo.
      </p>
      <div className="about-actions">
        <button type="button" className="btn" onClick={onClose}>
          Back to studio
        </button>
        <button type="button" className="btn-ghost" onClick={onBackToDoor}>
          Return to the door
        </button>
      </div>
    </Dialog>
  );
}
