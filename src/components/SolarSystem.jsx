import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Line, OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const AU_KM = 149597870.7;
const EARTH_RADIUS_KM = 6371;
const AU_LIGHT_MINUTES = 8.316746;
const AU_PER_LIGHT_YEAR = 63241.077;

// Moon counts are loaded from the AstroBis same-origin snapshot on every page refresh.
 // The snapshot is versioned in public/data/moon-counts.json and should be updated from
 // IAU/MPC announcements before each release or scheduled site-data refresh.
 const MOON_COUNT_SNAPSHOT = {
   asOf: '2026-03-26',
   source: 'IAU Minor Planet Center confirmation for Jupiter and Saturn; curated planetary-satellite snapshot for the remaining systems',
   counts: {
     Mercury: 0,
     Venus: 0,
     Earth: 1,
     Mars: 2,
     Ceres: 0,
     Jupiter: 101,
     Saturn: 285,
     Uranus: 29,
     Neptune: 16,
     Pluto: 5,
     Haumea: 2,
     Makemake: 1,
     Eris: 1,
   },
 };

 function moonCountDataUrl() {
   const base = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
     ? import.meta.env.BASE_URL
     : '/';
   return `${base.endsWith('/') ? base : `${base}/`}data/moon-counts.json?ts=${Date.now()}`;
 }

const TEXTURE_URLS = {
  sun: 'https://commons.wikimedia.org/wiki/Special:FilePath/Solarsystemscope_texture_2k_sun.jpg',
  mercury: 'https://commons.wikimedia.org/wiki/Special:FilePath/Solarsystemscope_texture_2k_mercury.jpg',
  venus: 'https://commons.wikimedia.org/wiki/Special:FilePath/Solarsystemscope_texture_2k_venus_surface.jpg',
  mars: 'https://commons.wikimedia.org/wiki/Special:FilePath/Solarsystemscope_texture_2k_mars.jpg',
  jupiter: 'https://commons.wikimedia.org/wiki/Special:FilePath/Solarsystemscope_texture_2k_jupiter.jpg',
  saturn: 'https://commons.wikimedia.org/wiki/Special:FilePath/Solarsystemscope_texture_2k_saturn.jpg',
  saturnRing: 'https://commons.wikimedia.org/wiki/Special:FilePath/Solarsystemscope_texture_2k_saturn_ring_alpha.png',
  uranus: 'https://commons.wikimedia.org/wiki/Special:FilePath/Solarsystemscope_texture_2k_uranus.jpg',
  neptune: 'https://commons.wikimedia.org/wiki/Special:FilePath/Solarsystemscope_texture_2k_neptune.jpg',
  pluto: 'https://commons.wikimedia.org/wiki/Special:FilePath/Solarsystemscope_texture_2k_pluto.jpg',
  earth: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
  earthNormal: 'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
  earthSpecular: 'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg',
  earthClouds: 'https://threejs.org/examples/textures/planets/earth_clouds_1024.png',
  moon: 'https://threejs.org/examples/textures/planets/moon_1024.jpg',
};

const palette = {
  bg: '#03020d',
  panel: 'rgba(5,8,18,0.78)',
  panelStrong: 'rgba(5,8,18,0.92)',
  border: 'rgba(255,255,255,0.12)',
  text: 'rgba(255,255,255,0.86)',
  muted: 'rgba(255,255,255,0.48)',
  cyan: '#67e8f9',
  amber: '#fbbf24',
  violet: '#a78bfa',
  green: '#4ade80',
};


const BODY_SCIENCE = {
  Mercury: {
    visual: 'High-roughness cratered silicate regolith; no atmosphere layer.',
    composition: 'Silicate crust and mantle around an unusually large iron-rich core.',
  },
  Venus: {
    visual: 'Cloud-top visualisation. The solid surface is hidden by an opaque atmosphere.',
    composition: 'CO₂-dominated atmosphere with sulfuric-acid cloud decks over basaltic terrain.',
  },
  Earth: {
    visual: 'Land–ocean colour map with normal/specular response and an independently rotating cloud layer.',
    composition: 'Silicate surface, liquid water oceans, and an N₂–O₂ atmosphere.',
  },
  Mars: {
    visual: 'Iron-oxide-rich regolith map with high roughness and no ocean specular layer.',
    composition: 'Basaltic crust, iron oxides, water ice, and a thin CO₂ atmosphere.',
  },
  Ceres: {
    visual: 'Dwarf-planet body with a rough, dark regolith treatment.',
    composition: 'Rock, hydrated minerals, water ice, salts, and probable brine-related deposits.',
  },
  Jupiter: {
    visual: 'Cloud-top atmospheric bands and storm texture; Jupiter has no solid surface to depict.',
    composition: 'Hydrogen and helium with ammonia, ammonium hydrosulfide, and water cloud layers.',
  },
  Saturn: {
    visual: 'Cloud-top atmospheric texture plus an optically thin ring plane; no solid surface to depict.',
    composition: 'Hydrogen and helium atmosphere; rings dominated by water-ice particles.',
  },
  Uranus: {
    visual: 'Methane-tinted upper atmosphere and faint ring system; no solid surface to depict.',
    composition: 'Hydrogen, helium, methane, and an ice-rich deep interior.',
  },
  Neptune: {
    visual: 'Methane-tinted atmosphere and cloud-band texture; no solid surface to depict.',
    composition: 'Hydrogen, helium, methane, and an ice-rich deep interior.',
  },
  Pluto: {
    visual: 'Icy dwarf-planet texture based on global New Horizons-era cartographic rendering.',
    composition: 'Nitrogen, methane, and carbon-monoxide ices over water-ice bedrock.',
  },
  Haumea: {
    visual: 'Bright ice-rich dwarf-planet treatment; shape remains simplified in this atlas.',
    composition: 'Water-ice-dominated surface with a rocky interior and a ring.',
  },
  Makemake: {
    visual: 'Methane-ice-rich outer-system dwarf-planet treatment.',
    composition: 'Methane, ethane, and likely nitrogen ices over a rocky/icy interior.',
  },
  Eris: {
    visual: 'High-albedo methane-ice dwarf-planet treatment.',
    composition: 'Methane ice over an icy-rocky body in the scattered disc.',
  },
};


const BODY_SHAPES = {
  Jupiter: [1, 0.935, 1],
  Saturn: [1, 0.902, 1],
  Uranus: [1, 0.977, 1],
  Neptune: [1, 0.983, 1],
  Earth: [1, 0.997, 1],
  Mars: [1, 0.994, 1],
  Haumea: [1.55, 0.74, 0.78],
};

