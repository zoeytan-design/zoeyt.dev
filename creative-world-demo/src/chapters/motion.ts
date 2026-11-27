import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Runs a GSAP setup scoped to a section; reverted on unmount.
 * Skipped entirely for reduced motion (content stays in its final state).
 */
export function useSectionMotion(
  ref: React.RefObject<HTMLElement>,
  setup: (el: HTMLElement) => void,
  deps: unknown[] = []
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const ctx = gsap.context(() => setup(el), el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Progress (0..1) of a tall sticky section, delivered every scroll frame. */
export function useStickyProgress(
  ref: React.RefObject<HTMLElement>,
  onProgress: (p: number) => void,
  deps: unknown[] = []
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) {
      onProgress(1);
      return;
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (s) => onProgress(s.progress),
    });
    onProgress(st.progress);
    return () => st.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
