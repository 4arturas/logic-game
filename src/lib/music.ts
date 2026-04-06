export class MusicEngine {
  private static ctx: AudioContext | null = null;
  private static masterGain: GainNode | null = null;
  private static filter: BiquadFilterNode | null = null;
  private static oscillators: OscillatorNode[] = [];
  private static lfo: OscillatorNode | null = null;
  private static isPlaying = false;
  private static isInitialized = false;

  static setPlaying(play: boolean) {
    if (play && !this.isPlaying) {
      this.play();
    } else if (!play && this.isPlaying) {
      this.stop();
    }
  }

  static getIsPlaying() {
    return this.isPlaying;
  }

  private static init() {
    if (this.isInitialized) return;
    if (typeof window !== 'undefined') {
      const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextCtor) {
        this.ctx = new AudioContextCtor();
      }
    }
    this.isInitialized = true;
  }

  static play() {
    if (this.isPlaying) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;

    // Master Volume
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 3); // Fade in
    this.masterGain.connect(this.ctx.destination);

    // Filter for the "breathing" ambient effect
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.Q.value = 1;
    this.filter.connect(this.masterGain);

    // LFO to sweep the filter cutoff slowly
    this.lfo = this.ctx.createOscillator();
    this.lfo.type = 'sine';
    this.lfo.frequency.value = 0.05; // very slow, 20 second cycle
    
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 400; // Sweep range
    this.lfo.connect(lfoGain);
    lfoGain.connect(this.filter.frequency);
    
    this.filter.frequency.setValueAtTime(600, this.ctx.currentTime); // Base cutoff
    this.lfo.start();

    // Create a calming pentatonic chord drone (Cmaj9 pentatonic ish: C, E, G, D)
    // Frequencies: 130.81 (C3), 164.81 (E3), 196.00 (G3), 293.66 (D4), 392.00 (G4)
    const frequencies = [130.81, 164.81, 196.00, 293.66, 392.00];

    this.oscillators = frequencies.map((freq, i) => {
      const osc = this.ctx!.createOscillator();
      // Mix of sine and triangle for smooth synth sound
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      
      // Slight detune for chorus thickness
      const detune = (Math.random() - 0.5) * 10;
      osc.frequency.value = freq;
      osc.detune.value = detune;

      const oscGain = this.ctx!.createGain();
      // Lower frequencies get slightly more volume, higher get less
      oscGain.gain.value = 1.0 / (i + 2); 

      osc.connect(oscGain);
      oscGain.connect(this.filter!);
      osc.start();
      return osc;
    });
  }

  static stop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    
    // Fade out
    this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 1);
    
    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      this.oscillators = [];
      
      if (this.lfo) {
        try { this.lfo.stop(); this.lfo.disconnect(); } catch (e) {}
      }
      if (this.filter) this.filter.disconnect();
      if (this.masterGain) this.masterGain.disconnect();
      
      this.isPlaying = false;
    }, 2000); // Wait for fade out
  }
}
