import React, { useEffect, useMemo, useState } from 'react';

const DATASETS = [
  {
    key: 'home',
    title: 'Home Stats',
    file: 'home-stats.json',
    source: 'NASA Exoplanet Archive and labelled reference constants',
    extract(payload) {
      return {
        count: payload?.stats?.confirmedExoplanets || 0,
        generatedAt: payload?.generatedAt,
        fields: Object.keys(payload?.stats || {}).length,
        notes: payload?.notes ? Object.keys(payload.notes).length : 0,
      };
    },
  },
  {
    key: 'exoplanets',
    title: 'Exoplanets',
    file: 'exoplanets.json',
    source: 'NASA Exoplanet Archive PSCompPars snapshot',
    extract(payload) {
      const rows = Array.isArray(payload?.data) ? payload.data : [];
      const withRadius = rows.filter((row) => Number.isFinite(Number(row.pl_rade))).length;
      const withMass = rows.filter((row) => Number.isFinite(Number(row.pl_bmasse))).length;
      const withDistance = rows.filter((row) => Number.isFinite(Number(row.sy_dist))).length;
      const nearest = rows
        .filter((row) => Number.isFinite(Number(row.sy_dist)))
        .slice()
        .sort((a, b) => Number(a.sy_dist) - Number(b.sy_dist))[0];
      return {
        count: payload?.count || rows.length,
        generatedAt: payload?.generatedAt,
        fields: rows[0] ? Object.keys(rows[0]).length : 0,
        completeness: {
          radius: ratio(withRadius, rows.length),
          mass: ratio(withMass, rows.length),
          distance: ratio(withDistance, rows.length),
        },
        headline: nearest ? `${nearest.pl_name} at ${Number(nearest.sy_dist).toFixed(2)} pc` : 'No finite distances',
      };
    },
  },
  {
    key: 'neo',
    title: 'Near-Earth Approaches',
    file: 'neo-approaches.json',
    source: 'NASA/JPL SBDB Close Approach Data API',
    extract(payload) {
      const rows = Array.isArray(payload?.data) ? payload.data : [];
      const fields = Array.isArray(payload?.fields) ? payload.fields : [];
      const distanceIndex = fields.indexOf('dist');
      const velocityIndex = fields.indexOf('v_rel');
      const nearest = rows
        .map((row) => ({
          name: String(row[0] || '').trim(),
          au: Number(row[distanceIndex]),
          velocity: Number(row[velocityIndex]),
        }))
        .filter((row) => Number.isFinite(row.au))
        .sort((a, b) => a.au - b.au)[0];
      return {
        count: payload?.count || rows.length,
        generatedAt: payload?.generatedAt,
        fields: fields.length,
        headline: nearest ? `${nearest.name || 'object'} at ${nearest.au.toFixed(4)} AU` : 'No finite approaches',
        velocity: nearest?.velocity,
      };
    },
  },
  {
    key: 'iss',
    title: 'ISS TLE',
    file: 'iss-tle.json',
    source: 'CelesTrak GP elements for NORAD 25544',
    extract(payload) {
      const epoch = payload?.epoch ? Date.parse(payload.epoch) : NaN;
      const ageHours = Number.isFinite(epoch) ? (Date.now() - epoch) / 36e5 : NaN;
      return {
        count: payload?.line1 && payload?.line2 ? 2 : 0,
        generatedAt: payload?.generatedAt,
        fields: ['name', 'line1', 'line2', 'epoch'].filter((key) => payload?.[key]).length,
        headline: Number.isFinite(ageHours) ? `${Math.max(0, ageHours).toFixed(1)} h since epoch` : 'Epoch unavailable',
      };
    },
  },
  {
    key: 'smallBodies',
    title: 'Small-Body Visitors',
    file: 'small-body-visitors.json',
    source: 'Curated public small-body records',
    extract(payload) {
      const rows = Array.isArray(payload?.objects) ? payload.objects : Array.isArray(payload?.data) ? payload.data : [];
      return {
        count: rows.length,
        generatedAt: payload?.generatedAt,
        fields: rows[0] ? Object.keys(rows[0]).length : 0,
        headline: rows[0]?.name || rows[0]?.designation || 'Visitor set loaded',
      };
    },
  },
  {
    key: 'stars',
    title: 'Bright Stars',
    file: 'bright-stars.json',
    source: 'Bundled bright-star coordinate and spectral reference set',
    extract(payload) {
      const rows = Array.isArray(payload?.data) ? payload.data : [];
      const withDistance = rows.filter((row) => Number.isFinite(Number(row.distPc ?? row.distanceLy ?? row.distance))).length;
      const withSpectralType = rows.filter((row) => row.spectral || row.spectralType || row.spect || row.spType).length;
      return {
        count: payload?.count || rows.length,
        generatedAt: payload?.generatedAt,
        fields: rows[0] ? Object.keys(rows[0]).length : 0,
        completeness: {
          distance: ratio(withDistance, rows.length),
          spectra: ratio(withSpectralType, rows.length),
        },
        headline: rows[0]?.name || rows[0]?.proper || 'Star catalogue loaded',
      };
    },
  },
  {
    key: 'mars',
    title: 'Mars Areography',
    file: 'mars-map.json',
    source: 'NASA Mars references, MOLA-derived texture metadata, named features, and landing sites',
    extract(payload) {
      const features = Array.isArray(payload?.features) ? payload.features : [];
      const landingSites = Array.isArray(payload?.landingSites) ? payload.landingSites : [];
      const moons = Array.isArray(payload?.moons) ? payload.moons : [];
      return {
        count: features.length + landingSites.length + moons.length,
        generatedAt: payload?.generatedAt,
        fields: Object.keys(payload || {}).length,
        headline: `${features.length} features, ${landingSites.length} landing sites, ${moons.length} moons`,
      };
    },
  },
  {
    key: 'world',
    title: 'EarthOps',
    file: 'world-ops.json',
    source: 'NASA EONET, USGS, GDACS, Launch Library, CelesTrak, spaceflight feeds',
    extract(payload) {
      const groups = Object.entries(payload || {}).filter(([, value]) => Array.isArray(value));
      const total = groups.reduce((sum, [, value]) => sum + value.length, 0);
      return {
        count: total,
        generatedAt: payload?.generatedAt,
        fields: groups.length,
        headline: `${groups.length} event/feed groups`,
      };
    },
  },
];

