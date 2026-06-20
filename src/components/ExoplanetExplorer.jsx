import React, { useEffect, useMemo, useState } from 'react';

const TAP_ENDPOINT = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
const ARCHIVE_OVERVIEW = 'https://exoplanetarchive.ipac.caltech.edu/overview/';
const BASE_PATH = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const LOCAL_EXOPLANETS_URL = `${BASE_PATH}data/exoplanets.json`;

const FALLBACK_PLANETS = [
  { pl_name: 'Proxima Cen b', hostname: 'Proxima Centauri', disc_year: 2016, discoverymethod: 'Radial Velocity', pl_rade: 1.08, pl_bmasse: 1.27, pl_orbper: 11.19, pl_eqt: 234, sy_dist: 1.30, st_teff: 3042, pl_orbsmax: 0.049 },
  { pl_name: 'TRAPPIST-1e', hostname: 'TRAPPIST-1', disc_year: 2017, discoverymethod: 'Transit', pl_rade: 0.92, pl_bmasse: 0.69, pl_orbper: 6.10, pl_eqt: 251, sy_dist: 12.43, st_teff: 2566, pl_orbsmax: 0.029 },
  { pl_name: 'TRAPPIST-1f', hostname: 'TRAPPIST-1', disc_year: 2017, discoverymethod: 'Transit', pl_rade: 1.04, pl_bmasse: 1.04, pl_orbper: 9.21, pl_eqt: 219, sy_dist: 12.43, st_teff: 2566, pl_orbsmax: 0.038 },
  { pl_name: 'TRAPPIST-1g', hostname: 'TRAPPIST-1', disc_year: 2017, discoverymethod: 'Transit', pl_rade: 1.13, pl_bmasse: 1.32, pl_orbper: 12.35, pl_eqt: 198, sy_dist: 12.43, st_teff: 2566, pl_orbsmax: 0.047 },
  { pl_name: 'LHS 1140 b', hostname: 'LHS 1140', disc_year: 2017, discoverymethod: 'Transit', pl_rade: 1.73, pl_bmasse: 5.60, pl_orbper: 24.74, pl_eqt: 230, sy_dist: 14.99, st_teff: 3131, pl_orbsmax: 0.094 },
  { pl_name: 'TOI-700 d', hostname: 'TOI-700', disc_year: 2020, discoverymethod: 'Transit', pl_rade: 1.14, pl_bmasse: 1.72, pl_orbper: 37.42, pl_eqt: 269, sy_dist: 31.13, st_teff: 3480, pl_orbsmax: 0.163 },
  { pl_name: 'Kepler-452 b', hostname: 'Kepler-452', disc_year: 2015, discoverymethod: 'Transit', pl_rade: 1.63, pl_bmasse: 3.29, pl_orbper: 384.84, pl_eqt: 265, sy_dist: 550.0, st_teff: 5757, pl_orbsmax: 1.046 },
  { pl_name: 'Kepler-22 b', hostname: 'Kepler-22', disc_year: 2011, discoverymethod: 'Transit', pl_rade: 2.10, pl_bmasse: 9.10, pl_orbper: 289.86, pl_eqt: 262, sy_dist: 194.0, st_teff: 5518, pl_orbsmax: 0.849 },
  { pl_name: 'K2-18 b', hostname: 'K2-18', disc_year: 2015, discoverymethod: 'Transit', pl_rade: 2.61, pl_bmasse: 8.63, pl_orbper: 32.94, pl_eqt: 255, sy_dist: 38.0, st_teff: 3457, pl_orbsmax: 0.159 },
  { pl_name: '55 Cnc e', hostname: '55 Cancri', disc_year: 2004, discoverymethod: 'Radial Velocity', pl_rade: 1.88, pl_bmasse: 7.99, pl_orbper: 0.74, pl_eqt: 1958, sy_dist: 12.58, st_teff: 5172, pl_orbsmax: 0.016 },
  { pl_name: 'HD 209458 b', hostname: 'HD 209458', disc_year: 1999, discoverymethod: 'Transit', pl_rade: 15.45, pl_bmasse: 220, pl_orbper: 3.52, pl_eqt: 1459, sy_dist: 47.46, st_teff: 6092, pl_orbsmax: 0.047 },
  { pl_name: 'WASP-12 b', hostname: 'WASP-12', disc_year: 2008, discoverymethod: 'Transit', pl_rade: 20.09, pl_bmasse: 465, pl_orbper: 1.09, pl_eqt: 2516, sy_dist: 427.0, st_teff: 6300, pl_orbsmax: 0.023 },
  { pl_name: 'HR 8799 c', hostname: 'HR 8799', disc_year: 2008, discoverymethod: 'Imaging', pl_rade: 13.0, pl_bmasse: 3000, pl_orbper: 190000, pl_eqt: 1090, sy_dist: 41.24, st_teff: 7430, pl_orbsmax: 38.0 },
  { pl_name: 'Beta Pic b', hostname: 'beta Pic', disc_year: 2008, discoverymethod: 'Imaging', pl_rade: 15.4, pl_bmasse: 4100, pl_orbper: 8300, pl_eqt: 1724, sy_dist: 19.76, st_teff: 8052, pl_orbsmax: 9.2 },
  { pl_name: 'GJ 1214 b', hostname: 'GJ 1214', disc_year: 2009, discoverymethod: 'Transit', pl_rade: 2.85, pl_bmasse: 8.17, pl_orbper: 1.58, pl_eqt: 596, sy_dist: 14.64, st_teff: 3250, pl_orbsmax: 0.014 },
  { pl_name: 'Teegarden b', hostname: 'Teegarden Star', disc_year: 2019, discoverymethod: 'Radial Velocity', pl_rade: 1.02, pl_bmasse: 1.05, pl_orbper: 4.91, pl_eqt: 264, sy_dist: 3.83, st_teff: 2904, pl_orbsmax: 0.025 },
];

function finiteNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatNumber(value, digits = 2) {
  const number = finiteNumber(value);
  if (number === null) return 'n/a';
  if (Math.abs(number) >= 1000) return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(number);
  return number.toFixed(digits).replace(/\.?0+$/, '');
}

function planetType(radiusEarth) {
  const radius = finiteNumber(radiusEarth);
  if (radius === null) return { label: 'Unknown', color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', family: 'unknown' };
  if (radius < 1.25) return { label: 'Rocky', color: '#f87171', bg: 'rgba(248,113,113,0.13)', family: 'rocky' };
  if (radius < 2) return { label: 'Super-Earth', color: '#fb923c', bg: 'rgba(251,146,60,0.13)', family: 'super-earth' };
  if (radius < 4) return { label: 'Mini-Neptune', color: '#60a5fa', bg: 'rgba(96,165,250,0.13)', family: 'mini-neptune' };
  if (radius < 10) return { label: 'Neptune-like', color: '#818cf8', bg: 'rgba(129,140,248,0.13)', family: 'neptune' };
  return { label: 'Gas giant', color: '#fbbf24', bg: 'rgba(251,191,36,0.13)', family: 'gas-giant' };
}

function habitabilityScore(planet) {
  const radius = finiteNumber(planet.pl_rade);
  const temp = finiteNumber(planet.pl_eqt);
  const insol = finiteNumber(planet.pl_insol);
  const period = finiteNumber(planet.pl_orbper);
  let score = 0;
  let weight = 0;

  if (radius !== null) {
    const radiusFit = Math.max(0, 1 - Math.abs(radius - 1.05) / 2.2);
    score += radiusFit * 38;
    weight += 38;
  }
  if (temp !== null) {
    const tempFit = Math.max(0, 1 - Math.abs(temp - 288) / 190);
    score += tempFit * 40;
    weight += 40;
  } else if (insol !== null) {
    const insolFit = Math.max(0, 1 - Math.abs(Math.log10(Math.max(insol, 0.001))) / 0.9);
    score += insolFit * 34;
    weight += 34;
  }
  if (period !== null) {
    const periodFit = Math.max(0, 1 - Math.abs(Math.log10(Math.max(period, 0.001) / 365.25)) / 2.1);
    score += periodFit * 22;
    weight += 22;
  }
  return Math.round(weight ? (score / weight) * 100 : 0);
}

function portraitGradient(planet) {
  const type = planetType(planet.pl_rade);
  const temp = finiteNumber(planet.pl_eqt);
  const hot = temp !== null && temp > 900;
  const cold = temp !== null && temp < 180;
  if (type.family === 'rocky') return hot ? ['#3b120d', '#f97316', '#fed7aa'] : ['#35171a', '#b45309', '#fca5a5'];
  if (type.family === 'super-earth') return cold ? ['#0f172a', '#38bdf8', '#bfdbfe'] : ['#4a1d0b', '#fb923c', '#fef3c7'];
  if (type.family.includes('neptune')) return ['#06152f', '#2563eb', '#67e8f9'];
  if (type.family === 'gas-giant') return hot ? ['#2a0f12', '#dc2626', '#fbbf24'] : ['#241a10', '#a16207', '#fde68a'];
  return ['#111827', '#64748b', '#e2e8f0'];
}

function dataCompleteness(planet) {
  const fields = ['pl_rade', 'pl_bmasse', 'pl_orbper', 'pl_eqt', 'pl_orbsmax', 'sy_dist', 'st_teff', 'st_rad', 'st_mass', 'st_spectype'];
  const filled = fields.filter((field) => finiteNumber(planet[field]) !== null || (field === 'st_spectype' && planet[field])).length;
  return Math.round((filled / fields.length) * 100);
}

function spectralColor(planet) {
  const type = String(planet.st_spectype || '').trim().charAt(0).toUpperCase();
  if (type === 'O' || type === 'B') return '#93c5fd';
  if (type === 'A') return '#dbeafe';
  if (type === 'F') return '#f8fafc';
  if (type === 'G') return '#fde68a';
  if (type === 'K') return '#fb923c';
  if (type === 'M') return '#fb7185';
  const temp = finiteNumber(planet.st_teff);
  if (temp === null) return '#cbd5e1';
  if (temp > 7300) return '#93c5fd';
  if (temp > 6000) return '#f8fafc';
  if (temp > 5200) return '#fde68a';
  if (temp > 3700) return '#fb923c';
  return '#fb7185';
}

function MiniOrbit({ planet }) {
  const radius = Math.max(24, Math.min(72, Math.log10((finiteNumber(planet.pl_orbper) || 12) + 2) * 28));
  const type = planetType(planet.pl_rade);
  return (
    <div style={{ position: 'relative', width: 96, height: 96, flex: '0 0 96px' }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 999,
        background: `radial-gradient(circle at 50% 50%, ${type.color}11 0 18%, transparent 19% 100%)`,
      }} />
      <div style={{
        position: 'absolute',
        left: 48 - radius / 2,
        top: 48 - radius / 2,
        width: radius,
        height: radius,
        borderRadius: 999,
        border: `1px solid ${type.color}3d`,
      }} />
      <div style={{
        position: 'absolute',
        left: 43,
        top: 43,
        width: 10,
        height: 10,
        borderRadius: 999,
        background: '#fef3c7',
        boxShadow: '0 0 18px rgba(251,191,36,0.72)',
      }} />
      <div style={{
        position: 'absolute',
        left: 48 - 5,
        top: 48 - radius / 2 - 5,
        width: 10,
        height: 10,
        borderRadius: 999,
        background: type.color,
        boxShadow: `0 0 16px ${type.color}`,
      }} />
    </div>
  );
}

