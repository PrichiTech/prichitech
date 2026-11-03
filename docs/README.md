# Documentație

Aici se adună tot ce se evaluează în afară de cod.

| Folder                         | Conținut                                                           | Criteriu din grilă           |
| ------------------------------ | ------------------------------------------------------------------ | ---------------------------- |
| [`client/`](client/)           | întrebări, notițe și concluzii din fiecare sesiune cu învățătoarea | 6. Sesiuni de feedback       |
| [`cerinte/`](cerinte/)         | personas, scenarii, cerințe funcționale și nefuncționale           | 9. UCD                       |
| [`alternative/`](alternative/) | schițe, prototipuri pe hârtie, comparații între variante           | 2. Alternative de proiectare |
| [`evaluare/`](evaluare/)       | protocolul de testare cu copiii, observații, rezultate             | 4. Evaluare cu utilizatori   |
| [`prezentari/`](prezentari/)   | slide-urile fiecărei prezentări                                    | 1, 3, 8                      |

Documente tehnice:

- [Arhitectura](ARHITECTURA.md)
- [Reguli de design pentru copii](REGULI-UX.md)

## Decizii de design înregistrate

| Data       | Decizie                                                     | Alternative                              | De ce                                                      |
| ---------- | ----------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------- |
| 3 nov 2026 | PWA (aplicație web instalabilă)                             | aplicație nativă Android, Flutter, Unity | merge pe orice tabletă, fără instalări grele pentru echipă |
| 3 nov 2026 | Instrucțiuni vizuale + sunet opțional, setat de învățătoare | doar audio; doar vizual                  | 20+ tablete în aceeași clasă ar face zgomot                |
| 3 nov 2026 | Fără conturi, date doar pe tabletă                          | server cu conturi                        | nu colectăm date despre minori                             |
