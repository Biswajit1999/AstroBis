import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Html, Line, OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import {
  Activity,
  AlertTriangle,
  Cloud,
  Crosshair,
  Eye,
  Flame,
  Globe2,
  Layers,
  Map,
  Newspaper,
  Orbit,
  Radio,
  RefreshCw,
  Rocket,
  Satellite,
  Waves,
  Zap,
} from 'lucide-react';
import * as THREE from 'three';

const EARTH_RADIUS_KM = 6371;
const BASE_PATH = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const LOCAL_WORLD_URL = `${BASE_PATH}data/world-ops.json`;
const INITIAL_RENDER_DATE = new Date('2026-01-01T00:00:00.000Z');

const EARTH_TEXTURES = {
  day: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
  normal: 'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
  specular: 'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg',
  lights: 'https://threejs.org/examples/textures/planets/earth_lights_2048.png',
  clouds: 'https://threejs.org/examples/textures/planets/earth_clouds_1024.png',
};

const FALLBACK_WORLD = {
  schemaVersion: 1,
  generatedAt: '2026-01-01T00:00:00.000Z',
  sources: [{ id: 'fallback', label: 'Bundled AstroBis fallback', status: 'fallback', count: 4 }],
  events: [
    {
      id: 'fallback-earth-event',
      type: 'nasa-event',
      title: 'EarthOps snapshot unavailable',
      lat: 28.5729,
      lon: -80.649,
      severity: 'reference',
      timestamp: '2026-01-01T00:00:00.000Z',
      source: 'offline fallback',
      url: 'https://eonet.gsfc.nasa.gov/',
      summary: 'Fallback marker used when the build-time EarthOps snapshot cannot be loaded.',
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
      epoch: '2026-01-01T00:00:00.000Z',
      meanMotion: 15.49,
      eccentricity: 0.0007,
      inclination: 51.64,
      raan: 0,
      argumentOfPerigee: 0,
      meanAnomaly: 0,
      altitudeKm: 420,
    },
  ],
  launches: [],
  news: [],
  media: [
    {
      id: 'nasa-live',
      type: 'live-directory',
      title: 'NASA Live and NASA+',
      provider: 'NASA',
      status: 'official public programming',
      url: 'https://www.nasa.gov/live/',
      embedUrl: '',
      summary: 'Official NASA live programming, launch coverage, mission events, and NASA+ viewing links.',
    },
    {
      id: 'iss-live-video',
      type: 'video',
      title: 'ISS Live Video',
      provider: 'NASA / YouTube',
      status: 'official public stream',
      url: 'https://www.youtube.com/watch?v=M3HKLzjvKPc',
      embedUrl: 'https://www.youtube-nocookie.com/embed/M3HKLzjvKPc?rel=0&modestbranding=1',
      summary: 'Public live video stream associated with the International Space Station.',
    },
  ],
  spaceWeather: {
    observedAt: '2026-01-01T00:00:00.000Z',
    kp: null,
    label: 'NOAA SWPC unavailable',
    status: 'fallback',
    summary: 'Space-weather context is unavailable in the offline fallback snapshot.',
    samples: [],
  },
  opsBrief: {
    id: 'fallback-earthops-brief',
    label: 'AstroBis AI signal core',
    generatedAt: '2026-01-01T00:00:00.000Z',
    mode: 'local deterministic synthesis',
    confidence: 42,
    headline: 'EarthOps is running on a safe offline reference snapshot.',
    watch: [
      { label: 'Public feeds', value: 'fallback', tone: '#fbbf24', summary: 'Live source data was unavailable during the build.' },
    ],
    bullets: [
      'Fallback markers are displayed until the next successful public-feed refresh.',
      'Launch, news, orbital, hazard, and media layers keep source badges and uncertainty labels visible.',
    ],
    sourceHealth: { live: 0, fallback: 1, total: 1 },
  },
  totals: { events: 1, satellites: 1, debris: 0, launches: 0, news: 0, media: 2, spaceWeather: 0 },
};

const GDACS_TYPE_LABELS = {
  EQ: 'earthquake',
  TC: 'cyclone',
  FL: 'flood',
  VO: 'volcano',
};

const LAYER_CONFIG = [
  { key: 'satellites', label: 'Satellites', icon: Satellite, color: '#67e8f9' },
  { key: 'debris', label: 'Debris', icon: AlertTriangle, color: '#fb7185' },
  { key: 'launches', label: 'Launches', icon: Rocket, color: '#fbbf24' },
  { key: 'nasaEvents', label: 'NASA Events', icon: Flame, color: '#fb923c' },
  { key: 'earthquakes', label: 'Earthquakes', icon: Activity, color: '#f472b6' },
  { key: 'disasters', label: 'Disasters', icon: Waves, color: '#a78bfa' },
  { key: 'news', label: 'Space News', icon: Newspaper, color: '#93c5fd' },
  { key: 'clouds', label: 'Clouds', icon: Cloud, color: '#e0f2fe' },
  { key: 'cityLights', label: 'City Lights', icon: Eye, color: '#fde68a' },
  { key: 'orbitTrails', label: 'Orbit Trails', icon: Orbit, color: '#22c55e' },
  { key: 'miniMap', label: '2D Mini Map', icon: Map, color: '#38bdf8' },
];

const DEFAULT_LAYERS = Object.fromEntries(LAYER_CONFIG.map((layer) => [layer.key, true]));

const VIEW_MODES = [
  { key: 'globe', label: '3D Globe', icon: Globe2 },
  { key: 'map', label: '2D Ops Map', icon: Map },
  { key: 'shell', label: 'Orbit Shell', icon: Orbit },
];

const EVENT_COLORS = {
  wildfires: '#fb923c',
  volcanoes: '#f97316',
  severeStorms: '#60a5fa',
  seaLakeIce: '#93c5fd',
  dustHaze: '#fbbf24',
  floods: '#38bdf8',
  landslides: '#c084fc',
  manmade: '#f472b6',
  earthquake: '#f472b6',
  cyclone: '#a78bfa',
  flood: '#38bdf8',
  volcano: '#f97316',
  disaster: '#a78bfa',
  'nasa-event': '#fb923c',
};

const SATELLITE_COLORS = {
  station: '#86efac',
  satellite: '#67e8f9',
  'recent-object': '#fbbf24',
  debris: '#fb7185',
};

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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeLon(lon) {
  return ((lon + 540) % 360) - 180;
}

function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function safeIso(value) {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 1000000000) return new Date(numeric).toISOString();
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : new Date().toISOString();
}

function trimText(value, maxLength = 220) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}...`;
}

function latLonVector(lat, lon, radius = 1) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function projectLatLon(lat, lon) {
  return {
    x: ((normalizeLon(lon) + 180) / 360) * 100,
    y: ((90 - clamp(lat, -89.9, 89.9)) / 180) * 100,
  };
}

function vectorToLatLon(vector) {
  const radius = vector.length() || 1;
  return {
    lat: Math.asin(clamp(vector.y / radius, -1, 1)) * 180 / Math.PI,
    lon: normalizeLon(Math.atan2(vector.z, -vector.x) * 180 / Math.PI - 180),
  };
}

function satelliteGeoPoint(satellite, now = Date.now()) {
  if (!satellite?.meanMotion) return null;
  return vectorToLatLon(satelliteVector(satellite, now));
}

function subsolarPoint(date = INITIAL_RENDER_DATE) {
  const dayOfYear = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - Date.UTC(date.getUTCFullYear(), 0, 0)) / 86400000);
  const declination = 23.44 * Math.sin(((360 / 365) * (dayOfYear - 81)) * Math.PI / 180);
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  return {
    latitude: declination,
    longitude: normalizeLon((12 - utcHours) * 15),
  };
}

function terminatorPath(subsolar) {
  if (!subsolar) return '';
  const declination = subsolar.latitude * Math.PI / 180;
  const points = [];
  for (let lon = -180; lon <= 180; lon += 4) {
    const h = (lon - subsolar.longitude) * Math.PI / 180;
    const denominator = Math.sin(declination);
    const lat = Math.abs(denominator) < 0.03
      ? (Math.cos(h) > 0 ? -89 : 89)
      : Math.atan(-Math.cos(declination) * Math.cos(h) / denominator) * 180 / Math.PI;
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - Math.max(-89, Math.min(89, lat))) / 180) * 100;
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M ${points.join(' L ')}`;
}

function formatDate(value, options = {}) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'date pending';
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}

function relativeTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'time pending';
  const diff = date.getTime() - Date.now();
  const abs = Math.abs(diff);
  if (abs < 3600000) return `${Math.round(diff / 60000)} min`;
  if (abs < 86400000) return `${Math.round(diff / 3600000)} hr`;
  return `${Math.round(diff / 86400000)} days`;
}

function statusColor(value) {
  const text = String(value || '').toLowerCase();
  if (text.includes('red') || text.includes('high')) return '#fb7185';
  if (text.includes('orange') || text.includes('medium')) return '#fbbf24';
  if (text.includes('green') || text.includes('low') || text.includes('active')) return '#86efac';
  return '#93c5fd';
}

function itemColor(kind, item) {
  if (kind === 'launch') return '#fbbf24';
  if (kind === 'satellite') return SATELLITE_COLORS[item.status] || '#67e8f9';
  if (kind === 'news') return '#93c5fd';
  return EVENT_COLORS[item.type] || '#a78bfa';
}

