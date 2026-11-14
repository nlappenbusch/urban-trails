"use client";
/**
 * Kulisse unter der Sprecherstimme – live im Browser erzeugt (Web Audio),
 * ohne fremde Sounddateien: Stadtrauschen mit vorbeifahrendem Verkehr und
 * gelegentlicher Tramglocke, plätscherndes Wasser, Vögel, fernes Geläut,
 * Café-Gemurmel mit Tassenklirren. Bewusst leise, wie ein Podcast-Bett.
 */
import type { AmbienceScene } from "./scene";

const PREF_KEY = "ut-ambience";
const PREF_EVENT = "ut-ambience-pref";
/** Gesamtpegel der Kulisse relativ zur Stimme (HTMLAudio = 1.0). */
const MASTER = 0.5;

type Ctx = AudioContext;
let ctx: Ctx | null = null;
let noise: AudioBuffer | null = null;
let current: Session | null = null;

export function ambienceEnabled(): boolean {
  try {
    return localStorage.getItem(PREF_KEY) !== "0";
  } catch {
    return true;
  }
}

export function setAmbienceEnabled(on: boolean) {
  try {
    localStorage.setItem(PREF_KEY, on ? "1" : "0");
  } catch {
    /* nur für diese Sitzung */
  }
  if (!on) stopAmbience(0.6);
  window.dispatchEvent(new CustomEvent(PREF_EVENT, { detail: on }));
}

export function onAmbiencePref(fn: (on: boolean) => void) {
  const h = (e: Event) => fn((e as CustomEvent<boolean>).detail);
  window.addEventListener(PREF_EVENT, h);
  return () => window.removeEventListener(PREF_EVENT, h);
}

function getCtx(): Ctx | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    // iOS: Wiedergabe auch bei Stumm-Schalter, wie die Stimme.
    try {
      const s = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
      if (s) s.type = "playback";
    } catch {
      /* egal */
    }
    ctx = new AC();
    const len = ctx.sampleRate * 3;
    noise = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = noise.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
  }
  return ctx;
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

class Session {
  private out: GainNode;
  private nodes: AudioNode[] = [];
  private sources: AudioScheduledSourceNode[] = [];
  private timers: ReturnType<typeof setTimeout>[] = [];
  private alive = true;
  private reverb: ConvolverNode;
  private wet: GainNode;

  constructor(private c: Ctx, scene: AmbienceScene) {
    this.out = c.createGain();
    this.out.gain.value = 0;
    // Sanfte Gesamt-EQ: Kulisse bleibt unter der Stimme (Präsenz 1–4 kHz zurück).
    const dip = c.createBiquadFilter();
    dip.type = "peaking";
    dip.frequency.value = 2200;
    dip.Q.value = 0.7;
    dip.gain.value = -6;
    this.out.connect(dip).connect(c.destination);
    this.nodes.push(dip);

    this.reverb = c.createConvolver();
    this.reverb.buffer = this.impulse(2.6);
    this.wet = c.createGain();
    this.wet.gain.value = 0.35;
    this.reverb.connect(this.wet).connect(this.out);

    if (scene.city > 0.05) this.city(scene.city);
    if (scene.water > 0.05) this.water(scene.water);
    if (scene.birds > 0.05) this.birds(scene.birds);
    if (scene.cafe > 0.05) this.cafe(scene.cafe);
    if (scene.bells > 0.05) this.bells(scene.bells);
  }

  fadeTo(level: number, sec: number) {
    const g = this.out.gain, t = this.c.currentTime;
    g.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(level, t + sec);
  }

  stop(sec: number) {
    this.fadeTo(0, sec);
    this.alive = false;
    this.timers.forEach(clearTimeout);
    setTimeout(() => {
      this.sources.forEach((s) => {
        try {
          s.stop();
        } catch {
          /* schon gestoppt */
        }
      });
      [...this.nodes, this.out, this.reverb, this.wet].forEach((n) => n.disconnect());
    }, sec * 1000 + 200);
  }

  // ── Bausteine ─────────────────────────────────────────────
  private impulse(seconds: number) {
    const c = this.c, len = Math.floor(c.sampleRate * seconds), buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    return buf;
  }

  private noiseSrc(rate = 1) {
    const s = this.c.createBufferSource();
    s.buffer = noise;
    s.loop = true;
    s.loopStart = rnd(0, 1);
    s.playbackRate.value = rate;
    s.start(this.c.currentTime, rnd(0, 2.5));
    this.sources.push(s);
    return s;
  }

  private filter(type: BiquadFilterType, freq: number, q = 0.7) {
    const f = this.c.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    this.nodes.push(f);
    return f;
  }

  private gain(v: number) {
    const g = this.c.createGain();
    g.gain.value = v;
    this.nodes.push(g);
    return g;
  }

