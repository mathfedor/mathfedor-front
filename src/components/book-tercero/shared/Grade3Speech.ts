/**
 * Motor de síntesis de voz (Web Speech API) adaptado para Matemáticas de Fedor 3°.
 * Convierte símbolos matemáticos a lenguaje natural pausado y claro.
 */

const SYMBOL_MAP: Record<string, string> = {
  '+': ' más ',
  '−': ' menos ',
  '-': ' menos ',
  '×': ' por ',
  'x': ' por ',
  '÷': ' entre ',
  '/': ' entre ',
  '=': ' es igual a ',
  '<': ' es menor que ',
  '>': ' es mayor que ',
  '$': 'pesos ',
  '?': '',
  '¿': '',
  '¡': '',
  '!': '',
  '★': ' estrella ',
  '⭐': ' estrella ',
  'cm²': ' centímetros cuadrados ',
  'cm³': ' centímetros cúbicos ',
  'm²': ' metros cuadrados ',
};

export function sanitizeForSpeech(txt: string): string {
  if (!txt) return '';
  let t = String(txt);
  // Quitar etiquetas HTML
  t = t.replace(/<[^>]*>/g, ' ');
  // Eliminar emojis
  t = t.replace(/[\uD800-\uDFFF][\uDC00-\uDFFF]/g, ' ');
  t = t.replace(/[\u{1F300}-\u{1FAFF}]/gu, ' ');
  t = t.replace(/[\u{2600}-\u{27BF}]/gu, ' ');
  // Convertir símbolos
  Object.keys(SYMBOL_MAP).forEach((sym) => {
    t = t.split(sym).join(SYMBOL_MAP[sym]);
  });
  return t.replace(/\s+/g, ' ').trim();
}

let preferredVoice: SpeechSynthesisVoice | null = null;

function getVoice(): SpeechSynthesisVoice | null {
  if (preferredVoice) return preferredVoice;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  preferredVoice =
    voices.find((v) => v.lang === 'es-CO') ||
    voices.find((v) => v.lang === 'es-MX') ||
    voices.find((v) => v.lang.startsWith('es')) ||
    null;
  return preferredVoice;
}

export function fedorSpeak(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const clean = sanitizeForSpeech(text);
  if (!clean) return;

  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(clean);
  utter.rate = 0.88;
  utter.pitch = 1.05;
  const voice = getVoice();
  if (voice) utter.voice = voice;

  if (onEnd) {
    utter.onend = onEnd;
    utter.onerror = onEnd;
  }

  window.speechSynthesis.speak(utter);
}

export function stopFedorSpeak() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
