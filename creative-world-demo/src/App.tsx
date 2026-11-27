import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Studio from './components/Studio';
import LockPlate, { Key } from './components/LockPlate';
import { EntranceUI, Nav, StudioUI, type Phase } from './components/Overlays';
import { AboutPanel, CasePanel, WorkPanel } from './components/Panels';
import { getSelectedProjects, site } from './config/site';
import { computeKeyhole, computeStage, keyholeMaxScale } from './scene/geometry';
import { useInert, useMediaQuery, useViewport } from './hooks/useEnvironment';
import { audio } from './audio/AudioManager';

gsap.registerPlugin(ScrollTrigger);

type Zone = 'door' | 'between' | 'studio';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

const DIM_LOCKED = 0.5;
const DIM_OPEN = 0.1;

function hasEnteredBefore() {
  try {
    return localStorage.getItem(site.rememberEntryKey) === '1';
  } catch {
    return false;
  }
}

export default function App() {
  const projects = useMemo(getSelectedProjects, []);
  const { w: vw, h: vh } = useViewport();
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const compact = useMediaQuery('(max-width: 820px), (orientation: portrait) and (max-width: 1100px)');

  const box = useMemo(() => computeStage(vw, vh), [vw, vh]);
  const keyhole = useMemo(() => computeKeyhole(vw, vh), [vw, vh]);

  const [returning] = useState(hasEnteredBefore);
  const [phase, setPhase] = useState<Phase>(returning ? 'unlocked' : 'locked');
  const [zone, setZone] = useState<Zone>('door');
  const [panel, setPanel] = useState<null | 'work' | 'about'>(null);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [caseReturn, setCaseReturn] = useState<HTMLElement | null>(null);

  // DOM refs
  const layerRefs = {
    stage: useRef<HTMLDivElement>(null),
    back: useRef<HTMLDivElement>(null),
    mid: useRef<HTMLDivElement>(null),
    front: useRef<HTMLDivElement>(null),
  };
  const plateRef = useRef<HTMLDivElement>(null);
  const keyRef = useRef<SVGSVGElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const entranceRef = useRef<HTMLDivElement>(null);
  const studioUiRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const workBtnRef = useRef<HTMLButtonElement>(null);
  const keyTl = useRef<gsap.core.Timeline | null>(null);

  // Animated values live outside React state — no re-render per frame.
  const anim = useRef({ p: 0, dim: returning ? DIM_OPEN : DIM_LOCKED });
  const geo = useRef({ box, keyhole, reduced, smax: keyholeMaxScale(keyhole, vw, vh) });
  geo.current = { box, keyhole, reduced, smax: keyholeMaxScale(keyhole, vw, vh) };
  const zoneRef = useRef<Zone>('door');

  /** Maps scroll progress (0 = at the door, 1 = in the studio) to the scene. */
  const render = useCallback(() => {
    const { p, dim } = anim.current;
    const { box: b, keyhole: k, reduced: rm, smax } = geo.current;
    const plate = plateRef.current;
    const layers = [layerRefs.back.current, layerRefs.mid.current, layerRefs.front.current];
    const origin = `${(k.cx - b.left).toFixed(1)}px ${(k.cy - b.top).toFixed(1)}px`;

    if (plate) {
      if (rm) {
        plate.style.transform = 'none';
        plate.style.opacity = String(1 - clamp01(p / 0.5));
      } else {
        const s = Math.pow(smax, Math.pow(p, 1.1));
        plate.style.transform = `scale(${s.toFixed(4)})`;
        plate.style.opacity = String(1 - clamp01((p - 0.82) / 0.14));
      }
      plate.style.visibility = p >= 0.995 ? 'hidden' : 'visible';
    }

    const e = smooth(clamp01(p));
    const starts = [0.86, 0.83, 0.76];
    layers.forEach((l, i) => {
      if (!l) return;
      l.style.transformOrigin = origin;
      l.style.transform = rm ? 'none' : `scale(${lerp(starts[i], 1, e).toFixed(4)})`;
    });

    if (dimRef.current) dimRef.current.style.opacity = String(dim * (1 - clamp01(p / 0.7)));
    if (entranceRef.current) entranceRef.current.style.opacity = String(1 - clamp01(p / 0.14));
    if (studioUiRef.current) studioUiRef.current.style.opacity = String(clamp01((p - 0.8) / 0.17));

    audio.setMix(p);

    const z: Zone = p < 0.1 ? 'door' : p > 0.96 ? 'studio' : 'between';
    if (z !== zoneRef.current) {
      zoneRef.current = z;
      setZone(z);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll lock while the door is still locked.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('scroll-locked', phase !== 'unlocked');
  }, [phase]);

  // Scroll → progress. Smoothed with a short tween (no smoothing for reduced motion).
  useLayoutEffect(() => {
    const spacer = spacerRef.current;
    if (!spacer) return;
    if (returning && anim.current.p === 0 && zoneRef.current === 'door') {
      document.documentElement.classList.remove('scroll-locked');
      window.scrollTo(0, document.documentElement.scrollHeight);
    }
    const st = ScrollTrigger.create({
      trigger: spacer,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate(self) {
        if (geo.current.reduced) {
          anim.current.p = self.progress;
          render();
        } else {
          gsap.to(anim.current, { p: self.progress, duration: 0.9, ease: 'power3.out', overwrite: 'auto', onUpdate: render });
        }
      },
    });
    anim.current.p = st.progress;
    render();
    return () => st.kill();
  }, [render, returning, vh, reduced]);

  // Re-apply after resize / geometry changes.
  useEffect(() => {
    ScrollTrigger.refresh();
    render();
  }, [box, keyhole, render]);

  // Remember arrival; pause ambient motion when hidden.
  useEffect(() => {
    if (zone === 'studio') {
      try {
        localStorage.setItem(site.rememberEntryKey, '1');
      } catch {
        /* storage unavailable — fine */
      }
    }
  }, [zone]);

  useEffect(() => {
    audio.preflight();
    const onVis = () => {
      const hidden = document.hidden;
      document.documentElement.classList.toggle('is-hidden', hidden);
      audio.setPageVisible(!hidden);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const anyDialog = panel !== null || caseId !== null;
  useEffect(() => {
    document.documentElement.classList.toggle('is-calm', anyDialog);
    audio.setDucked(caseId !== null);
  }, [anyDialog, caseId]);

  useInert(experienceRef, anyDialog);
  useInert(entranceRef, zone !== 'door');
  useInert(studioUiRef, zone !== 'studio');

  /* ---------- actions ---------- */

  const finishUnlock = useCallback(() => {
    keyTl.current?.kill();
    if (keyRef.current) gsap.set(keyRef.current, { opacity: 0 });
    anim.current.dim = DIM_OPEN;
    render();
    document.documentElement.classList.remove('scroll-locked');
    setPhase('unlocked');
  }, [render]);

  const onEnter = useCallback(() => {
    if (phase !== 'locked') return;
    const key = keyRef.current;
    if (reduced || !key) {
      finishUnlock();
      return;
    }
    setPhase('unlocking');
    const tl = gsap.timeline({ onComplete: finishUnlock });
    tl.set(key, { opacity: 0, scale: 1.6, rotation: 0, filter: 'blur(10px)', transformOrigin: '50% 50%' })
      .to(key, { opacity: 1, scale: 1, filter: 'blur(0.3px)', duration: 0.9, ease: 'power3.out' })
      .to(key, { rotation: 90, duration: 0.75, ease: 'power2.inOut' }, '+=0.15')
      .to(anim.current, { dim: DIM_OPEN, duration: 1.1, ease: 'power2.out', onUpdate: render }, '-=0.15')
      .to(key, { opacity: 0, scale: 1.25, filter: 'blur(12px)', duration: 0.6, ease: 'power2.in' }, '<0.1');
    keyTl.current = tl;
  }, [phase, reduced, finishUnlock, render]);

  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

  const goToStudio = useCallback(
    (instant = false) => {
      if (phase !== 'unlocked') finishUnlock();
      window.scrollTo({ top: maxScroll(), behavior: instant || reduced ? 'auto' : 'smooth' });
    },
    [phase, finishUnlock, reduced]
  );

  const backToDoor = useCallback(() => {
    setPanel(null);
    setCaseId(null);
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }, [reduced]);

  const openCase = useCallback((id: string, trigger: HTMLElement) => {
    // When opened from the Work list the row disappears, so return focus to the Work button.
    const fromList = Boolean(trigger.closest('.dialog'));
    setCaseReturn(fromList ? workBtnRef.current : trigger);
    setPanel(null);
    setCaseId(id);
  }, []);

  const caseProject = projects.find((p) => p.id === caseId) ?? null;

  return (
    <div className={`app phase-${phase} zone-${zone}${reduced ? ' is-reduced' : ''}`}>
      <a className="skip-link" href="#work" onClick={(e) => { e.preventDefault(); goToStudio(true); setPanel('work'); }}>
        Skip to work
      </a>

      <div className="experience" ref={experienceRef}>
        <div className="viewport">
          <Studio
            refs={layerRefs}
            box={box}
            projects={projects}
            showExhibits={!compact}
            interactive={zone === 'studio' && !anyDialog}
            parallax={finePointer && !reduced && zone === 'studio' && !anyDialog}
            onOpen={openCase}
          />
          <div className="dimmer" ref={dimRef} />
          <LockPlate ref={plateRef} keyhole={keyhole} vw={vw} vh={vh} />
          <div className="key-layer" aria-hidden="true">
            <Key ref={keyRef} keyhole={keyhole} />
          </div>
          <StudioUI ref={studioUiRef} projects={projects} showStrip={compact} onOpen={openCase} />
          <EntranceUI
            ref={entranceRef}
            phase={phase}
            keyhole={keyhole}
            onEnter={onEnter}
            onScrollIn={() => goToStudio()}
            onViewWork={() => {
              goToStudio(true);
              setPanel('work');
            }}
            onSkip={() => goToStudio()}
          />
          <div className="grain" aria-hidden="true" />
        </div>
        <div className="spacer" ref={spacerRef} style={{ height: vh * (1 + site.travelViewports) }} />
      </div>

      <Nav
        arrived={zone === 'studio'}
        onWork={() => setPanel('work')}
        onAbout={() => setPanel('about')}
        onDoor={backToDoor}
        workBtnRef={workBtnRef}
      />
      <p className="demo-flag" aria-hidden="true">Prototype · placeholder visuals</p>

      <WorkPanel open={panel === 'work'} projects={projects} onClose={() => setPanel(null)} onSelect={openCase} />
      <AboutPanel open={panel === 'about'} onClose={() => setPanel(null)} onBackToDoor={backToDoor} />
      <CasePanel project={caseProject} onClose={() => setCaseId(null)} returnFocus={caseReturn} />
    </div>
  );
}
