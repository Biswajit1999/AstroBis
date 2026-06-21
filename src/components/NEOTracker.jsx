import React, { useEffect, useMemo, useState } from 'react';

const CAD_ENDPOINT = 'https://ssd-api.jpl.nasa.gov/cad.api';
const AU_KM = 149597870.7;
const LD_KM = 384400;
const BASE_PATH = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const LOCAL_NEO_URL = `${BASE_PATH}data/neo-approaches.json`;

const FALLBACK_APPROACHES = [
  { des: '2026 AB', fullname: '(2026 AB) demo close approach', cd: '2026-Jun-25 14:20', dist: '0.012', v_rel: '12.6', h: '23.1', diameter: '' },
  { des: '99942', fullname: '99942 Apophis (2004 MN4)', cd: '2029-Apr-13 21:46', dist: '0.000254', v_rel: '7.43', h: '19.7', diameter: '0.34' },
  { des: '2001 WN5', fullname: '(2001 WN5)', cd: '2028-Jun-26 02:38', dist: '0.00166', v_rel: '10.2', h: '18.2', diameter: '0.93' },
  { des: '2015 RN35', fullname: '(2015 RN35)', cd: '2030-Dec-15 11:10', dist: '0.018', v_rel: '9.8', h: '21.7', diameter: '' },
  { des: '2007 FT3', fullname: '(2007 FT3)', cd: '2048-Oct-03 06:40', dist: '0.053', v_rel: '15.8', h: '20.0', diameter: '' },
  { des: '2020 AP3', fullname: '(2020 AP3)', cd: '2041-Jan-08 09:24', dist: '0.036', v_rel: '18.4', h: '24.1', diameter: '' },
];

function pad2(value) {
  return String(value).padStart(2, '0');
}

