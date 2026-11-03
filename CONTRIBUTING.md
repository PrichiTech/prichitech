# Cum contribui

Ghid pas cu pas, pentru cine nu a mai lucrat în echipă pe Git.

## Regula de aur

> **Lucrezi doar în folderul tău**: `src/games/<jocul-tău>/` sau `src/panels/<panoul-tău>/`.
>
> `src/core/`, `src/ui/`, `src/styles/`, `package.json` și fișierele de configurare le modifică doar team lead-ul.
> Dacă ai nevoie de ceva acolo (o componentă nouă, o funcție comună), deschide un **issue** și explică ce îți trebuie.

Verificarea automată (`npm run check`) pică dacă jocul tău importă din alt joc sau din fișierele interne ale aplicației.

## O singură dată, la început

```bash
git config --global user.name "Prenume Nume"
git config --global user.email "emailul-de-pe-github@exemplu.com"
git clone https://github.com/PrichiTech/prichitech.git
cd prichitech
npm install
```

Folosește în `user.email` același email ca pe contul de GitHub, altfel commit-urile nu apar pe profilul tău.

## De fiecare dată când lucrezi

```bash
# 1. Ia ultima versiune
git checkout main
git pull

# 2. Fă-ți un branch (prima dată) sau mută-te pe el
git checkout -b joc/ce-a-disparut        # prima dată
git checkout joc/ce-a-disparut           # după aceea
git merge main                           # aduci ce s-a schimbat între timp

# 3. Lucrează și testează
npm run dev

# 4. Verifică înainte de commit
npm run check

# 5. Salvează și trimite
git add src/games/ce-a-disparut
git commit -m "feat(ce-a-disparut): runde cu 3 obiecte"
git push -u origin joc/ce-a-disparut
```

Apoi intri pe GitHub și apeși **Compare & pull request**. Completezi checklist-ul din descriere.

## Nume pentru branch-uri

| Tip          | Exemplu                     |
| ------------ | --------------------------- |
| joc          | `joc/ce-a-disparut`         |
| panou        | `panou/album`               |
| documentație | `docs/evaluare-utilizatori` |
| reparație    | `fix/perechi-dublu-click`   |

## Mesaje de commit

Format: `tip(zona): ce ai făcut`, la prezent, scurt.

- `feat(umbre): nivelul greu cu 6 umbre`
- `fix(perechi): cartonașele nu se mai întorc de două ori`
- `docs: interviul cu învățătoarea din 10 noiembrie`
- `style(par-impar): culori mai contrastante`

## Pull request (PR)

- Un PR = un singur lucru (un joc, o reparație, un document).
- PR-ul nu se poate unifica până nu trec verificările automate și nu îl aprobă team lead-ul.
- Dacă primești comentarii, faci modificările pe același branch și dai iar `git push`: PR-ul se actualizează singur.

## Dacă te-ai blocat

1. Citește mesajul de eroare din `npm run check`; de obicei spune exact fișierul și problema.
2. Uită-te la jocurile exemplu: `src/games/perechi/` și `src/games/intrusul/`.
3. Scrie pe grup sau deschide un issue cu eticheta `ajutor`.
