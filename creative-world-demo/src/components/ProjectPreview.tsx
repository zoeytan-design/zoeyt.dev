import type { PreviewSpec } from '../config/projects';

/**
 * Renders a project's preview. Real images when provided; otherwise a
 * designed abstract placeholder that is always labelled "Placeholder preview"
 * so it is never mistaken for actual work.
 */
export default function ProjectPreview({ preview, compact = false }: { preview: PreviewSpec; compact?: boolean }) {
  if (preview.kind === 'image') {
    return <img className="preview-img" src={preview.src} alt={preview.alt} loading="lazy" />;
  }
  const h = preview.hue;
  const c1 = `hsl(${h} 45% 14%)`;
  const c2 = `hsl(${h} 55% 32%)`;
  const c3 = `hsl(${h} 70% 78%)`;
  const id = `pv-${preview.variant}-${h}`;

  return (
    <div className="preview-ph">
      <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c2} />
            <stop offset="1" stopColor={c1} />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill={`url(#${id}-bg)`} />
        {preview.variant === 'vr' && (
          <g fill="none" stroke={c3}>
            <circle cx="230" cy="70" r="26" strokeOpacity="0.7" />
            <circle cx="238" cy="64" r="22" fill={c1} stroke="none" />
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse key={i} cx="160" cy="150" rx={40 + i * 28} ry={10 + i * 7} strokeOpacity={0.5 - i * 0.08} />
            ))}
            <path d="M120 120 C130 96 150 92 160 104 C170 92 190 96 200 120" strokeWidth="2" strokeOpacity="0.8" />
          </g>
        )}
        {preview.variant === 'interface' && (
          <g>
            <rect x="60" y="40" width="200" height="130" rx="10" fill={c1} stroke={c3} strokeOpacity="0.4" />
            <rect x="76" y="58" width="90" height="10" rx="5" fill={c3} opacity="0.7" />
            <rect x="76" y="78" width="140" height="6" rx="3" fill={c3} opacity="0.3" />
            <rect x="76" y="92" width="120" height="6" rx="3" fill={c3} opacity="0.3" />
            <rect x="76" y="116" width="72" height="38" rx="6" fill={c3} opacity="0.18" />
            <rect x="158" y="116" width="86" height="38" rx="6" fill={c3} opacity="0.32" />
          </g>
        )}
        {preview.variant === 'experiment' && (
          <g fill="none" stroke={c3}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <path
                key={i}
                d={`M-10 ${120 + i * 6} C80 ${40 + i * 14} 160 ${190 - i * 10} 330 ${70 + i * 12}`}
                strokeOpacity={0.15 + i * 0.09}
              />
            ))}
            <circle cx="212" cy="88" r="18" fill={c3} fillOpacity="0.2" />
          </g>
        )}
        {preview.variant === 'generic' && (
          <g stroke={c3} strokeOpacity="0.25">
            {Array.from({ length: 14 }, (_, i) => (
              <line key={i} x1={i * 30 - 60} y1="200" x2={i * 30 + 40} y2="0" />
            ))}
          </g>
        )}
      </svg>
      <span className={`ph-label${compact ? ' ph-label--compact' : ''}`}>Placeholder preview</span>
    </div>
  );
}
