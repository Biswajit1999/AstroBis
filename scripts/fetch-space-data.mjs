import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outputDir = path.join(process.cwd(), 'public', 'data');
const generatedAt = new Date().toISOString();
const EXOPLANET_QUERY_LIMIT = 7000;

function todayISO() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

async function fetchJson(url, label) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`${label} returned ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function writeSnapshot(filename, payload) {
  await mkdir(outputDir, { recursive: true });
  const file = path.join(outputDir, filename);
  await writeFile(file, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`[data] wrote ${filename}`);
}

async function keepExistingOrWriteFallback(filename, fallbackPayload, error) {
  const file = path.join(outputDir, filename);
  try {
    await readFile(file, 'utf8');
    console.warn(`[data] keeping existing ${filename}: ${error.message}`);
  } catch {
    await writeSnapshot(filename, fallbackPayload);
    console.warn(`[data] wrote fallback ${filename}: ${error.message}`);
  }
}

async function fetchExoplanets() {
  const countQuery = 'select count(*) as confirmed_planets, count(distinct hostname) as planetary_systems from pscomppars';
  const query = [
    `select top ${EXOPLANET_QUERY_LIMIT}`,
    'pl_name,hostname,discoverymethod,disc_facility,disc_year,pl_orbper,pl_rade,pl_bmasse,pl_eqt,pl_insol,pl_orbsmax,pl_orbeccen,pl_orbincl,sy_dist,st_teff,st_rad,st_mass,st_spectype',
    'from pscomppars',
    'where pl_name is not null and hostname is not null',
    'order by sy_dist asc',
  ].join(' ');
  const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(query)}&format=json`;
  const countUrl = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(countQuery)}&format=json`;
  try {
    const [data, countData] = await Promise.all([
      fetchJson(url, 'NASA Exoplanet Archive'),
      fetchJson(countUrl, 'NASA Exoplanet Archive count'),
    ]);
    const countRow = Array.isArray(countData) ? countData[0] : null;
    await writeSnapshot('exoplanets.json', {
      generatedAt,
      source: 'NASA Exoplanet Archive TAP pscomppars',
      query,
      countQuery,
      count: Array.isArray(data) ? data.length : 0,
      meta: {
        confirmedPlanets: Number(countRow?.confirmed_planets || 0),
        planetarySystems: Number(countRow?.planetary_systems || 0),
        queryLimit: EXOPLANET_QUERY_LIMIT,
        archiveTable: 'pscomppars',
      },
      data,
    });
  } catch (error) {
    await keepExistingOrWriteFallback('exoplanets.json', {
      generatedAt,
      source: 'offline fallback',
      query,
      count: 0,
      data: [],
    }, error);
  }
}

async function fetchNeoApproaches() {
  const params = new URLSearchParams({
    'date-min': todayISO(),
    'date-max': '2050-12-31',
    'dist-max': '0.3',
    body: 'Earth',
    sort: 'date',
    limit: '7500',
    fullname: 'true',
    diameter: 'true',
  });
  const url = `https://ssd-api.jpl.nasa.gov/cad.api?${params.toString()}`;
  try {
    const data = await fetchJson(url, 'JPL SBDB CAD');
    await writeSnapshot('neo-approaches.json', {
      generatedAt,
      source: 'NASA/JPL SBDB Close Approach Data API',
      query: Object.fromEntries(params.entries()),
      count: Number(data.count || data.data?.length || 0),
      total: Number(data.total || data.count || 0),
      fields: data.fields || [],
      data: data.data || [],
      signature: data.signature,
    });
  } catch (error) {
    await keepExistingOrWriteFallback('neo-approaches.json', {
      generatedAt,
      source: 'offline fallback',
      query: Object.fromEntries(params.entries()),
      count: 0,
      total: 0,
      fields: [],
      data: [],
    }, error);
  }
}

function parseCsvLine(line) {
  const values = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && quoted && next === '"') {
      value += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      values.push(value);
      value = '';
    } else {
      value += char;
    }
  }
  values.push(value);
  return values;
}

function spectralClass(value) {
  const letter = String(value || '').trim().charAt(0).toUpperCase();
  return ['O', 'B', 'A', 'F', 'G', 'K', 'M'].includes(letter) ? letter : 'G';
}

