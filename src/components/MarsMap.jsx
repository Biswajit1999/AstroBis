import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Html, Line, OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import {
  CircleDot,
  Crosshair,
  Globe2,
  Info,
  Layers,
  Map,
  Mountain,
  Rocket,
  Search,
} from 'lucide-react';
import * as THREE from 'three';

const BASE_PATH = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const MARS_DATA_URL = `${BASE_PATH}data/mars-map.json`;
const MARS_TEXTURE_URL = `${BASE_PATH}assets/mars-texture.jpg`;
const MARS_BASE_ROTATION = {
  x: THREE.MathUtils.degToRad(-2),
  y: THREE.MathUtils.degToRad(-30),
  z: 0,
};

const FALLBACK_MARS_DATA = {
  schemaVersion: 1,
  generatedAt: '2026-08-03T00:00:00.000Z',
  body: {
    name: 'Mars',
    radiusKm: 3389.5,
    equatorialRadiusKm: 3396.2,
    polarRadiusKm: 3376.2,
    gravityMs2: 3.71,
    escapeVelocityKms: 5.03,
    meanDistanceAu: 1.523679,
    orbitalPeriodDays: 686.98,
    solHours: 24.6597,
    axialTiltDeg: 25.19,
    knownMoons: 2,
    moons: ['Phobos', 'Deimos'],
    atmosphere: 'Thin CO2-dominated atmosphere with dust and water-ice clouds.',
    surface: 'Basaltic crust, iron-oxide dust, volcanoes, canyon systems, impact basins, and polar layered deposits.',
  },
  textures: {
    localSurfaceUrl: 'assets/mars-texture.jpg',
    surfaceCredit: 'Solar System Scope / Wikimedia Commons Mars texture map',
    textureNote: 'Relief and haze are visualization layers, not meter-scale terrain rendering.',
  },
  features: [
    { id: 'olympus-mons', name: 'Olympus Mons', type: 'volcano', lat: 18.65, lon: -133.8, scale: 'about 600 km wide', priority: 'major', summary: 'Largest known volcano in the Solar System.', source: 'NASA / USGS Mars reference' },
    { id: 'valles-marineris', name: 'Valles Marineris', type: 'canyon system', lat: -14, lon: -60, scale: 'more than 4,000 km long', priority: 'major', summary: 'A vast equatorial canyon system.', source: 'NASA / USGS Mars reference' },
    { id: 'jezero-crater', name: 'Jezero Crater', type: 'crater / delta', lat: 18.38, lon: 77.58, scale: 'about 45 km diameter', priority: 'mission', summary: 'Perseverance landing region with an ancient delta.', source: 'NASA Mars 2020' },
  ],
  landingSites: [
    { id: 'curiosity', name: 'Curiosity', agency: 'NASA', status: 'active rover', lat: -4.5895, lon: 137.4417, summary: 'Mars Science Laboratory rover in Gale Crater.' },
    { id: 'perseverance', name: 'Perseverance', agency: 'NASA', status: 'active rover', lat: 18.4447, lon: 77.4508, summary: 'Mars 2020 rover in Jezero Crater.' },
  ],
  moons: [
    { name: 'Phobos', radiusKm: 11.1, orbitKm: 9376, orbitalPeriodHours: 7.65, summary: 'Inner, larger moon.' },
    { name: 'Deimos', radiusKm: 6.2, orbitKm: 23463, orbitalPeriodHours: 30.31, summary: 'Outer, smaller moon.' },
  ],
  sources: [],
  notes: {
    coordinates: 'Approximate feature center points normalized to -180 to +180 longitude.',
    visualization: 'A real-data WebGL atlas, not a high-resolution GIS terrain engine.',
  },
};

const TYPE_COLORS = {
  volcano: '#fb923c',
  'canyon system': '#facc15',
  'impact basin': '#60a5fa',
  'crater': '#fda4af',
  'crater / delta': '#34d399',
  'impact basin / plain': '#93c5fd',
  'volcanic province': '#fdba74',
  'volcanic chain': '#f97316',
  'fracture / mineral region': '#22d3ee',
  'fractured terrain': '#a78bfa',
  'ice-filled crater': '#e0f2fe',
  'north polar layered deposits': '#bfdbfe',
  'south polar layered deposits': '#bfdbfe',
  mission: '#4ade80',
};

const FEATURE_PRESETS = [
  { key: 'olympus-mons', label: 'Olympus' },
  { key: 'valles-marineris', label: 'Valles' },
  { key: 'jezero-crater', label: 'Jezero' },
  { key: 'gale-crater', label: 'Gale' },
  { key: 'planum-boreum', label: 'North pole' },
];