const SYSTEM_OBJECTS = [
  {
    name: 'Mercury',
    group: 'Terrestrial planet',
    au: 0.387,
    radiusKm: 2440,
    moons: 0,
    orbitalPeriod: '88 days',
    dayLength: '58.6 Earth days',
    color: '#b6ada1',
    accent: '#d1c6b8',
    texture: 'mercury',
    ecc: 0.2056,
    inclinationDeg: 7.0,
    axialTiltDeg: 0.03,
    gravity: '3.70 m/s2',
    escapeVelocity: '4.25 km/s',
    size: 0.58,
    speed: 4.15,
    fact: 'Airless, cratered, and locked in a 3:2 spin-orbit resonance.',
    reference: 'NASA Solar System Exploration - Mercury',
  },
  {
    name: 'Venus',
    group: 'Terrestrial planet',
    au: 0.723,
    radiusKm: 6052,
    moons: 0,
    orbitalPeriod: '225 days',
    dayLength: '243 Earth days',
    color: '#d9b46f',
    accent: '#f6d28b',
    texture: 'venus',
    ecc: 0.0068,
    inclinationDeg: 3.39,
    axialTiltDeg: 177.4,
    gravity: '8.87 m/s2',
    escapeVelocity: '10.36 km/s',
    atmosphere: true,
    size: 0.96,
    speed: 1.62,
    fact: 'Runaway greenhouse world with sulfuric-acid clouds and crushing surface pressure.',
    reference: 'NASA Solar System Exploration - Venus',
  },
  {
    name: 'Earth',
    group: 'Terrestrial planet',
    au: 1,
    radiusKm: 6371,
    moons: 1,
    orbitalPeriod: '365.25 days',
    dayLength: '23h 56m',
    color: '#4f9cff',
    accent: '#60a5fa',
    texture: 'earth',
    ecc: 0.0167,
    inclinationDeg: 0,
    axialTiltDeg: 23.44,
    gravity: '9.81 m/s2',
    escapeVelocity: '11.19 km/s',
    atmosphere: true,
    size: 1,
    speed: 1,
    fact: 'Only known inhabited world, with liquid oceans, plate tectonics, and a large stabilizing Moon.',
    reference: 'NASA Solar System Exploration - Earth',
  },
  {
    name: 'Mars',
    group: 'Terrestrial planet',
    au: 1.524,
    radiusKm: 3390,
    moons: 2,
    orbitalPeriod: '687 days',
    dayLength: '24h 37m',
    color: '#c65f36',
    accent: '#fb923c',
    texture: 'mars',
    ecc: 0.0934,
    inclinationDeg: 1.85,
    axialTiltDeg: 25.19,
    gravity: '3.71 m/s2',
    escapeVelocity: '5.03 km/s',
    size: 0.72,
    speed: 0.53,
    fact: 'Cold desert world with Olympus Mons, Valles Marineris, Phobos, and Deimos.',
    reference: 'NASA Solar System Exploration - Mars',
  },
  {
    name: 'Ceres',
    group: 'Dwarf planet',
    au: 2.77,
    radiusKm: 473,
    moons: 0,
    orbitalPeriod: '4.6 years',
    dayLength: '9.1 hours',
    color: '#a7a29a',
    accent: '#cbd5e1',
    ecc: 0.076,
    inclinationDeg: 10.6,
    axialTiltDeg: 4,
    gravity: '0.28 m/s2',
    escapeVelocity: '0.51 km/s',
    size: 0.38,
    speed: 0.22,
    fact: 'Largest object in the asteroid belt and the only dwarf planet inside Neptune.',
    reference: 'NASA Solar System Exploration - Ceres',
  },
  {
    name: 'Jupiter',
    group: 'Gas giant',
    au: 5.203,
    radiusKm: 69911,
    moons: 101,
    orbitalPeriod: '11.9 years',
    dayLength: '9h 56m',
    color: '#d49a55',
    accent: '#f8c471',
    texture: 'jupiter',
    ecc: 0.0489,
    inclinationDeg: 1.30,
    axialTiltDeg: 3.13,
    gravity: '24.79 m/s2',
    escapeVelocity: '59.5 km/s',
    size: 3.2,
    speed: 0.084,
    rings: false,
    fact: 'Largest planet; its gravity shapes the asteroid belt and many comet trajectories.',
    reference: 'NASA/JPL moon counts change as new satellites are confirmed.',
  },
  {
    name: 'Saturn',
    group: 'Gas giant',
    au: 9.537,
    radiusKm: 58232,
    moons: 285,
    orbitalPeriod: '29.5 years',
    dayLength: '10h 33m',
    color: '#e8cf91',
    accent: '#fde68a',
    texture: 'saturn',
    ecc: 0.0565,
    inclinationDeg: 2.49,
    axialTiltDeg: 26.73,
    gravity: '10.44 m/s2',
    escapeVelocity: '35.5 km/s',
    size: 2.75,
    speed: 0.034,
    rings: true,
    fact: 'Ringed giant with the largest known planetary moon system in current 2026 reports.',
    reference: 'NASA and MPC moon counts are updated as small irregular moons are confirmed.',
  },
  {
    name: 'Uranus',
    group: 'Ice giant',
    au: 19.191,
    radiusKm: 25362,
    moons: 29,
    orbitalPeriod: '84 years',
    dayLength: '17h 14m',
    color: '#8ce9e7',
    accent: '#67e8f9',
    texture: 'uranus',
    ecc: 0.0463,
    inclinationDeg: 0.77,
    axialTiltDeg: 97.77,
    gravity: '8.69 m/s2',
    escapeVelocity: '21.3 km/s',
    size: 2.05,
    speed: 0.012,
    rings: true,
    fact: 'An ice giant tipped on its side, with extreme seasons and faint rings.',
    reference: 'NASA Solar System Exploration - Uranus',
  },
  {
    name: 'Neptune',
    group: 'Ice giant',
    au: 30.07,
    radiusKm: 24622,
    moons: 16,
    orbitalPeriod: '164.8 years',
    dayLength: '16h 6m',
    color: '#4169e1',
    accent: '#93c5fd',
    texture: 'neptune',
    ecc: 0.009,
    inclinationDeg: 1.77,
    axialTiltDeg: 28.32,
    gravity: '11.15 m/s2',
    escapeVelocity: '23.5 km/s',
    size: 1.95,
    speed: 0.006,
    fact: 'Distant ice giant with supersonic winds and the captured moon Triton.',
    reference: 'NASA Solar System Exploration - Neptune',
  },
  {
    name: 'Pluto',
    group: 'Dwarf planet / Kuiper belt',
    au: 39.48,
    radiusKm: 1188,
    moons: 5,
    orbitalPeriod: '248 years',
    dayLength: '6.4 Earth days',
    color: '#d8c0a7',
    accent: '#f8d3ad',
    texture: 'pluto',
    ecc: 0.2488,
    inclinationDeg: 17.16,
    axialTiltDeg: 119.6,
    gravity: '0.62 m/s2',
    escapeVelocity: '1.21 km/s',
    size: 0.52,
    speed: 0.0035,
    fact: 'Complex Kuiper-belt world with nitrogen ice plains and the large moon Charon.',
    reference: 'NASA New Horizons / Pluto system',
  },
  {
    name: 'Haumea',
    group: 'Dwarf planet / Kuiper belt',
    au: 43.2,
    radiusKm: 816,
    moons: 2,
    orbitalPeriod: '284 years',
    dayLength: '3.9 hours',
    color: '#dbeafe',
    accent: '#bfdbfe',
    ecc: 0.19,
    inclinationDeg: 28.2,
    axialTiltDeg: 126,
    gravity: '0.44 m/s2',
    escapeVelocity: '0.84 km/s',
    size: 0.44,
    speed: 0.003,
    fact: 'Fast-spinning elongated dwarf planet with a ring and two known moons.',
    reference: 'IAU dwarf planet data',
  },
  {
    name: 'Makemake',
    group: 'Dwarf planet / Kuiper belt',
    au: 45.8,
    radiusKm: 715,
    moons: 1,
    orbitalPeriod: '306 years',
    dayLength: '22.5 hours',
    color: '#c7b49a',
    accent: '#f1c27d',
    ecc: 0.16,
    inclinationDeg: 29.0,
    axialTiltDeg: 0,
    gravity: '0.50 m/s2',
    escapeVelocity: '0.80 km/s',
    size: 0.43,
    speed: 0.0028,
    fact: 'Bright trans-Neptunian dwarf planet with methane ice on its surface.',
    reference: 'IAU dwarf planet data',
  },
  {
    name: 'Eris',
    group: 'Dwarf planet / scattered disk',
    au: 67.8,
    radiusKm: 1163,
    moons: 1,
    orbitalPeriod: '559 years',
    dayLength: '25.9 hours',
    color: '#eef2ff',
    accent: '#c4b5fd',
    ecc: 0.44,
    inclinationDeg: 44.0,
    axialTiltDeg: 78,
    gravity: '0.82 m/s2',
    escapeVelocity: '1.38 km/s',
    size: 0.52,
    speed: 0.0016,
    fact: 'Massive scattered-disk dwarf planet whose discovery helped redefine planet status.',
    reference: 'IAU dwarf planet data',
  },
];

const REGIONS = [
  { name: 'Asteroid belt', innerAu: 2.1, outerAu: 3.3, color: '#cbd5e1', count: 1800, spread: 0.8, shape: 'disk' },
  { name: 'Jupiter trojans', innerAu: 5.05, outerAu: 5.35, color: '#fbbf24', count: 640, spread: 0.55, shape: 'arcs' },
  { name: 'Kuiper belt', innerAu: 30, outerAu: 50, color: '#93c5fd', count: 1800, spread: 1.3, shape: 'disk' },
  { name: 'Scattered disk', innerAu: 50, outerAu: 120, color: '#c4b5fd', count: 1000, spread: 2.8, shape: 'disk' },
  { name: 'Heliopause', innerAu: 120, outerAu: 120, color: '#22d3ee', count: 0, spread: 0, shape: 'shell' },

  // Visual marker counts only. The Oort Cloud has not been directly imaged or counted.
  // This uses a seeded, broad spherical distribution rather than a measured density law.
  { name: 'Inner Oort Cloud / Hills cloud', innerAu: 1000, outerAu: 20000, color: '#dbeafe', count: 3200, spread: 34, shape: 'shell' },
  { name: 'Outer Oort Cloud', innerAu: 20000, outerAu: 100000, color: '#e0f2fe', count: 6500, spread: 52, shape: 'shell' },
];

