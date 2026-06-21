import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const BASE_PATH = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const LOCAL_STARS_URL = `${BASE_PATH}data/bright-stars.json`;

const RAW_STARS = [
  ['Sirius', 6.752, -16.716, 2.64, -1.46, 'A', 'Alpha Canis Majoris - brightest star in the night sky'],
  ['Canopus', 6.399, -52.696, 95.9, -0.74, 'F', 'Alpha Carinae - second-brightest star, visible from southern latitudes'],
  ['Arcturus', 14.261, 19.182, 11.3, -0.05, 'K', 'Alpha Bootis - orange giant and bright northern spring star'],
  ['Rigil Kent.', 14.660, -60.833, 1.34, -0.27, 'G', 'Alpha Centauri system - nearest stellar system to the Sun'],
  ['Vega', 18.616, 38.784, 7.68, 0.03, 'A', 'Alpha Lyrae - blue-white standard star and part of the Summer Triangle'],
  ['Capella', 5.278, 45.998, 12.9, 0.08, 'G', 'Alpha Aurigae - a four-star system in two binary pairs'],
  ['Rigel', 5.242, -8.202, 264.0, 0.13, 'B', 'Beta Orionis - blue supergiant, roughly 120,000 solar luminosities'],
  ['Procyon', 7.655, 5.225, 3.50, 0.34, 'F', 'Alpha Canis Minoris - nearby yellow-white star'],
  ['Achernar', 1.628, -57.237, 44.1, 0.46, 'B', 'Alpha Eridani - rapid rotator with an oblate shape'],
  ['Betelgeuse', 5.919, 7.407, 197.0, 0.50, 'M', 'Alpha Orionis - red supergiant and future supernova candidate'],
  ['Hadar', 14.064, -60.373, 161.0, 0.61, 'B', 'Beta Centauri - bright blue-white triple system'],
  ['Altair', 19.846, 8.868, 5.13, 0.77, 'A', 'Alpha Aquilae - rapid rotator and Summer Triangle star'],
  ['Aldebaran', 4.599, 16.509, 20.0, 0.85, 'K', 'Alpha Tauri - orange giant marking the eye of Taurus'],
  ['Acrux', 12.443, -63.099, 99.0, 0.77, 'B', 'Alpha Crucis - brightest star in the Southern Cross'],
  ['Spica', 13.420, -11.161, 77.0, 1.04, 'B', 'Alpha Virginis - close binary and bright Virgo star'],
  ['Antares', 16.490, -26.432, 185.0, 1.09, 'M', 'Alpha Scorpii - red supergiant, hundreds of solar radii across'],
  ['Pollux', 7.755, 28.026, 10.3, 1.14, 'K', 'Beta Geminorum - orange giant with a confirmed exoplanet'],
  ['Fomalhaut', 22.961, -29.622, 7.69, 1.16, 'A', 'Alpha Piscis Austrini - nearby star with a dusty debris disk'],
  ['Deneb', 20.691, 45.280, 802.0, 1.25, 'A', 'Alpha Cygni - luminous supergiant and Summer Triangle star'],
  ['Mimosa', 12.795, -59.689, 85.0, 1.25, 'B', 'Beta Crucis - blue giant in the Southern Cross'],
  ['Regulus', 10.139, 11.967, 23.8, 1.35, 'B', 'Alpha Leonis - fast rotating bright star in Leo'],
  ['Adhara', 6.977, -28.972, 132.0, 1.50, 'B', 'Epsilon Canis Majoris - very bright in ultraviolet'],
  ['Castor', 7.577, 31.888, 15.8, 1.58, 'A', 'Alpha Geminorum - six-star system'],
  ['Gacrux', 12.519, -57.113, 27.2, 1.64, 'M', 'Gamma Crucis - red giant at the top of the Southern Cross'],
  ['Bellatrix', 5.419, 6.350, 77.0, 1.64, 'B', 'Gamma Orionis - blue-white giant in Orion'],
  ['Elnath', 5.438, 28.608, 40.7, 1.65, 'B', 'Beta Tauri - star on the Taurus and Auriga border'],
  ['Alnilam', 5.604, -1.202, 411.0, 1.70, 'B', 'Epsilon Orionis - middle star in Orion Belt'],
  ['Alnitak', 5.679, -1.943, 387.0, 1.77, 'O', 'Zeta Orionis - hot O-type star in Orion Belt'],
  ['Alioth', 12.900, 55.959, 24.8, 1.76, 'A', 'Epsilon Ursae Majoris - brightest Big Dipper star'],
  ['Mirfak', 3.406, 49.861, 160.0, 1.79, 'F', 'Alpha Persei - yellow-white supergiant'],
  ['Dubhe', 11.062, 61.750, 37.9, 1.79, 'K', 'Alpha Ursae Majoris - pointer star toward Polaris'],
  ['Kaus Aust.', 18.403, -34.385, 45.0, 1.85, 'B', 'Epsilon Sagittarii - part of the Sagittarius Teapot'],
  ['Alkaid', 13.792, 49.313, 30.9, 1.86, 'B', 'Eta Ursae Majoris - end of the Big Dipper handle'],
  ['Alnair', 22.137, -46.961, 31.0, 1.73, 'B', 'Alpha Gruis - bright blue-white star in Grus'],
  ['Peacock', 20.428, -56.735, 56.0, 1.94, 'B', 'Alpha Pavonis - blue-white subgiant'],
  ['Polaris', 2.530, 89.264, 132.0, 1.97, 'F', 'Alpha Ursae Minoris - current North Star and Cepheid variable'],
  ['Miaplacidus', 9.220, -69.717, 34.0, 1.68, 'A', 'Beta Carinae - bright southern star'],
  ['Atria', 16.811, -69.028, 91.5, 1.92, 'K', 'Alpha Trianguli Australis - orange giant'],
  ['Alphard', 9.460, -8.658, 54.0, 1.98, 'K', 'Alpha Hydrae - the solitary bright star in Hydra'],
  ['Hamal', 2.120, 23.462, 20.2, 2.00, 'K', 'Alpha Arietis - brightest star in Aries'],
  ['Menkent', 14.112, -36.370, 18.5, 2.06, 'K', 'Theta Centauri - nearby orange giant'],
  ['Nunki', 18.921, -26.296, 69.0, 2.05, 'B', 'Sigma Sagittarii - blue-white giant'],
  ['Saiph', 5.796, -9.670, 198.0, 2.07, 'B', 'Kappa Orionis - lower-right star of Orion'],
  ['Alpheratz', 0.139, 29.091, 29.6, 2.07, 'A', 'Alpha Andromedae - gateway star to Andromeda'],
  ['Rasalhague', 17.582, 12.560, 14.9, 2.08, 'A', 'Alpha Ophiuchi - bright star in Ophiuchus'],
  ['Kochab', 14.845, 74.155, 38.3, 2.08, 'K', 'Beta Ursae Minoris - former pole star'],
  ['Denebola', 11.818, 14.572, 11.1, 2.14, 'A', 'Beta Leonis - tail of Leo'],
  ['Algol', 3.136, 40.957, 28.0, 2.09, 'B', 'Beta Persei - famous eclipsing binary'],
  ['Schedar', 0.675, 56.537, 70.3, 2.24, 'K', 'Alpha Cassiopeiae - orange giant in Cassiopeia'],
  ['Mintaka', 5.534, -0.299, 380.0, 2.23, 'O', 'Delta Orionis - western Orion Belt star'],
  ['Enif', 21.736, 9.875, 211.0, 2.38, 'K', 'Epsilon Pegasi - orange supergiant'],
  ['Ankaa', 0.438, -42.306, 25.2, 2.40, 'K', 'Alpha Phoenicis - brightest star in Phoenix'],
  ['Sabik', 17.172, -15.724, 26.0, 2.43, 'A', 'Eta Ophiuchi - double star'],
  ['Mizar', 13.399, 54.925, 23.6, 2.23, 'A', 'Zeta Ursae Majoris - famous Big Dipper double star'],
  ['Aludra', 7.401, -29.303, 490.0, 2.45, 'B', 'Eta Canis Majoris - blue hypergiant'],
  ['Naos', 8.060, -40.003, 1399.0, 2.21, 'O', 'Zeta Puppis - hot and luminous O-type star'],
  ['Eta Car.', 10.751, -59.684, 2300.0, -0.80, 'B', 'Eta Carinae - massive luminous blue variable'],
  ['Phact', 5.661, -34.074, 79.0, 2.65, 'B', 'Alpha Columbae - blue-white star'],
  ['Wezen', 7.140, -26.393, 491.0, 1.84, 'F', 'Delta Canis Majoris - yellow-white supergiant'],
  ['Avior', 8.375, -59.510, 165.0, 1.86, 'K', 'Epsilon Carinae - navigational star'],
  ['Sargas', 17.622, -42.997, 109.0, 1.87, 'F', 'Theta Scorpii - yellow-white giant'],
  ['Mirzam', 6.378, -17.956, 151.0, 1.98, 'B', 'Beta Canis Majoris - pulsating Beta Cephei variable'],
];

