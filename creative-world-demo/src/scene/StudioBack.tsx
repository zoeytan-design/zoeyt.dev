import { VP } from './geometry';

/**
 * Far layer: architecture, the garden beyond the glass, floor and light.
 * Hand-built vector placeholder for a future high-quality render/painting.
 */

const around = (s: number) => `translate(${VP.x} ${VP.y}) scale(${s}) translate(${-VP.x} ${-VP.y})`;

// Back wall corners (stage units) — side walls are derived from the vanishing point.
const BW = { l: 250, r: 1350, t: 70, b: 700 };

const CENTER_WINDOW =
  'M604 700 L604 340 C604 214 704 132 800 120 C896 132 996 214 996 340 L996 700 Z';
const LEFT_WINDOW = 'M372 700 L372 380 C372 312 412 262 452 252 C492 262 532 312 532 380 L532 700 Z';
const RIGHT_WINDOW =
  'M1068 700 L1068 380 C1068 312 1108 262 1148 252 C1188 262 1228 312 1228 380 L1228 700 Z';

// Organic portal frame, drawn on the back-wall plane and repeated toward the camera.
const PORTAL =
  'M262 700 L262 300 C262 160 470 78 800 64 C1130 78 1338 160 1338 300 L1338 700';

function Garden() {
  return (
    <g>
      <rect x="250" y="80" width="1100" height="640" fill="url(#sky)" />
      {/* soft moon glow */}
      <circle cx="884" cy="300" r="120" fill="url(#moonGlow)" />
      <circle cx="884" cy="300" r="15" fill="#e9f6f4" opacity="0.75" />
      {/* distant ridge */}
      <path
        d="M250 560 C330 520 420 528 500 540 C590 552 640 508 730 512 C820 516 860 548 950 540 C1040 532 1110 498 1200 516 C1270 530 1320 548 1350 552 L1350 720 L250 720 Z"
        fill="#24505a"
        opacity="0.55"
      />
      <path
        d="M250 600 C340 572 420 586 520 578 C620 570 700 590 800 586 C900 582 980 566 1080 576 C1180 586 1270 572 1350 584 L1350 720 L250 720 Z"
        fill="#163a3d"
      />
      {/* horizon mist */}
      <rect x="250" y="540" width="1100" height="90" fill="url(#horizonMist)" />
      {/* garden trees — organic crowns */}
      <g fill="#0f2a28">
        <ellipse cx="420" cy="590" rx="70" ry="54" />
        <ellipse cx="474" cy="610" rx="58" ry="40" />
        <ellipse cx="660" cy="604" rx="64" ry="46" />
        <ellipse cx="712" cy="584" rx="44" ry="50" />
        <ellipse cx="960" cy="596" rx="80" ry="52" />
        <ellipse cx="1030" cy="612" rx="58" ry="38" />
        <ellipse cx="1180" cy="588" rx="72" ry="58" />
        <ellipse cx="1260" cy="606" rx="64" ry="42" />
      </g>
      <g fill="#2e5d55" opacity="0.55">
        <ellipse cx="410" cy="566" rx="40" ry="18" />
        <ellipse cx="704" cy="560" rx="26" ry="16" />
        <ellipse cx="950" cy="572" rx="44" ry="16" />
        <ellipse cx="1172" cy="560" rx="38" ry="18" />
      </g>
      {/* slender futuristic structure in the garden */}
      <path d="M842 640 L846 420 L850 640 Z" fill="#9fd9d8" opacity="0.35" />
      <ellipse cx="846" cy="420" rx="22" ry="5" fill="none" stroke="#bfeae6" strokeOpacity="0.5" />
      {/* near garden floor */}
      <rect x="250" y="626" width="1100" height="90" fill="#0b1c1d" />
      <path
        d="M250 640 C400 626 520 650 700 636 C860 624 1000 648 1150 634 C1250 626 1310 638 1350 636 L1350 720 L250 720 Z"
        fill="#0a1717"
      />
    </g>
  );
}

