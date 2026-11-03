import { createStore } from './storage'
import type { Difficulty, GameResult } from './types'

/** Un joc terminat, așa cum îl vede învățătoarea în panou. */
export interface ResultRecord extends GameResult {
  gameId: string
  difficulty: Difficulty
  durationMs: number
  /** Data și ora, în format ISO. */
  at: string
}

const MAX_RECORDS = 500

export const resultsStore = createStore<ResultRecord[]>('prichitech.results', (stored) =>
  Array.isArray(stored) ? (stored as ResultRecord[]) : [],
)

export const useResults = resultsStore.use

export function saveResult(record: ResultRecord) {
  resultsStore.set((prev) => [record, ...prev].slice(0, MAX_RECORDS))
}

export function clearResults() {
  resultsStore.set([])
}
