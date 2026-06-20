import React, { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Html, Line, OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const AU_KM = 149597870.7;
const EARTH_RADIUS_KM = 6371;

const TEXTURE_URLS = {
  earth: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
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
    moons: 28,
    orbitalPeriod: '84 years',
    dayLength: '17h 14m',
    color: '#8ce9e7',
    accent: '#67e8f9',
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
    size: 0.52,
    speed: 0.0016,
    fact: 'Massive scattered-disk dwarf planet whose discovery helped redefine planet status.',
    reference: 'IAU dwarf planet data',
  },
];

const REGIONS = [
  { name: 'Asteroid belt', innerAu: 2.1, outerAu: 3.3, color: '#a3a3a3', count: 1200, spread: 0.8 },
  { name: 'Kuiper belt', innerAu: 30, outerAu: 50, color: '#93c5fd', count: 900, spread: 1.3 },
  { name: 'Scattered disk', innerAu: 50, outerAu: 120, color: '#c4b5fd', count: 500, spread: 2.5 },
  { name: 'Heliopause', innerAu: 120, outerAu: 120, color: '#22d3ee', count: 0, spread: 0 },
  { name: 'Inner Oort Cloud', innerAu: 2000, outerAu: 20000, color: '#f0f9ff', count: 420, spread: 25 },
  { name: 'Outer Oort Cloud', innerAu: 20000, outerAu: 100000, color: '#e0f2fe', count: 520, spread: 40 },
];

function auToScene(au, scaleMode) {
  if (scaleMode === 'inner') return Math.sqrt(au) * 17;
  return Math.log10(au + 1) * 38;
}

function numberFmt(value) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: value < 10 ? 2 : 0 }).format(value);
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
  const earth = body.texture === 'earth' ? useLoader(THREE.TextureLoader, TEXTURE_URLS.earth) : null;
  return useMemo(() => {
    if (earth) {
      earth.colorSpace = THREE.SRGBColorSpace;
      return earth;
    }
    const colors = {
      Mercury: ['#8b8580', '#c7c0b8', 'rgba(255,255,255,0.7)'],
      Venus: ['#8b5e2c', '#e7c27c', 'rgba(255,236,189,0.9)'],
      Mars: ['#5b2318', '#bd5d33', 'rgba(255,156,96,0.8)'],
      Jupiter: ['#a7612d', '#e8bd78', 'rgba(255,220,160,0.9)'],
      Saturn: ['#b99b62', '#f3dea5', 'rgba(255,245,210,0.8)'],
      Uranus: ['#377c83', '#8ce9e7', 'rgba(220,255,255,0.7)'],
      Neptune: ['#0b1d6d', '#4169e1', 'rgba(120,170,255,0.8)'],
    }[body.name] || [body.color, body.accent, 'rgba(255,255,255,0.4)'];
    return makeTexture(body.name, colors[0], colors[1], colors[2]);
  }, [body.name, body.color, body.accent, earth]);
}

