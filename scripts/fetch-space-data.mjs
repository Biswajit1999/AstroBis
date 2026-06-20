import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outputDir = path.join(process.cwd(), 'public', 'data');
const generatedAt = new Date().toISOString();

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
  const query = [
    'select top 900',
    'pl_name,hostname,discoverymethod,disc_year,pl_orbper,pl_rade,pl_bmasse,pl_eqt,pl_insol,pl_orbsmax,sy_dist,st_teff',
    'from pscomppars',
    'where pl_name is not null and hostname is not null',
    'order by sy_dist asc',
  ].join(' ');
  const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(query)}&format=json`;
  try {
    const data = await fetchJson(url, 'NASA Exoplanet Archive');
    await writeSnapshot('exoplanets.json', {
      generatedAt,
      source: 'NASA Exoplanet Archive TAP pscomppars',
      query,
      count: Array.isArray(data) ? data.length : 0,
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
    'dist-max': '0.2',
    body: 'Earth',
    sort: 'date',
    limit: '2500',
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

await Promise.all([fetchExoplanets(), fetchNeoApproaches()]);
