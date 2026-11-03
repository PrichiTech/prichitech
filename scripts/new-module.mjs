// Creează un joc sau un panou nou pornind de la template.
//   npm run new-game  -- nume-joc   "Titlul jocului"
//   npm run new-panel -- nume-panou "Titlul panoului"
import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const [kind, id, title] = process.argv.slice(2)
const folder = kind === 'panel' ? 'panels' : 'games'
const component = kind === 'panel' ? 'Panel' : 'Game'

function fail(message) {
  console.error(`\n❌ ${message}\n`)
  process.exit(1)
}

if (!id) fail(`Lipsește numele. Exemplu: npm run new-${kind} -- ce-a-disparut "Ce a dispărut?"`)
if (!/^[a-z][a-z0-9-]*$/.test(id))
  fail('Numele poate conține doar litere mici fără diacritice, cifre și „-” (ex: ce-a-disparut).')

const source = join('src', folder, '_template')
const target = join('src', folder, id)
if (existsSync(target)) fail(`Există deja folderul ${target}.`)

const pascal = id
  .split('-')
  .map((part) => part[0].toUpperCase() + part.slice(1))
  .join('')
const templateComponent = kind === 'panel' ? 'TemplatePanel' : 'TemplateGame'

cpSync(source, target, { recursive: true })
for (const file of readdirSync(target)) {
  const path = join(target, file)
  let text = readFileSync(path, 'utf8')
  text = text
    .replaceAll("'_template'", `'${id}'`)
    .replaceAll(templateComponent, `${pascal}${component}`)
    .replace(/\/\/ Folderele care încep cu „_”[^\n]*\n\/\/[^\n]*\n/, '')
  if (title) text = text.replaceAll('Titlul jocului', title).replaceAll('Titlul panoului', title)
  writeFileSync(path, text)
}

console.log(`
✅ Gata! Am creat ${target}

Pașii următori:
  1. Deschideți ${join(target, 'index.ts')} și completați icon, color, category, authors.
  2. Scrieți jocul în ${join(target, `${component}.tsx`)} (acum conține un exemplu care merge).
  3. Porniți aplicația cu: npm run dev
  4. Înainte de commit rulați: npm run check
`)
