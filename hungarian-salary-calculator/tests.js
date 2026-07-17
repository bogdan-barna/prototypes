const assert = require('assert');
const core = require('./salary-core.js');

function expect(result, expected, label) {
  Object.entries(expected).forEach(([key, value]) => {
    assert.strictEqual(result[key], value, `${label}: ${key} expected ${value}, got ${result[key]}`);
  });
}

const base = { month: '2026-07', weeklyHours: 40, minimumType: 'minimum' };

expect(core.calculateFromGross(322800, base), {
  gross: 322800, incomeTax: 48420, rawSocialSecurity: 59718, socialSecurity: 59718,
  net: 214662, employerSocialTax: 41964, employerCost: 364764
}, 'minimum wage');

expect(core.calculateFromGross(373200, Object.assign({}, base, { minimumType: 'guaranteed' })), {
  incomeTax: 55980, rawSocialSecurity: 69042, net: 248178, employerSocialTax: 48516, employerCost: 421716
}, 'guaranteed minimum');

expect(core.calculateFromGross(322800, Object.assign({}, base, { applyUnder25: true, birthDate: '2002-05-10' })), {
  incomeTax: 0, socialSecurity: 59718, net: 263082
}, 'under 25');

expect(core.calculateFromGross(322800, Object.assign({}, base, { applyPersonalAllowance: true })), {
  incomeTax: 32280, net: 230802
}, 'personal allowance');

expect(core.calculateFromGross(322800, Object.assign({}, base, {
  totalDependents: 1, beneficiaryDependents: 1, familySharePercent: 100
})), {
  incomeTax: 28419, familyContributionAllowance: 0, net: 234663
}, 'one child');

expect(core.calculateFromGross(322800, Object.assign({}, base, {
  totalDependents: 3, beneficiaryDependents: 3, familySharePercent: 100
})), {
  incomeTax: 0, familyContributionAllowance: 59718, socialSecurity: 0, net: 322800
}, 'three children');

expect(core.calculateFromGross(322800, Object.assign({}, base, { isPensioner: true })), {
  incomeTax: 48420, rawSocialSecurity: 0, socialSecurity: 0, net: 274380, employerSocialTax: 0, employerCost: 322800
}, 'pensioner');

expect(core.calculateFromGross(161400, Object.assign({}, base, { weeklyHours: 20 })), {
  net: 107331
}, 'part time');
assert.strictEqual(core.getMinimum(core.getRules('2026-07'), 'minimum', 20).proportionalMonthly, 161400);

expect(core.calculateFromGross(500000, Object.assign({}, base, { applyUnder30Mother: true, birthDate: '1998-01-10' })), {
  incomeTax: 0, net: 407500
}, 'under 30 mother');

const reverse = core.calculateFromNet(214662, base);
assert.strictEqual(reverse.gross, 322800, `reverse gross expected 322800, got ${reverse.gross}`);
assert.strictEqual(reverse.net, 214662, `reverse net expected 214662, got ${reverse.net}`);

const grossModeValue = 500000;
const convertedNetValue = core.calculateFromGross(grossModeValue, base).net;
const convertedBackToGross = core.calculateFromNet(convertedNetValue, base).gross;
assert.ok(Math.abs(convertedBackToGross - grossModeValue) <= 1, `mode switch round-trip expected ${grossModeValue}, got ${convertedBackToGross}`);

const reverseGuaranteed = core.calculateFromNet(248178, Object.assign({}, base, { minimumType: 'guaranteed' }));
assert.strictEqual(reverseGuaranteed.gross, 373200, `reverse guaranteed gross expected 373200, got ${reverseGuaranteed.gross}`);
assert.strictEqual(reverseGuaranteed.net, 248178, `reverse guaranteed net expected 248178, got ${reverseGuaranteed.net}`);

const reverseBelowMinimum = core.calculateFromNet(150000, base);
assert.strictEqual(reverseBelowMinimum.gross, 322800, `reverse below-minimum gross expected 322800, got ${reverseBelowMinimum.gross}`);
assert.strictEqual(reverseBelowMinimum.minimumAdjusted, true, 'reverse below-minimum must be adjusted to minimum wage');
assert.ok(reverseBelowMinimum.warnings.some((warning) => warning.includes('törvényes minimálbér alatti')), 'reverse below-minimum warning missing');

const reverseBelowPartTimeMinimum = core.calculateFromNet(90000, Object.assign({}, base, { weeklyHours: 20 }));
assert.strictEqual(reverseBelowPartTimeMinimum.gross, 161400, `reverse part-time minimum gross expected 161400, got ${reverseBelowPartTimeMinimum.gross}`);

assert.strictEqual(core.isUnder25Eligible('2001-07-15', '2026-07'), true);
assert.strictEqual(core.isUnder25Eligible('2001-07-15', '2026-08'), false);


expect(core.calculateFromGross(322800, Object.assign({}, base, {
  sicknessEnabled: true,
  absenceType: 'ordinary',
  monthWorkdays: 23,
  sickLeaveWorkdays: 5,
  sickLeaveUsedBefore: 0,
  sickPayWorkdays: 0,
  sickPayCalendarDays: 0,
  sickPayBaseIncome: 1936800,
  sickPayBaseDays: 180,
  hasAtLeast730InsuranceDays: true
})), {
  wageGross: 301748,
  sickPayGross: 0,
  totalGross: 301748,
  incomeTax: 45262,
  socialSecurity: 55823,
  net: 200663,
  employerSocialTax: 39227,
  employerSickPayContribution: 0,
  employerCost: 340975
}, 'five sick leave days');

expect(core.calculateFromGross(600000, Object.assign({}, base, {
  sicknessEnabled: true,
  absenceType: 'ordinary',
  monthWorkdays: 23,
  sickLeaveWorkdays: 5,
  sickLeaveUsedBefore: 0,
  sickPayWorkdays: 3,
  sickPayCalendarDays: 5,
  sickPayBaseIncome: 3600000,
  sickPayBaseDays: 180,
  hasAtLeast730InsuranceDays: true
})), {
  wageGross: 482608,
  sickPayGross: 60000,
  totalGross: 542608,
  incomeTax: 81391,
  socialSecurity: 89282,
  net: 371935,
  employerSocialTax: 62739,
  employerSickPayContribution: 20000,
  employerCost: 565347
}, 'sick leave and sick pay');

const gyap = core.calculateFromGross(600000, Object.assign({}, base, {
  sicknessEnabled: true,
  absenceType: 'childCare',
  monthWorkdays: 23,
  sickLeaveWorkdays: 5,
  sickPayWorkdays: 5,
  sickPayCalendarDays: 7,
  sickPayBaseIncome: 3600000,
  sickPayBaseDays: 180,
  hasAtLeast730InsuranceDays: true
}));
assert.strictEqual(gyap.sickness.sickLeaveWorkdays, 0, 'GYÁP must not use sick leave');
assert.strictEqual(gyap.employerSickPayContribution, 0, 'GYÁP must not create employer sick-pay contribution');
assert.strictEqual(core.getMonthWorkdays('2026-07'), 23);

console.log('All Hungarian salary calculator tests passed.');
