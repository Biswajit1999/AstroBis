import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Html, Line, OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const EARTH_RADIUS_KM = 6371;
const ISS_ID = 25544;
const EARTH_DAY = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg';
const EARTH_CLOUDS = 'https://threejs.org/examples/textures/planets/earth_clouds_1024.png';

function latLonVector(lat, lon, radius = 1) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function normalizeLon(lon) {
  return ((lon + 540) % 360) - 180;
}

function buildProjectedOrbit(current) {
  const inclination = 51.64 * Math.PI / 180;
  const baseLon = current?.longitude ?? 0;
  const basePhase = Math.asin(Math.max(-0.98, Math.min(0.98, Math.sin((current?.latitude ?? 0) * Math.PI / 180) / Math.sin(inclination))));
  const points = [];
  for (let i = -120; i <= 180; i += 1) {
    const phase = basePhase + (i / 180) * Math.PI;
    const lat = Math.asin(Math.sin(inclination) * Math.sin(phase)) * 180 / Math.PI;
    const lon = normalizeLon(baseLon + i * 2.05);
    points.push(latLonVector(lat, lon, 1.071));
  }
  return points;
}

function kmps(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 'n/a';
  return (number / 3600).toFixed(2);
}

function clockTime(date) {
  if (!date) return 'connecting';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function EarthGlobe({ issData, track, followMode }) {
  const earthTexture = useLoader(THREE.TextureLoader, EARTH_DAY);
  const cloudTexture = useLoader(THREE.TextureLoader, EARTH_CLOUDS);
  const clouds = useRef();
  const issGlow = useRef();
  const controls = useRef();
  const issPoint = issData ? latLonVector(issData.latitude, issData.longitude, 1.078) : null;
  const orbitPoints = useMemo(() => buildProjectedOrbit(issData), [issData]);
  const trailPoints = useMemo(() => track.map((point) => latLonVector(point.latitude, point.longitude, 1.082)), [track]);

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    if (clouds.current) clouds.current.rotation.y = t * 0.012;
    if (issGlow.current) issGlow.current.scale.setScalar(1 + Math.sin(t * 5) * 0.18);
    if (followMode && issPoint && controls.current) {
      const target = issPoint.clone().multiplyScalar(0.35);
      controls.current.target.lerp(target, 0.04);
      camera.lookAt(controls.current.target);
    }
  });

  earthTexture.colorSpace = THREE.SRGBColorSpace;
  cloudTexture.colorSpace = THREE.SRGBColorSpace;

  return (
    <>
      <color attach="background" args={['#01030b']} />
      <Stars radius={160} depth={70} count={8500} factor={3.4} saturation={0.15} fade speed={0.1} />

      <group rotation={[0, -0.4, 0]}>
        <mesh>
          <sphereGeometry args={[1, 96, 96]} />
          <meshStandardMaterial map={earthTexture} roughness={0.72} metalness={0.02} />
        </mesh>
        <mesh ref={clouds}>
          <sphereGeometry args={[1.012, 96, 96]} />
          <meshLambertMaterial map={cloudTexture} transparent opacity={0.34} depthWrite={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.04, 64, 64]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.12} side={THREE.BackSide} />
        </mesh>

        <Line points={orbitPoints} color="#e5e7eb" transparent opacity={0.28} lineWidth={0.8} />
        {trailPoints.length > 1 && (
          <Line points={trailPoints} color="#22c55e" transparent opacity={0.86} lineWidth={2.2} />
        )}

        {issPoint && (
          <group position={issPoint}>
            <mesh>
              <sphereGeometry args={[0.018, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh ref={issGlow}>
              <sphereGeometry args={[0.052, 24, 24]} />
              <meshBasicMaterial color="#22c55e" transparent opacity={0.3} />
            </mesh>
            <Html center distanceFactor={2.7}>
              <div style={{
                border: '1px solid rgba(34,197,94,0.55)',
                background: 'rgba(2,6,23,0.78)',
                color: '#d9f99d',
                borderRadius: 999,
                padding: '3px 9px',
                fontFamily: 'Space Grotesk, Inter, sans-serif',
                fontSize: 11,
                fontWeight: 900,
                whiteSpace: 'nowrap',
                boxShadow: '0 0 22px rgba(34,197,94,0.28)',
                pointerEvents: 'none',
              }}>
                ISS live
              </div>
            </Html>
          </group>
        )}
      </group>

      <mesh position={[-5.5, 2.7, -4]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <ambientLight intensity={0.22} color="#7dd3fc" />
      <directionalLight position={[-4, 2.4, 5]} color="#fff7ed" intensity={3.2} />
      <pointLight position={[-5, 2.7, -4]} color="#facc15" intensity={3.5} distance={12} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.25} luminanceSmoothing={0.8} intensity={1.45} radius={0.75} />
      </EffectComposer>
      <OrbitControls ref={controls} enableDamping dampingFactor={0.06} minDistance={1.35} maxDistance={5.6} />
    </>
  );
}

