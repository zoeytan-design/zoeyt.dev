import { useEffect, useRef } from 'react';
import StudioBack from '../scene/StudioBack';
import StudioMid from '../scene/StudioMid';
import StudioFront from '../scene/StudioFront';
import Exhibits from './Exhibits';
import { site } from '../config/site';
import type { Project } from '../config/projects';
import type { StageBox } from '../scene/geometry';

export interface LayerRefs {
  stage: React.RefObject<HTMLDivElement>;
  back: React.RefObject<HTMLDivElement>;
  mid: React.RefObject<HTMLDivElement>;
  front: React.RefObject<HTMLDivElement>;
}

interface Props {
  refs: LayerRefs;
  box: StageBox;
  projects: Project[];
  showExhibits: boolean;
  interactive: boolean;
  parallax: boolean;
  onOpen: (id: string, trigger: HTMLElement) => void;
}

const DEPTH = { back: 0.25, mid: 0.6, front: 1 };

/**
 * The single studio scene. The same instance is seen through the keyhole and
 * after arrival, so perspective, colour and the figure never jump.
 * Outer layer wrappers receive the camera-push scale; inner wrappers the parallax.
 */
export default function Studio({ refs, box, projects, showExhibits, interactive, parallax, onOpen }: Props) {
  const inner = {
    back: useRef<HTMLDivElement>(null),
    mid: useRef<HTMLDivElement>(null),
    front: useRef<HTMLDivElement>(null),
  };

  // Cursor parallax — small, eased, and only for fine pointers.
  useEffect(() => {
    const layers = [inner.back.current, inner.mid.current, inner.front.current];
    if (!parallax) {
      layers.forEach((l) => l && (l.style.transform = ''));
      return;
    }
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      const depths = [DEPTH.back, DEPTH.mid, DEPTH.front];
      layers.forEach((l, i) => {
        if (l) l.style.transform = `translate3d(${(-cx * depths[i]).toFixed(2)}px, ${(-cy * depths[i] * 0.6).toFixed(2)}px, 0)`;
      });
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      tx = ((e.clientX / window.innerWidth) * 2 - 1) * site.parallaxMax;
      ty = ((e.clientY / window.innerHeight) * 2 - 1) * site.parallaxMax;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parallax]);

  const stageStyle: React.CSSProperties = {
    width: box.width,
    height: box.height,
    left: box.left,
    top: box.top,
  };

  return (
    <div className="studio" aria-label="Zoey's studio">
      <div className="stage" ref={refs.stage} style={stageStyle}>
        <div className="layer" ref={refs.back}>
          <div className="layer-inner" ref={inner.back}>
            <StudioBack />
          </div>
        </div>
        <div className="layer" ref={refs.mid}>
          <div className="layer-inner" ref={inner.mid}>
            <StudioMid />
            {showExhibits && (
              <Exhibits projects={projects} k={box.k} interactive={interactive} onOpen={onOpen} />
            )}
          </div>
        </div>
        <div className="layer layer--front" ref={refs.front}>
          <div className="layer-inner" ref={inner.front}>
            <StudioFront />
          </div>
        </div>
      </div>
    </div>
  );
}
