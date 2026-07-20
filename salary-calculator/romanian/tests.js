'use strict';
const assert = require('assert');
const core = require('./salary-core.js');

const common = {
  isPrimaryJob: true,
  contractBaseEqualsMinimum: true,
  isFullTime: true,
  dependents: 0,
  isUnderOrEqual26: false,
  childrenInEducation: 0
};

const julyMinimum = core.calculateFromGross(4325, { ...common, month: '2026-07' });
assert.deepStrictEqual(
  {
    net: julyMinimum.net,
    cas: julyMinimum.cas,
    cass: julyMinimum.cass,
    deduction: julyMinimum.personalDeduction,
    tax: julyMinimum.incomeTax,
    cam: julyMinimum.cam,
    cost: julyMinimum.employerCost,
    exempt: julyMinimum.nonTaxableAmount
  },
  { net: 2699, cas: 1031, cass: 413, deduction: 865, tax: 182, cam: 93, cost: 4418, exempt: 200 }
);

const januaryMinimum = core.calculateFromGross(4050, { ...common, month: '2026-01' });
assert.deepStrictEqual(
  {
    net: januaryMinimum.net,
    cas: januaryMinimum.cas,
    cass: januaryMinimum.cass,
    deduction: januaryMinimum.personalDeduction,
    tax: januaryMinimum.incomeTax,
    cam: januaryMinimum.cam,
    cost: januaryMinimum.employerCost,
    exempt: januaryMinimum.nonTaxableAmount
  },
  { net: 2574, cas: 938, cass: 375, deduction: 810, tax: 163, cam: 84, cost: 4134, exempt: 300 }
);

const reverse = core.calculateFromNet(2699, { ...common, month: '2026-07' });
assert.strictEqual(reverse.gross, 4325);
assert.strictEqual(reverse.net, 2699);

const januaryReverse = core.calculateFromNet(2574, { ...common, month: '2026-01' });
assert.strictEqual(januaryReverse.gross, 4050);
assert.strictEqual(januaryReverse.net, 2574);

const belowMinimumNet = core.calculateFromNet(1000, { ...common, month: '2026-07' });
assert.strictEqual(belowMinimumNet.gross, 4325);
assert.strictEqual(belowMinimumNet.net, 2699);
assert.ok(belowMinimumNet.netDifference > 0);

const withoutExemption = core.calculateFromGross(4325, { ...common, month: '2026-07', contractBaseEqualsMinimum: false });
assert.strictEqual(withoutExemption.nonTaxableAmount, 0);
assert.strictEqual(withoutExemption.exemptionEligible, false);

const under26 = core.calculateFromGross(4325, { ...common, month: '2026-07', isUnderOrEqual26: true });
assert.strictEqual(under26.supplementaryDeduction, 649);
assert.ok(under26.net > julyMinimum.net);

// Control examples from Order no. 521/500/2026: 24,300 lei / 121 days = 200.82 lei/day.
const medicalCommon = {
  ...common,
  month: '2026-02',
  medicalLeaveEnabled: true,
  monthWorkdays: 20,
  previousEpisodeWorkdays: 0,
  baseIncomeTotal: 24300,
  baseWorkdaysTotal: 121,
  oneDayReductionExempt: false
};

const ordinaryFullMonth = core.calculateFromGross(4050, {
  ...medicalCommon,
  medicalType: 'ordinary',
  episodeCalendarDays: 20,
  medicalWorkdays: 20
});
assert.deepStrictEqual(
  {
    dailyBase: ordinaryFullMonth.medical.dailyBase,
    rate: ordinaryFullMonth.medical.rate,
    requestedDays: ordinaryFullMonth.medical.requestedMedicalWorkdays,
    paidDays: ordinaryFullMonth.medical.paidMedicalWorkdays,
    unpaidDays: ordinaryFullMonth.medical.unpaidDays,
    medicalGross: ordinaryFullMonth.medical.medicalGross,
    employerDays: ordinaryFullMonth.medical.employerMedicalDays,
    fundDays: ordinaryFullMonth.medical.fundMedicalDays
  },
  {
    dailyBase: 200.82,
    rate: 0.75,
    requestedDays: 20,
    paidDays: 19,
    unpaidDays: 1,
    medicalGross: 2862,
    employerDays: 5,
    fundDays: 14
  }
);

const childCare = core.calculateFromGross(4050, {
  ...medicalCommon,
  medicalType: 'childCare',
  episodeCalendarDays: 5,
  medicalWorkdays: 5
});
assert.strictEqual(childCare.medical.rate, 0.85);
assert.strictEqual(childCare.medical.paidMedicalWorkdays, 4);
assert.strictEqual(childCare.medical.medicalGross, 683);
assert.strictEqual(childCare.medical.medicalCass, 0);
assert.strictEqual(childCare.medical.fundMedicalAmount, 683);

const maternity = core.calculateFromGross(4050, {
  ...medicalCommon,
  medicalType: 'maternity',
  episodeCalendarDays: 5,
  medicalWorkdays: 5
});
assert.strictEqual(maternity.medical.unpaidDays, 0);
assert.strictEqual(maternity.medical.paidMedicalWorkdays, 5);
assert.strictEqual(maternity.medical.medicalGross, 853);
assert.strictEqual(maternity.medical.medicalCass, 0);
assert.strictEqual(maternity.medical.fundMedicalAmount, 853);

assert.strictEqual(core.getPreviousSixMinimumIncome('2026-07'), 24300);
assert.strictEqual(core.getPreviousSixWorkdays('2026-07'), 121);

console.log('All salary and medical leave calculator tests passed.');
