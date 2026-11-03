import { createStore } from './storage'
import type { Difficulty } from './types'

/**
 * - pornit: efecte sonore + instrucțiuni rostite automat
 * - clasa:  fără efecte sonore; instrucțiunile se aud doar dacă copilul apasă 🔊
 * - oprit:  liniște totală (rămân vibrațiile și feedback-ul vizual)
 */
export type SoundMode = 'pornit' | 'clasa' | 'oprit'

export interface Settings {
  sound: SoundMode
  difficulty: Difficulty
  /** Jocurile ascunse de învățătoare de pe ecranul de start. */
  disabledGames: string[]
  /** PIN din 4 cifre pentru zona învățătoarei. */
  pin: string
}

const DEFAULTS: Settings = {
  sound: 'pornit',
  difficulty: 1,
  disabledGames: [],
  pin: '1234',
}

export const settingsStore = createStore<Settings>('prichitech.settings', (stored) => ({
  ...DEFAULTS,
  ...(typeof stored === 'object' && stored !== null ? stored : {}),
}))

export const useSettings = settingsStore.use

export function updateSettings(patch: Partial<Settings>) {
  settingsStore.set((prev) => ({ ...prev, ...patch }))
}

const TEACHER_KEY = 'prichitech.teacher'

/** Zona învățătoarei rămâne deblocată până se închide aplicația sau se apasă „Înapoi”. */
export function isTeacherUnlocked() {
  try {
    return sessionStorage.getItem(TEACHER_KEY) === '1'
  } catch {
    return false
  }
}

export function setTeacherUnlocked(unlocked: boolean) {
  try {
    if (unlocked) sessionStorage.setItem(TEACHER_KEY, '1')
    else sessionStorage.removeItem(TEACHER_KEY)
  } catch {
    // ignorăm: fără sessionStorage, PIN-ul se cere de fiecare dată
  }
}
