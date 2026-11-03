<p align="center"><img src="public/favicon.svg" width="110" alt="Prichi" /></p>

<h1 align="center">PrichiTech</h1>

<p align="center">
Jocuri de <b>atenție</b> și <b>memorie</b> pentru copiii din clasa pregătitoare, pe tabletă.<br/>
Proiect pentru disciplina <i>Interacțiune Om-Calculator</i>, 2025–2026.
</p>

<p align="center"><b>▶ Aplicația online: https://prichitech.github.io/prichitech/</b></p>

---

## Pentru cine e

| Utilizator     | Ce știe                                               | Ce face în aplicație                                    |
| -------------- | ----------------------------------------------------- | ------------------------------------------------------- |
| Copil, 5–6 ani | nu citește; numere până la 31, câteva litere de tipar | joacă minijocuri, primește steluțe                      |
| Învățătoarea   | —                                                     | alege jocurile, dificultatea, sunetul; vede rezultatele |

## Pornire rapidă

Aveți nevoie de [Node.js LTS](https://nodejs.org), [Git](https://git-scm.com) și [VS Code](https://code.visualstudio.com).

```bash
git clone https://github.com/PrichiTech/prichitech.git
cd prichitech
npm install
npm run dev
```

Deschideți adresa afișată (de obicei http://localhost:5173). Ca să testați pe o **tabletă reală**, conectați-o la același Wi-Fi și deschideți adresa „Network” afișată de `npm run dev`.

## Comenzi

| Comandă                                   | Ce face                                                                     |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| `npm run dev`                             | pornește aplicația local                                                    |
| `npm run new-game -- nume-joc "Titlu"`    | creează un joc nou din template                                             |
| `npm run new-panel -- nume-panou "Titlu"` | creează un panou nou din template                                           |
| `npm run check`                           | **rulați înainte de fiecare commit**: lint, tipuri, reguli de import, teste |
| `npm run build`                           | construiește versiunea finală în `dist/`                                    |
| `npm run format`                          | aranjează codul automat (Prettier)                                          |

## Structura proiectului

```
src/
├── core/      🔒 nucleul aplicației (navigare, salvare, sunet, rama jocurilor)
├── ui/        🔒 componente comune (butoane, mascota, stele, mânuța de indicație)
├── games/     🎮 un folder = un joc  (fiecare are un singur proprietar)
├── panels/    📋 un folder = un panou (ex: setările învățătoarei, albumul copiilor)
└── styles/    🔒 stiluri globale
docs/          📚 documentația proiectului (cerințe, alternative, evaluări, sesiuni cu clientul)
```

Jocurile se înregistrează **automat**: un folder nou în `src/games/` apare singur pe ecranul de start.

## Documentație

- [Cum contribui (Git pas cu pas)](CONTRIBUTING.md)
- [Arhitectura și contractul unui joc](docs/ARHITECTURA.md)
- [Reguli de design pentru copii](docs/REGULI-UX.md)
- [Plan, roluri și calendar](docs/PLAN-ECHIPA.md)
- [Toate documentele pentru evaluare](docs/README.md)