function selectionId(selection) {
  return selection ? `${selection.kind}:${selection.item.id || selection.item.title || selection.item.name}` : '';
}

function severityRank(event) {
  const value = String(event?.severity || '').toLowerCase();
  if (['red', 'high', 'major', 'critical'].includes(value)) return 3;
  if (['orange', 'medium', 'moderate', 'active'].includes(value)) return 2;
  if (['yellow', 'low', 'green', 'minor'].includes(value)) return 1;
  return 0;
}

function countRecent(rows, field, hours) {
  const now = Date.now();
  const span = hours * 3600000;
  return rows.filter((row) => {
    const time = Date.parse(row?.[field]);
    return Number.isFinite(time) && now - time >= 0 && now - time <= span;
  }).length;
}

function buildDisplayBrief(payload, visibleEvents, visibleSatellites, visibleLaunches) {
  if (payload.opsBrief?.watch?.length) return payload.opsBrief;

  const news = payload.news || [];
  const media = payload.media || [];
  const kp = finiteNumber(payload.spaceWeather?.kp);
  const activeEvents = visibleEvents.filter((event) => severityRank(event) >= 2).length;
  const highEvents = visibleEvents.filter((event) => severityRank(event) >= 3).length;
  const debris = visibleSatellites.filter((satellite) => satellite.status === 'debris').length;
  const nextLaunches7d = visibleLaunches.filter((launch) => {
    const net = Date.parse(launch.net);
    return Number.isFinite(net) && net >= Date.now() && net <= Date.now() + 7 * 86400000;
  }).length;
  const recentNews = countRecent(news, 'publishedAt', 24);
  return {
    id: 'earthops-client-brief',
    label: 'AstroBis AI signal core',
    generatedAt: payload.generatedAt,
    mode: 'client synthesis over loaded public snapshot',
    confidence: 58,
    headline: `${visibleEvents.length.toLocaleString()} visible Earth signals and ${visibleSatellites.length.toLocaleString()} orbital objects are active in the current layer stack.`,
    watch: [
      { label: 'Hazard load', value: `${activeEvents} active`, tone: highEvents ? '#fb7185' : '#fbbf24', summary: highEvents ? `${highEvents} high-severity items visible.` : 'No high-severity visible item dominates.' },
      { label: 'Orbit traffic', value: `${visibleSatellites.length.toLocaleString()} tracked`, tone: '#67e8f9', summary: `${debris.toLocaleString()} debris objects are visible with the current filters.` },
      { label: 'Launch tempo', value: `${nextLaunches7d} in 7d`, tone: '#fbbf24', summary: `${visibleLaunches.length.toLocaleString()} launch cards are loaded.` },
      { label: 'Space weather', value: kp === null ? 'Kp n/a' : `Kp ${kp.toFixed(1)}`, tone: kp !== null && kp >= 5 ? '#fb7185' : '#86efac', summary: payload.spaceWeather?.summary || 'NOAA Kp context is unavailable.' },
      { label: 'News velocity', value: `${recentNews} recent`, tone: '#93c5fd', summary: `${news.length.toLocaleString()} public news items are loaded.` },
      { label: 'Media ops', value: `${media.length} sources`, tone: '#c4b5fd', summary: 'Public video, imagery, and mission-source links are available.' },
    ],
    bullets: [
      'This client brief is computed locally from loaded public data.',
      'Uncertainty labels remain visible because public feeds are not official impact predictions.',
    ],
    sourceHealth: { live: 0, fallback: 0, total: payload.sources?.length || 0 },
  };
}

function latestPointGeometry(geometry = []) {
  return [...geometry].reverse().find((item) => item?.type === 'Point' && Array.isArray(item.coordinates));
}

function launchSiteCoordinate(location = '', pad = '') {
  const text = `${pad} ${location}`;
  return LAUNCH_SITE_COORDINATES.find((site) => site.match.test(text)) || null;
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
    severity: event.closed ? 'closed' : 'active',
    timestamp: safeIso(point.date || event.closed || Date.now()),
    source: 'NASA EONET live refresh',
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
    source: 'USGS live refresh',
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
  return {
    id: `gdacs-${props.eventtype}-${props.eventid}-${props.episodeid}`,
    type: GDACS_TYPE_LABELS[props.eventtype] || 'disaster',
    title: props.name || props.description || 'GDACS disaster alert',
    lat: Number(lat),
    lon: Number(lon),
    severity: String(props.alertlevel || props.episodealertlevel || 'Green').toLowerCase(),
    timestamp: safeIso(props.datemodified || props.fromdate || Date.now()),
    source: 'GDACS live refresh',
    url: props.url?.report || 'https://www.gdacs.org/',
    summary: trimText(props.htmldescription || props.description || 'GDACS public disaster alert record.'),
    country: props.country || '',
  };
}

function satelliteAltitudeKm(meanMotion) {
  const motion = finiteNumber(meanMotion);
  if (!motion || motion <= 0) return null;
  const mu = 398600.4418;
  const radiansPerSecond = motion * 2 * Math.PI / 86400;
  const semiMajorKm = Math.cbrt(mu / (radiansPerSecond ** 2));
  return semiMajorKm - EARTH_RADIUS_KM;
}

