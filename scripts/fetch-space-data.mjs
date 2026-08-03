import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outputDir = path.join(process.cwd(), 'public', 'data');
const generatedAt = new Date().toISOString();
const EXOPLANET_QUERY_LIMIT = 7000;

const HOME_STATS_FALLBACK = {
  schemaVersion: 1,
  generatedAt: '2026-06-21T21:10:28.916Z',
  source: 'Bundled AstroBis reference snapshot',
  exoplanetQuery: 'select count(pl_name) from ps where default_flag = 1',
  stats: {
    confirmedExoplanets: 6298,
    oortInnerAu: 1000,
    oortOuterAu: 100000,
    universeAgeGyr: 13.8,
    solarSystemPlanets: 8,
  },
};

const WORLD_OPS_FALLBACK = {
  schemaVersion: 1,
  generatedAt,
  sources: [
    { id: 'fallback', label: 'Bundled AstroBis EarthOps fallback', status: 'fallback', count: 4 },
  ],
  events: [
    {
      id: 'fallback-eonet-hawaii',
      type: 'nasa-event',
      title: 'NASA Earth-event layer unavailable',
      lat: 19.42,
      lon: -155.29,
      severity: 'reference',
      timestamp: generatedAt,
      source: 'offline fallback',
      url: 'https://eonet.gsfc.nasa.gov/',
      summary: 'Fallback marker used only when live public Earth-event feeds cannot be reached during the build.',
    },
    {
      id: 'fallback-quake-pacific',
      type: 'earthquake',
      title: 'USGS earthquake layer unavailable',
      lat: 35.68,
      lon: 139.76,
      severity: 'reference',
      timestamp: generatedAt,
      source: 'offline fallback',
      url: 'https://earthquake.usgs.gov/',
      summary: 'Fallback reference marker used when the USGS GeoJSON feed is unavailable.',
    },
  ],
  satellites: [
    {
      id: 'fallback-iss',
      name: 'ISS (ZARYA)',
      noradId: 25544,
      objectId: '1998-067A',
      group: 'Space stations',
      status: 'station',
      epoch: generatedAt,
      meanMotion: 15.49,
      eccentricity: 0.0007,
      inclination: 51.64,
      raan: 0,
      argumentOfPerigee: 0,
      meanAnomaly: 0,
      altitudeKm: 420,
    },
  ],
  launches: [
    {
      id: 'fallback-launch-ksc',
      name: 'Launch Library feed unavailable',
      net: generatedAt,
      status: 'snapshot fallback',
      provider: 'offline fallback',
      mission: 'Upcoming launch feed could not be reached during the build.',
      pad: 'Kennedy Space Center',
      location: 'Florida, United States',
      lat: 28.5729,
      lon: -80.649,
      url: 'https://ll.thespacedevs.com/',
    },
  ],
  news: [
    {
      id: 'fallback-news',
      title: 'Spaceflight news feed unavailable',
      site: 'offline fallback',
      publishedAt: generatedAt,
      url: 'https://api.spaceflightnewsapi.net/v4/docs/',
      summary: 'AstroBis keeps the last deployed EarthOps snapshot when external news APIs are unreachable.',
      imageUrl: '',
    },
  ],
  totals: {
    events: 2,
    satellites: 1,
    launches: 1,
    news: 1,
  },
};

const GDACS_TYPE_LABELS = {
  EQ: 'earthquake',
  TC: 'cyclone',
  FL: 'flood',
  VO: 'volcano',
  DR: 'drought',
};

const CELESTRAK_WORLD_GROUPS = [
  { id: 'stations', label: 'Space stations', status: 'station', limit: 22 },
  { id: 'last-30-days', label: 'Recent launches', status: 'recent-object', limit: 80 },
  { id: 'geo', label: 'Geostationary belt', status: 'satellite', limit: 80 },
  { id: 'starlink', label: 'Starlink constellation sample', status: 'satellite', limit: 140 },
  { id: 'oneweb', label: 'OneWeb constellation sample', status: 'satellite', limit: 70 },
  { id: 'cosmos-2251-debris', label: 'Cosmos 2251 debris sample', status: 'debris', limit: 110 },
  { id: 'fengyun-1c-debris', label: 'Fengyun 1C debris sample', status: 'debris', limit: 130 },
  { id: 'iridium-33-debris', label: 'Iridium 33 debris sample', status: 'debris', limit: 80 },
];