function Mullions({ d, cx, top, half }: { d: string; cx: number; top: number; half: number }) {
  const f = half / 196;
  const x = (dx: number) => cx + dx * f;
  return (
    <g fill="none" stroke="url(#silverStroke)" strokeLinecap="round">
      <path d={d} strokeWidth="5" strokeOpacity="0.85" />
      <path d={`M${cx} 700 L${cx} ${top}`} strokeWidth="2" strokeOpacity="0.55" />
      {/* leaf-vein branches */}
      <path
        d={`M${cx} 560 C${x(-40)} 520 ${x(-120)} 488 ${x(-190)} 470 M${cx} 560 C${x(40)} 520 ${x(120)} 488 ${x(190)} 470 M${cx} 420 C${x(-36)} 390 ${x(-100)} 360 ${x(-170)} 352 M${cx} 420 C${x(36)} 390 ${x(100)} 360 ${x(170)} 352`}
        strokeWidth="1.4"
        strokeOpacity="0.35"
      />
    </g>
  );
}

export default function StudioBack() {
  const leftTopX = VP.x - (VP.x - BW.l) * (VP.y / (VP.y - BW.t));
  const rightTopX = 1600 - leftTopX;
  const floorEdgeY = VP.y + (BW.b - VP.y) * (VP.x / (VP.x - BW.l));

  return (
    <svg className="layer-svg" viewBox="0 0 1600 1000" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="80" x2="0" y2="640" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0b1729" />
          <stop offset="0.45" stopColor="#1c3a57" />
          <stop offset="0.8" stopColor="#5fa7b0" />
          <stop offset="0.93" stopColor="#bde7df" />
          <stop offset="1" stopColor="#d7efe4" />
        </linearGradient>
        <radialGradient id="moonGlow">
          <stop offset="0" stopColor="#dff4f0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#dff4f0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="horizonMist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d4eee6" stopOpacity="0" />
          <stop offset="0.55" stopColor="#d4eee6" stopOpacity="0.32" />
          <stop offset="1" stopColor="#d4eee6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#070c18" />
          <stop offset="0.7" stopColor="#0f1b2f" />
          <stop offset="1" stopColor="#14233a" />
        </linearGradient>
        <linearGradient id="sideWallL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#04070e" />
          <stop offset="1" stopColor="#0c1629" />
        </linearGradient>
        <linearGradient id="sideWallR" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#04070e" />
          <stop offset="1" stopColor="#0c1629" />
        </linearGradient>
        <linearGradient id="floor" x1="0" y1="700" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#172840" />
          <stop offset="0.35" stopColor="#0e1a2c" />
          <stop offset="1" stopColor="#05080f" />
        </linearGradient>
        <linearGradient id="silverStroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6edf3" />
          <stop offset="1" stopColor="#7d8ea3" />
        </linearGradient>
        <linearGradient id="portalStroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9d6e2" stopOpacity="0.05" />
          <stop offset="0.6" stopColor="#c9d6e2" stopOpacity="0.32" />
          <stop offset="1" stopColor="#c9d6e2" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="lightPatch" x1="0" y1="700" x2="0" y2="900" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#bfe9e3" stopOpacity="0.34" />
          <stop offset="1" stopColor="#bfe9e3" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d8f1ec" stopOpacity="0" />
          <stop offset="0.3" stopColor="#d8f1ec" stopOpacity="0.14" />
          <stop offset="1" stopColor="#d8f1ec" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="reflFade" x1="0" y1="700" x2="0" y2="900" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="reflMask" maskUnits="userSpaceOnUse" x="0" y="700" width="1600" height="300">
          <rect x="0" y="700" width="1600" height="300" fill="url(#reflFade)" />
        </mask>
        <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <clipPath id="windowsClip">
          <path d={CENTER_WINDOW} />
          <path d={LEFT_WINDOW} />
          <path d={RIGHT_WINDOW} />
        </clipPath>
        <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fd3d6" stopOpacity="0" />
          <stop offset="0.5" stopColor="#9fd3d6" stopOpacity="0.1" />
          <stop offset="1" stopColor="#9fd3d6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ceiling + walls (over-drawn beyond the stage for parallax overscan) */}
      <rect x="-80" y="-80" width="1760" height="1160" fill="#05080f" />
      <polygon points={`${leftTopX},0 ${1600 - leftTopX},0 ${BW.r},${BW.t} ${BW.l},${BW.t}`} fill="#060a14" />
      <polygon
        points={`-80,-80 ${leftTopX},0 ${BW.l},${BW.t} ${BW.l},${BW.b} 0,${floorEdgeY} -80,${floorEdgeY + 30}`}
        fill="url(#sideWallL)"
      />
      <polygon
        points={`1680,-80 ${rightTopX},0 ${BW.r},${BW.t} ${BW.r},${BW.b} 1600,${floorEdgeY} 1680,${floorEdgeY + 30}`}
        fill="url(#sideWallR)"
      />
      <rect x={BW.l} y={BW.t} width={BW.r - BW.l} height={BW.b - BW.t} fill="url(#wall)" />

      {/* garden through the glass */}
      <g clipPath="url(#windowsClip)">
        <Garden />
      </g>
      <Mullions d={CENTER_WINDOW} cx={800} top={120} half={196} />
      <Mullions d={LEFT_WINDOW} cx={452} top={252} half={80} />
      <Mullions d={RIGHT_WINDOW} cx={1148} top={252} half={80} />

      {/* floor */}
      <polygon
        points={`-80,${floorEdgeY + 30} 0,${floorEdgeY} ${BW.l},${BW.b} ${BW.r},${BW.b} 1600,${floorEdgeY} 1680,${floorEdgeY + 30} 1680,1080 -80,1080`}
        fill="url(#floor)"
      />
      {/* floor seams converging to the vanishing point */}
      <g stroke="#9fb4c8" strokeOpacity="0.06" strokeWidth="1">
        {[-6, -4, -2.6, -1.5, -0.6, 0.6, 1.5, 2.6, 4, 6].map((t) => (
          <line key={t} x1={800 + t * 92} y1="700" x2={800 + t * 92 * 2.75} y2="1000" />
        ))}
        {[740, 800, 880].map((y) => (
          <line key={y} x1="-80" y1={y} x2="1680" y2={y} />
        ))}
      </g>

      {/* reflection of the windows on the polished floor */}
      <g mask="url(#reflMask)" opacity="0.55">
        <g transform="translate(0 1400) scale(1 -1)" clipPath="url(#windowsClip)">
          <Garden />
        </g>
      </g>

      {/* light pooling on the floor from the big window */}
      <polygon points="614,704 986,704 1180,820 420,820" fill="url(#lightPatch)" filter="url(#soft)" />

      {/* soft volumetric shafts */}
      <g className="anim-beams" filter="url(#soft)">
        <polygon points="660,230 760,200 960,860 640,860" fill="url(#beam)" />
        <polygon points="830,210 900,230 1120,860 960,860" fill="url(#beam)" opacity="0.7" />
        <polygon points="430,330 480,320 590,840 420,840" fill="url(#beam)" opacity="0.5" />
      </g>

      {/* organic portal frames receding into the room */}
      <g fill="none" stroke="url(#portalStroke)">
        {[1, 1.28, 1.7, 2.35].map((s, i) => (
          <path key={s} d={PORTAL} transform={around(s)} strokeWidth={3 - i * 0.4} />
        ))}
      </g>
      {/* skirting line */}
      <line x1={BW.l} y1={BW.b} x2={BW.r} y2={BW.b} stroke="#a9c1d4" strokeOpacity="0.18" />

      {/* drifting haze band */}
      <g className="anim-fog">
        <rect x="-200" y="560" width="2000" height="260" fill="url(#fog)" />
      </g>
    </svg>
  );
}
