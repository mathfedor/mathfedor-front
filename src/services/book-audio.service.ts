/**
 * SFX del libro con Web Audio API (sin assets externos).
 * Portado de los helpers `_audio` / `chord` del HTML original.
 * Singleton perezoso: el AudioContext se crea en la primera reproducción
 * (debe ocurrir tras un gesto del usuario por políticas del navegador).
 */

type Note = { freq: number; start: number; dur: number };

class BookAudioService {
  private ctx: AudioContext | null = null;
  private enabled = true;

  /** Activa/desactiva el sonido globalmente. */
  setEnabled(value: boolean): void {
    this.enabled = value;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  private ensureCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  private play(notes: Note[], type: OscillatorType = 'sine', gain = 0.12): void {
    if (!this.enabled) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    notes.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, now + start);
      g.gain.linearRampToValueAtTime(gain, now + start + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur);
    });
  }

  /** Respuesta correcta: arpegio ascendente alegre. */
  correct(): void {
    this.play(
      [
        { freq: 523.25, start: 0, dur: 0.16 },
        { freq: 659.25, start: 0.08, dur: 0.16 },
        { freq: 783.99, start: 0.16, dur: 0.22 },
      ],
      'triangle'
    );
  }

  /** Respuesta incorrecta: tono descendente breve. */
  wrong(): void {
    this.play(
      [
        { freq: 311.13, start: 0, dur: 0.18 },
        { freq: 233.08, start: 0.1, dur: 0.22 },
      ],
      'sawtooth',
      0.08
    );
  }

  /** Nivel completado: fanfarria corta. */
  levelUp(): void {
    this.play(
      [
        { freq: 523.25, start: 0, dur: 0.16 },
        { freq: 659.25, start: 0.12, dur: 0.16 },
        { freq: 783.99, start: 0.24, dur: 0.16 },
        { freq: 1046.5, start: 0.36, dur: 0.34 },
      ],
      'triangle',
      0.14
    );
  }

  /** Click/UI sutil. */
  click(): void {
    this.play([{ freq: 660, start: 0, dur: 0.06 }], 'square', 0.05);
  }
}

export const bookAudio = new BookAudioService();