const STARS = RAW_STARS.map(([name, ra, dec, distPc, mag, spectral, desc]) => ({
  name,
  ra,
  dec,
  distPc,
  mag,
  spectral,
  desc,
  absMag: mag - 5 * (Math.log10(distPc) - 1),
}));

const SPEC_COLOR = {
  O: '#9bb0ff',
  B: '#aabfff',
  A: '#cad7ff',
  F: '#f8f7ff',
  G: '#fff4ea',
  K: '#ffd2a1',
  M: '#ffad50',
};

const SPEC_LABEL = {
  O: 'Blue O-type',
  B: 'Blue-white',
  A: 'White',
  F: 'Yellow-white',
  G: 'Sun-like yellow',
  K: 'Orange giant',
  M: 'Red giant',
};

const SPEC_TEMP = {
  O: 30000,
  B: 15000,
  A: 9000,
  F: 7000,
  G: 5800,
  K: 4500,
  M: 3200,
};

function buildStarModels(stars) {
  return stars.map((star) => {
  const tempK = SPEC_TEMP[star.spectral] || 5800;
  const luminosity = 10 ** ((4.83 - star.absMag) / 2.5);
  const radiusSolar = Math.sqrt(luminosity) / ((tempK / 5772) ** 2);
  return { ...star, tempK, luminosity, radiusSolar };
  });
}

