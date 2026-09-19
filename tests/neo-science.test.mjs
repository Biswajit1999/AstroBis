import assert from 'node:assert/strict';
import test from 'node:test';

import {
  auditCadPayload,
  diameterFromAbsoluteMagnitude,
  diameterSensitivityInterval,
  finiteNumber,
  normalizeCloseApproach,
  parseCadPayload,
} from '../src/lib/neo-science.js';

test('finiteNumber preserves missingness instead of coercing null or blank to zero', () => {
  assert.equal(finiteNumber(null), null);
  assert.equal(finiteNumber(undefined), null);
  assert.equal(finiteNumber(''), null);
  assert.equal(finiteNumber('  '), null);
  assert.equal(finiteNumber('12.5'), 12.5);
  assert.equal(finiteNumber('not-a-number'), null);
});

test('H=22 at the CNEOS 14% reference albedo is approximately 140 metres', () => {
  assert.ok(Math.abs(diameterFromAbsoluteMagnitude(22, 0.14) - 0.141404) < 1e-6);
  const interval = diameterSensitivityInterval(22);
  assert.ok(Math.abs(interval.min - 0.105817) < 1e-6);
  assert.ok(Math.abs(interval.max - 0.236614) < 1e-6);
});

test('invalid albedo contracts fail closed', () => {
  assert.throws(() => diameterFromAbsoluteMagnitude(22, 0), RangeError);
  assert.throws(() => diameterFromAbsoluteMagnitude(22, 1.1), RangeError);
  assert.throws(
    () => diameterSensitivityInterval(22, { low: 0.3, high: 0.2 }),
    RangeError,
  );
});

test('missing diameter is inferred from H and distance uncertainty stays explicit', () => {
  const row = normalizeCloseApproach({
    des: 'X',
    cd: '2030-Jan-01 00:00',
    dist: '0.049',
    dist_min: '0.045',
    dist_max: '0.060',
    v_rel: '12',
    h: '22',
    diameter: null,
  });
  assert.equal(row.measuredDiameter, false);
  assert.ok(row.diameterKm > 0.14);
  assert.equal(row.sizeClass, 'albedo-sensitive');
  assert.equal(row.proximityClass, 'boundary-sensitive');
  assert.equal(row.encounterScreen, true);
});

test('CAD schema drift is rejected', () => {
  assert.throws(() => parseCadPayload({ fields: ['des'], data: [['X']] }), /missing fields/);
});

test('audit reports truncation and separates nominal from robust proximity', () => {
  const fields = ['des', 'cd', 'dist', 'dist_min', 'dist_max', 'v_rel', 'h', 'diameter'];
  const payload = {
    generatedAt: '2026-09-19T00:00:00Z',
    source: 'fixture',
    query: { sort: 'date' },
    total: 3,
    fields,
    data: [
      ['A', '2030-Jan-01 00:00', '0.040', '0.039', '0.041', '10', '21', null],
      ['B', '2030-Jan-02 00:00', '0.049', '0.045', '0.060', '12', '22', null],
    ],
  };
  const audit = auditCadPayload(payload);
  assert.equal(audit.coverage.truncated, true);
  assert.equal(audit.coverage.returnedRows, 2);
  assert.equal(audit.coverage.matchingRows, 3);
  assert.equal(audit.distanceSensitivity.nominalClose, 2);
  assert.equal(audit.distanceSensitivity.robustClose, 1);
  assert.equal(audit.distanceSensitivity.nominalBoundarySensitive, 1);
  assert.equal(audit.measurementCoverage.measuredDiameters, 0);
});
