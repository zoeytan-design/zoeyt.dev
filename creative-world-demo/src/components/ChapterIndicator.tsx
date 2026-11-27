import { useEffect, useState } from 'react';
import { themes } from '../config/themes';
import { site } from '../config/site';

/**
 * Bottom-left chapter marker: current chapter name + one dot per chapter.
 * Reads chapters from [data-chapter] sections, so new chapters appear automatically.
 */
export default function ChapterIndicator() {
  const [labels, setLabels] = useState<string[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let sections: HTMLElement[] = [];
    const collect = () => {
      sections = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'));
      setLabels(sections.map((s) => s.dataset.chapter || ''));
    };
    collect();
    const onScroll = () => {
      const mid = window.innerHeight * 0.5;
      let idx = 0;
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= mid) idx = i;
      });
      setActive(idx);
      // Light/dark tone under the top nav and under the bottom chrome, so they stay readable.
      const toneAt = (y: number) => {
        let tone = 'deep';
        sections.forEach((sec) => {
          const r = sec.getBoundingClientRect();
          if (r.top <= y && r.bottom > y) tone = sec.dataset.tone ?? (sec.classList.contains('ch--paper') ? 'paper' : 'deep');
        });
        return tone;
      };
      const root = document.documentElement;
      root.dataset.toneTop = toneAt(36);
      root.dataset.toneBottom = toneAt(window.innerHeight - 36);
      // intro label changes (Entrance → Studio) without remounting
      const l = sections[idx]?.dataset.chapter;
      setLabels((prev) => (prev[idx] === l ? prev : sections.map((s) => s.dataset.chapter || '')));
    };
    const mo = new MutationObserver(() => {
      collect();
      onScroll();
    });
    mo.observe(document.querySelector('.experience') ?? document.body, { childList: true, subtree: false });
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      mo.disconnect();
      delete document.documentElement.dataset.toneTop;
      delete document.documentElement.dataset.toneBottom;
    };
  }, []);

  const jump = (i: number) => {
    const el = document.querySelectorAll<HTMLElement>('[data-chapter]')[i];
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // the studio point is the end of the keyhole travel, not the top of the intro
    const abs = el.getBoundingClientRect().top + window.scrollY;
    const top = i === 0 ? abs + window.innerHeight * site.travelViewports : abs;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <nav className="chapter-ind" aria-label="Chapters">
      <span className="chapter-ind-label" aria-live="polite">
        {labels[active]}
      </span>
      <ol className="chapter-ind-dots">
        {labels.map((l, i) => (
          <li key={`${l}-${i}`}>
            <button
              type="button"
              className={i === active ? 'is-active' : ''}
              aria-label={`Go to ${l}`}
              aria-current={i === active ? 'true' : undefined}
              onClick={() => jump(i)}
            />
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Demo-only palette switcher for comparing the three proposals. */
export function PalettePicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const current = themes.find((t) => t.id === value) ?? themes[0];
  return (
    <div className="palette" role="group" aria-label="Palette proposals (demo)">
      <span className="palette-label">Palette · {current.name}</span>
      {themes.map((t, i) => (
        <button
          key={t.id}
          type="button"
          className={`palette-btn${t.id === value ? ' is-active' : ''}`}
          onClick={() => onChange(t.id)}
          aria-pressed={t.id === value}
          title={`${t.name} — ${t.note}`}
          style={{ background: `linear-gradient(135deg, ${t.deep} 50%, ${t.paper} 50%)` }}
        >
          <span className="sr-only">
            {String.fromCharCode(65 + i)}: {t.name}
          </span>
        </button>
      ))}
    </div>
  );
}