function StatRow({ label, value, unit, color = '#a7f3d0' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '0.48rem 0', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: 12 }}>
      <span style={{ color: 'rgba(255,255,255,0.42)' }}>{label}</span>
      <strong style={{ color, textAlign: 'right' }}>{value}<span style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11, marginLeft: 4 }}>{unit}</span></strong>
    </div>
  );
}

function GroundMap({ issData, track }) {
  const current = issData ? {
    x: ((issData.longitude + 180) / 360) * 100,
    y: ((90 - issData.latitude) / 180) * 100,
  } : null;

  return (
    <div className="iss-ground-map" style={{
      position: 'absolute',
      left: 20,
      bottom: 22,
      width: 'min(430px, calc(100vw - 40px))',
      height: 210,
      zIndex: 24,
      border: '1px solid rgba(255,255,255,0.13)',
      borderRadius: 18,
      overflow: 'hidden',
      backgroundImage: `linear-gradient(rgba(2,6,23,0.22), rgba(2,6,23,0.22)), url(${EARTH_DAY})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      boxShadow: '0 20px 70px rgba(0,0,0,0.32)',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,6,23,0.18), rgba(2,6,23,0.58))' }} />
      {track.slice(-90).map((point, index, arr) => {
        const x = ((point.longitude + 180) / 360) * 100;
        const y = ((90 - point.latitude) / 180) * 100;
        return (
          <span
            key={`${point.timestamp}-${index}`}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: 3,
              height: 3,
              borderRadius: 99,
              background: '#22c55e',
              opacity: 0.18 + (index / Math.max(arr.length, 1)) * 0.75,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 7px rgba(34,197,94,0.65)',
            }}
          />
        );
      })}
      {current && (
        <div style={{ position: 'absolute', left: `${current.x}%`, top: `${current.y}%`, transform: 'translate(-50%, -50%)' }}>
          <span style={{
            display: 'block',
            width: 14,
            height: 14,
            borderRadius: 99,
            border: '3px solid #fff',
            background: '#22c55e',
            boxShadow: '0 0 24px rgba(34,197,94,0.9)',
          }} />
        </div>
      )}
      <div style={{ position: 'absolute', left: 14, top: 12, color: '#fff' }}>
        <div style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', fontWeight: 950, fontSize: 14 }}>Ground track</div>
        <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: 11 }}>Recent ISS subpoint over Earth</div>
      </div>
      <div style={{ position: 'absolute', right: 12, bottom: 10, color: 'rgba(255,255,255,0.7)', fontSize: 11, textAlign: 'right' }}>
        {issData ? `${issData.latitude.toFixed(2)} lat / ${issData.longitude.toFixed(2)} lon` : 'waiting for telemetry'}
      </div>
    </div>
  );
}

function TelemetryPanel({ issData, lastUpdated, error, source }) {
  const altitude = Number(issData?.altitude);
  const orbitRadius = Number.isFinite(altitude) ? EARTH_RADIUS_KM + altitude : null;
  const velocity = kmps(issData?.velocity);
  const visibility = issData?.visibility === 'daylight' ? 'Daylight' : issData?.visibility === 'eclipsed' ? 'Eclipsed' : 'Night side';

  return (
    <aside className="iss-telemetry-panel" style={{
      position: 'absolute',
      top: 88,
      right: 20,
      width: 'min(340px, calc(100vw - 40px))',
      zIndex: 28,
      color: '#fff',
      background: 'rgba(2,6,23,0.84)',
      border: '1px solid rgba(34,197,94,0.24)',
      borderRadius: 20,
      padding: '1rem 1.1rem',
      backdropFilter: 'blur(24px)',
      boxShadow: '0 24px 90px rgba(0,0,0,0.34)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ color: '#86efac', fontSize: 11, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Live orbital telemetry</div>
          <h2 style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', fontSize: '1.45rem', lineHeight: 1.05, marginTop: 4 }}>International Space Station</h2>
          <div style={{ color: 'rgba(255,255,255,0.42)', fontSize: 11, marginTop: 4 }}>Updated {clockTime(lastUpdated)}</div>
        </div>
        <span style={{
          border: '1px solid rgba(34,197,94,0.4)',
          color: '#bbf7d0',
          background: 'rgba(34,197,94,0.1)',
          borderRadius: 999,
          padding: '4px 9px',
          fontSize: 11,
          fontWeight: 900,
        }}>{source}</span>
      </div>

      {error ? (
        <div style={{ color: '#fbbf24', fontSize: 13, lineHeight: 1.55, padding: '0.75rem', borderRadius: 12, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
          Live API is unreachable. Showing the last known or simulated position until the next refresh succeeds.
        </div>
      ) : null}

      <StatRow label="Latitude" value={issData?.latitude?.toFixed(4) ?? 'n/a'} unit="deg" color="#fde68a" />
      <StatRow label="Longitude" value={issData?.longitude?.toFixed(4) ?? 'n/a'} unit="deg" color="#fde68a" />
      <StatRow label="Altitude" value={issData?.altitude?.toFixed(1) ?? 'n/a'} unit="km" color="#86efac" />
      <StatRow label="Velocity" value={velocity} unit="km/s" color="#93c5fd" />
      <StatRow label="Orbit radius" value={orbitRadius ? orbitRadius.toFixed(0) : 'n/a'} unit="km" color="#c4b5fd" />
      <StatRow label="Inclination" value="51.64" unit="deg" color="#c4b5fd" />
      <StatRow label="Period" value="92.9" unit="min" color="#c4b5fd" />
      <StatRow label="Visibility" value={visibility} unit="" color="#fef08a" />

      <div style={{ marginTop: 12, color: 'rgba(255,255,255,0.42)', fontSize: 11, lineHeight: 1.55, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '0.65rem', background: 'rgba(255,255,255,0.035)' }}>
        Green trail is recent live ground track. Pale orbital arc is a one-orbit projection at the ISS inclination.
      </div>
    </aside>
  );
}

function fallbackPosition() {
  const now = Date.now() / 1000;
  const period = 92.9 * 60;
  const phase = (now % period) / period * Math.PI * 2;
  const inclination = 51.64 * Math.PI / 180;
  return {
    latitude: Math.asin(Math.sin(inclination) * Math.sin(phase)) * 180 / Math.PI,
    longitude: normalizeLon((phase * 180 / Math.PI * 1.95) - 160),
    altitude: 420,
    velocity: 27600,
    visibility: Math.sin(phase) > 0 ? 'daylight' : 'eclipsed',
    timestamp: Math.round(now),
  };
}

export default function ISSTracker() {
  const [issData, setIssData] = useState(null);
  const [track, setTrack] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(false);
  const [paused, setPaused] = useState(false);
  const [followMode, setFollowMode] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchPosition() {
      if (paused) return;
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 2600);
      try {
        const response = await fetch(`https://api.wheretheiss.at/v1/satellites/${ISS_ID}`, { signal: controller.signal });
        if (!response.ok) throw new Error('ISS API unavailable');
        const data = await response.json();
        if (!active) return;
        setIssData(data);
        setTrack((previous) => [...previous.slice(-150), data]);
        setLastUpdated(new Date());
        setError(false);
      } catch {
        const data = fallbackPosition();
        if (!active) return;
        setIssData(data);
        setTrack((previous) => [...previous.slice(-150), data]);
        setLastUpdated(new Date());
        setError(true);
      } finally {
        window.clearTimeout(timeout);
      }
    }

    fetchPosition();
    const id = window.setInterval(fetchPosition, 3000);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, [paused]);

  return (
    <div style={{ width: '100%', height: '100vh', minHeight: 720, position: 'relative', background: '#01030b', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0.25, 0.18, 2.65], fov: 45 }} dpr={[1, 1.7]}>
        <Suspense fallback={null}>
          <EarthGlobe issData={issData} track={track} followMode={followMode} />
        </Suspense>
      </Canvas>

      <TelemetryPanel issData={issData} lastUpdated={lastUpdated} error={error} source={error ? 'fallback' : 'live'} />
      <GroundMap issData={issData} track={track} />

      <div className="iss-command-panel" style={{
        position: 'absolute',
        top: 88,
        left: 20,
        zIndex: 26,
        width: 'min(310px, calc(100vw - 40px))',
        color: '#fff',
        background: 'rgba(2,6,23,0.72)',
        border: '1px solid rgba(255,255,255,0.11)',
        borderRadius: 18,
        padding: '0.85rem',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ color: '#86efac', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 900 }}>AstroBis mission view</div>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 1.55, marginTop: 8 }}>
          Textured Earth, live ISS telemetry, recent ground track, and orbit geometry in one navigable 3D scene.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          <button type="button" onClick={() => setFollowMode((value) => !value)} style={buttonStyle(followMode)}>
            Follow ISS
          </button>
          <button type="button" onClick={() => setPaused((value) => !value)} style={buttonStyle(paused)}>
            {paused ? 'Resume feed' : 'Pause feed'}
          </button>
        </div>
      </div>

      <div style={{ position: 'absolute', right: 24, bottom: 18, zIndex: 22, color: 'rgba(255,255,255,0.28)', fontSize: 11 }}>
        Data: wheretheiss.at - Earth texture: Three.js examples
      </div>
    </div>
  );
}

function buttonStyle(active) {
  return {
    border: `1px solid ${active ? 'rgba(34,197,94,0.48)' : 'rgba(255,255,255,0.12)'}`,
    background: active ? 'rgba(34,197,94,0.16)' : 'rgba(255,255,255,0.06)',
    color: active ? '#bbf7d0' : 'rgba(255,255,255,0.7)',
    borderRadius: 999,
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
    fontWeight: 850,
    fontSize: 12,
  };
}
