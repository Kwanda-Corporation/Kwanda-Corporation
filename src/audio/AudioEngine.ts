import ambienceUrl from './kwanda-ambience.mp3';
import { PATTERN, STEP_DURATION, STEPS } from './percussionPattern';

type Stage = 'idle' | 'percussion' | 'ambience';

function createNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private percBus: GainNode | null = null;
  private percComp: DynamicsCompressorNode | null = null;
  private ambBus: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private drone: { oscillators: OscillatorNode[]; gain: GainNode } | null = null;

  private percTimer: number | null = null;
  private step = 0;
  private nextStepTime = 0;
  private percStart = 0;

  private ambRunning = false;
  private ambFresh = true;
  /** True while an editorial page has deliberately muted the world score. */
  private ambSuppressed = false;
  private piano: HTMLAudioElement | null = null;
  private pianoSource: MediaElementAudioSourceNode | null = null;

  private stage: Stage = 'idle';
  private started = false;
  private muted = false;
  private volume = 0.62;
  private suspendToken = 0;
  private hidden = false;

  getStage(): Stage {
    return this.stage;
  }

  isStarted(): boolean {
    return this.started;
  }

  async ensure(): Promise<boolean> {
    try {
      this.suspendToken += 1;
      if (!this.ctx) {
        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return false;

        const ctx = new Ctor();
        this.ctx = ctx;
        this.noise = createNoiseBuffer(ctx, 1.2);

        this.master = ctx.createGain();
        this.master.gain.value = this.targetGain();
        this.master.connect(ctx.destination);

        this.musicBus = ctx.createGain();
        this.musicBus.gain.value = 1;
        this.musicBus.connect(this.master);

        this.percBus = ctx.createGain();
        this.percBus.gain.value = 0;

        // Punch the intro drums hard and keep the low end from clipping.
        this.percComp = ctx.createDynamicsCompressor();
        this.percComp.threshold.value = -20;
        this.percComp.knee.value = 14;
        this.percComp.ratio.value = 8;
        this.percComp.attack.value = 0.004;
        this.percComp.release.value = 0.22;

        this.percBus.connect(this.percComp);
        this.percComp.connect(this.musicBus);

        this.ambBus = ctx.createGain();
        this.ambBus.gain.value = 0;
        this.ambBus.connect(this.musicBus);
      }

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return this.ctx.state === 'running';
    } catch {
      return false;
    }
  }

  private targetGain(): number {
    return this.muted ? 0 : this.volume * 0.9;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.applyGain(0.25);
  }

  setVolume(volume: number): void {
    this.volume = Math.min(1, Math.max(0, volume));
    this.applyGain(0.15);
  }

  private applyGain(ramp: number): void {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), now);
    master.gain.linearRampToValueAtTime(Math.max(0.0001, this.targetGain()), now + ramp);
  }

  /**
   * Create (or reuse) the piano element and start a muted loop while we still
   * have the user's gesture. This unlocks autoplay and lets the mp3 stream
   * download during the drum intro without touching the audio graph yet.
   */
  private preparePiano(): void {
    if (!this.piano) {
      const element = new Audio();
      element.src = ambienceUrl;
      element.loop = true;
      element.preload = 'auto';
      element.muted = true;
      element.volume = 1;
      this.piano = element;
    }
    const piano = this.piano;
    if (!piano.paused) return;
    void piano.play().catch(() => {
      /* a later gesture will retry */
    });
  }

  async startPercussion(): Promise<boolean> {
    this.preparePiano();
    const ready = await this.ensure();
    if (!ready || !this.ctx || !this.percBus || !this.ambBus) return false;

    this.started = true;
    this.stage = 'percussion';
    this.stopAmbience(0.6, false);

    const ctx = this.ctx;
    const now = ctx.currentTime;
    this.percStart = now + 0.16;
    this.nextStepTime = this.percStart;
    this.step = 0;

    const bus = this.percBus;
    bus.gain.cancelScheduledValues(now);
    bus.gain.setValueAtTime(Math.max(0.0001, bus.gain.value), now);
    bus.gain.linearRampToValueAtTime(1, now + 0.7);

    this.startDrone();

    // While the window is backgrounded or blurred no audible nodes should be
    // scheduled; setPageHidden(false) restarts the loop when it returns.
    if (!this.hidden) {
      this.scheduler();
      if (this.percTimer === null) {
        this.percTimer = window.setInterval(this.scheduler, 40);
      }
    }
    return true;
  }

  getPercussionSeconds(): number | null {
    if (!this.ctx || this.stage !== 'percussion' || !this.started) return null;
    return Math.max(0, this.ctx.currentTime - this.percStart);
  }

  private scheduler = (): void => {
    const ctx = this.ctx;
    if (!ctx || !this.percBus) return;

    const now = ctx.currentTime;
    if (this.nextStepTime < now - 0.12) {
      this.nextStepTime = now + 0.06;
      this.step = 0;
    }

    const horizon = now + 0.18;
    let guard = 0;
    while (this.nextStepTime < horizon && guard < 8) {
      this.scheduleStep(this.step, this.nextStepTime);
      this.nextStepTime += STEP_DURATION;
      this.step = (this.step + 1) % STEPS;
      guard += 1;
    }
  };

  private scheduleStep(step: number, time: number): void {
    const bus = this.percBus;
    if (!bus) return;

    if (PATTERN.dunun.includes(step)) this.dunun(time, bus);
    if (PATTERN.low.includes(step)) this.membrane(time, 122, 52, 0.56, 0.42, bus);
    if (PATTERN.tone.includes(step)) this.membrane(time, 292, 214, 0.32, 0.22, bus);
    if (PATTERN.slap.includes(step)) this.slap(time, bus);
    if (PATTERN.bell.includes(step)) this.bell(time, bus);
    if (PATTERN.shaker.includes(step)) {
      const accent = step % 4 === 2 ? 1.5 : step % 2 === 0 ? 1 : 0.7;
      this.shaker(time, bus, accent);
    }

    // Two cinematic sub-booms per bar give the intro its scale and dread.
    if (step === 0 || step === 8) this.impact(time, bus);

    if (step === 3 || step === 11) this.shaker(time + STEP_DURATION * 0.5, bus, 0.6);
  }

  private membrane(
    time: number,
    startFreq: number,
    endFreq: number,
    level: number,
    decay: number,
    dest: AudioNode,
  ): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), time + decay * 0.75);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(level, time + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + decay);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + decay + 0.05);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };

    this.noiseHit(time, 'bandpass', 900, 0.9, level * 0.22, decay * 0.35, dest);
  }

  private dunun(time: number, dest: AudioNode): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(64, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + 0.38);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.92, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.72);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + 0.78);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };

    this.noiseHit(time, 'lowpass', 380, 0.7, 0.3, 0.16, dest);
  }

  /** A deep sub drop that lands with the heaviest beats of the intro. */
  private impact(time: number, dest: AudioNode): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(96, time);
    osc.frequency.exponentialRampToValueAtTime(26, time + 0.6);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(1, time + 0.014);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.15);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + 1.2);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };

    this.noiseHit(time, 'lowpass', 300, 0.9, 0.36, 0.42, dest);
  }

  /**
   * A dissonant low drone under the drum intro. A minor-ish cluster (D / F /
   * B-flat) with a slow filter wobble — felt more than heard, and deliberately
   * uneasy.
   */
  private startDrone(): void {
    const ctx = this.ctx;
    const bus = this.percBus;
    if (!ctx || !bus || this.drone) return;

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.24, now + 1.5);
    gain.connect(bus);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 210;
    filter.Q.value = 7;
    filter.connect(gain);

    const oscillators: OscillatorNode[] = [];
    const layers = [
      { freq: 36.7, type: 'sine' as OscillatorType, detune: 0, level: 1 },
      { freq: 43.65, type: 'sawtooth' as OscillatorType, detune: -9, level: 0.18 },
      { freq: 58.27, type: 'sawtooth' as OscillatorType, detune: 7, level: 0.1 },
      // A semitone-separated mid cluster that beats uneasily above the sub.
      { freq: 146.8, type: 'triangle' as OscillatorType, detune: -6, level: 0.1 },
      { freq: 155.6, type: 'triangle' as OscillatorType, detune: 8, level: 0.08 },
    ];

    layers.forEach((layer) => {
      const osc = ctx.createOscillator();
      osc.type = layer.type;
      osc.frequency.value = layer.freq;
      osc.detune.value = layer.detune;
      const level = ctx.createGain();
      level.gain.value = layer.level;
      osc.connect(level);
      level.connect(filter);
      osc.start(now);
      oscillators.push(osc);
    });

    // A slow wobble in the filter that never quite settles.
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.21;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 70;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(now);
    oscillators.push(lfo);

    this.drone = { oscillators, gain };
  }

  private stopDrone(fade = 1.1): void {
    const ctx = this.ctx;
    const drone = this.drone;
    if (!ctx || !drone) return;
    this.drone = null;

    const now = ctx.currentTime;
    drone.gain.gain.cancelScheduledValues(now);
    drone.gain.gain.setValueAtTime(Math.max(0.0001, drone.gain.gain.value), now);
    drone.gain.gain.exponentialRampToValueAtTime(0.0001, now + fade);

    drone.oscillators.forEach((osc) => {
      try {
        osc.onended = () => osc.disconnect();
        osc.stop(now + fade + 0.05);
      } catch {
        /* already stopped */
      }
    });
  }

  private slap(time: number, dest: AudioNode): void {
    const ctx = this.ctx;
    if (!ctx) return;

    this.noiseHit(time, 'bandpass', 2600, 1.1, 0.34, 0.075, dest);

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, time);
    osc.frequency.exponentialRampToValueAtTime(360, time + 0.07);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.26, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + 0.1);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  private bell(time: number, dest: AudioNode): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.08, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.32);
    gain.connect(dest);

    [812, 1219].forEach((freq, index) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      const partial = ctx.createGain();
      partial.gain.value = index === 0 ? 1 : 0.35;
      osc.connect(partial);
      partial.connect(gain);
      osc.start(time);
      osc.stop(time + 0.34);
    });
  }

  private shaker(time: number, dest: AudioNode, accent: number): void {
    this.noiseHit(time, 'highpass', 5600, 0.8, 0.035 * accent, 0.05, dest);
  }

  private noiseHit(
    time: number,
    type: BiquadFilterType,
    frequency: number,
    q: number,
    level: number,
    decay: number,
    dest: AudioNode,
  ): void {
    const ctx = this.ctx;
    if (!ctx || !this.noise) return;

    const source = ctx.createBufferSource();
    source.buffer = this.noise;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = q;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, level), time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + decay);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    const offset = Math.random() * 0.6;
    source.start(time, offset);
    source.stop(time + decay + 0.03);
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
  }

  /**
   * Stop producing sound (and new audio nodes) when the tab is backgrounded.
   * A hidden tab should not keep a synthesizer loop running on the CPU.
   */
  setPageHidden(hidden: boolean): void {
    if (this.hidden === hidden) return;
    this.hidden = hidden;
    const ctx = this.ctx;

    if (hidden) {
      if (this.percTimer !== null) {
        window.clearInterval(this.percTimer);
        this.percTimer = null;
      }
      if (this.stage === 'ambience') this.stopAmbience(0.2);
      if (ctx && ctx.state === 'running') {
        void ctx.suspend().catch(() => {
          /* the browser can refuse to suspend in the background */
        });
      }
      return;
    }

    if (!ctx) return;
    if (this.started && ctx.state === 'suspended') {
      void ctx.resume().catch(() => {
        /* a later gesture will retry */
      });
    }

    if (!this.started) return;
    if (this.stage === 'percussion') {
      if (this.percTimer === null) {
        this.percTimer = window.setInterval(this.scheduler, 40);
      }
    } else if (this.stage === 'ambience' && !this.ambSuppressed) {
      this.startAmbience();
    }
  }

  async enterWorld(): Promise<void> {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    this.ambSuppressed = false;

    if (this.stage === 'percussion') {
      const now = this.ctx.currentTime;
      const bus = this.percBus;
      if (bus) {
        bus.gain.cancelScheduledValues(now);
        bus.gain.setValueAtTime(Math.max(0.0001, bus.gain.value), now);
        bus.gain.linearRampToValueAtTime(0.0001, now + 1.8);
      }
      this.stopDrone(1.6);
      window.setTimeout(() => {
        if (this.percTimer !== null) {
          window.clearInterval(this.percTimer);
          this.percTimer = null;
        }
      }, 1950);
      this.stage = 'ambience';
    }

    this.startAmbience();
  }

  async enableAmbience(): Promise<boolean> {
    this.preparePiano();
    const ready = await this.ensure();
    if (!ready) return false;
    this.started = true;
    this.ambSuppressed = false;
    if (this.stage !== 'percussion') this.stage = 'ambience';
    this.startAmbience();
    return true;
  }

  /**
   * Fully stop the soundscape (not just mute it) and release the audio graph's
   * CPU budget. The context stays alive so a later explicit gesture can resume.
   */
  stopAll(): void {
    const ctx = this.ctx;
    this.suspendToken += 1;
    const token = this.suspendToken;

    this.stage = 'idle';
    this.started = false;
    this.ambFresh = true;
    this.ambSuppressed = false;
    this.stopDrone(0.7);
    this.stopAmbience(0.7);

    if (this.percTimer !== null) {
      window.clearInterval(this.percTimer);
      this.percTimer = null;
    }

    if (ctx && this.percBus) {
      const now = ctx.currentTime;
      this.percBus.gain.cancelScheduledValues(now);
      this.percBus.gain.setValueAtTime(Math.max(0.0001, this.percBus.gain.value), now);
      this.percBus.gain.linearRampToValueAtTime(0.0001, now + 0.7);
    }

    if (ctx) {
      window.setTimeout(() => {
        if (this.suspendToken !== token || this.ctx !== ctx) return;
        void ctx.suspend().catch(() => {
          /* the browser can refuse to suspend in the background */
        });
      }, 900);
    }
  }

  /**
   * Fade the world score out (and pause its loop) when the traveller opens an
   * editorial page. The engine keeps its `ambience` stage and `started` flag,
   * so the score can be brought straight back without a fresh gesture.
   */
  pauseAmbience(fade = 0.6): void {
    if (this.stage !== 'ambience' || !this.started) return;
    this.ambSuppressed = true;
    this.stopAmbience(fade, true);
  }

  /**
   * Bring the world score back when the traveller returns to the landscape.
   * No-op unless the score was already playing and merely paused for a page.
   */
  resumeAmbience(): void {
    if (this.stage !== 'ambience' || !this.started) return;
    this.ambSuppressed = false;
    this.startAmbience();
  }

  private startAmbience(): void {
    const ctx = this.ctx;
    const ambBus = this.ambBus;
    if (!ctx || !ambBus) return;

    // Never (re)start audible playback while the page is hidden or the window
    // is unfocused; setPageHidden(false) starts it again on return.
    if (this.hidden) return;

    this.preparePiano();
    const piano = this.piano;
    if (!piano) return;

    if (!this.pianoSource) {
      try {
        this.pianoSource = ctx.createMediaElementSource(piano);
        this.pianoSource.connect(ambBus);
      } catch {
        /* the element is already attached to another graph */
        return;
      }
    }

    if (this.ambRunning) return;
    this.ambRunning = true;
    const now = ctx.currentTime;

    if (this.ambFresh && piano.currentTime > 0.4) {
      // The muted preload ran during the drum intro; start the score at its
      // beginning once the world opens.
      try {
        piano.currentTime = 0;
      } catch {
        /* seeking can fail while the stream is still resolving */
      }
    }
    this.ambFresh = false;

    ambBus.gain.cancelScheduledValues(now);
    ambBus.gain.setValueAtTime(Math.max(0.0001, ambBus.gain.value), now);
    ambBus.gain.linearRampToValueAtTime(0.82, now + 2.4);

    piano.muted = false;
    void piano.play().catch(() => {
      /* the context will retry on the next gesture */
    });
  }

  private stopAmbience(fade: number, pauseElement = true): void {
    const ctx = this.ctx;
    const ambBus = this.ambBus;
    const piano = this.piano;
    if (!ctx || !ambBus) return;

    const now = ctx.currentTime;
    ambBus.gain.cancelScheduledValues(now);
    ambBus.gain.setValueAtTime(Math.max(0.0001, ambBus.gain.value), now);
    ambBus.gain.linearRampToValueAtTime(0.0001, now + fade);
    this.ambRunning = false;

    if (!pauseElement || !piano) return;
    window.setTimeout(() => {
      if (this.ambRunning) return;
      piano.pause();
      piano.muted = true;
    }, (fade + 0.15) * 1000);
  }
}

export const audioEngine = new AudioEngine();
