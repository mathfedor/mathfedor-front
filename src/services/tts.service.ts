/**
 * Servicio Text-to-Speech (TTS) del libro "Matemáticas de Fedor".
 * Réplica exacta de la función `speakText` de public/primero/Untitled.html.
 * Configuración: lang='es-CO', rate=0.88 (lento-medio), pitch=1.05 (infantil).
 */

class TTSService {
  private enabled = true;

  /** Alterna o establece el estado global de voz */
  setEnabled(value: boolean): void {
    this.enabled = value;
    if (!value && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Lee un texto en voz alta usando SpeechSynthesis.
   * Sanetiza caracteres especiales y emoticonos para una dicción clara.
   */
  speak(rawText: string, onEnd?: () => void): boolean {
    if (!this.enabled) return false;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis no disponible en este navegador');
      return false;
    }

    try {
      window.speechSynthesis.cancel();

      const text = this.sanitizeForSpeech(rawText);
      if (!text) return false;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-CO';
      utterance.rate = 0.88; // lento-medio (regla FEDOR)
      utterance.pitch = 1.05; // ligeramente infantil
      utterance.volume = 1.0;

      // Seleccionar voz en español adecuada
      const voices = window.speechSynthesis.getVoices();
      const esVoice = voices.find((v) =>
        /es-CO|es-MX|es-ES|es-US|es-419|es_/i.test(v.lang)
      );
      if (esVoice) utterance.voice = esVoice;

      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.error('Error al reproducir voz TTS:', e);
      return false;
    }
  }

  /** Detiene cualquier voz activa */
  stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /** Limpia texto eliminando emojis o etiquetas para una lectura fluida */
  private sanitizeForSpeech(raw: string): string {
    if (!raw) return '';
    return raw
      .replace(/<[^>]+>/g, ' ') // Eliminar HTML
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // Emojis
      .replace(/•|\*|_|#/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

export const fedorTTS = new TTSService();
