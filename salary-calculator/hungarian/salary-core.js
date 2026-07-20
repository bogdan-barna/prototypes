(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HungarianSalaryCore = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const WORKDAYS = {
    '2026-01': 21, '2026-02': 20, '2026-03': 22, '2026-04': 20,
    '2026-05': 19, '2026-06': 22, '2026-07': 23, '2026-08': 20,
    '2026-09': 22, '2026-10': 21, '2026-11': 21, '2026-12': 22
  };

  const ABSENCE_TYPES = {
    ordinary: {
      label: 'Saját betegség',
      sickLeaveAllowed: true,
      fixedSickPayRate: null,
      employerContributionRate: 1 / 3
    },
    hospital: {
      label: 'Kórházi / fekvőbeteg-ellátás',
      sickLeaveAllowed: true,
      fixedSickPayRate: 0.50,
      employerContributionRate: 1 / 3
    },
    pregnancy: {
      label: 'Veszélyeztetett várandósság',
      sickLeaveAllowed: false,
      fixedSickPayRate: null,
      employerContributionRate: 1 / 3
    },
    childCare: {
      label: 'Gyermekápolási táppénz (GYÁP)',
      sickLeaveAllowed: false,
      fixedSickPayRate: null,
      employerContributionRate: 0
    }
  };

  const RULES = [
    {
      id: 'hu-2026',
      validFrom: '2026-01',
      validTo: '2026-12',
      label: '2026. január 1. – 2026. december 31.',
      verifiedAt: '2026-07-15',
      fullTimeWeeklyHours: 40,
      minimumWage: {
        monthly: 322800,
        weekly: 74210,
        daily: 14850,
        hourly: 1856
      },
      guaranteedMinimum: {
        monthly: 373200,
        weekly: 85800,
        daily: 17160,
        hourly: 2145
      },
      incomeTaxRate: 0.15,
      socialSecurityRate: 0.185,
      employerSocialTaxRate: 0.13,
      under25MonthlyLimit: 715765,
      personalAllowance: 107600,
      firstMarriageAllowance: 33335,
      familyAllowance: {
        oneDependentPerBeneficiary: 133340,
        twoDependentsPerBeneficiary: 266660,
        threeOrMorePerBeneficiary: 440000,
        disabledExtraPerBeneficiary: 133340
      },
      sickness: {
        annualSickLeaveWorkdays: 15,
        sickLeaveRate: 0.70,
        sickPayRateLongInsurance: 0.60,
        sickPayRateShortInsurance: 0.50,
        sickPayDailyMaximum: 21520
      }
    }
  ];

  function roundHuf(value) {
    return Math.round(Number(value) || 0);
  }

  function roundMoney(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
  }

  function normalizeMonth(month) {
    return String(month || '').slice(0, 7);
  }

  function getRules(month) {
    const normalized = normalizeMonth(month);
    const rule = RULES.find((item) => normalized >= item.validFrom && normalized <= item.validTo);
    if (!rule) throw new Error('A kalkulátor jelenlegi verziója a 2026-os magyar szabályokat tartalmazza.');
    return rule;
  }

  function getMonthWorkdays(month) {
    return WORKDAYS[normalizeMonth(month)] || 0;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function clampInt(value, min, max) {
    return Math.min(max, Math.max(min, Math.trunc(Number(value) || 0)));
  }

  function monthIndex(month) {
    const normalized = normalizeMonth(month);
    if (!/^\d{4}-\d{2}$/.test(normalized)) return null;
    const [year, mon] = normalized.split('-').map(Number);
    return year * 12 + mon - 1;
  }

  function birthdayMonthIndex(birthDate, years) {
    if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(String(birthDate))) return null;
    const [year, month] = String(birthDate).split('-').map(Number);
    return (year + years) * 12 + month - 1;
  }

  function isUnder25Eligible(birthDate, month) {
    const selected = monthIndex(month);
    const twentyFifth = birthdayMonthIndex(birthDate, 25);
    if (selected === null || twentyFifth === null) return null;
    return selected <= twentyFifth;
  }

  function isUnder30MotherEligibleByAge(birthDate, month) {
    const selectedYear = Number(normalizeMonth(month).slice(0, 4));
    if (!birthDate || !selectedYear) return null;
    const birthYear = Number(String(birthDate).slice(0, 4));
    return birthYear >= selectedYear - 30 + 1;
  }

  function isTwoChildMotherEligibleByAge(birthDate, month) {
    const selectedYear = Number(normalizeMonth(month).slice(0, 4));
    if (!birthDate || !selectedYear) return null;
    const birthYear = Number(String(birthDate).slice(0, 4));
    return birthYear >= selectedYear - 40 + 1;
  }

  function getMinimum(rule, minimumType, weeklyHours) {
    if (minimumType === 'none') {
      return { type: 'none', fullTimeMonthly: 0, proportionalMonthly: 0, hourly: 0, label: 'Nincs ellenőrzés' };
    }
    const source = minimumType === 'guaranteed' ? rule.guaranteedMinimum : rule.minimumWage;
    const hours = clamp(weeklyHours, 1, rule.fullTimeWeeklyHours);
    return {
      type: minimumType,
      fullTimeMonthly: source.monthly,
      proportionalMonthly: roundHuf(source.monthly * hours / rule.fullTimeWeeklyHours),
      hourly: source.hourly,
      label: minimumType === 'guaranteed' ? 'Garantált bérminimum' : 'Minimálbér'
    };
  }

  function getFamilyAllowance(rule, options) {
    const totalDependents = Math.max(0, Math.trunc(Number(options.totalDependents) || 0));
    const beneficiaryDependents = Math.max(0, Math.min(totalDependents, Math.trunc(Number(options.beneficiaryDependents) || 0)));
    const disabledBeneficiaries = Math.max(0, Math.min(beneficiaryDependents, Math.trunc(Number(options.disabledBeneficiaries) || 0)));
    const share = clamp(options.familySharePercent == null ? 100 : options.familySharePercent, 0, 100) / 100;

    let perBeneficiary = 0;
    if (totalDependents === 1) perBeneficiary = rule.familyAllowance.oneDependentPerBeneficiary;
    else if (totalDependents === 2) perBeneficiary = rule.familyAllowance.twoDependentsPerBeneficiary;
    else if (totalDependents >= 3) perBeneficiary = rule.familyAllowance.threeOrMorePerBeneficiary;

    const standard = perBeneficiary * beneficiaryDependents;
    const disabledExtra = rule.familyAllowance.disabledExtraPerBeneficiary * disabledBeneficiaries;
    return {
      totalDependents,
      beneficiaryDependents,
      disabledBeneficiaries,
      share,
      fullAmount: roundHuf(standard + disabledExtra),
      claimedAmount: roundHuf((standard + disabledExtra) * share)
    };
  }

  function consumeAllowance(remainingBase, requested) {
    const used = Math.min(Math.max(0, remainingBase), Math.max(0, requested));
    return { used, remaining: Math.max(0, remainingBase - used) };
  }

  function calculateSickness(contractualGross, settings, rule) {
    const type = ABSENCE_TYPES[settings.absenceType] || ABSENCE_TYPES.ordinary;
    const monthWorkdays = clampInt(settings.monthWorkdays || getMonthWorkdays(settings.month), 1, 31);
    const sickLeaveUsedBefore = clampInt(settings.sickLeaveUsedBefore, 0, rule.sickness.annualSickLeaveWorkdays);
    const requestedSickLeaveWorkdays = clampInt(settings.sickLeaveWorkdays, 0, monthWorkdays);
    const availableSickLeave = Math.max(0, rule.sickness.annualSickLeaveWorkdays - sickLeaveUsedBefore);
    const sickLeaveWorkdays = type.sickLeaveAllowed ? Math.min(requestedSickLeaveWorkdays, availableSickLeave) : 0;
    const sickPayWorkdays = clampInt(settings.sickPayWorkdays, 0, Math.max(0, monthWorkdays - sickLeaveWorkdays));
    const sickPayCalendarDays = clampInt(settings.sickPayCalendarDays, 0, 366);
    const workedDays = Math.max(0, monthWorkdays - sickLeaveWorkdays - sickPayWorkdays);
    const dailyWage = contractualGross / monthWorkdays;
    const workedGross = roundHuf(dailyWage * workedDays);
    const sickLeaveGross = roundHuf(dailyWage * rule.sickness.sickLeaveRate * sickLeaveWorkdays);
    const wageGross = workedGross + sickLeaveGross;

    const baseIncomeTotal = Math.max(0, Number(settings.sickPayBaseIncome) || 0);
    const baseCalendarDays = clampInt(settings.sickPayBaseDays, 1, 366);
    const sickPayDailyBase = roundMoney(baseIncomeTotal / baseCalendarDays);
    const sickPayRate = type.fixedSickPayRate == null
      ? (settings.hasAtLeast730InsuranceDays ? rule.sickness.sickPayRateLongInsurance : rule.sickness.sickPayRateShortInsurance)
      : type.fixedSickPayRate;
    const calculatedDailySickPay = roundMoney(sickPayDailyBase * sickPayRate);
    const cappedDailySickPay = Math.min(calculatedDailySickPay, rule.sickness.sickPayDailyMaximum);
    const sickPayGrossBeforePensioner = roundHuf(cappedDailySickPay * sickPayCalendarDays);
    const sickPayGross = settings.isPensioner ? 0 : sickPayGrossBeforePensioner;
    const employerSickPayContribution = roundHuf(sickPayGross * type.employerContributionRate);

    return {
      enabled: true,
      typeKey: settings.absenceType,
      typeLabel: type.label,
      monthWorkdays,
      workedDays,
      requestedSickLeaveWorkdays,
      sickLeaveUsedBefore,
      availableSickLeave,
      sickLeaveWorkdays,
      sickPayWorkdays,
      sickPayCalendarDays,
      dailyWage: roundMoney(dailyWage),
      workedGross,
      sickLeaveRate: rule.sickness.sickLeaveRate,
      sickLeaveGross,
      wageGross,
      sickPayBaseIncome: baseIncomeTotal,
      sickPayBaseDays: baseCalendarDays,
      sickPayDailyBase,
      sickPayRate,
      calculatedDailySickPay,
      cappedDailySickPay,
      sickPayDailyMaximum: rule.sickness.sickPayDailyMaximum,
      sickPayGross,
      employerSickPayContribution,
      sickLeaveAllowed: type.sickLeaveAllowed,
      employerContributionRate: type.employerContributionRate
    };
  }

  function calculateFromGross(grossInput, options) {
    const settings = Object.assign({
      month: '2026-07',
      weeklyHours: 40,
      minimumType: 'minimum',
      birthDate: '',
      applyUnder25: false,
      applyUnder30Mother: false,
      motherExemption: 'none',
      applyPersonalAllowance: false,
      applyFirstMarriage: false,
      firstMarriageSharePercent: 100,
      totalDependents: 0,
      beneficiaryDependents: 0,
      disabledBeneficiaries: 0,
      familySharePercent: 100,
      applyFamilyContributionAllowance: true,
      isPensioner: false,
      sicknessEnabled: false,
      absenceType: 'ordinary',
      monthWorkdays: 23,
      sickLeaveWorkdays: 0,
      sickLeaveUsedBefore: 0,
      sickPayWorkdays: 0,
      sickPayCalendarDays: 0,
      sickPayBaseIncome: 0,
      sickPayBaseDays: 180,
      hasAtLeast730InsuranceDays: true
    }, options || {});

    const rule = getRules(settings.month);
    const gross = roundHuf(Math.max(0, Number(grossInput) || 0));
    const warnings = [];
    const minimum = getMinimum(rule, settings.minimumType, settings.weeklyHours);

    if (minimum.type !== 'none' && gross < minimum.proportionalMonthly) {
      warnings.push(`A megadott bruttó alapbér ${formatPlain(gross)} Ft, ami alacsonyabb az arányos ${minimum.label.toLowerCase()} ${formatPlain(minimum.proportionalMonthly)} Ft-os összegénél.`);
    }

    const sickness = settings.sicknessEnabled ? calculateSickness(gross, settings, rule) : null;
    const wageGross = sickness ? sickness.wageGross : gross;
    const sickPayGross = sickness ? sickness.sickPayGross : 0;
    const totalGross = wageGross + sickPayGross;

    let remainingTaxBase = totalGross;
    const allowances = {
      under30Mother: 0,
      multiChildMother: 0,
      under25: 0,
      personal: 0,
      firstMarriage: 0,
      family: 0
    };

    if (settings.applyUnder30Mother) {
      const ageCheck = isUnder30MotherEligibleByAge(settings.birthDate, settings.month);
      if (ageCheck === false) {
        warnings.push('A megadott születési dátum alapján a 30 év alatti anyák kedvezménye ebben az évben nem alkalmazható.');
      } else {
        const step = consumeAllowance(remainingTaxBase, remainingTaxBase);
        allowances.under30Mother = step.used;
        remainingTaxBase = step.remaining;
        if (ageCheck === null) warnings.push('A 30 év alatti anyák kedvezményét életkori automatikus ellenőrzés nélkül, a felhasználói nyilatkozat alapján alkalmaztuk.');
      }
    }

    if (settings.motherExemption && settings.motherExemption !== 'none') {
      let eligible = true;
      if (settings.motherExemption === 'two') {
        const ageCheck = isTwoChildMotherEligibleByAge(settings.birthDate, settings.month);
        if (ageCheck === false) {
          eligible = false;
          warnings.push('A megadott születési dátum alapján a kétgyermekes anyák 2026-os kedvezménye nem alkalmazható.');
        } else if (ageCheck === null) {
          warnings.push('A kétgyermekes anyák kedvezményét életkori automatikus ellenőrzés nélkül, a felhasználói nyilatkozat alapján alkalmaztuk.');
        }
      }
      if (eligible) {
        const step = consumeAllowance(remainingTaxBase, remainingTaxBase);
        allowances.multiChildMother = step.used;
        remainingTaxBase = step.remaining;
      }
    }

    if (settings.applyUnder25) {
      const ageCheck = isUnder25Eligible(settings.birthDate, settings.month);
      if (ageCheck === false) {
        warnings.push('A megadott születési dátum alapján a 25 év alatti fiatalok kedvezménye a kiválasztott hónapban már nem alkalmazható.');
      } else {
        const step = consumeAllowance(remainingTaxBase, rule.under25MonthlyLimit);
        allowances.under25 = step.used;
        remainingTaxBase = step.remaining;
        if (ageCheck === null) warnings.push('A 25 év alatti kedvezményt születési dátum nélküli felhasználói nyilatkozat alapján alkalmaztuk.');
      }
    }

    if (settings.applyPersonalAllowance) {
      const step = consumeAllowance(remainingTaxBase, rule.personalAllowance);
      allowances.personal = step.used;
      remainingTaxBase = step.remaining;
    }

    if (settings.applyFirstMarriage) {
      const share = clamp(settings.firstMarriageSharePercent == null ? 100 : settings.firstMarriageSharePercent, 0, 100) / 100;
      const step = consumeAllowance(remainingTaxBase, roundHuf(rule.firstMarriageAllowance * share));
      allowances.firstMarriage = step.used;
      remainingTaxBase = step.remaining;
    }

    const family = getFamilyAllowance(rule, settings);
    const familyRequested = family.claimedAmount;
    const familyStep = consumeAllowance(remainingTaxBase, familyRequested);
    allowances.family = familyStep.used;
    remainingTaxBase = familyStep.remaining;

    const taxableBase = roundHuf(remainingTaxBase);
    const incomeTax = roundHuf(taxableBase * rule.incomeTaxRate);
    const rawSocialSecurity = settings.isPensioner ? 0 : roundHuf(wageGross * rule.socialSecurityRate);
    const unusedFamilyAllowance = Math.max(0, familyRequested - allowances.family);
    const familyContributionAllowance = (!settings.isPensioner && settings.applyFamilyContributionAllowance)
      ? Math.min(rawSocialSecurity, roundHuf(unusedFamilyAllowance * rule.incomeTaxRate))
      : 0;
    const socialSecurity = Math.max(0, rawSocialSecurity - familyContributionAllowance);
    const net = totalGross - incomeTax - socialSecurity;
    const employerSocialTax = settings.isPensioner ? 0 : roundHuf(wageGross * rule.employerSocialTaxRate);
    const employerSickPayContribution = sickness ? sickness.employerSickPayContribution : 0;
    const employerCost = wageGross + employerSocialTax + employerSickPayContribution;

    if (settings.isPensioner) {
      warnings.push('Saját jogú nyugdíjas munkavállalóként a kalkulátor nem számol 18,5% TB-járulékkal és 13% szochóval.');
      if (sickness && sickness.sickPayCalendarDays > 0) warnings.push('Saját jogú nyugdíj folyósítása mellett táppénz nem jár; a táppénz összegét ezért 0 Ft-tal vettük figyelembe.');
    }
    if (settings.beneficiaryDependents > settings.totalDependents) {
      warnings.push('A kedvezményezett eltartottak száma nem lehet több az eltartottak teljes számánál; a számítást korrigált értékkel végeztük el.');
    }
    if (settings.disabledBeneficiaries > settings.beneficiaryDependents) {
      warnings.push('A tartósan beteg vagy súlyosan fogyatékos kedvezményezettek számát a kedvezményezett eltartottak számához igazítottuk.');
    }
    if (sickness) {
      if (!sickness.sickLeaveAllowed && sickness.requestedSickLeaveWorkdays > 0) {
        warnings.push(`${sickness.typeLabel} esetén nincs betegszabadság; a megadott betegszabadság-napokat nem vettük figyelembe.`);
      }
      if (sickness.requestedSickLeaveWorkdays > sickness.sickLeaveWorkdays && sickness.sickLeaveAllowed) {
        warnings.push(`Az éves 15 munkanapos betegszabadság-keretből legfeljebb ${sickness.sickLeaveWorkdays} nap volt még felhasználható.`);
      }
      if (sickness.sickPayCalendarDays > 0 && sickness.sickPayBaseIncome <= 0) {
        warnings.push('A táppénz alapjához add meg az irányadó időszak járulékalapot képező jövedelmét.');
      }
      if (sickness.calculatedDailySickPay > sickness.sickPayDailyMaximum) {
        warnings.push(`A táppénz napi összegét a 2026-os ${formatPlain(sickness.sickPayDailyMaximum)} Ft-os maximumra korlátoztuk.`);
      }
      if (sickness.sickLeaveWorkdays > 0) warnings.push('A betegszabadság napi alapját az MVP a havi szerződéses bér és a havi munkanapok arányából becsüli; a tényleges távolléti díj eltérhet.');
    }

    return {
      rule,
      gross,
      contractualGross: gross,
      minimum,
      sickness,
      wageGross,
      sickPayGross,
      totalGross,
      allowances,
      totalTaxBaseAllowance: Object.values(allowances).reduce((sum, value) => sum + value, 0),
      taxableBase,
      incomeTax,
      rawSocialSecurity,
      family,
      unusedFamilyAllowance,
      familyContributionAllowance,
      socialSecurity,
      net,
      employerSocialTax,
      employerSickPayContribution,
      employerCost,
      employeeDeductions: incomeTax + socialSecurity,
      warnings
    };
  }

  function calculateFromNet(netInput, options) {
    const targetNet = roundHuf(Math.max(0, Number(netInput) || 0));
    const settings = Object.assign({ month: '2026-07' }, options || {});
    const rule = getRules(settings.month);
    const minimum = getMinimum(rule, settings.minimumType || 'none', settings.weeklyHours || rule.fullTimeWeeklyHours);
    const minimumGross = minimum.type === 'none' ? 0 : minimum.proportionalMonthly;
    const minimumResult = calculateFromGross(minimumGross, settings);

    let low = minimumGross;
    let high = Math.max(1000000, targetNet * 2 + 100000, minimumGross);
    let highResult = calculateFromGross(high, settings);
    while (highResult.net < targetNet && high < 1000000000) {
      high *= 2;
      highResult = calculateFromGross(high, settings);
    }

    let best = null;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const result = calculateFromGross(mid, settings);
      const difference = Math.abs(result.net - targetNet);
      if (!best || difference < best.difference || (difference === best.difference && result.gross < best.result.gross)) {
        best = { difference, result };
      }
      if (result.net < targetNet) low = mid + 1;
      else if (result.net > targetNet) high = mid - 1;
      else {
        best = { difference: 0, result };
        high = mid - 1;
      }
    }

    const center = best ? best.result.gross : low;
    for (let gross = Math.max(minimumGross, center - 20); gross <= center + 20; gross += 1) {
      const result = calculateFromGross(gross, settings);
      const difference = Math.abs(result.net - targetNet);
      if (!best || difference < best.difference || (difference === best.difference && gross < best.result.gross)) {
        best = { difference, result };
      }
    }

    const finalResult = Object.assign({}, best.result, {
      targetNet,
      netDifference: best.result.net - targetNet,
      minimumAdjusted: minimum.type !== 'none' && targetNet < minimumResult.net
    });

    if (finalResult.minimumAdjusted) {
      finalResult.warnings = finalResult.warnings.slice();
      finalResult.warnings.unshift(
        `A megadott nettó összeghez a törvényes ${minimum.label.toLowerCase()} alatti bruttó tartozna. ` +
        `A kalkulátor ezért legalább az arányos ${formatPlain(minimumGross)} Ft-os bruttó összeggel számolt.`
      );
    }

    return finalResult;
  }

  function formatPlain(value) {
    return new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 }).format(value);
  }

  return {
    RULES,
    WORKDAYS,
    ABSENCE_TYPES,
    getRules,
    getMonthWorkdays,
    getMinimum,
    getFamilyAllowance,
    isUnder25Eligible,
    isUnder30MotherEligibleByAge,
    isTwoChildMotherEligibleByAge,
    calculateSickness,
    calculateFromGross,
    calculateFromNet,
    roundHuf
  };
});