function dataUrl(filename) {
  const base = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
    ? import.meta.env.BASE_URL
    : '/';
  return `${base.endsWith('/') ? base : `${base}/`}data/${filename}`;
}

function ratio(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

function formatAge(timestamp) {
  if (!timestamp) return { label: 'unknown age', status: 'warn' };
  const t = Date.parse(timestamp);
  if (!Number.isFinite(t)) return { label: 'invalid timestamp', status: 'bad' };
  const days = Math.max(0, (Date.now() - t) / 864e5);
  if (days < 7) return { label: `${days.toFixed(1)} d old`, status: 'good' };
  if (days < 30) return { label: `${days.toFixed(1)} d old`, status: 'warn' };
  return { label: `${days.toFixed(1)} d old`, status: 'bad' };
}

function number(value) {
  return new Intl.NumberFormat('en-US').format(Number(value) || 0);
}

function datasetScore(result) {
  if (result.error) return 0;
  const age = formatAge(result.generatedAt);
  const ageScore = age.status === 'good' ? 1 : age.status === 'warn' ? 0.65 : 0.35;
  const countScore = result.count > 1000 ? 1 : result.count > 100 ? 0.82 : result.count > 0 ? 0.62 : 0.1;
  return Math.round((ageScore * 0.55 + countScore * 0.45) * 100);
}

function DatasetCard({ item }) {
  const age = formatAge(item.generatedAt);
  const score = datasetScore(item);
  return (
    <article className="dq-card">
      <div className="dq-card-top">
        <span className={`dq-status dq-status-${item.error ? 'bad' : age.status}`}>
          {item.error ? 'error' : age.label}
        </span>
        <span className="dq-score">{score}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.source}</p>
      <dl className="dq-metrics">
        <div>
          <dt>Rows</dt>
          <dd>{number(item.count)}</dd>
        </div>
        <div>
          <dt>Fields</dt>
          <dd>{number(item.fields)}</dd>
        </div>
        <div>
          <dt>File</dt>
          <dd>{item.file}</dd>
        </div>
      </dl>
      {item.completeness && (
        <div className="dq-bars" aria-label={`${item.title} completeness`}>
          {Object.entries(item.completeness).map(([key, value]) => (
            <label key={key}>
              <span>{key}</span>
              <meter min="0" max="100" value={value}>{value}%</meter>
              <b>{value.toFixed(1)}%</b>
            </label>
          ))}
        </div>
      )}
      <small>{item.error || item.headline || 'Snapshot loaded.'}</small>
    </article>
  );
}

export default function DataQualityConsole() {
  const [state, setState] = useState({ loading: true, results: [] });

  useEffect(() => {
    const controller = new AbortController();
    Promise.all(DATASETS.map(async (definition) => {
      try {
        const response = await fetch(`${dataUrl(definition.file)}?audit=${Date.now()}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        return {
          ...definition,
          ...definition.extract(payload),
        };
      } catch (error) {
        return {
          ...definition,
          count: 0,
          fields: 0,
          error: error instanceof Error ? error.message : 'Snapshot unavailable',
        };
      }
    }))
      .then((results) => setState({ loading: false, results }))
      .catch((error) => {
        if (error?.name !== 'AbortError') setState({ loading: false, results: [] });
      });

    return () => controller.abort();
  }, []);

  const summary = useMemo(() => {
    const scores = state.results.map(datasetScore);
    const totalRows = state.results.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
    const average = scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : 0;
    const errors = state.results.filter((item) => item.error).length;
    return { average, totalRows, errors };
  }, [state.results]);

  return (
    <section className="dq-console" aria-label="AstroBis data quality console">
      <div className="dq-hero">
        <p className="section-kicker">Data quality</p>
        <h1>AstroBis Snapshot Integrity Console</h1>
        <p>
          This page audits the public-data snapshots that power AstroBis. It separates measured archive rows
          from labelled scale references and exposes data age, row counts, field counts, and basic completeness.
        </p>
        <div className="dq-summary">
          <div>
            <span>{summary.average}</span>
            <small>quality score</small>
          </div>
          <div>
            <span>{number(summary.totalRows)}</span>
            <small>snapshot rows</small>
          </div>
          <div>
            <span>{summary.errors}</span>
            <small>load errors</small>
          </div>
        </div>
      </div>

      {state.loading ? (
        <div className="dq-loading">Loading local snapshot manifest...</div>
      ) : (
        <div className="dq-grid">
          {state.results.map((item) => <DatasetCard key={item.key} item={item} />)}
        </div>
      )}
    </section>
  );
}
