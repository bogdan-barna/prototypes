(function () {
  'use strict';
  const core = window.HungarianSalaryCore;
  const $ = (id) => document.getElementById(id);
  const TRANSLATIONS = {"hu":{"pageTitle":"Magyar bérkalkulátor 2026","brandTitle":"Bérkalkulátor","brandSubtitle":"Magyarország · 2026","verified":"Szabályok ellenőrizve: 2026. 07. 15.","introEyebrow":"BRUTTÓ · NETTÓ · MUNKÁLTATÓI KÖLTSÉG","introTitle":"Számold ki a magyarországi fizetést a 2026-os szabályok alapján","introText":"A kalkulátor standard munkaviszonyra készült. Kezeli a minimálbért, az adókat, a legfontosabb kedvezményeket, továbbá a betegszabadságot és a táppénzt is.","grossToNet":"Bruttó → Nettó","netToGross":"Nettó → Bruttó","calcData":"SZÁMÍTÁSI ADATOK","enterSalary":"Add meg a fizetést","minimumWage":"Minimálbér","guaranteedMinimumShort":"Garantált minimum","monthlyGrossBase":"Havi bruttó alapbér","monthlyGrossHint":"A havi bruttó alapbér, külön bónuszok és béren kívüli juttatások nélkül.","calculationMonth":"Számítás hónapja","weeklyHours":"Heti munkaidő","hoursUnit":"óra","minimumCheck":"Kötelező bérminimum ellenőrzése","guaranteedMinimumOption":"Garantált bérminimum – középfokú végzettséget igénylő munkakör","noMinimumCheck":"Nem kérek ellenőrzést","ageMotherAllowances":"Életkorhoz és anyasághoz kapcsolódó kedvezmények","birthDate":"Születési dátum","birthDateHint":"Az életkorhoz kötött kedvezmények automatikus ellenőrzéséhez.","under25Allowance":"25 év alatti fiatalok kedvezménye","under25Hint":"2026-ban legfeljebb havi 715 765 Ft adóalapra.","under30MotherAllowance":"30 év alatti anyák kedvezménye","eligibilityDeclaration":"A jogosultságot a felhasználó nyilatkozata alapján alkalmazzuk.","multiChildMotherAllowance":"Többgyermekes anyák kedvezménye","notApplied":"Nem alkalmazom","twoChildMotherOption":"Két gyermeket nevelő anya – 2026-ban jogosult korcsoport","threeChildMotherOption":"Három gyermeket nevelő anya","fourChildMotherOption":"Négy vagy több gyermeket nevelő anya","otherTaxAllowances":"Egyéb SZJA-kedvezmények","personalAllowance":"Személyi kedvezmény","personalAllowanceHint":"Havi 107 600 Ft adóalap-kedvezmény.","firstMarriageAllowance":"Első házasok kedvezménye","firstMarriageHint":"A házaspár által igénybe vehető havi keret megosztható.","firstMarriageShare":"Az első házasok kedvezményéből igényelt rész","firstMarriage100":"100% – 33 335 Ft adóalap","firstMarriage50":"50% – 16 668 Ft adóalap","firstMarriage25":"25% – 8 334 Ft adóalap","familyAllowance":"Családi kedvezmény","totalDependents":"Eltartottak teljes száma","beneficiaryDependents":"Kedvezményezett eltartottak","disabledBeneficiaries":"Ebből tartósan beteg / súlyosan fogyatékos","familyShare":"A kedvezményből igényelt rész","familyContributionAllowance":"Családi járulékkedvezmény alkalmazása","familyContributionHint":"A fel nem használt családi adóalap-kedvezmény 15%-a a TB-járulékot is csökkentheti.","specialStatus":"Speciális munkavállalói státusz","pensioner":"Saját jogú nyugdíjas munkavállaló","pensionerHint":"A standard esetben nincs 18,5% TB-járulék és 13% munkáltatói szocho.","sicknessPanel":"Betegszabadság és táppénz","sicknessEnabled":"Keresőképtelenség figyelembevétele","sicknessEnabledHint":"A ledolgozott napok bére, a betegszabadság és a táppénz külön kerül kiszámításra.","absenceType":"Keresőképtelenség típusa","absenceOrdinary":"Saját betegség","absenceHospital":"Kórházi / fekvőbeteg-ellátás","absencePregnancy":"Veszélyeztetett várandósság","absenceChildCare":"Gyermekápolási táppénz (GYÁP)","monthWorkdays":"Összes munkanap a hónapban","daysUnit":"nap","monthWorkdaysHint":"Az általános 2026-os munkarend alapján automatikusan kitöltjük, de módosítható.","sickLeaveWorkdays":"Betegszabadság munkanapjai","sickLeaveHint":"A betegszabadság idejére a becsült távolléti díj 70%-a jár.","sickLeaveUsedBefore":"Korábban felhasznált betegszabadság","sickLeaveQuotaHint":"Az éves keret főszabály szerint 15 munkanap.","sickPayWorkdays":"Táppénzes munkanapok a hónapban","sickPayWorkdaysHint":"A havi munkabér arányosításához szükséges.","sickPayCalendarDays":"Táppénzes naptári napok a hónapban","sickPayCalendarHint":"A táppénz minden jogosult naptári napra járhat.","sickPayBaseIncome":"Táppénzalap jövedelme","sickPayBaseIncomeHint":"Az irányadó időszakban bevallott, járulékalapot képező jövedelem összege.","sickPayBaseDays":"Táppénzalap naptári napjai","sickPayBaseDaysHint":"A jövedelemhez tartozó figyelembe vehető naptári napok.","insurance730":"Legalább 730 nap folyamatos biztosítási idő","insurance730Hint":"Főszabály szerint 60%-os táppénz; enélkül, illetve fekvőbeteg-ellátásnál 50%.","autoCalc":"Az eredmény automatikusan frissül, amikor módosítasz egy értéket.","minimumSummary":"2026-os minimálbér","fullTimeMonthly":"Teljes munkaidő · havi alapbér","estimatedNetSalary":"Becsült nettó munkabér","contractualGrossSalary":"Havi szerződéses bruttó bér","workedDaysSalary":"Ledolgozott napokra járó bér","sickLeaveGross":"Betegszabadság bruttó összege","sickPayGross":"Táppénz bruttó összege","totalGrossPayment":"Összes bruttó kifizetés","appliedAllowances":"Alkalmazott adóalap-kedvezmények","taxBaseAfterAllowances":"Kedvezmények utáni SZJA-alap","personalIncomeTax":"Személyi jövedelemadó · 15%","socialSecurityBeforeAllowance":"TB-járulék kedvezmény előtt · 18,5%","familyContributionLabel":"Családi járulékkedvezmény","payableSocialSecurity":"Fizetendő TB-járulék","netSalary":"Nettó munkabér","employerSocialTax":"Munkáltatói szocho · 13%","employerSickPayContribution":"Munkáltatói táppénz-hozzájárulás","totalEmployerCost":"Teljes munkáltatói költség","detailedBreakdown":"Kedvezmények részletes bontása","copyResult":"Eredmény másolása","print":"Nyomtatás","includedRules":"BEÉPÍTETT SZABÁLYOK","whatItHandles":"Mit kezel a kalkulátor?","officialSources":"HIVATALOS FORRÁSOK","legalBasis":"Jogi háttér","sourceMinimumWage":"426/2025. (XII. 23.) Korm. rendelet · 2026-os minimálbérek","sourceTaxAllowances":"NAV · SZJA adóalap-kedvezmények 2026","sourceUnder25":"NAV · 25 év alatti fiatalok kedvezménye","sourceFamily":"NAV · családi kedvezmény 2026","sourcePensioner":"NAV · nyugdíj melletti munkavégzés","sourceSickPay":"Magyar Államkincstár · táppénz és betegszabadság","sourceChildCare":"Magyar Államkincstár · gyermekápolási táppénz","ruleRates":"15% SZJA, 18,5% TB-járulék és 13% munkáltatói szocho.","ruleMinimum":"2026-os minimálbér és garantált bérminimum, részmunkaidős arányosítással.","ruleAllowances":"25 és 30 év alattiak, többgyermekes anyák, személyi és első házas kedvezmény.","ruleFamily":"Családi adó- és járulékkedvezmény, megosztási aránnyal.","rulePensioner":"Saját jogú nyugdíjas munkavállaló standard közteher-szabályai.","ruleSickness":"Betegszabadság, táppénz és gyermekápolási táppénz becsült havi hatása.","important":"Fontos:","scopeText":"Az eredmény tájékoztató jellegű, és standard munkaviszony havi elszámolására vonatkozik. A betegszabadság napi összegét egyszerűsített módon, a havi szerződéses bérből becsüli; a tényleges távolléti díj, a táppénzalap jogszabályi kiválasztása és a jogosultsági idő szakértői ellenőrzést igényelhet. Nem kezeli a baleseti táppénzt, több párhuzamos jogviszonyt, több eltérő igazolást ugyanabban a hónapban, CSED-et, GYED-et, EKHO-t, cafeteriát, letiltást, külföldi adóilletőséget vagy a teljes bérszámfejtési bevallási logikát.","footer":"Magyar bérkalkulátor · MVP 2026","brandAria":"Magyar bérkalkulátor","calculationTypeAria":"Számítás típusa","currency":"Ft","day":"nap","days":"nap","hour":"óra","perHour":"/óra","noCheck":"Nincs ellenőrzés","minimumCheckTitle":"Bérminimum-ellenőrzés","disabled":"Kikapcsolva","minimumNoCompare":"A megadott bért nem hasonlítjuk kötelező minimumhoz.","minimumName":"minimálbér","guaranteedMinimumName":"garantált bérminimum","weeklyHoursSummary":"{hours} órás heti munkaidő · {amount}/óra","unusedFamilyAllowance":"Fel nem használt családi kedvezmény","noAllowance":"Nincs alkalmazott kedvezmény","absenceTypeLine":"Keresőképtelenség típusa","monthlyWorkdaysLine":"Havi munkanapok","workedDaysLine":"Ledolgozott munkanapok","sickLeaveLine":"Betegszabadság","sickPayWorkdaysLine":"Táppénzes munkanapok","sickPayCalendarDaysLine":"Táppénzes naptári napok","sickPayDailyBaseLine":"Táppénz napi alapja","sickPayRateLine":"Táppénz mértéke","cappedDailySickPayLine":"Figyelembe vett napi táppénz","netMonthlyPayment":"Nettó havi kifizetés","estimatedNetMonthlyPayment":"Becsült nettó havi kifizetés","requiredGrossBase":"Szükséges havi bruttó alapbér","achievedNet":"Elért nettó: {amount}","difference":"{value} Ft eltérés","sickLeavePreview":"Betegszabadság:","sickPayPreview":"Táppénz:","remainingSickLeave":"legfeljebb még {days} munkanap, 70%-os díjazással","notAvailableForType":"ennél a jogcímnél nem alkalmazható","estimatedDailyAmount":"becsült napi összeg {amount}","dailyMaximum":"2026-os napi maximum: {amount}","contractualGrossBase":"Havi szerződéses bruttó alapbér","contractualGrossHint":"A teljes havi szerződéses alapbér; a ledolgozott napok díját arányosan számítjuk.","desiredNetPayment":"Kívánt havi nettó kifizetés","desiredNetSicknessHint":"A kalkulátor megkeresi a nettó kifizetéshez szükséges szerződéses bruttó alapbért.","desiredNetHint":"A kalkulátor megkeresi az ehhez legközelebbi bruttó munkabért.","copied":"Másolva","copyPrompt":"Másold ki az eredményt:","monthCopy":"Hónap","contractualGrossCopy":"Szerződéses bruttó alapbér","absenceCopy":"Keresőképtelenség","workedGrossCopy":"Ledolgozott napokra járó bér","sickLeaveCopy":"Betegszabadság","sickPayCopy":"Táppénz","totalGrossCopy":"Összes bruttó kifizetés","allowancesCopy":"Adóalap-kedvezmények","incomeTaxCopy":"SZJA","socialSecurityCopy":"Fizetendő TB-járulék","netPaymentCopy":"Nettó kifizetés","employerSocialTaxCopy":"Munkáltatói szocho","employerSickPayCopy":"Munkáltatói táppénz-hozzájárulás","employerCostCopy":"Teljes munkáltatói költség","errorMonthWorkdays":"Adj meg érvényes havi munkanapszámot.","errorSickLeaveNegative":"A betegszabadság napjainak száma nem lehet negatív.","errorSickPayNegative":"A táppénzes munkanapok száma nem lehet negatív.","errorTooManySickDays":"A betegszabadság és a táppénzes munkanapok összege nem lehet több a havi munkanapok számánál.","errorBaseIncomeNegative":"A táppénzalap jövedelme nem lehet negatív.","errorBaseDays":"A táppénzalaphoz legalább 1 naptári napot adj meg.","errorAmount":"Adj meg egy 0-nál nem kisebb, érvényes összeget.","errorCalculation":"A számítás nem hajtható végre."},"en":{"pageTitle":"Hungary Salary Calculator 2026","brandTitle":"Salary Calculator","brandSubtitle":"Hungary · 2026","verified":"Rules verified: 15 July 2026","introEyebrow":"GROSS · NET · TOTAL EMPLOYER COST","introTitle":"Calculate your salary in Hungary under the 2026 rules","introText":"Designed for standard employment. It covers the minimum wage, taxes, key allowances, sick leave and statutory sick pay.","grossToNet":"Gross → Net","netToGross":"Net → Gross","calcData":"CALCULATION DETAILS","enterSalary":"Enter salary","minimumWage":"Minimum wage","guaranteedMinimumShort":"Guaranteed minimum","monthlyGrossBase":"Monthly gross base salary","monthlyGrossHint":"Monthly gross base salary excluding bonuses and fringe benefits.","calculationMonth":"Calculation month","weeklyHours":"Weekly working hours","hoursUnit":"hours","minimumCheck":"Mandatory wage floor check","guaranteedMinimumOption":"Guaranteed minimum wage – position requiring at least a secondary qualification","noMinimumCheck":"Do not check","ageMotherAllowances":"Age- and maternity-related allowances","birthDate":"Date of birth","birthDateHint":"Used to verify age-based allowances automatically.","under25Allowance":"Allowance for employees under 25","under25Hint":"In 2026, applies to a monthly tax base of up to HUF 715,765.","under30MotherAllowance":"Allowance for mothers under 30","eligibilityDeclaration":"Applied based on the user’s declaration of eligibility.","multiChildMotherAllowance":"Allowance for mothers with multiple children","notApplied":"Do not apply","twoChildMotherOption":"Mother of two – age group eligible in 2026","threeChildMotherOption":"Mother of three","fourChildMotherOption":"Mother of four or more","otherTaxAllowances":"Other personal income tax allowances","personalAllowance":"Personal allowance","personalAllowanceHint":"Monthly tax-base allowance of HUF 107,600.","firstMarriageAllowance":"First-marriage allowance","firstMarriageHint":"The monthly allowance can be shared between the spouses.","firstMarriageShare":"Share of the first-marriage allowance claimed","firstMarriage100":"100% – HUF 33,335 tax base","firstMarriage50":"50% – HUF 16,668 tax base","firstMarriage25":"25% – HUF 8,334 tax base","familyAllowance":"Family allowance","totalDependents":"Total number of dependants","beneficiaryDependents":"Eligible dependants","disabledBeneficiaries":"Of whom chronically ill / severely disabled","familyShare":"Share of allowance claimed","familyContributionAllowance":"Apply family contribution allowance","familyContributionHint":"15% of unused family tax-base allowance may also reduce the social security contribution.","specialStatus":"Special employee status","pensioner":"Employee receiving an own-right pension","pensionerHint":"In the standard case, no 18.5% social security contribution or 13% employer social tax applies.","sicknessPanel":"Sick leave and statutory sick pay","sicknessEnabled":"Include incapacity for work","sicknessEnabledHint":"Pay for days worked, sick leave and statutory sick pay are calculated separately.","absenceType":"Type of incapacity for work","absenceOrdinary":"Own illness","absenceHospital":"Hospital / inpatient treatment","absencePregnancy":"High-risk pregnancy","absenceChildCare":"Child-care sick pay","monthWorkdays":"Total working days in the month","daysUnit":"days","monthWorkdaysHint":"Pre-filled from the standard 2026 work calendar, but can be edited.","sickLeaveWorkdays":"Sick-leave working days","sickLeaveHint":"Estimated absence pay is paid at 70% during sick leave.","sickLeaveUsedBefore":"Sick leave already used this year","sickLeaveQuotaHint":"The annual allowance is generally 15 working days.","sickPayWorkdays":"Sick-pay working days in the month","sickPayWorkdaysHint":"Needed to prorate the monthly salary.","sickPayCalendarDays":"Sick-pay calendar days in the month","sickPayCalendarHint":"Statutory sick pay may be payable for every eligible calendar day.","sickPayBaseIncome":"Income used for the sick-pay base","sickPayBaseIncomeHint":"Contribution-liable income reported for the relevant reference period.","sickPayBaseDays":"Calendar days used for the sick-pay base","sickPayBaseDaysHint":"Eligible calendar days corresponding to the income.","insurance730":"At least 730 days of continuous insurance","insurance730Hint":"Generally 60% sick pay; otherwise, and during inpatient care, 50%.","autoCalc":"Results update automatically whenever you change a value.","minimumSummary":"2026 minimum wage","fullTimeMonthly":"Full-time · monthly base salary","estimatedNetSalary":"Estimated net salary","contractualGrossSalary":"Monthly contractual gross salary","workedDaysSalary":"Salary for days worked","sickLeaveGross":"Gross sick-leave payment","sickPayGross":"Gross statutory sick pay","totalGrossPayment":"Total gross payment","appliedAllowances":"Applied tax-base allowances","taxBaseAfterAllowances":"PIT base after allowances","personalIncomeTax":"Personal income tax · 15%","socialSecurityBeforeAllowance":"Social security before allowance · 18.5%","familyContributionLabel":"Family contribution allowance","payableSocialSecurity":"Payable social security contribution","netSalary":"Net salary","employerSocialTax":"Employer social tax · 13%","employerSickPayContribution":"Employer sick-pay contribution","totalEmployerCost":"Total employer cost","detailedBreakdown":"Detailed allowance breakdown","copyResult":"Copy result","print":"Print","includedRules":"INCLUDED RULES","whatItHandles":"What does the calculator cover?","officialSources":"OFFICIAL SOURCES","legalBasis":"Legal basis","sourceMinimumWage":"Government Decree 426/2025 (23 Dec) · 2026 minimum wages","sourceTaxAllowances":"NAV · Personal income tax allowances 2026","sourceUnder25":"NAV · Allowance for employees under 25","sourceFamily":"NAV · Family allowance 2026","sourcePensioner":"NAV · Employment while receiving a pension","sourceSickPay":"Hungarian State Treasury · sick leave and sick pay","sourceChildCare":"Hungarian State Treasury · child-care sick pay","ruleRates":"15% personal income tax, 18.5% social security and 13% employer social tax.","ruleMinimum":"2026 minimum wage and guaranteed minimum wage, prorated for part-time work.","ruleAllowances":"Allowances for people under 25, mothers under 30, mothers with multiple children, personal and first-marriage allowances.","ruleFamily":"Family tax and contribution allowance with a selectable sharing ratio.","rulePensioner":"Standard contribution rules for employees receiving an own-right pension.","ruleSickness":"Estimated monthly impact of sick leave, statutory sick pay and child-care sick pay.","important":"Important:","scopeText":"The result is for information only and covers a standard monthly employment payroll. Sick-leave daily pay is estimated from the monthly contractual salary; the actual absence-pay calculation, selection of the statutory sick-pay base and eligibility period may require expert review. The calculator does not cover accident sick pay, multiple concurrent employments, multiple different medical certificates in one month, maternity or childcare benefits, EKHO taxation, cafeteria benefits, wage garnishments, foreign tax residence or the full payroll reporting logic.","footer":"Hungary Salary Calculator · MVP 2026","brandAria":"Hungary salary calculator","calculationTypeAria":"Calculation type","currency":"HUF","day":"day","days":"days","hour":"hour","perHour":"/hour","noCheck":"No check","minimumCheckTitle":"Wage-floor check","disabled":"Disabled","minimumNoCompare":"The entered salary is not compared with a mandatory wage floor.","minimumName":"minimum wage","guaranteedMinimumName":"guaranteed minimum wage","weeklyHoursSummary":"{hours} weekly hours · {amount}/hour","unusedFamilyAllowance":"Unused family allowance","noAllowance":"No allowance applied","absenceTypeLine":"Type of incapacity for work","monthlyWorkdaysLine":"Working days in month","workedDaysLine":"Working days completed","sickLeaveLine":"Sick leave","sickPayWorkdaysLine":"Sick-pay working days","sickPayCalendarDaysLine":"Sick-pay calendar days","sickPayDailyBaseLine":"Daily sick-pay base","sickPayRateLine":"Sick-pay rate","cappedDailySickPayLine":"Daily sick pay used","netMonthlyPayment":"Net monthly payment","estimatedNetMonthlyPayment":"Estimated net monthly payment","requiredGrossBase":"Required monthly gross base salary","achievedNet":"Achieved net: {amount}","difference":"{value} HUF difference","sickLeavePreview":"Sick leave:","sickPayPreview":"Sick pay:","remainingSickLeave":"up to {days} working days remaining at 70% pay","notAvailableForType":"not available for this absence type","estimatedDailyAmount":"estimated daily amount {amount}","dailyMaximum":"2026 daily maximum: {amount}","contractualGrossBase":"Monthly contractual gross base salary","contractualGrossHint":"Full monthly contractual base salary; pay for days worked is prorated.","desiredNetPayment":"Desired monthly net payment","desiredNetSicknessHint":"The calculator finds the contractual gross base salary required for the desired net payment.","desiredNetHint":"The calculator finds the closest gross salary for the entered net amount.","copied":"Copied","copyPrompt":"Copy the result:","monthCopy":"Month","contractualGrossCopy":"Contractual gross base salary","absenceCopy":"Incapacity for work","workedGrossCopy":"Salary for days worked","sickLeaveCopy":"Sick leave","sickPayCopy":"Statutory sick pay","totalGrossCopy":"Total gross payment","allowancesCopy":"Tax-base allowances","incomeTaxCopy":"Personal income tax","socialSecurityCopy":"Payable social security contribution","netPaymentCopy":"Net payment","employerSocialTaxCopy":"Employer social tax","employerSickPayCopy":"Employer sick-pay contribution","employerCostCopy":"Total employer cost","errorMonthWorkdays":"Enter a valid number of working days for the month.","errorSickLeaveNegative":"Sick-leave days cannot be negative.","errorSickPayNegative":"Sick-pay working days cannot be negative.","errorTooManySickDays":"Sick-leave and sick-pay working days together cannot exceed the working days in the month.","errorBaseIncomeNegative":"Income used for the sick-pay base cannot be negative.","errorBaseDays":"Enter at least 1 calendar day for the sick-pay base.","errorAmount":"Enter a valid amount of 0 or more.","errorCalculation":"The calculation could not be completed."}};
  function getStoredLanguage() {
    try { return localStorage.getItem('salaryCalculatorLanguage') === 'en' ? 'en' : 'hu'; } catch (_) { return 'hu'; }
  }
  function storeLanguage(language) {
    try { localStorage.setItem('salaryCalculatorLanguage', language); } catch (_) {}
  }
  let currentLanguage = getStoredLanguage();
  let formatter;
  let decimalFormatter;

  function t(key, values) {
    let text = (TRANSLATIONS[currentLanguage] && TRANSLATIONS[currentLanguage][key]) || TRANSLATIONS.hu[key] || key;
    Object.entries(values || {}).forEach(([name, value]) => { text = text.replaceAll(`{${name}}`, String(value)); });
    return text;
  }

  function refreshFormatters() {
    const locale = currentLanguage === 'en' ? 'en-GB' : 'hu-HU';
    formatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    decimalFormatter = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  refreshFormatters();
  let mode = 'gross';
  let lastResult = null;
  let baseIncomeTouched = false;
  let calculationTimer = null;

  const fields = {
    amount: $('amount'), month: $('month'), weeklyHours: $('weekly-hours'), minimumType: $('minimum-type'),
    birthDate: $('birth-date'), under25: $('under-25'), under30Mother: $('under-30-mother'), motherExemption: $('mother-exemption'),
    personalAllowance: $('personal-allowance'), firstMarriage: $('first-marriage'), firstMarriageShare: $('first-marriage-share'),
    totalDependents: $('total-dependents'), beneficiaryDependents: $('beneficiary-dependents'), disabledBeneficiaries: $('disabled-beneficiaries'),
    familyShare: $('family-share'), familyContribution: $('family-contribution'), pensioner: $('pensioner'),
    sicknessEnabled: $('sickness-enabled'), absenceType: $('absence-type'), monthWorkdays: $('month-workdays'),
    sickLeaveWorkdays: $('sick-leave-workdays'), sickLeaveUsedBefore: $('sick-leave-used-before'),
    sickPayWorkdays: $('sick-pay-workdays'), sickPayCalendarDays: $('sick-pay-calendar-days'),
    sickPayBaseIncome: $('sick-pay-base-income'), sickPayBaseDays: $('sick-pay-base-days'), insurance730: $('insurance-730')
  };

  function currencyUnit() { return t('currency'); }
  function huf(value) { return `${formatter.format(value)} ${currencyUnit()}`; }
  function minusHuf(value) { return value ? `−${formatter.format(value)} ${currencyUnit()}` : `0 ${currencyUnit()}`; }
  function dayText(value) { return `${formatter.format(value)} ${currentLanguage === 'en' ? (Number(value) === 1 ? t('day') : t('days')) : t('days')}`; }

  const monthNames = {
    hu: ['január','február','március','április','május','június','július','augusztus','szeptember','október','november','december'],
    en: ['January','February','March','April','May','June','July','August','September','October','November','December']
  };

  function formatMonthLabel(value) {
    const match = /^(\d{4})-(\d{2})$/.exec(String(value || ''));
    if (!match) return String(value || '');
    const year = Number(match[1]);
    const monthIndex = Number(match[2]) - 1;
    return currentLanguage === 'en' ? `${monthNames.en[monthIndex]} ${year}` : `${year}. ${monthNames.hu[monthIndex]}`;
  }

  function absenceLabel(typeKey) {
    return ({ ordinary: t('absenceOrdinary'), hospital: t('absenceHospital'), pregnancy: t('absencePregnancy'), childCare: t('absenceChildCare') })[typeKey] || typeKey;
  }

  function minimumLabel(type) {
    if (type === 'guaranteed') return t('guaranteedMinimumName');
    if (type === 'minimum') return t('minimumName');
    return t('noCheck');
  }

  function updateMonthOptions() {
    Array.from(fields.month.options).forEach((option, index) => {
      option.textContent = currentLanguage === 'en' ? `${monthNames.en[index]} 2026` : `2026. ${monthNames.hu[index]}`;
    });
  }

  function applyStaticTranslations() {
    document.documentElement.lang = currentLanguage;
    document.title = t('pageTitle');
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = currentLanguage === 'en'
      ? 'Hungary salary calculator 2026: gross-to-net, net-to-gross, tax allowances, sick leave and total employer cost.'
      : 'Magyar bérkalkulátor 2026: bruttó-nettó, nettó-bruttó, adókedvezmények, betegszabadság és teljes munkáltatói költség.';
    document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach((element) => { element.setAttribute('aria-label', t(element.dataset.i18nAria)); });
    document.querySelectorAll('[data-currency-unit]').forEach((element) => { element.textContent = currencyUnit(); });
    document.querySelectorAll('.language-button').forEach((button) => {
      const active = button.dataset.lang === currentLanguage;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    updateMonthOptions();
  }

  function translateWarning(warning, result) {
    if (currentLanguage === 'hu') return warning;
    const exact = {
      'A megadott születési dátum alapján a 30 év alatti anyák kedvezménye ebben az évben nem alkalmazható.':'The allowance for mothers under 30 is not available in this year based on the entered date of birth.',
      'A 30 év alatti anyák kedvezményét életkori automatikus ellenőrzés nélkül, a felhasználói nyilatkozat alapján alkalmaztuk.':'The allowance for mothers under 30 was applied from the user declaration without automatic age verification.',
      'A megadott születési dátum alapján a kétgyermekes anyák 2026-os kedvezménye nem alkalmazható.':'The 2026 allowance for mothers of two is not available based on the entered date of birth.',
      'A kétgyermekes anyák kedvezményét életkori automatikus ellenőrzés nélkül, a felhasználói nyilatkozat alapján alkalmaztuk.':'The allowance for mothers of two was applied from the user declaration without automatic age verification.',
      'A megadott születési dátum alapján a 25 év alatti fiatalok kedvezménye a kiválasztott hónapban már nem alkalmazható.':'The allowance for employees under 25 is no longer available in the selected month based on the entered date of birth.',
      'A 25 év alatti kedvezményt születési dátum nélküli felhasználói nyilatkozat alapján alkalmaztuk.':'The under-25 allowance was applied from the user declaration without a date of birth.',
      'Saját jogú nyugdíjas munkavállalóként a kalkulátor nem számol 18,5% TB-járulékkal és 13% szochóval.':'For an employee receiving an own-right pension, the calculator does not apply the 18.5% social security contribution or 13% employer social tax.',
      'Saját jogú nyugdíj folyósítása mellett táppénz nem jár; a táppénz összegét ezért 0 Ft-tal vettük figyelembe.':'Statutory sick pay is not payable while an own-right pension is being received, so the sick-pay amount was set to HUF 0.',
      'A kedvezményezett eltartottak száma nem lehet több az eltartottak teljes számánál; a számítást korrigált értékkel végeztük el.':'Eligible dependants cannot exceed total dependants; the calculation used a corrected value.',
      'A tartósan beteg vagy súlyosan fogyatékos kedvezményezettek számát a kedvezményezett eltartottak számához igazítottuk.':'The number of chronically ill or severely disabled eligible dependants was limited to the number of eligible dependants.',
      'A táppénz alapjához add meg az irányadó időszak járulékalapot képező jövedelmét.':'Enter the contribution-liable income for the relevant period to calculate the statutory sick-pay base.',
      'A betegszabadság napi alapját az MVP a havi szerződéses bér és a havi munkanapok arányából becsüli; a tényleges távolléti díj eltérhet.':'The MVP estimates the daily sick-leave base from the monthly contractual salary and working days; actual absence pay may differ.'
    };
    if (exact[warning]) return exact[warning];
    if (warning.startsWith('A megadott bruttó alapbér')) {
      return `The entered gross base salary is below the proportional ${minimumLabel(result.minimum.type)} of ${huf(result.minimum.proportionalMonthly)}.`;
    }
    if (warning.startsWith('A megadott nettó összeghez')) {
      return `The entered net amount would require a gross salary below the statutory ${minimumLabel(result.minimum.type)}. The calculator therefore used at least the proportional gross amount of ${huf(result.minimum.proportionalMonthly)}.`;
    }
    if (warning.includes('esetén nincs betegszabadság')) return `${absenceLabel(result.sickness && result.sickness.typeKey)} does not qualify for sick leave; the entered sick-leave days were ignored.`;
    if (warning.startsWith('Az éves 15 munkanapos')) return `Only ${dayText(result.sickness ? result.sickness.sickLeaveWorkdays : 0)} remained available from the annual 15-working-day sick-leave allowance.`;
    if (warning.startsWith('A táppénz napi összegét')) return `The daily statutory sick-pay amount was capped at the 2026 maximum of ${huf(result.sickness ? result.sickness.sickPayDailyMaximum : 0)}.`;
    return warning;
  }

  function translateError(message) {
    const map = {
      'Adj meg érvényes havi munkanapszámot.':'errorMonthWorkdays',
      'A betegszabadság napjainak száma nem lehet negatív.':'errorSickLeaveNegative',
      'A táppénzes munkanapok száma nem lehet negatív.':'errorSickPayNegative',
      'A betegszabadság és a táppénzes munkanapok összege nem lehet több a havi munkanapok számánál.':'errorTooManySickDays',
      'A táppénzalap jövedelme nem lehet negatív.':'errorBaseIncomeNegative',
      'A táppénzalaphoz legalább 1 naptári napot adj meg.':'errorBaseDays',
      'Adj meg egy 0-nál nem kisebb, érvényes összeget.':'errorAmount',
      'A számítás nem hajtható végre.':'errorCalculation',
      'A kalkulátor jelenlegi verziója a 2026-os magyar szabályokat tartalmazza.':'errorCalculation'
    };
    return t(map[message] || 'errorCalculation');
  }

  function getOptions() {
    return {
      month: fields.month.value,
      weeklyHours: Number(fields.weeklyHours.value),
      minimumType: fields.minimumType.value,
      birthDate: fields.birthDate.value,
      applyUnder25: fields.under25.checked,
      applyUnder30Mother: fields.under30Mother.checked,
      motherExemption: fields.motherExemption.value,
      applyPersonalAllowance: fields.personalAllowance.checked,
      applyFirstMarriage: fields.firstMarriage.checked,
      firstMarriageSharePercent: Number(fields.firstMarriageShare.value),
      totalDependents: Number(fields.totalDependents.value),
      beneficiaryDependents: Number(fields.beneficiaryDependents.value),
      disabledBeneficiaries: Number(fields.disabledBeneficiaries.value),
      familySharePercent: Number(fields.familyShare.value),
      applyFamilyContributionAllowance: fields.familyContribution.checked,
      isPensioner: fields.pensioner.checked,
      sicknessEnabled: fields.sicknessEnabled.checked,
      absenceType: fields.absenceType.value,
      monthWorkdays: Number(fields.monthWorkdays.value),
      sickLeaveWorkdays: Number(fields.sickLeaveWorkdays.value),
      sickLeaveUsedBefore: Number(fields.sickLeaveUsedBefore.value),
      sickPayWorkdays: Number(fields.sickPayWorkdays.value),
      sickPayCalendarDays: Number(fields.sickPayCalendarDays.value),
      sickPayBaseIncome: Number(fields.sickPayBaseIncome.value),
      sickPayBaseDays: Number(fields.sickPayBaseDays.value),
      hasAtLeast730InsuranceDays: fields.insurance730.checked
    };
  }

  function renderMinimum(rule) {
    const minimum = core.getMinimum(rule, fields.minimumType.value, fields.weeklyHours.value);
    $('minimum-label').textContent = minimum.type === 'none' ? t('minimumCheckTitle') : (currentLanguage === 'en' ? `2026 ${minimumLabel(minimum.type)}` : `2026-os ${minimumLabel(minimum.type)}`);
    $('minimum-value').textContent = minimum.type === 'none' ? t('disabled') : huf(minimum.proportionalMonthly);
    $('minimum-period').textContent = minimum.type === 'none'
      ? t('minimumNoCompare')
      : t('weeklyHoursSummary', { hours: Number(fields.weeklyHours.value) || 40, amount: huf(minimum.hourly) });
  }

  function allowanceName(key) {
    return ({
      under30Mother: t('under30MotherAllowance'),
      multiChildMother: t('multiChildMotherAllowance'),
      under25: t('under25Allowance'),
      personal: t('personalAllowance'),
      firstMarriage: t('firstMarriageAllowance'),
      family: t('familyAllowance')
    })[key];
  }

  function setSicknessRowsVisible(visible) {
    document.querySelectorAll('.medical-result-row').forEach((row) => { row.hidden = !visible; });
  }

  function renderAllowanceLines(result) {
    const lines = Object.entries(result.allowances)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => [allowanceName(key), huf(value)]);

    if (result.family.claimedAmount > result.allowances.family) {
      lines.push([t('unusedFamilyAllowance'), huf(result.unusedFamilyAllowance)]);
    }

    if (result.sickness) {
      const sickness = result.sickness;
      lines.push(
        [t('absenceTypeLine'), absenceLabel(sickness.typeKey)],
        [t('monthlyWorkdaysLine'), dayText(sickness.monthWorkdays)],
        [t('workedDaysLine'), dayText(sickness.workedDays)],
        [t('sickLeaveLine'), `${dayText(sickness.sickLeaveWorkdays)} · ${huf(sickness.sickLeaveGross)}`],
        [t('sickPayWorkdaysLine'), dayText(sickness.sickPayWorkdays)],
        [t('sickPayCalendarDaysLine'), dayText(sickness.sickPayCalendarDays)],
        [t('sickPayDailyBaseLine'), `${decimalFormatter.format(sickness.sickPayDailyBase)} ${currencyUnit()}`],
        [t('sickPayRateLine'), `${formatter.format(sickness.sickPayRate * 100)}%`],
        [t('cappedDailySickPayLine'), `${decimalFormatter.format(sickness.cappedDailySickPay)} ${currencyUnit()}`],
        [t('employerSickPayContribution'), huf(sickness.employerSickPayContribution)]
      );
    }

    $('allowance-lines').innerHTML = lines.length
      ? lines.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('')
      : `<div><span>${t('noAllowance')}</span><strong>${huf(0)}</strong></div>`;
  }

  function render(result) {
    lastResult = result;
    $('gross-result').textContent = huf(result.gross);
    $('worked-gross-result').textContent = huf(result.sickness ? result.sickness.workedGross : result.gross);
    $('sick-leave-gross-result').textContent = huf(result.sickness ? result.sickness.sickLeaveGross : 0);
    $('sick-pay-gross-result').textContent = huf(result.sickPayGross);
    $('total-gross-result').textContent = huf(result.totalGross);
    $('allowances-result').textContent = huf(result.totalTaxBaseAllowance);
    $('taxable-result').textContent = huf(result.taxableBase);
    $('tax-result').textContent = minusHuf(result.incomeTax);
    $('raw-tb-result').textContent = minusHuf(result.rawSocialSecurity);
    $('family-contribution-result').textContent = result.familyContributionAllowance ? `+${huf(result.familyContributionAllowance)}` : '0 Ft';
    $('tb-result').textContent = minusHuf(result.socialSecurity);
    $('net-result-label').textContent = result.sickness ? t('netMonthlyPayment') : t('netSalary');
    $('net-result').textContent = huf(result.net);
    $('szocho-result').textContent = huf(result.employerSocialTax);
    $('sick-pay-contribution-result').textContent = huf(result.employerSickPayContribution);
    $('cost-result').textContent = huf(result.employerCost);
    setSicknessRowsVisible(Boolean(result.sickness));
    renderMinimum(result.rule);

    if (mode === 'gross') {
      $('main-result-label').textContent = result.sickness ? t('estimatedNetMonthlyPayment') : t('estimatedNetSalary');
      $('main-result').textContent = formatter.format(result.net);
      $('result-difference').hidden = true;
    } else {
      $('main-result-label').textContent = t('requiredGrossBase');
      $('main-result').textContent = formatter.format(result.gross);
      $('result-difference').textContent = result.netDifference
        ? `${t('achievedNet', { amount: huf(result.net) })} (${t('difference', { value: `${result.netDifference > 0 ? '+' : ''}${formatter.format(result.netDifference)}` })})`
        : t('achievedNet', { amount: huf(result.net) });
      $('result-difference').hidden = false;
    }

    renderAllowanceLines(result);

    if (result.warnings.length) {
      $('warnings').innerHTML = result.warnings.map((warning) => `<p>${translateWarning(warning, result)}</p>`).join('');
      $('warnings').hidden = false;
    } else {
      $('warnings').hidden = true;
      $('warnings').innerHTML = '';
    }
  }

  function updateSicknessDefaults(forceIncome, updateWorkdays) {
    if (updateWorkdays !== false) fields.monthWorkdays.value = core.getMonthWorkdays(fields.month.value) || 23;
    if ((forceIncome || !baseIncomeTouched) && mode === 'gross') {
      const gross = Math.max(0, Number(fields.amount.value) || 0);
      fields.sickPayBaseIncome.value = Math.round(gross * 6);
      fields.sickPayBaseDays.value = 180;
    }
  }

  function updateSicknessUi() {
    const enabled = fields.sicknessEnabled.checked;
    $('sickness-fields').hidden = !enabled;
    if (!enabled) return;

    const type = core.ABSENCE_TYPES[fields.absenceType.value] || core.ABSENCE_TYPES.ordinary;
    const sickLeaveAllowed = type.sickLeaveAllowed;
    fields.sickLeaveWorkdays.disabled = !sickLeaveAllowed;
    fields.sickLeaveUsedBefore.disabled = !sickLeaveAllowed;
    fields.sickLeaveWorkdays.closest('.field').style.opacity = sickLeaveAllowed ? '1' : '.55';
    fields.sickLeaveUsedBefore.closest('.field').style.opacity = sickLeaveAllowed ? '1' : '.55';

    const dailyBase = Math.max(0, Number(fields.sickPayBaseIncome.value) || 0) / Math.max(1, Number(fields.sickPayBaseDays.value) || 1);
    const rate = type.fixedSickPayRate == null ? (fields.insurance730.checked ? 0.60 : 0.50) : type.fixedSickPayRate;
    const dailyPay = Math.min(dailyBase * rate, core.getRules(fields.month.value).sickness.sickPayDailyMaximum);
    const availableSickLeave = Math.max(0, 15 - Math.max(0, Number(fields.sickLeaveUsedBefore.value) || 0));
    $('sickness-preview').innerHTML = [
      `<strong>${t('sickLeavePreview')}</strong> ${sickLeaveAllowed ? t('remainingSickLeave', { days: formatter.format(availableSickLeave) }) : t('notAvailableForType')}.`,
      `<strong>${t('sickPayPreview')}</strong> ${formatter.format(rate * 100)}%, ${t('estimatedDailyAmount', { amount: `${decimalFormatter.format(dailyPay)} ${currencyUnit()}` })}`,
      `(${t('dailyMaximum', { amount: huf(core.getRules(fields.month.value).sickness.sickPayDailyMaximum) })}).`
    ].join(' ');
  }

  function validateSicknessInputs() {
    if (!fields.sicknessEnabled.checked) return;
    const monthDays = Number(fields.monthWorkdays.value);
    const sickLeaveDays = Number(fields.sickLeaveWorkdays.value);
    const sickPayWorkdays = Number(fields.sickPayWorkdays.value);
    if (!Number.isFinite(monthDays) || monthDays < 1) throw new Error(t('errorMonthWorkdays'));
    if (!Number.isFinite(sickLeaveDays) || sickLeaveDays < 0) throw new Error(t('errorSickLeaveNegative'));
    if (!Number.isFinite(sickPayWorkdays) || sickPayWorkdays < 0) throw new Error(t('errorSickPayNegative'));
    if (sickLeaveDays + sickPayWorkdays > monthDays) throw new Error(t('errorTooManySickDays'));
    if (Number(fields.sickPayBaseIncome.value) < 0) throw new Error(t('errorBaseIncomeNegative'));
    if (Number(fields.sickPayBaseDays.value) < 1) throw new Error(t('errorBaseDays'));
  }

  function calculate() {
    $('form-error').hidden = true;
    try {
      const amount = Number(fields.amount.value);
      if (!Number.isFinite(amount) || amount < 0) throw new Error(t('errorAmount'));
      validateSicknessInputs();
      const result = mode === 'gross'
        ? core.calculateFromGross(amount, getOptions())
        : core.calculateFromNet(amount, getOptions());
      render(result);
      updateSicknessUi();
    } catch (error) {
      $('form-error').textContent = error.message || t('errorCalculation');
      $('form-error').hidden = false;
    }
  }

  function scheduleCalculation() {
    window.clearTimeout(calculationTimer);
    calculationTimer = window.setTimeout(calculate, 120);
  }

  function convertAmountForModeChange(previousMode, nextMode) {
    if (previousMode === nextMode) return false;

    const currentAmount = Number(fields.amount.value);
    if (!Number.isFinite(currentAmount) || currentAmount < 0) return false;

    validateSicknessInputs();
    const options = getOptions();
    const convertedResult = previousMode === 'gross'
      ? core.calculateFromGross(currentAmount, options)
      : core.calculateFromNet(currentAmount, options);

    fields.amount.value = nextMode === 'net'
      ? convertedResult.net
      : convertedResult.gross;
    return true;
  }

  function setMode(nextMode) {
    const previousMode = mode;
    const modeChanged = previousMode !== nextMode;
    let amountConverted = false;

    window.clearTimeout(calculationTimer);
    if (modeChanged) {
      try {
        amountConverted = convertAmountForModeChange(previousMode, nextMode);
      } catch (_) {
        amountConverted = false;
      }
    }

    mode = nextMode;
    document.querySelectorAll('.mode-tab').forEach((button) => {
      const active = button.dataset.mode === mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    if (mode === 'gross') {
      $('amount-label').textContent = fields.sicknessEnabled.checked ? t('contractualGrossBase') : t('monthlyGrossBase');
      $('amount-hint').textContent = fields.sicknessEnabled.checked
        ? t('contractualGrossHint')
        : t('monthlyGrossHint');
      if (!baseIncomeTouched && !amountConverted) updateSicknessDefaults(true, false);
    } else {
      $('amount-label').textContent = t('desiredNetPayment');
      $('amount-hint').textContent = fields.sicknessEnabled.checked
        ? t('desiredNetSicknessHint')
        : t('desiredNetHint');
    }
    calculate();
  }

  function updateEligibilityHints() {
    const birthDate = fields.birthDate.value;
    const month = fields.month.value;
    const under25 = core.isUnder25Eligible(birthDate, month);
    if (under25 === false && fields.under25.checked) fields.under25.checked = false;
    fields.under25.closest('.check-row').style.opacity = under25 === false ? '.55' : '1';
    fields.under25.disabled = under25 === false;
  }

  document.querySelectorAll('.mode-tab').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));

  function applyMinimumPreset(minimumType) {
    fields.minimumType.value = minimumType;
    const rule = core.getRules(fields.month.value);
    const minimum = core.getMinimum(rule, minimumType, fields.weeklyHours.value);

    if (mode === 'gross') {
      fields.amount.value = minimum.proportionalMonthly;
      baseIncomeTouched = false;
      updateSicknessDefaults(true, false);
    } else {
      if (!baseIncomeTouched) {
        fields.sickPayBaseIncome.value = Math.round(minimum.proportionalMonthly * 6);
        fields.sickPayBaseDays.value = 180;
      }
      const minimumNetResult = core.calculateFromGross(minimum.proportionalMonthly, getOptions());
      fields.amount.value = minimumNetResult.net;
    }

    updateSicknessUi();
    calculate();
  }

  $('use-minimum').addEventListener('click', () => applyMinimumPreset('minimum'));
  $('use-guaranteed').addEventListener('click', () => applyMinimumPreset('guaranteed'));

  fields.firstMarriage.addEventListener('change', () => {
    $('first-marriage-share-wrap').hidden = !fields.firstMarriage.checked;
    calculate();
  });

  fields.sicknessEnabled.addEventListener('change', () => {
    updateSicknessUi();
    setMode(mode);
  });

  fields.absenceType.addEventListener('change', () => {
    updateSicknessUi();
    calculate();
  });

  fields.month.addEventListener('change', () => {
    updateEligibilityHints();
    updateSicknessDefaults(false, true);
    updateSicknessUi();
    calculate();
  });

  fields.sickPayBaseIncome.addEventListener('input', () => {
    baseIncomeTouched = true;
    updateSicknessUi();
    scheduleCalculation();
  });

  const inputFields = [
    fields.amount, fields.weeklyHours, fields.totalDependents, fields.beneficiaryDependents,
    fields.disabledBeneficiaries, fields.monthWorkdays, fields.sickLeaveWorkdays,
    fields.sickLeaveUsedBefore, fields.sickPayWorkdays, fields.sickPayCalendarDays,
    fields.sickPayBaseDays
  ];
  inputFields.forEach((field) => field.addEventListener('input', () => {
    if (field === fields.amount && mode === 'gross' && !baseIncomeTouched) updateSicknessDefaults(true, false);
    updateSicknessUi();
    scheduleCalculation();
  }));

  const changeFields = [
    fields.minimumType, fields.birthDate, fields.under25, fields.under30Mother, fields.motherExemption,
    fields.personalAllowance, fields.firstMarriageShare, fields.familyShare, fields.familyContribution,
    fields.pensioner, fields.insurance730
  ];
  changeFields.forEach((field) => field.addEventListener('change', () => {
    if (field === fields.birthDate) updateEligibilityHints();
    updateSicknessUi();
    calculate();
  }));

  fields.amount.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      window.clearTimeout(calculationTimer);
      calculate();
    }
  });

  $('copy-result').addEventListener('click', async () => {
    if (!lastResult) return;
    const lines = [
      `${t('monthCopy')}: ${formatMonthLabel(fields.month.value)}` ,
      `${t('contractualGrossCopy')}: ${huf(lastResult.gross)}`
    ];
    if (lastResult.sickness) {
      lines.push(
        `${t('absenceCopy')}: ${absenceLabel(lastResult.sickness.typeKey)}` ,
        `${t('workedGrossCopy')}: ${huf(lastResult.sickness.workedGross)}` ,
        `${t('sickLeaveCopy')}: ${dayText(lastResult.sickness.sickLeaveWorkdays)} · ${huf(lastResult.sickness.sickLeaveGross)}` ,
        `${t('sickPayCopy')}: ${dayText(lastResult.sickness.sickPayCalendarDays)} · ${huf(lastResult.sickPayGross)}` ,
        `${t('totalGrossCopy')}: ${huf(lastResult.totalGross)}`
      );
    }
    lines.push(
      `${t('allowancesCopy')}: ${huf(lastResult.totalTaxBaseAllowance)}` ,
      `${t('incomeTaxCopy')}: ${huf(lastResult.incomeTax)}` ,
      `${t('socialSecurityCopy')}: ${huf(lastResult.socialSecurity)}` ,
      `${t('netPaymentCopy')}: ${huf(lastResult.net)}` ,
      `${t('employerSocialTaxCopy')}: ${huf(lastResult.employerSocialTax)}` ,
      `${t('employerSickPayCopy')}: ${huf(lastResult.employerSickPayContribution)}` ,
      `${t('employerCostCopy')}: ${huf(lastResult.employerCost)}`
    );
    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      $('copy-result').textContent = t('copied');
      setTimeout(() => { $('copy-result').textContent = t('copyResult'); }, 1300);
    } catch (_) {
      window.prompt(t('copyPrompt'), text);
    }
  });

  document.querySelectorAll('.language-button').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.lang === currentLanguage) return;
      currentLanguage = button.dataset.lang === 'en' ? 'en' : 'hu';
      storeLanguage(currentLanguage);
      refreshFormatters();
      applyStaticTranslations();
      setMode(mode);
      updateSicknessUi();
    });
  });

  applyStaticTranslations();
  updateEligibilityHints();
  updateSicknessDefaults(false, true);
  updateSicknessUi();
  renderMinimum(core.getRules(fields.month.value));
  calculate();
})();

