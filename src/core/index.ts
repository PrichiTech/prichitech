/**
 * API-ul public al aplicației pentru jocuri și panouri.
 * Jocurile importă DOAR de aici (`@/core`) și din `@/ui`, nu din fișierele interne.
 */
export type {
  Category,
  Difficulty,
  GameModule,
  GameProps,
  GameResult,
  PanelAudience,
  PanelModule,
  PanelProps,
  Stars,
} from './types'
export { CATEGORIES } from './types'
export { playSound, speak, canSpeak, type SoundName } from './audio'
export { useSettings, updateSettings, type Settings, type SoundMode } from './settings'
export { useResults, clearResults, type ResultRecord } from './progress'
export { randomInt, pickRandom, shuffle } from './random'
export { useLater } from './useLater'
