/** Un număr întreg aleator între 0 și max - 1. */
export function randomInt(max: number) {
  return Math.floor(Math.random() * max)
}

/** Un element aleator din listă. */
export function pickRandom<T>(items: readonly T[]): T {
  return items[randomInt(items.length)]
}

/** O copie amestecată a listei (lista originală rămâne neschimbată). */
export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
