(function () {
  'use strict';
  const core = window.RomanianSalaryCore;
  const $ = (id) => document.getElementById(id);
  const formatter = new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 0 });
  const decimalFormatter = new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  let mode = 'gross';
  let lastResult = null;
  let baseIncomeTouched = false;

  const monthNames = [
    'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
    'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'
  ];

  function formatMonthLabel(value) {
    const [year, month] = String(value || '').split('-');
    const index = Number(month) - 1;
    if (!year || index < 0 || index > 11) return value || '';
    return `${monthNames[index]} ${year}`;
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
      `<strong>Procent aplicat:</strong> ${formatter.format(rate * 100)}%`,
      `<strong>Media zilnică introdusă:</strong> ${decimalFormatter.format(daily)} lei`,
      `<strong>Diminuare cu o zi:</strong> ${reductionPossible ? 'da, dacă este începutul episodului' : 'nu pentru setarea selectată'}`
    ].join('<br>');
  }

  function updateRuleSummary() {
    try {
      const rule = core.getRules(elements.month.value);
      elements.minimumValue.textContent = lei(rule.minimumGross);
      elements.minimumPeriod.textContent = rule.label;
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
      ['Sumă netaxabilă', result.nonTaxableAmount],
      ['Deducere personală de bază', result.basicDeduction],
      ['Deducere suplimentară', result.supplementaryDeduction]
    ];
    if (result.medical) {
      lines.push(
        ['Zile lucrătoare în lună', `${result.medical.monthWorkdays} zile`],
        ['Zile medicale înscrise', `${result.medical.requestedMedicalWorkdays} zile`],
        ['Zile medicale plătite', `${result.medical.paidMedicalWorkdays} zile`],
        ['Procent indemnizație', `${formatter.format(result.medical.rate * 100)}%`],
        ['Media zilnică a bazei', `${decimalFormatter.format(result.medical.dailyBase)} lei`],
        ['Suportat de angajator', `${result.medical.employerMedicalDays} zile · ${lei(result.medical.employerMedicalAmount)}`],
        ['Suportat din FNUASS', `${result.medical.fundMedicalDays} zile · ${lei(result.medical.fundMedicalAmount)}`],
        ['Bază CAS concediu medical', lei(result.medical.medicalCasBase)],
        ['CAS aferent concediului medical', lei(result.medical.medicalCas)],
        ['CASS aferent concediului medical', lei(result.medical.medicalCass)]
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
    elements.minimumPeriod.textContent = result.rule.label;

    if (mode === 'gross') {
      elements.mainResultLabel.textContent = 'Salariu net estimat';
      elements.mainResult.textContent = formatter.format(result.net);
      elements.resultDifference.hidden = true;
    } else {
      elements.mainResultLabel.textContent = 'Salariu brut contractual necesar';
      elements.mainResult.textContent = formatter.format(result.gross);
      elements.resultDifference.textContent = result.netDifference
        ? `Net rezultat: ${lei(result.net)} (${result.netDifference > 0 ? '+' : ''}${result.netDifference} lei față de suma solicitată)`
        : `Net rezultat: ${lei(result.net)}`;
      elements.resultDifference.hidden = false;
    }

    const warningMessages = result.warnings.slice();
    if (result.exemptionEligible && result.nonTaxableAmount > 0) {
      warningMessages.unshift(`A fost aplicată suma netaxabilă de ${result.nonTaxableAmount} lei.`);
    }
    if (warningMessages.length) {
      elements.warnings.innerHTML = warningMessages.map((message) => `<p>${message}</p>`).join('');
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
    if (!Number.isFinite(monthDays) || monthDays < 1) throw new Error('Introdu numărul valid de zile lucrătoare din lună.');
    if (!Number.isFinite(medicalDays) || medicalDays < 0 || medicalDays > monthDays) {
      throw new Error('Zilele de concediu medical trebuie să fie între 0 și totalul zilelor lucrătoare din lună.');
    }
    if (Number(elements.baseIncomeTotal.value) < 0) throw new Error('Veniturile din baza de calcul nu pot fi negative.');
    if (Number(elements.baseWorkdaysTotal.value) < 1) throw new Error('Baza concediului medical trebuie să conțină cel puțin o zi lucrată.');
  }

  function calculate() {
    elements.formError.hidden = true;
    try {
      const amount = Number(elements.amount.value);
      if (!Number.isFinite(amount) || amount < 0) throw new Error('Introdu o sumă validă, mai mare sau egală cu 0.');
      validateMedicalInputs();
      const result = mode === 'gross'
        ? core.calculateFromGross(amount, getOptions())
        : core.calculateFromNet(amount, getOptions());
      render(result);
      updateMedicalUi();
    } catch (error) {
      elements.formError.textContent = error.message || 'Calculul nu a putut fi realizat.';
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
        elements.amountLabel.textContent = elements.medicalEnabled.checked ? 'Salariu brut contractual lunar' : 'Salariu brut lunar';
        elements.amountHint.textContent = elements.medicalEnabled.checked
          ? 'Salariul lunar contractual; plata pentru zilele lucrate se calculează proporțional.'
          : 'Venitul brut total realizat în luna selectată.';
        if (!baseIncomeTouched) updateMedicalDefaults(true);
      } else {
        elements.amountLabel.textContent = 'Salariu net dorit';
        elements.amountHint.textContent = 'Suma netă pe care angajatul trebuie să o primească, inclusiv indemnizația medicală.';
      }
      calculate();
    } catch (error) {
      elements.formError.textContent = error.message || 'Valoarea nu a putut fi convertită între brut și net.';
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
      `Luna: ${formatMonthLabel(elements.month.value)}`,
      `Salariu brut contractual: ${lei(lastResult.gross)}`
    ];
    if (lastResult.medical) {
      lines.push(
        `Tip concediu: ${lastResult.medical.typeLabel}`,
        `Salariu zile lucrate: ${lei(lastResult.salaryGross)}`,
        `Indemnizație medicală brută: ${lei(lastResult.medical.medicalGross)}`,
        `Zile medicale plătite: ${lastResult.medical.paidMedicalWorkdays}`,
        `Suportat de angajator: ${lei(lastResult.medical.employerMedicalAmount)}`,
        `Suportat din FNUASS: ${lei(lastResult.medical.fundMedicalAmount)}`,
        `Total brut plătit: ${lei(lastResult.totalGross)}`
      );
    }
    lines.push(
      `CAS: ${lei(lastResult.cas)}`,
      `CASS: ${lei(lastResult.cass)}`,
      `Deducere personală: ${lei(lastResult.personalDeduction)}`,
      `Impozit: ${lei(lastResult.incomeTax)}`,
      `Salariu net: ${lei(lastResult.net)}`,
      `CAM: ${lei(lastResult.cam)}`,
      `Cost efectiv angajator: ${lei(lastResult.employerCost)}`
    );
    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      $('copy-result').textContent = 'Copiat';
      setTimeout(() => { $('copy-result').textContent = 'Copiază rezultatul'; }, 1400);
    } catch (_) {
      window.prompt('Copiază rezultatul:', text);
    }
  });

  updateRuleSummary();
  updateMedicalDefaults(false);
  updateMedicalUi();
  calculate();
})();
