import { forwardRef, useMemo } from 'react';
import { keyholePath, type Keyhole } from '../scene/geometry';

interface Props {
  keyhole: Keyhole;
  vw: number;
  vh: number;
}

/**
 * The lock surface, very close to the lens: a dark, softly lit plate whose
 * keyhole edge is out of focus (blurred mask). The whole plate is scaled
 * around the keyhole centre to "fly through" — because its edge is soft,
 * scaling never reveals pixelated rims.
 */
const LockPlate = forwardRef<HTMLDivElement, Props>(function LockPlate({ keyhole: k, vw, vh }, ref) {
  const mask = useMemo(() => {
    const pad = 400;
    const outer = `M ${-pad} ${-pad} H ${vw + pad} V ${vh + pad} H ${-pad} Z`;
    const hole = translatePath(keyholePath(k), k.cx, k.cy);
    const full = `<svg xmlns='http://www.w3.org/2000/svg' width='${vw}' height='${vh}' viewBox='0 0 ${vw} ${vh}'><defs><filter id='b' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='${k.blur.toFixed(1)}'/></filter></defs><path filter='url(#b)' fill-rule='evenodd' fill='black' d='${outer} ${hole}'/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(full)}")`;
  }, [k, vw, vh]);

  const style = {
    WebkitMaskImage: mask,
    maskImage: mask,
    transformOrigin: `${k.cx}px ${k.cy}px`,
    '--kx': `${k.cx}px`,
    '--ky': `${k.cy}px`,
    '--kr': `${k.r}px`,
    '--kh': `${k.h}px`,
  } as React.CSSProperties;

  return (
    <div className="plate" ref={ref} style={style} aria-hidden="true">
      <div className="plate-warm" />
    </div>
  );
});

/** Offsets every absolute coordinate pair of a path built by keyholePath(). */
function translatePath(d: string, dx: number, dy: number) {
  // keyholePath emits only absolute commands with x y pairs, except 'A' which
  // has rx ry rot large sweep x y. Handle tokens explicitly.
  const tokens = d.trim().split(/\s+/);
  const out: string[] = [];
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i++];
    if (t === 'A') {
      out.push('A', tokens[i], tokens[i + 1], tokens[i + 2], tokens[i + 3], tokens[i + 4]);
      i += 5;
      out.push(String(+tokens[i++] + dx), String(+tokens[i++] + dy));
    } else if (t === 'Z') {
      out.push('Z');
    } else if (/^[MLCQ]$/.test(t)) {
      out.push(t);
      const pairs = t === 'C' ? 3 : t === 'Q' ? 2 : 1;
      for (let p = 0; p < pairs; p++) {
        out.push(String(+tokens[i++] + dx), String(+tokens[i++] + dy));
      }
    }
  }
  return out.join(' ');
}

export default LockPlate;

/** The key: drawn as a crafted silver key, aligned with the keyhole and turned 90°. */
export const Key = forwardRef<SVGSVGElement, { keyhole: Keyhole }>(function Key({ keyhole: k }, ref) {
  const size = k.u * 0.5;
  const style: React.CSSProperties = {
    width: size * 0.5,
    height: size,
    left: k.cx - size * 0.25,
    top: k.cy + k.u * 0.2 - size * 0.5,
  };
  return (
    <svg ref={ref} className="key" style={style} viewBox="0 0 100 200" aria-hidden="true">
      <defs>
        <linearGradient id="keyMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f7fa" />
          <stop offset="0.45" stopColor="#aab6c3" />
          <stop offset="0.7" stopColor="#e2e8ee" />
          <stop offset="1" stopColor="#6c7887" />
        </linearGradient>
      </defs>
      <g fill="url(#keyMetal)">
        {/* bow: an open ring with a leaf inside — nature meets machined metal */}
        <path
          fillRule="evenodd"
          d="M50 4 C74 4 92 22 92 46 C92 70 74 88 50 88 C26 88 8 70 8 46 C8 22 26 4 50 4 Z M50 16 C33 16 20 29 20 46 C20 63 33 76 50 76 C67 76 80 63 80 46 C80 29 67 16 50 16 Z"
        />
        <path d="M50 22 C64 30 68 48 50 70 C32 48 36 30 50 22 Z" opacity="0.85" />
        <rect x="44" y="86" width="12" height="96" rx="3" />
        <rect x="38" y="92" width="24" height="5" rx="2" />
        {/* bit */}
        <path d="M56 150 H72 V158 H64 V166 H72 V180 H56 Z" />
      </g>
      <path d="M50 26 L50 66" stroke="#5c6a78" strokeWidth="1" opacity="0.6" />
    </svg>
  );
});