async function fetchInterstellarVisitors() {
  const targets = [
    { sstr: '1I', displayName: "1I/'Oumuamua", visitorClass: 'Interstellar asteroid', note: 'First confirmed interstellar object observed passing through the Solar System.' },
    { sstr: '2I', displayName: '2I/Borisov', visitorClass: 'Interstellar comet', note: 'First confirmed active interstellar comet.' },
    { sstr: '3I', displayName: '3I/ATLAS', visitorClass: 'Interstellar comet', note: 'Third known interstellar object; discovered by the NASA-funded ATLAS survey in 2025.' },
  ];
  const query = targets.map((target) => target.sstr);
  try {
    const data = await Promise.all(targets.map(async (target) => {
      const params = new URLSearchParams({
        sstr: target.sstr,
        'full-prec': '1',
        'cd-epoch': '1',
        'cd-tp': '1',
        'phys-par': '1',
      });
      const url = `https://ssd-api.jpl.nasa.gov/sbdb.api?${params.toString()}`;
      const payload = await fetchJson(url, `JPL SBDB ${target.sstr}`);
      return {
        ...target,
        sourceUrl: url,
        object: payload.object,
        orbit: payload.orbit,
        phys_par: payload.phys_par || [],
      };
    }));
    await writeSnapshot('small-body-visitors.json', {
      generatedAt,
      source: 'NASA/JPL SBDB API interstellar visitor objects',
      query,
      count: data.length,
      data,
    });
  } catch (error) {
    await keepExistingOrWriteFallback('small-body-visitors.json', {
      generatedAt,
      source: 'offline fallback',
      query,
      count: 0,
      data: [],
    }, error);
  }
}

async function fetchBrightStarCatalogue() {
  const url = 'https://raw.githubusercontent.com/astronexus/HYG-Database/main/hyg/CURRENT/hygdata_v41.csv';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, {
      headers: { accept: 'text/csv' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HYG star catalogue returned ${response.status}`);
    const text = await response.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const headers = parseCsvLine(lines.shift() || '').map((field) => field.replace(/^"|"$/g, ''));
    const rows = lines
      .map((line) => {
        const values = parseCsvLine(line);
        const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
        const ra = Number(row.ra);
        const dec = Number(row.dec);
        const distPc = Number(row.dist);
        const mag = Number(row.mag);
        if (!Number.isFinite(ra) || !Number.isFinite(dec) || !Number.isFinite(distPc) || !Number.isFinite(mag)) return null;
        if (distPc <= 0 || row.proper === 'Sol') return null;
        const name = row.proper || row.bf || (row.hr ? `HR ${row.hr}` : row.hd ? `HD ${row.hd}` : '');
        if (!name) return null;
        return {
          name,
          ra,
          dec,
          distPc,
          mag,
          spectral: spectralClass(row.spect),
          spect: row.spect || null,
          lum: Number.isFinite(Number(row.lum)) ? Number(row.lum) : null,
          sourceId: row.id,
          desc: `${name} - HYG bright-star catalogue entry (${row.spect || 'spectral class n/a'}, apparent magnitude ${mag.toFixed(2)})`,
        };
      })
      .filter(Boolean)
      .filter((row) => row.mag <= 5.6)
      .sort((a, b) => a.mag - b.mag)
      .slice(0, 420);

    await writeSnapshot('bright-stars.json', {
      generatedAt,
      source: 'HYG Database v4.1 bright-star subset',
      url,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    await keepExistingOrWriteFallback('bright-stars.json', {
      generatedAt,
      source: 'offline fallback',
      url,
      count: 0,
      data: [],
    }, error);
  } finally {
    clearTimeout(timeout);
  }
}

function parseTleEpoch(line1) {
  const epoch = String(line1 || '').slice(18, 32).trim();
  const match = epoch.match(/^(\d{2})(\d{3}(?:\.\d+)?)$/);
  if (!match) return null;
  const yy = Number(match[1]);
  const day = Number(match[2]);
  if (!Number.isFinite(yy) || !Number.isFinite(day)) return null;
  const year = yy < 57 ? 2000 + yy : 1900 + yy;
  return new Date(Date.UTC(year, 0, 1) + (day - 1) * 86400000).toISOString();
}

async function fetchIssTle() {
  const url = 'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(url, {
      headers: { accept: 'text/plain' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`CelesTrak ISS TLE returned ${response.status}`);
    const text = await response.text();
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length < 3 || !lines[1].startsWith('1 ') || !lines[2].startsWith('2 ')) {
      throw new Error('CelesTrak ISS TLE payload was not valid TLE text');
    }
    await writeSnapshot('iss-tle.json', {
      generatedAt,
      source: 'CelesTrak GP data for ISS (CATNR 25544)',
      url,
      name: lines[0],
      line1: lines[1],
      line2: lines[2],
      epoch: parseTleEpoch(lines[1]),
    });
  } catch (error) {
    await keepExistingOrWriteFallback('iss-tle.json', {
      generatedAt,
      source: 'offline fallback',
      url,
      name: 'ISS (ZARYA)',
      line1: '1 25544U 98067A   26171.00000000  .00016717  00000+0  10270-3 0  9993',
      line2: '2 25544  51.6400 000.0000 0006703 000.0000 000.0000 15.50000000    10',
      epoch: parseTleEpoch('1 25544U 98067A   26171.00000000  .00016717  00000+0  10270-3 0  9993'),
    }, error);
  } finally {
    clearTimeout(timeout);
  }
}

await Promise.all([fetchExoplanets(), fetchNeoApproaches(), fetchIssTle(), fetchInterstellarVisitors(), fetchBrightStarCatalogue()]);