  private lfo(freq: number, depth: number, target: AudioParam) {
    const o = this.c.createOscillator();
    o.frequency.value = freq;
    const g = this.gain(depth);
    o.connect(g).connect(target);
    o.start();
    this.sources.push(o);
  }

  private pan(v: number) {
    const p = this.c.createStereoPanner();
    p.pan.value = v;
    this.nodes.push(p);
    return p;
  }

  private every(minS: number, maxS: number, fn: () => void, firstS?: number) {
    const tick = (delay: number) => {
      const id = setTimeout(() => {
        if (!this.alive) return;
        if (document.visibilityState !== "hidden") fn();
        tick(rnd(minS, maxS));
      }, delay * 1000);
      this.timers.push(id);
    };
    tick(firstS ?? rnd(minS * 0.3, minS));
  }

  /** Stadt: tiefes Rauschen, langsame Verkehrswellen, vorbeifahrende Fahrzeuge, Tramglocke. */
  private city(level: number) {
    const c = this.c;
    const bed = this.gain(0.32 * level);
    this.noiseSrc(0.5).connect(this.filter("lowpass", 380)).connect(this.filter("highpass", 45)).connect(bed).connect(this.out);
    this.lfo(0.045, 0.1 * level, bed.gain);

    this.every(7, 16, () => {
      const t = c.currentTime, dur = rnd(3.5, 6);
      const bp = this.filter("bandpass", 220, 0.9);
      bp.frequency.setValueAtTime(rnd(160, 240), t);
      bp.frequency.linearRampToValueAtTime(rnd(420, 650), t + dur * 0.5);
      bp.frequency.linearRampToValueAtTime(rnd(180, 260), t + dur);
      const g = this.gain(0);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.22 * level, t + dur * 0.5);
      g.gain.linearRampToValueAtTime(0, t + dur);
      const p = this.pan(0);
      const dir = Math.random() < 0.5 ? -1 : 1;
      p.pan.setValueAtTime(-0.8 * dir, t);
      p.pan.linearRampToValueAtTime(0.8 * dir, t + dur);
      this.noiseSrc(0.7).connect(bp).connect(g).connect(p).connect(this.out);
    });

