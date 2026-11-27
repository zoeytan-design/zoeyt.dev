/**
 * Nearest layer: out-of-focus foliage framing the bottom corners and a
 * soft vignette. Moves the most with parallax and the camera push.
 */
export default function StudioFront() {
  return (
    <svg className="layer-svg layer-front" viewBox="0 0 1600 1000" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id="vignette" cx="0.5" cy="0.52" r="0.75">
          <stop offset="0.55" stopColor="#03050a" stopOpacity="0" />
          <stop offset="1" stopColor="#03050a" stopOpacity="0.85" />
        </radialGradient>
        <linearGradient id="leafFg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1f3f38" />
          <stop offset="1" stopColor="#060c0c" />
        </linearGradient>
      </defs>

      {/* foreground foliage, bottom-left */}
      <g className="anim-sway-fg" style={{ transformOrigin: '-40px 1040px' }} fill="url(#leafFg)">
        <path d="M-60 1060 C40 960 120 900 260 880 C200 930 120 990 40 1070 Z" />
        <path d="M-60 1060 C-20 940 20 860 120 790 C110 880 70 960 10 1070 Z" opacity="0.92" />
        <path d="M-40 1070 C80 1010 180 990 320 1000 C230 1030 120 1060 20 1090 Z" opacity="0.85" />
        <path d="M-60 980 C-30 900 -10 820 30 760 C40 840 20 920 -20 1000 Z" opacity="0.8" />
      </g>
      <g fill="none" stroke="#5c8f7f" strokeOpacity="0.25" strokeWidth="1.4">
        <path d="M0 1050 C80 970 160 920 240 890" />
        <path d="M-20 1050 C10 950 50 870 110 806" />
      </g>

      {/* foreground foliage, bottom-right */}
      <g className="anim-sway-fg-r" style={{ transformOrigin: '1660px 1040px' }} fill="url(#leafFg)">
        <path d="M1660 1060 C1580 990 1500 950 1380 944 C1440 990 1520 1030 1600 1080 Z" />
        <path d="M1660 1040 C1640 950 1600 880 1520 830 C1530 910 1560 980 1610 1060 Z" opacity="0.9" />
      </g>

      {/* near architectural rib, left edge */}
      <path d="M-30 -20 C40 200 60 520 52 1040 L-40 1040 Z" fill="#05080e" opacity="0.92" />
      <path d="M40 -20 C100 220 118 520 110 1040" stroke="#c9d6e2" strokeOpacity="0.12" strokeWidth="2" fill="none" />

      <rect x="-100" y="-100" width="1800" height="1200" fill="url(#vignette)" />
    </svg>
  );
}
