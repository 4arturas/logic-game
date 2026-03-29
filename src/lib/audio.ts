// ----------------------------------------------------------------------------
// SYNTHESIZED SOUND ENGINE (Web Audio API)
// ----------------------------------------------------------------------------

export class AudioEngine {
  private static ctx: AudioContext | null = null;
  private static enabled = true;

  static init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextCtor) {
        this.ctx = new AudioContextCtor();
      }
    }
  }

  static toggle(enabled: boolean) {
    this.enabled = enabled;
  }

  static playTone(freq: number, type: OscillatorType, duration: number, vol = 0.1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  static playCorrect() {
    // A quick upward chime
    this.playTone(440, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(659.25, 'sine', 0.2, 0.1), 100);
    setTimeout(() => this.playTone(880, 'sine', 0.4, 0.1), 200);
  }

  static playError() {
    // A quick downward low buzz
    this.playTone(300, 'square', 0.1, 0.05);
    setTimeout(() => this.playTone(250, 'sawtooth', 0.3, 0.05), 100);
  }

  static playLevelUp() {
    // Triumphant arpeggio
    this.playTone(523.25, 'square', 0.2, 0.05); // C5
    setTimeout(() => this.playTone(659.25, 'square', 0.2, 0.05), 150); // E5
    setTimeout(() => this.playTone(783.99, 'square', 0.2, 0.05), 300); // G5
    setTimeout(() => this.playTone(1046.50, 'square', 0.6, 0.05), 450); // C6
  }
}