function PlanetPortrait({ planet }) {
  const [a, b, c] = portraitGradient(planet);
  const type = planetType(planet.pl_rade);
  const temp = finiteNumber(planet.pl_eqt);
  const bandOpacity = type.family === 'gas-giant' || type.family.includes('neptune') ? 0.86 : 0.34;
  const hasRing = type.family === 'gas-giant' && finiteNumber(planet.pl_rade) > 11;
  return (
    <div style={{ position: 'relative', width: 112, height: 112, flex: '0 0 112px', display: 'grid', placeItems: 'center' }}>
      {hasRing && (
        <div style={{
          position: 'absolute',
          width: 138,
          height: 34,
          borderRadius: '50%',
          border: `5px solid ${c}66`,
          transform: 'rotate(-18deg)',
          filter: 'blur(0.2px)',
          opacity: 0.72,
        }} />
      )}
      <div style={{
        position: 'absolute',
        width: 96,
        height: 96,
        borderRadius: 999,
        background: `radial-gradient(circle at 33% 27%, rgba(255,255,255,0.72) 0 7%, transparent 9%), radial-gradient(circle at 36% 34%, ${c} 0, ${b} 25%, ${a} 66%, #020617 100%)`,
        boxShadow: `0 0 42px ${type.color}34, inset -24px -18px 34px rgba(0,0,0,0.58), inset 12px 8px 24px rgba(255,255,255,0.08)`,
        border: `1px solid ${type.color}77`,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: '12% -30%',
          transform: 'rotate(-16deg)',
          background: `repeating-linear-gradient(90deg, transparent 0 14px, ${c}36 15px 24px, ${a}30 25px 38px)`,
          opacity: bandOpacity,
          filter: 'blur(0.6px)',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 28% 24%, rgba(255,255,255,0.24), transparent 23%), linear-gradient(112deg, transparent 0 43%, rgba(0,0,0,0.34) 47% 100%)',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: type.family === 'rocky' || type.family === 'super-earth' ? 0.24 : 0.08,
          background: 'radial-gradient(circle at 62% 58%, rgba(0,0,0,0.55) 0 7%, transparent 8%), radial-gradient(circle at 34% 66%, rgba(255,255,255,0.32) 0 3%, transparent 4%)',
        }} />
      </div>
      <span style={{
        position: 'absolute',
        left: 4,
        bottom: 2,
        border: '1px solid rgba(255,255,255,0.14)',
        background: 'rgba(2,6,23,0.74)',
        borderRadius: 999,
        color: 'rgba(255,255,255,0.68)',
        fontSize: 9,
        fontWeight: 900,
        padding: '2px 6px',
        letterSpacing: '0.06em',
      }}>
        {temp ? `${Math.round(temp)}K` : 'model'}
      </span>
    </div>
  );
}