function normalizeCelesTrak(row, group) {
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

function radiusForOrbit(satellite) {
  const altitude = satellite.altitudeKm ?? satelliteAltitudeKm(satellite.meanMotion) ?? 550;
  return clamp(1 + altitude / EARTH_RADIUS_KM, 1.025, 7.2);
}

function rotateOrbitalVector(x, y, inclinationDeg, raanDeg, argPerigeeDeg) {
  const i = inclinationDeg * Math.PI / 180;
  const omega = raanDeg * Math.PI / 180;
  const w = argPerigeeDeg * Math.PI / 180;
  const cosO = Math.cos(omega);
  const sinO = Math.sin(omega);
  const cosI = Math.cos(i);
  const sinI = Math.sin(i);
  const cosW = Math.cos(w);
  const sinW = Math.sin(w);

  const x1 = x * cosW - y * sinW;
  const y1 = x * sinW + y * cosW;

  return new THREE.Vector3(
    x1 * cosO - y1 * cosI * sinO,
    y1 * sinI,
    x1 * sinO + y1 * cosI * cosO,
  );
}

function satelliteVector(satellite, now = Date.now()) {
  const radius = radiusForOrbit(satellite);
  const epochMs = Date.parse(satellite.epoch || '');
  const days = Number.isFinite(epochMs) ? (now - epochMs) / 86400000 : 0;
  const meanMotion = finiteNumber(satellite.meanMotion) ?? 1;
  const meanAnomaly = ((finiteNumber(satellite.meanAnomaly) ?? 0) * Math.PI / 180) + days * meanMotion * 2 * Math.PI;
  const eccentricity = clamp(finiteNumber(satellite.eccentricity) ?? 0, 0, 0.25);
  const radial = radius * (1 - eccentricity * Math.cos(meanAnomaly));
  return rotateOrbitalVector(
    Math.cos(meanAnomaly) * radial,
    Math.sin(meanAnomaly) * radial,
    finiteNumber(satellite.inclination) ?? 0,
    finiteNumber(satellite.raan) ?? 0,
    finiteNumber(satellite.argumentOfPerigee) ?? 0,
  );
}

function orbitPath(satellite, samples = 180) {
  const radius = radiusForOrbit(satellite);
  const eccentricity = clamp(finiteNumber(satellite.eccentricity) ?? 0, 0, 0.2);
  const points = [];
  for (let index = 0; index <= samples; index += 1) {
    const angle = (index / samples) * Math.PI * 2;
    const radial = radius * (1 - eccentricity * Math.cos(angle));
    points.push(rotateOrbitalVector(
      Math.cos(angle) * radial,
      Math.sin(angle) * radial,
      finiteNumber(satellite.inclination) ?? 0,
      finiteNumber(satellite.raan) ?? 0,
      finiteNumber(satellite.argumentOfPerigee) ?? 0,
    ));
  }
  return points;
}

function eventIsVisible(event, layers) {
  if (event.source?.includes('NASA') || ['wildfires', 'volcanoes', 'severeStorms', 'seaLakeIce', 'dustHaze', 'nasa-event'].includes(event.type)) {
    return layers.nasaEvents;
  }
  if (event.type === 'earthquake' && event.source?.includes('USGS')) return layers.earthquakes;
  return layers.disasters;
}

function sampleEvenly(rows, limit) {
  if (!Array.isArray(rows) || rows.length <= limit) return rows || [];
  const step = Math.max(1, Math.ceil(rows.length / limit));
  return rows.filter((_, index) => index % step === 0).slice(0, limit);
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, { cache: 'no-store', signal: controller.signal, headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function refreshLiveLayers() {
  const [eonet, usgs, gdacs, stations, recent] = await Promise.allSettled([
    fetchJson('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=90'),
    fetchJson('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson'),
    fetchJson(`https://www.gdacs.org/gdacsapi/api/events/geteventlist/MAP?eventlist=EQ%2CTC%2CFL%2CVO&fromdate=${new Date(Date.now() - 45 * 86400000).toISOString().slice(0, 10)}&todate=${new Date().toISOString().slice(0, 10)}`),
    fetchJson('https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json'),
    fetchJson('https://celestrak.org/NORAD/elements/gp.php?GROUP=last-30-days&FORMAT=json'),
  ]);

  const events = [
    ...(eonet.status === 'fulfilled' ? (eonet.value.events || []).map(normalizeEonetEvent) : []),
    ...(usgs.status === 'fulfilled' ? (usgs.value.features || []).map(normalizeUsgsFeature).sort((a, b) => (b?.magnitude || 0) - (a?.magnitude || 0)).slice(0, 120) : []),
    ...(gdacs.status === 'fulfilled' ? (gdacs.value.features || []).map(normalizeGdacsFeature).slice(0, 160) : []),
  ].filter(Boolean);

  const satellites = [
    ...(stations.status === 'fulfilled' ? stations.value.map((row) => normalizeCelesTrak(row, { id: 'stations', label: 'Space stations', status: 'station' })) : []),
    ...(recent.status === 'fulfilled' ? sampleEvenly(recent.value, 80).map((row) => normalizeCelesTrak(row, { id: 'last-30-days', label: 'Recent launches', status: 'recent-object' })) : []),
  ].filter((satellite) => satellite.name && satellite.meanMotion);

  return {
    events,
    satellites,
    statuses: { eonet: eonet.status, usgs: usgs.status, gdacs: gdacs.status, stations: stations.status, recent: recent.status },
  };
}

function OpsProjectionMap({ events, launches, satellites, layers, selected, onSelect }) {
  const subsolar = subsolarPoint(new Date());
  const satellitePoints = useMemo(() => {
    const visible = satellites
      .filter((satellite) => satellite.status === 'debris' ? layers.debris : layers.satellites)
      .slice(0, 620);
    const now = Date.now();
    return visible
      .map((satellite) => {
        const point = satelliteGeoPoint(satellite, now);
        if (!point) return null;
        return { satellite, ...projectLatLon(point.lat, point.lon) };
      })
      .filter(Boolean);
  }, [satellites, layers.debris, layers.satellites]);
  const eventPoints = events.slice(0, 260).map((event) => ({ event, ...projectLatLon(event.lat, event.lon) }));
  const launchPoints = launches
    .filter((launch) => Number.isFinite(launch.lat) && Number.isFinite(launch.lon))
    .slice(0, 48)
    .map((launch) => ({ launch, ...projectLatLon(launch.lat, launch.lon) }));

  return (
    <div className="worldops-projection-map">
      <div className="worldops-projection-bg" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {[-120, -60, 0, 60, 120].map((lon) => {
          const x = projectLatLon(0, lon).x;
          return <line key={`lon-${lon}`} x1={x} y1="0" x2={x} y2="100" />;
        })}
        {[-60, -30, 0, 30, 60].map((lat) => {
          const y = projectLatLon(lat, 0).y;
          return <line key={`lat-${lat}`} x1="0" y1={y} x2="100" y2={y} />;
        })}
        <path d={terminatorPath(subsolar)} className="terminator" />
      </svg>

      {satellitePoints.map(({ satellite, x, y }) => (
        <button
          key={satellite.id}
          type="button"
          className={`worldops-projection-dot orbital ${satellite.status === 'debris' ? 'debris' : ''} ${selectionId(selected) === selectionId({ kind: 'satellite', item: satellite }) ? 'is-active' : ''}`}
          style={{ left: `${x}%`, top: `${y}%`, '--dot-color': itemColor('satellite', satellite) }}
          onClick={() => onSelect({ kind: 'satellite', item: satellite })}
          title={satellite.name}
        />
      ))}

      {eventPoints.map(({ event, x, y }) => (
        <button
          key={event.id}
          type="button"
          className={`worldops-projection-dot event ${selectionId(selected) === selectionId({ kind: 'event', item: event }) ? 'is-active' : ''}`}
          style={{ left: `${x}%`, top: `${y}%`, '--dot-color': itemColor('event', event) }}
          onClick={() => onSelect({ kind: 'event', item: event })}
          title={event.title}
        />
      ))}

      {launchPoints.map(({ launch, x, y }) => (
        <button
          key={launch.id}
          type="button"
          className={`worldops-projection-dot launch ${selectionId(selected) === selectionId({ kind: 'launch', item: launch }) ? 'is-active' : ''}`}
          style={{ left: `${x}%`, top: `${y}%`, '--dot-color': itemColor('launch', launch) }}
          onClick={() => onSelect({ kind: 'launch', item: launch })}
          title={launch.name}
        />
      ))}

      <div className="worldops-map-legend">
        <span><i style={{ '--dot-color': '#67e8f9' }} /> satellites</span>
        <span><i style={{ '--dot-color': '#fb7185' }} /> debris</span>
        <span><i style={{ '--dot-color': '#fb923c' }} /> events</span>
        <span><i style={{ '--dot-color': '#fbbf24' }} /> launches</span>
      </div>
    </div>
  );
}

function NightLightsLayer({ texture, sunDirection }) {
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      lightsMap: { value: texture },
      sunDirection: { value: sunDirection },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormalWorld;
      void main() {
        vUv = uv;
        vNormalWorld = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D lightsMap;
      uniform vec3 sunDirection;
      varying vec2 vUv;
      varying vec3 vNormalWorld;
      void main() {
        float daylight = dot(normalize(vNormalWorld), normalize(sunDirection));
        float night = smoothstep(0.20, -0.18, daylight);
        vec3 lights = texture2D(lightsMap, vUv).rgb;
        gl_FragColor = vec4(lights * night * 1.65, night * 0.72);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [texture]);

  useFrame(() => {
    if (material.uniforms.sunDirection) material.uniforms.sunDirection.value = sunDirection;
  });

  useEffect(() => {
    material.uniforms.lightsMap.value = texture;
  }, [material, texture]);

  return (
    <mesh>
      <sphereGeometry args={[1.006, 128, 128]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function AtmosphereShell() {
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { glowColor: { value: new THREE.Color('#67e8f9') } },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      varying vec3 vNormal;
      void main() {
        float rim = pow(0.76 - abs(vNormal.z), 2.35);
        gl_FragColor = vec4(glowColor, clamp(rim, 0.0, 0.2));
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  return (
    <mesh>
      <sphereGeometry args={[1.058, 96, 96]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function EarthGlobe({ layers, markerCount, shellMode = false }) {
  const [earthDay, earthNormal, earthSpecular, earthLights, earthClouds] = useLoader(THREE.TextureLoader, [
    EARTH_TEXTURES.day,
    EARTH_TEXTURES.normal,
    EARTH_TEXTURES.specular,
    EARTH_TEXTURES.lights,
    EARTH_TEXTURES.clouds,
  ]);
  const clouds = useRef();
  const subsolar = useMemo(() => subsolarPoint(new Date()), [markerCount]);
  const sunVector = useMemo(() => latLonVector(subsolar.latitude, subsolar.longitude, 7.1), [subsolar.latitude, subsolar.longitude]);
  const sunDirection = useMemo(() => sunVector.clone().normalize(), [sunVector]);

  useMemo(() => {
    [earthDay, earthLights, earthClouds].forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
    });
    earthNormal.anisotropy = 8;
    earthSpecular.anisotropy = 8;
  }, [earthDay, earthNormal, earthSpecular, earthLights, earthClouds]);

  useFrame(({ clock }) => {
    if (clouds.current) clouds.current.rotation.y = clock.getElapsedTime() * 0.006;
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, 128, 128]} />
        <meshPhongMaterial
          map={earthDay}
          normalMap={earthNormal}
          normalScale={new THREE.Vector2(0.36, 0.36)}
          specularMap={earthSpecular}
          specular={new THREE.Color('#315982')}
          shininess={20}
          transparent={shellMode}
          opacity={shellMode ? 0.36 : 1}
        />
      </mesh>
      {layers.cityLights && !shellMode && <NightLightsLayer texture={earthLights} sunDirection={sunDirection} />}
      {layers.clouds && (
        <mesh ref={clouds}>
          <sphereGeometry args={[1.013, 128, 128]} />
          <meshLambertMaterial map={earthClouds} transparent opacity={shellMode ? 0.12 : 0.34} depthWrite={false} />
        </mesh>
      )}
      <AtmosphereShell />
      <ambientLight intensity={0.12} color="#7dd3fc" />
      <directionalLight position={sunVector.toArray()} color="#fff7ed" intensity={3.5} />
      <pointLight position={sunVector.toArray()} color="#facc15" intensity={2.2} distance={14} />
    </group>
  );
}

function SurfaceMarker({ item, kind, selected, onSelect }) {
  if (!Number.isFinite(item.lat) || !Number.isFinite(item.lon)) return null;
  const active = selectionId(selected) === selectionId({ kind, item });
  const color = itemColor(kind, item);
  const position = latLonVector(item.lat, item.lon, kind === 'launch' ? 1.055 : 1.035);
  const size = kind === 'launch' ? 0.017 : active ? 0.019 : 0.011;

  return (
    <group position={position} onClick={(event) => { event.stopPropagation(); onSelect({ kind, item }); }}>
      <mesh>
        <sphereGeometry args={[size, 18, 18]} />
        <meshBasicMaterial color={color} transparent opacity={0.96} />
      </mesh>
      <mesh>
        <ringGeometry args={[size * 1.8, size * 3.4, 32]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.72 : 0.26} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {active && (
        <Html center distanceFactor={5.4}>
          <div className="worldops-space-label">
            <span>{kind === 'launch' ? 'Launch site' : item.source}</span>
            <strong>{item.title || item.name}</strong>
          </div>
        </Html>
      )}
    </group>
  );
}

function OrbitBands({ selected }) {
  const bands = [
    { label: 'LEO', radius: 1.08, color: '#67e8f9' },
    { label: 'MEO', radius: 3.05, color: '#a78bfa' },
    { label: 'GEO', radius: 6.61, color: '#fbbf24' },
  ];

  return (
    <>
      {bands.map((band) => {
        const points = [];
        for (let i = 0; i <= 192; i += 1) {
          const angle = (i / 192) * Math.PI * 2;
          points.push(new THREE.Vector3(Math.cos(angle) * band.radius, 0, Math.sin(angle) * band.radius));
        }
        return <Line key={band.label} points={points} color={band.color} transparent opacity={band.label === 'GEO' ? 0.2 : 0.16} lineWidth={0.65} />;
      })}
      {selected?.kind === 'satellite' && (
        <Line points={orbitPath(selected.item)} color={itemColor('satellite', selected.item)} transparent opacity={0.62} lineWidth={1.2} />
      )}
    </>
  );
}

function SatelliteField({ satellites, layers, mode = 'globe' }) {
  const geometryRef = useRef();
  const lastUpdate = useRef(0);
  const visible = useMemo(() => satellites.filter((satellite) => (
    satellite.status === 'debris' ? layers.debris : layers.satellites
  )).slice(0, 760), [satellites, layers.debris, layers.satellites]);

  const buffers = useMemo(() => {
    const positions = new Float32Array(Math.max(visible.length, 1) * 3);
    const colors = new Float32Array(Math.max(visible.length, 1) * 3);
    visible.forEach((satellite, index) => {
      const color = new THREE.Color(SATELLITE_COLORS[satellite.status] || '#67e8f9');
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
      const point = satelliteVector(satellite);
      positions[index * 3] = point.x;
      positions[index * 3 + 1] = point.y;
      positions[index * 3 + 2] = point.z;
    });
    return { positions, colors };
  }, [visible]);

  useFrame(({ clock }) => {
    if (!geometryRef.current || clock.elapsedTime - lastUpdate.current < 0.75) return;
    lastUpdate.current = clock.elapsedTime;
    const now = Date.now();
    const position = geometryRef.current.attributes.position;
    visible.forEach((satellite, index) => {
      const point = satelliteVector(satellite, now);
      position.array[index * 3] = point.x;
      position.array[index * 3 + 1] = point.y;
      position.array[index * 3 + 2] = point.z;
    });
    position.needsUpdate = true;
  });

  if (!visible.length) return null;
  return (
    <points key={`satellite-cloud-${visible.length}`}>
      <bufferGeometry ref={geometryRef} key={`satellite-geometry-${visible.length}`}>
        <bufferAttribute attach="attributes-position" array={buffers.positions} count={visible.length} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={buffers.colors} count={visible.length} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial vertexColors size={mode === 'shell' ? 0.028 : 0.019} transparent opacity={mode === 'shell' ? 0.9 : 0.74} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function SelectedSatelliteMarker({ selected, onSelect }) {
  if (selected?.kind !== 'satellite') return null;
  const satellite = selected.item;
  const position = satelliteVector(satellite);
  const color = itemColor('satellite', satellite);
  return (
    <group position={position} onClick={(event) => { event.stopPropagation(); onSelect(selected); }}>
      <mesh>
        <sphereGeometry args={[0.035, 24, 24]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.075, 24, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <Html center distanceFactor={5.2}>
        <div className="worldops-space-label">
          <span>{satellite.group}</span>
          <strong>{satellite.name}</strong>
        </div>
      </Html>
    </group>
  );
}

function WorldScene({ events, launches, satellites, layers, selected, onSelect, mode = 'globe' }) {
  const launchMarkers = launches.filter((launch) => Number.isFinite(launch.lat) && Number.isFinite(launch.lon));
  const markerCount = events.length + launchMarkers.length + satellites.length;
  return (
    <>
      <color attach="background" args={['#01030b']} />
      <Stars radius={220} depth={90} count={9000} factor={3.1} saturation={0.18} fade speed={0.08} />
      <EarthGlobe layers={layers} markerCount={markerCount} shellMode={mode === 'shell'} />
      {layers.orbitTrails && <OrbitBands selected={selected} />}
      <SatelliteField satellites={satellites} layers={layers} mode={mode} />
      <SelectedSatelliteMarker selected={selected} onSelect={onSelect} />
      {events.map((event) => <SurfaceMarker key={event.id} item={event} kind="event" selected={selected} onSelect={onSelect} />)}
      {layers.launches && launchMarkers.map((launch) => <SurfaceMarker key={launch.id} item={launch} kind="launch" selected={selected} onSelect={onSelect} />)}
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.82} intensity={1.15} radius={0.62} />
      </EffectComposer>
      <OrbitControls enableDamping dampingFactor={0.06} minDistance={1.25} maxDistance={8.7} />
    </>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div className="worldops-stat-pill" style={{ '--accent': color }}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function LayerButton({ layer, enabled, onToggle }) {
  const Icon = layer.icon;
  return (
    <button
      type="button"
      className="worldops-layer-button"
      onClick={onToggle}
      aria-pressed={enabled}
      style={{ '--layer-color': layer.color }}
      title={layer.label}
    >
      <Icon size={15} strokeWidth={2.2} />
      <span>{layer.label}</span>
      <i aria-hidden="true" />
    </button>
  );
}

function ViewModeButton({ mode, active, onSelect }) {
  const Icon = mode.icon;
  return (
    <button
      type="button"
      className="worldops-mode-button"
      data-active={active ? 'true' : 'false'}
      onClick={() => onSelect(mode.key)}
      title={mode.label}
    >
      <Icon size={15} strokeWidth={2.2} />
      <span>{mode.label}</span>
    </button>
  );
}

function MissionPanel({ payload, layers, setLayers, refreshing, onRefresh, liveStatus, visibleCounts, onSelect, satellites, events, launches, selected, viewMode, setViewMode }) {
  const prioritySatellites = satellites
    .filter((satellite) => satellite.status === 'station' || satellite.status === 'recent-object')
    .slice(0, 8);
  const kp = finiteNumber(payload.spaceWeather?.kp);

  return (
    <aside className="worldops-panel worldops-left">
      <div className="worldops-kicker"><Radio size={14} /> AstroBis EarthOps</div>
      <h1>AstroBis EarthOps World Map</h1>
      <p>
        Space infrastructure, launch activity, Earth hazards, and spaceflight news in one
        orbital awareness console.
      </p>

      <div className="worldops-stat-grid">
        <StatPill label="events" value={visibleCounts.events} color="#fb923c" />
        <StatPill label="orbital objects" value={payload.totals?.satellites ?? payload.satellites.length} color="#67e8f9" />
        <StatPill label="debris sample" value={payload.totals?.debris ?? 0} color="#fb7185" />
        <StatPill label="launches" value={payload.launches.length} color="#fbbf24" />
        <StatPill label="news items" value={payload.news?.length || 0} color="#93c5fd" />
        <StatPill label="space weather" value={kp === null ? 'n/a' : `Kp ${kp.toFixed(1)}`} color={kp !== null && kp >= 5 ? '#fb7185' : '#86efac'} />
      </div>

      {layers.miniMap && (
        <div className="worldops-control-block worldops-mini-dock">
          <div className="worldops-block-title"><Map size={14} /> 2D tactical inset</div>
          <MiniMap
            events={events}
            launches={launches}
            satellites={satellites}
            layers={layers}
            selected={selected}
            onSelect={onSelect}
          />
        </div>
      )}

      <div className="worldops-control-block">
        <div className="worldops-block-title"><Globe2 size={14} /> View mode</div>
        <div className="worldops-mode-grid">
          {VIEW_MODES.map((mode) => (
            <ViewModeButton key={mode.key} mode={mode} active={viewMode === mode.key} onSelect={setViewMode} />
          ))}
        </div>
      </div>

      <div className="worldops-control-block">
        <div className="worldops-block-title"><Layers size={14} /> Layers</div>
        <div className="worldops-layer-grid">
          {LAYER_CONFIG.map((layer) => (
            <LayerButton
              key={layer.key}
              layer={layer}
              enabled={layers[layer.key]}
              onToggle={() => setLayers((current) => ({ ...current, [layer.key]: !current[layer.key] }))}
            />
          ))}
        </div>
      </div>

      <div className="worldops-control-block">
        <div className="worldops-block-title"><Satellite size={14} /> Priority orbital assets</div>
        <div className="worldops-asset-list">
          {prioritySatellites.map((satellite) => (
            <button key={satellite.id} type="button" onClick={() => onSelect({ kind: 'satellite', item: satellite })}>
              <span>{satellite.name}</span>
              <strong>{Math.round(satellite.altitudeKm || 0).toLocaleString()} km</strong>
            </button>
          ))}
        </div>
      </div>

      <button type="button" className="worldops-refresh" onClick={onRefresh} disabled={refreshing}>
        <RefreshCw size={15} className={refreshing ? 'worldops-spin' : ''} />
        {refreshing ? 'Refreshing public feeds' : 'Refresh live layers'}
      </button>
      <div className="worldops-source-note">
        Snapshot {formatDate(payload.generatedAt, { year: 'numeric' })}. Live layer status: {liveStatus}.
      </div>
    </aside>
  );
}

function DetailRows({ rows }) {
  return (
    <div className="worldops-detail-rows">
      {rows.map(([label, value, color]) => (
        <div key={label}>
          <span>{label}</span>
          <strong style={{ color: color || '#bfdbfe' }}>{value || 'n/a'}</strong>
        </div>
      ))}
    </div>
  );
}

function AIBrief({ brief, sourceMode }) {
  if (!brief) return null;
  const confidence = clamp(Number(brief.confidence) || 0, 0, 100);
  const watch = brief.watch || [];
  const bullets = brief.bullets || [];
  return (
    <section className="worldops-ai-brief">
      <div className="worldops-ai-scanline" aria-hidden="true" />
      <div className="worldops-ai-topline">
        <span><Zap size={13} /> AI signal core</span>
        <strong>{sourceMode}</strong>
      </div>
      <h3>{brief.headline || 'Public feeds loaded into AstroBis EarthOps.'}</h3>
      <div className="worldops-ai-meter" style={{ '--confidence': `${confidence}%` }}>
        <span>confidence</span>
        <strong>{Math.round(confidence)}%</strong>
        <i />
      </div>
      <div className="worldops-ai-grid">
        {watch.slice(0, 6).map((item) => (
          <article key={`${item.label}-${item.value}`} style={{ '--tone': item.tone || '#67e8f9' }}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.summary}</small>
          </article>
        ))}
      </div>
      <div className="worldops-ai-bullets">
        {bullets.slice(0, 4).map((bullet) => <p key={bullet}>{bullet}</p>)}
      </div>
      <footer>
        {brief.mode || 'local deterministic synthesis'} - {brief.sourceHealth?.live ?? 0}/{brief.sourceHealth?.total ?? 0} live source lanes
      </footer>
    </section>
  );
}

function SelectionPanel({ selected, payload, sourceMode, brief }) {
  const fallback = selected || (
    payload.launches[0]
      ? { kind: 'launch', item: payload.launches[0] }
      : payload.events[0]
        ? { kind: 'event', item: payload.events[0] }
        : payload.satellites[0]
          ? { kind: 'satellite', item: payload.satellites[0] }
          : null
  );

  if (!fallback) return null;
  const { kind, item } = fallback;
  const color = itemColor(kind, item);
  const title = item.title || item.name;
  const label = kind === 'event'
    ? item.source
    : kind === 'launch'
      ? 'Upcoming launch'
      : kind === 'satellite'
        ? item.group
        : kind === 'media'
          ? 'Public media source'
          : item.site;

  return (
    <aside className="worldops-panel worldops-right" style={{ '--accent': color }}>
      <div className="worldops-kicker"><Crosshair size={14} /> Intelligence panel</div>
      <AIBrief brief={brief} sourceMode={sourceMode} />
      <div className="worldops-detail-divider" />
      <div className="worldops-detail-heading">
        <span>{label}</span>
        <h2>{title}</h2>
        <p>{item.summary || item.mission || item.status || 'Public data snapshot item.'}</p>
      </div>

      {kind === 'event' && (
        <DetailRows rows={[
          ['Layer', item.type, color],
          ['Severity', item.severity, statusColor(item.severity)],
          ['Position', `${item.lat.toFixed(2)}, ${item.lon.toFixed(2)}`],
          ['Updated', formatDate(item.timestamp)],
        ]} />
      )}

      {kind === 'launch' && (
        <DetailRows rows={[
          ['NET', formatDate(item.net), '#fef3c7'],
          ['Countdown', relativeTime(item.net), '#fbbf24'],
          ['Provider', item.provider],
          ['Pad', item.pad],
          ['Location', item.location],
        ]} />
      )}

      {kind === 'satellite' && (
        <DetailRows rows={[
          ['NORAD', item.noradId],
          ['Object ID', item.objectId],
          ['Status', item.status, color],
          ['Altitude proxy', `${Math.round(item.altitudeKm || 0).toLocaleString()} km`],
          ['Inclination', `${Number(item.inclination || 0).toFixed(2)} deg`],
          ['Epoch', formatDate(item.epoch)],
        ]} />
      )}

      {kind === 'news' && (
        <DetailRows rows={[
          ['Site', item.site],
          ['Published', formatDate(item.publishedAt)],
          ['Source', 'Spaceflight News API snapshot', '#93c5fd'],
        ]} />
      )}

      {kind === 'media' && (
        <>
          <DetailRows rows={[
            ['Provider', item.provider],
            ['Type', item.type],
            ['Status', item.status, '#86efac'],
            ['Use', item.embedUrl ? 'embeddable public player' : 'open official source'],
          ]} />
          {item.embedUrl && (
            <div className="worldops-media-frame">
              <iframe
                src={item.embedUrl}
                title={item.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </>
      )}

      <a className="worldops-source-link" href={item.url || '#'} target="_blank" rel="noopener noreferrer">
        Open public source
      </a>

      <div className="worldops-method-note">
        {sourceMode === 'live'
          ? 'Live refresh updates CORS-friendly public feeds in the browser; launches and news remain build snapshots.'
          : 'Public feed snapshot. Disaster and news layers are situational context, not official hazard or impact assessments.'}
      </div>
    </aside>
  );
}

function MiniMap({ events, launches, satellites = [], layers = DEFAULT_LAYERS, selected, onSelect }) {
  const subsolar = subsolarPoint(new Date());
  const plottedEvents = events.slice(0, 180);
  const plottedLaunches = launches.filter((launch) => Number.isFinite(launch.lat) && Number.isFinite(launch.lon)).slice(0, 24);
  const plottedSatellites = (layers.satellites || layers.debris)
    ? satellites.filter((satellite) => satellite.status === 'debris' ? layers.debris : layers.satellites).slice(0, 240)
    : [];
  const pointStyle = (item, kind) => ({
    left: `${((item.lon + 180) / 360) * 100}%`,
    top: `${((90 - item.lat) / 180) * 100}%`,
    background: itemColor(kind, item),
    boxShadow: `0 0 12px ${itemColor(kind, item)}`,
  });

  return (
    <div className="worldops-mini-map">
      <div className="worldops-mini-map-bg" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {[25, 50, 75].map((x) => <line key={`x${x}`} x1={x} y1="0" x2={x} y2="100" />)}
        {[25, 50, 75].map((y) => <line key={`y${y}`} x1="0" y1={y} x2="100" y2={y} />)}
        <path d={terminatorPath(subsolar)} />
      </svg>
      {plottedSatellites.map((satellite) => {
        const point = satelliteGeoPoint(satellite, new Date());
        if (!point) return null;
        const satelliteItem = { ...satellite, lat: point.lat, lon: point.lon };
        return (
          <button
            key={satellite.id}
            type="button"
            className={`worldops-map-dot satellite ${satellite.status === 'debris' ? 'debris' : ''} ${selectionId(selected) === selectionId({ kind: 'satellite', item: satellite }) ? 'is-active' : ''}`}
            style={pointStyle(satelliteItem, 'satellite')}
            onClick={() => onSelect({ kind: 'satellite', item: satellite })}
            title={satellite.name}
          />
        );
      })}
      {plottedEvents.map((event) => (
        <button
          key={event.id}
          type="button"
          className={`worldops-map-dot ${selectionId(selected) === selectionId({ kind: 'event', item: event }) ? 'is-active' : ''}`}
          style={pointStyle(event, 'event')}
          onClick={() => onSelect({ kind: 'event', item: event })}
          title={event.title}
        />
      ))}
      {plottedLaunches.map((launch) => (
        <button
          key={launch.id}
          type="button"
          className={`worldops-map-dot launch ${selectionId(selected) === selectionId({ kind: 'launch', item: launch }) ? 'is-active' : ''}`}
          style={pointStyle(launch, 'launch')}
          onClick={() => onSelect({ kind: 'launch', item: launch })}
          title={launch.name}
        />
      ))}
      <div className="worldops-mini-label">
        <strong>2D tactical inset</strong>
        <span>signals, orbits, launch sites, terminator</span>
      </div>
    </div>
  );
}

function TimelineRail({ launches, events, news, media, layers, onSelect }) {
  const eventItems = events.slice(0, 9);
  const launchItems = launches.slice().sort((a, b) => Date.parse(a.net) - Date.parse(b.net)).slice(0, 8);
  const newsItems = layers.news ? news.slice(0, 10) : [];
  const mediaItems = media.slice(0, 9);
  return (
    <section className="worldops-timeline" aria-label="EarthOps mission timeline">
      <div className="worldops-timeline-group">
        <header><Rocket size={14} /> Upcoming launches</header>
        <div className="worldops-timeline-scroll">
          {launchItems.map((launch) => (
            <button key={launch.id} type="button" onClick={() => onSelect({ kind: 'launch', item: launch })}>
              <span>{relativeTime(launch.net)}</span>
              <strong>{launch.name}</strong>
              <small>{launch.location}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="worldops-timeline-group">
        <header><Activity size={14} /> Earth signals</header>
        <div className="worldops-timeline-scroll">
          {eventItems.map((event) => (
            <button key={event.id} type="button" onClick={() => onSelect({ kind: 'event', item: event })}>
              <span>{event.source}</span>
              <strong>{event.title}</strong>
              <small>{event.severity} - {formatDate(event.timestamp)}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="worldops-timeline-group">
        <header><Newspaper size={14} /> Space news</header>
        <div className="worldops-timeline-scroll">
          {newsItems.map((article) => (
            <button key={article.id} type="button" onClick={() => onSelect({ kind: 'news', item: article })}>
              <span>{article.site}</span>
              <strong>{article.title}</strong>
              <small>{formatDate(article.publishedAt)}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="worldops-timeline-group">
        <header><Eye size={14} /> Public media</header>
        <div className="worldops-timeline-scroll">
          {mediaItems.map((item) => (
            <button key={item.id} type="button" onClick={() => onSelect({ kind: 'media', item })}>
              <span>{item.provider}</span>
              <strong>{item.title}</strong>
              <small>{item.status}</small>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function LoadingFallback() {
  return (
    <div className="worldops-loading">
      <Globe2 size={26} />
      <span>Rendering EarthOps globe</span>
    </div>
  );
}

function CommandStrip({ payload, viewMode, visibleCounts, sourceMode }) {
  const utc = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const generated = payload.generatedAt ? new Date(payload.generatedAt).toISOString().replace('T', ' ').slice(0, 16) : 'snapshot pending';
  const kp = finiteNumber(payload.spaceWeather?.kp);
  return (
    <div className="worldops-command-strip">
      <span><Radio size={13} /> UTC {utc}</span>
      <span><Globe2 size={13} /> {viewMode === 'map' ? '2D ops projection' : viewMode === 'shell' ? 'orbital-shell view' : '3D globe view'}</span>
      <span><Activity size={13} /> {visibleCounts.events.toLocaleString()} signals</span>
      <span><Satellite size={13} /> {visibleCounts.satellites.toLocaleString()} objects</span>
      <span><Zap size={13} /> {kp === null ? 'Kp n/a' : `Kp ${kp.toFixed(1)}`}</span>
      <span><Newspaper size={13} /> {payload.news?.length || 0} news</span>
      <span><Eye size={13} /> {payload.media?.length || 0} public media</span>
      <span><RefreshCw size={13} /> {sourceMode}</span>
      <strong>snapshot {generated} UTC</strong>
    </div>
  );
}

export default function WorldMap() {
  const [payload, setPayload] = useState(FALLBACK_WORLD);
  const [layers, setLayers] = useState(DEFAULT_LAYERS);
  const [viewMode, setViewMode] = useState('globe');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sourceMode, setSourceMode] = useState('snapshot');
  const [liveStatus, setLiveStatus] = useState('snapshot ready');

  useEffect(() => {
    let alive = true;
    fetch(LOCAL_WORLD_URL, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('WorldOps snapshot missing');
        return response.json();
      })
      .then((snapshot) => {
        if (!alive) return;
        setPayload(snapshot);
        setSelected(snapshot.launches?.[0] ? { kind: 'launch', item: snapshot.launches[0] } : snapshot.events?.[0] ? { kind: 'event', item: snapshot.events[0] } : null);
        setSourceMode('snapshot');
      })
      .catch(() => {
        if (!alive) return;
        setPayload(FALLBACK_WORLD);
        setSelected({ kind: 'event', item: FALLBACK_WORLD.events[0] });
        setLiveStatus('fallback');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const live = await refreshLiveLayers();
      setPayload((current) => {
        const staticSatellites = current.satellites.filter((satellite) => !['Space stations', 'Recent launches'].includes(satellite.group));
        const next = {
          ...current,
          events: live.events.length ? live.events : current.events,
          satellites: live.satellites.length ? [...live.satellites, ...staticSatellites] : current.satellites,
          totals: {
            ...current.totals,
            events: live.events.length || current.events.length,
            satellites: live.satellites.length ? live.satellites.length + staticSatellites.length : current.satellites.length,
          },
        };
        return next;
      });
      setSourceMode('live');
      setLiveStatus(Object.entries(live.statuses).map(([key, value]) => `${key}:${value}`).join(' / '));
    } catch (error) {
      setLiveStatus(`refresh held: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  }

  const visibleEvents = useMemo(() => payload.events.filter((event) => eventIsVisible(event, layers)), [payload.events, layers]);
  const visibleSatellites = useMemo(() => payload.satellites.filter((satellite) => (
    satellite.status === 'debris' ? layers.debris : layers.satellites
  )), [payload.satellites, layers.debris, layers.satellites]);
  const visibleLaunches = useMemo(() => (layers.launches ? payload.launches : []), [payload.launches, layers.launches]);
  const visibleCounts = useMemo(() => ({
    events: visibleEvents.length,
    satellites: visibleSatellites.length,
    launches: visibleLaunches.length,
    news: payload.news?.length || 0,
    media: payload.media?.length || 0,
  }), [visibleEvents.length, visibleSatellites.length, visibleLaunches.length, payload.news, payload.media]);
  const opsBrief = useMemo(
    () => buildDisplayBrief(payload, visibleEvents, visibleSatellites, visibleLaunches),
    [payload, visibleEvents, visibleSatellites, visibleLaunches],
  );

  return (
    <div className={`worldops-root view-${viewMode}`}>
      <style>{WORLDOPS_CSS}</style>
      <div className={`worldops-canvas is-${viewMode}`}>
        {viewMode === 'map' ? (
          <OpsProjectionMap
            events={visibleEvents}
            launches={visibleLaunches}
            satellites={payload.satellites}
            layers={layers}
            selected={selected}
            onSelect={setSelected}
          />
        ) : (
          <Canvas camera={{ position: viewMode === 'shell' ? [0.18, 0.2, 5.05] : [0.18, 0.32, 3.35], fov: viewMode === 'shell' ? 48 : 44 }} dpr={[1, 1.75]}>
            <Suspense fallback={null}>
              <WorldScene
                events={visibleEvents}
                launches={visibleLaunches}
                satellites={payload.satellites}
                layers={layers}
                selected={selected}
                onSelect={setSelected}
                mode={viewMode}
              />
            </Suspense>
          </Canvas>
        )}
        {loading && <LoadingFallback />}
        <div className="worldops-orbit-credit">
          Data snapshots: NASA EONET - USGS - GDACS - CelesTrak - Launch Library 2 - Spaceflight News API
        </div>
      </div>

      <CommandStrip payload={payload} viewMode={viewMode} visibleCounts={visibleCounts} sourceMode={sourceMode} />

      <MissionPanel
        payload={payload}
        layers={layers}
        setLayers={setLayers}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        liveStatus={liveStatus}
        visibleCounts={visibleCounts}
        onSelect={setSelected}
        satellites={payload.satellites}
        events={visibleEvents}
        launches={visibleLaunches}
        selected={selected}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <SelectionPanel selected={selected} payload={payload} sourceMode={sourceMode} brief={opsBrief} />

      <TimelineRail launches={visibleLaunches} events={visibleEvents} news={payload.news} media={payload.media || []} layers={layers} onSelect={setSelected} />
    </div>
  );
}

const WORLDOPS_CSS = `
.worldops-root {
  position: relative;
  min-height: 100vh;
  padding-top: 64px;
  overflow: hidden;
  background:
    radial-gradient(circle at 48% 24%, rgba(14,165,233,0.16), transparent 34%),
    radial-gradient(circle at 72% 74%, rgba(124,58,237,0.12), transparent 32%),
    #01030b;
}
.worldops-canvas {
  position: absolute;
  inset: 64px 0 0;
}
.worldops-canvas canvas {
  display: block;
}
.worldops-command-strip {
  position: absolute;
  z-index: 27;
  top: 88px;
  left: 396px;
  right: 396px;
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 0.45rem;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 0.46rem 0.7rem;
  border: 1px solid rgba(103,232,249,0.22);
  border-radius: 14px;
  background: rgba(3,7,18,0.72);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 70px rgba(0,0,0,0.35);
  color: rgba(255,255,255,0.72);
}
.worldops-command-strip::-webkit-scrollbar {
  display: none;
}
.worldops-command-strip span,
.worldops-command-strip strong {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  min-height: 24px;
  padding: 0.18rem 0.46rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.035);
  font-size: 0.66rem;
  font-weight: 850;
  line-height: 1;
  white-space: nowrap;
}
.worldops-command-strip strong {
  color: #67e8f9;
}
.worldops-panel {
  position: absolute;
  z-index: 24;
  border: 1px solid rgba(148,163,184,0.22);
  background: linear-gradient(180deg, rgba(4,8,18,0.88), rgba(4,7,17,0.72));
  backdrop-filter: blur(18px);
  box-shadow: 0 26px 90px rgba(0,0,0,0.4);
  border-radius: 18px;
  color: rgba(255,255,255,0.76);
}
.worldops-left {
  left: 18px;
  top: 88px;
  width: min(360px, calc(100vw - 36px));
  max-height: calc(100vh - 112px);
  overflow: auto;
  padding: 1rem;
}
.worldops-right {
  right: 18px;
  top: 88px;
  width: min(360px, calc(100vw - 36px));
  max-height: min(620px, calc(100vh - 236px));
  overflow: auto;
  padding: 1.05rem;
  border-color: color-mix(in srgb, var(--accent), rgba(148,163,184,0.2) 64%);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--accent), rgba(4,8,18,0.92) 90%), rgba(4,7,17,0.78)),
    radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--accent), transparent 72%), transparent 44%);
}
.worldops-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.42rem;
  color: #67e8f9;
  font-size: 0.72rem;
  font-weight: 950;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.65rem;
}
.worldops-left h1 {
  margin: 0 0 0.45rem;
  font-family: 'Space Grotesk', Inter, sans-serif;
  color: white;
  font-size: clamp(1.65rem, 2.6vw, 2.4rem);
  line-height: 1.02;
  letter-spacing: 0;
}
.worldops-left p,
.worldops-detail-heading p {
  margin: 0;
  color: rgba(255,255,255,0.58);
  font-size: 0.87rem;
  line-height: 1.55;
}
.worldops-stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.62rem;
  margin: 1rem 0;
}
.worldops-stat-pill {
  min-height: 64px;
  padding: 0.72rem;
  border-radius: 12px;
  background: rgba(255,255,255,0.045);
  border: 1px solid rgba(255,255,255,0.09);
}
.worldops-stat-pill strong {
  display: block;
  color: var(--accent);
  font-size: 1.35rem;
  line-height: 1;
  font-family: 'Space Grotesk', Inter, sans-serif;
}
.worldops-stat-pill span {
  color: rgba(255,255,255,0.44);
  font-size: 0.73rem;
}
.worldops-control-block {
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-top: 0.85rem;
  margin-top: 0.85rem;
}
.worldops-block-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255,255,255,0.78);
  font-weight: 900;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.72rem;
}
.worldops-layer-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.48rem;
}
.worldops-mode-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.48rem;
}
.worldops-mode-button {
  min-height: 52px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.64);
  display: grid;
  place-items: center;
  gap: 0.22rem;
  padding: 0.45rem 0.28rem;
  cursor: pointer;
  font-size: 0.66rem;
  font-weight: 900;
  text-align: center;
}
.worldops-mode-button[data-active="true"] {
  color: #041014;
  background: linear-gradient(135deg, #67e8f9, #86efac);
  border-color: rgba(255,255,255,0.28);
  box-shadow: 0 0 22px rgba(103,232,249,0.25);
}
.worldops-layer-button {
  height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.11);
  background: rgba(255,255,255,0.045);
  color: rgba(255,255,255,0.54);
  display: flex;
  align-items: center;
  gap: 0.42rem;
  padding: 0 0.62rem;
  cursor: pointer;
  font-weight: 850;
  font-size: 0.72rem;
  transition: transform 160ms ease, border-color 160ms ease, color 160ms ease, background 160ms ease;
}
.worldops-layer-button svg {
  color: var(--layer-color);
  flex: 0 0 auto;
}
.worldops-layer-button i {
  margin-left: auto;
  width: 7px;
  height: 7px;
  border-radius: 99px;
  background: rgba(255,255,255,0.22);
}
.worldops-layer-button[aria-pressed="true"] {
  color: rgba(255,255,255,0.9);
  border-color: color-mix(in srgb, var(--layer-color), rgba(255,255,255,0.18) 45%);
  background: color-mix(in srgb, var(--layer-color), rgba(255,255,255,0.045) 88%);
}
.worldops-layer-button[aria-pressed="true"] i {
  background: var(--layer-color);
  box-shadow: 0 0 12px var(--layer-color);
}
.worldops-layer-button:hover {
  transform: translateY(-1px);
}
.worldops-asset-list {
  display: grid;
  gap: 0.4rem;
  max-height: 168px;
  overflow: auto;
  padding-right: 0.2rem;
}
.worldops-asset-list button {
  min-height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.035);
  color: rgba(255,255,255,0.76);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 0.42rem 0.55rem;
  cursor: pointer;
  text-align: left;
}
.worldops-asset-list span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.76rem;
  font-weight: 800;
}
.worldops-asset-list strong {
  color: #67e8f9;
  font-size: 0.72rem;
  white-space: nowrap;
}
.worldops-refresh {
  width: 100%;
  min-height: 42px;
  margin-top: 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(103,232,249,0.32);
  background: rgba(103,232,249,0.1);
  color: #cffafe;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 900;
  cursor: pointer;
}
.worldops-refresh:disabled {
  opacity: 0.64;
  cursor: wait;
}
.worldops-source-note {
  margin-top: 0.65rem;
  color: rgba(255,255,255,0.38);
  font-size: 0.72rem;
  line-height: 1.45;
}
.worldops-detail-heading span {
  display: inline-flex;
  color: var(--accent);
  font-weight: 950;
  text-transform: uppercase;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  margin-bottom: 0.35rem;
}
.worldops-detail-heading h2 {
  color: white;
  margin: 0 0 0.6rem;
  font-family: 'Space Grotesk', Inter, sans-serif;
  font-size: 1.55rem;
  line-height: 1.02;
  letter-spacing: 0;
}
.worldops-detail-rows {
  margin-top: 1rem;
}
.worldops-detail-rows div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.075);
  padding: 0.55rem 0;
  font-size: 0.78rem;
}
.worldops-detail-rows span {
  color: rgba(255,255,255,0.42);
}
.worldops-detail-rows strong {
  text-align: right;
  max-width: 58%;
}
.worldops-source-link {
  display: inline-flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  margin-top: 1rem;
  border-radius: 999px;
  text-decoration: none;
  color: white;
  font-size: 0.78rem;
  font-weight: 950;
  border: 1px solid color-mix(in srgb, var(--accent), rgba(255,255,255,0.14) 52%);
  background: color-mix(in srgb, var(--accent), rgba(255,255,255,0.04) 86%);
}
.worldops-media-frame {
  margin-top: 0.85rem;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid rgba(103,232,249,0.2);
  background: rgba(0,0,0,0.48);
  aspect-ratio: 16 / 9;
}
.worldops-media-frame iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
.worldops-method-note {
  margin-top: 0.8rem;
  padding: 0.74rem;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.035);
  color: rgba(255,255,255,0.45);
  font-size: 0.72rem;
  line-height: 1.55;
}
.worldops-detail-divider {
  height: 1px;
  margin: 0.92rem 0;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent), rgba(255,255,255,0.3) 38%), transparent);
}
.worldops-ai-brief {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 0.82rem;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--accent), rgba(255,255,255,0.1) 58%);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025)),
    radial-gradient(circle at 18% 0%, color-mix(in srgb, var(--accent), transparent 58%), transparent 44%);
  box-shadow: inset 0 0 32px rgba(255,255,255,0.035), 0 18px 52px rgba(0,0,0,0.28);
}
.worldops-ai-scanline {
  position: absolute;
  z-index: -1;
  inset: -45% 0 auto;
  height: 56%;
  background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--accent), transparent 50%), transparent);
  opacity: 0.42;
  animation: worldops-scan 5.6s linear infinite;
}
.worldops-ai-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;
  margin-bottom: 0.58rem;
}
.worldops-ai-topline span,
.worldops-ai-topline strong {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.64rem;
  line-height: 1;
  font-weight: 950;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.worldops-ai-topline span {
  color: #67e8f9;
}
.worldops-ai-topline strong {
  color: rgba(255,255,255,0.48);
}
.worldops-ai-brief h3 {
  margin: 0;
  color: rgba(255,255,255,0.92);
  font-family: 'Space Grotesk', Inter, sans-serif;
  font-size: 0.96rem;
  line-height: 1.22;
  letter-spacing: 0;
}
.worldops-ai-meter {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.35rem 0.7rem;
  align-items: center;
  margin: 0.82rem 0;
}
.worldops-ai-meter span {
  color: rgba(255,255,255,0.44);
  font-size: 0.62rem;
  font-weight: 950;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.worldops-ai-meter strong {
  color: #cffafe;
  font-size: 0.76rem;
}
.worldops-ai-meter i {
  grid-column: 1 / -1;
  height: 6px;
  border-radius: 999px;
  background:
    linear-gradient(90deg, #67e8f9 var(--confidence), rgba(255,255,255,0.1) var(--confidence)),
    rgba(255,255,255,0.06);
  box-shadow: 0 0 18px rgba(103,232,249,0.24);
}
.worldops-ai-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.46rem;
}
.worldops-ai-grid article {
  min-height: 84px;
  padding: 0.56rem;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--tone), rgba(255,255,255,0.08) 64%);
  background: color-mix(in srgb, var(--tone), rgba(255,255,255,0.035) 91%);
}
.worldops-ai-grid span {
  display: block;
  color: rgba(255,255,255,0.44);
  font-size: 0.58rem;
  font-weight: 950;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.worldops-ai-grid strong {
  display: block;
  margin-top: 0.2rem;
  color: var(--tone);
  font-family: 'Space Grotesk', Inter, sans-serif;
  font-size: 0.92rem;
  line-height: 1.1;
}
.worldops-ai-grid small {
  display: block;
  margin-top: 0.32rem;
  color: rgba(255,255,255,0.48);
  font-size: 0.61rem;
  line-height: 1.28;
}
.worldops-ai-bullets {
  display: grid;
  gap: 0.34rem;
  margin-top: 0.74rem;
}
.worldops-ai-bullets p {
  margin: 0;
  padding-left: 0.62rem;
  border-left: 2px solid color-mix(in srgb, var(--accent), rgba(255,255,255,0.18) 38%);
  color: rgba(255,255,255,0.58);
  font-size: 0.68rem;
  line-height: 1.4;
}
.worldops-ai-brief footer {
  margin-top: 0.68rem;
  padding-top: 0.56rem;
  border-top: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.38);
  font-size: 0.62rem;
  line-height: 1.35;
}
.worldops-space-label {
  min-width: 126px;
  max-width: 210px;
  padding: 0.38rem 0.5rem;
  border-radius: 9px;
  background: rgba(3,7,18,0.82);
  border: 1px solid rgba(255,255,255,0.18);
  box-shadow: 0 12px 34px rgba(0,0,0,0.36);
  color: white;
  pointer-events: none;
}
.worldops-space-label span {
  display: block;
  color: rgba(255,255,255,0.48);
  font-size: 0.55rem;
  font-weight: 950;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.worldops-space-label strong {
  display: block;
  font-size: 0.68rem;
  line-height: 1.16;
  margin-top: 0.16rem;
}
.worldops-projection-map {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #020617;
}
.worldops-projection-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(2,6,23,0.18), rgba(2,6,23,0.56)),
    url(${EARTH_TEXTURES.day});
  background-size: cover;
  background-position: center;
  filter: saturate(1.08) contrast(1.08) brightness(0.72);
}
.worldops-projection-map::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 50%, transparent 0 52%, rgba(1,3,11,0.1) 74%, rgba(1,3,11,0.7) 100%),
    linear-gradient(90deg, rgba(103,232,249,0.06) 1px, transparent 1px),
    linear-gradient(0deg, rgba(103,232,249,0.05) 1px, transparent 1px);
  background-size: auto, 8.333% 100%, 100% 16.66%;
  pointer-events: none;
}
.worldops-projection-map svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.72;
}
.worldops-projection-map line {
  stroke: rgba(191,219,254,0.2);
  stroke-width: 0.08;
}
.worldops-projection-map .terminator {
  fill: none;
  stroke: rgba(250,204,21,0.72);
  stroke-width: 0.18;
  stroke-dasharray: 1.3 1;
}
.worldops-projection-dot {
  position: absolute;
  z-index: 4;
  width: 7px;
  height: 7px;
  border-radius: 99px;
  border: 1px solid rgba(255,255,255,0.75);
  background: var(--dot-color);
  box-shadow: 0 0 13px var(--dot-color);
  transform: translate(-50%, -50%);
  cursor: pointer;
  padding: 0;
}
.worldops-projection-dot.orbital {
  width: 4px;
  height: 4px;
  opacity: 0.86;
  border: 0;
}
.worldops-projection-dot.debris {
  opacity: 0.72;
}
.worldops-projection-dot.launch {
  width: 11px;
  height: 11px;
  background: transparent;
}
.worldops-projection-dot.launch::after {
  content: '';
  position: absolute;
  inset: 2px;
  border-radius: inherit;
  background: var(--dot-color);
}
.worldops-projection-dot.is-active {
  width: 16px;
  height: 16px;
  z-index: 8;
}
.worldops-map-legend {
  position: absolute;
  z-index: 8;
  left: 50%;
  bottom: 14px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.42rem;
  padding: 0.42rem 0.62rem;
  border-radius: 999px;
  background: rgba(3,7,18,0.78);
  border: 1px solid rgba(255,255,255,0.12);
}
.worldops-map-legend span {
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  color: rgba(255,255,255,0.72);
  font-size: 0.66rem;
  font-weight: 850;
}
.worldops-map-legend i {
  width: 8px;
  height: 8px;
  border-radius: 99px;
  background: var(--dot-color);
  box-shadow: 0 0 10px var(--dot-color);
}
.worldops-mini-map {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 176px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow: 0 18px 48px rgba(0,0,0,0.34);
}
.worldops-mini-map-bg {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(2,6,23,0.06), rgba(2,6,23,0.54)), url(${EARTH_TEXTURES.day});
  background-size: cover;
  background-position: center;
  filter: saturate(0.95) contrast(1.08);
}
.worldops-mini-map svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.worldops-mini-map line {
  stroke: rgba(255,255,255,0.14);
  stroke-width: 0.18;
}
.worldops-mini-map path {
  fill: none;
  stroke: rgba(250,204,21,0.72);
  stroke-width: 0.42;
  stroke-dasharray: 1.8 1.4;
}
.worldops-map-dot {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 99px;
  border: 1px solid rgba(255,255,255,0.85);
  transform: translate(-50%, -50%);
  cursor: pointer;
  padding: 0;
}
.worldops-map-dot.launch {
  width: 9px;
  height: 9px;
}
.worldops-map-dot.satellite {
  width: 3px;
  height: 3px;
  border: 0;
  opacity: 0.9;
}
.worldops-map-dot.satellite.debris {
  opacity: 0.66;
}
.worldops-map-dot.is-active {
  width: 14px;
  height: 14px;
  z-index: 4;
}
.worldops-mini-label {
  position: absolute;
  left: 12px;
  top: 10px;
  color: white;
}
.worldops-mini-label strong {
  display: block;
  font-family: 'Space Grotesk', Inter, sans-serif;
  font-size: 0.86rem;
}
.worldops-mini-label span {
  display: block;
  color: rgba(255,255,255,0.56);
  font-size: 0.68rem;
}
.worldops-timeline {
  position: absolute;
  z-index: 26;
  left: 396px;
  right: 396px;
  bottom: 16px;
  transform: none;
  width: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
  gap: 0.72rem;
  border: 1px solid rgba(148,163,184,0.2);
  background: rgba(3,7,18,0.78);
  backdrop-filter: blur(18px);
  border-radius: 22px;
  padding: 0.72rem;
  box-shadow: 0 24px 90px rgba(0,0,0,0.44);
}
.worldops-timeline-group header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255,255,255,0.82);
  font-size: 0.72rem;
  font-weight: 950;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 0.5rem;
}
.worldops-timeline-scroll {
  display: grid;
  gap: 0.42rem;
  max-height: 132px;
  overflow: auto;
  padding-right: 0.2rem;
}
.worldops-timeline button {
  width: 100%;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  background: rgba(255,255,255,0.04);
  color: white;
  padding: 0.52rem 0.58rem;
  text-align: left;
  cursor: pointer;
}
.worldops-timeline button span {
  display: block;
  color: #67e8f9;
  font-size: 0.65rem;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.worldops-timeline button strong {
  display: block;
  margin-top: 0.12rem;
  font-size: 0.76rem;
  line-height: 1.22;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.worldops-timeline button small {
  display: block;
  margin-top: 0.18rem;
  color: rgba(255,255,255,0.4);
  font-size: 0.66rem;
  line-height: 1.24;
}
.worldops-loading {
  position: absolute;
  z-index: 28;
  inset: 0;
  display: grid;
  place-items: center;
  gap: 0.55rem;
  color: #cffafe;
  font-weight: 900;
  background: radial-gradient(circle, rgba(8,13,31,0.72), rgba(1,3,11,0.15));
}
.worldops-loading svg {
  animation: worldops-spin 2s linear infinite;
}
.worldops-orbit-credit {
  position: absolute;
  right: 20px;
  bottom: 12px;
  z-index: 20;
  color: rgba(255,255,255,0.32);
  font-size: 0.68rem;
}
.worldops-spin {
  animation: worldops-spin 1.1s linear infinite;
}
@keyframes worldops-spin {
  to { transform: rotate(360deg); }
}
@keyframes worldops-scan {
  0% { transform: translateY(0); }
  100% { transform: translateY(310%); }
}
@media (max-width: 1180px) {
  .worldops-left,
  .worldops-right {
    width: min(330px, calc(100vw - 36px));
  }
  .worldops-command-strip {
    left: 366px;
    right: 366px;
  }
  .worldops-timeline {
    left: 366px;
    right: 366px;
  }
}
@media (max-width: 1080px) {
  .worldops-root {
    min-height: auto;
    overflow: visible;
    padding: 72px 0 1rem;
  }
  .worldops-canvas {
    position: relative;
    inset: auto;
    height: 62vh;
    min-height: 440px;
  }
  .worldops-command-strip,
  .worldops-left,
  .worldops-right,
  .worldops-timeline {
    position: relative;
    left: auto;
    right: auto;
    top: auto;
    bottom: auto;
    transform: none;
    width: min(720px, calc(100vw - 24px));
    margin: 0.8rem auto;
  }
  .worldops-left,
  .worldops-right {
    max-height: none;
    overflow: visible;
  }
  .worldops-timeline {
    grid-template-columns: 1fr;
  }
  .worldops-layer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .worldops-orbit-credit {
    display: none;
  }
}
@media (max-width: 560px) {
  .worldops-canvas {
    height: 56vh;
    min-height: 380px;
  }
  .worldops-left h1 {
    font-size: 2.05rem;
  }
  .worldops-stat-grid,
  .worldops-layer-grid {
    grid-template-columns: 1fr;
  }
  .worldops-panel {
    border-radius: 16px;
  }
}
`;
