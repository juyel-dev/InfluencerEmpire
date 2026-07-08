type SfxName =
  | "click"
  | "open"
  | "close"
  | "success"
  | "follower"
  | "money"
  | "reputation"
  | "creativity"
  | "energy"
  | "fail"
  | "milestone"
  | "levelup"
  | "event"
  | "win"
  | "lose";

const SAVE_KEY = "ie_sound_enabled";

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private enabled: boolean;

  constructor() {
    const saved = typeof localStorage !== "undefined" ? localStorage.getItem(SAVE_KEY) : null;
    this.enabled = saved === null ? true : saved !== "false";
  }

  private ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    if (!this.ctx) {
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.35;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  isEnabled() {
    return this.enabled;
  }

  setEnabled(v: boolean) {
    this.enabled = v;
    if (typeof localStorage !== "undefined") localStorage.setItem(SAVE_KEY, String(v));
  }

  toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  private tone(freq: number, duration: number, type: OscillatorType = "sine", gain = 0.3, when = 0) {
    const ctx = this.ensure();
    if (!ctx || !this.master || !this.enabled) return;
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t0);
    osc.stop(t0 + duration + 0.03);
  }

  private slide(from: number, to: number, duration: number, type: OscillatorType = "sine", gain = 0.3, when = 0) {
    const ctx = this.ensure();
    if (!ctx || !this.master || !this.enabled) return;
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + duration);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t0);
    osc.stop(t0 + duration + 0.03);
  }

  play(name: SfxName) {
    switch (name) {
      case "click":
        this.tone(420, 0.05, "square", 0.12);
        break;
      case "open":
        this.slide(380, 620, 0.12, "triangle", 0.18);
        break;
      case "close":
        this.slide(520, 300, 0.1, "triangle", 0.16);
        break;
      case "success":
        this.tone(660, 0.1, "sine", 0.25);
        this.tone(880, 0.12, "sine", 0.2, 0.07);
        break;
      case "follower":
        this.tone(740, 0.07, "sine", 0.22);
        this.tone(988, 0.1, "sine", 0.18, 0.05);
        break;
      case "money":
        this.tone(880, 0.05, "square", 0.16);
        this.tone(1175, 0.07, "square", 0.12, 0.04);
        break;
      case "reputation":
        this.tone(523, 0.08, "triangle", 0.2);
        this.tone(784, 0.1, "triangle", 0.16, 0.06);
        break;
      case "creativity":
        this.tone(587, 0.08, "triangle", 0.18);
        this.tone(880, 0.1, "triangle", 0.14, 0.06);
        break;
      case "energy":
        this.tone(330, 0.08, "sine", 0.18);
        break;
      case "fail":
        this.slide(220, 110, 0.25, "sawtooth", 0.18);
        break;
      case "milestone":
        this.tone(523, 0.12, "triangle", 0.28);
        this.tone(659, 0.12, "triangle", 0.28, 0.1);
        this.tone(784, 0.16, "triangle", 0.28, 0.2);
        break;
      case "levelup":
        [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.12, "sine", 0.26, i * 0.08));
        break;
      case "event":
        this.tone(440, 0.1, "triangle", 0.22);
        this.tone(554, 0.12, "triangle", 0.22, 0.08);
        break;
      case "win":
        [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => this.tone(f, 0.3, "triangle", 0.3, i * 0.12));
        break;
      case "lose":
        [392, 330, 262, 196, 131].forEach((f, i) => this.slide(f, f * 0.9, 0.35, "sawtooth", 0.22, i * 0.13));
        break;
    }
  }
}

export const audio = new AudioEngine();
