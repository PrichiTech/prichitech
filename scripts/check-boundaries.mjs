// Verifică faptul că fiecare joc și panou importă DOAR:
//   - 'react'
//   - '@/core' și '@/ui'
//   - fișiere din propriul folder (ex: './Game.module.css', './assets/pisica.png')
// Așa nu poate un modul să depindă de alt joc sau de fișierele interne ale aplicației.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'

const ROOTS = ['src/games', 'src/panels']
const ALLOWED = new Set(['react', '@/core', '@/ui'])
const IMPORT = /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(?\s*['"]([^'"]+)['"]/g

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? files(path) : [path]
  })
}

const errors = []
for (const root of ROOTS) {
  for (const module of readdirSync(root)) {
    const moduleDir = resolve(root, module)
    if (!statSync(moduleDir).isDirectory()) continue
    for (const file of files(moduleDir).filter((f) => /\.(ts|tsx|css)$/.test(f))) {
      const text = readFileSync(file, 'utf8')
      for (const match of text.matchAll(IMPORT)) {
        const spec = match[1] ?? match[2]
        if (spec.startsWith('.')) {
          const target = resolve(dirname(file), spec)
          if (!target.startsWith(moduleDir + sep)) {
            errors.push(
              `${relative('.', file)}: importă "${spec}", care e în afara folderului ${root}/${module}`,
            )
          }
        } else if (!ALLOWED.has(spec)) {
          errors.push(
            `${relative('.', file)}: importă "${spec}". Sunt permise doar: react, @/core, @/ui și fișiere din propriul folder.`,
          )
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error('\n❌ Importuri nepermise:\n  ' + errors.join('\n  ') + '\n')
  process.exit(1)
}
console.log('✅ Toate jocurile și panourile respectă regulile de import.')