function OrbitRing({ au, color = 'rgba(255,255,255,0.18)', scaleMode, label, showLabel }) {
  const radius = auToScene(au, scaleMode);
  const points = useMemo(() => {
    const output = [];
    for (let i = 0; i <= 256; i += 1) {
      const t = (i / 256) * Math.PI * 2;
      output.push([Math.cos(t) * radius, 0, Math.sin(t) * radius]);
    }
    return output;
  }, [radius]);

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

function Sun() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.05;
  });
  return (
    <group>
      <pointLight intensity={4.8} distance={300} color="#fff1b8" />
      <mesh ref={ref}>
        <sphereGeometry args={[4.4, 64, 64]} />
        <meshBasicMaterial color="#ffd166" />
      </mesh>
      <mesh>
        <sphereGeometry args={[6.6, 48, 48]} />
        <meshBasicMaterial color="#ff8a00" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[10.8, 48, 48]} />
        <meshBasicMaterial color="#ffef9a" transparent opacity={0.045} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function SaturnRings({ size, color }) {
  return (
    <group rotation={[0.44, 0, 0.08]}>
      <mesh>
        <ringGeometry args={[size * 1.28, size * 2.35, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.48} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <ringGeometry args={[size * 1.72, size * 1.84, 128]} />
        <meshBasicMaterial color="#090912" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Moon({ parentSize }) {
  const moonTexture = useLoader(THREE.TextureLoader, TEXTURE_URLS.moon);
  const ref = useRef();
  useFrame(({ clock }) => {
    const a = clock.getElapsedTime() * 0.45;
    if (ref.current) {
      ref.current.position.set(Math.cos(a) * parentSize * 4, 0.15, Math.sin(a) * parentSize * 4);
      ref.current.rotation.y += 0.004;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[parentSize * 0.27, 24, 24]} />
      <meshStandardMaterial map={moonTexture} roughness={1} />
    </mesh>
  );
}

function PlanetBody({ body, scaleMode, speed, showLabels, onSelect, selected }) {
  const group = useRef();
  const mesh = useRef();
  const angle = useRef((body.au * 1.71) % (Math.PI * 2));
  const texture = usePlanetTexture(body);
  const radius = auToScene(body.au, scaleMode);
  const isSelected = selected?.name === body.name;

  useFrame((_, delta) => {
    angle.current += body.speed * speed * delta * 0.03;
    if (group.current) {
      group.current.position.set(Math.cos(angle.current) * radius, 0, Math.sin(angle.current) * radius);
    }
    if (mesh.current) mesh.current.rotation.y += delta * (body.group.includes('Gas') ? 0.32 : 0.12);
  });

  return (
    <group>
      <OrbitRing au={body.au} label={body.name} showLabel={showLabels} color={body.accent} scaleMode={scaleMode} />
      <group ref={group}>
        <mesh
          ref={mesh}
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
          <sphereGeometry args={[body.size * (isSelected ? 1.14 : 1), 48, 48]} />
          <meshStandardMaterial
            color={body.color}
            map={texture}
            roughness={body.group.includes('Gas') || body.group.includes('Ice') ? 0.42 : 0.82}
            metalness={0}
            emissive={body.color}
            emissiveIntensity={isSelected ? 0.15 : 0.035}
          />
        </mesh>
        {body.atmosphere && (
          <mesh>
            <sphereGeometry args={[body.size * 1.08, 32, 32]} />
            <meshBasicMaterial color={body.accent} transparent opacity={0.16} side={THREE.BackSide} />
          </mesh>
        )}
        {body.rings && <SaturnRings size={body.size} color={body.accent} />}
        {body.name === 'Earth' && <Moon parentSize={body.size} />}
        {(showLabels || isSelected) && (
          <Html position={[0, body.size + 1.1, 0]} center distanceFactor={95}>
            <button
              type="button"
              onClick={() => onSelect(body)}
              style={{
                border: `1px solid ${body.accent}66`,
                background: 'rgba(5,8,18,0.82)',
                color: '#fff',
                borderRadius: 999,
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 800,
                whiteSpace: 'nowrap',
                fontFamily: 'Space Grotesk, Inter, sans-serif',
                boxShadow: `0 0 20px ${body.accent}33`,
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

function DustRegion({ region, scaleMode, visible }) {
  const positions = useMemo(() => {
    const count = region.count;
    const data = new Float32Array(count * 3);
    const inner = auToScene(region.innerAu, scaleMode);
    const outer = auToScene(region.outerAu || region.innerAu, scaleMode);
    for (let i = 0; i < count; i += 1) {
      const t = Math.random() * Math.PI * 2;
      const radius = inner + Math.random() * Math.max(0.5, outer - inner);
      data[i * 3] = Math.cos(t) * radius;
      data[i * 3 + 1] = (Math.random() - 0.5) * region.spread;
      data[i * 3 + 2] = Math.sin(t) * radius;
    }
    return data;
  }, [region, scaleMode]);

  if (!visible) return null;
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={region.count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={region.color} size={region.name.includes('Oort') ? 0.18 : 0.11} transparent opacity={0.48} sizeAttenuation />
    </points>
  );
}

function RegionRing({ region, scaleMode, showLabels }) {
  const r = auToScene(region.outerAu || region.innerAu, scaleMode);
  return (
    <group>
      <OrbitRing au={region.outerAu || region.innerAu} label={region.name} showLabel={showLabels} color={region.color} scaleMode={scaleMode} />
      {showLabels && (
        <Html position={[0, 0.4, -r]} center distanceFactor={130}>
          <span style={{
            color: region.color,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>{region.name}</span>
        </Html>
      )}
    </group>
  );
}

function ScaleGrid({ scaleMode, showLabels, showRegions }) {
  return (
    <>
      {REGIONS.map((region) => (
        <React.Fragment key={region.name}>
          <RegionRing region={region} scaleMode={scaleMode} showLabels={showLabels} />
          <DustRegion region={region} scaleMode={scaleMode} visible={showRegions && region.count > 0} />
        </React.Fragment>
      ))}
    </>
  );
}

function Scene({ speed, scaleMode, showLabels, showRegions, selected, onSelect }) {
  return (
    <>
      <color attach="background" args={[palette.bg]} />
      <Stars radius={460} depth={90} count={9000} factor={3.6} saturation={0.2} fade speed={0.16} />
      <ambientLight intensity={0.12} color="#16213f" />
      <Sun />
      <ScaleGrid scaleMode={scaleMode} showLabels={showLabels} showRegions={showRegions} />
      {SYSTEM_OBJECTS.map((body) => (
        <PlanetBody
          key={body.name}
          body={body}
          scaleMode={scaleMode}
          speed={speed}
          showLabels={showLabels}
          selected={selected}
          onSelect={onSelect}
        />
      ))}
      <EffectComposer>
        <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.85} intensity={1.8} radius={0.8} />
      </EffectComposer>
      <OrbitControls enableZoom enablePan enableDamping dampingFactor={0.06} minDistance={10} maxDistance={360} />
    </>
  );
}

function InfoPanel({ selected, onClose }) {
  if (!selected) return null;
  const diameter = selected.radiusKm * 2;
  const distanceKm = selected.au * AU_KM;
  return (
    <aside className="solar-info-panel" style={{
      position: 'absolute',
      top: 86,
      right: 20,
      width: 330,
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
          <div style={{ color: selected.accent, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.13em', fontWeight: 800 }}>{selected.group}</div>
          <h2 style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', fontSize: '1.65rem', lineHeight: 1, marginTop: 4 }}>{selected.name}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close object details" style={{
          width: 30,
          height: 30,
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.75)',
          cursor: 'pointer',
        }}>x</button>
      </div>
      <p style={{ margin: '0.9rem 0', color: 'rgba(255,255,255,0.62)', fontSize: 13, lineHeight: 1.6 }}>{selected.fact}</p>
      <div style={{ display: 'grid', gap: 8 }}>
        {[
          ['Mean distance', `${selected.au} AU`],
          ['Distance from Sun', `${numberFmt(distanceKm)} km`],
          ['Diameter', `${numberFmt(diameter)} km`],
          ['Radius', `${(selected.radiusKm / EARTH_RADIUS_KM).toFixed(2)} Earth radii`],
          ['Known moons', selected.moons],
          ['Orbital period', selected.orbitalPeriod],
          ['Day length', selected.dayLength],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 7, fontSize: 12 }}>
            <span style={{ color: 'rgba(255,255,255,0.42)' }}>{label}</span>
            <strong style={{ color: selected.accent, textAlign: 'right' }}>{value}</strong>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '0.65rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', fontSize: 11, lineHeight: 1.5 }}>
        Reference: {selected.reference}. Moon counts change as small irregular satellites are confirmed.
      </div>
    </aside>
  );
}

function MissionPanel({ selected, scaleMode }) {
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
          ['Planets', '8'],
          ['Dwarf worlds', '5'],
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

function ControlBar({ speed, setSpeed, scaleMode, setScaleMode, showLabels, setShowLabels, showRegions, setShowRegions }) {
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
      <select aria-label="Distance scale" value={scaleMode} onChange={(event) => setScaleMode(event.target.value)} style={controlStyle}>
        <option value="log">Log AU scale</option>
        <option value="inner">Inner-system zoom</option>
      </select>
      <button type="button" onClick={() => setShowLabels((value) => !value)} style={{ ...controlStyle, color: showLabels ? palette.cyan : 'rgba(255,255,255,0.58)' }}>Labels</button>
      <button type="button" onClick={() => setShowRegions((value) => !value)} style={{ ...controlStyle, color: showRegions ? palette.green : 'rgba(255,255,255,0.58)' }}>Belts + Oort</button>
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>Drag to rotate. Scroll to travel outward. Click a world for details.</span>
    </div>
  );
}

export default function SolarSystem() {
  const [selected, setSelected] = useState(SYSTEM_OBJECTS[2]);
  const [speed, setSpeed] = useState(1.8);
  const [scaleMode, setScaleMode] = useState('log');
  const [showLabels, setShowLabels] = useState(true);
  const [showRegions, setShowRegions] = useState(true);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', background: palette.bg, overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 78, 150], fov: 55 }} dpr={[1, 1.75]}>
        <Suspense fallback={null}>
          <Scene speed={speed} scaleMode={scaleMode} showLabels={showLabels} showRegions={showRegions} selected={selected} onSelect={setSelected} />
        </Suspense>
      </Canvas>
      <MissionPanel selected={selected} scaleMode={scaleMode} />
      <InfoPanel selected={selected} onClose={() => setSelected(null)} />
      <ControlBar
        speed={speed}
        setSpeed={setSpeed}
        scaleMode={scaleMode}
        setScaleMode={setScaleMode}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        showRegions={showRegions}
        setShowRegions={setShowRegions}
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
        NASA/JPL fact-sheet style data - AstroBis
      </div>
    </div>
  );
}
