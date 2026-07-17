> https://bogdan-barna.github.io/prototypes/salary-calculator/hungarian.html
> 
> https://bogdan-barna.github.io/prototypes/salary-calculator/romanian.html

# Románia és Magyarország

## Bérkalkulátor – jogszabályi és számítási dokumentáció

Összefoglaló a 2026-ban alkalmazandó főbb munkajogi, adó- és társadalombiztosítási szabályokról.

**Állapot:** 2026. július 17.


> [!IMPORTANT]
> **Dokumentum célja**
>
> A dokumentum a romániai és magyarországi bérkalkulátor szakmai hátterét foglalja össze. Bemutatja a számításban használt főbb kulcsokat, kedvezményeket, minimálbéreket, betegszabadsági szabályokat, valamint a kalkulátor hatókörét és korlátait.


> [!WARNING]
> **Jogi figyelmeztetés**
>
> Ez az anyag nem minősül jogi, adózási vagy bérszámfejtési tanácsadásnak. A jogszabályok év közben módosulhatnak, ezért éles bérszámfejtés előtt mindig a hatályos jogszabályszöveget és szakértői kontrollt kell alkalmazni.


# Tartalom

1. [A dokumentáció hatóköre és számítási elvei](#1-a-dokumentáció-hatóköre-és-számítási-elvei)
2. [Vezetői összehasonlítás – Románia és Magyarország](#2-vezetői-összehasonlítás--románia-és-magyarország)
3. [Románia – alkalmazandó 2026-os szabályok](#3-románia--alkalmazandó-2026-os-szabályok)
4. [Magyarország – alkalmazandó 2026-os szabályok](#4-magyarország--alkalmazandó-2026-os-szabályok)
5. [Kalkulátor-karbantartási és verziózási követelmények](#5-kalkulátor-karbantartási-és-verziózási-követelmények)
6. [Hivatalos jogszabályi források](#6-hivatalos-jogszabályi-források)
7. [Rövid megfelelőségi ellenőrzőlista](#7-rövid-megfelelőségi-ellenőrzőlista)

# 1. A dokumentáció hatóköre és számítási elvei
- A dokumentáció alapértelmezett, munkaviszonyban álló alkalmazott havi bérszámítására vonatkozik.
- A bruttó → nettó számítás a munkavállalói levonásokat és az alkalmazható kedvezményeket dolgozza fel.
- A nettó → bruttó számítás iteratív visszakereséssel történik, mivel a kedvezmények és küszöbök miatt nem minden esetben alkalmazható egyetlen zárt képlet.
- A munkáltatói költség a bruttó bér mellett a munkáltató által fizetett közterheket és – ahol releváns – betegszabadsági vagy táppénzhez kapcsolódó terheket tartalmazza.
- A számítás hónaphoz kötött: minden szabályhoz érvényességi kezdő- és záródátumot kell tárolni.
- A kalkulátor eredménye tájékoztató jellegű; a hivatalos bérjegyzéket és bevallást nem helyettesíti.

> [!IMPORTANT]
> **Alapelv a fejlesztésben**
>
> Adókulcsot, minimálbért, kedvezményplafont vagy betegszabadsági százalékot nem szabad véglegesen a felületbe égetni. Ezeket verziózott szabályobjektumban vagy adminisztrálható adatbázisban kell tárolni.


# 2. Vezetői összehasonlítás – Románia és Magyarország
| **Terület**                | **Románia**                                                                                             | **Magyarország**                                                                                   |
|----------------------------|---------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| 2026-os fő minimálbér      | 4 050 lej január–június; 4 325 lej júliustól                                                            | 322 800 Ft egész évben                                                                             |
| Képzettségi bérminimum     | A jelen dokumentum az általános országos minimumot kezeli; ágazati eltérések külön vizsgálandók         | Garantált bérminimum: 373 200 Ft a középfokú végzettséget/szakképzettséget igénylő munkakörökben   |
| Munkavállalói járulék      | CAS 25% + CASS 10%                                                                                      | TB-járulék 18,5%                                                                                   |
| Személyi jövedelemadó      | 10%                                                                                                     | 15%                                                                                                |
| Munkáltatói fő közteher    | CAM 2,25%                                                                                               | Szocho 13%                                                                                         |
| Minimálbéres külön szabály | 300/200 lej adó- és járulékmentes rész feltételekkel                                                    | Nincs általános minimálbéres adómentes rész; kedvezmények személyi/családi jogosultsághoz kötöttek |
| Betegszabadság             | Egészségbiztosítási indemnizáció, több jogcím és százalék; 2026-tól egyes esetekben egynapos csökkentés | Évi 15 munkanap betegszabadság 70%-os távolléti díjjal, majd táppénz 50/60%                        |
| Nettó → bruttó             | Iteratív keresés, személyi levonásokkal és minimálbéres kivétellel                                      | Iteratív keresés, kedvezményekkel és bérminimum alsó határral                                      |

> [!NOTE]
> **Fontos összehasonlítás**
>
> Romániában a minimálbéren foglalkoztatottak speciális, 2026-ra meghatározott adómentes összege külön logikát igényel. Magyarországon a nettó bért elsősorban az életkorhoz, családi helyzethez és személyi jogosultsághoz kötött kedvezmények módosítják.


# 3. Románia – alkalmazandó 2026-os szabályok
*A kalkulátor romániai munkaviszonyra vonatkozó fő jogszabályi háttere.*

## 3.1. Fő jogszabályi keret
- Legea nr. 53/2003 – Codul muncii: a munkaviszony, munkaidő és minimálbér munkajogi alapja.
- Legea nr. 227/2015 – Codul fiscal: a személyi jövedelemadó, CAS, CASS, CAM és a személyi levonások szabályai.
- HG nr. 146/2026: a 2026. július 1-jétől alkalmazandó országos minimálbér.
- OUG nr. 89/2025: a 2026-os minimálbéres 300/200 lejes adó- és járulékmentes rész.
- OUG nr. 158/2005 és módosításai: egészségbiztosítási betegszabadságok és indemnizációk.
- OUG nr. 91/2025, Legea nr. 64/2026 és Ordinul nr. 521/500/2026: a 2026. február 1-jétől alkalmazott egynapos csökkentés és finanszírozási rend.

## 3.2. Minimálbér 2026-ban
| **Időszak**                     | **Havi bruttó minimum** | **Munkaidő / órabér**                | **Kapcsolódó külön szabály**                                    |
|---------------------------------|-------------------------|--------------------------------------|-----------------------------------------------------------------|
| 2026. január 1. – június 30.   | 4 050 lej               | Teljes munkaidő                      | Legfeljebb 300 lej/hó adó- és járulékmentes rész, feltételekkel |
| 2026. július 1. – december 31. | 4 325 lej               | Átlag 166,667 óra/hó; 25,949 lej/óra | Legfeljebb 200 lej/hó adó- és járulékmentes rész, feltételekkel |

> [!IMPORTANT]
> **Minimálbér-ellenőrzés**
>
> A minimálbér az alapbérre vonatkozik, pótlékok és egyéb kiegészítések nélkül. A kalkulátor hónap alapján válassza ki a megfelelő minimálbért, és teljes munkaidő esetén figyelmeztessen az alacsonyabb bruttó alapbérre.


## 3.3. Standard munkavállalói és munkáltatói közterhek
| **Tétel**                                  | **Standard mérték** | **Fizető / szerep**   | **Kalkulátori kezelés**                                           |
|--------------------------------------------|---------------------|-----------------------|-------------------------------------------------------------------|
| CAS – társadalombiztosítási/nyugdíjjárulék | 25%                 | Munkavállalói levonás | A járulékalap 25%-a; egyes indemnizációknál eltérő alap lehet     |
| CASS – egészségbiztosítási járulék         | 10%                 | Munkavállalói levonás | A járulékalap 10%-a; betegszabadság jogcímétől függhet            |
| Impozit pe venit – jövedelemadó            | 10%                 | Munkavállalói levonás | A CAS, CASS és levonások után fennmaradó adóalapra                |
| CAM – munkabiztosítási hozzájárulás        | 2,25%               | Munkáltatói közteher  | A törvény szerinti CAM-alapra; a munkáltatói teljes költség része |

### Standard bruttó → nettó számítási sorrend
1. A hónaphoz tartozó jogszabályverzió és minimálbér meghatározása.
2. Az alkalmazható 300 vagy 200 lejes adómentes rész ellenőrzése és szükség szerinti arányosítása.
3. CAS és CASS meghatározása a releváns járulékalapból.
4. Személyi és kiegészítő levonások alkalmazása.
5. A 10%-os jövedelemadó kiszámítása.
6. Nettó bér = teljes bruttó kifizetés – CAS – CASS – jövedelemadó.
7. Munkáltatói költség = munkáltatót terhelő bruttó rész + CAM, figyelembe véve a betegszabadság finanszírozását.

## 3.4. A 300/200 lejes minimálbéres adómentes rész
- 2026 január–június: legfeljebb 300 lej/hó.
- 2026 július–december: legfeljebb 200 lej/hó.
- A munkavállaló teljes munkaidős munkaviszonyban dolgozik, és ez a funcția de bază – alapmunkahely.
- A munkaszerződésben szereplő alapbér pontosan az adott hónapban hatályos országos minimálbér.
- A figyelembe vett havi bruttó jövedelem legfeljebb 4 300 lej az első félévben, illetve 4 600 lej a második félévben, a jogszabályban kizárt juttatások figyelembevételével.
- Töredékhónap, belépés, kilépés vagy a minimálbéres időszak részleges fennállása esetén az összeget arányosítani kell.
- Ha a szerződéses alapbért a jogszabály által tiltott módon csökkentették, a kedvezmény nem alkalmazható.

> [!IMPORTANT]
> **Fejlesztési követelmény**
>
> A kalkulátorban külön kapcsoló szükséges arra, hogy a szerződéses alapbér megegyezik-e a minimálbérrel, és ez-e az alapmunkahely. A feltételek nem vezethetők le kizárólag a megadott teljes bruttó összegből.


## 3.5. Személyi levonások
| **Levonás**                        | **Fő feltétel**                                                            | **Számítási logika**                                                                    |
|------------------------------------|----------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| Alap személyi levonás              | Csak az alapmunkahelyen; a havi bruttó legfeljebb a minimálbér + 2 000 lej | Összege a bruttó jövedelemtől és az eltartottak számától függő táblázat szerint csökken |
| 26 év alattiak kiegészítő levonása | A munkavállaló legfeljebb 26 éves és a jövedelmi korlát alatt van          | A minimálbér 15%-ának megfelelő adóalap-levonás                                         |
| Oktatásban részt vevő gyermek      | 18 év alatti, oktatási intézményben tanuló gyermek; egy jogosult szülő     | 100 lej/hó/gyermek kiegészítő levonás                                                   |

## 3.6. Betegszabadság és egészségbiztosítási indemnizáció
- A számítás alapja jellemzően a jogszabályban meghatározott korábbi biztosított jövedelem és munkanapok alapján meghatározott napi átlag.
- Általános betegség / munkán kívüli baleset esetén az indemnizáció mértéke az epizód hosszától függően 55%, 65% vagy hosszabb epizódnál 75%.
- Egyéb jogcímek – például szülési szabadság, gyermekápolás, karantén, anyasági kockázat vagy súlyos betegségek – külön százalékot és eltérő adó-/járulékszabályt alkalmazhatnak.
- 2026. február 1. és 2027. december 31. között a legtöbb érintett igazolásnál az indemnizációt egy nappal csökkentve kell kiszámítani.
- Folyamatos betegségi epizódnál az egynapos csökkentést csak egyszer kell alkalmazni, függetlenül a kiadott igazolások számától.
- Átmeneti munkaképtelenségnél a munkáltató főszabály szerint a 2–6. napot viseli, majd a FNUASS finanszírozza a további napokat; a teljes egészében alapból finanszírozott jogcímeknél a finanszírozás a 2. naptól indul.
- A jogszabály kivételeket tartalmaz, többek között egyes ellátástípusokra, nemzeti egészségügyi programok résztvevőire és fekvőbeteg-ellátásban kiadott igazolásokra.

> [!WARNING]
> **Betegszabadság-modul korlátja**
>
> Az éles számításhoz nem elegendő a havi bruttó bér. Szükséges a korábbi hónapok biztosított jövedelme, munkanapjai, a betegség kódja, az epizód teljes hossza, a folytatólagosság, valamint az esetleges kivétel jogcíme.


## 3.7. A román kalkulátor jelenlegi hatóköre
| **Kezelt terület**                                   | **Állapot**                                         | **Megjegyzés**                                         |
|------------------------------------------------------|-----------------------------------------------------|--------------------------------------------------------|
| Bruttó → nettó és nettó → bruttó                     | Kezelt                                              | Hónapfüggő szabályokkal és automatikus újraszámítással |
| 2026-os országos minimálbér                          | Kezelt                                              | 4 050 / 4 325 lej időszak szerint                      |
| CAS, CASS, jövedelemadó, CAM                         | Kezelt                                              | Standard munkaviszonyra                                |
| Személyi levonások                                   | Kezelt                                              | Eltartottak, életkor és gyermek után                   |
| Betegszabadság                                       | Részletesen kezelt, de szakértői kontroll szükséges | Több betegszabadsági típus és finanszírozási megosztás |
| Részmunkaidős minimumjárulék-szabályok               | Nem teljes körű                                     | Külön fejlesztési modul szükséges                      |
| Ágazati minimálbérek, speciális munkakörülmények     | Nem teljes körű                                     | Jogcím- és ágazatfüggő szabályok                       |
| Juttatások, étkezési jegyek, végrehajtási letiltások | Nem teljes körű                                     | Külön adózási és nettólevonási modul javasolt          |

# 4. Magyarország – alkalmazandó 2026-os szabályok
*A kalkulátor magyar munkaviszonyra vonatkozó fő jogszabályi háttere.*

## 4.1. Fő jogszabályi keret
- 2012 évi I. törvény – Munka Törvénykönyve: munkaviszony, munkabér, betegszabadság és bérminimumok felhatalmazási alapja.
- 426/2025. (XII. 23.) Korm. rendelet: a 2026-os minimálbér és garantált bérminimum.
- 1995 évi CXVII. törvény – Szja tv.: személyi jövedelemadó és adóalap-kedvezmények.
- 2019 évi CXXII. törvény – Tbj.: biztosítási jogviszony és 18,5%-os társadalombiztosítási járulék.
- 2018 évi LII. törvény – Szocho tv.: a munkáltatói szociális hozzájárulási adó.
- 1997 évi LXXXIII. törvény – Ebtv., valamint a végrehajtási szabályok: táppénz jogosultság, alap, mérték és maximum.
- NAV 2026-os információs füzetei és a Magyar Államkincstár táppénz/betegszabadság tájékoztatója.

## 4.2. Minimálbér és garantált bérminimum 2026-ban
| **Bértípus**         | **Havi**   | **Heti**  | **Napi**  | **Órabér** | **Alkalmazás**                                                         |
|----------------------|------------|-----------|-----------|------------|------------------------------------------------------------------------|
| Minimálbér           | 322 800 Ft | 74 210 Ft | 14 850 Ft | 1 856 Ft   | Általános kötelező legkisebb alapbér                                   |
| Garantált bérminimum | 373 200 Ft | 85 800 Ft | 17 160 Ft | 2 145 Ft   | Legalább középfokú végzettséget vagy szakképzettséget igénylő munkakör |

- Részmunkaidőnél a havi, heti és napi összeget a munkaidő arányában csökkenteni kell.
- A garantált bérminimumot nem a munkavállaló tényleges végzettsége, hanem a munkakör előírt képesítési követelménye alapozza meg.
- A nettó → bruttó számításban a kiválasztott bérminimum alsó bruttó korlátként működjön.

## 4.3. Standard adók és járulékok
| **Tétel**                     | **Mérték** | **Fizető / szerep**   | **Standard kalkulátori kezelés**                                           |
|-------------------------------|------------|-----------------------|----------------------------------------------------------------------------|
| Személyi jövedelemadó (SZJA)  | 15%        | Munkavállalói levonás | A kedvezményekkel csökkentett összevont adóalapra                          |
| Társadalombiztosítási járulék | 18,5%      | Munkavállalói levonás | A járulékalapot képező jövedelemre; családi járulékkedvezmény csökkentheti |
| Szociális hozzájárulási adó   | 13%        | Munkáltatói közteher  | A szochoalap 13%-a, a munkáltatói kedvezmények figyelembevételével         |

### Kedvezmények nélküli alapszámítás
> [!NOTE]
> **Képlet**
>
> Nettó munkabér = bruttó munkabér – 15% SZJA – 18,5% TB-járulék. A munkáltatói teljes költség standard esetben = bruttó munkabér + 13% szocho.


## 4.4. A kalkulátorban releváns főbb adókedvezmények
| **Kedvezmény**                    | **2026-os fő érték / hatás**                                                              | **Fő feltétel**                                                                                |
|-----------------------------------|-------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| 25 év alatti fiatalok kedvezménye | Legfeljebb 715 765 Ft/hó adóalap; maximum 107 365 Ft havi adómegtakarítás                 | A 25. életév betöltésének hónapjáig, törvényben meghatározott jövedelmekre                     |
| Személyi kedvezmény               | 107 600 Ft/hó adóalap, azaz 16 140 Ft havi adómegtakarítás                                | Jogszabályban meghatározott súlyos fogyatékosság vagy jogosultsági állapot                     |
| Első házasok kedvezménye          | 33 335 Ft/hó adóalap a házaspárnak, kb. 5 000 Ft nettó előny                              | A házasságkötést követő hónaptól legfeljebb 24 hónapig                                         |
| Családi kedvezmény                | 2026-ban kb. 20 000 / 40 000 / 66 000 Ft havi nettó hatás kedvezményezett eltartottanként | Eltartottak és kedvezményezett eltartottak száma, jogosultsági és megosztási szabályok szerint |
| Családi járulékkedvezmény         | A fel nem használt családi adóalap-kedvezmény 15%-a, legfeljebb a fizetendő TB-járulékig  | Ha a családi kedvezmény az SZJA-ból nem használható fel teljesen                               |

> [!IMPORTANT]
> **Kedvezmények sorrendje**
>
> Több egyidejű jogosultság esetén a kedvezményeket a hatályos Szja tv. és a NAV 73. számú, 2026-os információs füzete szerinti sorrendben kell alkalmazni. A sorrend megváltozása a nettó eredményt is módosíthatja.


## 4.5. Betegszabadság és táppénz
- Saját betegség esetén a keresőképtelenség első 15 munkanapjára – naptári évenként – betegszabadság jár.
- A betegszabadság idejére a munkáltató a távolléti díj 70%-át fizeti; ez adó- és járulékköteles jövedelem.
- Év közben kezdődő munkaviszonynál a betegszabadság kerete arányos.
- Foglalkozási baleset, foglalkozási megbetegedés és veszélyeztetett várandósság esetén főszabály szerint nincs 15 napos betegszabadság; az ellátás az első naptól más jogcímen indulhat.
- A táppénz naptári napokra jár, nem kizárólag munkanapokra.
- Legalább 730 nap folyamatos biztosítás esetén a táppénz a napi alap 60%-a; ennél rövidebb biztosítás vagy fekvőbeteg-ellátás esetén 50%.
- A táppénz napi maximuma 2026-ban 21 520 Ft, vagyis a 322 800 Ft-os minimálbér kétszeresének harmincad része.
- A táppénz alapjának meghatározása a jövedelmi előzményektől függ: főszabály szerint 180 naptári napi jövedelem, de a törvény 120 napos és további helyettesítő szabályokat is tartalmaz.

> [!IMPORTANT]
> **A havi kalkulátor egyszerűsítése**
>
> A betegszabadság munkanapos, a táppénz pedig naptári napos ellátás. Ezért egy pontos modulnak dátumintervallummal, munkanaptárral és a táppénzalap hivatalos előzményadataival kell számolnia. A csak „beteg napok száma” alapú kalkuláció becslés.


## 4.6. A magyar kalkulátor jelenlegi hatóköre
| **Kezelt terület**                                       | **Állapot**          | **Megjegyzés**                                                           |
|----------------------------------------------------------|----------------------|--------------------------------------------------------------------------|
| Bruttó → nettó és nettó → bruttó                         | Kezelt               | Automatikus módváltással és iteratív visszaszámítással                   |
| Minimálbér / garantált bérminimum                        | Kezelt               | Teljes és részmunkaidős arányosítással; nettó → bruttó alsó korlátként   |
| SZJA, TB és szocho                                       | Kezelt               | Standard munkaviszonyra                                                  |
| 25 év alatti, személyi, első házas és családi kedvezmény | Kezelt               | A felhasználó által megadott jogosultság alapján                         |
| Anyák adómentességeinek teljes köre                      | Nem teljes körű      | Külön életkori, gyermek- és jogosultsági logika szükséges                |
| Betegszabadság és táppénz                                | Egyszerűsített modul | Pontos számításhoz dátum- és jövedelmi előzmény szükséges                |
| Cafeteria, pótlékok, túlóra, EKHO, EFO                   | Nem kezelt           | Külön jogviszony- vagy juttatásmodul szükséges                           |
| Munkáltatói szochokedvezmények                           | Nem teljes körű      | Munkaerőpiacra lépő, kutató, megváltozott munkaképesség stb. külön modul |

# 5. Kalkulátor-karbantartási és verziózási követelmények
- Minden jogszabályverzió rendelkezzen valid_from és valid_until mezővel.
- A minimálbér, járulékkulcs, adókulcs, kedvezményplafon és betegszabadsági szabály külön konfigurációs elem legyen.
- Az éles szabályverzió ne legyen felülírható; módosításkor új verziót kell létrehozni.
- Minden számítás eredményében kerüljön eltárolásra a használt ország, hónap, szabályverzió és ellenőrzési dátum.
- A hivatalos forrás URL-jét és a jogszabály azonosítóját minden szabályhoz hozzá kell rendelni.
- Új jogszabályverzió aktiválása előtt legalább 10–20 kontrollszámítást kell bérszámfejtővel összevetni.
- A nettó → bruttó algoritmus minden kedvezménykombinációban legfeljebb 1 pénzegységnyi eltérést engedjen.
- A felületen mindig jelenjen meg: „Tájékoztató számítás, nem hivatalos bérjegyzék”.

## Javasolt szabályadatmodell
| **Adatcsoport**        | **Példamezők**                                                                   |
|------------------------|----------------------------------------------------------------------------------|
| salary_rule_versions   | ország, érvényesség, adókulcsok, járulékkulcsok, státusz, jóváhagyás             |
| minimum_wage_rules     | havi/heti/napi/órabér, bérminimum típusa, munkaidő                               |
| tax_allowance_rules    | kedvezménytípus, sorrend, életkor, havi plafon, gyermek- és jövedelmi feltételek |
| medical_leave_rules    | jogcím/kód, százalék, időtartam, finanszírozó, adó- és járulékszabály            |
| calculation_test_cases | bemeneti adatok, elvárt bruttó, nettó, közterhek és munkáltatói költség          |

# 6. Hivatalos jogszabályi források
## Románia
- [Legea nr. 53/2003 – Codul muncii, konszolidált forma](https://legislatie.just.ro/Public/DetaliiDocument/191867)

- [Legea nr. 227/2015 – Codul fiscal](https://legislatie.just.ro/Public/DetaliiDocument/171280)

- [HG nr. 146/2026 – 4 325 lejes minimálbér 2026. július 1-jétől](https://legislatie.just.ro/Public/DetaliiDocument/308231)

- [OUG nr. 89/2025 – 300/200 lejes adómentes összeg 2026-ban](https://legislatie.just.ro/Public/DetaliiDocument/305817)

- [OUG nr. 158/2005 – betegszabadságok és indemnizációk, konszolidált forma](https://legislatie.just.ro/Public/DetaliiDocument/309394)

- [Ordinul nr. 521/500/2026 – 2026–2027-es egynapos csökkentés végrehajtása](https://legislatie.just.ro/Public/DetaliiDocument/307943)

## Magyarország
- [426/2025. (XII. 23.) Korm. rendelet – 2026-os minimálbér és garantált bérminimum](https://njt.hu/jogszabaly/2025-426-20-22)

- [1995. évi CXVII. törvény – személyi jövedelemadó](https://njt.hu/jogszabaly/1995-117-00-00)

- [2019. évi CXXII. törvény – társadalombiztosítási járulék](https://njt.hu/jogszabaly/2019-122-00-00)

- [2018. évi LII. törvény – szociális hozzájárulási adó](https://njt.hu/jogszabaly/2018-52-00-00)

- [1997. évi LXXXIII. törvény – egészségbiztosítási pénzbeli ellátások](https://njt.hu/jogszabaly/1997-83-00-00)

- [NAV – 2026-os információs füzetek](https://nav.gov.hu/ugyfeliranytu/nezzen-utana/inf_fuz/2026)

- [NAV – 25 év alatti fiatalok kedvezménye, 2026](https://nav.gov.hu/print/szja/ujdonsagok-tudnivalok/25-ev-alatti-fiatalok-kedvezmenye)

- [NAV – első házasok kedvezménye](https://nav.gov.hu/ado/szja/szja-kedvezmenyek/elso-hazasok-kedvezmenye)

- [NAV – családi kedvezmény](https://nav.gov.hu/ado/szja/szja-kedvezmenyek/csaladi-kedvezmeny)

- [Magyar Államkincstár – táppénz és betegszabadság](https://www.allamkincstar.gov.hu/egeszsegbiztositas/Betegseg/tappenz-betegszabadsag)

> [!IMPORTANT]
> **Forráshasználat**
>
> Az online tájékoztatók segítik az értelmezést, de jogvita vagy éles bérszámfejtési döntés esetén a hatályos jogszabály konszolidált szövege és szakértői állásfoglalás az irányadó.


# 7. Rövid megfelelőségi ellenőrzőlista
- [ ] A számítás hónapja alapján a megfelelő jogszabályverzió töltődik be.
- [ ] A minimálbér és a bérminimum ellenőrzése a szerződéses alapbérre történik.
- [ ] Bruttó → nettó és nettó → bruttó irányban ugyanazok a kedvezménybeállítások érvényesülnek.
- [ ] A nettó → bruttó számítás nem ad a kiválasztott kötelező minimum alatti bruttó eredményt.
- [ ] A kedvezmények jogosultságát a felhasználó nyilatkozata vagy HR-adatforrás biztosítja.
- [ ] Betegszabadság esetén külön kezeltek a ledolgozott napok, az ellátás jogcíme és a finanszírozó.
- [ ] Az eredményoldal részletezi a munkavállalói levonásokat és a munkáltatói terheket.
- [ ] Minden szabályhoz hivatalos jogszabályforrás tartozik.
- [ ] A kontrolltesztek eredményeit legalább évente és minden jogszabályváltozás után újra kell validálni.
- [ ] A felületen jól látható jogi figyelmeztetés szerepel.

> [!IMPORTANT]
> **Összegzés**
>
> A két ország bérszámítási modellje ugyanarra az alapelvre épül – bruttó jövedelem, munkavállalói levonások, kedvezmények és munkáltatói terhek –, de a minimálbéres kedvezmények, személyi levonások és betegszabadsági finanszírozás jelentősen eltér. Ezért a szabályokat országonként, hónaponként és jogcímenként elkülönített modulokban kell fenntartani.
