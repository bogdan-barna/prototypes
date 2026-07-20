# Magyar bérkalkulátor 2026

Önálló, szerver nélkül futó webalkalmazás magyarországi standard munkaviszonyhoz. A felület minden mezőmódosítás után automatikusan újraszámolja az eredményt.

## Indítás

Nyisd meg az `index.html` fájlt egy modern böngészőben.

## Fő funkciók

- automatikus bruttó → nettó számítás, külön gombnyomás nélkül;
- automatikus nettó → bruttó visszaszámítás;
- a számítási irány váltásakor a beviteli mező értéke automatikusan átvált bruttóról nettóra, illetve nettóról bruttóra;
- 2026-os minimálbér és garantált bérminimum mindkét számítási irányban;
- nettó → bruttó módban a kiválasztott bérminimum törvényi alsó határként működik;
- a minimálbér-gyorsgombok az aktuális bruttó → nettó vagy nettó → bruttó módnak megfelelő összeget töltik be;
- részmunkaidős bérminimum-arányosítás;
- 15% SZJA, 18,5% TB-járulék és 13% szocho;
- 25 év alattiak kedvezménye;
- 30 év alatti és többgyermekes anyák kedvezménye;
- személyi kedvezmény;
- első házasok kedvezménye;
- családi adó- és járulékkedvezmény;
- saját jogú nyugdíjas munkavállaló;
- betegszabadság 15 munkanapos éves kerettel és 70%-os becsült díjazással;
- 50% vagy 60% mértékű táppénz, 2026-os napi maximummal;
- fekvőbeteg-ellátás, veszélyeztetett várandósság és gyermekápolási táppénz;
- munkáltatói táppénz-hozzájárulás;
- ledolgozott bér, betegszabadság, táppénz, nettó kifizetés és munkáltatói költség részletes bontása;
- eredmény másolása és nyomtatása;
- Inter betűtípus és `#e1415a` elsődleges szín;
- reszponzív mobil- és asztali nézet.

## Betegszabadság és táppénz

A modulban külön megadható:

- a keresőképtelenség típusa;
- a havi munkanapok száma;
- a betegszabadság munkanapjai és az évben korábban felhasznált keret;
- a táppénzes munkanapok és naptári napok száma;
- a táppénz irányadó jövedelme és naptári napjai;
- a legalább 730 napos folyamatos biztosítási idő.

A betegszabadság napi összegét az MVP a havi szerződéses bérből becsüli. A tényleges távolléti díj, a táppénzalap kiválasztása és a jogosultsági idő bérszámfejtési ellenőrzést igényelhet.

## Tesztek

```bash
node tests.js
```

## Hivatalos források

- 426/2025. (XII. 23.) Korm. rendelet – minimálbér és garantált bérminimum
- NAV – SZJA adóalap-kedvezmények, 2026
- NAV – 25 év alatti fiatalok kedvezménye
- NAV – családi kedvezmény 2026
- NAV – nyugdíj melletti munkavégzés
- Magyar Államkincstár – táppénz és betegszabadság
- Magyar Államkincstár – gyermekápolási táppénz

## Hatókör

A kalkulátor tájékoztató MVP, és nem helyettesít bérszámfejtő programot vagy szakértői ellenőrzést. Nem kezeli többek között a baleseti táppénzt, több párhuzamos jogviszonyt, több eltérő keresőképtelenségi igazolást ugyanabban a hónapban, a CSED-et, GYED-et, EKHO-t, cafeteriát, letiltásokat vagy a teljes bevallási logikát.
