class EstacionAudioService {
  private audioOn: boolean = true;
  private vozOn: boolean = true;
  private ctxA: AudioContext | null = null;

  isAudioEnabled(): boolean {
    return this.audioOn;
  }

  isVozEnabled(): boolean {
    return this.vozOn;
  }

  toggleAudio(): boolean {
    this.audioOn = !this.audioOn;
    if (this.audioOn) this.click();
    return this.audioOn;
  }

  toggleVoz(): boolean {
    this.vozOn = !this.vozOn;
    if (!this.vozOn && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    } else if (this.vozOn) {
      this.hablar('¡Hola, cadete! Aquí Fedor.');
    }
    return this.vozOn;
  }

  private tono(fs: number[], dur: number, tipo: OscillatorType = 'triangle') {
    if (!this.audioOn || typeof window === 'undefined') return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctxA = this.ctxA || new AudioCtx();
      if (this.ctxA.state === 'suspended') {
        void this.ctxA.resume();
      }
      const t0 = this.ctxA.currentTime;
      fs.forEach((f, i) => {
        if (!this.ctxA) return;
        const o = this.ctxA.createOscillator();
        const g = this.ctxA.createGain();
        o.type = tipo;
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0 + i * dur);
        g.gain.exponentialRampToValueAtTime(0.11, t0 + i * dur + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + (i + 1) * dur);
        o.connect(g);
        g.connect(this.ctxA.destination);
        o.start(t0 + i * dur);
        o.stop(t0 + (i + 1) * dur + 0.05);
      });
    } catch {
      // ignore
    }
  }

  click() {
    this.tono([520], 0.09);
  }

  bien() {
    this.tono([523, 659, 784], 0.11);
  }

  mal() {
    this.tono([220, 180], 0.16, 'sawtooth');
  }

  moneda() {
    this.tono([880, 1175], 0.07);
  }

  victoria() {
    this.tono([523, 659, 784, 1047, 784, 1047], 0.12);
  }

  compra() {
    this.tono([659, 880, 1047, 1319], 0.09);
  }

  hablar(txt: string) {
    if (!this.vozOn || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(txt);
      u.lang = 'es-CO';
      u.rate = 0.95;
      u.pitch = 1.15;
      const vs = window.speechSynthesis.getVoices();
      const v =
        vs.find((x) => x.lang.startsWith('es-CO')) || vs.find((x) => x.lang.startsWith('es'));
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    } catch {
      // ignore
    }
  }
}

export const estacionAudio = new EstacionAudioService();