const LAUNCH_SITE_COORDINATES = [
  { match: /kennedy|cape canaveral|ccsfs|ksc/i, lat: 28.5729, lon: -80.649 },
  { match: /vandenberg/i, lat: 34.742, lon: -120.572 },
  { match: /starbase|boca chica/i, lat: 25.997, lon: -97.156 },
  { match: /wallops/i, lat: 37.94, lon: -75.466 },
  { match: /baikonur/i, lat: 45.965, lon: 63.305 },
  { match: /kourou|guiana/i, lat: 5.239, lon: -52.768 },
  { match: /wenchang/i, lat: 19.614, lon: 110.951 },
  { match: /jiuquan/i, lat: 40.96, lon: 100.298 },
  { match: /taiyuan/i, lat: 38.849, lon: 111.608 },
  { match: /xichang/i, lat: 28.246, lon: 102.028 },
  { match: /tanegashima/i, lat: 30.391, lon: 130.969 },
  { match: /satish dhawan|sriharikota/i, lat: 13.7199, lon: 80.2304 },
  { match: /mahia|rocket lab/i, lat: -39.262, lon: 177.865 },
  { match: /plesetsk/i, lat: 62.927, lon: 40.575 },
  { match: /vostochny/i, lat: 51.884, lon: 128.333 },
  { match: /kodiak|pacific spaceport/i, lat: 57.435, lon: -152.339 },
];

