import { CATEGORIES, PANEL_AUDIENCES, type GameModule, type PanelModule } from './types'

/*
 * Jocurile și panourile se înregistrează AUTOMAT: orice folder din `src/games/` sau `src/panels/`
 * care are un `index.ts` cu `export default` apare în aplicație.
 * Folderele care încep cu `_` (ex: `_template`) sunt ignorate.
 */
const gameFiles = import.meta.glob<{ default?: GameModule }>(
  ['../games/*/index.ts', '!../games/_*/index.ts'],
  { eager: true },
)
const panelFiles = import.meta.glob<{ default?: PanelModule }>(
  ['../panels/*/index.ts', '!../panels/_*/index.ts'],
  { eager: true },
)

/** Problemele găsite la înregistrare. Testul `registry.test.ts` cere ca lista să fie goală. */
export const problems: string[] = []

function folderOf(path: string) {
  return path.split('/').at(-2) ?? ''
}

function commonProblems(item: GameModule | PanelModule, folder: string) {
  const found: string[] = []
  if (item.id !== folder) found.push(`id-ul este "${item.id}", dar trebuie să fie "${folder}"`)
  if (!item.title?.trim()) found.push('lipsește "title"')
  if (!item.icon?.trim()) found.push('lipsește "icon"')
  if (!item.color?.trim()) found.push('lipsește "color"')
  if (!Array.isArray(item.authors) || item.authors.length === 0) found.push('lipsește "authors"')
  if (typeof item.component !== 'function' && typeof item.component !== 'object')
    found.push('"component" nu este o componentă React')
  return found
}

function collect<T extends GameModule | PanelModule>(
  files: Record<string, { default?: T }>,
  kind: string,
  extraChecks: (item: T) => string[],
): T[] {
  const items: T[] = []
  for (const [path, module] of Object.entries(files)) {
    const folder = folderOf(path)
    const item = module.default
    const found = item
      ? [...commonProblems(item, folder), ...extraChecks(item)]
      : ['index.ts nu are "export default"']
    if (found.length > 0) {
      problems.push(...found.map((problem) => `${kind} "${folder}": ${problem}`))
      continue
    }
    items.push(item!)
  }
  return items.sort((a, b) => a.id.localeCompare(b.id))
}

export const games = collect(gameFiles, 'Jocul', (game) => {
  const found: string[] = []
  if (!CATEGORIES.includes(game.category)) found.push(`categoria "${game.category}" nu există`)
  if (!game.instruction?.trim()) found.push('lipsește "instruction"')
  return found
})

export const panels = collect(panelFiles, 'Panoul', (panel) =>
  PANEL_AUDIENCES.includes(panel.audience) ? [] : [`audience "${panel.audience}" nu există`],
)

if (problems.length > 0) {
  console.error('[PrichiTech] Module ignorate:\n' + problems.join('\n'))
}

export function findGame(id: string) {
  return games.find((game) => game.id === id)
}

export function findPanel(id: string) {
  return panels.find((panel) => panel.id === id)
}
