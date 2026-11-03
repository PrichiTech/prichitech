# Arhitectura

## Pe scurt

Aplicația e un **nucleu** mic plus **module** (jocuri și panouri) care se înregistrează automat.

```
              ┌────────────────────────── src/core (nucleu) ─────────────────────────┐
  #/          │  HomeScreen ── plăci generate din registru                            │
  #/joc/:id   │  GameHost   ── 🏠 + 🔊 + rostirea instrucțiunii + ecranul cu stele    │
  #/panou/:id │  PanelHost  ── ⬅ + PIN pentru panourile învățătoarei                  │
              │  registry   ── import.meta.glob('games/*/index.ts', 'panels/*/...')   │
              │  settings, progress (localStorage) · audio (WebAudio + vibrație + TTS)│
              └──────────────▲────────────────────────────────▲───────────────────────┘
                             │ GameModule                     │ PanelModule
                ┌────────────┴───────────┐        ┌───────────┴───────────┐
                │ src/games/perechi/     │  ...   │ src/panels/invatatoare│ ...
                │ src/games/intrusul/    │        │ src/panels/album      │
                └────────────────────────┘        └───────────────────────┘
                     folosesc doar @/core și @/ui
```

## De ce așa

| Decizie                                                        | Motiv                                                                                                                     |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **PWA** (aplicație web instalabilă) în loc de aplicație nativă | merge pe orice tabletă (Android, iPad), fără magazin; offline prin service worker; colegii nu au nevoie de Android Studio |
| **React + TypeScript**                                         | cel mai răspândit; contractul jocului e verificat de compilator                                                           |
| **Înregistrare automată** a modulelor                          | un joc nou = un folder nou; nimeni nu editează fișiere comune, deci nu apar conflicte                                     |
| **CSS Modules** pentru jocuri                                  | stilurile unui joc nu pot strica alt joc                                                                                  |
| **Fără server**, date în localStorage                          | nu colectăm date despre copii (GDPR); nu avem ce întreține                                                                |
| **Navigare cu `#`**                                            | merge pe GitHub Pages și offline, fără configurare de server                                                              |
| **Sunete generate** (WebAudio)                                 | nu avem fișiere audio de licențiat; pornesc instant                                                                       |

## Contractul unui joc

Definit în [`src/core/types.ts`](../src/core/types.ts).

```ts
interface GameModule {
  id: string // = numele folderului
  title: string // pentru învățătoare
  icon: string // emoji pe ecranul de start
  color: string
  category: 'memorie' | 'atentie' | 'numere' | 'litere'
  instruction: string // rostită la început
  authors: string[]
  component: ComponentType<GameProps>
}

interface GameProps {
  difficulty: 1 | 2 | 3
  onFinish(result: { stars: 1 | 2 | 3; correct: number; mistakes: number }): void
}
```

Ce face aplicația pentru joc, ca jocul să nu le reimplementeze:

- butonul 🏠 și butonul 🔊 (repetă instrucțiunea);
- rostirea instrucțiunii la început (respectând modul de sunet ales de învățătoare);
- măsurarea duratei și salvarea rezultatului;
- ecranul „Bravo!” cu stele, confetti și butoanele 🔁 / 🏠;
- dacă jocul are o eroare, aplicația nu se blochează (ErrorBoundary).

## Contractul unui panou

```ts
interface PanelModule {
  id: string
  title: string
  icon: string
  color: string
  audience: 'copii' | 'invatatoare' // pe ecranul de start / după PIN
  authors: string[]
  component: ComponentType<{ games: GameModule[]; onClose(): void }>
}
```

## Sunetul

Trei moduri, alese de învățătoare:

| Mod       | Efecte sonore | Instrucțiune la început | Butonul 🔊 |
| --------- | ------------- | ----------------------- | ---------- |
| Pornit    | da            | da                      | da         |
| Mod clasă | nu            | nu                      | da         |
| Oprit     | nu            | nu                      | ascuns     |

Vibrația (Android) și feedback-ul vizual funcționează în toate modurile.

## Verificări automate

| Verificare         | Ce prinde                                                        |
| ------------------ | ---------------------------------------------------------------- |
| `oxlint`           | greșeli frecvente de JavaScript/React                            |
| `tsc`              | jocul nu respectă contractul, tipuri greșite                     |
| `check-boundaries` | un joc importă din alt joc sau din interiorul nucleului          |
| `vitest`           | modul fără `export default`, id diferit de folder, câmpuri lipsă |
| GitHub Actions     | toate cele de mai sus, la fiecare pull request                   |

## Ce am revizui dacă proiectul crește

- **Profiluri de copii** (avatar-animal), ca învățătoarea să vadă progresul pe copil, nu pe tabletă.
- **Voce înregistrată** în locul vocii sintetice, dacă pe tabletele școlii nu există voce românească.
- **Încărcare la cerere** a jocurilor (`import()` lazy), dacă ajungem la peste 20 de jocuri.
- **Împachetare ca APK** (Capacitor), dacă tabletele școlii nu permit instalarea PWA.