function todayISO() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function daysAgoISO(days) {
  const date = new Date(Date.now() - days * 86400000);
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function safeIso(value) {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 1000000000) {
    return new Date(numeric).toISOString();
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : generatedAt;
}

function trimText(value, maxLength = 220) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}...`;
}

function sampleEvenly(rows, limit) {
  if (!Array.isArray(rows) || rows.length <= limit) return rows || [];
  const step = Math.max(1, Math.ceil(rows.length / limit));
  return rows.filter((_, index) => index % step === 0).slice(0, limit);
}

function sourceRecord(id, label, url, status, count, error) {
  return {
    id,
    label,
    url,
    status,
    count,
    ...(error ? { error: trimText(error.message || error, 140) } : {}),
  };
}

function latestPointGeometry(geometry = []) {
  return [...geometry].reverse().find((item) => item?.type === 'Point' && Array.isArray(item.coordinates));
}

function launchSiteCoordinate(location = '', pad = '') {
  const text = `${pad} ${location}`;
  return LAUNCH_SITE_COORDINATES.find((site) => site.match.test(text)) || null;
}

function satelliteAltitudeKm(meanMotion) {
  const motion = finiteNumber(meanMotion);
  if (!motion || motion <= 0) return null;
  const mu = 398600.4418;
  const radiansPerSecond = motion * 2 * Math.PI / 86400;
  const semiMajorKm = Math.cbrt(mu / (radiansPerSecond ** 2));
  return semiMajorKm - 6371;
}

function eonetSeverity(event) {
  const point = latestPointGeometry(event.geometry);
  const magnitude = finiteNumber(point?.magnitudeValue);
  const category = event.categories?.[0]?.id || '';
  if (category === 'wildfires' && magnitude !== null) {
    if (magnitude >= 50000) return 'high';
    if (magnitude >= 5000) return 'medium';
  }
  return event.closed ? 'closed' : 'active';
}

function normalizeEonetEvent(event) {
  const point = latestPointGeometry(event.geometry);
  if (!point) return null;
  const [lon, lat] = point.coordinates || [];
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lon))) return null;
  const category = event.categories?.[0];
  return {
    id: `eonet-${event.id}`,
    type: category?.id || 'nasa-event',
    title: event.title || 'NASA Earth event',
    lat: Number(lat),
    lon: Number(lon),
    severity: eonetSeverity(event),
    timestamp: safeIso(point.date || event.closed || generatedAt),
    source: 'NASA EONET',
    url: event.sources?.[0]?.url || event.link || 'https://eonet.gsfc.nasa.gov/',
    summary: trimText(event.description || category?.title || 'Open NASA Earth Observatory Natural Event Tracker record.'),
  };
}

function normalizeUsgsFeature(feature) {
  const coordinates = feature.geometry?.coordinates || [];
  const [lon, lat, depthKm] = coordinates;
  const mag = finiteNumber(feature.properties?.mag);
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lon))) return null;
  return {
    id: `usgs-${feature.id}`,
    type: 'earthquake',
    title: feature.properties?.title || 'USGS earthquake',
    lat: Number(lat),
    lon: Number(lon),
    severity: mag >= 6.5 ? 'high' : mag >= 5 ? 'medium' : 'low',
    timestamp: safeIso(feature.properties?.time),
    source: 'USGS Earthquake Hazards Program',
    url: feature.properties?.url || 'https://earthquake.usgs.gov/',
    summary: trimText(`Magnitude ${mag ?? 'n/a'} earthquake at ${feature.properties?.place || 'reported location'}; depth ${finiteNumber(depthKm) ?? 'n/a'} km.`),
    magnitude: mag,
    depthKm: finiteNumber(depthKm),
  };
}

function normalizeGdacsFeature(feature) {
  const coordinates = feature.geometry?.coordinates || [];
  const [lon, lat] = coordinates;
  const props = feature.properties || {};
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lon))) return null;
  const alert = String(props.alertlevel || props.episodealertlevel || 'Green');
  return {
    id: `gdacs-${props.eventtype}-${props.eventid}-${props.episodeid}`,
    type: GDACS_TYPE_LABELS[props.eventtype] || 'disaster',
    title: props.name || props.description || 'GDACS disaster alert',
    lat: Number(lat),
    lon: Number(lon),
    severity: alert.toLowerCase(),
    timestamp: safeIso(props.datemodified || props.fromdate || generatedAt),
    source: 'GDACS',
    url: props.url?.report || 'https://www.gdacs.org/',
    summary: trimText(props.htmldescription || props.description || `${alert} GDACS event in ${props.country || 'reported region'}.`),
    country: props.country || '',
  };
}

function normalizeSatellite(row, group) {
  const meanMotion = finiteNumber(row.MEAN_MOTION);
  return {
    id: `${group.id}-${row.NORAD_CAT_ID || row.OBJECT_ID || row.OBJECT_NAME}`,
    name: row.OBJECT_NAME || `NORAD ${row.NORAD_CAT_ID}`,
    noradId: finiteNumber(row.NORAD_CAT_ID),
    objectId: row.OBJECT_ID || '',
    group: group.label,
    status: group.status,
    epoch: safeIso(row.EPOCH),
    meanMotion,
    eccentricity: finiteNumber(row.ECCENTRICITY) ?? 0,
    inclination: finiteNumber(row.INCLINATION) ?? 0,
    raan: finiteNumber(row.RA_OF_ASC_NODE) ?? 0,
    argumentOfPerigee: finiteNumber(row.ARG_OF_PERICENTER) ?? 0,
    meanAnomaly: finiteNumber(row.MEAN_ANOMALY) ?? 0,
    altitudeKm: satelliteAltitudeKm(meanMotion),
  };
}

function normalizeLaunch(launch) {
  const coordinates = launchSiteCoordinate(launch.location, launch.pad);
  return {
    id: launch.id || launch.slug || launch.name,
    name: launch.name || 'Upcoming launch',
    net: safeIso(launch.net || launch.window_start),
    status: launch.status?.name || launch.status || 'unknown',
    provider: launch.lsp_name || launch.launch_service_provider?.name || 'unknown provider',
    mission: trimText(launch.mission?.description || launch.mission?.name || launch.mission || 'Mission details pending.', 260),
    pad: launch.pad?.name || launch.pad || 'pad pending',
    location: launch.pad?.location?.name || launch.location || 'location pending',
    lat: coordinates?.lat ?? null,
    lon: coordinates?.lon ?? null,
    url: launch.url || 'https://ll.thespacedevs.com/',
    image: launch.image || '',
  };
}

function normalizeNews(article) {
  return {
    id: `news-${article.id || article.url || article.title}`,
    title: article.title || 'Spaceflight news',
    site: article.news_site || 'Spaceflight News API',
    publishedAt: safeIso(article.published_at || article.updated_at),
    url: article.url || 'https://api.spaceflightnewsapi.net/',
    summary: trimText(article.summary || '', 260),
    imageUrl: article.image_url || '',
  };
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

async function writeHomeStats(confirmedExoplanets, sourceGeneratedAt = generatedAt) {
  const safeCount = Number.isFinite(Number(confirmedExoplanets)) && Number(confirmedExoplanets) > 0
    ? Number(confirmedExoplanets)
    : HOME_STATS_FALLBACK.stats.confirmedExoplanets;

  await writeSnapshot('home-stats.json', {
    schemaVersion: 1,
    generatedAt,
    sourceGeneratedAt,
    source: 'NASA Exoplanet Archive TAP confirmed-planet count plus AstroBis labelled scale references',
    exoplanetQuery: 'select count(pl_name) from ps where default_flag = 1',
    stats: {
      confirmedExoplanets: safeCount,
      oortInnerAu: 1000,
      oortOuterAu: 100000,
      universeAgeGyr: 13.8,
      solarSystemPlanets: 8,
    },
    notes: {
      exoplanets: 'Build-time NASA Exoplanet Archive count. The client displays the most recent deployed snapshot, not a live browser query.',
      oortCloud: '1,000 AU and 100,000 AU are NASA scale estimates. The Oort Cloud has not been directly imaged.',
      universeAge: '13.8 billion years is a standard cosmological reference value.',
    },
  });
}

async function fetchExoplanets() {
  // The confirmed-planet count is deliberately drawn from ps/default_flag,
  // matching the Archive's documented confirmed-planet query rather than
  // treating PSCompPars row count as the authoritative total.
  const confirmedCountQuery = 'select count(pl_name) as confirmed_planets from ps where default_flag = 1';
  const systemCountQuery = 'select count(distinct hostname) as planetary_systems from pscomppars';
  const query = [
    `select top ${EXOPLANET_QUERY_LIMIT}`,
    'pl_name,hostname,discoverymethod,disc_facility,disc_year,pl_orbper,pl_rade,pl_bmasse,pl_eqt,pl_insol,pl_orbsmax,pl_orbeccen,pl_orbincl,sy_dist,st_teff,st_rad,st_mass,st_spectype',
    'from pscomppars',
    'where pl_name is not null and hostname is not null',
    'order by sy_dist asc',
  ].join(' ');

  const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(query)}&format=json`;
  const confirmedCountUrl = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(confirmedCountQuery)}&format=json`;
  const systemCountUrl = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(systemCountQuery)}&format=json`;

  try {
    const [data, confirmedCountData, systemCountData] = await Promise.all([
      fetchJson(url, 'NASA Exoplanet Archive PSCompPars'),
      fetchJson(confirmedCountUrl, 'NASA Exoplanet Archive confirmed-planet count'),
      fetchJson(systemCountUrl, 'NASA Exoplanet Archive system count'),
    ]);

    const confirmedRow = Array.isArray(confirmedCountData) ? confirmedCountData[0] : null;
    const systemRow = Array.isArray(systemCountData) ? systemCountData[0] : null;
    const confirmedPlanets = Number(confirmedRow?.confirmed_planets || 0);
    const planetarySystems = Number(systemRow?.planetary_systems || 0);

    await writeSnapshot('exoplanets.json', {
      generatedAt,
      source: 'NASA Exoplanet Archive TAP PSCompPars working catalogue',
      query,
      countQueries: {
        confirmedCountQuery,
        systemCountQuery,
      },
      count: Array.isArray(data) ? data.length : 0,
      meta: {
        confirmedPlanets: confirmedPlanets || HOME_STATS_FALLBACK.stats.confirmedExoplanets,
        planetarySystems: planetarySystems || null,
        queryLimit: EXOPLANET_QUERY_LIMIT,
        archiveTable: 'pscomppars',
      },
      data,
    });

    await writeHomeStats(confirmedPlanets);
  } catch (error) {
    await keepExistingOrWriteFallback('exoplanets.json', {
      generatedAt,
      source: 'offline fallback',
      query,
      count: 0,
      meta: {
        confirmedPlanets: HOME_STATS_FALLBACK.stats.confirmedExoplanets,
        planetarySystems: null,
        queryLimit: EXOPLANET_QUERY_LIMIT,
        archiveTable: 'pscomppars',
      },
      data: [],
    }, error);

    await keepExistingOrWriteFallback('home-stats.json', HOME_STATS_FALLBACK, error);
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

async function loadSource(id, label, url, loader, fallback = []) {
  try {
    const data = await loader(url);
    return {
      data,
      source: sourceRecord(id, label, url, 'live', Array.isArray(data) ? data.length : 0),
    };
  } catch (error) {
    return {
      data: fallback,
      source: sourceRecord(id, label, url, 'fallback', fallback.length, error),
    };
  }
}

async function fetchWorldEonet() {
  const url = 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=90';
  return loadSource('eonet', 'NASA EONET open natural events', url, async (sourceUrl) => {
    const payload = await fetchJson(sourceUrl, 'NASA EONET world events');
    return (payload.events || [])
      .map(normalizeEonetEvent)
      .filter(Boolean)
      .slice(0, 90);
  }, WORLD_OPS_FALLBACK.events.filter((event) => event.id.includes('eonet')));
}

async function fetchWorldUsgs() {
  const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson';
  return loadSource('usgs', 'USGS earthquakes magnitude 2.5+ weekly feed', url, async (sourceUrl) => {
    const payload = await fetchJson(sourceUrl, 'USGS earthquake GeoJSON');
    return (payload.features || [])
      .map(normalizeUsgsFeature)
      .filter(Boolean)
      .sort((a, b) => (b.magnitude || 0) - (a.magnitude || 0))
      .slice(0, 120);
  }, WORLD_OPS_FALLBACK.events.filter((event) => event.id.includes('quake')));
}

async function fetchWorldGdacs() {
  const params = new URLSearchParams({
    eventlist: 'EQ,TC,FL,VO',
    fromdate: daysAgoISO(45),
    todate: todayISO(),
  });
  const url = `https://www.gdacs.org/gdacsapi/api/events/geteventlist/MAP?${params.toString()}`;
  return loadSource('gdacs', 'GDACS current disaster alerts', url, async (sourceUrl) => {
    const payload = await fetchJson(sourceUrl, 'GDACS disaster events');
    return (payload.features || [])
      .map(normalizeGdacsFeature)
      .filter(Boolean)
      .slice(0, 160);
  }, []);
}

async function fetchWorldSatellites() {
  const satellites = [];
  const sources = [];

  for (const group of CELESTRAK_WORLD_GROUPS) {
    const url = `https://celestrak.org/NORAD/elements/gp.php?GROUP=${group.id}&FORMAT=json`;
    try {
      const payload = await fetchJson(url, `CelesTrak ${group.id}`);
      const rows = sampleEvenly(payload, group.limit)
        .map((row) => normalizeSatellite(row, group))
        .filter((satellite) => satellite.name && satellite.meanMotion);
      satellites.push(...rows);
      sources.push(sourceRecord(`celestrak-${group.id}`, `CelesTrak ${group.label}`, url, 'live', rows.length));
    } catch (error) {
      sources.push(sourceRecord(`celestrak-${group.id}`, `CelesTrak ${group.label}`, url, 'fallback', 0, error));
    }
  }

  if (!satellites.length) satellites.push(...WORLD_OPS_FALLBACK.satellites);
  return { data: satellites, sources };
}

async function fetchWorldLaunches() {
  const url = 'https://ll.thespacedevs.com/2.0.0/launch/upcoming/?limit=36&mode=list';
  return loadSource('launch-library', 'The Space Devs Launch Library 2', url, async (sourceUrl) => {
    const payload = await fetchJson(sourceUrl, 'Launch Library 2 upcoming launches');
    return (payload.results || [])
      .map(normalizeLaunch)
      .filter((launch) => launch.name)
      .slice(0, 36);
  }, WORLD_OPS_FALLBACK.launches);
}

async function fetchWorldNews() {
  const url = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=24';
  return loadSource('spaceflight-news', 'Spaceflight News API', url, async (sourceUrl) => {
    const payload = await fetchJson(sourceUrl, 'Spaceflight News API articles');
    return (payload.results || [])
      .map(normalizeNews)
      .filter((article) => article.title)
      .slice(0, 24);
  }, WORLD_OPS_FALLBACK.news);
}

async function fetchWorldOps() {
  try {
    const [eonet, usgs, gdacs, satelliteBundle, launches, news] = await Promise.all([
      fetchWorldEonet(),
      fetchWorldUsgs(),
      fetchWorldGdacs(),
      fetchWorldSatellites(),
      fetchWorldLaunches(),
      fetchWorldNews(),
    ]);

    const events = [...eonet.data, ...usgs.data, ...gdacs.data]
      .filter((event) => Number.isFinite(event.lat) && Number.isFinite(event.lon))
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
    const satellites = satelliteBundle.data;

    await writeSnapshot('world-ops.json', {
      schemaVersion: 1,
      generatedAt,
      sources: [
        eonet.source,
        usgs.source,
        gdacs.source,
        ...satelliteBundle.sources,
        launches.source,
        news.source,
      ],
      events,
      satellites,
      launches: launches.data,
      news: news.data,
      totals: {
        events: events.length,
        satellites: satellites.length,
        debris: satellites.filter((satellite) => satellite.status === 'debris').length,
        launches: launches.data.length,
        news: news.data.length,
        nasaEvents: eonet.data.length,
        earthquakes: usgs.data.length,
        disasters: gdacs.data.length,
      },
      notes: {
        scope: 'AstroBis EarthOps is space-first: orbital infrastructure, launches, Earth hazards, and spaceflight context. It is not a broad conflict or political OSINT clone.',
        liveRefresh: 'Browser live refresh is limited to CORS-friendly public feeds. Launches and space-news articles use the latest deployed build snapshot.',
      },
    });
  } catch (error) {
    await keepExistingOrWriteFallback('world-ops.json', WORLD_OPS_FALLBACK, error);
  }
}

await Promise.all([
  fetchExoplanets(),
  fetchNeoApproaches(),
  fetchIssTle(),
  fetchInterstellarVisitors(),
  fetchBrightStarCatalogue(),
  fetchWorldOps(),
]);