const FALLBACK_STAR_MODELS = buildStarModels(STARS);

const CONSTELLATIONS = [
  { name: 'Orion', color: '#67e8f9', pairs: [['Betelgeuse', 'Bellatrix'], ['Bellatrix', 'Mintaka'], ['Mintaka', 'Alnilam'], ['Alnilam', 'Alnitak'], ['Alnitak', 'Saiph'], ['Saiph', 'Rigel'], ['Rigel', 'Mintaka'], ['Betelgeuse', 'Alnitak']] },
  { name: 'Big Dipper', color: '#a78bfa', pairs: [['Dubhe', 'Alioth'], ['Alioth', 'Mizar'], ['Mizar', 'Alkaid'], ['Dubhe', 'Alkaid']] },
  { name: 'Summer Triangle', color: '#fbbf24', pairs: [['Vega', 'Altair'], ['Altair', 'Deneb'], ['Deneb', 'Vega']] },
  { name: 'Southern Cross', color: '#fb7185', pairs: [['Acrux', 'Mimosa'], ['Mimosa', 'Gacrux'], ['Acrux', 'Gacrux']] },
];

function seededRandom(seed = 918273) {
  let value = seed % 2147483647;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function starPosition(star) {
  const ra = star.ra * (Math.PI / 12);
  const dec = star.dec * (Math.PI / 180);
  const distance = Math.log10(star.distPc + 1) * 150;
  return new THREE.Vector3(
    distance * Math.cos(dec) * Math.cos(ra),
    distance * Math.sin(dec),
    distance * Math.cos(dec) * Math.sin(ra),
  );
}

function CatalogueBackgroundField({ count = 1800 }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const random = seededRandom(24062026);
    const palette = ['#9bb0ff', '#cad7ff', '#fff4ea', '#ffd2a1', '#ffad50'];
    const color = new THREE.Color();
    for (let i = 0; i < count; i += 1) {
      const ra = random() * Math.PI * 2;
      const dec = Math.asin(random() * 2 - 1);
      const distance = 70 + random() ** 0.46 * 410;
      positions[i * 3] = distance * Math.cos(dec) * Math.cos(ra);
      positions[i * 3 + 1] = distance * Math.sin(dec);
      positions[i * 3 + 2] = distance * Math.cos(dec) * Math.sin(ra);
      color.set(palette[Math.floor(random() * palette.length)]);
      const brightness = 0.32 + random() * 0.52;
      colors[i * 3] = color.r * brightness;
      colors[i * 3 + 1] = color.g * brightness;
      colors[i * 3 + 2] = color.b * brightness;
    }
    return { positions, colors };
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={geometry.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={geometry.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial vertexColors size={0.95} transparent opacity={0.62} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function magnitudeSize(mag) {
  return Math.max(0.55, Math.min(4.6, (2.8 - mag) * 0.82 + 0.9));
}

function StarMesh({ star, selected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const mesh = useRef();
  const position = useMemo(() => starPosition(star), [star]);
  const color = SPEC_COLOR[star.spectral] || '#ffffff';
  const isSelected = selected?.name === star.name;
  const size = magnitudeSize(star.mag);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const pulse = hovered || isSelected ? 1.12 + Math.sin(clock.getElapsedTime() * 5) * 0.08 : 1;
    mesh.current.scale.setScalar(pulse);
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(star);
        }}
      >
        <sphereGeometry args={[size * 0.34, 18, 18]} />
        <meshBasicMaterial color={isSelected ? '#ffffff' : color} />
      </mesh>
      <mesh>
        <sphereGeometry args={[size * (isSelected ? 1.55 : 0.92), 18, 18]} />
        <meshBasicMaterial color={color} transparent opacity={isSelected ? 0.28 : star.mag < 0.5 ? 0.14 : 0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {(hovered || isSelected) && (
        <Html center position={[0, size * 2, 0]} distanceFactor={120}>
          <div style={{
            color: '#fff',
            fontSize: 11,
            fontWeight: 900,
            fontFamily: 'Space Grotesk, Inter, sans-serif',
            background: 'rgba(2,6,23,0.86)',
            border: `1px solid ${color}66`,
            borderRadius: 999,
            padding: '3px 9px',
            whiteSpace: 'nowrap',
            boxShadow: `0 0 18px ${color}44`,
            pointerEvents: 'none',
          }}>{star.name}</div>
        </Html>
      )}
    </group>
  );
}

function ConstellationLines({ enabled, stars }) {
  const byName = useMemo(() => new Map(stars.map((star) => [star.name, star])), [stars]);
  if (!enabled) return null;
  return (
    <>
      {CONSTELLATIONS.flatMap((constellation) => constellation.pairs.map(([a, b]) => {
        const first = byName.get(a);
        const second = byName.get(b);
        if (!first || !second) return null;
        return (
          <Line
            key={`${constellation.name}-${a}-${b}`}
            points={[starPosition(first), starPosition(second)]}
            color={constellation.color}
            transparent
            opacity={0.34}
            lineWidth={0.85}
          />
        );
      }))}
    </>
  );
}

function DistanceShells({ enabled }) {
  const rings = useMemo(() => [10, 25, 100, 500, 2000].map((pc) => {
    const radius = Math.log10(pc + 1) * 150;
    const points = [];
    for (let i = 0; i <= 180; i += 1) {
      const angle = (i / 180) * Math.PI * 2;
      points.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }
    return { pc, points };
  }), []);
  if (!enabled) return null;
  return (
    <>
      {rings.map((ring) => (
        <Line key={ring.pc} points={ring.points} color="#64748b" transparent opacity={0.12} lineWidth={0.5} />
      ))}
    </>
  );
}

function MilkyWayBand() {
  const band = useRef();
  useFrame(({ clock }) => {
    if (band.current) band.current.rotation.z = 0.48 + Math.sin(clock.getElapsedTime() * 0.05) * 0.02;
  });
  return (
    <mesh ref={band} rotation={[Math.PI / 2.8, 0.1, 0.48]}>
      <torusGeometry args={[260, 18, 10, 180]} />
      <meshBasicMaterial color="#93c5fd" transparent opacity={0.024} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function CatalogueScene({ stars, allStars, selected, onSelect, showConstellations, showShells }) {
  return (
    <>
      <color attach="background" args={['#01030b']} />
      <Stars radius={460} depth={90} count={22000} factor={3.0} saturation={0.35} fade speed={0.12} />
      <CatalogueBackgroundField />
      <DistanceShells enabled={showShells} />
      <ConstellationLines enabled={showConstellations} stars={allStars} />
      {stars.map((star) => (
        <StarMesh key={star.name} star={star} selected={selected} onSelect={onSelect} />
      ))}
      <ambientLight intensity={0.05} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.13} luminanceSmoothing={0.82} intensity={1.75} radius={0.85} />
      </EffectComposer>
      <OrbitControls enableZoom enableDamping dampingFactor={0.055} minDistance={18} maxDistance={850} autoRotate autoRotateSpeed={0.12} />
    </>
  );
}

function StarPanel({ star, onClose }) {
  if (!star) return null;
  const color = SPEC_COLOR[star.spectral] || '#fff';
  const ly = star.distPc * 3.26156;
  return (
    <aside className="star-detail-panel" style={{
      position: 'absolute',
      top: 88,
      right: 20,
      width: 'min(340px, calc(100vw - 40px))',
      zIndex: 30,
      color: '#fff',
      border: `1px solid ${color}66`,
      borderRadius: 20,
      background: 'rgba(2,6,23,0.86)',
      backdropFilter: 'blur(24px)',
      boxShadow: `0 22px 90px ${color}18`,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '1rem 1.1rem', background: `linear-gradient(135deg, ${color}20, transparent)` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
          <div>
            <div style={{ color, fontSize: 11, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{SPEC_LABEL[star.spectral] || 'Spectral class'}</div>
            <h2 style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', fontSize: '1.75rem', lineHeight: 1.05 }}>{star.name}</h2>
          </div>
          <button type="button" aria-label="Close star details" onClick={onClose} style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
          }}>x</button>
        </div>
      </div>
      <div style={{ padding: '0.95rem 1.1rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.65, marginBottom: 12 }}>{star.desc}</p>
        {[
          ['Apparent magnitude', star.mag.toFixed(2)],
          ['Absolute magnitude', star.absMag.toFixed(2)],
          ['Distance', `${ly.toFixed(1)} light-years (${star.distPc} pc)`],
          ['Temperature proxy', `${Math.round(star.tempK).toLocaleString()} K`],
          ['Luminosity proxy', `${star.luminosity < 1000 ? star.luminosity.toFixed(1) : Math.round(star.luminosity).toLocaleString()} L☉`],
          ['Radius proxy', `${star.radiusSolar < 100 ? star.radiusSolar.toFixed(1) : Math.round(star.radiusSolar).toLocaleString()} R☉`],
          ['RA / Dec', `${star.ra.toFixed(3)}h / ${star.dec.toFixed(2)} deg`],
          ['Spectral class', star.spectral],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '0.42rem 0', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: 12 }}>
            <span style={{ color: 'rgba(255,255,255,0.42)' }}>{label}</span>
            <strong style={{ color, textAlign: 'right' }}>{value}</strong>
          </div>
        ))}
      </div>
    </aside>
  );
}

function HRDiagram({ stars, selected }) {
  const spectralOrder = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];
  return (
    <svg viewBox="0 0 280 150" style={{ width: '100%', display: 'block' }}>
      <rect x="0" y="0" width="280" height="150" rx="14" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.09)" />
      <text x="14" y="22" fill="rgba(255,255,255,0.65)" fontSize="11" fontWeight="800">H-R view</text>
      <text x="14" y="138" fill="rgba(255,255,255,0.32)" fontSize="9">hotter</text>
      <text x="230" y="138" fill="rgba(255,255,255,0.32)" fontSize="9">cooler</text>
      {stars.map((star) => {
        const x = 28 + spectralOrder.indexOf(star.spectral) * 36 + (star.name.length % 7) * 2.2;
        const y = 124 - Math.max(-8, Math.min(8, star.absMag)) * 6.2;
        const color = SPEC_COLOR[star.spectral] || '#fff';
        const active = selected?.name === star.name;
        return <circle key={star.name} cx={x} cy={Math.max(20, Math.min(132, y))} r={active ? 4.8 : 2.3} fill={active ? '#fff' : color} opacity={active ? 1 : 0.78} />;
      })}
    </svg>
  );
}

function Controls({ search, setSearch, filter, setFilter, showConstellations, setShowConstellations, showShells, setShowShells, visibleCount, selected, setSelected, starModels, catalogueSource }) {
  const localCount = starModels.filter((star) => star.distPc <= 25).length;
  const supergiants = starModels.filter((star) => star.luminosity > 10000).length;
  return (
    <aside className="star-controls-panel" style={{
      position: 'absolute',
      top: 88,
      left: 20,
      zIndex: 28,
      width: 'min(310px, calc(100vw - 40px))',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.11)',
      borderRadius: 20,
      background: 'rgba(2,6,23,0.78)',
      backdropFilter: 'blur(24px)',
      padding: '0.95rem',
    }}>
      <div style={{ color: '#c4b5fd', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 900 }}>Bright-star target atlas</div>
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search star" style={inputStyle} />
      <select className="astro-select" value={filter} onChange={(event) => setFilter(event.target.value)} style={inputStyle}>
        <option value="all">All spectral classes</option>
        {Object.entries(SPEC_LABEL).map(([key, label]) => <option key={key} value={key}>{key} - {label}</option>)}
      </select>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
        <button type="button" onClick={() => setShowConstellations((value) => !value)} style={toggleStyle(showConstellations, '#67e8f9')}>Constellations</button>
        <button type="button" onClick={() => setShowShells((value) => !value)} style={toggleStyle(showShells, '#fbbf24')}>Distance shells</button>
      </div>
      <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '0.7rem', marginTop: 12, background: 'rgba(255,255,255,0.035)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '0.5rem', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ color: '#67e8f9', fontWeight: 950 }}>{starModels.length}</div>
            <div style={{ color: 'rgba(255,255,255,0.42)', fontSize: 10 }}>named targets</div>
          </div>
          <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '0.5rem', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ color: '#a7f3d0', fontWeight: 950 }}>{localCount}</div>
            <div style={{ color: 'rgba(255,255,255,0.42)', fontSize: 10 }}>within 25 pc</div>
          </div>
          <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '0.5rem', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ color: '#fbbf24', fontWeight: 950 }}>{supergiants}</div>
            <div style={{ color: 'rgba(255,255,255,0.42)', fontSize: 10 }}>high luminosity</div>
          </div>
        </div>
        {Object.entries(SPEC_COLOR).map(([spectral, color]) => (
          <div key={spectral} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.56)', fontSize: 11, marginBottom: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: color, boxShadow: `0 0 8px ${color}` }} />
            <strong style={{ color, width: 16 }}>{spectral}</strong>
            <span>{SPEC_LABEL[spectral]}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <HRDiagram stars={starModels} selected={selected} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, color: 'rgba(255,255,255,0.38)', fontSize: 11 }}>
        <span>{visibleCount} shown · {catalogueSource}</span>
        <button type="button" onClick={() => setSelected(starModels[0])} style={{ ...toggleStyle(false, '#a78bfa'), padding: '0.42rem 0.65rem' }}>Reset</button>
      </div>
    </aside>
  );
}

