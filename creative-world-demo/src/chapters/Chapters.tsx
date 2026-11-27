import { useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { chapterCopy as copy } from '../config/chapters';
import type { Project } from '../config/projects';
import { site } from '../config/site';
import ProjectPreview from '../components/ProjectPreview';
import { prefersReduced, range, useSectionMotion, useStickyProgress } from './motion';

/** Sticky chapters are shorter when motion is reduced (nothing to scrub through). */
const h = (vh: number) => (prefersReduced() ? '100vh' : `${vh}vh`);

const Draft = ({ tone = 'deep' }: { tone?: 'deep' | 'paper' }) => (
  <span className={`draft draft--${tone}`}>Draft copy</span>
);

/* Split text into word spans for scroll-driven reveal. */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span className="w" key={i}>
          {w}{' '}
        </span>
      ))}
    </>
  );
}

/* ---------------- 01 About ---------------- */

function About() {
  const ref = useRef<HTMLElement>(null);
  useSectionMotion(ref, (el) => {
    gsap.from(el.querySelectorAll('.title-line > span'), {
      yPercent: 110,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.12,
      scrollTrigger: { trigger: el, start: 'top 70%' },
    });
    gsap.fromTo(
      el.querySelectorAll('.statement .w'),
      { opacity: 0.14 },
      {
        opacity: 1,
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: { trigger: el.querySelector('.statement'), start: 'top 80%', end: 'bottom 45%', scrub: true },
      }
    );
    gsap.to(el.querySelector('.ring-text'), {
      rotate: 140,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  return (
    <section className="ch ch--paper ch--curtain about" data-chapter={copy.about.label} ref={ref} id="about">
      <svg className="ring-text" viewBox="0 0 300 300" aria-hidden="true">
        <defs>
          <path id="ringPath" d="M150 150 m-120 0 a120 120 0 1 1 240 0 a120 120 0 1 1 -240 0" />
        </defs>
        <circle cx="150" cy="150" r="100" fill="none" stroke="currentColor" strokeOpacity="0.25" />
        <text>
          <textPath href="#ringPath">
            {`${site.name.toUpperCase()} · CREATIVE WORLD · INTERACTION · VISUAL · TECHNOLOGY · `}
          </textPath>
        </text>
      </svg>
      <div className="ch-inner">
        <div className="ch-head">
          <span className="ch-num">{copy.about.number}</span>
          <span className="ch-label">{copy.about.label}</span>
          {copy.isDraft && <Draft tone="paper" />}
        </div>
        <h2 className="display">
          <span className="title-line"><span className="serif">{copy.about.titleA}</span></span>
          <span className="title-line"><span className="sans">{copy.about.titleB}</span></span>
        </h2>
        <p className="statement">
          <Words text={copy.about.statement} />
        </p>
      </div>
    </section>
  );
}

/* ---------------- 02 Process — a line drawn by scroll ---------------- */

const WAVE = (() => {
  // flat line with three bursts (one per step)
  let d = 'M0 100';
  const bursts = [250, 500, 750];
  for (let x = 0; x <= 1000; x += 5) {
    let y = 0;
    bursts.forEach((b) => {
      const dx = x - b;
      const env = Math.exp(-(dx * dx) / (2 * 26 * 26));
      y += Math.sin(dx / 6.5) * 70 * env;
    });
    d += ` L${x} ${(100 - y).toFixed(1)}`;
  }
  return d;
})();

function Process() {
  const ref = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const len = useRef(0);

  useStickyProgress(ref, (p) => {
    const path = pathRef.current;
    if (!path) return;
    if (!len.current) len.current = path.getTotalLength();
    const drawn = range(p, 0.08, 0.85);
    path.style.strokeDasharray = `${len.current}`;
    path.style.strokeDashoffset = `${len.current * (1 - drawn)}`;
    stepRefs.current.forEach((s, i) => {
      if (!s) return;
      const t = range(drawn, 0.2 + i * 0.27, 0.3 + i * 0.27);
      s.style.opacity = String(t);
      s.style.transform = `translateY(${(1 - t) * 24}px)`;
    });
  });

  return (
    <section className="ch ch--deep sticky-ch process" style={{ height: h(280) }} data-chapter={copy.process.label} ref={ref} id="process">
      <div className="sticky">
        <div className="ch-inner process-inner">
          <div className="ch-head">
            <span className="ch-num">{copy.process.number}</span>
            <span className="ch-label">{copy.process.label}</span>
            {copy.isDraft && <Draft />}
          </div>
          <h2 className="display display--right">
            <span className="serif">{copy.process.titleA}</span> <span className="sans">{copy.process.titleB}</span>
          </h2>
        </div>
        <svg className="wave" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true">
          <path d={WAVE} className="wave-ghost" />
          <path d={WAVE} ref={pathRef} className="wave-line" />
        </svg>
        <div className="steps">
          {copy.process.steps.map((s, i) => (
            <div className="step" key={s.k} ref={(el) => (stepRefs.current[i] = el)} style={{ left: `${25 + i * 25}%` }}>
              <span className="step-k">{s.k}</span>
              <span className="step-v">{s.v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 03 Archive — tunnel zoom ---------------- */

const RINGS = 16;
/** Zig-zag annulus; inner edge = outer / 1.35 so consecutive rings tile exactly. */
const ZIG = (() => {
  const n = 36;
  const ring = (scale: number) => {
    const pts: string[] = [];
    for (let i = 0; i < n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2;
      const r = (i % 2 ? 0.9 : 1) * scale * 100;
      pts.push(`${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`);
    }
    return `M${pts.join(' L')} Z`;
  };
  return `${ring(1)} ${ring(1 / 1.35)}`;
})();

function Archive({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLElement>(null);
  const ringRefs = useRef<(SVGPathElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  useStickyProgress(ref, (raw) => {
    const p = prefersReduced() ? 0.3 : raw;
    const travel = p * 5.5; // how many rings we fly through
    ringRefs.current.forEach((r, i) => {
      if (!r) return;
      // continuous zoom: each ring grows by ×1.35 per unit of travel, wrapping
      const k = (((i - travel) % RINGS) + RINGS) % RINGS;
      const s = Math.pow(1.35, RINGS - k) * 0.06;
      r.setAttribute('transform', `scale(${s.toFixed(4)}) rotate(${(i * 5 + p * 40).toFixed(2)})`);
      r.style.opacity = s > 40 ? '0' : '1';
    });
    cardRefs.current.forEach((c, i) => {
      if (!c) return;
      const n = Math.max(1, cardRefs.current.length);
      const t = range(p, 0.12 + (i / n) * 0.6, 0.42 + (i / n) * 0.6);
      const ang = (i / n) * Math.PI * 2 + 0.6;
      const dist = Math.pow(t, 2.2) * 60; // vw from centre
      const sc = 0.15 + Math.pow(t, 2.4) * 2.4;
      c.style.opacity = String(t <= 0 || t >= 1 ? 0 : Math.min(1, t * 4) * (1 - range(t, 0.8, 1)));
      c.style.transform = `translate(-50%,-50%) translate(${(Math.cos(ang) * dist).toFixed(2)}vw, ${(Math.sin(ang) * dist * 0.6).toFixed(2)}vh) scale(${sc.toFixed(3)})`;
    });
    if (labelRef.current) labelRef.current.style.opacity = String(1 - range(p, 0.55, 0.8));
    if (fadeRef.current) fadeRef.current.style.opacity = String(range(p, 0.82, 1));
  });

  // Draw rings largest → smallest so the small ones sit on top.
  const order = useMemo(() => Array.from({ length: RINGS }, (_, i) => i), []);

  return (
    <section className="ch ch--deep sticky-ch archive" data-tone="paper" style={{ height: h(320) }} data-chapter={copy.archive.label} ref={ref} id="archive">
      <div className="sticky">
        <svg className="tunnel" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect x="-600" y="-600" width="1200" height="1200" className="tunnel-bg" />
          {order.map((i) => (
            <path
              key={i}
              d={ZIG}
              fillRule="evenodd"
              ref={(el) => (ringRefs.current[i] = el)}
              className={i % 2 ? 'ring ring--a' : 'ring ring--b'}
            />
          ))}
        </svg>
        {projects.map((p, i) => (
          <div className="fly-card" key={p.id} ref={(el) => (cardRefs.current[i] = el)} aria-hidden="true">
            <ProjectPreview preview={p.preview} compact />
          </div>
        ))}
        <div className="tunnel-label" ref={labelRef}>
          <span className="ch-num ch-num--small">{copy.archive.number}</span>
          {copy.archive.line}
        </div>
        <div className="tunnel-fade" ref={fadeRef} />
      </div>
    </section>
  );
}

/* ---------------- Work chapters — one per project ---------------- */

function WorkChapter({
  project,
  index,
  total,
  onOpen,
}: {
  project: Project;
  index: number;
  total: number;
  onOpen: (id: string, trigger: HTMLElement) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const tone = index % 2 === 0 ? 'paper' : 'deep';

  useStickyProgress(ref, (p) => {
    const open = range(p, 0.05, 0.55);
    const e = 1 - Math.pow(1 - open, 3);
    if (frameRef.current) {
      frameRef.current.style.clipPath = `circle(${(10 + e * 62).toFixed(2)}% at 50% 50%)`;
    }
    if (innerRef.current) innerRef.current.style.transform = `scale(${(1.35 - e * 0.35).toFixed(3)})`;
    if (textRef.current) {
      const t = range(p, 0.3, 0.6);
      textRef.current.style.opacity = String(t);
      textRef.current.style.transform = `translateY(${((1 - t) * 40).toFixed(1)}px)`;
      textRef.current.style.pointerEvents = t > 0.5 ? 'auto' : 'none';
    }
  });

  const num = String(index + 1).padStart(2, '0');
  return (
    <section
      className={`ch ch--${tone} sticky-ch work-ch`}
      style={{ height: h(240) }}
      data-chapter={`Work ${num}`}
      ref={ref}
      id={`work-${project.id}`}
    >
      <div className="sticky">
        <div className="work-ch-top">
          <span className="ch-num">{num}</span>
          <span className="ch-label">
            Work — {num} / {String(total).padStart(2, '0')}
          </span>
        </div>
        <div className="work-frame" ref={frameRef}>
          <div className="work-frame-inner" ref={innerRef}>
            <ProjectPreview preview={project.preview} />
          </div>
        </div>
        <div className="work-text" ref={textRef}>
          <p className="work-cat-big">{project.category}</p>
          <h2 className="work-title-big">{project.title}</h2>
          <p className="work-summary">{project.summary}</p>
          <div className="work-actions">
            <button type="button" className="pill" onClick={(e) => onOpen(project.id, e.currentTarget)}>
              View project <span aria-hidden="true">→</span>
            </button>
            {project.isDemoContent && <span className="draft draft--solid">Demo content</span>}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Outro ---------------- */

function Outro({ onWork, onDoor }: { onWork: () => void; onDoor: () => void }) {
  const ref = useRef<HTMLElement>(null);
  useSectionMotion(ref, (el) => {
    gsap.from(el.querySelectorAll('.title-line > span'), {
      yPercent: 110,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.12,
      scrollTrigger: { trigger: el, start: 'top 65%' },
    });
    gsap.from(el.querySelector('.outro-keyhole'), {
      scale: 0.6,
      opacity: 0,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 60%' },
    });
  });
  return (
    <section className="ch ch--deep outro" data-chapter={copy.outro.label} ref={ref} id="outro">
      <svg className="outro-keyhole" viewBox="0 0 100 160" aria-hidden="true">
        <path d="M50 8 a32 32 0 0 1 14 60.8 L74 150 H26 L36 68.8 A32 32 0 0 1 50 8 Z" />
      </svg>
      <div className="ch-inner outro-inner">
        <h2 className="display display--center">
          <span className="title-line"><span className="serif">{copy.outro.titleA}</span></span>
          <span className="title-line"><span className="sans">{copy.outro.titleB}</span></span>
        </h2>
        <p className="outro-note">
          {copy.outro.note} {copy.isDraft && <Draft />}
        </p>
        <div className="outro-actions">
          <button type="button" className="pill pill--light" onClick={onWork}>
            View all work
          </button>
          <button type="button" className="pill pill--ghost" onClick={onDoor}>
            Return to the door
          </button>
        </div>
      </div>
      <footer className="foot">
        <span>© 2026 {site.name}</span>
        <span>Creative World — demo prototype</span>
      </footer>
    </section>
  );
}

/* ---------------- All chapters ---------------- */

export default function Chapters({
  projects,
  onOpen,
  onWork,
  onDoor,
}: {
  projects: Project[];
  onOpen: (id: string, trigger: HTMLElement) => void;
  onWork: () => void;
  onDoor: () => void;
}) {
  return (
    <div className="chapters">
      <About />
      <Process />
      <Archive projects={projects} />
      {projects.map((p, i) => (
        <WorkChapter key={p.id} project={p} index={i} total={projects.length} onOpen={onOpen} />
      ))}
      <Outro onWork={onWork} onDoor={onDoor} />
    </div>
  );
}