function todayISO() {
  const date = new Date();
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function dateValue(value) {
  const raw = String(value || '');
  const direct = Date.parse(raw);
  if (Number.isFinite(direct)) return direct;
  return Date.parse(raw.replace(/-/g, ' '));
}

function formatKm(km) {
  const value = toNumber(km);
  if (value === null) return 'n/a';
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M km`;
  if (value >= 1000) return `${Math.round(value / 1000)}K km`;
  return `${Math.round(value)} km`;
}

function estimateDiameterKm(h) {
  const magnitude = toNumber(h);
  if (magnitude === null) return null;
  return (1329 / Math.sqrt(0.14)) * (10 ** (-magnitude / 5));
}

function daysUntil(dateMs) {
  if (!Number.isFinite(dateMs)) return null;
  return Math.ceil((dateMs - Date.now()) / 86400000);
}

function impactEnergyMt(object) {
  if (!object?.diameterKm || !object?.velocity) return null;
  const radiusM = object.diameterKm * 500;
  const density = 2500;
  const massKg = (4 / 3) * Math.PI * (radiusM ** 3) * density;
  const joules = 0.5 * massKg * ((object.velocity * 1000) ** 2);
  return joules / 4.184e15;
}

function objectClass(object) {
  const diameter = object.diameterKm ?? 0;
  if (diameter >= 1) return 'kilometer-class';
  if (diameter >= 0.14) return 'PHA-size proxy';
  if (diameter >= 0.05) return 'building-scale';
  return 'small body';
}

function normalizeObject(row) {
  const distAu = toNumber(row.dist) ?? 0;
  const h = toNumber(row.h);
  const listedDiameter = toNumber(row.diameter);
  const diameterKm = listedDiameter ?? estimateDiameterKm(h);
  const distanceKm = distAu * AU_KM;
  const velocity = toNumber(row.v_rel);
  const riskProxy = distAu <= 0.05 && (h === null || h <= 22);
  const largeProxy = (diameterKm ?? 0) >= 0.14 || (h !== null && h <= 22);

  return {
    id: row.des || row.fullname || row.cd,
    name: row.fullname || row.des || 'Unnamed object',
    designation: row.des || 'n/a',
    date: row.cd || 'n/a',
    dateMs: dateValue(row.cd),
    distAu,
    distanceKm,
    lunarDistance: distanceKm / LD_KM,
    velocity,
    h,
    diameterKm,
    measuredDiameter: listedDiameter !== null,
    riskProxy,
    largeProxy,
  };
}

function parseCadPayload(payload) {
  const fields = payload.fields || [];
  return (payload.data || []).map((row) => {
    const mapped = {};
    fields.forEach((field, index) => {
      mapped[field] = row[index];
    });
    return normalizeObject(mapped);
  });
}

function seededAngle(seed) {
  let hash = 0;
  const text = String(seed);
  for (let i = 0; i < text.length; i += 1) hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  return ((Math.abs(hash) % 6283) / 1000);
}

function ApproachMap({ objects, maxAu }) {
  const size = 390;
  const center = size / 2;
  const earthRadius = 18;
  const maxDistance = Math.max(maxAu * AU_KM, 0.02 * AU_KM);
  const mapObjects = objects.slice(0, 90).map((object) => {
    const angle = seededAngle(`${object.id}-${object.date}`);
    const distanceRatio = Math.min(1, Math.sqrt(object.distanceKm / maxDistance));
    const radius = earthRadius + distanceRatio * (center - earthRadius - 20);
    const dot = Math.max(3, Math.min(12, Math.sqrt((object.diameterKm || 0.04) / 0.14) * 4));
    return {
      ...object,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      dot,
    };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', display: 'block' }}>
      <defs>
        <radialGradient id="earthNeo" cx="38%" cy="30%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="45%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
      </defs>
      {[1, 5, 10, 25].map((ld) => {
        const radius = earthRadius + Math.sqrt((ld * LD_KM) / maxDistance) * (center - earthRadius - 20);
        if (radius > center - 12) return null;
        return (
          <g key={ld}>
            <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <text x={center + radius + 4} y={center - 3} fill="rgba(255,255,255,0.35)" fontSize="10">{ld} LD</text>
          </g>
        );
      })}
      <circle cx={center} cy={center} r={earthRadius} fill="url(#earthNeo)" />
      <circle cx={center} cy={center} r={earthRadius + 4} fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.55" />
      <circle cx={center} cy={center} r={earthRadius + Math.sqrt(LD_KM / maxDistance) * (center - earthRadius - 20)} fill="none" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 5" />
      {mapObjects.map((object) => (
        <g key={`${object.id}-${object.date}`}>
          <line x1={center} y1={center} x2={object.x} y2={object.y} stroke={object.riskProxy ? 'rgba(248,113,113,0.28)' : 'rgba(34,197,94,0.16)'} strokeWidth="1" />
          <circle
            cx={object.x}
            cy={object.y}
            r={object.dot}
            fill={object.riskProxy ? '#fb7185' : object.largeProxy ? '#fbbf24' : '#22c55e'}
            opacity="0.9"
          />
        </g>
      ))}
      <text x={center} y={center + 4} textAnchor="middle" fill="white" fontSize="9" fontWeight="800">Earth</text>
    </svg>
  );
}

function Timeline({ objects, endYear }) {
  const firstYear = new Date().getFullYear();
  const span = Math.max(1, endYear - firstYear);
  const sample = objects.slice(0, 180);
  return (
    <div style={{
      height: 96,
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
        <div key={tick} style={{ position: 'absolute', left: `${tick * 100}%`, top: 0, bottom: 0, borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ position: 'absolute', top: 7, left: 5, color: 'rgba(255,255,255,0.34)', fontSize: 10 }}>{Math.round(firstYear + span * tick)}</span>
        </div>
      ))}
      {sample.map((object, index) => {
        const year = new Date(object.dateMs).getFullYear();
        const left = Math.max(0, Math.min(100, ((year - firstYear) / span) * 100));
        const top = 26 + ((index * 17) % 56);
        return (
          <span
            key={`${object.id}-${object.date}-${index}`}
            title={`${object.name} - ${object.date}`}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top,
              width: object.riskProxy ? 8 : 5,
              height: object.riskProxy ? 8 : 5,
              borderRadius: 99,
              transform: 'translate(-50%, -50%)',
              background: object.riskProxy ? '#fb7185' : object.largeProxy ? '#fbbf24' : '#22c55e',
              boxShadow: object.riskProxy ? '0 0 14px rgba(248,113,113,0.6)' : '0 0 10px rgba(34,197,94,0.4)',
            }}
          />
        );
      })}
    </div>
  );
}

function ObjectCard({ object }) {
  const color = object.riskProxy ? '#fb7185' : object.largeProxy ? '#fbbf24' : '#22c55e';
  const jplUrl = `https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${encodeURIComponent(object.designation)}`;
  const days = daysUntil(object.dateMs);
  const energy = impactEnergyMt(object);
  return (
    <article style={{
      border: `1px solid ${object.riskProxy ? 'rgba(248,113,113,0.35)' : 'rgba(255,255,255,0.09)'}`,
      background: object.riskProxy ? 'rgba(127,29,29,0.16)' : 'rgba(255,255,255,0.035)',
      borderRadius: 14,
      padding: '0.95rem 1rem',
      color: '#fff',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 11 }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', fontSize: '0.98rem', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {object.name.replace(/[()]/g, '')}
          </h3>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Designation {object.designation}</div>
        </div>
        <span style={{
          border: `1px solid ${color}55`,
          background: `${color}18`,
          color,
          borderRadius: 999,
          padding: '3px 8px',
          fontSize: 10,
          fontWeight: 950,
          whiteSpace: 'nowrap',
        }}>{object.riskProxy ? 'Risk proxy' : object.largeProxy ? 'Large' : objectClass(object)}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 14px', fontSize: 12 }}>
        <Metric label="Closest approach" value={object.date} color="#fde68a" />
        <Metric label="Time until pass" value={days === null ? 'n/a' : days <= 0 ? 'today' : `${days} days`} color="#fef08a" />
        <Metric label="Miss distance" value={`${formatKm(object.distanceKm)} / ${object.lunarDistance.toFixed(1)} LD`} color="#93c5fd" />
        <Metric label="Relative speed" value={`${object.velocity?.toFixed(2) ?? 'n/a'} km/s`} color="#c4b5fd" />
        <Metric label="Diameter" value={object.diameterKm ? `${object.diameterKm.toFixed(object.diameterKm < 1 ? 3 : 2)} km${object.measuredDiameter ? '' : ' est.'}` : 'n/a'} color="#86efac" />
        <Metric label="Energy scale" value={energy ? `${energy < 1 ? energy.toFixed(3) : energy.toFixed(1)} Mt TNT` : 'n/a'} color="#fb923c" />
        <Metric label="Absolute mag. H" value={object.h?.toFixed(1) ?? 'n/a'} color="#fda4af" />
        <Metric label="Distance in AU" value={object.distAu.toFixed(5)} color="#67e8f9" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
        <a href={jplUrl} target="_blank" rel="noreferrer" style={{ color, fontSize: 11, fontWeight: 900, textDecoration: 'none' }}>
          JPL orbit ref -&gt;
        </a>
      </div>
    </article>
  );
}

function Metric({ label, value, color }) {
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 6 }}>
      <div style={{ color: 'rgba(255,255,255,0.36)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      <strong style={{ color, fontSize: 12 }}>{value}</strong>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ flex: '1 1 150px' }}>
      <div style={{ color, fontSize: '1.65rem', fontWeight: 950, lineHeight: 1, fontFamily: 'Space Grotesk, Inter, sans-serif' }}>{value}</div>
      <div style={{ color: 'rgba(255,255,255,0.43)', fontSize: 11, marginTop: 5 }}>{label}</div>
    </div>
  );
}

export default function NEOTracker() {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('snapshot');
  const [generatedAt, setGeneratedAt] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [endYear, setEndYear] = useState(2050);
  const [distMaxAu, setDistMaxAu] = useState(0.1);
  const [sortBy, setSortBy] = useState('date');
  const [riskOnly, setRiskOnly] = useState(false);
  const [largeOnly, setLargeOnly] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const local = await fetch(LOCAL_NEO_URL, { cache: 'no-store' });
        if (!local.ok) throw new Error('Local NEO snapshot unavailable');
        const snapshot = await local.json();
        const parsed = parseCadPayload(snapshot);
        if (!parsed.length) throw new Error('Local NEO snapshot empty');
        if (active) {
          setObjects(parsed.filter((object) => object.distAu <= distMaxAu && new Date(object.dateMs).getFullYear() <= endYear));
          setSource('snapshot');
          setGeneratedAt(snapshot.generatedAt || null);
        }
      } catch {
        try {
        const params = new URLSearchParams({
          'date-min': todayISO(),
          'date-max': `${endYear}-12-31`,
          'dist-max': String(distMaxAu),
          body: 'Earth',
          sort: 'date',
          limit: '1500',
          fullname: 'true',
          diameter: 'true',
        });
        const response = await fetch(`${CAD_ENDPOINT}?${params.toString()}`);
        if (!response.ok) throw new Error('JPL CAD unavailable');
        const data = await response.json();
        const parsed = parseCadPayload(data);
        if (!parsed.length) throw new Error('No approaches found');
        if (active) {
          setObjects(parsed);
          setSource('live');
          setGeneratedAt(null);
        }
        } catch {
        if (active) {
          setObjects(FALLBACK_APPROACHES.map(normalizeObject));
          setSource('demo');
          setGeneratedAt(null);
        }
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [distMaxAu, endYear, refreshIndex]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return objects
      .filter((object) => {
        if (riskOnly && !object.riskProxy) return false;
        if (largeOnly && !object.largeProxy) return false;
        if (query && !`${object.name} ${object.designation}`.toLowerCase().includes(query)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
        if (sortBy === 'speed') return (b.velocity ?? 0) - (a.velocity ?? 0);
        if (sortBy === 'size') return (b.diameterKm ?? 0) - (a.diameterKm ?? 0);
        if (sortBy === 'risk') return Number(b.riskProxy) - Number(a.riskProxy) || a.distanceKm - b.distanceKm;
        return a.dateMs - b.dateMs;
      });
  }, [largeOnly, objects, riskOnly, search, sortBy]);

  const riskCount = objects.filter((object) => object.riskProxy).length;
  const largeCount = objects.filter((object) => object.largeProxy).length;
  const closest = objects.reduce((best, object) => (!best || object.distanceKm < best.distanceKm ? object : best), null);
  const largest = objects.reduce((best, object) => (!best || (object.diameterKm ?? 0) > (best.diameterKm ?? 0) ? object : best), null);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.25rem 4.5rem' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 18,
        padding: '1.05rem 1.2rem',
        marginBottom: 18,
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.09)',
        background: 'rgba(255,255,255,0.035)',
      }}>
        <Stat label={`Close approaches through ${endYear}`} value={loading ? '...' : objects.length} color="#a78bfa" />
        <Stat label="Risk proxy objects" value={loading ? '...' : riskCount} color="#fb7185" />
        <Stat label="Large object proxy" value={loading ? '...' : largeCount} color="#fbbf24" />
        <Stat label="Closest listed pass" value={closest ? `${closest.lunarDistance.toFixed(1)} LD` : 'n/a'} color="#67e8f9" />
        <Stat label="Largest listed diameter" value={largest?.diameterKm ? `${largest.diameterKm.toFixed(2)} km` : 'n/a'} color="#86efac" />
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 10,
        marginBottom: 18,
        padding: '0.85rem',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.09)',
        background: 'rgba(255,255,255,0.03)',
      }}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search designation or asteroid name"
          style={inputStyle}
        />
        <select value={endYear} onChange={(event) => setEndYear(Number(event.target.value))} style={selectStyle}>
          <option value={2030}>Through 2030</option>
          <option value={2040}>Through 2040</option>
          <option value={2050}>Through 2050</option>
        </select>
        <select value={distMaxAu} onChange={(event) => setDistMaxAu(Number(event.target.value))} style={selectStyle}>
          <option value={0.03}>Within 0.03 AU</option>
          <option value={0.05}>Within 0.05 AU</option>
          <option value={0.1}>Within 0.10 AU</option>
          <option value={0.2}>Within 0.20 AU</option>
          <option value={0.3}>Within 0.30 AU</option>
        </select>
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} style={selectStyle}>
          <option value="date">Sort: date</option>
          <option value="distance">Sort: nearest</option>
          <option value="speed">Sort: fastest</option>
          <option value="size">Sort: largest</option>
          <option value="risk">Sort: risk proxy</option>
        </select>
        <button type="button" onClick={() => setRiskOnly((value) => !value)} style={toggleStyle(riskOnly, '#fb7185')}>Risk only</button>
        <button type="button" onClick={() => setLargeOnly((value) => !value)} style={toggleStyle(largeOnly, '#fbbf24')}>Large only</button>
        <button type="button" onClick={() => setRefreshIndex((value) => value + 1)} style={toggleStyle(false, '#67e8f9')}>Reload data</button>
      </div>

      {source === 'demo' && !loading && (
        <div style={{ marginBottom: 18, borderRadius: 14, border: '1px solid rgba(251,191,36,0.24)', background: 'rgba(251,191,36,0.08)', color: '#fbbf24', padding: '0.75rem 1rem', fontSize: 13 }}>
          JPL CAD could not be reached from the browser, so AstroBis is showing offline demo approaches.
        </div>
      )}
      {source === 'snapshot' && generatedAt && !loading && (
        <div style={{ marginBottom: 18, borderRadius: 14, border: '1px solid rgba(34,197,94,0.22)', background: 'rgba(34,197,94,0.07)', color: '#a7f3d0', padding: '0.75rem 1rem', fontSize: 13 }}>
          Using a same-origin JPL close-approach snapshot generated during the site build on {new Date(generatedAt).toLocaleDateString()}.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 20, alignItems: 'start' }}>
        <aside style={{
          position: 'sticky',
          top: 88,
          borderRadius: 18,
          border: '1px solid rgba(255,255,255,0.09)',
          background: 'rgba(255,255,255,0.03)',
          padding: '1rem',
        }}>
          <div style={{ color: '#fda4af', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 900, marginBottom: 8 }}>Approach radar</div>
          {loading ? (
            <div style={{ height: 390, display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.38)' }}>Loading JPL approaches...</div>
          ) : (
            <ApproachMap objects={filtered} maxAu={distMaxAu} />
          )}
          <div style={{ color: 'rgba(255,255,255,0.42)', fontSize: 11, lineHeight: 1.6, marginTop: 10 }}>
            Ring labels use lunar distances. Dot size follows diameter estimate. Risk proxy is not an impact probability; it flags close passes within 0.05 AU and H less than or equal to 22 when available.
          </div>
        </aside>

        <section>
          <div style={{ marginBottom: 14 }}>
            <Timeline objects={filtered} endYear={endYear} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, color: 'rgba(255,255,255,0.42)', fontSize: 12, marginBottom: 10 }}>
            <span>{loading ? 'Loading...' : `${filtered.length} objects shown`}</span>
            <span>Source: {source === 'snapshot' ? 'build snapshot' : source === 'live' ? 'JPL SBDB close-approach data' : 'offline demo'}</span>
          </div>
          <div style={{ display: 'grid', gap: 12, maxHeight: '76vh', overflowY: 'auto', paddingRight: 5 }}>
            {loading ? (
              Array.from({ length: 7 }).map((_, index) => <div key={index} style={{ height: 130, borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />)
            ) : filtered.length ? (
              filtered.map((object) => <ObjectCard key={`${object.id}-${object.date}`} object={object} />)
            ) : (
              <div style={{ color: 'rgba(255,255,255,0.45)', textAlign: 'center', padding: '3rem 1rem' }}>No objects match those filters.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

const inputStyle = {
  flex: '1 1 240px',
  minWidth: 0,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff',
  borderRadius: 999,
  padding: '0.68rem 0.9rem',
  outline: 'none',
};

const selectStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff',
  borderRadius: 999,
  padding: '0.68rem 0.85rem',
  outline: 'none',
  cursor: 'pointer',
  fontWeight: 760,
};

function toggleStyle(active, color) {
  return {
    border: `1px solid ${active ? `${color}66` : 'rgba(255,255,255,0.12)'}`,
    background: active ? `${color}18` : 'rgba(255,255,255,0.06)',
    color: active ? color : 'rgba(255,255,255,0.72)',
    borderRadius: 999,
    padding: '0.68rem 0.85rem',
    cursor: 'pointer',
    fontWeight: 850,
  };
}
