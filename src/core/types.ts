import type { ComponentType } from 'react'

/** Categoriile de jocuri. Apar în panoul învățătoarei și în documentație. */
export type Category = 'memorie' | 'atentie' | 'numere' | 'litere'

export const CATEGORIES: readonly Category[] = ['memorie', 'atentie', 'numere', 'litere']

/** 1 = ușor, 2 = mediu, 3 = greu. O alege învățătoarea din panou. */
export type Difficulty = 1 | 2 | 3

/** Copilul primește mereu cel puțin o stea: în aplicație nu se „pierde”. */
export type Stars = 1 | 2 | 3

/** Ce trimite un joc când s-a terminat. */
export interface GameResult {
  stars: Stars
  correct: number
  mistakes: number
}

/** Ce primește componenta unui joc de la aplicație. */
export interface GameProps {
  difficulty: Difficulty
  /** Se apelează O SINGURĂ DATĂ, la final. Aplicația afișează apoi ecranul cu steluțe. */
  onFinish: (result: GameResult) => void
}

/** Descrierea unui joc. Fiecare joc o exportă ca `default` din `src/games/<id>/index.ts`. */
export interface GameModule {
  /** Trebuie să fie identic cu numele folderului (ex: "perechi"). */
  id: string
  /** Numele jocului, pentru învățătoare (copiii nu citesc). */
  title: string
  /** Un emoji mare, afișat pe ecranul de start. */
  icon: string
  /** Culoarea plăcii de pe ecranul de start (ex: "#7cc6fe"). */
  color: string
  category: Category
  /** O propoziție scurtă, rostită la începutul jocului (dacă sunetul e pornit). */
  instruction: string
  /** Username-urile de GitHub ale autorilor. */
  authors: string[]
  component: ComponentType<GameProps>
}

/** Cine vede panoul: copiii (pe ecranul de start) sau învățătoarea (după PIN). */
export type PanelAudience = 'copii' | 'invatatoare'

export const PANEL_AUDIENCES: readonly PanelAudience[] = ['copii', 'invatatoare']

export interface PanelProps {
  /** Toate jocurile din aplicație, de ex. pentru statistici sau pentru activare/dezactivare. */
  games: readonly GameModule[]
  onClose: () => void
}

/** Descrierea unui panou. Fiecare panou o exportă ca `default` din `src/panels/<id>/index.ts`. */
export interface PanelModule {
  id: string
  title: string
  icon: string
  color: string
  audience: PanelAudience
  authors: string[]
  component: ComponentType<PanelProps>
}
