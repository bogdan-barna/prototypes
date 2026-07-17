# Calculator salariu România 2026

Aplicație web statică, fără backend, pentru:

- calcul salariu brut → net;
- calcul salariu net → brut;
- conversia automată a valorii la schimbarea modului brut/net;
- salariul minim funcționează ca valoare rapidă și limită minimă în ambele sensuri;
- CAS, CASS, impozit pe venit și CAM;
- deducerea personală de bază și deducerile suplimentare;
- suma netaxabilă aplicabilă salariului minim în 2026;
- verificarea salariului minim general;
- costul efectiv al angajatorului;
- calcul orientativ pentru concedii medicale.

## Pornire

Deschideți `index.html` direct într-un browser modern. Aplicația nu are nevoie de server, bază de date sau instalare.

Pentru publicare, întregul folder poate fi încărcat pe Netlify, Vercel, GitHub Pages sau pe un server web obișnuit.

## Interfață

- font: Inter (Google Fonts, cu fallback sans-serif);
- culoare principală: `#e1415a`;
- recalculare automată la modificarea câmpurilor.

## Concedii medicale incluse

Modulul poate calcula un singur tip de certificat/episod în luna selectată și include:

- media zilnică pe baza veniturilor asigurate și a zilelor lucrate din ultimele 6 luni;
- boală obișnuită / accident în afara muncii: 55%, 65% sau 75%, în funcție de durata episodului;
- boală cardiovasculară eligibilă: 75%;
- afecțiuni grave și urgențe medico-chirurgicale: 100%;
- carantină sau izolare: 100%;
- sarcină și lăuzie: 85%;
- îngrijirea copilului bolnav: 85%;
- îngrijirea pacientului oncologic: 85%;
- risc maternal: 75%;
- diminuarea cu o zi lucrătoare aplicabilă certificatelor emise în perioada 1 februarie 2026–31 decembrie 2027, cu excepțiile selectate sau prevăzute de lege;
- repartizarea indemnizației între angajator și FNUASS;
- CAS, CASS, impozit și CAM, în funcție de tipul selectat;
- costul efectiv al angajatorului și suma recuperabilă din FNUASS.

Pentru baza de calcul trebuie introduse valorile reale din adeverința de venit. Când este bifat salariul minim și câmpul nu a fost modificat manual, aplicația completează automat istoricul minim pentru cele 6 luni anterioare.

## Teste

Cu Node.js instalat:

```bash
node tests.js
```

Cazurile de control includ:

- 4.325 lei brut în iulie 2026 → 2.699 lei net și 4.418 lei cost angajator;
- 4.050 lei brut în ianuarie 2026 → 2.574 lei net și 4.134 lei cost angajator;
- calcul invers 2.699 lei net → 4.325 lei brut;
- exemplul oficial cu 20 de zile de boală obișnuită: 2.862 lei indemnizație brută;
- exemplul oficial cu 5 zile pentru îngrijirea copilului bolnav: 683 lei indemnizație brută;
- maternitate fără diminuarea cu o zi.

## Reguli salariale incluse

- 1 ianuarie–30 iunie 2026: salariu minim 4.050 lei, sumă netaxabilă 300 lei, plafon 4.300 lei.
- 1 iulie–31 decembrie 2026: salariu minim 4.325 lei, sumă netaxabilă 200 lei, plafon 4.600 lei.
- CAS 25%, CASS 10%, impozit pe venit 10%, CAM 2,25%.
- Deducerea personală conform grilei procentuale din art. 77 al Codului fiscal.

## Domeniu și limitări

Calculatorul tratează un contract individual de muncă standard și un singur certificat/episod medical în luna selectată. Nu tratează complet:

- contracte part-time și contribuția minimă aferentă;
- construcții și alte salarii minime sectoriale;
- accidente de muncă și boli profesionale;
- mai multe certificate de tipuri diferite în aceeași lună;
- programe de lucru atipice și toate situațiile speciale D112;
- tichete și beneficii extrasalariale;
- pensii facultative, cotizații sindicale sau popriri;
- persoane cu handicap grav/accentuat;
- condiții de muncă speciale/deosebite;
- toate excepțiile CAS/CASS și situațiile de stagiu incomplet.

Înainte de utilizarea într-un flux real de salarizare, rezultatele și regulile trebuie validate de un contabil sau specialist payroll.

## Surse oficiale

- HG nr. 146/2026: https://legislatie.just.ro/Public/DetaliiDocumentAfis/308231
- HG nr. 1.506/2024: https://legislatie.just.ro/Public/DetaliiDocumentAfis/291450
- OUG nr. 89/2025: https://legislatie.just.ro/Public/DetaliiDocumentAfis/305817
- Codul fiscal actualizat: https://legislatie.just.ro/Public/DetaliiDocumentAfis/309361
- OUG nr. 158/2005: https://legislatie.just.ro/Public/DetaliiDocument/66305
- Normele de aplicare OUG nr. 158/2005: https://legislatie.just.ro/Public/DetaliiDocument/196683
- Ordinul nr. 521/500/2026: https://legislatie.just.ro/Public/DetaliiDocumentAfis/307943

Reguli verificate la 15 iulie 2026.
