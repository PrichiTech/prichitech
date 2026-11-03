# Instrucțiuni pentru asistenți de cod

Proiect: **PrichiTech**, minijocuri de atenție și memorie pentru copii de 5–6 ani (clasa pregătitoare), pe tabletă.
Stack: React 19 + TypeScript + Vite, PWA. Fără backend; datele stau în localStorage.

## Limite stricte

1. Modifică **doar** fișierele din folderul modulului la care lucrezi: `src/games/<id>/` sau `src/panels/<id>/`.
2. **Nu modifica** `src/core/`, `src/ui/`, `src/styles/`, `package.json`, `vite.config.ts`, `tsconfig*.json`, `.github/`, `scripts/` și jocurile altor colegi.
3. Nu adăuga dependențe npm. Dacă e absolut nevoie, spune-i utilizatorului să ceară team lead-ului.
4. Un modul importă **doar** din: `react`, `@/core`, `@/ui` și fișiere relative din propriul folder. (Verificat de `npm run check:boundaries`.)
5. Stilurile se scriu în `*.module.css` din folderul modulului (CSS Modules), nu în fișiere CSS globale.

## Contractul unui joc

`src/games/<id>/index.ts` exportă `default` un `GameModule` (vezi `src/core/types.ts`):

```ts
const game: GameModule = {
  id: '<id>', // identic cu numele folderului
  title: 'Titlu', // pentru învățătoare
  icon: '🧦', // emoji
  color: '#ffd6a5', // culoarea plăcii de pe ecranul de start
  category: 'numere', // 'memorie' | 'atentie' | 'numere' | 'litere'
  instruction: 'Găsește perechea fiecărei șosete!', // rostită la început
  authors: ['username-github'],
  component: SocksGame,
}
export default game
```

Componenta primește `{ difficulty: 1 | 2 | 3, onFinish(result) }` și apelează `onFinish({ stars: 1 | 2 | 3, correct, mistakes })` **o singură dată**, la final. Rama aplicației (butonul 🏠, 🔊, ecranul cu stele, salvarea rezultatului) e deja făcută: jocul nu o reimplementează.

Din `@/core`: `playSound('tap' | 'success' | 'oops' | 'win')`, `speak(text)`, `useLater()` (în loc de `setTimeout`), `shuffle`, `pickRandom`, `randomInt`, tipuri.
Din `@/ui`: `TapHint` (mânuță „atinge aici”), `ProgressDots`, `StarsView`, `Mascot`, `IconButton`, `Confetti`; clase CSS globale `ui-pop`, `ui-shake`, `ui-bounce`, `ui-float`.

Exemple complete: `src/games/perechi/`, `src/games/intrusul/`, `src/games/_template/`.

## Reguli de design pentru copii (obligatorii)

- **Fără text pentru copii.** Ei nu citesc. Doar imagini, emoji, culori, animații.
- **Trebuie să se poată juca fără sunet** (în clasă sunt 20+ tablete). Instrucțiunea se arată vizual (`TapHint`, animații, exemplu); sunetul doar ajută.
- Ținte mari: minim ~120px. Doar atingere simplă; fără dublu-tap, apăsare lungă sau gesturi fine.
- Fără timer, fără „ai pierdut”, fără vieți. Greșeala = `playSound('oops')` + `ui-shake`, apoi copilul încearcă din nou.
- Fiecare atingere primește feedback imediat.
- Sesiune scurtă: 4–8 runde, 2–4 minute. Progresul se arată cu `ProgressDots`.
- Ecran landscape (tabletă orizontală). Testează la 1280×800.
- Conținut: numere doar până la 31, matematică doar par/impar, litere doar recunoaștere (litere mari de tipar).

## Înainte de a termina

Rulează `npm run check` și repară toate erorile. Testează jocul cu `npm run dev` la toate cele 3 dificultăți.
