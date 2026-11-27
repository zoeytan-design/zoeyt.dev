/**
 * Middle layer: the work desk, the seated figure (seen from behind — not a
 * portrait), the warm work lamp and an indoor plant. Animated parts carry
 * anim-* classes; all motion is subtle and disabled for reduced motion.
 */

const LEAVES: [number, number, number, number][] = [
  // [x, y, rotation, scale]
  [1112, 600, -30, 1], [1134, 588, 20, 0.9], [1100, 628, -50, 0.9], [1146, 620, 34, 1],
  [1090, 566, -14, 0.8], [1156, 560, 44, 0.85], [1124, 548, -4, 0.8], [1170, 596, 60, 0.9],
  [1078, 600, -60, 0.8], [1140, 650, 26, 0.95], [1096, 664, -36, 0.9], [1162, 676, 40, 0.85],
  [1118, 520, 10, 0.7], [1188, 640, 70, 0.8], [1070, 640, -70, 0.75], [1128, 700, 18, 0.9],
];

export default function StudioMid() {
  return (
    <svg className="layer-svg" viewBox="0 0 1600 1000" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id="lampGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffcf8f" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#ffb46a" stopOpacity="0.18" />
          <stop offset="1" stopColor="#ffb46a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="screenGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#9fe7ee" stopOpacity="0.35" />
          <stop offset="1" stopColor="#9fe7ee" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="screenFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bdf0f2" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#5fb5c4" stopOpacity="0.55" />
          <stop offset="1" stopColor="#2c6a7c" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="deskTop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a3027" />
          <stop offset="0.35" stopColor="#1f2433" />
          <stop offset="1" stopColor="#16202f" />
        </linearGradient>
        <linearGradient id="figure" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3b2b22" />
          <stop offset="0.12" stopColor="#120f12" />
          <stop offset="0.7" stopColor="#0a0e16" />
          <stop offset="1" stopColor="#1d3d47" />
        </linearGradient>
        <linearGradient id="chair" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2a2420" />
          <stop offset="0.3" stopColor="#11141b" />
          <stop offset="1" stopColor="#1a2b36" />
        </linearGradient>
        <linearGradient id="pot" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1b222c" />
          <stop offset="0.5" stopColor="#5b6774" />
          <stop offset="1" stopColor="#141922" />
        </linearGradient>
        <radialGradient id="floorShadow">
          <stop offset="0" stopColor="#000" stopOpacity="0.6" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rug">
          <stop offset="0" stopColor="#24344d" stopOpacity="0.7" />
          <stop offset="1" stopColor="#24344d" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* rug + shadows */}
      <ellipse cx="842" cy="852" rx="300" ry="44" fill="url(#rug)" />
      <ellipse cx="842" cy="846" rx="210" ry="22" fill="url(#floorShadow)" />

      {/* planter with a slender tree (nature inside the architecture) */}
      <g>
        <ellipse cx="1124" cy="806" rx="70" ry="12" fill="url(#floorShadow)" />
        <path d="M1086 742 L1162 742 L1152 802 Q1124 812 1096 802 Z" fill="url(#pot)" />
        <ellipse cx="1124" cy="742" rx="38" ry="6" fill="#0c1016" />
        <g className="anim-sway" style={{ transformOrigin: '1124px 742px' }}>
          <path
            d="M1124 742 C1122 700 1118 660 1122 610 C1124 580 1118 560 1120 530 M1122 660 C1136 640 1150 620 1166 602 M1121 630 C1106 612 1094 596 1084 580"
            fill="none"
            stroke="#2a3a33"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {LEAVES.map(([x, y, r, s], i) => (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx={14 * s}
              ry={5 * s}
              transform={`rotate(${r} ${x} ${y})`}
              fill={i % 3 === 0 ? '#3c6b5e' : i % 3 === 1 ? '#24493f' : '#2f5a4c'}
              opacity="0.95"
            />
          ))}
        </g>
      </g>

      {/* warm lamp glow (behind everything on the desk) */}
      <circle className="anim-lamp" cx="760" cy="610" r="230" fill="url(#lampGlow)" />
      {/* screen glow */}
      <ellipse cx="856" cy="672" rx="190" ry="120" fill="url(#screenGlow)" />

      {/* desk */}
      <g>
        <g stroke="#8d9aab" strokeWidth="3" strokeLinecap="round" opacity="0.8">
          <line x1="700" y1="716" x2="700" y2="830" />
          <line x1="980" y1="716" x2="980" y2="830" />
        </g>
        <polygon points="688,710 992,710 1011,725 669,725" fill="url(#deskTop)" />
        <polygon points="669,725 1011,725 1011,733 669,733" fill="#0b0f17" />
        <line x1="669" y1="725" x2="1011" y2="725" stroke="#d8e2ec" strokeOpacity="0.45" strokeWidth="1.2" />
        <g stroke="#a9b6c6" strokeWidth="3.5" strokeLinecap="round">
          <line x1="682" y1="733" x2="682" y2="860" />
          <line x1="998" y1="733" x2="998" y2="860" />
        </g>
        {/* warm pool of light on the desk */}
        <ellipse className="anim-lamp" cx="756" cy="718" rx="72" ry="6" fill="#ffc98a" opacity="0.55" />
        {/* sketchbook + pencil */}
        <polygon points="716,716 764,716 770,722 712,722" fill="#d9d1c4" opacity="0.85" />
        <line x1="772" y1="719" x2="796" y2="716" stroke="#c48b52" strokeWidth="1.6" />
        {/* small plant on the desk */}
        <rect x="964" y="700" width="16" height="13" rx="2" fill="#56626f" />
        <g className="anim-sway-small" style={{ transformOrigin: '972px 700px' }}>
          <path d="M972 700 C968 688 960 682 952 680 M972 700 C974 686 982 678 992 676 M972 700 C972 688 970 676 972 668" stroke="#3c6b5e" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <ellipse cx="952" cy="680" rx="7" ry="3" fill="#3c6b5e" transform="rotate(20 952 680)" />
          <ellipse cx="992" cy="676" rx="7" ry="3" fill="#2f5a4c" transform="rotate(-20 992 676)" />
          <ellipse cx="972" cy="667" rx="3" ry="6" fill="#3c6b5e" />
        </g>
      </g>

      {/* glass display on the desk */}
      <g>
        <rect x="852" y="704" width="10" height="7" fill="#6d7b8b" />
        <rect x="770" y="636" width="172" height="70" rx="3" fill="url(#screenFace)" />
        <rect x="770" y="636" width="172" height="70" rx="3" fill="none" stroke="#e8f8f8" strokeOpacity="0.6" />
        <g className="anim-screen" opacity="0.7">
          <rect x="782" y="648" width="64" height="44" rx="2" fill="#eafcfb" opacity="0.35" />
          <path d="M858 690 C878 660 896 676 912 652 C920 642 928 646 932 640" stroke="#f2fffe" strokeWidth="1.5" fill="none" />
          <circle cx="896" cy="664" r="6" fill="none" stroke="#f2fffe" strokeWidth="1" />
        </g>
      </g>

      {/* work lamp */}
      <g>
        <ellipse cx="708" cy="722" rx="14" ry="3" fill="#8f99a6" />
        <path d="M708 720 C704 680 700 640 712 604 C724 578 748 574 766 584" stroke="#b7c2cf" strokeWidth="2.4" fill="none" />
        <path d="M754 584 Q766 570 780 584 L784 596 L750 596 Z" fill="#c9d3dd" />
        <ellipse className="anim-lamp" cx="767" cy="596" rx="16" ry="3" fill="#fff1d4" />
      </g>

      {/* the figure — seated, seen from behind, resting a hand near the display */}
      <g className="anim-breathe">
        {/* arms reaching to the desk */}
        <path d="M800 696 C784 716 774 740 776 752 C778 744 786 732 800 726 Z" fill="url(#figure)" />
        <path d="M872 694 C890 712 900 726 904 724 C906 716 900 706 890 700 Z" fill="url(#figure)" />
        {/* torso & shoulders */}
        <path
          d="M794 712 C796 690 812 680 828 677 L844 677 C860 680 876 690 878 712 L882 770 L790 770 Z"
          fill="url(#figure)"
        />
        {/* neck & head */}
        <rect x="829" y="660" width="14" height="20" rx="5" fill="#0d1018" />
        <ellipse cx="836" cy="650" rx="17" ry="20" fill="url(#figure)" />
        {/* hair, tied up */}
        <path d="M819 648 C818 630 828 624 836 624 C846 624 854 632 853 648 C848 640 826 640 819 648 Z" fill="#06080d" />
        <circle cx="836" cy="625" r="8.5" fill="#06080d" />
        {/* rim lights: warm lamp on the left, cool display on the right */}
        <path d="M820 640 C818 652 822 664 828 668" stroke="#ffbf7a" strokeOpacity="0.5" strokeWidth="1.3" fill="none" />
        <path d="M797 708 C798 694 808 684 822 680" stroke="#ffbf7a" strokeOpacity="0.4" strokeWidth="1.3" fill="none" />
        <path d="M852 640 C854 652 850 664 844 668" stroke="#a9e4ea" strokeOpacity="0.55" strokeWidth="1.3" fill="none" />
        <path d="M874 704 C872 692 864 684 852 680" stroke="#a9e4ea" strokeOpacity="0.45" strokeWidth="1.3" fill="none" />
      </g>

      {/* chair — the nearest element of the group */}
      <g>
        <rect x="832" y="806" width="7" height="58" fill="#55606d" />
        <ellipse cx="836" cy="868" rx="46" ry="6" fill="#2a313b" />
        <path
          d="M786 770 C786 736 806 724 836 722 C866 724 886 736 886 770 L882 812 C860 822 812 822 790 812 Z"
          fill="url(#chair)"
        />
        <path d="M790 744 C800 730 816 726 836 725" stroke="#ffbf7a" strokeOpacity="0.3" strokeWidth="1.2" fill="none" />
        <path d="M882 744 C874 732 858 726 840 725" stroke="#a9e4ea" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />
      </g>
    </svg>
  );
}
