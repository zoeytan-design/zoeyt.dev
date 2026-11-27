/**
 * Shared scene geometry. The studio is drawn in a fixed 1600×1000 "stage"
 * coordinate system that is scaled to cover the viewport (like object-fit: cover).
 * The keyhole, the camera push and the exhibits all use the same mapping,
 * which is what keeps the view through the keyhole identical to the room.
 */

export const STAGE_W = 1600;
export const STAGE_H = 1000;

/** Perspective vanishing point ≈ camera eye height. */
export const VP = { x: 800, y: 590 };

/** Pixels per metre at a given floor y (camera eye ≈ 1.5 m). */
export const metreAt = (floorY: number) => (floorY - VP.y) / 1.5;

/** How much of the vertical overflow is cropped from the top (keeps the floor in view). */
const TOP_CROP_BIAS = 0.65;

export interface StageBox {
  vw: number;
  vh: number;
  k: number; // stage px per stage unit
  left: number;
  top: number;
  width: number;
  height: number;
}

export function computeStage(vw: number, vh: number): StageBox {
  const k = Math.max(vw / STAGE_W, vh / STAGE_H);
  const width = STAGE_W * k;
  const height = STAGE_H * k;
  const left = (vw - width) / 2;
  const top = (vh - height) * TOP_CROP_BIAS;
  return { vw, vh, k, left, top, width, height };
}

/**
 * Exhibit "slots" on the studio floor, in stage units, in order of priority.
 * Projects are assigned to slots in the configured order; the animation
 * never assumes how many there are.
 */
export const EXHIBIT_SLOTS: { x: number; floorY: number }[] = [
  { x: 300, floorY: 872 },
  { x: 1262, floorY: 858 },
  { x: 548, floorY: 752 },
  { x: 1478, floorY: 742 },
  { x: 180, floorY: 800 },
  { x: 1046, floorY: 920 },
];

/**
 * Keyhole — large and close to the lens (soft, out-of-focus rim), after the
 * reference: round head in the upper third, flared slot down to near the bottom.
 */
export interface Keyhole {
  cx: number;
  cy: number;
  u: number;
  r: number;
  a: number; // neck half-width
  b: number; // bottom half-width
  h: number; // slot bottom, measured from circle centre
  blur: number;
}

export function computeKeyhole(vw: number, vh: number): Keyhole {
  const portrait = vh > vw * 1.05;
  const u = portrait ? Math.min(vh * 0.85, vw * 1.4) : Math.min(vh, vw * 0.9);
  const r = 0.25 * u;
  const h = 0.6 * u;
  const cy = portrait ? vh * 0.33 : Math.min(vh * 0.33, vh - h - vh * 0.06);
  return { cx: vw / 2, cy, u, r, a: 0.085 * u, b: 0.17 * u, h, blur: Math.max(8, 0.035 * u) };
}

/** Keyhole outline centred on its circle centre (0,0). */
export function keyholePath(k: Keyhole) {
  const { r, a, b, h } = k;
  const yj = Math.sqrt(r * r - a * a);
  const c = 0.04 * k.u;
  return `M ${-a} ${yj} A ${r} ${r} 0 1 1 ${a} ${yj} C ${a + 0.01 * k.u} ${yj + 0.12 * k.u} ${b} ${h - 0.2 * k.u} ${b} ${h - c} Q ${b} ${h} ${b - c} ${h} L ${-b + c} ${h} Q ${-b} ${h} ${-b} ${h - c} C ${-b} ${h - 0.2 * k.u} ${-a - 0.01 * k.u} ${yj + 0.12 * k.u} ${-a} ${yj} Z`;
}

/** Plate scale at which the hole fully covers the viewport. */
export function keyholeMaxScale(k: Keyhole, vw: number, vh: number) {
  const dx = Math.max(k.cx, vw - k.cx);
  const dy = Math.max(k.cy, vh - k.cy);
  return (Math.hypot(dx, dy) + k.blur * 3) / k.r * 1.08;
}