const SCALE_MARKERS = [
  { name: 'Earth orbit', au: 1, note: '1 AU baseline' },
  { name: 'Mars', au: 1.524, note: 'inner rocky system' },
  { name: 'Jupiter', au: 5.203, note: 'giant-planet gravity well' },
  { name: 'Saturn', au: 9.537, note: 'ringed giant' },
  { name: 'Neptune', au: 30.07, note: 'last major planet' },
  { name: 'Kuiper belt edge', au: 50, note: 'icy trans-Neptunian belt' },
  { name: 'Heliopause', au: 120, note: 'solar wind boundary' },
  { name: 'Main Oort inner edge', au: 1000, note: 'NASA scale estimate' },
  { name: 'Hills cloud reservoir', au: 20000, note: 'dense inner Oort model' },
  { name: 'Oort outer edge', au: 100000, note: 'solar-gravity frontier' },
  { name: 'Proxima Centauri', au: 268550, note: 'nearest stellar system' },
];

const VIEW_PRESETS = [
  { key: 'inner', label: 'Inner', camera: [0, 52, 92], target: [0, 0, 0], scaleMode: 'inner', note: 'Mercury through Mars' },
  { key: 'giants', label: 'Giants', camera: [0, 96, 178], target: [0, 0, 0], scaleMode: 'log', note: 'Jupiter to Neptune' },
  { key: 'kuiper', label: 'Kuiper', camera: [0, 132, 245], target: [0, 0, 0], scaleMode: 'log', note: 'TNO belt and Plutoids' },
  { key: 'heliopause', label: 'Heliopause', camera: [0, 170, 330], target: [0, 0, 0], scaleMode: 'log', note: 'Voyager-scale boundary' },
  { key: 'oort', label: 'Oort', camera: [0, 188, 382], target: [0, 0, 0], scaleMode: 'log', note: 'Modelled Oort Cloud projection' },
];

function auToScene(au, scaleMode) {
  if (scaleMode === 'inner') return Math.sqrt(au) * 17;
  return Math.log10(au + 1) * 38;
}

function orbitVector(au, eccentricity, inclinationDeg, angle, scaleMode, realOrbits) {
  const semiMajor = auToScene(au, scaleMode);
  if (!realOrbits) return [Math.cos(angle) * semiMajor, 0, Math.sin(angle) * semiMajor];

  const e = Math.max(0, Math.min(0.82, Number(eccentricity) || 0));
  const semiMinor = semiMajor * Math.sqrt(1 - e * e);
  const x = semiMajor * (Math.cos(angle) - e);
  const zFlat = semiMinor * Math.sin(angle);
  const inclination = (Number(inclinationDeg) || 0) * Math.PI / 180;
  return [
    x,
    Math.sin(inclination) * zFlat,
    Math.cos(inclination) * zFlat,
  ];
}

function numberFmt(value) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: value < 10 ? 2 : 0 }).format(value);
}

function formatLightTime(au) {
  const minutes = au * AU_LIGHT_MINUTES;
  if (minutes < 120) return `${minutes.toFixed(minutes < 10 ? 1 : 0)} light-min`;
  const hours = minutes / 60;
  if (hours < 72) return `${hours.toFixed(hours < 10 ? 1 : 0)} light-hr`;
  const days = hours / 24;
  if (days < 365) return `${days.toFixed(days < 10 ? 1 : 0)} light-days`;
  return `${(au / AU_PER_LIGHT_YEAR).toFixed(2)} light-years`;
}

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function regionSeed(name) {
  return String(name).split('').reduce((hash, char) => ((hash * 31) + char.charCodeAt(0)) % 2147483647, 17);
}

function getInitialViewPreset() {
  if (typeof window === 'undefined') return 'giants';
  const preset = new URLSearchParams(window.location.search).get('view');
  return VIEW_PRESETS.some((item) => item.key === preset) ? preset : 'giants';
}


