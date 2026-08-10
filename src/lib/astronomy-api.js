import axios from 'axios';

const EXOPLANET_API = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
const NASA_API_KEY = import.meta.env.PUBLIC_NASA_API_KEY || 'DEMO_KEY';

function publicDataUrl(filename) {
  const base = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
    ? import.meta.env.BASE_URL
    : '/';
  return `${base.endsWith('/') ? base : `${base}/`}data/${filename}`;
}

function normalisePlanet(row) {
  return {
    pl_name: row.pl_name,
    hostname: row.hostname,
    discoverymethod: row.discoverymethod,
    disc_facility: row.disc_facility,
    disc_year: finite(row.disc_year),
    pl_orbper: finite(row.pl_orbper),
    pl_rade: finite(row.pl_rade ?? row.pl_radj),
    pl_bmasse: finite(row.pl_bmasse ?? row.pl_bmassj),
    pl_eqt: finite(row.pl_eqt),
    pl_insol: finite(row.pl_insol),
    pl_orbsmax: finite(row.pl_orbsmax),
    pl_orbeccen: finite(row.pl_orbeccen),
    sy_dist: finite(row.sy_dist),
    st_teff: finite(row.st_teff),
    st_rad: finite(row.st_rad),
    st_mass: finite(row.st_mass),
    st_spectype: row.st_spectype,
  };
}

function finite(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

async function getBundledExoplanetSnapshot(limit = 7000) {
  const response = await fetch(publicDataUrl('exoplanets.json'), { cache: 'force-cache' });
  if (!response.ok) throw new Error(`Bundled exoplanets.json returned HTTP ${response.status}`);
  const payload = await response.json();
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  return rows.slice(0, limit).map(normalisePlanet);
}

export async function getExoplanets({ live = false, limit = 100 } = {}) {
  if (!live) {
    return getBundledExoplanetSnapshot(limit);
  }

  try {
    const query = `select top ${Math.max(1, Math.min(7000, Number(limit) || 100))}
      pl_name, hostname, discoverymethod, disc_facility, disc_year, pl_orbper,
      pl_rade, pl_bmasse, pl_eqt, pl_insol, pl_orbsmax, pl_orbeccen, sy_dist,
      st_teff, st_rad, st_mass, st_spectype
      from pscomppars
      where pl_name is not null and hostname is not null
      order by sy_dist asc`;

    const response = await axios.get(EXOPLANET_API, {
      params: { query, format: 'json' },
      timeout: 12000,
    });

    const rows = Array.isArray(response.data) ? response.data : [];
    if (!rows.length) throw new Error('NASA Exoplanet Archive returned zero rows');
    return rows.map(normalisePlanet);
  } catch (error) {
    console.warn('Live exoplanet request failed; using bundled NASA snapshot.', error);
    return getBundledExoplanetSnapshot(limit);
  }
}

export async function getAPOD() {
  try {
    const response = await axios.get('https://api.nasa.gov/planetary/apod', {
      params: { api_key: NASA_API_KEY },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.warn('NASA APOD request failed.', error);
    return null;
  }
}

export function getHabitabilityIndex(planet) {
  const radiusEarth = finite(planet.pl_rade ?? planet.pl_radj);
  const insolationEarth = finite(planet.pl_insol);
  const equilibriumTemperature = finite(planet.pl_eqt);
  const eccentricity = finite(planet.pl_orbeccen);

  if (!radiusEarth) return 0;

  const radiusScore = gaussianPenalty(Math.log(radiusEarth), Math.log(1.0), 0.45);
  const insolationScore = insolationEarth
    ? gaussianPenalty(Math.log(insolationEarth), Math.log(1.0), 0.85)
    : 0.55;
  const temperatureScore = equilibriumTemperature
    ? gaussianPenalty(equilibriumTemperature, 255, 85)
    : 0.55;
  const eccentricityScore = eccentricity === null ? 0.7 : Math.max(0, 1 - eccentricity / 0.45);

  const score = (
    0.34 * radiusScore +
    0.34 * insolationScore +
    0.22 * temperatureScore +
    0.10 * eccentricityScore
  );

  return Math.max(0, Math.min(1, score));
}

function gaussianPenalty(value, centre, sigma) {
  if (!Number.isFinite(value)) return 0;
  const z = (value - centre) / sigma;
  return Math.exp(-0.5 * z * z);
}

