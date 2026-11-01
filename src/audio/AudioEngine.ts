import {
  AMBIENT_SCALE,
  PATTERN,
  STEP_DURATION,
  STEPS,
} from './percussionPattern';

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
  private ambBus: GainNode | null = null;
  private noise: AudioBuffer | null = null;

  private percTimer: number | null = null;
  private step = 0;
  private nextStepTime = 0;
  private percStart = 0;

  private ambNodes: AudioNode[] = [];
  private ambTimer: number | null = null;
  private nextPluck = 0;
  private pluckBus: GainNode | null = null;
  private ambRunning = false;

  private stage: Stage = 'idle';
  private started = false;
  private muted = false;
  private volume = 0.62;

  getStage(): Stage {
    return this.stage;
  }

  isStarted(): boolean {
    return this.started;
  }

  async ensure(): Promise<boolean> {
    try {
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
        this.percBus.connect(this.musicBus);

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

  async startPercussion(): Promise<boolean> {
    const ready = await this.ensure();
    if (!ready || !this.ctx || !this.percBus || !this.ambBus) return false;

    this.started = true;
    this.stage = 'percussion';
    this.stopAmbience(0.6);

    const ctx = this.ctx;
    const now = ctx.currentTime;
    this.percStart = now + 0.16;
    this.nextStepTime = this.percStart;
    this.step = 0;

    const bus = this.percBus;
    bus.gain.cancelScheduledValues(now);
    bus.gain.setValueAtTime(Math.max(0.0001, bus.gain.value), now);
    bus.gain.linearRampToValueAtTime(0.9, now + 0.7);

    this.scheduler();
    if (this.percTimer === null) {
      this.percTimer = window.setInterval(this.scheduler, 40);
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
    if (PATTERN.low.includes(step)) this.membrane(time, 148, 68, 0.55, 0.34, bus);
    if (PATTERN.tone.includes(step)) this.membrane(time, 302, 232, 0.3, 0.19, bus);
    if (PATTERN.slap.includes(step)) this.slap(time, bus);
    if (PATTERN.bell.includes(step)) this.bell(time, bus);
    if (PATTERN.shaker.includes(step)) {
      const accent = step % 4 === 2 ? 1.5 : step % 2 === 0 ? 1 : 0.7;
      this.shaker(time, bus, accent);
    }

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

    this.noiseHit(time, 'bandpass', 900, 0.9, level * 0.22, decay * 0.35, dest);
  }

  private dunun(time: number, dest: AudioNode): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(74, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.32);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.6, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.55);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + 0.6);

    this.noiseHit(time, 'lowpass', 420, 0.7, 0.16, 0.1, dest);
  }

  private slap(time: number, dest: AudioNode): void {
    const ctx = this.ctx;
    if (!ctx) return;

    this.noiseHit(time, 'bandpass', 2600, 1.1, 0.2, 0.075, dest);

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, time);
    osc.frequency.exponentialRampToValueAtTime(360, time + 0.07);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.16, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + 0.1);
  }

  private bell(time: number, dest: AudioNode): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.055, time + 0.004);
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
  }

  async enterWorld(): Promise<void> {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') await this.ctx.resume();

    if (this.stage === 'percussion') {
      const now = this.ctx.currentTime;
      const bus = this.percBus;
      if (bus) {
        bus.gain.cancelScheduledValues(now);
        bus.gain.setValueAtTime(Math.max(0.0001, bus.gain.value), now);
        bus.gain.linearRampToValueAtTime(0.0001, now + 1.8);
      }
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
    const ready = await this.ensure();
    if (!ready) return false;
    this.started = true;
    if (this.stage !== 'percussion') this.stage = 'ambience';
    this.startAmbience();
    return true;
  }

  private startAmbience(): void {
    const ctx = this.ctx;
    const ambBus = this.ambBus;
    if (!ctx || !ambBus || this.ambRunning) return;

    this.ambRunning = true;
    const now = ctx.currentTime;

    ambBus.gain.cancelScheduledValues(now);
    ambBus.gain.setValueAtTime(Math.max(0.0001, ambBus.gain.value), now);
    ambBus.gain.linearRampToValueAtTime(0.78, now + 3.2);

    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.055;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 420;
    lowpass.Q.value = 0.6;
    droneGain.connect(lowpass);
    lowpass.connect(ambBus);

    const tremolo = ctx.createGain();
    tremolo.gain.value = 0.85;
    lowpass.disconnect();
    lowpass.connect(tremolo);
    tremolo.connect(ambBus);

    const tremLfo = ctx.createOscillator();
    tremLfo.frequency.value = 0.085;
    const tremDepth = ctx.createGain();
    tremDepth.gain.value = 0.14;
    tremLfo.connect(tremDepth);
    tremDepth.connect(tremolo.gain);

    const filterLfo = ctx.createOscillator();
    filterLfo.frequency.value = 0.052;
    const filterDepth = ctx.createGain();
    filterDepth.gain.value = 190;
    filterLfo.connect(filterDepth);
    filterDepth.connect(lowpass.frequency);

    const droneFreqs = [55, 82.5, 110.2, 164.8];
    droneFreqs.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      osc.type = index === 2 ? 'triangle' : 'sine';
      osc.frequency.value = freq;
      osc.detune.value = (index % 2 === 0 ? 1 : -1) * (2 + index * 0.6);
      const level = ctx.createGain();
      level.gain.value = index === 0 ? 0.5 : index === 3 ? 0.18 : 0.3;
      osc.connect(level);
      level.connect(droneGain);
      osc.start(now);
      this.ambNodes.push(osc);
    });

    tremLfo.start(now);
    filterLfo.start(now);
    this.ambNodes.push(tremLfo, filterLfo);

    if (this.noise) {
      const wind = ctx.createBufferSource();
      wind.buffer = this.noise;
      wind.loop = true;
      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.value = 520;
      windFilter.Q.value = 0.55;
      const windGain = ctx.createGain();
      windGain.gain.value = 0.02;
      wind.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(ambBus);
      wind.start(now, Math.random() * 0.8);
      this.ambNodes.push(wind);

      const windLfo = ctx.createOscillator();
      windLfo.frequency.value = 0.043;
      const windDepth = ctx.createGain();
      windDepth.gain.value = 0.012;
      windLfo.connect(windDepth);
      windDepth.connect(windGain.gain);
      windLfo.start(now);
      this.ambNodes.push(windLfo);
    }

    const delay = ctx.createDelay(1.2);
    delay.delayTime.value = 0.44;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.34;
    const wet = ctx.createGain();
    wet.gain.value = 0.32;
    const pluckBus = ctx.createGain();
    pluckBus.gain.value = 0.6;

    pluckBus.connect(ambBus);
    pluckBus.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(ambBus);
    pluckBus.connect(wet);
    this.pluckBus = pluckBus;

    this.nextPluck = now + 2.4;
    if (this.ambTimer === null) {
      this.ambTimer = window.setInterval(this.pluckScheduler, 240);
    }
  }

  private pluckScheduler = (): void => {
    const ctx = this.ctx;
    if (!ctx || !this.pluckBus || !this.ambRunning) return;
    const now = ctx.currentTime;
    if (now < this.nextPluck) return;

    this.pluck(this.nextPluck + 0.02, this.pluckBus);
    this.nextPluck = now + 2.6 + Math.random() * 3.6;
  };

  private pluck(time: number, dest: AudioNode): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const scale = AMBIENT_SCALE;
    const freq = scale[Math.floor(Math.random() * scale.length)] * (Math.random() > 0.75 ? 2 : 1);

    const pan = ctx.createStereoPanner();
    pan.pan.value = (Math.random() * 2 - 1) * 0.72;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.032, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.6);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const harmonic = ctx.createOscillator();
    harmonic.type = 'sine';
    harmonic.frequency.value = freq * 2.01;
    const harmonicGain = ctx.createGain();
    harmonicGain.gain.value = 0.18;

    osc.connect(gain);
    harmonic.connect(harmonicGain);
    harmonicGain.connect(gain);
    gain.connect(pan);
    pan.connect(dest);

    osc.start(time);
    harmonic.start(time);
    osc.stop(time + 1.7);
    harmonic.stop(time + 1.7);
  }

  private stopAmbience(fade: number): void {
    const ctx = this.ctx;
    const ambBus = this.ambBus;
    if (!ctx || !ambBus) return;
    const now = ctx.currentTime;
    ambBus.gain.cancelScheduledValues(now);
    ambBus.gain.setValueAtTime(Math.max(0.0001, ambBus.gain.value), now);
    ambBus.gain.linearRampToValueAtTime(0.0001, now + fade);
    if (this.ambTimer !== null) {
      window.clearInterval(this.ambTimer);
      this.ambTimer = null;
    }
    this.ambRunning = false;
    this.pluckBus = null;
    const nodes = this.ambNodes;
    this.ambNodes = [];
    window.setTimeout(() => {
      nodes.forEach((node) => {
        try {
          (node as OscillatorNode).stop?.();
          node.disconnect();
        } catch {
          /* node already stopped */
        }
      });
    }, (fade + 0.2) * 1000);
  }
}

export const audioEngine = new AudioEngine();
