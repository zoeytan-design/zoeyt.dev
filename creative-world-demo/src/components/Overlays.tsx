import { forwardRef, useSyncExternalStore } from 'react';
import { site } from '../config/site';
import { audio } from '../audio/AudioManager';
import type { Keyhole } from '../scene/geometry';
import type { Project } from '../config/projects';
import ProjectPreview from './ProjectPreview';

export type Phase = 'locked' | 'unlocking' | 'unlocked';

/* ---------- Persistent navigation ---------- */

export function Nav({
  arrived,
  onWork,
  onAbout,
  onDoor,
  workBtnRef,
}: {
  arrived: boolean;
  onWork: () => void;
  onAbout: () => void;
  onDoor: () => void;
  workBtnRef: React.RefObject<HTMLButtonElement>;
}) {
  const snap = useSyncExternalStore(audio.subscribe, audio.getSnapshot);
  const label =
    snap.status === 'on'
      ? 'Sound on'
      : snap.status === 'loading'
        ? 'Sound…'
        : snap.status === 'unavailable'
          ? 'Audio unavailable'
          : 'Sound off';

  return (
    <header className="nav">
      <span className="nav-mark" aria-label={`${site.name}, creative world demo`}>
        ZT<span className="nav-mark-sub">Creative World · demo</span>
      </span>
      <nav className="nav-links" aria-label="Main">
        {arrived && (
          <button type="button" className="nav-btn nav-btn--quiet" onClick={onDoor}>
            Door
          </button>
        )}
        <button type="button" className="nav-btn" onClick={onWork} ref={workBtnRef}>
          Work
        </button>
        <button type="button" className="nav-btn" onClick={onAbout}>
          About
        </button>
        <button
          type="button"
          className={`nav-btn nav-sound is-${snap.status}`}
          onClick={() => audio.toggle()}
          aria-pressed={snap.status === 'on'}
          title={
            snap.status === 'unavailable'
              ? `Music files not found (${snap.missing.join(', ') || 'unknown'}). Add them to /public/audio.`
              : 'Background music (off by default)'
          }
        >
          <span className="sound-bars" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {label}
        </button>
      </nav>
      <span className="sr-only" aria-live="polite">
        {snap.status === 'unavailable' ? 'Audio unavailable: music files are missing.' : ''}
      </span>
    </header>
  );
}

/* ---------- Entrance (at the door) ---------- */

export const EntranceUI = forwardRef<
  HTMLDivElement,
  {
    phase: Phase;
    keyhole: Keyhole;
    onEnter: () => void;
    onScrollIn: () => void;
    onViewWork: () => void;
    onSkip: () => void;
  }
>(function EntranceUI({ phase, keyhole: k, onEnter, onScrollIn, onViewWork, onSkip }, ref) {
  const titleStyle: React.CSSProperties = { top: k.cy - k.r * 0.62, left: k.cx };
  return (
    <div className="entrance" ref={ref}>
      <div className="entrance-title" style={titleStyle}>
        <h1 className="entrance-name">{site.name}</h1>
        <p className="entrance-hint">{site.entranceHint}</p>
      </div>

      <div className="entrance-actions">
        {phase === 'unlocked' ? (
          <button type="button" className="scroll-cue" onClick={onScrollIn}>
            <span className="scroll-cue-text">Scroll to enter</span>
            <span className="scroll-cue-line" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--enter"
            onClick={onEnter}
            disabled={phase === 'unlocking'}
            aria-label="Enter — turn the key"
          >
            {phase === 'unlocking' ? 'Unlocking…' : 'Enter'}
          </button>
        )}
      </div>

      <div className="entrance-corner entrance-corner--left">
        <button type="button" className="link" onClick={onSkip}>
          Skip intro
        </button>
      </div>
      <div className="entrance-corner entrance-corner--right">
        <button type="button" className="link" onClick={onViewWork}>
          View work →
        </button>
      </div>
    </div>
  );
});

/* ---------- Studio copy + mobile work list ---------- */

export const StudioUI = forwardRef<
  HTMLDivElement,
  {
    projects: Project[];
    showStrip: boolean;
    onOpen: (id: string, trigger: HTMLElement) => void;
  }
>(function StudioUI({ projects, showStrip, onOpen }, ref) {
  return (
    <div className="studio-ui" ref={ref}>
      <div className="studio-copy">
        <p className="eyebrow">{site.name}</p>
        <h2 className="studio-title" tabIndex={-1}>{site.welcome}</h2>
        <p className="studio-line">{site.positioning}</p>
        {!showStrip && <p className="studio-help">Select a work on display, or open Work for the full list.</p>}
      </div>
      {showStrip && (
        <section className="strip" aria-label="Selected work">
          <h3 className="strip-head">Selected work</h3>
          <ul className="strip-list">
            {projects.map((p) => (
              <li key={p.id}>
                <button type="button" className="strip-card" onClick={(e) => onOpen(p.id, e.currentTarget)}>
                  <span className="strip-thumb">
                    <ProjectPreview preview={p.preview} compact />
                  </span>
                  <span className="strip-title">{p.title}</span>
                  <span className="strip-cat">{p.category}</span>
                  <span className="strip-cta">View project →</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
});
