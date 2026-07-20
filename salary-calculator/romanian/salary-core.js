(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RomanianSalaryCore = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const RULES = [
    {
      id: 'ro-2026-h1',
      validFrom: '2026-01',
      validTo: '2026-06',
      minimumGross: 4050,
      averageMonthlyHours: 165.334,
      minimumHourly: 24.496,
      nonTaxableAmount: 300,
      exemptionGrossLimit: 4300,
      casRate: 0.25,
      cassRate: 0.10,
      incomeTaxRate: 0.10,
      camRate: 0.0225,
      label: '1 ianuarie – 30 iunie 2026'
    },
    {
      id: 'ro-2026-h2',
      validFrom: '2026-07',
      validTo: '2026-12',
      minimumGross: 4325,
      averageMonthlyHours: 166.667,
      minimumHourly: 25.949,
      nonTaxableAmount: 200,
      exemptionGrossLimit: 4600,
      casRate: 0.25,
      cassRate: 0.10,
      incomeTaxRate: 0.10,
      camRate: 0.0225,
      label: '1 iulie – 31 decembrie 2026'
    }
  ];

  const WORKDAYS = {
    '2025-01': 18, '2025-02': 20, '2025-03': 21, '2025-04': 20,
    '2025-05': 21, '2025-06': 20, '2025-07': 23, '2025-08': 20,
    '2025-09': 22, '2025-10': 23, '2025-11': 20, '2025-12': 20,
    '2026-01': 18, '2026-02': 20, '2026-03': 22, '2026-04': 20,
    '2026-05': 20, '2026-06': 21, '2026-07': 23, '2026-08': 21,
    '2026-09': 22, '2026-10': 22, '2026-11': 20, '2026-12': 21
  };


  const MINIMUM_GROSS_BY_MONTH = {
    '2025-01': 4050, '2025-02': 4050, '2025-03': 4050, '2025-04': 4050,
    '2025-05': 4050, '2025-06': 4050, '2025-07': 4050, '2025-08': 4050,
    '2025-09': 4050, '2025-10': 4050, '2025-11': 4050, '2025-12': 4050,
    '2026-01': 4050, '2026-02': 4050, '2026-03': 4050, '2026-04': 4050,
    '2026-05': 4050, '2026-06': 4050, '2026-07': 4325, '2026-08': 4325,
    '2026-09': 4325, '2026-10': 4325, '2026-11': 4325, '2026-12': 4325
  };

  const MEDICAL_TYPES = {
    ordinary: {
      label: 'Boală obișnuită / accident în afara muncii (cod 01)',
      rate: null,
      employerFirstDays: true,
      cassApplies: true,
      incomeTaxExempt: false,
      oneDayReductionExempt: false
    },
    cardiovascular: {
      label: 'Boală cardiovasculară eligibilă',
      rate: 0.75,
      employerFirstDays: true,
      cassApplies: false,
      incomeTaxExempt: false,
      oneDayReductionExempt: false
    },
    serious: {
      label: 'Afecțiune gravă / urgență medico-chirurgicală',
      rate: 1,
      employerFirstDays: true,
      cassApplies: false,
      incomeTaxExempt: false,
      oneDayReductionExempt: false
    },
    quarantine: {
      label: 'Carantină sau izolare (cod 07)',
      rate: 1,
      employerFirstDays: false,
      cassApplies: true,
      incomeTaxExempt: false,
      oneDayReductionExempt: false
    },
    maternity: {
      label: 'Sarcină și lăuzie (cod 08)',
      rate: 0.85,
      employerFirstDays: false,
      cassApplies: false,
      incomeTaxExempt: true,
      oneDayReductionExempt: true
    },
    childCare: {
      label: 'Îngrijirea copilului bolnav',
      rate: 0.85,
      employerFirstDays: false,
      cassApplies: false,
      incomeTaxExempt: true,
      oneDayReductionExempt: false
    },
    oncologyCare: {
      label: 'Îngrijirea pacientului cu afecțiuni oncologice',
      rate: 0.85,
      employerFirstDays: false,
      cassApplies: false,
      incomeTaxExempt: true,
      oneDayReductionExempt: true
    },
    maternalRisk: {
      label: 'Risc maternal (cod 15)',
      rate: 0.75,
      employerFirstDays: false,
      cassApplies: false,
      incomeTaxExempt: true,
      oneDayReductionExempt: true
    }
  };

  function roundLei(value) {
    return Math.round(Number(value) || 0);
  }

  function roundMoney(value) {
    return Math.trunc((Number(value) || 0) * 100) / 100;
  }

  function normalizeMonth(month) {
    if (!month) return '';
    return String(month).slice(0, 7);
  }

  function getRules(month) {
    const normalized = normalizeMonth(month);
    const rule = RULES.find((item) => normalized >= item.validFrom && normalized <= item.validTo);
    if (!rule) {
      throw new Error('Calculatorul include momentan doar regulile aferente anului 2026.');
    }
    return rule;
  }

  function getMonthWorkdays(month) {
    return WORKDAYS[normalizeMonth(month)] || 0;
  }

  function addMonths(month, delta) {
    const [year, monthNumber] = normalizeMonth(month).split('-').map(Number);
    const date = new Date(Date.UTC(year, monthNumber - 1 + delta, 1));
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
  }

  function getPreviousSixWorkdays(month) {
    let total = 0;
    for (let index = -6; index <= -1; index += 1) total += getMonthWorkdays(addMonths(month, index));
    return total;
  }


  function getPreviousSixMinimumIncome(month) {
    let total = 0;
    for (let index = -6; index <= -1; index += 1) {
      const previousMonth = addMonths(month, index);
      total += MINIMUM_GROSS_BY_MONTH[previousMonth] || 0;
    }
    return total;
  }

  function getAverageGrossForCas(month) {
    const normalized = normalizeMonth(month);
    if (normalized <= '2026-02') return 8620;
    if (normalized >= '2026-04') return 9192;
    return 8620; // Martie necesită, în cazuri reale, împărțire la data de 30 martie.
  }

  function clampInt(value, min, max) {
    const number = Math.trunc(Number(value) || 0);
    return Math.min(max, Math.max(min, number));
  }

  function getBasicDeduction(gross, rule, dependents, isPrimaryJob) {
    if (!isPrimaryJob) return 0;
    const monthlyGross = Math.max(0, Number(gross) || 0);
    const difference = monthlyGross - rule.minimumGross;
    if (difference > 2000) return 0;

    const dependentIndex = clampInt(dependents, 0, 4);
    const startingPercent = [20, 25, 30, 35, 45][dependentIndex];
    const bracket = difference <= 0 ? 0 : Math.ceil(difference / 50);
    const percent = Math.max(0, startingPercent - bracket * 0.5);
    return roundLei(rule.minimumGross * percent / 100);
  }

  function getSupplementaryDeduction(gross, rule, options) {
    if (!options.isPrimaryJob) return 0;
    let deduction = 0;
    if (options.isUnderOrEqual26 && gross <= rule.minimumGross + 2000) {
      deduction += roundLei(rule.minimumGross * 0.15);
    }
    deduction += clampInt(options.childrenInEducation, 0, 20) * 100;
    return deduction;
  }

  function getOrdinaryMedicalRate(episodeCalendarDays) {
    const days = clampInt(episodeCalendarDays, 1, 999);
    if (days <= 7) return 0.55;
    if (days <= 14) return 0.65;
    return 0.75;
  }

  function getMedicalType(type) {
    return MEDICAL_TYPES[type] || MEDICAL_TYPES.ordinary;
  }

  function calculateMedical(gross, settings, rule) {
    const month = normalizeMonth(settings.month);
    const monthWorkdays = clampInt(settings.monthWorkdays || getMonthWorkdays(month), 1, 31);
    const requestedMedicalWorkdays = clampInt(settings.medicalWorkdays, 0, monthWorkdays);
    const previousEpisodeWorkdays = clampInt(settings.previousEpisodeWorkdays, 0, 365);
    const episodeCalendarDays = clampInt(settings.episodeCalendarDays, 1, 999);
    const baseIncomeTotal = Math.max(0, Number(settings.baseIncomeTotal) || 0);
    const baseWorkdaysTotal = clampInt(settings.baseWorkdaysTotal || getPreviousSixWorkdays(month), 1, 184);
    const type = getMedicalType(settings.medicalType);
    const rate = type.rate === null ? getOrdinaryMedicalRate(episodeCalendarDays) : type.rate;
    const dailyBase = roundMoney(baseIncomeTotal / baseWorkdaysTotal);
    const periodSubjectToReduction = month >= '2026-02';
    const reductionExempt = Boolean(type.oneDayReductionExempt || settings.oneDayReductionExempt);
    const firstDayAlreadyReduced = previousEpisodeWorkdays > 0;
    const unpaidDays = periodSubjectToReduction && !reductionExempt && !firstDayAlreadyReduced && requestedMedicalWorkdays > 0 ? 1 : 0;
    const paidMedicalWorkdays = Math.max(0, requestedMedicalWorkdays - unpaidDays);
    const workedDays = Math.max(0, monthWorkdays - requestedMedicalWorkdays);
    const workedGross = roundLei(gross * workedDays / monthWorkdays);
    const medicalGross = roundLei(dailyBase * rate * paidMedicalWorkdays);

    let employerMedicalDays = 0;
    if (type.employerFirstDays && paidMedicalWorkdays > 0) {
      const previousPaidDays = periodSubjectToReduction && !reductionExempt
        ? Math.max(0, previousEpisodeWorkdays - 1)
        : previousEpisodeWorkdays;
      employerMedicalDays = Math.min(paidMedicalWorkdays, Math.max(0, 5 - previousPaidDays));
    }
    const fundMedicalDays = Math.max(0, paidMedicalWorkdays - employerMedicalDays);
    const employerMedicalAmount = roundLei(dailyBase * rate * employerMedicalDays);
    const fundMedicalAmount = Math.max(0, medicalGross - employerMedicalAmount);

    const averageGrossForCas = getAverageGrossForCas(month);
    const medicalCasBase = roundLei(averageGrossForCas * 0.35 * requestedMedicalWorkdays / monthWorkdays);
    const medicalCas = roundLei(medicalCasBase * rule.casRate);
    const medicalCass = type.cassApplies ? roundLei(medicalGross * rule.cassRate) : 0;

    return {
      enabled: true,
      typeKey: settings.medicalType,
      typeLabel: type.label,
      rate,
      monthWorkdays,
      requestedMedicalWorkdays,
      paidMedicalWorkdays,
      unpaidDays,
      workedDays,
      previousEpisodeWorkdays,
      episodeCalendarDays,
      baseIncomeTotal: roundLei(baseIncomeTotal),
      baseWorkdaysTotal,
      dailyBase,
      workedGross,
      medicalGross,
      employerMedicalDays,
      fundMedicalDays,
      employerMedicalAmount,
      fundMedicalAmount,
      medicalCasBase,
      medicalCas,
      medicalCass,
      incomeTaxExempt: type.incomeTaxExempt,
      cassApplies: type.cassApplies,
      averageGrossForCas,
      reductionExempt
    };
  }

  function calculateFromGross(grossInput, options) {
    const gross = roundLei(Math.max(0, Number(grossInput) || 0));
    const settings = Object.assign({
      month: '2026-07',
      isPrimaryJob: true,
      contractBaseEqualsMinimum: false,
      isFullTime: true,
      dependents: 0,
      isUnderOrEqual26: false,
      childrenInEducation: 0,
      medicalLeaveEnabled: false,
      medicalType: 'ordinary',
      episodeCalendarDays: 5,
      medicalWorkdays: 5,
      monthWorkdays: 0,
      previousEpisodeWorkdays: 0,
      baseIncomeTotal: gross * 6,
      baseWorkdaysTotal: 0,
      oneDayReductionExempt: false
    }, options || {});

    const rule = getRules(settings.month);
    const medical = settings.medicalLeaveEnabled ? calculateMedical(gross, settings, rule) : null;
    const salaryGross = medical ? medical.workedGross : gross;
    const totalGross = salaryGross + (medical ? medical.medicalGross : 0);
    const workedRatio = medical ? medical.workedDays / medical.monthWorkdays : 1;

    const exemptionEligible = Boolean(
      settings.isFullTime &&
      settings.isPrimaryJob &&
      settings.contractBaseEqualsMinimum &&
      totalGross <= rule.exemptionGrossLimit
    );
    const proratedExemption = roundLei(rule.nonTaxableAmount * workedRatio);
    const nonTaxableAmount = exemptionEligible ? Math.min(proratedExemption, salaryGross) : 0;
    const salaryContributionBase = Math.max(0, salaryGross - nonTaxableAmount);

    const salaryCas = roundLei(salaryContributionBase * rule.casRate);
    const salaryCass = roundLei(salaryContributionBase * rule.cassRate);
    const medicalCas = medical ? medical.medicalCas : 0;
    const medicalCass = medical ? medical.medicalCass : 0;
    const cas = salaryCas + medicalCas;
    const cass = salaryCass + medicalCass;

    const basicDeduction = getBasicDeduction(totalGross, rule, settings.dependents, settings.isPrimaryJob);
    const supplementaryDeduction = getSupplementaryDeduction(totalGross, rule, settings);
    const taxableSalaryBeforeDeductions = Math.max(0, salaryGross - nonTaxableAmount - salaryCas - salaryCass);
    const taxableMedicalBeforeDeductions = medical && !medical.incomeTaxExempt
      ? Math.max(0, medical.medicalGross - medicalCas - medicalCass)
      : 0;
    const taxableBeforeDeductions = taxableSalaryBeforeDeductions + taxableMedicalBeforeDeductions;
    const personalDeduction = Math.min(taxableBeforeDeductions, basicDeduction + supplementaryDeduction);
    const incomeTaxBase = Math.max(0, taxableBeforeDeductions - personalDeduction);
    const incomeTax = roundLei(incomeTaxBase * rule.incomeTaxRate);
    const net = totalGross - cas - cass - incomeTax;

    const camBase = salaryContributionBase + (medical ? medical.employerMedicalAmount : 0);
    const cam = roundLei(camBase * rule.camRate);
    const employerCost = salaryGross + (medical ? medical.employerMedicalAmount : 0) + cam;
    const payrollCashOut = totalGross + cam;

    const warnings = [];
    if (gross > 0 && gross < rule.minimumGross) {
      warnings.push(`Salariul brut contractual introdus este sub salariul minim general de ${rule.minimumGross} lei pentru normă întreagă.`);
    }
    if (settings.contractBaseEqualsMinimum && !settings.isPrimaryJob) {
      warnings.push('Facilitatea pentru suma netaxabilă se acordă numai la funcția de bază.');
    }
    if (settings.contractBaseEqualsMinimum && totalGross > rule.exemptionGrossLimit) {
      warnings.push(`Suma netaxabilă nu se aplică deoarece venitul brut al lunii depășește plafonul de ${rule.exemptionGrossLimit} lei.`);
    }
    if (!settings.isFullTime && settings.contractBaseEqualsMinimum) {
      warnings.push('Facilitatea pentru suma netaxabilă este configurată în acest MVP doar pentru contract cu normă întreagă.');
    }
    if (medical) {
      warnings.push('Baza concediului medical trebuie completată cu veniturile asigurate și zilele lucrate reale din ultimele 6 luni.');
      if (medical.unpaidDays) warnings.push('S-a aplicat diminuarea cu o zi lucrătoare valabilă pentru certificatele emise în perioada 1 februarie 2026–31 decembrie 2027.');
      if (normalizeMonth(settings.month) === '2026-03') warnings.push('Pentru martie 2026, baza CAS poate necesita împărțire la 30 martie, când câștigul salarial mediu brut a crescut de la 8.620 la 9.192 lei.');
      if (medical.typeKey === 'ordinary') warnings.push('Procentul pentru boală obișnuită se stabilește după durata totală a episodului; dacă episodul se prelungește, poate fi necesară recalcularea lunii anterioare.');
    }

    return {
      rule,
      gross,
      salaryGross,
      totalGross,
      nonTaxableAmount,
      exemptionEligible,
      contributionBase: salaryContributionBase,
      salaryContributionBase,
      salaryCas,
      medicalCas,
      cas,
      salaryCass,
      medicalCass,
      cass,
      basicDeduction,
      supplementaryDeduction,
      personalDeduction,
      taxableBeforeDeductions,
      incomeTaxBase,
      incomeTax,
      net,
      camBase,
      cam,
      employerCost,
      payrollCashOut,
      medical,
      totalEmployeeTaxes: cas + cass + incomeTax,
      totalState: cas + cass + incomeTax + cam,
      warnings
    };
  }

  function binaryCandidate(targetNet, options, low, high) {
    let left = Math.max(0, Math.floor(low));
    let right = Math.max(left, Math.ceil(high));
    let best = null;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const result = calculateFromGross(mid, options);
      const difference = Math.abs(result.net - targetNet);
      if (!best || difference < best.difference || (difference === best.difference && mid < best.result.gross)) {
        best = { difference, result };
      }
      if (result.net < targetNet) left = mid + 1;
      else if (result.net > targetNet) right = mid - 1;
      else {
        best = { difference: 0, result };
        right = mid - 1;
      }
    }

    const center = best ? best.result.gross : left;
    for (let candidateGross = Math.max(Math.floor(low), center - 10); candidateGross <= center + 10; candidateGross += 1) {
      const result = calculateFromGross(candidateGross, options);
      const difference = Math.abs(result.net - targetNet);
      if (!best || difference < best.difference || (difference === best.difference && candidateGross < best.result.gross)) {
        best = { difference, result };
      }
    }
    return best;
  }

  function calculateFromNet(netInput, options) {
    const targetNet = roundLei(Math.max(0, Number(netInput) || 0));
    const settings = Object.assign({ month: '2026-07' }, options || {});
    const rule = getRules(settings.month);
    const minimumResult = calculateFromGross(rule.minimumGross, settings);
    if (targetNet <= minimumResult.net) {
      return Object.assign({}, minimumResult, {
        targetNet,
        netDifference: minimumResult.net - targetNet
      });
    }
    const upper = Math.max(rule.minimumGross * 5, targetNet * 4 + 20000);
    const candidates = [];

    if (settings.contractBaseEqualsMinimum && settings.isFullTime && settings.isPrimaryJob) {
      candidates.push(binaryCandidate(targetNet, settings, rule.minimumGross, rule.exemptionGrossLimit));
      candidates.push(binaryCandidate(targetNet, settings, rule.exemptionGrossLimit + 1, upper));
    } else {
      candidates.push(binaryCandidate(targetNet, settings, rule.minimumGross, upper));
    }

    const best = candidates
      .filter(Boolean)
      .sort((a, b) => a.difference - b.difference || a.result.gross - b.result.gross)[0];

    if (!best) throw new Error('Nu a fost găsită o valoare brută pentru netul solicitat.');
    return Object.assign({}, best.result, {
      targetNet,
      netDifference: best.result.net - targetNet
    });
  }

  return {
    RULES,
    WORKDAYS,
    MINIMUM_GROSS_BY_MONTH,
    MEDICAL_TYPES,
    getRules,
    getMonthWorkdays,
    getPreviousSixWorkdays,
    getPreviousSixMinimumIncome,
    getAverageGrossForCas,
    getOrdinaryMedicalRate,
    calculateFromGross,
    calculateFromNet,
    getBasicDeduction,
    roundLei
  };
});