function useCompactViewport() {
  const [compact, setCompact] = useState(() => (
    typeof window !== 'undefined' ? window.innerWidth < 760 : false
  ));

  useEffect(() => {
    const update = () => setCompact(window.innerWidth < 760);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return compact;
}

function useMoonCounts() {
  const [moonCounts, setMoonCounts] = useState(MOON_COUNT_SNAPSHOT.counts);
  const [moonMeta, setMoonMeta] = useState({
    source: MOON_COUNT_SNAPSHOT.source,
    asOf: MOON_COUNT_SNAPSHOT.asOf,
    refreshedAt: null,
    isSnapshot: true,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function refreshSnapshot() {
      try {
        const response = await fetch(moonCountDataUrl(), {
          signal: controller.signal,
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Moon-count snapshot request failed (${response.status})`);
        }

        const payload = await response.json();
        const incoming = payload?.counts;

        const required = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
        const valid = incoming
          && required.every((name) => Number.isInteger(incoming[name]) && incoming[name] >= 0);

        if (!valid) {
          throw new Error('Moon-count snapshot is incomplete or invalid');
        }

        if (!controller.signal.aborted) {
          setMoonCounts((previous) => ({ ...previous, ...incoming }));
          setMoonMeta({
            source: payload.source || MOON_COUNT_SNAPSHOT.source,
            asOf: payload.asOf || MOON_COUNT_SNAPSHOT.asOf,
            refreshedAt: new Date().toISOString(),
            isSnapshot: true,
          });
        }
      } catch {
        if (!controller.signal.aborted) {
          setMoonMeta((previous) => ({
            ...previous,
            refreshedAt: new Date().toISOString(),
            isSnapshot: true,
          }));
        }
      }
    }

    refreshSnapshot();
    return () => controller.abort();
  }, []);

  return { moonCounts, moonMeta };
}

function useOptionalTexture(url, options = {}) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!url || typeof window === 'undefined') {
      setTexture(null);
      return undefined;
    }

    let active = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      url,
      (loaded) => {
        if (!active) return;
        loaded.colorSpace = options.linear ? THREE.NoColorSpace : THREE.SRGBColorSpace;
        loaded.anisotropy = 8;
        if (options.wrap) {
          loaded.wrapS = THREE.RepeatWrapping;
          loaded.wrapT = THREE.RepeatWrapping;
        }
        setTexture(loaded);
      },
      undefined,
      () => {
        if (active) setTexture(null);
      },
    );

    return () => {
      active = false;
    };
  }, [url, options.linear, options.wrap]);

  return texture;
}

function makeTexture(name, colorA, colorB, colorC) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, colorA);
  g.addColorStop(0.5, colorB);
  g.addColorStop(1, colorA);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (name === 'Jupiter') {
    for (let i = 0; i < 16; i += 1) {
      ctx.fillStyle = i % 2 ? 'rgba(94,45,15,0.34)' : 'rgba(255,232,170,0.28)';
      ctx.fillRect(0, i * 24, canvas.width, 12 + (i % 3) * 5);
    }
    ctx.fillStyle = 'rgba(185,67,42,0.85)';
    ctx.beginPath();
    ctx.ellipse(540, 205, 52, 28, -0.15, 0, Math.PI * 2);
    ctx.fill();
  } else if (name === 'Mars') {
    ctx.fillStyle = 'rgba(68,25,15,0.35)';
    ctx.fillRect(40, 160, 520, 28);
    for (let i = 0; i < 70; i += 1) {
      ctx.fillStyle = `rgba(80,30,12,${0.12 + Math.random() * 0.25})`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 3 + Math.random() * 20, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    for (let i = 0; i < 36; i += 1) {
      ctx.fillStyle = colorC;
      ctx.globalAlpha = 0.08 + Math.random() * 0.12;
      ctx.beginPath();
      ctx.ellipse(Math.random() * canvas.width, Math.random() * canvas.height, 20 + Math.random() * 60, 4 + Math.random() * 16, Math.random(), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}


function usePlanetTexture(body) {
  const remoteTexture = useOptionalTexture(TEXTURE_URLS[body.texture]);

  return useMemo(() => {
    if (remoteTexture) return remoteTexture;

    const colors = {
      Mercury: ['#8b8580', '#c7c0b8', 'rgba(255,255,255,0.7)'],
      Venus: ['#8b5e2c', '#e7c27c', 'rgba(255,236,189,0.9)'],
      Mars: ['#5b2318', '#bd5d33', 'rgba(255,156,96,0.8)'],
      Jupiter: ['#a7612d', '#e8bd78', 'rgba(255,220,160,0.9)'],
      Saturn: ['#b99b62', '#f3dea5', 'rgba(255,245,210,0.8)'],
      Uranus: ['#377c83', '#8ce9e7', 'rgba(220,255,255,0.7)'],
      Neptune: ['#0b1d6d', '#4169e1', 'rgba(120,170,255,0.8)'],
      Earth: ['#173f75', '#4f9cff', 'rgba(220,245,255,0.4)'],
      Pluto: ['#75604d', '#d8c0a7', 'rgba(255,255,255,0.5)'],
    }[body.name] || [body.color, body.accent, 'rgba(255,255,255,0.4)'];

    return makeTexture(body.name, colors[0], colors[1], colors[2]);
  }, [body.name, body.color, body.accent, remoteTexture]);
}

function OrbitRing({
  au,
  color = 'rgba(255,255,255,0.18)',
  scaleMode,
  label,
  showLabel,
  eccentricity = 0,
  inclinationDeg = 0,
  realOrbits = false,
}) {
  const radius = auToScene(au, scaleMode);
  const points = useMemo(() => {
    const output = [];
    for (let i = 0; i <= 256; i += 1) {
      const t = (i / 256) * Math.PI * 2;
      output.push(orbitVector(au, eccentricity, inclinationDeg, t, scaleMode, realOrbits));
    }
    return output;
  }, [au, eccentricity, inclinationDeg, realOrbits, scaleMode]);

  return (
    <group>
      <Line points={points} color={color} transparent opacity={0.32} lineWidth={0.6} />
      {showLabel && (
        <Html position={[radius, 0.15, 0]} center distanceFactor={110}>
          <span style={{
            color: 'rgba(255,255,255,0.52)',
            fontFamily: 'Space Grotesk, Inter, sans-serif',
            fontSize: 10,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>{label}</span>
        </Html>
      )}
    </group>
  );
}

function makeSolarFallbackTexture() {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const random = seededRandom(20260622);

  const background = ctx.createLinearGradient(0, 0, 0, canvas.height);
  background.addColorStop(0, '#e97812');
  background.addColorStop(0.5, '#ffca43');
  background.addColorStop(1, '#e45b0c');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fallback only: soft multi-scale granulation without synthetic line patterns.
  for (let i = 0; i < 2200; i += 1) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    const radius = 1.8 + random() * (i % 7 === 0 ? 14 : 6);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(255, ${185 + Math.floor(random() * 65)}, ${72 + Math.floor(random() * 70)}, ${0.16 + random() * 0.28})`);
    gradient.addColorStop(0.7, `rgba(218, 70, 8, ${0.03 + random() * 0.09})`);
    gradient.addColorStop(1, 'rgba(90, 12, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 10; i += 1) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    const rx = 10 + random() * 24;
    const ry = 5 + random() * 12;
    ctx.fillStyle = 'rgba(92, 18, 1, 0.34)';
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function Sun({ scale = 1 }) {
  const ref = useRef();
  const observedTexture = useOptionalTexture(TEXTURE_URLS.sun);
  const fallbackTexture = useMemo(() => makeSolarFallbackTexture(), []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.018;
  });

  return (
    <group scale={scale}>
      <pointLight intensity={2.25} distance={240} decay={1.45} color="#fff3d2" />

      <mesh ref={ref}>
        <sphereGeometry args={[4.15, 96, 96]} />
        <meshBasicMaterial
          map={observedTexture || fallbackTexture || null}
          color={observedTexture ? '#fff0bd' : '#ffffff'}
        />
      </mesh>

      {/* Very small corona only: no large opaque glow shells. */}
      <mesh scale={1.022}>
        <sphereGeometry args={[4.15, 72, 72]} />
        <meshBasicMaterial
          color="#ffd37d"
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function SaturnRings({ size, color }) {
  const ringTexture = useOptionalTexture(TEXTURE_URLS.saturnRing, { linear: true, wrap: true });
  return (
    <group rotation={[0.44, 0, 0.08]}>
      <mesh>
        <ringGeometry args={[size * 1.28, size * 2.35, 128]} />
        <meshBasicMaterial map={ringTexture || null} alphaMap={ringTexture || null} color={color} transparent opacity={0.58} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <ringGeometry args={[size * 1.72, size * 1.84, 128]} />
        <meshBasicMaterial color="#090912" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Moon({ parentSize }) {
  const moonTexture = useOptionalTexture(TEXTURE_URLS.moon);
  const ref = useRef();

  useFrame(({ clock }) => {
    const angle = clock.getElapsedTime() * 0.45;
    if (ref.current) {
      ref.current.position.set(
        Math.cos(angle) * parentSize * 4,
        0.15,
        Math.sin(angle) * parentSize * 4,
      );
      ref.current.rotation.y += 0.004;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[parentSize * 0.27, 28, 28]} />
      <meshStandardMaterial
        map={moonTexture || null}
        color={moonTexture ? '#ffffff' : '#a3a3a3'}
        roughness={0.98}
      />
    </mesh>
  );
}

function EarthSurfaceMaterial({ map, selected }) {
  const normalMap = useOptionalTexture(TEXTURE_URLS.earthNormal, { linear: true });
  const specularMap = useOptionalTexture(TEXTURE_URLS.earthSpecular, { linear: true });

  return (
    <meshPhongMaterial
      map={map || null}
      normalMap={normalMap || null}
      specularMap={specularMap || null}
      normalScale={new THREE.Vector2(0.42, 0.42)}
      specular="#8cc8ff"
      shininess={10}
      color={selected ? '#d7ecff' : '#ffffff'}
    />
  );
}

function EarthCloudLayer({ radius }) {
  const cloudMap = useOptionalTexture(TEXTURE_URLS.earthClouds);
  const cloudRef = useRef();

  useFrame((_, delta) => {
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.018;
  });

  if (!cloudMap) return null;

  return (
    <mesh ref={cloudRef} scale={1.014}>
      <sphereGeometry args={[radius, 56, 56]} />
      <meshLambertMaterial
        map={cloudMap}
        transparent
        opacity={0.58}
        depthWrite={false}
      />
    </mesh>
  );
}

function AtmosphereShell({ body, radius }) {
  if (!body.atmosphere || body.name === 'Earth') return null;

  const colour = body.name === 'Venus' ? '#f7dc9a' : body.accent;
  const opacity = body.name === 'Venus' ? 0.16 : 0.08;

  return (
    <mesh scale={1.022}>
      <sphereGeometry args={[radius, 40, 40]} />
      <meshBasicMaterial
        color={colour}
        transparent
        opacity={opacity}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function PlanetBody({ body, scaleMode, speed, showLabels, onSelect, selected, realOrbits, sizeBoost }) {
  const group = useRef();
  const mesh = useRef();
  const angle = useRef((body.au * 1.71) % (Math.PI * 2));
  const texture = usePlanetTexture(body);
  const isSelected = selected?.name === body.name;
  const displaySize = body.size * sizeBoost;
  const displayRadius = displaySize * (isSelected ? 1.10 : 1);
  const shapeScale = BODY_SHAPES[body.name] || [1, 1, 1];

  useFrame((_, delta) => {
    angle.current += body.speed * speed * delta * 0.03;

    if (group.current) {
      group.current.position.set(
        ...orbitVector(
          body.au,
          body.ecc,
          body.inclinationDeg,
          angle.current,
          scaleMode,
          realOrbits,
        ),
      );
    }

    if (mesh.current) {
      const rotationSpeed = body.group.includes('Gas') || body.group.includes('Ice') ? 0.23 : 0.08;
      mesh.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <group>
      <OrbitRing
        au={body.au}
        label={body.name}
        showLabel={showLabels}
        color={body.accent}
        scaleMode={scaleMode}
        eccentricity={body.ecc}
        inclinationDeg={body.inclinationDeg}
        realOrbits={realOrbits}
      />

      <group ref={group}>
        <mesh
          ref={mesh}
          scale={shapeScale}
          rotation={[0, 0, -(body.axialTiltDeg || 0) * Math.PI / 180]}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(body);
          }}
          onPointerOver={(event) => {
            event.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        >
          <sphereGeometry args={[displayRadius, 64, 64]} />

          {body.name === 'Earth' ? (
            <EarthSurfaceMaterial map={texture} selected={isSelected} />
          ) : (
            <meshStandardMaterial
              color={body.color}
              map={texture || null}
              roughness={body.group.includes('Gas') || body.group.includes('Ice') ? 0.62 : 0.92}
              metalness={0}
              emissive={isSelected ? body.accent : '#000000'}
              emissiveIntensity={isSelected ? 0.08 : 0}
            />
          )}
        </mesh>

        {body.name === 'Earth' && <EarthCloudLayer radius={displayRadius} />}
        <AtmosphereShell body={body} radius={displayRadius} />
        {body.rings && <SaturnRings size={displayRadius} color={body.accent} />}
        {body.name === 'Earth' && <Moon parentSize={displayRadius} />}

        {(showLabels || isSelected) && (
          <Html position={[0, displayRadius + 1.1, 0]} center distanceFactor={95}>
            <button
              type="button"
              onClick={() => onSelect(body)}
              style={{
                border: `1px solid ${body.accent}66`,
                background: 'rgba(5,8,18,0.86)',
                color: '#ffffff',
                borderRadius: 999,
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 800,
                whiteSpace: 'nowrap',
                fontFamily: 'Space Grotesk, Inter, sans-serif',
                boxShadow: isSelected ? `0 0 18px ${body.accent}55` : 'none',
                cursor: 'pointer',
              }}
            >
              {body.name}
            </button>
          </Html>
        )}
      </group>
    </group>
  );
}

function makeSoftPointSprite() {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
  gradient.addColorStop(0.24, 'rgba(228,242,255,0.78)');
  gradient.addColorStop(0.60, 'rgba(180,215,255,0.18)');
  gradient.addColorStop(1, 'rgba(180,215,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function DustRegion({ region, scaleMode, visible, densityMultiplier = 1 }) {
  const particleCount = Math.max(0, Math.floor(region.count * densityMultiplier));
  const softSprite = useMemo(() => makeSoftPointSprite(), []);

  const { positions, colors } = useMemo(() => {
    const positionData = new Float32Array(particleCount * 3);
    const colourData = new Float32Array(particleCount * 3);
    const inner = auToScene(region.innerAu, scaleMode);
    const outer = auToScene(region.outerAu || region.innerAu, scaleMode);
    const random = seededRandom(regionSeed(`${region.name}-${scaleMode}`));
    const base = new THREE.Color(region.color);
    const isOort = region.name.includes('Oort');
    const isHills = region.name.includes('Hills');

    for (let i = 0; i < particleCount; i += 1) {
      if (region.shape === 'shell') {
        const theta = random() * Math.PI * 2;
        const cosPhi = random() * 2 - 1;
        const sinPhi = Math.sqrt(1 - (cosPhi * cosPhi));

        // A deliberately broad, seeded model distribution.
        // It is not a fitted Oort-cloud density law because the cloud is not directly mapped.
        const radialFraction = isHills
          ? Math.pow(random(), 0.72)
          : Math.cbrt(random());
        const radius = inner + ((outer - inner) * radialFraction);

        positionData[i * 3] = sinPhi * Math.cos(theta) * radius;
        positionData[i * 3 + 1] = cosPhi * radius;
        positionData[i * 3 + 2] = sinPhi * Math.sin(theta) * radius;
      } else if (region.shape === 'arcs') {
        const l4 = Math.PI / 3;
        const l5 = -Math.PI / 3;
        const centre = random() > 0.5 ? l4 : l5;
        const phase = centre + ((random() - 0.5) * 0.78);
        const radius = inner + (random() * Math.max(0.2, outer - inner));

        positionData[i * 3] = Math.cos(phase) * radius;
        positionData[i * 3 + 1] = (random() - 0.5) * region.spread;
        positionData[i * 3 + 2] = Math.sin(phase) * radius;
      } else {
        const phase = random() * Math.PI * 2;
        const radius = inner + (random() * Math.max(0.2, outer - inner));

        positionData[i * 3] = Math.cos(phase) * radius;
        positionData[i * 3 + 1] = (random() - 0.5) * region.spread;
        positionData[i * 3 + 2] = Math.sin(phase) * radius;
      }

      const brightness = isOort ? 0.48 + (random() * 0.46) : 0.56 + (random() * 0.38);
      colourData[i * 3] = base.r * brightness;
      colourData[i * 3 + 1] = base.g * brightness;
      colourData[i * 3 + 2] = base.b * brightness;
    }

    return { positions: positionData, colors: colourData };
  }, [particleCount, region, scaleMode]);

  if (!visible || particleCount === 0) return null;

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        map={softSprite || null}
        alphaMap={softSprite || null}
        vertexColors
        size={region.name.includes('Oort') ? 0.19 : 0.095}
        transparent
        opacity={region.name.includes('Oort') ? 0.54 : 0.55}
        alphaTest={0.02}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

function ShellGuide({ radius, color, opacity = 0.2, meridians = true }) {
  const equator = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 256; i += 1) {
      const t = (i / 256) * Math.PI * 2;
      points.push([Math.cos(t) * radius, 0, Math.sin(t) * radius]);
    }
    return points;
  }, [radius]);

  const verticalA = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 256; i += 1) {
      const t = (i / 256) * Math.PI * 2;
      points.push([Math.cos(t) * radius, Math.sin(t) * radius, 0]);
    }
    return points;
  }, [radius]);

  const verticalB = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 256; i += 1) {
      const t = (i / 256) * Math.PI * 2;
      points.push([0, Math.sin(t) * radius, Math.cos(t) * radius]);
    }
    return points;
  }, [radius]);

  return (
    <group>
      <Line points={equator} color={color} transparent opacity={opacity} lineWidth={0.75} />
      {meridians && (
        <>
          <Line points={verticalA} color={color} transparent opacity={opacity * 0.48} lineWidth={0.55} />
          <Line points={verticalB} color={color} transparent opacity={opacity * 0.36} lineWidth={0.5} />
        </>
      )}
    </group>
  );
}

function TrojanArcGuide({ scaleMode, showLabels }) {
  const radius = auToScene(5.203, scaleMode);

  const buildArc = (centre) => {
    const points = [];
    for (let i = 0; i <= 72; i += 1) {
      const phase = centre - 0.42 + ((i / 72) * 0.84);
      points.push([
        Math.cos(phase) * radius,
        0,
        Math.sin(phase) * radius,
      ]);
    }
    return points;
  };

  const l4 = useMemo(() => buildArc(Math.PI / 3), [radius]);
  const l5 = useMemo(() => buildArc(-Math.PI / 3), [radius]);

  return (
    <group>
      <Line points={l4} color="#fbbf24" transparent opacity={0.36} lineWidth={0.7} />
      <Line points={l5} color="#fbbf24" transparent opacity={0.36} lineWidth={0.7} />
      {showLabels && (
        <>
          <Html position={[Math.cos(Math.PI / 3) * radius, 0.25, Math.sin(Math.PI / 3) * radius]} center distanceFactor={110}>
            <span style={{ color: '#fbbf24', fontSize: 9, fontWeight: 800, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
              Jupiter Trojan L4
            </span>
          </Html>
          <Html position={[Math.cos(-Math.PI / 3) * radius, 0.25, Math.sin(-Math.PI / 3) * radius]} center distanceFactor={110}>
            <span style={{ color: '#fbbf24', fontSize: 9, fontWeight: 800, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
              Jupiter Trojan L5
            </span>
          </Html>
        </>
      )}
    </group>
  );
}

function RegionRing({ region, scaleMode, showLabels }) {
  if (region.shape === 'arcs') {
    return <TrojanArcGuide scaleMode={scaleMode} showLabels={showLabels} />;
  }

  const outerRadius = auToScene(region.outerAu || region.innerAu, scaleMode);
  const innerRadius = auToScene(region.innerAu, scaleMode);
  const isOort = region.name.includes('Oort');
  const isHeliopause = region.name === 'Heliopause';

  return (
    <group>
      {region.shape !== 'shell' && (
        <>
          <OrbitRing
            au={region.outerAu || region.innerAu}
            label={region.name}
            showLabel={showLabels}
            color={region.color}
            scaleMode={scaleMode}
          />
          {region.innerAu !== region.outerAu && (
            <OrbitRing
              au={region.innerAu}
              label={`${region.name} inner edge`}
              showLabel={false}
              color={region.color}
              scaleMode={scaleMode}
            />
          )}
        </>
      )}

      {region.shape === 'shell' && (
        <>
          <mesh>
            <sphereGeometry args={[Math.max(0.1, outerRadius), 64, 32]} />
            <meshBasicMaterial
              color={region.color}
              transparent
              opacity={isHeliopause ? 0.03 : isOort ? 0.009 : 0.006}
              side={THREE.BackSide}
              depthWrite={false}
            />
          </mesh>

          <ShellGuide
            radius={outerRadius}
            color={region.color}
            opacity={isHeliopause ? 0.20 : isOort ? 0.16 : 0.12}
            meridians={region.name.includes('Outer')}
          />

          {region.innerAu !== region.outerAu && (
            <ShellGuide
              radius={innerRadius}
              color={region.color}
              opacity={isOort ? 0.10 : 0.08}
              meridians={false}
            />
          )}
        </>
      )}

      {showLabels && region.shape === 'shell' && (
        <Html position={[0, 0.4, -outerRadius]} center distanceFactor={135}>
          <span style={{
            color: region.color,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            {region.name}
          </span>
        </Html>
      )}
    </group>
  );
}

function OortCloudCutaway({ scaleMode, visible, showLabels }) {
  if (!visible) return null;
  const heliopause = auToScene(120, scaleMode);
  const innerMain = auToScene(1000, scaleMode);
  const hills = auToScene(20000, scaleMode);
  const outer = auToScene(100000, scaleMode);
  const wedgeStart = -Math.PI * 0.18;
  const wedgeLength = Math.PI * 0.38;
  const rimMaterial = (color, opacity) => (
    <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={false} />
  );

  return (
    <group rotation={[0.04, -0.32, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[outer, 0.035, 8, 256]} />
        {rimMaterial('#e0f2fe', 0.26)}
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[outer, 0.026, 8, 220]} />
        {rimMaterial('#93c5fd', 0.15)}
      </mesh>
      <mesh>
        <torusGeometry args={[outer, 0.026, 8, 220]} />
        {rimMaterial('#c4b5fd', 0.13)}
      </mesh>

      <mesh rotation={[0, 0, 0.02]}>
        <circleGeometry args={[outer, 160, wedgeStart, wedgeLength]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.018} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh rotation={[0, 0, 0.02]}>
        <circleGeometry args={[hills, 120, wedgeStart, wedgeLength]} />
        <meshBasicMaterial color="#f0f9ff" transparent opacity={0.026} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <Line points={[[0, 0, 0], [Math.cos(wedgeStart) * outer, Math.sin(wedgeStart) * outer, 0]]} color="#e0f2fe" transparent opacity={0.2} lineWidth={0.5} />
      <Line points={[[0, 0, 0], [Math.cos(wedgeStart + wedgeLength) * outer, Math.sin(wedgeStart + wedgeLength) * outer, 0]]} color="#e0f2fe" transparent opacity={0.2} lineWidth={0.5} />

      <Line points={[[0, 0, 0], [innerMain, 0, 0]]} color="#67e8f9" transparent opacity={0.44} lineWidth={0.8} />

      {[heliopause, innerMain, hills, outer].map((radius, index) => (
        <mesh key={radius} rotation={[0, 0, 0.02]}>
          <ringGeometry args={[Math.max(0.01, radius - 0.035), radius + 0.035, 160, 1, wedgeStart, wedgeLength]} />
          <meshBasicMaterial color={['#22d3ee', '#bfdbfe', '#f0f9ff', '#e0f2fe'][index]} transparent opacity={[0.36, 0.28, 0.24, 0.3][index]} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}

      {showLabels && (
        <>
          <Html position={[0, 5.6, 0]} center distanceFactor={105}>
            <span style={{
              color: '#67e8f9',
              background: 'rgba(2,6,23,0.72)',
              border: '1px solid rgba(103,232,249,0.28)',
              borderRadius: 999,
              padding: '4px 10px',
              fontSize: 10,
              fontWeight: 950,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}>planetary system</span>
          </Html>
          <Html position={[innerMain, 1.4, 0]} center distanceFactor={132}>
            <span style={{
              color: '#bfdbfe',
              fontSize: 9,
              fontWeight: 900,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}>1,000 AU · inner Oort boundary</span>
          </Html>
          <Html position={[outer * 0.18, outer * 0.96, 0]} center distanceFactor={160}>
            <span style={{
              color: '#e0f2fe',
              background: 'rgba(2,6,23,0.72)',
              border: '1px solid rgba(224,242,254,0.26)',
              borderRadius: 999,
              padding: '4px 10px',
              fontSize: 10,
              fontWeight: 950,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}>outer Oort Cloud - 100,000 AU</span>
          </Html>
          <Html position={[hills * 0.58, hills * 0.62, 0]} center distanceFactor={145}>
            <span style={{
              color: '#bfdbfe',
              background: 'rgba(2,6,23,0.68)',
              border: '1px solid rgba(191,219,254,0.22)',
              borderRadius: 999,
              padding: '3px 8px',
              fontSize: 9,
              fontWeight: 900,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}>Hills cloud / inner reservoir</span>
          </Html>
        </>
      )}
    </group>
  );
}

function ScaleGrid({ scaleMode, showLabels, showRegions, showShellGuides, densityMultiplier }) {
  return (
    <>
      {REGIONS.map((region) => {
        const isShell = region.shape === 'shell';
        return (
        <React.Fragment key={region.name}>
          {showRegions && (!isShell || showShellGuides) && <RegionRing region={region} scaleMode={scaleMode} showLabels={showLabels} />}
          <DustRegion
            region={region}
            scaleMode={scaleMode}
            visible={showRegions && region.count > 0}
            densityMultiplier={densityMultiplier}
/>
        </React.Fragment>
        );
      })}
      <OortCloudCutaway scaleMode={scaleMode} visible={showRegions && showShellGuides} showLabels={showLabels} />
    </>
  );
}

function CameraDirector({ presetKey, trigger, cancelTrigger }) {
  const { camera, controls } = useThree();
  const animation = useRef(null);

  useEffect(() => {
    if (!trigger) return undefined;

    const preset = VIEW_PRESETS.find((item) => item.key === presetKey);
    if (!preset) return undefined;

    animation.current = {
      startedAt: performance.now(),
      duration: 1500,
      fromPosition: camera.position.clone(),
      toPosition: new THREE.Vector3(...preset.camera),
      fromTarget: controls?.target?.clone?.() || new THREE.Vector3(0, 0, 0),
      toTarget: new THREE.Vector3(...preset.target),
    };

    return undefined;
  }, [camera, controls, presetKey, trigger]);

  useEffect(() => {
    if (cancelTrigger) animation.current = null;
  }, [cancelTrigger]);

  useFrame(() => {
    if (!animation.current) return;

    const now = performance.now();
    const t = Math.min(1, (now - animation.current.startedAt) / animation.current.duration);
    const eased = 1 - Math.pow(1 - t, 3);

    camera.position.lerpVectors(
      animation.current.fromPosition,
      animation.current.toPosition,
      eased,
    );

    if (controls?.target) {
      controls.target.lerpVectors(
        animation.current.fromTarget,
        animation.current.toTarget,
        eased,
      );
      controls.update?.();
    }

    if (t >= 1) animation.current = null;
  });

  return null;
}

function Scene({
  speed,
  scaleMode,
  showLabels,
  showRegions,
  showShellGuides,
  selected,
  onSelect,
  realOrbits,
  sizeBoost,
  viewPreset,
  guidedCameraTick,
  manualCameraTick,
  particleDensity,
  onManualCameraStart,
}) {
  return (
    <>
      <color attach="background" args={[palette.bg]} />
      <Stars radius={460} depth={90} count={6500} factor={2.0} saturation={0.18} fade speed={0.10} />
      <ambientLight intensity={0.075} color="#1a2948" />
      <hemisphereLight intensity={0.10} color="#7898c6" groundColor="#03030a" />
      <CameraDirector presetKey={viewPreset} trigger={guidedCameraTick} cancelTrigger={manualCameraTick} />
      <Sun scale={viewPreset === 'oort' ? 1.18 : 1} />
      <ScaleGrid
        scaleMode={scaleMode}
        showLabels={showLabels}
        showRegions={showRegions}
        showShellGuides={showShellGuides}
        densityMultiplier={particleDensity}
      />
      {SYSTEM_OBJECTS.map((body) => (
        <PlanetBody
          key={body.name}
          body={body}
          scaleMode={scaleMode}
          speed={speed}
          showLabels={showLabels}
          selected={selected}
          onSelect={onSelect}
          realOrbits={realOrbits}
          sizeBoost={sizeBoost * (viewPreset === 'oort' ? 1.18 : 1)}
        />
      ))}
      <EffectComposer>
        <Bloom luminanceThreshold={1.10} luminanceSmoothing={0.72} intensity={0.52} radius={0.42} />
      </EffectComposer>
      <OrbitControls
        makeDefault
        enableZoom
        enablePan
        enableDamping
        dampingFactor={0.06}
        minDistance={10}
        maxDistance={860}
        onStart={onManualCameraStart}
      />
    </>
  );
}

function InfoPanel({ selected, onClose, moonMeta }) {
  if (!selected) return null;

  const science = BODY_SCIENCE[selected.name] || null;
  const diameter = selected.radiusKm * 2;
  const distanceKm = selected.au * AU_KM;
  const moonLabel =
    typeof selected.moons === 'number'
      ? `${selected.moons} ${selected.moons === 1 ? 'moon' : 'moons'}`
      : '—';

  return (
    <aside className="solar-info-panel" style={{
      position: 'absolute',
      top: 86,
      right: 20,
      width: 330,
      maxHeight: 'calc(100vh - 132px)',
      overflowY: 'auto',
      zIndex: 30,
      color: '#fff',
      background: palette.panelStrong,
      border: `1px solid ${selected.accent}55`,
      borderRadius: 20,
      padding: '1rem 1.1rem',
      backdropFilter: 'blur(24px)',
      boxShadow: `0 0 60px ${selected.accent}22`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: selected.accent, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.13em', fontWeight: 800 }}>
            {selected.group}
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', fontSize: '1.65rem', lineHeight: 1, marginTop: 4 }}>
            {selected.name}
          </h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close object details" style={{
          width: 30,
          height: 30,
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.75)',
          cursor: 'pointer',
        }}>
          ×
        </button>
      </div>

      <p style={{ margin: '0.85rem 0 0.6rem', color: 'rgba(255,255,255,0.66)', fontSize: 13, lineHeight: 1.58 }}>
        {selected.fact}
      </p>

      {science && (
        <div style={{
          marginBottom: 12,
          padding: '0.65rem',
          borderRadius: 12,
          border: `1px solid ${selected.accent}2e`,
          background: 'rgba(255,255,255,0.035)',
          fontSize: 11,
          lineHeight: 1.52,
        }}>
          <div style={{ color: selected.accent, fontSize: 10, fontWeight: 900, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 4 }}>
            Visual and physical basis
          </div>
          <div style={{ color: 'rgba(255,255,255,0.70)' }}>{science.visual}</div>
          <div style={{ color: 'rgba(255,255,255,0.48)', marginTop: 5 }}>{science.composition}</div>
        </div>
      )}

      <div style={{ display: 'grid', gap: 8 }}>
        {[
          ['Mean distance', `${selected.au} AU`],
          ['Distance from Sun', `${numberFmt(distanceKm)} km`],
          ['Sunlight travel time', formatLightTime(selected.au)],
          ['Diameter', `${numberFmt(diameter)} km`],
          ['Radius', `${(selected.radiusKm / EARTH_RADIUS_KM).toFixed(2)} Earth radii`],
          ['Known moons', moonLabel],
          ['Orbital period', selected.orbitalPeriod],
          ['Day length', selected.dayLength],
          ['Eccentricity', selected.ecc?.toFixed(4) ?? 'n/a'],
          ['Inclination', `${selected.inclinationDeg ?? 0} deg`],
          ['Axial tilt', `${selected.axialTiltDeg ?? 0} deg`],
          ['Surface gravity', selected.gravity || 'n/a'],
          ['Escape velocity', selected.escapeVelocity || 'n/a'],
        ].map(([label, value]) => (
          <div key={label} style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            paddingBottom: 7,
            fontSize: 12,
          }}>
            <span style={{ color: 'rgba(255,255,255,0.42)' }}>{label}</span>
            <strong style={{ color: selected.accent, textAlign: 'right' }}>{value}</strong>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 12,
        padding: '0.65rem',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.04)',
        color: 'rgba(255,255,255,0.47)',
        fontSize: 11,
        lineHeight: 1.5,
      }}>
        Moon-count snapshot: {moonMeta?.asOf || MOON_COUNT_SNAPSHOT.asOf}.<br />
        Source: {moonMeta?.source || MOON_COUNT_SNAPSHOT.source}.<br />
        Reloading the page requests the newest deployed snapshot; counts can change as small irregular satellites are confirmed.
      </div>
    </aside>
  );
}

function MissionPanel({ selected, scaleMode, realOrbits, viewPreset }) {
  if (viewPreset === 'oort') return null;
  const nearest = selected || SYSTEM_OBJECTS[2];
  return (
    <section className="solar-mission-panel" style={{
      position: 'absolute',
      top: 86,
      left: 20,
      width: 320,
      zIndex: 25,
      color: '#fff',
      background: palette.panel,
      border: `1px solid ${palette.border}`,
      borderRadius: 20,
      padding: '1rem',
      backdropFilter: 'blur(22px)',
    }}>
      <div style={{ color: palette.cyan, fontWeight: 900, letterSpacing: '0.14em', fontSize: 11, textTransform: 'uppercase' }}>AstroBis Solar System</div>
      <h1 style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', fontSize: '1.7rem', lineHeight: 1.05, margin: '0.35rem 0 0.6rem' }}>Real-distance atlas, compressed for navigation</h1>
      <p style={{ color: palette.muted, fontSize: 12, lineHeight: 1.55 }}>
        Planet positions use a logarithmic AU scale so the inner system, Kuiper belt, heliopause, and Oort Cloud can share one explorable scene.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
        {[
          ['Scale', scaleMode === 'inner' ? 'Inner zoom' : 'Log AU'],
          ['Orbit model', realOrbits ? 'Eccentric' : 'Circular'],
          ['Planets', '8'],
          ['Selected', nearest.name],
        ].map(([k, v]) => (
          <div key={k} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '0.6rem', background: 'rgba(255,255,255,0.035)' }}>
            <div style={{ color: 'rgba(255,255,255,0.36)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{k}</div>
            <div style={{ fontWeight: 900, color: '#fff', marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScaleRuler({ visible, scaleMode }) {
  if (!visible) return null;
  return (
    <aside className="solar-scale-ruler" style={{
      position: 'absolute',
      left: 20,
      bottom: 112,
      zIndex: 26,
      width: 'min(520px, calc(100vw - 40px))',
      color: '#fff',
      border: '1px solid rgba(103,232,249,0.18)',
      background: 'rgba(2,6,23,0.82)',
      borderRadius: 18,
      padding: '0.9rem 1rem',
      backdropFilter: 'blur(22px)',
      boxShadow: '0 18px 70px rgba(0,0,0,0.34)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 10, alignItems: 'baseline' }}>
        <div>
          <div style={{ color: '#67e8f9', fontSize: 11, fontWeight: 950, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Astronomical-unit ladder</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 3 }}>1 AU = 149,597,870.7 km = about 8.3 light-minutes</div>
        </div>
        <span style={{ color: '#c4b5fd', fontSize: 11, fontWeight: 900 }}>{scaleMode === 'inner' ? 'inner zoom' : 'log scale'}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(118px, 1fr))', gap: 8 }}>
        {SCALE_MARKERS.slice(0, 10).map((marker) => (
          <div key={marker.name} style={{
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.035)',
            borderRadius: 12,
            padding: '0.52rem',
          }}>
            <div style={{ color: '#fff', fontSize: 11, fontWeight: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{marker.name}</div>
            <div style={{ color: '#93c5fd', fontSize: 12, fontWeight: 900, marginTop: 3 }}>{numberFmt(marker.au)} AU</div>
            <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10 }}>{formatLightTime(marker.au)}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function OortResearchPanel({ activePreset }) {
  const preset = VIEW_PRESETS.find((item) => item.key === activePreset) || VIEW_PRESETS[0];
  const oortActive = activePreset === 'oort' || activePreset === 'heliopause';

  const description = oortActive
    ? 'The Oort Cloud has not been directly imaged. This is a physically motivated scale model using seeded, unresolved comet-nucleus markers, reference shells, and an optional cutaway — not a measured density map.'
    : 'Choose a scale preset to change the atlas context. The camera remains under manual control until Guided flyby is selected.';

  return (
    <aside className="oort-research-panel" style={{
      position: 'absolute',
      top: 86,
      left: oortActive ? 24 : '50%',
      transform: oortActive ? 'none' : 'translateX(-50%)',
      zIndex: 24,
      width: oortActive ? 'min(410px, calc(100vw - 48px))' : 'min(520px, calc(100vw - 40px))',
      pointerEvents: 'none',
      color: '#fff',
      border: `1px solid ${oortActive ? 'rgba(224,242,254,0.26)' : 'rgba(255,255,255,0.08)'}`,
      background: oortActive ? 'rgba(5,10,22,0.56)' : 'rgba(5,8,18,0.54)',
      borderRadius: 18,
      padding: '0.85rem 1rem',
      backdropFilter: 'blur(18px)',
      boxShadow: oortActive ? '0 18px 70px rgba(0,0,0,0.26)' : 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ color: oortActive ? '#e0f2fe' : '#a78bfa', fontSize: 11, fontWeight: 950, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            {oortActive ? 'Modelled Oort Cloud projection' : 'Scale view'}
          </div>
          <div style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', fontSize: '1rem', fontWeight: 900, marginTop: 3 }}>
            {preset.note}
          </div>
        </div>
        {oortActive && (
          <div style={{ color: 'rgba(255,255,255,0.42)', fontSize: 11, textAlign: 'right' }}>
            NASA scale context<br />1,000–100,000 AU
          </div>
        )}
      </div>

      <p style={{ marginTop: 9, color: 'rgba(255,255,255,0.58)', fontSize: 12, lineHeight: 1.55 }}>
        {description}
      </p>
    </aside>
  );
}

function ControlBar({ speed, setSpeed, scaleMode, setScaleMode, showLabels, setShowLabels, showRegions, setShowRegions, showShellGuides, setShowShellGuides, realOrbits, setRealOrbits, sizeBoost, setSizeBoost, showRuler, setShowRuler, viewPreset, setViewPreset, startGuidedFlyby }) {
  const controlStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.14)',
    color: '#fff',
    borderRadius: 999,
    padding: '0.48rem 0.75rem',
    fontSize: 12,
    fontWeight: 800,
  };
  return (
    <div className="solar-control-bar" style={{
      position: 'absolute',
      left: '50%',
      bottom: 26,
      transform: 'translateX(-50%)',
      zIndex: 35,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
      justifyContent: 'center',
      width: 'min(920px, calc(100% - 32px))',
      padding: '0.75rem 1rem',
      borderRadius: 999,
      background: 'rgba(5,8,18,0.82)',
      border: '1px solid rgba(255,255,255,0.12)',
      backdropFilter: 'blur(24px)',
      boxShadow: '0 16px 60px rgba(0,0,0,0.32)',
    }}>
      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: '0.12em', fontWeight: 900 }}>TIME WARP</span>
      <input aria-label="Simulation speed" type="range" min="0" max="8" step="0.1" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} style={{ width: 120 }} />
      <strong style={{ color: palette.violet, minWidth: 42 }}>{speed.toFixed(1)}x</strong>
      <div style={{ display: 'flex', gap: 5, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, padding: 4, background: 'rgba(255,255,255,0.035)' }}>
        {VIEW_PRESETS.map((preset) => (
          <button
            key={preset.key}
            type="button"
            onClick={() => {
              setViewPreset(preset.key);
              setScaleMode(preset.scaleMode);
              if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                url.searchParams.set('view', preset.key);
                window.history.replaceState(null, '', url);
              }
            }}
            style={{
              border: 'none',
              borderRadius: 999,
              padding: '0.4rem 0.62rem',
              color: viewPreset === preset.key ? '#020617' : 'rgba(255,255,255,0.68)',
              background: viewPreset === preset.key ? '#67e8f9' : 'transparent',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 950,
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={startGuidedFlyby}
        title="Move once to the selected scale view. Manual camera control remains active afterwards."
        style={{
          ...controlStyle,
          color: '#020617',
          background: palette.cyan,
          borderColor: 'rgba(103,232,249,0.78)',
          boxShadow: '0 0 18px rgba(103,232,249,0.18)',
        }}
      >
        Guided flyby
      </button>
      <select className="astro-select" aria-label="Distance scale" value={scaleMode} onChange={(event) => setScaleMode(event.target.value)} style={controlStyle}>
        <option value="log">Log AU scale</option>
        <option value="inner">Inner-system zoom</option>
      </select>
      <select className="astro-select" aria-label="Planet size scale" value={sizeBoost} onChange={(event) => setSizeBoost(Number(event.target.value))} style={controlStyle}>
        <option value={0.75}>Survey sizes</option>
        <option value={1}>Atlas sizes</option>
        <option value={1.35}>Enhanced sizes</option>
      </select>
      <button type="button" onClick={() => setRealOrbits((value) => !value)} style={{ ...controlStyle, color: realOrbits ? palette.amber : 'rgba(255,255,255,0.58)' }}>Eccentric orbits</button>
      <button type="button" onClick={() => setShowLabels((value) => !value)} style={{ ...controlStyle, color: showLabels ? palette.cyan : 'rgba(255,255,255,0.58)' }}>Labels</button>
      <button type="button" onClick={() => setShowRegions((value) => !value)} style={{ ...controlStyle, color: showRegions ? palette.green : 'rgba(255,255,255,0.58)' }}>Belts + Oort</button>
      <button type="button" onClick={() => setShowShellGuides((value) => !value)} style={{ ...controlStyle, color: showShellGuides ? '#e0f2fe' : 'rgba(255,255,255,0.58)' }}>Shell guide</button>
      <button type="button" onClick={() => setShowRuler((value) => !value)} style={{ ...controlStyle, color: showRuler ? '#93c5fd' : 'rgba(255,255,255,0.58)' }}>AU ruler</button>
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>Manual camera is default. Choose a scale, then run Guided flyby only when wanted.</span>
    </div>
  );
}

export default function SolarSystem() {
  const [selected, setSelected] = useState(SYSTEM_OBJECTS[2]);
  const [speed, setSpeed] = useState(1.8);
  const [scaleMode, setScaleMode] = useState('log');
  const [showLabels, setShowLabels] = useState(true);
  const [showRegions, setShowRegions] = useState(true);
  const [showShellGuides, setShowShellGuides] = useState(false);
  const [showRuler, setShowRuler] = useState(true);
  const [realOrbits, setRealOrbits] = useState(true);
  const [sizeBoost, setSizeBoost] = useState(1);
  const [viewPreset, setViewPreset] = useState(getInitialViewPreset);
  const [guidedCameraTick, setGuidedCameraTick] = useState(0);
  const [manualCameraTick, setManualCameraTick] = useState(0);

  const compactViewport = useCompactViewport();
  const { moonCounts, moonMeta } = useMoonCounts();

  const selectedWithMoonCounts = useMemo(() => {
    if (!selected) return null;
    return {
      ...selected,
      moons: moonCounts[selected.name] ?? selected.moons,
    };
  }, [moonCounts, selected]);

  const startGuidedFlyby = () => {
    setGuidedCameraTick((value) => value + 1);
  };

  const cancelGuidedFlybyForManualControl = () => {
    setManualCameraTick((value) => value + 1);
  };

  useEffect(() => {
    if (viewPreset === 'oort') {
      setSelected(null);
      setShowLabels(false);
      setShowRuler(false);
      setShowShellGuides(false);
    }
  }, [viewPreset]);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', background: palette.bg, overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 78, 150], fov: 55 }} dpr={[1, 1.75]}>
        <Suspense fallback={null}>
          <Scene
            speed={speed}
            scaleMode={scaleMode}
            showLabels={showLabels}
            showRegions={showRegions}
            showShellGuides={showShellGuides}
            selected={selectedWithMoonCounts}
            onSelect={setSelected}
            realOrbits={realOrbits}
            sizeBoost={sizeBoost}
            viewPreset={viewPreset}
            guidedCameraTick={guidedCameraTick}
            manualCameraTick={manualCameraTick}
            particleDensity={compactViewport ? 0.46 : 1}
            onManualCameraStart={cancelGuidedFlybyForManualControl}
          />
        </Suspense>
      </Canvas>
      {viewPreset === 'oort' && showRegions && showShellGuides && (
        <div className="oort-density-overlay" aria-hidden="true">
          <span className="oort-density-shell oort-density-shell-outer"></span>
          <span className="oort-density-shell oort-density-shell-inner"></span>
          <span className="oort-density-shell oort-density-shell-heliosphere"></span>
        </div>
      )}
      <MissionPanel selected={selectedWithMoonCounts} scaleMode={scaleMode} realOrbits={realOrbits} viewPreset={viewPreset} />
      <OortResearchPanel activePreset={viewPreset} />
      {viewPreset !== 'oort' && (
        <InfoPanel
          selected={selectedWithMoonCounts}
          onClose={() => setSelected(null)}
          moonMeta={moonMeta}
        />
      )}
      <ScaleRuler visible={showRuler} scaleMode={scaleMode} />
      <ControlBar
        speed={speed}
        setSpeed={setSpeed}
        scaleMode={scaleMode}
        setScaleMode={setScaleMode}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        showRegions={showRegions}
        setShowRegions={setShowRegions}
        showShellGuides={showShellGuides}
        setShowShellGuides={setShowShellGuides}
        realOrbits={realOrbits}
        setRealOrbits={setRealOrbits}
        sizeBoost={sizeBoost}
        setSizeBoost={setSizeBoost}
        showRuler={showRuler}
        setShowRuler={setShowRuler}
        viewPreset={viewPreset}
        setViewPreset={setViewPreset}
        startGuidedFlyby={startGuidedFlyby}
      />
      <div style={{
        position: 'absolute',
        right: 22,
        bottom: 22,
        zIndex: 20,
        color: 'rgba(255,255,255,0.24)',
        fontSize: 11,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        NASA/JPL data - texture maps: Solar System Scope / Wikimedia Commons where available
      </div>
    </div>
  );
}