function PlanetCard({ planet }) {
  const type = planetType(planet.pl_rade);
  const score = habitabilityScore(planet);
  const overview = `${ARCHIVE_OVERVIEW}${encodeURIComponent(planet.pl_name || '')}`;
  const scoreColor = score >= 70 ? '#4ade80' : score >= 45 ? '#fbbf24' : '#fb7185';

  return (
    <article className="card" style={{ padding: '1rem', borderRadius: 14, minHeight: 280 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <PlanetPortrait planet={planet} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <h2 style={{
            fontFamily: 'Space Grotesk, Inter, sans-serif',
            fontSize: '1.05rem',
            lineHeight: 1.1,
            color: '#fff',
            marginBottom: 5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>{planet.pl_name || 'Unnamed world'}</h2>
          <div style={{ color: 'rgba(255,255,255,0.48)', fontSize: 12, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {planet.hostname || 'Unknown star'} - {planet.discoverymethod || 'Unknown method'}
          </div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: 999,
            border: `1px solid ${type.color}55`,
            background: type.bg,
            color: type.color,
            padding: '3px 9px',
            fontSize: 11,
            fontWeight: 900,
          }}>{type.label}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '96px 1fr', gap: 12, marginTop: 14, alignItems: 'center' }}>
        <MiniOrbit planet={planet} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', fontSize: 12 }}>
          {[
            ['Radius', `${formatNumber(planet.pl_rade)} Re`],
            ['Mass', `${formatNumber(planet.pl_bmasse)} Me`],
            ['Period', `${formatNumber(planet.pl_orbper, 1)} days`],
            ['Orbit', `${formatNumber(planet.pl_orbsmax, 3)} AU`],
            ['Temp.', `${formatNumber(planet.pl_eqt, 0)} K`],
            ['Distance', `${formatNumber(planet.sy_dist, 1)} pc`],
            ['Star', `${formatNumber(planet.st_teff, 0)} K`],
            ['Spectral', planet.st_spectype || 'n/a'],
          ].map(([label, value]) => (
            <div key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 5 }}>
              <div style={{ color: 'rgba(255,255,255,0.36)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
              <strong style={{ color: 'rgba(255,255,255,0.82)', fontSize: 12 }}>{value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 13 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, marginBottom: 6 }}>
          <span style={{ color: 'rgba(255,255,255,0.42)' }}>Earth-likeness proxy</span>
          <strong style={{ color: scoreColor }}>{score}%</strong>
        </div>
        <div style={{ height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{ width: `${score}%`, height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${scoreColor}88, ${scoreColor})` }} />
        </div>
      </div>

      <div style={{
        marginTop: 10,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        color: 'rgba(255,255,255,0.42)',
        fontSize: 11,
      }}>
        <span style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '0.45rem', background: 'rgba(255,255,255,0.025)' }}>
          Stellar class <strong style={{ color: spectralColor(planet) }}>{planet.st_spectype || 'unknown'}</strong>
        </span>
        <span style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '0.45rem', background: 'rgba(255,255,255,0.025)' }}>
          Data filled <strong style={{ color: '#a7f3d0' }}>{dataCompleteness(planet)}%</strong>
        </span>
      </div>

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', fontSize: 11, color: 'rgba(255,255,255,0.36)' }}>
        <span>{planet.disc_year ? `Discovered ${planet.disc_year}` : 'Discovery year n/a'}</span>
        <a href={overview} target="_blank" rel="noreferrer" style={{ color: type.color, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap' }}>
          NASA ref
        </a>
      </div>
    </article>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '0.8rem 0.9rem', background: 'rgba(255,255,255,0.035)' }}>
      <div style={{ color: accent, fontSize: '1.5rem', fontWeight: 950, lineHeight: 1, fontFamily: 'Space Grotesk, Inter, sans-serif' }}>{value}</div>
      <div style={{ color: 'rgba(255,255,255,0.44)', fontSize: 11, marginTop: 5 }}>{label}</div>
    </div>
  );
}

export default function ExoplanetExplorer() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('snapshot');
  const [generatedAt, setGeneratedAt] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [sortBy, setSortBy] = useState('habitability');
  const [visibleCount, setVisibleCount] = useState(60);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const snapshot = await fetch(LOCAL_EXOPLANETS_URL, { cache: 'no-store' });
        if (!snapshot.ok) throw new Error('Local exoplanet snapshot unavailable');
        const snapshotData = await snapshot.json();
        if (!Array.isArray(snapshotData.data) || snapshotData.data.length === 0) throw new Error('Local exoplanet snapshot empty');
        if (active) {
          setPlanets(snapshotData.data);
          setSource('snapshot');
          setGeneratedAt(snapshotData.generatedAt || null);
        }
      } catch {
        try {
        const query = [
          'select top 2000',
          'pl_name,hostname,discoverymethod,disc_year,pl_orbper,pl_rade,pl_bmasse,pl_eqt,pl_insol,pl_orbsmax,pl_orbeccen,pl_orbincl,sy_dist,st_teff,st_rad,st_mass,st_spectype',
          'from pscomppars',
          'where pl_name is not null and hostname is not null',
          'order by sy_dist asc',
        ].join(' ');
        const url = `${TAP_ENDPOINT}?query=${encodeURIComponent(query)}&format=json`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Exoplanet Archive unavailable');
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error('Exoplanet Archive returned no rows');
        if (active) {
          setPlanets(data);
          setSource('live');
          setGeneratedAt(null);
        }
        } catch {
        if (active) {
          setPlanets(FALLBACK_PLANETS);
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
  }, []);

  const methods = useMemo(() => {
    const set = new Set(planets.map((planet) => planet.discoverymethod).filter(Boolean));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [planets]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return planets
      .filter((planet) => {
        const type = planetType(planet.pl_rade);
        if (query && !`${planet.pl_name || ''} ${planet.hostname || ''}`.toLowerCase().includes(query)) return false;
        if (typeFilter !== 'all' && type.family !== typeFilter) return false;
        if (methodFilter !== 'all' && planet.discoverymethod !== methodFilter) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'habitability') return habitabilityScore(b) - habitabilityScore(a);
        if (sortBy === 'distance') return (finiteNumber(a.sy_dist) ?? Infinity) - (finiteNumber(b.sy_dist) ?? Infinity);
        if (sortBy === 'radius') return (finiteNumber(b.pl_rade) ?? -1) - (finiteNumber(a.pl_rade) ?? -1);
        if (sortBy === 'year') return (finiteNumber(b.disc_year) ?? 0) - (finiteNumber(a.disc_year) ?? 0);
        if (sortBy === 'period') return (finiteNumber(a.pl_orbper) ?? Infinity) - (finiteNumber(b.pl_orbper) ?? Infinity);
        return (a.pl_name || '').localeCompare(b.pl_name || '');
      });
  }, [methodFilter, planets, search, sortBy, typeFilter]);

  const shown = filtered.slice(0, visibleCount);
  const promising = planets.filter((planet) => habitabilityScore(planet) >= 65).length;
  const nearest = planets.reduce((best, planet) => {
    const dist = finiteNumber(planet.sy_dist);
    if (dist === null) return best;
    if (!best || dist < best.dist) return { name: planet.pl_name, dist };
    return best;
  }, null);
  const sourceLabel = source === 'snapshot' ? 'Snapshot' : source === 'live' ? 'NASA' : 'Demo';

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 1.25rem 4.5rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: 12,
        marginBottom: 18,
      }}>
        <Stat label="Worlds loaded" value={loading ? '...' : planets.length} accent="#fb923c" />
        <Stat label="Earth-like candidates" value={loading ? '...' : promising} accent="#4ade80" />
        <Stat label="Closest in list" value={nearest ? `${nearest.dist.toFixed(1)} pc` : 'n/a'} accent="#67e8f9" />
        <Stat label="Data source" value={sourceLabel} accent={source !== 'demo' ? '#a7f3d0' : '#fbbf24'} />
      </div>

      <div style={{
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 20,
        padding: '0.9rem',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 16,
        background: 'rgba(255,255,255,0.035)',
        backdropFilter: 'blur(18px)',
      }}>
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setVisibleCount(60);
          }}
          placeholder="Search planet or host star"
          style={{
            flex: '1 1 260px',
            minWidth: 0,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff',
            borderRadius: 999,
            padding: '0.7rem 1rem',
            outline: 'none',
          }}
        />
        <select value={typeFilter} onChange={(event) => { setTypeFilter(event.target.value); setVisibleCount(60); }} style={selectStyle}>
          <option value="all">All planet types</option>
          <option value="rocky">Rocky</option>
          <option value="super-earth">Super-Earth</option>
          <option value="mini-neptune">Mini-Neptune</option>
          <option value="neptune">Neptune-like</option>
          <option value="gas-giant">Gas giant</option>
        </select>
        <select value={methodFilter} onChange={(event) => { setMethodFilter(event.target.value); setVisibleCount(60); }} style={selectStyle}>
          <option value="all">All methods</option>
          {methods.map((method) => <option key={method} value={method}>{method}</option>)}
        </select>
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} style={selectStyle}>
          <option value="habitability">Sort: Earth-like proxy</option>
          <option value="distance">Sort: nearest system</option>
          <option value="radius">Sort: largest radius</option>
          <option value="year">Sort: newest discovery</option>
          <option value="period">Sort: shortest orbit</option>
          <option value="name">Sort: name</option>
        </select>
        <span style={{ color: 'rgba(255,255,255,0.44)', fontSize: 12, marginLeft: 'auto' }}>
          {loading ? 'Loading NASA archive...' : `${filtered.length} matching worlds`}
        </span>
      </div>

      {source === 'demo' && !loading && (
        <div style={{ color: '#fbbf24', border: '1px solid rgba(251,191,36,0.24)', background: 'rgba(251,191,36,0.08)', borderRadius: 14, padding: '0.75rem 1rem', marginBottom: 18, fontSize: 13 }}>
          Browser could not reach the live archive, so AstroBis is showing a curated offline set. The query is wired for NASA Exoplanet Archive TAP.
        </div>
      )}
      {source === 'snapshot' && generatedAt && !loading && (
        <div style={{ color: '#a7f3d0', border: '1px solid rgba(34,197,94,0.22)', background: 'rgba(34,197,94,0.07)', borderRadius: 14, padding: '0.75rem 1rem', marginBottom: 18, fontSize: 13 }}>
          Using a same-origin NASA Exoplanet Archive snapshot generated during the site build on {new Date(generatedAt).toLocaleDateString()}. Visuals are data-driven artist renders, not direct photographs.
        </div>
      )}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 310px), 1fr))', gap: 16 }}>
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} style={{ height: 280, borderRadius: 14, background: 'linear-gradient(110deg, rgba(255,255,255,0.035), rgba(255,255,255,0.08), rgba(255,255,255,0.035))', border: '1px solid rgba(255,255,255,0.06)' }} />
          ))}
        </div>
      ) : shown.length ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 310px), 1fr))', gap: 16 }}>
            {shown.map((planet) => <PlanetCard key={`${planet.pl_name}-${planet.hostname}`} planet={planet} />)}
          </div>
          {visibleCount < filtered.length && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 60)}
                className="btn btn-secondary"
                style={{ borderRadius: 999 }}
              >
                Load more worlds
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'rgba(255,255,255,0.45)' }}>
          No exoplanets match those filters.
        </div>
      )}

      <p style={{ maxWidth: 820, margin: '2rem auto 0', textAlign: 'center', color: 'rgba(255,255,255,0.36)', fontSize: 12, lineHeight: 1.7 }}>
        Most exoplanets do not have resolved visible-light photographs. Planet portraits here are data-driven artist renders based on radius, temperature, and planet class; measurements and reference links come from the NASA Exoplanet Archive composite parameters table.
      </p>
    </div>
  );
}

const selectStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff',
  borderRadius: 999,
  padding: '0.7rem 0.9rem',
  outline: 'none',
  cursor: 'pointer',
  fontWeight: 700,
};
