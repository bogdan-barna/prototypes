(function () {
  'use strict';
  const core = window.HungarianSalaryCore;
  const $ = (id) => document.getElementById(id);
  const formatter = new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 });
  const decimalFormatter = new Intl.NumberFormat('hu-HU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

  function huf(value) { return `${formatter.format(value)} Ft`; }
  function minusHuf(value) { return value ? `−${formatter.format(value)} Ft` : '0 Ft'; }

  const monthNames = [
    'január', 'február', 'március', 'április', 'május', 'június',
    'július', 'augusztus', 'szeptember', 'október', 'november', 'december'
  ];

  function formatMonthLabel(value) {
    const match = /^(\d{4})-(\d{2})$/.exec(String(value || ''));
    if (!match) return String(value || '');
    const year = Number(match[1]);
    const monthIndex = Number(match[2]) - 1;
    return `${year}. ${monthNames[monthIndex]}`;
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
    $('minimum-label').textContent = minimum.label === 'Nincs ellenőrzés' ? 'Bérminimum-ellenőrzés' : `2026-os ${minimum.label.toLowerCase()}`;
    $('minimum-value').textContent = minimum.type === 'none' ? 'Kikapcsolva' : huf(minimum.proportionalMonthly);
    $('minimum-period').textContent = minimum.type === 'none'
      ? 'A megadott bért nem hasonlítjuk kötelező minimumhoz.'
      : `${Number(fields.weeklyHours.value) || 40} órás heti munkaidő · ${huf(minimum.hourly)}/óra`;
  }

  function allowanceName(key) {
    return ({
      under30Mother: '30 év alatti anyák kedvezménye',
      multiChildMother: 'Többgyermekes anyák kedvezménye',
      under25: '25 év alatti fiatalok kedvezménye',
      personal: 'Személyi kedvezmény',
      firstMarriage: 'Első házasok kedvezménye',
      family: 'Családi kedvezmény'
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
      lines.push(['Fel nem használt családi kedvezmény', huf(result.unusedFamilyAllowance)]);
    }

    if (result.sickness) {
      const sickness = result.sickness;
      lines.push(
        ['Keresőképtelenség típusa', sickness.typeLabel],
        ['Havi munkanapok', `${sickness.monthWorkdays} nap`],
        ['Ledolgozott munkanapok', `${sickness.workedDays} nap`],
        ['Betegszabadság', `${sickness.sickLeaveWorkdays} nap · ${huf(sickness.sickLeaveGross)}`],
        ['Táppénzes munkanapok', `${sickness.sickPayWorkdays} nap`],
        ['Táppénzes naptári napok', `${sickness.sickPayCalendarDays} nap`],
        ['Táppénz napi alapja', `${decimalFormatter.format(sickness.sickPayDailyBase)} Ft`],
        ['Táppénz mértéke', `${formatter.format(sickness.sickPayRate * 100)}%`],
        ['Figyelembe vett napi táppénz', `${decimalFormatter.format(sickness.cappedDailySickPay)} Ft`],
        ['Munkáltatói táppénz-hozzájárulás', huf(sickness.employerSickPayContribution)]
      );
    }

    $('allowance-lines').innerHTML = lines.length
      ? lines.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('')
      : '<div><span>Nincs alkalmazott kedvezmény</span><strong>0 Ft</strong></div>';
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
    $('net-result-label').textContent = result.sickness ? 'Nettó havi kifizetés' : 'Nettó munkabér';
    $('net-result').textContent = huf(result.net);
    $('szocho-result').textContent = huf(result.employerSocialTax);
    $('sick-pay-contribution-result').textContent = huf(result.employerSickPayContribution);
    $('cost-result').textContent = huf(result.employerCost);
    setSicknessRowsVisible(Boolean(result.sickness));
    renderMinimum(result.rule);

    if (mode === 'gross') {
      $('main-result-label').textContent = result.sickness ? 'Becsült nettó havi kifizetés' : 'Becsült nettó munkabér';
      $('main-result').textContent = formatter.format(result.net);
      $('result-difference').hidden = true;
    } else {
      $('main-result-label').textContent = 'Szükséges havi bruttó alapbér';
      $('main-result').textContent = formatter.format(result.gross);
      $('result-difference').textContent = result.netDifference
        ? `Elért nettó: ${huf(result.net)} (${result.netDifference > 0 ? '+' : ''}${result.netDifference} Ft eltérés)`
        : `Elért nettó: ${huf(result.net)}`;
      $('result-difference').hidden = false;
    }

    renderAllowanceLines(result);

    if (result.warnings.length) {
      $('warnings').innerHTML = result.warnings.map((warning) => `<p>${warning}</p>`).join('');
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
      `<strong>Betegszabadság:</strong> ${sickLeaveAllowed ? `legfeljebb még ${formatter.format(availableSickLeave)} munkanap, 70%-os díjazással` : 'ennél a jogcímnél nem alkalmazható'}.`,
      `<strong>Táppénz:</strong> ${formatter.format(rate * 100)}%, becsült napi összeg ${decimalFormatter.format(dailyPay)} Ft`,
      `(2026-os napi maximum: ${huf(core.getRules(fields.month.value).sickness.sickPayDailyMaximum)}).`
    ].join(' ');
  }

  function validateSicknessInputs() {
    if (!fields.sicknessEnabled.checked) return;
    const monthDays = Number(fields.monthWorkdays.value);
    const sickLeaveDays = Number(fields.sickLeaveWorkdays.value);
    const sickPayWorkdays = Number(fields.sickPayWorkdays.value);
    if (!Number.isFinite(monthDays) || monthDays < 1) throw new Error('Adj meg érvényes havi munkanapszámot.');
    if (!Number.isFinite(sickLeaveDays) || sickLeaveDays < 0) throw new Error('A betegszabadság napjainak száma nem lehet negatív.');
    if (!Number.isFinite(sickPayWorkdays) || sickPayWorkdays < 0) throw new Error('A táppénzes munkanapok száma nem lehet negatív.');
    if (sickLeaveDays + sickPayWorkdays > monthDays) throw new Error('A betegszabadság és a táppénzes munkanapok összege nem lehet több a havi munkanapok számánál.');
    if (Number(fields.sickPayBaseIncome.value) < 0) throw new Error('A táppénzalap jövedelme nem lehet negatív.');
    if (Number(fields.sickPayBaseDays.value) < 1) throw new Error('A táppénzalaphoz legalább 1 naptári napot adj meg.');
  }

  function calculate() {
    $('form-error').hidden = true;
    try {
      const amount = Number(fields.amount.value);
      if (!Number.isFinite(amount) || amount < 0) throw new Error('Adj meg egy 0-nál nem kisebb, érvényes összeget.');
      validateSicknessInputs();
      const result = mode === 'gross'
        ? core.calculateFromGross(amount, getOptions())
        : core.calculateFromNet(amount, getOptions());
      render(result);
      updateSicknessUi();
    } catch (error) {
      $('form-error').textContent = error.message || 'A számítás nem hajtható végre.';
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
      $('amount-label').textContent = fields.sicknessEnabled.checked ? 'Havi szerződéses bruttó alapbér' : 'Havi bruttó alapbér';
      $('amount-hint').textContent = fields.sicknessEnabled.checked
        ? 'A teljes havi szerződéses alapbér; a ledolgozott napok díját arányosan számítjuk.'
        : 'A havi bruttó alapbér, külön bónuszok és béren kívüli juttatások nélkül.';
      if (!baseIncomeTouched && !amountConverted) updateSicknessDefaults(true, false);
    } else {
      $('amount-label').textContent = 'Kívánt havi nettó kifizetés';
      $('amount-hint').textContent = fields.sicknessEnabled.checked
        ? 'A kalkulátor megkeresi a nettó kifizetéshez szükséges szerződéses bruttó alapbért.'
        : 'A kalkulátor megkeresi az ehhez legközelebbi bruttó munkabért.';
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
      `Hónap: ${formatMonthLabel(fields.month.value)}`,
      `Szerződéses bruttó alapbér: ${huf(lastResult.gross)}`
    ];
    if (lastResult.sickness) {
      lines.push(
        `Keresőképtelenség: ${lastResult.sickness.typeLabel}`,
        `Ledolgozott napokra járó bér: ${huf(lastResult.sickness.workedGross)}`,
        `Betegszabadság: ${lastResult.sickness.sickLeaveWorkdays} nap · ${huf(lastResult.sickness.sickLeaveGross)}`,
        `Táppénz: ${lastResult.sickness.sickPayCalendarDays} naptári nap · ${huf(lastResult.sickPayGross)}`,
        `Összes bruttó kifizetés: ${huf(lastResult.totalGross)}`
      );
    }
    lines.push(
      `Adóalap-kedvezmények: ${huf(lastResult.totalTaxBaseAllowance)}`,
      `SZJA: ${huf(lastResult.incomeTax)}`,
      `Fizetendő TB-járulék: ${huf(lastResult.socialSecurity)}`,
      `Nettó kifizetés: ${huf(lastResult.net)}`,
      `Munkáltatói szocho: ${huf(lastResult.employerSocialTax)}`,
      `Munkáltatói táppénz-hozzájárulás: ${huf(lastResult.employerSickPayContribution)}`,
      `Teljes munkáltatói költség: ${huf(lastResult.employerCost)}`
    );
    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      $('copy-result').textContent = 'Másolva';
      setTimeout(() => { $('copy-result').textContent = 'Eredmény másolása'; }, 1300);
    } catch (_) {
      window.prompt('Másold ki az eredményt:', text);
    }
  });

  updateEligibilityHints();
  updateSicknessDefaults(false, true);
  updateSicknessUi();
  renderMinimum(core.getRules(fields.month.value));
  calculate();
})();
