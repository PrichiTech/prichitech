# Reguli de design pentru copii (5–6 ani)

Se aplică fiecărui joc. Sunt verificate la review, pe checklist-ul din pull request.

## 1. Fără text pentru copii

Copiii din pregătitoare nu citesc. Orice informație pentru copil se transmite prin **imagine, culoare, animație sau sunet**.
Textul (titlul jocului, etichetele) e doar pentru învățătoare și e mic.

## 2. Merge și fără sunet

Într-o clasă sunt 20+ tablete; dacă toate vorbesc deodată, e haos. De aceea:

- instrucțiunea se **arată**: mânuța `TapHint`, o demonstrație, ținta evidențiată;
- sunetul doar **completează**; învățătoarea îl poate opri sau pune pe „Mod clasă”;
- feedback-ul are mereu și o parte vizuală (`ui-pop`, `ui-shake`, culori) și vibrație.

**Test:** puneți sunetul pe „Oprit” și dați tableta cuiva care nu știe jocul. Dacă nu înțelege ce are de făcut în 10 secunde, instrucțiunea vizuală nu e suficientă.

## 3. Ținte mari, gesturi simple

- butoane și obiecte de cel puțin **120px** (cam 2 cm pe tabletă);
- spațiu între ținte (minim 20px), ca să nu atingă din greșeală vecinul;
- doar **atingere simplă**; fără dublu-tap, apăsare lungă, pinch;
- tragerea (drag) doar la jocurile unde e esențială, cu ținte foarte mari.

## 4. Nu se pierde niciodată

- fără timer, fără vieți, fără „Game over”;
- greșeala: sunet blând (`oops`) + tremurat (`ui-shake`), apoi copilul încearcă din nou;
- la final primește mereu cel puțin o stea;
- după câteva secunde fără nicio atingere, apare un ajutor (mânuța pe răspuns).

## 5. Feedback imediat

Orice atingere produce ceva vizibil în mai puțin de 0,1 s: o animație, o schimbare de culoare, un sunet.

## 6. Scurt și previzibil

- 4–8 runde, 2–4 minute;
- progresul se vede (`ProgressDots`);
- 🏠 este mereu în colțul stânga-sus, 🔊 în dreapta-sus.

## 7. Conținut potrivit vârstei

- numere doar până la **31**; matematică doar **par/impar**;
- litere: doar **recunoaștere**, litere mari de tipar (fontul Andika);
- imagini familiare: animale, fructe, jucării, obiecte de acasă și de la școală;
- nu ne bazăm doar pe culoare (unii copii sunt daltoniști): adăugăm și formă sau simbol.

## 8. Tableta stă orizontal

Proiectăm pentru **landscape, 1280×800**. În portret, aplicația cere rotirea tabletei.