function formatNumber(value, digits = 0) {
  if (!Number.isFinite(Number(value))) return 'n/a';
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function normalizeLon(lon) {
  return ((Number(lon) + 540) % 360) - 180;
}

function latLonVector(lat, lon, radius = 1) {
  const phi = THREE.MathUtils.degToRad(90 - Number(lat));
  const theta = THREE.MathUtils.degToRad(normalizeLon(lon) + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function uvToCoordinate(uv) {
  return {
    lat: THREE.MathUtils.clamp((0.5 - uv.y) * 180, -90, 90),
    lon: normalizeLon((uv.x * 360) - 180),
  };
}

function markerPositionStyle(item) {
  return {
    left: `${((normalizeLon(item.lon) + 180) / 360) * 100}%`,
    top: `${((90 - item.lat) / 180) * 100}%`,
  };
}

function buildLatLine(lat, radius = 1.006) {
  const points = [];
  for (let lon = -180; lon <= 180; lon += 4) {
    points.push(latLonVector(lat, lon, radius));
  }
  return points;
}

function buildLonLine(lon, radius = 1.006) {
  const points = [];
  for (let lat = -88; lat <= 88; lat += 4) {
    points.push(latLonVector(lat, lon, radius));
  }
  return points;
}

function MarsAtmosphere({ visible }) {
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color('#fb923c') },
      intensity: { value: visible ? 1 : 0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float intensity;
      varying vec3 vNormal;
      void main() {
        float rim = pow(0.74 - abs(vNormal.z), 2.35);
        float haze = clamp(rim, 0.0, 0.34) * intensity;
        gl_FragColor = vec4(glowColor, haze);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [visible]);

  useEffect(() => {
    material.uniforms.intensity.value = visible ? 1 : 0;
  }, [material, visible]);

  if (!visible) return null;
  return (
    <mesh>
      <sphereGeometry args={[1.055, 128, 128]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function PolarCaps({ visible }) {
  if (!visible) return null;
  return (
    <>
      <mesh position={[0, 1.011, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.22, 80]} />
        <meshBasicMaterial color="#dbeafe" transparent opacity={0.52} depthWrite={false} />
      </mesh>
      <mesh position={[0, -1.011, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18, 80]} />
        <meshBasicMaterial color="#e0f2fe" transparent opacity={0.42} depthWrite={false} />
      </mesh>
    </>
  );
}

function Graticule({ visible }) {
  if (!visible) return null;
  const latitudes = [-60, -30, 0, 30, 60];
  const longitudes = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];
  return (
    <group>
      {latitudes.map((lat) => (
        <Line key={`lat-${lat}`} points={buildLatLine(lat)} color={lat === 0 ? '#facc15' : '#94a3b8'} transparent opacity={lat === 0 ? 0.42 : 0.18} lineWidth={0.55} />
      ))}
      {longitudes.map((lon) => (
        <Line key={`lon-${lon}`} points={buildLonLine(lon)} color="#94a3b8" transparent opacity={lon === 0 ? 0.32 : 0.16} lineWidth={0.45} />
      ))}
    </group>
  );
}

function FeatureMarker({ item, selected, onSelect, labels, kind }) {
  const color = kind === 'mission' ? TYPE_COLORS.mission : (TYPE_COLORS[item.type] || '#93c5fd');
  const position = latLonVector(item.lat, item.lon, selected ? 1.04 : 1.026);
  const size = selected ? 0.024 : item.priority === 'major' || kind === 'mission' ? 0.017 : 0.011;

  return (
    <group position={position}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect({ ...item, kind });
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[size, 18, 18]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh>
        <sphereGeometry args={[size * 2.8, 18, 18]} />
        <meshBasicMaterial color={color} transparent opacity={selected ? 0.28 : 0.13} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {labels && (selected || item.priority === 'major' || kind === 'mission') && (
        <Html center distanceFactor={2.35}>
          <button
            type="button"
            className={`mars-marker-label ${selected ? 'is-selected' : ''}`}
            onClick={(event) => {
              event.stopPropagation();
              onSelect({ ...item, kind });
            }}
          >
            {item.name}
          </button>
        </Html>
      )}
    </group>
  );
}

function MoonSystem({ moons, visible }) {
  const group = useRef();
  const orbitPaths = useMemo(() => [
    Array.from({ length: 160 }, (_, index) => {
      const angle = (index / 159) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle) * 1.55, Math.sin(angle) * 0.08, Math.sin(angle) * 1.55);
    }),
    Array.from({ length: 160 }, (_, index) => {
      const angle = (index / 159) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle) * 2.18, Math.sin(angle) * 0.13, Math.sin(angle) * 2.18);
    }),
  ], []);

  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.18;
  });

  if (!visible) return null;
  return (
    <group ref={group} rotation={[THREE.MathUtils.degToRad(1.1), 0, THREE.MathUtils.degToRad(24)]}>
      <Line points={orbitPaths[0]} color="#fbbf24" transparent opacity={0.3} lineWidth={0.6} />
      <Line points={orbitPaths[1]} color="#c4b5fd" transparent opacity={0.22} lineWidth={0.5} />
      {(moons || []).slice(0, 2).map((moon, index) => {
        const distance = index === 0 ? 1.55 : 2.18;
        const angle = index === 0 ? 0.8 : 3.5;
        return (
          <group key={moon.name} position={[Math.cos(angle) * distance, index === 0 ? 0.08 : -0.06, Math.sin(angle) * distance]}>
            <mesh>
              <sphereGeometry args={[index === 0 ? 0.035 : 0.027, 18, 18]} />
              <meshStandardMaterial color={index === 0 ? '#c4b5a5' : '#9ca3af'} roughness={0.94} />
            </mesh>
            <Html center distanceFactor={2.6}>
              <div className="mars-moon-label">{moon.name}</div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function CameraFocus({ selected, focusTick }) {
  const controls = useRef();
  const { camera } = useThree();
  const targetPosition = useMemo(() => {
    if (!selected) return null;
    const normal = latLonVector(selected.lat, selected.lon, 1)
      .applyEuler(new THREE.Euler(MARS_BASE_ROTATION.x, MARS_BASE_ROTATION.y, MARS_BASE_ROTATION.z))
      .normalize();
    return {
      target: normal.clone().multiplyScalar(0.28),
      camera: normal.clone().multiplyScalar(2.75).add(new THREE.Vector3(0.16, 0.12, 0.16)),
    };
  }, [selected?.id, focusTick]);

  useFrame(() => {
    if (!controls.current || !targetPosition) return;
    controls.current.target.lerp(targetPosition.target, 0.035);
    camera.position.lerp(targetPosition.camera, 0.026);
    camera.lookAt(controls.current.target);
    controls.current.update();
  });

  return <OrbitControls ref={controls} enableDamping dampingFactor={0.06} minDistance={1.35} maxDistance={6.4} />;
}

function MarsGlobe({ data, selected, onSelect, onCoordinate, layers, focusTick }) {
  const texture = useLoader(THREE.TextureLoader, MARS_TEXTURE_URL);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
  }, [texture]);

  const features = data.features || [];
  const landingSites = data.landingSites || [];

  return (
    <>
      <color attach="background" args={['#03020d']} />
      <fog attach="fog" args={['#03020d', 6, 17]} />
      <Stars radius={180} depth={80} count={7200} factor={3.3} saturation={0.18} fade speed={0.03} />

      <ambientLight intensity={0.22} color="#fbd2a0" />
      <directionalLight position={[4.5, 1.8, 3.8]} intensity={4.25} color="#fff0d1" />
      <pointLight position={[4.5, 1.8, 3.8]} intensity={3.3} color="#fb923c" distance={12} />
      <pointLight position={[-3.8, -1.2, -2.6]} intensity={0.42} color="#60a5fa" distance={8} />

      <group rotation={[MARS_BASE_ROTATION.x, MARS_BASE_ROTATION.y, MARS_BASE_ROTATION.z]}>
        <mesh
          onPointerMove={(event) => {
            if (event.uv) onCoordinate(uvToCoordinate(event.uv));
          }}
          onClick={(event) => {
            if (event.uv) onSelect({ ...uvToCoordinate(event.uv), id: 'coordinate-pick', name: 'Selected coordinate', kind: 'coordinate', type: 'surface point', summary: 'Manual coordinate selected on the Mars texture.' });
          }}
        >
          <sphereGeometry args={[1, 160, 160]} />
          <meshStandardMaterial
            map={texture}
            bumpMap={layers.relief ? texture : null}
            bumpScale={layers.relief ? 0.035 : 0}
            roughness={0.93}
            metalness={0}
            color="#ffffff"
          />
        </mesh>
        <PolarCaps visible={layers.polarCaps} />
        <Graticule visible={layers.graticule} />
        {layers.features && features.map((feature) => (
          <FeatureMarker
            key={feature.id}
            item={feature}
            selected={selected?.id === feature.id}
            onSelect={onSelect}
            labels={layers.labels}
            kind="feature"
          />
        ))}
        {layers.missions && landingSites.map((site) => (
          <FeatureMarker
            key={site.id}
            item={{ ...site, type: 'mission', priority: site.status?.includes('active') ? 'major' : 'mission' }}
            selected={selected?.id === site.id}
            onSelect={onSelect}
            labels={layers.labels}
            kind="mission"
          />
        ))}
      </group>

      <MarsAtmosphere visible={layers.atmosphere} />
      <MoonSystem moons={data.moons} visible={layers.moons} />
      <mesh position={[4.8, 1.7, 3.9]}>
        <sphereGeometry args={[0.22, 48, 48]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[4.8, 1.7, 3.9]}>
        <sphereGeometry args={[0.82, 48, 48]} />
        <meshBasicMaterial color="#fb923c" transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <EffectComposer>
        <Bloom luminanceThreshold={0.22} luminanceSmoothing={0.78} intensity={1.08} radius={0.64} />
      </EffectComposer>
      <CameraFocus selected={selected?.lat !== undefined ? selected : null} focusTick={focusTick} />
    </>
  );
}

function LayerButton({ icon: Icon, label, active, onClick }) {
  return (
    <button type="button" className={`mars-layer-button ${active ? 'is-active' : ''}`} onClick={onClick} title={label}>
      <Icon size={15} />
      <span>{label}</span>
    </button>
  );
}

function MarsCommandPanel({ data, query, setQuery, filter, setFilter, layers, toggleLayer, selected, setSelected, setFocusTick }) {
  const features = data.features || [];
  const landingSites = data.landingSites || [];
  const featureTypes = useMemo(() => ['all', ...Array.from(new Set(features.map((item) => item.type))).sort()], [features]);

  const presetTargets = FEATURE_PRESETS
    .map((preset) => features.find((feature) => feature.id === preset.key))
    .filter(Boolean);

  return (
    <aside className="mars-panel mars-left-panel">
      <div className="mars-kicker">AstroBis Mars map</div>
      <h1>Real 3D surface atlas</h1>
      <p>
        A WebGL Mars globe with a real texture map, named surface features, landing-site markers, moon orbits,
        coordinate picking, and labelled scientific caveats.
      </p>

      <div className="mars-search">
        <Search size={16} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Mars feature or mission" />
      </div>

      <select className="mars-select" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Feature filter">
        {featureTypes.map((type) => (
          <option key={type} value={type}>{type === 'all' ? 'All feature types' : type}</option>
        ))}
      </select>

      <div className="mars-presets">
        {presetTargets.map((feature) => (
          <button
            key={feature.id}
            type="button"
            onClick={() => {
              setSelected({ ...feature, kind: 'feature' });
              setFocusTick((value) => value + 1);
            }}
          >
            {FEATURE_PRESETS.find((preset) => preset.key === feature.id)?.label || feature.name}
          </button>
        ))}
      </div>

      <div className="mars-stats-grid">
        <div><span>Radius</span><strong>{formatNumber(data.body?.radiusKm)} km</strong></div>
        <div><span>Gravity</span><strong>{data.body?.gravityMs2} m/s2</strong></div>
        <div><span>Sol</span><strong>{data.body?.solHours?.toFixed(2)} h</strong></div>
        <div><span>Moons</span><strong>{data.body?.knownMoons}</strong></div>
      </div>

      <div className="mars-layer-grid">
        <LayerButton icon={Layers} label="Relief" active={layers.relief} onClick={() => toggleLayer('relief')} />
        <LayerButton icon={Map} label="Grid" active={layers.graticule} onClick={() => toggleLayer('graticule')} />
        <LayerButton icon={Mountain} label="Features" active={layers.features} onClick={() => toggleLayer('features')} />
        <LayerButton icon={Rocket} label="Missions" active={layers.missions} onClick={() => toggleLayer('missions')} />
        <LayerButton icon={CircleDot} label="Moons" active={layers.moons} onClick={() => toggleLayer('moons')} />
        <LayerButton icon={Globe2} label="Haze" active={layers.atmosphere} onClick={() => toggleLayer('atmosphere')} />
        <LayerButton icon={CircleDot} label="Polar caps" active={layers.polarCaps} onClick={() => toggleLayer('polarCaps')} />
        <LayerButton icon={Crosshair} label="Labels" active={layers.labels} onClick={() => toggleLayer('labels')} />
        <LayerButton icon={Info} label="Mini map" active={layers.miniMap} onClick={() => toggleLayer('miniMap')} />
      </div>

      <div className="mars-note">
        {data.textures?.textureNote || 'Relief and haze are visualization layers.'}
      </div>

      {selected?.kind === 'coordinate' && (
        <div className="mars-coordinate-callout">
          Picked: {selected.lat.toFixed(2)} lat / {selected.lon.toFixed(2)} lon
        </div>
      )}
    </aside>
  );
}

function MarsInfoPanel({ data, selected, hoverCoordinate, setSelected }) {
  const item = selected || data.features?.[0] || null;
  return (
    <aside className="mars-panel mars-right-panel">
      <div className="mars-panel-top">
        <div>
          <div className="mars-kicker">{item?.kind === 'mission' ? 'Landing site' : item?.kind === 'coordinate' ? 'Coordinate pick' : item?.type || 'Surface feature'}</div>
          <h2>{item?.name || 'Mars'}</h2>
        </div>
        {selected && (
          <button type="button" className="mars-close" onClick={() => setSelected(null)}>x</button>
        )}
      </div>

      <p className="mars-summary">
        {item?.summary || data.body?.surface}
      </p>

      <div className="mars-info-list">
        <div><span>Latitude</span><strong>{Number.isFinite(item?.lat) ? `${item.lat.toFixed(3)} deg` : 'n/a'}</strong></div>
        <div><span>Longitude</span><strong>{Number.isFinite(item?.lon) ? `${normalizeLon(item.lon).toFixed(3)} deg` : 'n/a'}</strong></div>
        <div><span>Scale</span><strong>{item?.scale || item?.status || 'reference point'}</strong></div>
        <div><span>Source</span><strong>{item?.source || item?.agency || 'AstroBis Mars snapshot'}</strong></div>
      </div>

      <div className="mars-section-title">Planet constants</div>
      <div className="mars-info-list compact">
        <div><span>Mean distance</span><strong>{data.body?.meanDistanceAu} AU</strong></div>
        <div><span>Orbital period</span><strong>{formatNumber(data.body?.orbitalPeriodDays, 2)} days</strong></div>
        <div><span>Axial tilt</span><strong>{data.body?.axialTiltDeg} deg</strong></div>
        <div><span>Escape velocity</span><strong>{data.body?.escapeVelocityKms} km/s</strong></div>
      </div>

      <div className="mars-section-title">Moons</div>
      <div className="mars-moon-cards">
        {(data.moons || []).map((moon) => (
          <div key={moon.name}>
            <strong>{moon.name}</strong>
            <span>{moon.orbitalPeriodHours} h orbit</span>
          </div>
        ))}
      </div>

      <div className="mars-coordinate-readout">
        Hover coordinate: {hoverCoordinate ? `${hoverCoordinate.lat.toFixed(2)} lat / ${hoverCoordinate.lon.toFixed(2)} lon` : 'move over the globe'}
      </div>
    </aside>
  );
}

function MarsMiniMap({ data, selected, setSelected, visible, query, filter }) {
  if (!visible) return null;
  const lower = query.trim().toLowerCase();
  const features = (data.features || []).filter((feature) => {
    const matchesQuery = !lower || `${feature.name} ${feature.type} ${feature.summary}`.toLowerCase().includes(lower);
    const matchesType = filter === 'all' || feature.type === filter;
    return matchesQuery && matchesType;
  });
  const sites = data.landingSites || [];
  return (
    <div className="mars-mini-map">
      <div className="mars-mini-map-bg" />
      <div className="mars-mini-map-grid" />
      {features.map((feature) => (
        <button
          type="button"
          key={feature.id}
          className={`mars-map-dot feature ${selected?.id === feature.id ? 'is-selected' : ''}`}
          style={markerPositionStyle(feature)}
          title={feature.name}
          onClick={() => setSelected({ ...feature, kind: 'feature' })}
        />
      ))}
      {sites.map((site) => (
        <button
          type="button"
          key={site.id}
          className={`mars-map-dot mission ${selected?.id === site.id ? 'is-selected' : ''}`}
          style={markerPositionStyle(site)}
          title={site.name}
          onClick={() => setSelected({ ...site, kind: 'mission', type: 'mission' })}
        />
      ))}
      <div className="mars-mini-caption">
        <strong>Mars reference map</strong>
        <span>features + landing sites</span>
      </div>
    </div>
  );
}

function MissionRail({ data, setSelected }) {
  const sites = data.landingSites || [];
  return (
    <div className="mars-mission-rail">
      <div className="mars-rail-title">Landing-site chronology</div>
      <div className="mars-rail-list">
        {sites.map((site) => (
          <button key={site.id} type="button" onClick={() => setSelected({ ...site, kind: 'mission', type: 'mission' })}>
            <span>{site.name}</span>
            <strong>{site.status}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

function SourceStrip({ data }) {
  return (
    <div className="mars-source-strip">
      {(data.sources || []).slice(0, 4).map((source) => (
        <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">
          <span>{source.label}</span>
          <small>{source.note}</small>
        </a>
      ))}
    </div>
  );
}

export default function MarsMap() {
  const [data, setData] = useState(FALLBACK_MARS_DATA);
  const [selected, setSelected] = useState(null);
  const [hoverCoordinate, setHoverCoordinate] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [focusTick, setFocusTick] = useState(0);
  const [layers, setLayers] = useState({
    relief: true,
    graticule: true,
    features: true,
    missions: true,
    moons: true,
    atmosphere: true,
    labels: true,
    polarCaps: true,
    miniMap: true,
  });

  useEffect(() => {
    let active = true;
    async function loadMarsData() {
      try {
        const response = await fetch(`${MARS_DATA_URL}?ts=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Mars snapshot unavailable');
        const payload = await response.json();
        if (active) {
          setData(payload);
          setSelected(payload.features?.[0] ? { ...payload.features[0], kind: 'feature' } : null);
        }
      } catch {
        if (active) setSelected(FALLBACK_MARS_DATA.features?.[0] ? { ...FALLBACK_MARS_DATA.features[0], kind: 'feature' } : null);
      }
    }
    loadMarsData();
    return () => { active = false; };
  }, []);

  const toggleLayer = (layer) => setLayers((current) => ({ ...current, [layer]: !current[layer] }));

  const visibleData = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return {
      ...data,
      features: (data.features || []).filter((feature) => {
        const matchesQuery = !lower || `${feature.name} ${feature.type} ${feature.summary}`.toLowerCase().includes(lower);
        const matchesType = filter === 'all' || feature.type === filter;
        return matchesQuery && matchesType;
      }),
    };
  }, [data, query, filter]);

  return (
    <div className="mars-map-shell">
      <Canvas camera={{ position: [0.12, 0.28, 3.05], fov: 43 }} dpr={[1, 1.75]}>
        <Suspense fallback={null}>
          <MarsGlobe
            data={visibleData}
            selected={selected}
            onSelect={(item) => {
              setSelected(item);
              setFocusTick((value) => value + 1);
            }}
            onCoordinate={setHoverCoordinate}
            layers={layers}
            focusTick={focusTick}
          />
        </Suspense>
      </Canvas>

      <div className="mars-top-strip">
        <span>UTC {new Date(data.generatedAt || Date.now()).toISOString().slice(0, 16).replace('T', ' ')}</span>
        <strong>Mars Areography Console</strong>
        <span>{(data.features || []).length} features / {(data.landingSites || []).length} landers and rovers</span>
      </div>

      <MarsCommandPanel
        data={data}
        query={query}
        setQuery={setQuery}
        filter={filter}
        setFilter={setFilter}
        layers={layers}
        toggleLayer={toggleLayer}
        selected={selected}
        setSelected={setSelected}
        setFocusTick={setFocusTick}
      />
      <MarsInfoPanel data={data} selected={selected} hoverCoordinate={hoverCoordinate} setSelected={setSelected} />
      <MarsMiniMap data={data} selected={selected} setSelected={setSelected} visible={layers.miniMap} query={query} filter={filter} />
      <MissionRail data={data} setSelected={(site) => {
        setSelected(site);
        setFocusTick((value) => value + 1);
      }} />
      <SourceStrip data={data} />

      <div className="mars-credit">
        Texture: {data.textures?.surfaceCredit || 'Mars public texture'} - Data: NASA / USGS / IAU reference sources
      </div>

      <style>{marsStyles}</style>
    </div>
  );
}

const marsStyles = `
.mars-map-shell {
  position: relative;
  width: 100%;
  height: calc(100vh - 64px);
  min-height: 740px;
  overflow: hidden;
  background:
    radial-gradient(circle at 54% 46%, rgba(251,146,60,0.18), transparent 35%),
    radial-gradient(circle at 88% 12%, rgba(96,165,250,0.12), transparent 24%),
    #03020d;
  color: #fff;
}
.mars-panel {
  position: absolute;
  z-index: 26;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(5, 8, 18, 0.78);
  border-radius: 20px;
  padding: 1rem;
  backdrop-filter: blur(22px);
  box-shadow: 0 20px 80px rgba(0,0,0,0.34);
}
.mars-left-panel {
  top: 86px;
  left: 20px;
  width: min(360px, calc(100vw - 40px));
  max-height: calc(100% - 350px);
  overflow-y: auto;
}
.mars-right-panel {
  top: 86px;
  right: 20px;
  width: min(370px, calc(100vw - 40px));
  max-height: calc(100% - 128px);
  overflow-y: auto;
}
.mars-kicker {
  color: #67e8f9;
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.mars-left-panel h1,
.mars-right-panel h2 {
  font-family: Space Grotesk, Inter, sans-serif;
  margin: 0.35rem 0 0.55rem;
  line-height: 1.02;
}
.mars-left-panel h1 {
  font-size: 1.85rem;
}
.mars-right-panel h2 {
  font-size: 1.55rem;
}
.mars-left-panel p,
.mars-summary {
  color: rgba(255,255,255,0.58);
  font-size: 12px;
  line-height: 1.6;
  margin: 0;
}
.mars-search {
  margin-top: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 0.65rem 0.75rem;
}
.mars-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: #fff;
  background: transparent;
  font-size: 13px;
}
.mars-search input::placeholder {
  color: rgba(255,255,255,0.38);
}
.mars-select {
  width: 100%;
  margin-top: 0.7rem;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: #fff;
  border-radius: 14px;
  padding: 0.68rem 0.75rem;
  font-weight: 800;
}
.mars-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 0.75rem;
}
.mars-presets button,
.mars-layer-button {
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.055);
  color: rgba(255,255,255,0.76);
  border-radius: 999px;
  padding: 0.48rem 0.7rem;
  font-size: 12px;
  font-weight: 850;
  cursor: pointer;
}
.mars-layer-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  justify-content: center;
  border-radius: 12px;
  min-height: 38px;
}
.mars-layer-button.is-active {
  color: #fed7aa;
  border-color: rgba(251,146,60,0.42);
  background: rgba(251,146,60,0.14);
}
.mars-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 0.85rem;
}
.mars-stats-grid div,
.mars-moon-cards div {
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.035);
  border-radius: 12px;
  padding: 0.6rem;
}
.mars-stats-grid span,
.mars-info-list span,
.mars-moon-cards span {
  display: block;
  color: rgba(255,255,255,0.42);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.mars-stats-grid strong {
  display: block;
  margin-top: 3px;
  color: #fed7aa;
  font-size: 14px;
}
.mars-layer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 0.85rem;
}
.mars-note,
.mars-coordinate-callout,
.mars-coordinate-readout {
  margin-top: 0.85rem;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.035);
  border-radius: 12px;
  padding: 0.65rem;
  color: rgba(255,255,255,0.48);
  font-size: 11px;
  line-height: 1.5;
}
.mars-coordinate-callout {
  color: #bfdbfe;
  border-color: rgba(96,165,250,0.22);
}
.mars-panel-top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}
.mars-close {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.75);
  font-weight: 900;
  cursor: pointer;
}
.mars-info-list {
  margin-top: 0.95rem;
}
.mars-info-list div {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 0.52rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.mars-info-list strong {
  color: #93c5fd;
  text-align: right;
  max-width: 62%;
  font-size: 12px;
}
.mars-info-list.compact strong {
  color: #fed7aa;
}
.mars-section-title {
  margin-top: 1rem;
  color: #fda4af;
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.mars-moon-cards {
  margin-top: 0.65rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.mars-moon-cards strong {
  display: block;
  color: #fff;
  margin-bottom: 4px;
}
.mars-top-strip {
  position: absolute;
  top: 76px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 24;
  display: flex;
  gap: 0.8rem;
  align-items: center;
  max-width: min(760px, calc(100vw - 860px));
  padding: 0.56rem 0.8rem;
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 999px;
  background: rgba(5,8,18,0.62);
  backdrop-filter: blur(18px);
  color: rgba(255,255,255,0.52);
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
}
.mars-top-strip strong {
  color: #fed7aa;
}
.mars-marker-label,
.mars-moon-label {
  border: 1px solid rgba(251,146,60,0.44);
  background: rgba(5,8,18,0.78);
  color: #fed7aa;
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 900;
  white-space: nowrap;
  pointer-events: auto;
}
.mars-marker-label.is-selected {
  color: #fff;
  background: rgba(251,146,60,0.28);
}
.mars-moon-label {
  color: #e5e7eb;
  border-color: rgba(196,181,253,0.38);
}
.mars-mini-map {
  position: absolute;
  left: 20px;
  bottom: 22px;
  z-index: 25;
  width: min(460px, calc(100vw - 40px));
  height: 230px;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 18px;
  overflow: hidden;
  background: #160b08;
  box-shadow: 0 20px 80px rgba(0,0,0,0.32);
}
.mars-mini-map-bg {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(20,8,4,0.08), rgba(20,8,4,0.38)), url('${MARS_TEXTURE_URL}');
  background-size: cover;
  background-position: center;
  filter: saturate(1.04) contrast(1.1);
}
.mars-mini-map-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 20% 25%, 16.66% 25%;
  opacity: 0.42;
}
.mars-map-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  border: 1px solid #fff;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
.mars-map-dot.feature {
  background: #f97316;
  box-shadow: 0 0 10px rgba(249,115,22,0.75);
}
.mars-map-dot.mission {
  background: #22c55e;
  box-shadow: 0 0 12px rgba(34,197,94,0.75);
}
.mars-map-dot.is-selected {
  width: 14px;
  height: 14px;
}
.mars-mini-caption {
  position: absolute;
  left: 12px;
  top: 10px;
  display: grid;
  gap: 2px;
}
.mars-mini-caption strong {
  font-family: Space Grotesk, Inter, sans-serif;
  font-weight: 950;
}
.mars-mini-caption span {
  color: rgba(255,255,255,0.62);
  font-size: 11px;
}
.mars-mission-rail {
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  z-index: 25;
  width: min(720px, calc(100vw - 980px));
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(5,8,18,0.74);
  border-radius: 18px;
  padding: 0.8rem;
  backdrop-filter: blur(20px);
}
.mars-rail-title {
  color: #67e8f9;
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.55rem;
}
.mars-rail-list {
  display: grid;
  grid-template-columns: repeat(5, minmax(128px, 1fr));
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
}
.mars-rail-list button {
  text-align: left;
  min-width: 128px;
  border: 1px solid rgba(255,255,255,0.09);
  background: rgba(255,255,255,0.04);
  color: #fff;
  border-radius: 12px;
  padding: 0.56rem;
  cursor: pointer;
}
.mars-rail-list span {
  display: block;
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mars-rail-list strong {
  display: block;
  margin-top: 4px;
  color: rgba(255,255,255,0.46);
  font-size: 10px;
  line-height: 1.35;
}
.mars-source-strip {
  position: absolute;
  right: 20px;
  bottom: 22px;
  z-index: 24;
  display: none;
  gap: 8px;
  width: min(360px, calc(100vw - 40px));
}
.mars-source-strip a {
  display: block;
  text-decoration: none;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(5,8,18,0.62);
  border-radius: 12px;
  padding: 0.58rem 0.7rem;
  backdrop-filter: blur(18px);
}
.mars-source-strip span {
  display: block;
  color: #93c5fd;
  font-size: 12px;
  font-weight: 900;
}
.mars-source-strip small {
  display: block;
  margin-top: 3px;
  color: rgba(255,255,255,0.42);
  font-size: 10px;
  line-height: 1.35;
}
.mars-credit {
  position: absolute;
  right: 22px;
  bottom: 8px;
  z-index: 20;
  color: rgba(255,255,255,0.28);
  font-size: 10px;
}
@media (max-width: 1540px) {
  .mars-map-shell {
    height: auto;
    min-height: 100vh;
    overflow: visible;
    padding: 78px 14px 24px;
    display: grid;
    gap: 14px;
  }
  .mars-map-shell canvas {
    order: -1;
    min-height: 560px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
  }
  .mars-panel,
  .mars-top-strip,
  .mars-mini-map,
  .mars-mission-rail,
  .mars-source-strip,
  .mars-credit {
    position: relative;
    inset: auto;
    transform: none;
    width: 100%;
    max-width: none;
  }
  .mars-right-panel {
    max-height: none;
  }
  .mars-top-strip {
    max-width: none;
    justify-content: space-between;
    order: -2;
    overflow-x: auto;
  }
  .mars-left-panel {
    order: 0;
  }
  .mars-mini-map {
    height: 230px;
  }
  .mars-mission-rail {
    padding: 0.75rem;
  }
  .mars-rail-list {
    grid-template-columns: repeat(5, minmax(150px, 1fr));
  }
  .mars-source-strip {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    display: grid;
  }
}
@media (max-width: 640px) {
  .mars-map-shell {
    padding-left: 10px;
    padding-right: 10px;
  }
  .mars-map-shell canvas {
    min-height: 470px;
  }
  .mars-left-panel h1 {
    font-size: 1.52rem;
  }
  .mars-layer-grid,
  .mars-stats-grid {
    grid-template-columns: 1fr;
  }
  .mars-moon-cards {
    grid-template-columns: 1fr;
  }
  .mars-top-strip {
    align-items: flex-start;
    border-radius: 16px;
    white-space: normal;
    flex-wrap: wrap;
  }
}
`;
