/**
 * Background music manager (no sound effects).
 * - Off by default; starts only after the visitor presses Sound.
 * - Two looping tracks crossfaded by the keyhole progress (equal-power).
 * - Studio track ducks while a case panel is open.
 * - Missing / undecodable files → state "unavailable" (never claims to play silence).
 */
import { site } from '../config/site';

export type AudioStatus = 'off' | 'loading' | 'on' | 'unavailable';

interface Snapshot {
  status: AudioStatus;
  missing: string[];
}

type TrackName = 'entrance' | 'studio';

class AudioManager {
  private snap: Snapshot = { status: 'off', missing: [] };
  private listeners = new Set<() => void>();
  private els: Partial<Record<TrackName, HTMLAudioElement>> = {};
  private failed = new Set<TrackName>();
  private mix = 0; // 0 = entrance, 1 = studio
  private ducked = false;
  private preflightDone: Promise<void> | null = null;

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };
  getSnapshot = () => this.snap;

  private set(status: AudioStatus) {
    this.snap = { status, missing: [...this.failed] };
    this.listeners.forEach((l) => l());
  }

  /** Cheap check on load so the UI can say "unavailable" before anyone clicks. */
  preflight() {
    if (this.preflightDone) return this.preflightDone;
    const check = async (name: TrackName, url: string) => {
      try {
        const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
        const type = res.headers.get('content-type') || '';
        if (!res.ok || !type.startsWith('audio')) this.failed.add(name);
      } catch {
        this.failed.add(name);
      }
    };
    this.preflightDone = Promise.all([
      check('entrance', site.audio.entrance),
      check('studio', site.audio.studio),
    ]).then(() => {
      if (this.failed.size) this.set('unavailable');
    });
    return this.preflightDone;
  }

  private ensureEls() {
    (['entrance', 'studio'] as TrackName[]).forEach((name) => {
      if (this.els[name] || this.failed.has(name)) return;
      const el = new Audio();
      el.src = name === 'entrance' ? site.audio.entrance : site.audio.studio;
      el.loop = true;
      el.preload = 'auto';
      el.volume = 0;
      el.addEventListener('error', () => this.fail(name));
      this.els[name] = el;
    });
  }

  private fail(name: TrackName) {
    this.failed.add(name);
    this.stopAll();
    this.set('unavailable');
  }

  private stopAll() {
    Object.values(this.els).forEach((el) => el && el.pause());
  }

  async toggle() {
    if (this.snap.status === 'on' || this.snap.status === 'loading') {
      this.stopAll();
      this.set(this.failed.size ? 'unavailable' : 'off');
      return;
    }
    if (this.failed.size) {
      // Re-announce so the UI can show why.
      this.set('unavailable');
      return;
    }
    this.set('loading');
    this.ensureEls();
    this.applyVolumes();
    try {
      await Promise.all(Object.values(this.els).map((el) => el!.play()));
      if (this.failed.size) return;
      this.set('on');
    } catch {
      // Autoplay refusal or decode failure: report honestly.
      this.stopAll();
      if (!this.failed.size) this.failed.add('entrance');
      this.set('unavailable');
    }
  }

  setMix(p: number) {
    this.mix = Math.min(1, Math.max(0, p));
    this.applyVolumes();
  }

  setDucked(d: boolean) {
    this.ducked = d;
    this.applyVolumes();
  }

  private applyVolumes() {
    const master = site.audio.volume;
    const a = Math.cos((this.mix * Math.PI) / 2);
    const b = Math.sin((this.mix * Math.PI) / 2) * (this.ducked ? site.audio.duckFactor : 1);
    if (this.els.entrance) this.els.entrance.volume = master * a;
    if (this.els.studio) this.els.studio.volume = master * b;
  }

  /** Pause while the tab is hidden; resume if it was on. */
  setPageVisible(visible: boolean) {
    if (this.snap.status !== 'on') return;
    Object.values(this.els).forEach((el) => {
      if (!el) return;
      if (visible) el.play().catch(() => undefined);
      else el.pause();
    });
  }
}

export const audio = new AudioManager();
