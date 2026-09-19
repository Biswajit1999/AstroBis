export const AU_KM = 149_597_870.7;
export const LD_KM = 384_400;
export const SCREEN_DISTANCE_AU = 0.05;
export const SCREEN_DIAMETER_KM = 0.14;
export const REFERENCE_ALBEDO = 0.14;
export const ALBEDO_SENSITIVITY = Object.freeze({ low: 0.05, high: 0.25 });

export function finiteNumber(value) {
  if (value === null || value === undefined || String(value).trim() === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function diameterFromAbsoluteMagnitude(h, albedo = REFERENCE_ALBEDO) {
  const magnitude = finiteNumber(h);
  const reflectivity = finiteNumber(albedo);
  if (magnitude === null) return null;
  if (reflectivity === null || reflectivity <= 0 || reflectivity > 1) {
    throw new RangeError('Geometric albedo must be in (0, 1]');
  }
  return (1329 / Math.sqrt(reflectivity)) * (10 ** (-magnitude / 5));
}

export function diameterSensitivityInterval(h, albedo = ALBEDO_SENSITIVITY) {
  const magnitude = finiteNumber(h);
  if (magnitude === null) return null;
  const low = finiteNumber(albedo.low);
  const high = finiteNumber(albedo.high);
  if (low === null || high === null || low <= 0 || high > 1 || low >= high) {
    throw new RangeError('Albedo sensitivity bounds must satisfy 0 < low < high <= 1');
  }
  return {
    min: diameterFromAbsoluteMagnitude(magnitude, high),
    max: diameterFromAbsoluteMagnitude(magnitude, low),
    albedoLow: low,
    albedoHigh: high,
  };
}

function classifySize(measuredDiameter, interval, thresholdKm) {
  if (measuredDiameter !== null) {
    return measuredDiameter >= thresholdKm ? 'measured-large' : 'measured-small';
  }
  if (!interval) return 'unknown';
  if (interval.min >= thresholdKm) return 'inferred-robust-large';
  if (interval.max < thresholdKm) return 'inferred-robust-small';
  return 'albedo-sensitive';
}

function classifyProximity(distance, minimum, maximum, thresholdAu) {
  if (distance === null || minimum === null || maximum === null) return 'unknown';
  if (maximum <= thresholdAu) return 'robust-close';
  if (minimum > thresholdAu) return 'robust-outside';
  return 'boundary-sensitive';
}

export function normalizeCloseApproach(row, options = {}) {
  const distanceThresholdAu = options.distanceThresholdAu ?? SCREEN_DISTANCE_AU;
  const diameterThresholdKm = options.diameterThresholdKm ?? SCREEN_DIAMETER_KM;
  const distAu = finiteNumber(row.dist);
  const distanceMinAu = finiteNumber(row.dist_min);
  const distanceMaxAu = finiteNumber(row.dist_max);
  const h = finiteNumber(row.h);
  const measuredDiameterKm = finiteNumber(row.diameter);
  const diameterInterval = measuredDiameterKm === null
    ? diameterSensitivityInterval(h, options.albedoSensitivity ?? ALBEDO_SENSITIVITY)
    : null;
  const diameterKm = measuredDiameterKm
    ?? diameterFromAbsoluteMagnitude(h, options.referenceAlbedo ?? REFERENCE_ALBEDO);
  const velocity = finiteNumber(row.v_rel);
  const distanceKm = distAu === null ? null : distAu * AU_KM;
  const nominalClose = distAu !== null && distAu <= distanceThresholdAu;
  const encounterScreen = nominalClose && h !== null && h <= 22;
  const sizeClass = classifySize(measuredDiameterKm, diameterInterval, diameterThresholdKm);

  return {
    id: row.des || row.fullname || row.cd,
    name: String(row.fullname || row.des || 'Unnamed object').trim(),
    designation: String(row.des || 'n/a').trim(),
    date: row.cd || 'n/a',
    dateMs: Date.parse(String(row.cd || '').replace(/-/g, ' ')),
    distAu,
    distanceMinAu,
    distanceMaxAu,
    distanceKm,
    lunarDistance: distanceKm === null ? null : distanceKm / LD_KM,
    velocity,
    h,
    diameterKm,
    measuredDiameterKm,
    measuredDiameter: measuredDiameterKm !== null,
    diameterInterval,
    sizeClass,
    proximityClass: classifyProximity(
      distAu,
      distanceMinAu,
      distanceMaxAu,
      distanceThresholdAu,
    ),
    nominalClose,
    encounterScreen,
    // Compatibility aliases for the existing visual layer. They retain the
    // old property names while the labels now state their actual proxy role.
    riskProxy: encounterScreen,
    largeProxy: diameterKm !== null && diameterKm >= diameterThresholdKm,
  };
}

export function parseCadPayload(payload, options = {}) {
  const fields = Array.isArray(payload?.fields) ? payload.fields : [];
  const required = ['des', 'cd', 'dist', 'dist_min', 'dist_max', 'v_rel', 'h', 'diameter'];
  const missing = required.filter((field) => !fields.includes(field));
  if (missing.length) throw new Error(`CAD payload is missing fields: ${missing.join(', ')}`);
  return (payload.data || []).map((values) => {
    const row = Object.fromEntries(fields.map((field, index) => [field, values[index]]));
    return normalizeCloseApproach(row, options);
  });
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key];
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

export function auditCadPayload(payload, options = {}) {
  const rows = parseCadPayload(payload, options);
  const total = finiteNumber(payload.total) ?? rows.length;
  const distanceThresholdAu = options.distanceThresholdAu ?? SCREEN_DISTANCE_AU;
  const diameterThresholdKm = options.diameterThresholdKm ?? SCREEN_DIAMETER_KM;
  const nominalClose = rows.filter((row) => row.nominalClose);
  const robustClose = rows.filter((row) => row.proximityClass === 'robust-close');
  const nominalBoundarySensitive = nominalClose.filter(
    (row) => row.proximityClass === 'boundary-sensitive',
  );
  const outsideButCouldCross = rows.filter(
    (row) => !row.nominalClose && row.proximityClass === 'boundary-sensitive',
  );
  const albedoGrid = [0.05, 0.10, 0.14, 0.20, 0.25].map((albedo) => ({
    albedo,
    nominalCloseAtOrAbove140m: nominalClose.filter((row) => {
      const diameter = row.measuredDiameterKm
        ?? diameterFromAbsoluteMagnitude(row.h, albedo);
      return diameter !== null && diameter >= diameterThresholdKm;
    }).length,
    robustCloseAtOrAbove140m: robustClose.filter((row) => {
      const diameter = row.measuredDiameterKm
        ?? diameterFromAbsoluteMagnitude(row.h, albedo);
      return diameter !== null && diameter >= diameterThresholdKm;
    }).length,
  }));
  const measured = rows.filter((row) => row.measuredDiameter).length;

  return {
    schemaVersion: '1.0',
    label: 'SENSITIVITY / ENCOUNTER SCREEN — NOT IMPACT PROBABILITY',
    source: payload.source,
    generatedAt: payload.generatedAt,
    apiSignature: payload.signature ?? null,
    query: payload.query,
    coverage: {
      returnedRows: rows.length,
      matchingRows: total,
      returnedFraction: total ? rows.length / total : 0,
      truncated: total > rows.length,
      firstReturnedApproach: rows[0]?.date ?? null,
      lastReturnedApproach: rows.at(-1)?.date ?? null,
      sort: payload.query?.sort ?? null,
    },
    measurementCoverage: {
      measuredDiameters: measured,
      inferredFromH: rows.filter((row) => !row.measuredDiameter && row.h !== null).length,
      unknownSize: rows.filter((row) => row.diameterKm === null).length,
      measuredDiameterFraction: rows.length ? measured / rows.length : 0,
    },
    thresholds: {
      encounterDistanceAu: distanceThresholdAu,
      diameterKm: diameterThresholdKm,
      absoluteMagnitude: 22,
      referenceAlbedo: options.referenceAlbedo ?? REFERENCE_ALBEDO,
      albedoSensitivity: options.albedoSensitivity ?? ALBEDO_SENSITIVITY,
    },
    distanceSensitivity: {
      nominalClose: nominalClose.length,
      robustClose: robustClose.length,
      nominalBoundarySensitive: nominalBoundarySensitive.length,
      outsideButCouldCross: outsideButCouldCross.length,
      boundarySensitiveAll: rows.filter(
        (row) => row.proximityClass === 'boundary-sensitive',
      ).length,
      classes: countBy(rows, 'proximityClass'),
    },
    sizeSensitivity: {
      allRows: countBy(rows, 'sizeClass'),
      nominalClose: countBy(nominalClose, 'sizeClass'),
      robustClose: countBy(robustClose, 'sizeClass'),
      h22DiameterKm: {
        albedo005: diameterFromAbsoluteMagnitude(22, 0.05),
        albedo014: diameterFromAbsoluteMagnitude(22, 0.14),
        albedo025: diameterFromAbsoluteMagnitude(22, 0.25),
      },
      albedoGrid,
    },
    legacyEncounterScreenCount: rows.filter((row) => row.encounterScreen).length,
    claimBoundary: [
      'CAD dist is a time-specific close-approach distance, not Earth MOID.',
      'The screen is not a PHA designation, impact probability, Torino score, or hazard assessment.',
      'The 0.05–0.25 albedo interval is a declared sensitivity bracket, not an object-level posterior.',
      'A row-limited, date-sorted response describes only the returned chronological prefix.',
    ],
  };
}
