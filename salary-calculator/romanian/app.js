(function () {
  'use strict';
  const core = window.RomanianSalaryCore;
  const $ = (id) => document.getElementById(id);
  let language = localStorage.getItem('roSalaryLanguage') === 'hu' ? 'hu' : 'ro';
  let formatter = new Intl.NumberFormat(language === 'hu' ? 'hu-HU' : 'ro-RO', { maximumFractionDigits: 0 });
  let decimalFormatter = new Intl.NumberFormat(language === 'hu' ? 'hu-HU' : 'ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  let mode = 'gross';
  let lastResult = null;
  let baseIncomeTouched = false;

  const monthNames = {
    ro: ['ianuarie','februarie','martie','aprilie','mai','iunie','iulie','august','septembrie','octombrie','noiembrie','decembrie'],
    hu: ['január','február','március','április','május','június','július','augusztus','szeptember','október','november','december']
  };
  const STATIC_HU = {"Calculator Salarii 2026 România": "Bérkalkulátor 2026 Románia", "Calculator salariu": "Bérkalkulátor", "România · 2026": "Románia · 2026", "Reguli verificate: 15.07.2026": "Szabályok ellenőrizve: 2026. 07. 15.", "BRUT · NET · COST ANGAJATOR": "BRUTTÓ · NETTÓ · MUNKÁLTATÓI KÖLTSÉG", "Calculatorul este conceput pentru un contract individual de muncă standard. Include salariul minim, taxele salariale, deducerile personale și concediile medicale calculate pe baza veniturilor din ultimele 6 luni.": "A kalkulátor standard romániai munkaszerződéshez készült. Tartalmazza a minimálbért, a bérterheket, a személyi kedvezményeket és az előző 6 hónap jövedelme alapján számított betegszabadságot.", "Brut → Net": "Bruttó → Nettó", "Net → Brut": "Nettó → Bruttó", "DATE DE CALCUL": "SZÁMÍTÁSI ADATOK", "Introdu salariul": "Add meg a fizetést", "Salariul minim": "Minimálbér", "Salariu brut lunar": "Havi bruttó fizetés", "Venitul brut total realizat în luna selectată.": "A kiválasztott hónapban elért teljes bruttó jövedelem.", "Luna calculului": "Számítás hónapja", "Persoane în întreținere": "Eltartott személyek", "0 persoane": "0 személy", "1 persoană": "1 személy", "2 persoane": "2 személy", "3 persoane": "3 személy", "4 sau mai multe": "4 vagy több", "Situația angajatului": "A munkavállaló helyzete", "Funcția de bază": "Alapmunkahely", "Deducerea personală se acordă numai la funcția de bază.": "A személyi kedvezmény csak az alapmunkahelyen vehető igénybe.", "Salariul de bază din contract este egal cu salariul minim": "A szerződés szerinti alapbér megegyezik a minimálbérrel", "Permite aplicarea sumei netaxabile dacă sunt îndeplinite și celelalte condiții.": "Lehetővé teszi az adómentes összeg alkalmazását, ha a többi feltétel is teljesül.", "Angajatul are cel mult 26 de ani": "A munkavállaló legfeljebb 26 éves", "Poate beneficia de deducerea suplimentară de 15% din salariul minim.": "Jogosult lehet a minimálbér 15%-ának megfelelő kiegészítő kedvezményre.", "Concediu medical": "Betegszabadság", "Include concediu medical în luna selectată": "Betegszabadság beszámítása a kiválasztott hónapban", "Salariul pentru zilele lucrate și indemnizația medicală vor fi calculate separat.": "A ledolgozott napokra járó bér és a betegszabadság térítése külön kerül kiszámításra.", "Tipul concediului medical": "A betegszabadság típusa", "Boală obișnuită / accident în afara muncii (cod 01)": "Általános betegség / munkán kívüli baleset (01-es kód)", "Boală cardiovasculară eligibilă": "Jogosító szív- és érrendszeri betegség", "Afecțiune gravă / urgență medico-chirurgicală": "Súlyos betegség / orvosi-sebészeti sürgősség", "Carantină sau izolare (cod 07)": "Karantén vagy elkülönítés (07-es kód)", "Sarcină și lăuzie (cod 08)": "Terhesség és gyermekágy (08-as kód)", "Îngrijirea copilului bolnav": "Beteg gyermek ápolása", "Îngrijirea pacientului cu afecțiuni oncologice": "Onkológiai beteg ápolása", "Risc maternal (cod 15)": "Anyasági kockázat (15-ös kód)", "Zile calendaristice în episod": "Az epizód naptári napjai", "zile": "nap", "Determină procentul de 55%, 65% sau 75% pentru boala obișnuită.": "Az általános betegségnél ez határozza meg az 55%, 65% vagy 75%-os mértéket.", "Zile lucrătoare de concediu în lună": "Betegszabadság munkanapjai a hónapban", "Total zile lucrătoare în lună": "A hónap összes munkanapja", "Poate fi corectat manual în funcție de programul de lucru.": "A munkarendnek megfelelően kézzel módosítható.", "Zile lucrătoare anterioare din același episod": "Azonos epizód korábbi munkanapjai", "Necesar pentru continuări și repartizarea angajator/FNUASS.": "A folytatás és a munkáltató/FNUASS közötti megosztás meghatározásához szükséges.", "Venituri asigurate din ultimele 6 luni": "Az előző 6 hónap biztosított jövedelme", "Suma veniturilor brute care intră în baza concediului medical.": "A betegszabadság számítási alapjába tartozó bruttó jövedelmek összege.", "Zile lucrate în ultimele 6 luni": "Az előző 6 hónapban ledolgozott napok", "Numitorul mediei zilnice a bazei de calcul.": "A napi átlagos számítási alap osztója.", "Certificat exceptat de la diminuarea cu o zi": "Az egynapos csökkentés alól mentes igazolás", "Bifează pentru PNS, spitalizare sau o altă excepție legală aplicabilă certificatului.": "Jelöld be PNS, kórházi kezelés vagy más alkalmazható jogszabályi kivétel esetén.", "Deducere suplimentară pentru copii": "Gyermekek utáni kiegészítő kedvezmény", "Copii sub 18 ani înscriși într-o unitate de învățământ": "Oktatási intézménybe járó, 18 év alatti gyermekek", "Deducere suplimentară de 100 lei/copil pentru părintele beneficiar.": "Gyermekenként 100 lej kiegészítő kedvezmény a jogosult szülőnek.", "Rezultatul se actualizează automat când modifici o valoare.": "Az eredmény minden érték módosításakor automatikusan frissül.", "Salariul minim valabil": "Érvényes minimálbér", "Salariu net estimat": "Becsült nettó fizetés", "Salariu brut contractual": "Szerződés szerinti bruttó fizetés", "Salariu pentru zilele lucrate": "Ledolgozott napokra járó bér", "Indemnizație medicală brută": "Bruttó betegszabadság-térítés", "Total brut plătit": "Teljes kifizetett bruttó", "Sumă netaxabilă": "Adómentes összeg", "CAS · pensie (25%)": "CAS · nyugdíjjárulék (25%)", "CASS · sănătate (10%)": "CASS · egészségbiztosítás (10%)", "Deducere personală": "Személyi kedvezmény", "Impozit pe venit (10%)": "Jövedelemadó (10%)", "Salariu net": "Nettó fizetés", "CAM angajator (2,25%)": "Munkáltatói CAM (2,25%)", "Indemnizație recuperabilă din FNUASS": "FNUASS-ból visszaigényelhető térítés", "Cost efectiv angajator": "Tényleges munkáltatói költség", "Detalierea deducerilor": "Kedvezmények részletezése", "Copiază rezultatul": "Eredmény másolása", "Tipărește": "Nyomtatás", "REGULI INCLUSE": "BEÉPÍTETT SZABÁLYOK", "Ce include calculatorul?": "Mit tartalmaz a kalkulátor?", "CAS 25%, CASS 10%, impozit pe venit 10% și CAM 2,25%.": "25% CAS, 10% CASS, 10% jövedelemadó és 2,25% CAM.", "Salariul minim din 2026, cu reguli distincte pentru cele două semestre.": "A 2026-os minimálbér, a két félévre vonatkozó eltérő szabályokkal.", "Deducerea personală în funcție de venit și numărul persoanelor aflate în întreținere.": "Személyi kedvezmény a jövedelem és az eltartottak száma alapján.", "Deduceri suplimentare pentru angajații de cel mult 26 de ani și pentru copiii eligibili.": "Kiegészítő kedvezmények a legfeljebb 26 éves munkavállalóknak és a jogosult gyermekek után.", "Suma netaxabilă de 300 lei în semestrul I și 200 lei în semestrul II.": "300 lej adómentes összeg az első, 200 lej a második félévben.", "Concedii medicale: baza zilnică din ultimele 6 luni, procentele legale, contribuțiile și repartizarea angajator/FNUASS.": "Betegszabadság: az előző 6 hónap napi alapja, jogszabályi százalékok, járulékok és munkáltató/FNUASS-megosztás.", "SURSE OFICIALE": "HIVATALOS FORRÁSOK", "Baza legală": "Jogi háttér", "HG nr. 146/2026 · salariul minim de la 1 iulie 2026": "146/2026. kormányhatározat · minimálbér 2026. július 1-jétől", "HG nr. 1.506/2024 · salariul minim de 4.050 lei": "1.506/2024. kormányhatározat · 4 050 lejes minimálbér", "OUG nr. 89/2025 · suma netaxabilă în 2026": "89/2025. sürgősségi kormányrendelet · 2026-os adómentes összeg", "Legea nr. 227/2015 · Codul fiscal actualizat": "227/2015. törvény · aktualizált adótörvény", "OUG nr. 158/2005 · concedii și indemnizații medicale": "158/2005. sürgősségi kormányrendelet · betegszabadságok és térítések", "Ordinul nr. 521/500/2026 · diminuarea cu o zi și formulele de calcul": "521/500/2026. rendelet · egynapos csökkentés és számítási képletek", "CNPP · câștigul salarial mediu brut în 2026": "CNPP · 2026-os bruttó átlagkereset", "Important:": "Fontos:", "rezultatul este orientativ și se referă la un contract individual de muncă standard. Modulul medical calculează un singur tip de certificat/episod în luna selectată și necesită introducerea datelor reale din adeverința de venit. Nu include accidente de muncă, boli profesionale, mai multe certificate diferite în aceeași lună, tichete, beneficii, popriri, contribuții facultative, condiții speciale, scutiri sectoriale sau regulile contribuțiilor minime pentru contracte part-time. Pentru statul de plată și declarația D112 este necesară validarea unui specialist în salarizare.": "Az eredmény tájékoztató jellegű, és standard romániai munkaszerződésre vonatkozik. A betegszabadság-modul a kiválasztott hónapban egyetlen igazolást vagy epizódot számol, és a jövedelemigazolás valós adatait igényli. Nem tartalmazza a munkahelyi baleseteket, foglalkozási betegségeket, azonos hónapon belüli több eltérő igazolást, utalványokat, juttatásokat, bérletiltásokat, önkéntes hozzájárulásokat, különleges feltételeket, ágazati mentességeket vagy a részmunkaidős szerződések minimumjárulék-szabályait. A bérjegyzékhez és a D112 bevalláshoz bérszámfejtési szakértő ellenőrzése szükséges.", "Calculator salariu România · MVP 2026": "Romániai bérkalkulátor · MVP 2026"};
  const staticTextNodes = [];
  const tr = (ro, huText) => language === 'hu' ? huText : ro;

  function collectStaticTextNodes() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (['SCRIPT','STYLE'].includes(node.parentElement && node.parentElement.tagName)) continue;
      const match = node.nodeValue.match(/^(\s*)(.*?)(\s*)$/s);
      const original = match && match[2].replace(/\s+/g, ' ').trim();
      if (original && STATIC_HU[original]) staticTextNodes.push({ node, original, before: match[1], after: match[3] });
    }
  }

  function localizeCoreMessage(message) {
    if (language === 'ro' || !message) return message;
    const exact = {
      'Calculatorul include momentan doar regulile aferente anului 2026.':'A kalkulátor jelenleg csak a 2026-os szabályokat tartalmazza.',
      'Facilitatea pentru suma netaxabilă se acordă numai la funcția de bază.':'Az adómentes összeg csak az alapmunkahelyen alkalmazható.',
      'Facilitatea pentru suma netaxabilă este configurată în acest MVP doar pentru contract cu normă întreagă.':'Az adómentes összeg ebben az MVP-ben csak teljes munkaidős szerződésnél alkalmazható.',
      'Baza concediului medical trebuie completată cu veniturile asigurate și zilele lucrate reale din ultimele 6 luni.':'A betegszabadság alapját az előző 6 hónap valós biztosított jövedelmével és ledolgozott napjaival kell kitölteni.',
      'S-a aplicat diminuarea cu o zi lucrătoare valabilă pentru certificatele emise în perioada 1 februarie 2026–31 decembrie 2027.':'Alkalmaztuk a 2026. február 1. és 2027. december 31. között kiállított igazolásokra vonatkozó egynapos csökkentést.',
      'Pentru martie 2026, baza CAS poate necesita împărțire la 30 martie, când câștigul salarial mediu brut a crescut de la 8.620 la 9.192 lei.':'2026 márciusában a CAS-alap március 30-án történő megosztása válhat szükségessé, amikor a bruttó átlagkereset 8 620 lejről 9 192 lejre emelkedett.',
      'Procentul pentru boală obișnuită se stabilește după durata totală a episodului; dacă episodul se prelungește, poate fi necesară recalcularea lunii anterioare.':'Az általános betegség százaléka az epizód teljes időtartamától függ; hosszabbítás esetén az előző hónap újraszámítása válhat szükségessé.',
      'Nu a fost găsită o valoare brută pentru netul solicitat.':'Nem található a megadott nettóhoz tartozó bruttó érték.'
    };
    if (exact[message]) return exact[message];
    let m = message.match(/^Salariul brut contractual introdus este sub salariul minim general de (.+) lei pentru normă întreagă\.$/);
    if (m) return `A megadott szerződéses bruttó fizetés alacsonyabb a teljes munkaidős ${m[1]} lejes általános minimálbérnél.`;
    m = message.match(/^Suma netaxabilă nu se aplică deoarece venitul brut al lunii depășește plafonul de (.+) lei\.$/);
    if (m) return `Az adómentes összeg nem alkalmazható, mert a havi bruttó jövedelem meghaladja a ${m[1]} lejes határt.`;
    return message;
  }

  function localizedMedicalType(label) { return language === 'hu' ? (STATIC_HU[label] || label) : label; }
  function localizedRuleLabel(rule) {
    if (language === 'ro') return rule.label;
    return rule.id === 'ro-2026-h1' ? '2026. január 1. – június 30.' : '2026. július 1. – december 31.';
  }

  function applyLanguage(nextLanguage, persist = true) {
    language = nextLanguage === 'hu' ? 'hu' : 'ro';
    if (persist) localStorage.setItem('roSalaryLanguage', language);
    formatter = new Intl.NumberFormat(language === 'hu' ? 'hu-HU' : 'ro-RO', { maximumFractionDigits: 0 });
    decimalFormatter = new Intl.NumberFormat(language === 'hu' ? 'hu-HU' : 'ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.documentElement.lang = language;
    document.title = language === 'hu' ? 'Romániai bérkalkulátor 2026' : 'Calculator Salarii 2026';
    document.getElementById('page-title').textContent = language === 'hu' ? 'Bérkalkulátor 2026 Románia' : 'Calculator Salarii 2026 România';
    staticTextNodes.forEach(item => { item.node.nodeValue = item.before + (language === 'hu' ? STATIC_HU[item.original] : item.original) + item.after; });
    document.querySelectorAll('#month option').forEach((option, index) => { option.textContent = `${monthNames[language][index]} 2026`; });
    document.getElementById('lang-ro').classList.toggle('active', language === 'ro');
    document.getElementById('lang-hu').classList.toggle('active', language === 'hu');
    document.getElementById('lang-ro').setAttribute('aria-pressed', String(language === 'ro'));
    document.getElementById('lang-hu').setAttribute('aria-pressed', String(language === 'hu'));
    document.querySelector('.brand').setAttribute('aria-label', tr('Calculator salariu România','Romániai bérkalkulátor'));
    document.querySelector('.mode-tabs').setAttribute('aria-label', tr('Tip calcul','Számítás típusa'));
    elements.month.setAttribute('aria-label', tr('Luna calculului','Számítás hónapja'));
    setMode(mode, false);
  }

  function formatMonthLabel(value) {
    const [year, month] = String(value || '').split('-');
    const index = Number(month) - 1;
    if (!year || index < 0 || index > 11) return value || '';
    return language === 'hu' ? `${year}. ${monthNames[language][index]}` : `${monthNames[language][index]} ${year}`;
  }

  const elements = {
    amount: $('amount'),
    month: $('month'),
    dependents: $('dependents'),
    primaryJob: $('primary-job'),
    minimumContract: $('minimum-contract'),
    under26: $('under-26'),
    children: $('children'),
    amountLabel: $('amount-label'),
    amountHint: $('amount-hint'),
    mainResultLabel: $('main-result-label'),
    mainResult: $('main-result'),
    minimumValue: $('minimum-value'),
    minimumPeriod: $('minimum-period'),
    formError: $('form-error'),
    resultDifference: $('result-difference'),
    warnings: $('warnings'),
    medicalEnabled: $('medical-enabled'),
    medicalFields: $('medical-fields'),
    medicalType: $('medical-type'),
    episodeDays: $('episode-days'),
    medicalWorkdays: $('medical-workdays'),
    monthWorkdays: $('month-workdays'),
    previousEpisodeDays: $('previous-episode-days'),
    baseIncomeTotal: $('base-income-total'),
    baseWorkdaysTotal: $('base-workdays-total'),
    oneDayExempt: $('one-day-exempt'),
    medicalPreview: $('medical-preview')
  };

  function lei(value) {
    return `${formatter.format(value)} lei`;
  }

  function signedLei(value) {
    return `−${formatter.format(value)} lei`;
  }

  function getOptions() {
    return {
      month: elements.month.value,
      isPrimaryJob: elements.primaryJob.checked,
      contractBaseEqualsMinimum: elements.minimumContract.checked,
      isFullTime: true,
      dependents: Number(elements.dependents.value),
      isUnderOrEqual26: elements.under26.checked,
      childrenInEducation: Number(elements.children.value),
      medicalLeaveEnabled: elements.medicalEnabled.checked,
      medicalType: elements.medicalType.value,
      episodeCalendarDays: Number(elements.episodeDays.value),
      medicalWorkdays: Number(elements.medicalWorkdays.value),
      monthWorkdays: Number(elements.monthWorkdays.value),
      previousEpisodeWorkdays: Number(elements.previousEpisodeDays.value),
      baseIncomeTotal: Number(elements.baseIncomeTotal.value),
      baseWorkdaysTotal: Number(elements.baseWorkdaysTotal.value),
      oneDayReductionExempt: elements.oneDayExempt.checked
    };
  }

  function updateMedicalDefaults(forceIncome) {
    const month = elements.month.value;
    elements.monthWorkdays.value = core.getMonthWorkdays(month) || elements.monthWorkdays.value;
    elements.baseWorkdaysTotal.value = core.getPreviousSixWorkdays(month) || elements.baseWorkdaysTotal.value;
    if (forceIncome || !baseIncomeTouched) {
      const minimumHistory = core.getPreviousSixMinimumIncome(month);
      if (elements.minimumContract.checked && minimumHistory) {
        elements.baseIncomeTotal.value = minimumHistory;
      } else if (mode === 'gross') {
        const amount = Math.max(0, Number(elements.amount.value) || 0);
        elements.baseIncomeTotal.value = Math.round(amount * 6);
      }
    }
  }

  function updateMedicalUi() {
    const enabled = elements.medicalEnabled.checked;
    elements.medicalFields.hidden = !enabled;
    const ordinary = elements.medicalType.value === 'ordinary';
    elements.episodeDays.closest('.field').hidden = !ordinary;
    if (!enabled) return;

    const type = core.MEDICAL_TYPES[elements.medicalType.value] || core.MEDICAL_TYPES.ordinary;
    const rate = type.rate === null
      ? core.getOrdinaryMedicalRate(Number(elements.episodeDays.value))
      : type.rate;
    const baseIncome = Math.max(0, Number(elements.baseIncomeTotal.value) || 0);
    const baseDays = Math.max(1, Number(elements.baseWorkdaysTotal.value) || 1);
    const daily = baseIncome / baseDays;
    const month = elements.month.value;
    const reductionPossible = month >= '2026-02' && !type.oneDayReductionExempt && !elements.oneDayExempt.checked;
    elements.medicalPreview.innerHTML = [
      `<strong>${tr('Procent aplicat:','Alkalmazott százalék:')}</strong> ${formatter.format(rate * 100)}%`,
      `<strong>${tr('Media zilnică introdusă:','Megadott napi átlag:')}</strong> ${decimalFormatter.format(daily)} lei`,
      `<strong>${tr('Diminuare cu o zi:','Egynapos csökkentés:')}</strong> ${reductionPossible ? tr('da, dacă este începutul episodului','igen, ha ez az epizód kezdete') : tr('nu pentru setarea selectată','nem a kiválasztott beállításnál')}`
    ].join('<br>');
  }

  function updateRuleSummary() {
    try {
      const rule = core.getRules(elements.month.value);
      elements.minimumValue.textContent = lei(rule.minimumGross);
      elements.minimumPeriod.textContent = localizedRuleLabel(rule);
      elements.formError.hidden = true;
    } catch (error) {
      elements.formError.textContent = error.message;
      elements.formError.hidden = false;
    }
  }

  function setMedicalRowsVisible(visible) {
    document.querySelectorAll('.medical-result-row').forEach((row) => { row.hidden = !visible; });
  }

  function renderAllowanceLines(result) {
    const lines = [
      [tr('Sumă netaxabilă','Adómentes összeg'), result.nonTaxableAmount],
      [tr('Deducere personală de bază','Alap személyi kedvezmény'), result.basicDeduction],
      [tr('Deducere suplimentară','Kiegészítő kedvezmény'), result.supplementaryDeduction]
    ];
    if (result.medical) {
      lines.push(
        [tr('Zile lucrătoare în lună','Munkanapok a hónapban'), `${result.medical.monthWorkdays} ${tr('zile','nap')}`],
        [tr('Zile medicale înscrise','Megadott betegnapok'), `${result.medical.requestedMedicalWorkdays} ${tr('zile','nap')}`],
        [tr('Zile medicale plătite','Fizetett betegnapok'), `${result.medical.paidMedicalWorkdays} ${tr('zile','nap')}`],
        [tr('Procent indemnizație','Térítési százalék'), `${formatter.format(result.medical.rate * 100)}%`],
        [tr('Media zilnică a bazei','A számítási alap napi átlaga'), `${decimalFormatter.format(result.medical.dailyBase)} lei`],
        [tr('Suportat de angajator','Munkáltató által viselt'), `${result.medical.employerMedicalDays} ${tr('zile','nap')} · ${lei(result.medical.employerMedicalAmount)}`],
        [tr('Suportat din FNUASS','FNUASS által fedezett'), `${result.medical.fundMedicalDays} ${tr('zile','nap')} · ${lei(result.medical.fundMedicalAmount)}`],
        [tr('Bază CAS concediu medical','Betegszabadság CAS-alapja'), lei(result.medical.medicalCasBase)],
        [tr('CAS aferent concediului medical','Betegszabadság utáni CAS'), lei(result.medical.medicalCas)],
        [tr('CASS aferent concediului medical','Betegszabadság utáni CASS'), lei(result.medical.medicalCass)]
      );
    }
    $('allowance-lines').innerHTML = lines.map(([label, value]) => {
      const displayValue = typeof value === 'number' ? lei(value) : value;
      return `<div><span>${label}</span><strong>${displayValue}</strong></div>`;
    }).join('');
  }

  function render(result) {
    lastResult = result;
    $('gross-result').textContent = lei(result.gross);
    $('worked-gross-result').textContent = lei(result.salaryGross);
    $('medical-gross-result').textContent = lei(result.medical ? result.medical.medicalGross : 0);
    $('total-gross-result').textContent = lei(result.totalGross);
    $('exemption-result').textContent = lei(result.nonTaxableAmount);
    $('cas-result').textContent = signedLei(result.cas);
    $('cass-result').textContent = signedLei(result.cass);
    $('deduction-result').textContent = lei(result.personalDeduction);
    $('tax-result').textContent = signedLei(result.incomeTax);
    $('net-result').textContent = lei(result.net);
    $('cam-result').textContent = lei(result.cam);
    $('fund-result').textContent = lei(result.medical ? result.medical.fundMedicalAmount : 0);
    $('cost-result').textContent = lei(result.employerCost);
    setMedicalRowsVisible(Boolean(result.medical));
    renderAllowanceLines(result);
    elements.minimumValue.textContent = lei(result.rule.minimumGross);
    elements.minimumPeriod.textContent = localizedRuleLabel(result.rule);

    if (mode === 'gross') {
      elements.mainResultLabel.textContent = tr('Salariu net estimat','Becsült nettó fizetés');
      elements.mainResult.textContent = formatter.format(result.net);
      elements.resultDifference.hidden = true;
    } else {
      elements.mainResultLabel.textContent = tr('Salariu brut contractual necesar','Szükséges szerződéses bruttó fizetés');
      elements.mainResult.textContent = formatter.format(result.gross);
      elements.resultDifference.textContent = result.netDifference
        ? `${tr('Net rezultat:','Eredményül kapott nettó:')} ${lei(result.net)} (${result.netDifference > 0 ? '+' : ''}${result.netDifference} ${tr('lei față de suma solicitată','lej eltérés a megadott összegtől')})`
        : `${tr('Net rezultat:','Eredményül kapott nettó:')} ${lei(result.net)}`;
      elements.resultDifference.hidden = false;
    }

    const warningMessages = result.warnings.slice();
    if (result.exemptionEligible && result.nonTaxableAmount > 0) {
      warningMessages.unshift(language === 'hu' ? `Alkalmaztuk a ${result.nonTaxableAmount} lejes adómentes összeget.` : `A fost aplicată suma netaxabilă de ${result.nonTaxableAmount} lei.`);
    }
    if (warningMessages.length) {
      elements.warnings.innerHTML = warningMessages.map((message) => `<p>${localizeCoreMessage(message)}</p>`).join('');
      elements.warnings.hidden = false;
    } else {
      elements.warnings.hidden = true;
      elements.warnings.innerHTML = '';
    }
  }

  function validateMedicalInputs() {
    if (!elements.medicalEnabled.checked) return;
    const medicalDays = Number(elements.medicalWorkdays.value);
    const monthDays = Number(elements.monthWorkdays.value);
    if (!Number.isFinite(monthDays) || monthDays < 1) throw new Error(tr('Introdu numărul valid de zile lucrătoare din lună.','Adj meg érvényes havi munkanapszámot.'));
    if (!Number.isFinite(medicalDays) || medicalDays < 0 || medicalDays > monthDays) {
      throw new Error(tr('Zilele de concediu medical trebuie să fie între 0 și totalul zilelor lucrătoare din lună.','A betegszabadság napjainak 0 és a hónap összes munkanapja között kell lenniük.'));
    }
    if (Number(elements.baseIncomeTotal.value) < 0) throw new Error(tr('Veniturile din baza de calcul nu pot fi negative.','A számítási alap jövedelme nem lehet negatív.'));
    if (Number(elements.baseWorkdaysTotal.value) < 1) throw new Error(tr('Baza concediului medical trebuie să conțină cel puțin o zi lucrată.','A betegszabadság alapjának legalább egy ledolgozott napot kell tartalmaznia.'));
  }

  function calculate() {
    elements.formError.hidden = true;
    try {
      const amount = Number(elements.amount.value);
      if (!Number.isFinite(amount) || amount < 0) throw new Error(tr('Introdu o sumă validă, mai mare sau egală cu 0.','Adj meg egy 0-nál nem kisebb érvényes összeget.'));
      validateMedicalInputs();
      const result = mode === 'gross'
        ? core.calculateFromGross(amount, getOptions())
        : core.calculateFromNet(amount, getOptions());
      render(result);
      updateMedicalUi();
    } catch (error) {
      elements.formError.textContent = localizeCoreMessage(error.message) || tr('Calculul nu a putut fi realizat.','A számítás nem hajtható végre.');
      elements.formError.hidden = false;
    }
  }

  function convertAmountForModeChange(newMode) {
    if (newMode === mode) return;
    const currentAmount = Number(elements.amount.value);
    if (!Number.isFinite(currentAmount) || currentAmount < 0) return;

    validateMedicalInputs();
    const options = getOptions();
    if (mode === 'gross' && newMode === 'net') {
      const result = core.calculateFromGross(currentAmount, options);
      elements.amount.value = result.net;
    } else if (mode === 'net' && newMode === 'gross') {
      const result = core.calculateFromNet(currentAmount, options);
      elements.amount.value = result.gross;
    }
  }

  function setMode(newMode, convertAmount = true) {
    elements.formError.hidden = true;
    try {
      if (convertAmount) convertAmountForModeChange(newMode);
      mode = newMode;
      document.querySelectorAll('.mode-tab').forEach((tab) => {
        const active = tab.dataset.mode === newMode;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      if (mode === 'gross') {
        elements.amountLabel.textContent = elements.medicalEnabled.checked ? tr('Salariu brut contractual lunar','Havi szerződéses bruttó fizetés') : tr('Salariu brut lunar','Havi bruttó fizetés');
        elements.amountHint.textContent = elements.medicalEnabled.checked
          ? tr('Salariul lunar contractual; plata pentru zilele lucrate se calculează proporțional.','A havi szerződéses fizetés; a ledolgozott napokra járó összeg arányosan kerül kiszámításra.')
          : tr('Venitul brut total realizat în luna selectată.','A kiválasztott hónapban elért teljes bruttó jövedelem.');
        if (!baseIncomeTouched) updateMedicalDefaults(true);
      } else {
        elements.amountLabel.textContent = tr('Salariu net dorit','Kívánt nettó fizetés');
        elements.amountHint.textContent = tr('Suma netă pe care angajatul trebuie să o primească, inclusiv indemnizația medicală.','A munkavállaló által megkapni kívánt nettó összeg, a betegszabadság térítésével együtt.');
      }
      calculate();
    } catch (error) {
      elements.formError.textContent = localizeCoreMessage(error.message) || tr('Valoarea nu a putut fi convertită între brut și net.','Az érték nem váltható át bruttó és nettó között.');
      elements.formError.hidden = false;
    }
  }

  document.querySelectorAll('.mode-tab').forEach((tab) => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
  });

  $('use-minimum').addEventListener('click', () => {
    const rule = core.getRules(elements.month.value);
    elements.minimumContract.checked = true;
    baseIncomeTouched = false;

    if (mode === 'gross') {
      elements.amount.value = rule.minimumGross;
      updateMedicalDefaults(true);
    } else {
      const minimumResult = core.calculateFromGross(rule.minimumGross, getOptions());
      elements.amount.value = minimumResult.net;
    }
    calculate();
  });

  elements.month.addEventListener('change', () => {
    updateRuleSummary();
    updateMedicalDefaults(false);
    if (elements.minimumContract.checked) {
      const rule = core.getRules(elements.month.value);
      if (mode === 'gross') {
        elements.amount.value = rule.minimumGross;
      } else {
        const minimumResult = core.calculateFromGross(rule.minimumGross, getOptions());
        elements.amount.value = minimumResult.net;
      }
    }
    updateMedicalUi();
    calculate();
  });

  let calculationTimer = null;
  function scheduleCalculation() {
    window.clearTimeout(calculationTimer);
    calculationTimer = window.setTimeout(calculate, 120);
  }

  elements.medicalEnabled.addEventListener('change', () => {
    updateMedicalUi();
    setMode(mode, false);
  });
  elements.medicalType.addEventListener('change', () => {
    const type = core.MEDICAL_TYPES[elements.medicalType.value];
    elements.oneDayExempt.checked = Boolean(type && type.oneDayReductionExempt);
    updateMedicalUi();
    calculate();
  });
  elements.baseIncomeTotal.addEventListener('input', () => {
    baseIncomeTouched = true;
    updateMedicalUi();
    scheduleCalculation();
  });

  [
    elements.amount, elements.dependents, elements.children, elements.episodeDays,
    elements.medicalWorkdays, elements.monthWorkdays, elements.previousEpisodeDays,
    elements.baseWorkdaysTotal
  ].forEach((element) => element.addEventListener('input', () => {
    if (element === elements.amount && mode === 'gross' && !baseIncomeTouched) updateMedicalDefaults(true);
    updateMedicalUi();
    scheduleCalculation();
  }));

  [
    elements.dependents, elements.primaryJob, elements.minimumContract, elements.under26,
    elements.children, elements.oneDayExempt
  ].forEach((element) => element.addEventListener('change', () => {
    if (element === elements.minimumContract && !baseIncomeTouched) updateMedicalDefaults(true);
    updateMedicalUi();
    calculate();
  }));

  elements.amount.addEventListener('change', calculate);
  elements.amount.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      window.clearTimeout(calculationTimer);
      calculate();
    }
  });

  $('copy-result').addEventListener('click', async () => {
    if (!lastResult) return;
    const lines = [
      `${tr('Luna:','Hónap:')} ${formatMonthLabel(elements.month.value)}`,
      `${tr('Salariu brut contractual:','Szerződéses bruttó fizetés:')} ${lei(lastResult.gross)}`
    ];
    if (lastResult.medical) {
      lines.push(
        `${tr('Tip concediu:','Betegszabadság típusa:')} ${localizedMedicalType(lastResult.medical.typeLabel)}`,
        `${tr('Salariu zile lucrate:','Ledolgozott napokra járó bér:')} ${lei(lastResult.salaryGross)}`,
        `${tr('Indemnizație medicală brută:','Bruttó betegszabadság-térítés:')} ${lei(lastResult.medical.medicalGross)}`,
        `${tr('Zile medicale plătite:','Fizetett betegnapok:')} ${lastResult.medical.paidMedicalWorkdays}`,
        `${tr('Suportat de angajator:','Munkáltató által viselt:')} ${lei(lastResult.medical.employerMedicalAmount)}`,
        `${tr('Suportat din FNUASS:','FNUASS által fedezett:')} ${lei(lastResult.medical.fundMedicalAmount)}`,
        `${tr('Total brut plătit:','Teljes kifizetett bruttó:')} ${lei(lastResult.totalGross)}`
      );
    }
    lines.push(
      `CAS: ${lei(lastResult.cas)}`,
      `CASS: ${lei(lastResult.cass)}`,
      `${tr('Deducere personală:','Személyi kedvezmény:')} ${lei(lastResult.personalDeduction)}`,
      `${tr('Impozit:','Adó:')} ${lei(lastResult.incomeTax)}`,
      `${tr('Salariu net:','Nettó fizetés:')} ${lei(lastResult.net)}`,
      `CAM: ${lei(lastResult.cam)}`,
      `${tr('Cost efectiv angajator:','Tényleges munkáltatói költség:')} ${lei(lastResult.employerCost)}`
    );
    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      $('copy-result').textContent = tr('Copiat','Másolva');
      setTimeout(() => { $('copy-result').textContent = tr('Copiază rezultatul','Eredmény másolása'); }, 1400);
    } catch (_) {
      window.prompt(tr('Copiază rezultatul:','Másold ki az eredményt:'), text);
    }
  });

  collectStaticTextNodes();
  document.getElementById('lang-ro').addEventListener('click', () => applyLanguage('ro'));
  document.getElementById('lang-hu').addEventListener('click', () => applyLanguage('hu'));
  updateRuleSummary();
  updateMedicalDefaults(false);
  updateMedicalUi();
  applyLanguage(language, false);
})();