    // Tramglocke – selten, weit weg
    this.every(45, 95, () => this.ding(level), rnd(18, 35));
  }

  private ding(level: number) {
    const c = this.c, t = c.currentTime, p = this.pan(rnd(-0.7, 0.7));
    const send = this.gain(1);
    send.connect(p).connect(this.out);
    send.connect(this.reverb);
    [0, 0.32].forEach((off) => {
      [1, 2.76, 5.4].forEach((ratio, i) => {
        const o = c.createOscillator();
        o.frequency.value = 1150 * ratio;
        const g = this.gain(0);
        const s = t + off;
        g.gain.setValueAtTime(0, s);
        g.gain.linearRampToValueAtTime((0.05 / (i + 1)) * level, s + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, s + 0.9 / (i + 1));
        o.connect(g).connect(send);
        o.start(s);
        o.stop(s + 1);
        this.sources.push(o);
      });
    });
  }

  /** Wasser: Rauschen mit wellenartiger Bewegung plus leises Plätschern. */
  private water(level: number) {
    const c = this.c;
    const body = this.gain(0.2 * level);
    this.noiseSrc(1).connect(this.filter("bandpass", 520, 0.5)).connect(this.filter("lowpass", 1800)).connect(body).connect(this.out);
    this.lfo(0.13, 0.08 * level, body.gain);
    this.lfo(0.37, 0.05 * level, body.gain);
    const hiss = this.gain(0.035 * level);
    this.noiseSrc(1).connect(this.filter("highpass", 3500)).connect(hiss).connect(this.pan(0.3)).connect(this.out);
    this.lfo(0.21, 0.02 * level, hiss.gain);

    this.every(0.35, 1.4, () => {
      const t = c.currentTime, f = rnd(700, 2400);
      const bp = this.filter("bandpass", f, rnd(4, 10));
      bp.frequency.setValueAtTime(f, t);
      bp.frequency.exponentialRampToValueAtTime(f * rnd(1.3, 2), t + 0.12);
      const g = this.gain(0);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(rnd(0.25, 0.6) * level, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + rnd(0.08, 0.22));
      this.noiseSrc(1).connect(bp).connect(g).connect(this.pan(rnd(-0.6, 0.6))).connect(this.out);
    }, 0.5);
  }

  /** Vögel: kurze Rufgruppen zweier «Arten», zufällig im Raum verteilt. */
  private birds(level: number) {
    const c = this.c;
    this.every(2.5, 8, () => {
      const p = this.pan(rnd(-0.9, 0.9));
      const send = this.gain(1);
      send.connect(p).connect(this.out);
      send.connect(this.reverb);
      const kind = Math.random() < 0.55 ? 0 : 1;
      const n = kind === 0 ? Math.floor(rnd(3, 7)) : Math.floor(rnd(2, 4));
      const base = kind === 0 ? rnd(3200, 4400) : rnd(2100, 2900);
      let t = c.currentTime + 0.05;
      for (let i = 0; i < n; i++) {
        const o = c.createOscillator();
        o.type = "sine";
        const dur = kind === 0 ? rnd(0.05, 0.09) : rnd(0.14, 0.24);
        const f0 = base * rnd(0.92, 1.08);
        o.frequency.setValueAtTime(f0, t);
        if (kind === 0) o.frequency.exponentialRampToValueAtTime(f0 * rnd(1.25, 1.5), t + dur);
        else {
          o.frequency.linearRampToValueAtTime(f0 * 1.35, t + dur * 0.4);
          o.frequency.linearRampToValueAtTime(f0 * 0.9, t + dur);
        }
        const g = this.gain(0);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.03 * level, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(send);
        o.start(t);
        o.stop(t + dur + 0.02);
        this.sources.push(o);
        t += dur + (kind === 0 ? rnd(0.03, 0.08) : rnd(0.12, 0.3));
      }
    }, 1.2);
  }

  /** Café: Stimmengemurmel (silbenartig modulierte Bänder) und Tassenklirren. */
  private cafe(level: number) {
    const c = this.c;
    for (let v = 0; v < 4; v++) {
      const g = this.gain(0.035 * level);
      this.noiseSrc(rnd(0.9, 1.1)).connect(this.filter("bandpass", rnd(350, 900), 1.6)).connect(g).connect(this.pan(rnd(-0.8, 0.8))).connect(this.out);
      this.lfo(rnd(3.2, 5.5), 0.03 * level, g.gain);
      this.lfo(rnd(0.08, 0.2), 0.02 * level, g.gain);
    }
    this.every(4, 11, () => {
      const t = c.currentTime, p = this.pan(rnd(-0.8, 0.8));
      const send = this.gain(1);
      send.connect(p).connect(this.out);
      send.connect(this.reverb);
      [1, 1.47, 2.09].forEach((r, i) => {
        const o = c.createOscillator();
        o.frequency.value = rnd(2600, 3400) * r;
        const g = this.gain(0);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime((0.02 / (i + 1)) * level, t + 0.003);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        o.connect(g).connect(send);
        o.start(t);
        o.stop(t + 0.3);
        this.sources.push(o);
      });
    });
  }

  /** Fernes Geläut: additive Glockenteiltöne, weich gefiltert und verhallt. */
  private bells(level: number) {
    const c = this.c;
    const strike = (t: number, f0: number, amp: number) => {
      const lp = this.filter("lowpass", 2400);
      const g0 = this.gain(1);
      lp.connect(g0);
      g0.connect(this.out);
      g0.connect(this.reverb);
      const partials: [number, number, number][] = [
        [0.5, 0.5, 6],
        [1, 1, 4.5],
        [1.19, 0.6, 3.5],
        [1.5, 0.45, 3],
        [2, 0.35, 2.4],
        [2.74, 0.2, 1.8],
        [3.0, 0.15, 1.5],
        [4.1, 0.08, 1.1],
      ];
      partials.forEach(([r, a, d]) => {
        const o = c.createOscillator();
        o.frequency.value = f0 * r;
        const g = this.gain(0);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(a * amp * level, t + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g).connect(lp);
        o.start(t);
        o.stop(t + d + 0.05);
        this.sources.push(o);
      });
    };
    this.every(28, 55, () => {
      const f0 = [196, 220, 247, 262][Math.floor(rnd(0, 4))];
      const n = Math.floor(rnd(3, 6));
      for (let i = 0; i < n; i++) strike(c.currentTime + 0.05 + i * rnd(1.6, 2.1), f0, 0.022);
    }, rnd(4, 9));
  }
}

/** Startet (oder wechselt) die Kulisse. Muss im Klick-Handler aufgerufen werden. */
export function startAmbience(scene: AmbienceScene | undefined, fadeSec = 2.5) {
  if (!scene || !ambienceEnabled()) return;
  const c = getCtx();
  if (!c) return;
  void c.resume().catch(() => {});
  if (current) current.stop(0.8);
  current = new Session(c, scene);
  current.fadeTo(MASTER, fadeSec);
}

/** Leiser werden, aber weiterlaufen (z.B. kurz pausiert). */
export function stopAmbience(fadeSec = 1.5) {
  current?.stop(fadeSec);
  current = null;
}

/** Ende der Story: Kulisse kurz aufblühen lassen, dann ausklingen. */
export function finishAmbience() {
  const s = current;
  if (!s) return;
  current = null;
  s.fadeTo(MASTER * 1.4, 1.2);
  setTimeout(() => s.stop(4), 2600);
}
