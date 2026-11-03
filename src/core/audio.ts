import { settingsStore } from './settings'

export type SoundName = 'tap' | 'success' | 'oops' | 'win'

/** [frecvență Hz, început s, durată s]. Sunetele sunt generate, nu avem nevoie de fișiere audio. */
type Note = [number, number, number]

const SOUNDS: Record<SoundName, Note[]> = {
  tap: [[660, 0, 0.06]],
  success: [
    [523, 0, 0.12],
    [784, 0.1, 0.2],
  ],
  // Blând, nu „buzzer”: copilul nu trebuie să se sperie când greșește.
  oops: [
    [330, 0, 0.16],
    [294, 0.14, 0.22],
  ],
  win: [
    [523, 0, 0.15],
    [659, 0.13, 0.15],
    [784, 0.26, 0.15],
    [1047, 0.39, 0.4],
  ],
}

const VIBRATIONS: Record<SoundName, number | number[]> = {
  tap: 10,
  success: 40,
  oops: [30, 60, 30],
  win: [40, 40, 40, 40, 90],
}

let context: AudioContext | null = null

function audioContext() {
  if (!context && typeof window !== 'undefined' && 'AudioContext' in window) {
    context = new AudioContext()
  }
  if (context?.state === 'suspended') void context.resume()
  return context
}

/**
 * Feedback pentru o acțiune a copilului.
 * Vibrează mereu (e silențios); sunetul se aude doar când modul de sunet e „pornit”.
 */
export function playSound(name: SoundName) {
  try {
    navigator.vibrate?.(VIBRATIONS[name])
  } catch {
    // unele browsere nu permit vibrația
  }

  if (settingsStore.get().sound !== 'pornit') return
  const ac = audioContext()
  if (!ac) return

  for (const [frequency, start, duration] of SOUNDS[name]) {
    const oscillator = ac.createOscillator()
    const gain = ac.createGain()
    const at = ac.currentTime + start
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.25, at + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration)
    oscillator.connect(gain).connect(ac.destination)
    oscillator.start(at)
    oscillator.stop(at + duration + 0.05)
  }
}

/**
 * Rostește un text în română.
 * `auto: true` = rostire pornită de aplicație (nu de copil); în „modul clasă” e sărită.
 */
export function speak(text: string, options: { auto?: boolean } = {}) {
  const { sound } = settingsStore.get()
  if (sound === 'oprit' || (sound === 'clasa' && options.auto)) return
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

  const synth = window.speechSynthesis
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ro-RO'
  utterance.rate = 0.9
  utterance.pitch = 1.1
  const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith('ro'))
  if (voice) utterance.voice = voice
  synth.cancel()
  synth.speak(utterance)
}

/** Butonul 🔊 se afișează doar dacă sunetul nu e oprit complet. */
export function canSpeak() {
  return settingsStore.get().sound !== 'oprit'
}