export default function StarCatalogue() {
  const [starModels, setStarModels] = useState(FALLBACK_STAR_MODELS);
  const [catalogueSource, setCatalogueSource] = useState('fallback');
  const [selected, setSelected] = useState(FALLBACK_STAR_MODELS[0]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showConstellations, setShowConstellations] = useState(true);
  const [showShells, setShowShells] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadCatalogue() {
      try {
        const response = await fetch(LOCAL_STARS_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error('Bright-star snapshot unavailable');
        const snapshot = await response.json();
        if (!Array.isArray(snapshot.data) || snapshot.data.length < 40) throw new Error('Bright-star snapshot empty');
        const mapped = snapshot.data.map((star) => ({
          name: star.name,
          ra: Number(star.ra),
          dec: Number(star.dec),
          distPc: Number(star.distPc),
          mag: Number(star.mag),
          spectral: star.spectral || 'G',
          desc: star.desc || `${star.name} - bright-star catalogue entry`,
          absMag: Number(star.mag) - 5 * (Math.log10(Number(star.distPc)) - 1),
        })).filter((star) => Number.isFinite(star.ra) && Number.isFinite(star.dec) && Number.isFinite(star.distPc) && Number.isFinite(star.mag));
        if (!active || mapped.length < 40) return;
        const models = buildStarModels(mapped);
        setStarModels(models);
        setSelected(models[0]);
        setCatalogueSource(snapshot.source?.includes('HYG') ? 'HYG snapshot' : 'snapshot');
      } catch {
        if (active) setCatalogueSource('fallback');
      }
    }
    loadCatalogue();
    return () => {
      active = false;
    };
  }, []);

  const visibleStars = useMemo(() => {
    const query = search.trim().toLowerCase();
    return starModels.filter((star) => {
      if (filter !== 'all' && star.spectral !== filter) return false;
      if (query && !`${star.name} ${star.desc}`.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [filter, search, starModels]);

  return (
    <div style={{ width: '100%', height: '100vh', minHeight: 720, position: 'relative', background: '#01030b', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 70, 310], fov: 55 }} dpr={[1, 1.65]}>
        <Suspense fallback={null}>
          <CatalogueScene
            stars={visibleStars}
            allStars={starModels}
            selected={selected}
            onSelect={setSelected}
            showConstellations={showConstellations}
            showShells={showShells}
          />
        </Suspense>
      </Canvas>
      <Controls
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        showConstellations={showConstellations}
        setShowConstellations={setShowConstellations}
        showShells={showShells}
        setShowShells={setShowShells}
        visibleCount={visibleStars.length}
        selected={selected}
        setSelected={setSelected}
        starModels={starModels}
        catalogueSource={catalogueSource}
      />
      <StarPanel star={selected} onClose={() => setSelected(null)} />
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 92,
        transform: 'translateX(-50%)',
        zIndex: 25,
        color: 'rgba(255,255,255,0.34)',
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        pointerEvents: 'none',
        textAlign: 'center',
      }}>
        Bright-star coordinate space - log distance scale
      </div>
      <div style={{ position: 'absolute', right: 22, bottom: 18, zIndex: 20, color: 'rgba(255,255,255,0.26)', fontSize: 11 }}>
        Real RA/Dec coordinates - AstroBis
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  marginTop: 10,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  borderRadius: 12,
  padding: '0.64rem 0.75rem',
  outline: 'none',
};

function toggleStyle(active, color) {
  return {
    border: `1px solid ${active ? `${color}66` : 'rgba(255,255,255,0.12)'}`,
    background: active ? `${color}16` : 'rgba(255,255,255,0.06)',
    color: active ? color : 'rgba(255,255,255,0.72)',
    borderRadius: 999,
    padding: '0.52rem 0.72rem',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 850,
  };
}
