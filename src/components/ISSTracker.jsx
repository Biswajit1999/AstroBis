import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Html, Line, OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import * as satellite from 'satellite.js';

const EARTH_RADIUS_KM = 6371;
const ISS_CATNR = 25544;
const BASE_PATH = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const LOCAL_TLE_URL = `${BASE_PATH}data/iss-tle.json`;
const CELESTRAK_TLE_URL = `https://celestrak.org/NORAD/elements/gp.php?CATNR=${ISS_CATNR}&FORMAT=TLE`;
const INITIAL_RENDER_DATE = new Date('2026-01-01T00:00:00.000Z');

const EARTH_TEXTURES = {
  day: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
  normal: 'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
  specular: 'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg',
  lights: 'https://threejs.org/examples/textures/planets/earth_lights_2048.png',
  clouds: 'https://threejs.org/examples/textures/planets/earth_clouds_1024.png',
};

const FALLBACK_TLE = {
  name: 'ISS (ZARYA)',
  line1: '1 25544U 98067A   26171.00000000  .00016717  00000+0  10270-3 0  9993',
  line2: '2 25544  51.6400 000.0000 0006703 000.0000 000.0000 15.50000000    10',
  source: 'offline fallback TLE',
  generatedAt: '2026-01-01T00:00:00.000Z',
};

function normalizeLon(lon) {
  return ((lon + 540) % 360) - 180;
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

function parseTleText(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 3 || !lines[1].startsWith('1 ') || !lines[2].startsWith('2 ')) {
    throw new Error('Invalid TLE payload');
  }
  return {
    name: lines[0],
    line1: lines[1],
    line2: lines[2],
    source: 'CelesTrak live GP/TLE',
    generatedAt: new Date().toISOString(),
  };
}

function tleEpochDate(satrec) {
  if (!satrec?.epochyr || !Number.isFinite(satrec.epochdays)) return null;
  const year = satrec.epochyr < 57 ? 2000 + satrec.epochyr : 1900 + satrec.epochyr;
  const start = Date.UTC(year, 0, 1, 0, 0, 0, 0);
  return new Date(start + (satrec.epochdays - 1) * 86400000);
}

function computeState(satrec, date = new Date()) {
  if (!satrec) return null;
  const pv = satellite.propagate(satrec, date);
  if (!pv?.position || !pv?.velocity) return null;

  const gmst = satellite.gstime(date);
  const geo = satellite.eciToGeodetic(pv.position, gmst);
  const latitude = satellite.degreesLat(geo.latitude);
  const longitude = normalizeLon(satellite.degreesLong(geo.longitude));
  const altitude = geo.height;
  const velocity = Math.sqrt((pv.velocity.x ** 2) + (pv.velocity.y ** 2) + (pv.velocity.z ** 2));
  const orbitalRadius = EARTH_RADIUS_KM + altitude;
  const visibility = isDaylight(latitude, longitude, date) ? 'daylight' : 'eclipsed';

  return {
    latitude,
    longitude,
    altitude,
    velocity,
    orbitalRadius,
    visibility,
    timestamp: date.getTime(),
    date,
  };
}

function isDaylight(lat, lon, date) {
  const subsolar = subsolarPoint(date);
  const hourAngle = (lon - subsolar.longitude) * Math.PI / 180;
  const elevation = Math.asin(
    Math.sin(lat * Math.PI / 180) * Math.sin(subsolar.latitude * Math.PI / 180)
    + Math.cos(lat * Math.PI / 180) * Math.cos(subsolar.latitude * Math.PI / 180) * Math.cos(hourAngle),
  ) * 180 / Math.PI;
  return elevation > -6;
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

function buildOrbitPoints(satrec, minutesBefore = 46, minutesAfter = 92, stepMinutes = 2) {
  if (!satrec) return [];
  const now = Date.now();
  const points = [];
  for (let minutes = -minutesBefore; minutes <= minutesAfter; minutes += stepMinutes) {
    const state = computeState(satrec, new Date(now + minutes * 60000));
    if (state) {
      points.push(latLonVector(state.latitude, state.longitude, 1 + Math.max(0, state.altitude) / EARTH_RADIUS_KM));
    }
  }
  return points;
}

function buildGroundTrack(satrec, minutesBefore = 46, minutesAfter = 92, stepMinutes = 2) {
  if (!satrec) return [];
  const now = Date.now();
  const points = [];
  for (let minutes = -minutesBefore; minutes <= minutesAfter; minutes += stepMinutes) {
    const state = computeState(satrec, new Date(now + minutes * 60000));
    if (state) points.push(state);
  }
  return points;
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
    uniforms: {
      glowColor: { value: new THREE.Color('#60a5fa') },
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
      varying vec3 vNormal;
      void main() {
        float rim = pow(0.72 - abs(vNormal.z), 2.2);
        gl_FragColor = vec4(glowColor, clamp(rim, 0.0, 0.18));
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  return (
    <mesh>
      <sphereGeometry args={[1.052, 96, 96]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function clockTime(date) {
  if (!date) return 'connecting';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function ageText(date) {
  if (!date) return 'n/a';
  const hours = Math.max(0, (Date.now() - date.getTime()) / 3600000);
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 48) return `${hours.toFixed(1)} hr`;
  return `${(hours / 24).toFixed(1)} days`;
}

function accuracyScore(date) {
  if (!date) {
    return { score: 'n/a', color: '#fbbf24', note: 'Waiting for a valid TLE epoch.' };
  }
  const hours = Math.max(0, (Date.now() - date.getTime()) / 3600000);
  if (hours <= 6) return { score: '9.0', color: '#86efac', note: 'Excellent for public real-time visualization.' };
  if (hours <= 12) return { score: '8.5', color: '#a7f3d0', note: 'Very good for browser visualization.' };
  if (hours <= 24) return { score: '8.0', color: '#fde68a', note: 'Good; refresh the TLE for the best match.' };
  if (hours <= 48) return { score: '7.0', color: '#fbbf24', note: 'Useful visual estimate, but the TLE is aging.' };
  return { score: '5.5', color: '#fb7185', note: 'Approximate only until a newer TLE is available.' };
}

function EarthGlobe({ satrec, issData, trail, followMode, layers }) {
  const [earthDay, earthNormal, earthSpecular, earthLights, earthClouds] = useLoader(THREE.TextureLoader, [
    EARTH_TEXTURES.day,
    EARTH_TEXTURES.normal,
    EARTH_TEXTURES.specular,
    EARTH_TEXTURES.lights,
    EARTH_TEXTURES.clouds,
  ]);
  const clouds = useRef();
  const issGlow = useRef();
  const controls = useRef();
  const issPoint = issData ? latLonVector(issData.latitude, issData.longitude, 1 + Math.max(0, issData.altitude) / EARTH_RADIUS_KM) : null;
  const subsolar = useMemo(() => subsolarPoint(issData?.date || INITIAL_RENDER_DATE), [issData?.timestamp]);
  const sunVector = useMemo(() => latLonVector(subsolar.latitude, subsolar.longitude, 6.6), [subsolar.latitude, subsolar.longitude]);
  const sunDirection = useMemo(() => sunVector.clone().normalize(), [sunVector]);
  const nextPoint = useMemo(() => {
    if (!satrec || !issData?.timestamp) return null;
    const next = computeState(satrec, new Date(issData.timestamp + 60_000));
    return next ? latLonVector(next.latitude, next.longitude, 1 + Math.max(0, next.altitude) / EARTH_RADIUS_KM) : null;
  }, [satrec, issData?.timestamp]);
  const orbitPoints = useMemo(() => buildOrbitPoints(satrec), [satrec, issData?.timestamp]);
  const trailPoints = useMemo(() => trail.map((point) => latLonVector(point.latitude, point.longitude, 1 + Math.max(0, point.altitude) / EARTH_RADIUS_KM)), [trail]);

  useMemo(() => {
    [earthDay, earthLights, earthClouds].forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
    });
    earthNormal.anisotropy = 8;
    earthSpecular.anisotropy = 8;
  }, [earthDay, earthNormal, earthSpecular, earthLights, earthClouds]);

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    if (clouds.current) clouds.current.rotation.y = t * 0.008;
    if (issGlow.current) issGlow.current.scale.setScalar(1 + Math.sin(t * 5.4) * 0.18);
    if (followMode && issPoint && controls.current) {
      const target = issPoint.clone().multiplyScalar(0.42);
      controls.current.target.lerp(target, 0.045);
      camera.lookAt(controls.current.target);
    }
  });

  return (
    <>
      <color attach="background" args={['#01030b']} />
      <Stars radius={190} depth={80} count={9800} factor={3.4} saturation={0.12} fade speed={0.08} />

      <group>
        <mesh>
          <sphereGeometry args={[1, 128, 128]} />
          <meshPhongMaterial
            map={earthDay}
            normalMap={earthNormal}
            normalScale={new THREE.Vector2(0.38, 0.38)}
            specularMap={earthSpecular}
            specular={new THREE.Color('#335f8d')}
            shininess={22}
          />
        </mesh>
        {layers.cityLights && <NightLightsLayer texture={earthLights} sunDirection={sunDirection} />}
        {layers.clouds && (
          <mesh ref={clouds}>
            <sphereGeometry args={[1.013, 128, 128]} />
            <meshLambertMaterial map={earthClouds} transparent opacity={0.33} depthWrite={false} />
          </mesh>
        )}
        <AtmosphereShell />

        {layers.orbit && orbitPoints.length > 1 && <Line points={orbitPoints} color="#e5e7eb" transparent opacity={0.28} lineWidth={0.9} />}
        {layers.orbit && trailPoints.length > 1 && <Line points={trailPoints} color="#22c55e" transparent opacity={0.92} lineWidth={2.4} />}
        {layers.orbit && issPoint && nextPoint && <Line points={[issPoint, nextPoint]} color="#67e8f9" transparent opacity={0.9} lineWidth={2.2} />}

        {layers.sun && <group position={latLonVector(subsolar.latitude, subsolar.longitude, 1.018)}>
          <mesh>
            <sphereGeometry args={[0.026, 24, 24]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
          <mesh>
            <ringGeometry args={[0.034, 0.048, 48]} />
            <meshBasicMaterial color="#facc15" transparent opacity={0.48} side={THREE.DoubleSide} />
          </mesh>
          <Html center distanceFactor={2.4}>
            <div style={{
              color: '#fef9c3',
              background: 'rgba(2,6,23,0.7)',
              border: '1px solid rgba(250,204,21,0.35)',
              borderRadius: 999,
              padding: '2px 7px',
              fontSize: 10,
              fontWeight: 900,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}>Sun overhead</div>
          </Html>
        </group>}

        {issPoint && (
          <group position={issPoint}>
            <mesh>
              <boxGeometry args={[0.038, 0.012, 0.012]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.01, 0.095, 0.003]} />
              <meshBasicMaterial color="#60a5fa" />
            </mesh>
            <mesh ref={issGlow}>
              <sphereGeometry args={[0.056, 24, 24]} />
              <meshBasicMaterial color="#22c55e" transparent opacity={0.28} />
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
                ISS SGP4
              </div>
            </Html>
          </group>
        )}
      </group>

      {layers.sun && (
        <group position={sunVector.toArray()}>
          <mesh>
            <sphereGeometry args={[0.28, 48, 48]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.62, 48, 48]} />
            <meshBasicMaterial color="#facc15" transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[1.04, 48, 48]} />
            <meshBasicMaterial color="#fb923c" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
      )}
      <ambientLight intensity={0.12} color="#7dd3fc" />
      <directionalLight position={sunVector.toArray()} color="#fff7ed" intensity={3.8} />
      <pointLight position={sunVector.toArray()} color="#facc15" intensity={3.5} distance={12} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.25} luminanceSmoothing={0.82} intensity={1.42} radius={0.75} />
      </EffectComposer>
      <OrbitControls ref={controls} enableDamping dampingFactor={0.06} minDistance={1.32} maxDistance={5.8} />
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

function GroundMap({ issData, groundTrack }) {
  const current = issData ? {
    x: ((issData.longitude + 180) / 360) * 100,
    y: ((90 - issData.latitude) / 180) * 100,
  } : null;
  const subsolar = subsolarPoint(issData?.date || INITIAL_RENDER_DATE);
  const sun = {
    x: ((subsolar.longitude + 180) / 360) * 100,
    y: ((90 - subsolar.latitude) / 180) * 100,
  };

  return (
    <div className="iss-ground-map" style={{
      position: 'absolute',
      left: 20,
      bottom: 22,
      width: 'min(460px, calc(100vw - 40px))',
      height: 226,
      zIndex: 24,
      border: '1px solid rgba(255,255,255,0.13)',
      borderRadius: 18,
      overflow: 'hidden',
      backgroundImage: `linear-gradient(rgba(2,6,23,0.10), rgba(2,6,23,0.36)), url(${EARTH_TEXTURES.day})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      boxShadow: '0 20px 70px rgba(0,0,0,0.32)',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,6,23,0.08), rgba(2,6,23,0.60))' }} />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.9 }}>
        <path d={terminatorPath(subsolar)} fill="none" stroke="rgba(250,204,21,0.78)" strokeWidth="0.45" strokeDasharray="1.6 1.2" />
      </svg>
      {groundTrack.map((point, index) => {
        const x = ((point.longitude + 180) / 360) * 100;
        const y = ((90 - point.latitude) / 180) * 100;
        const isPast = point.timestamp <= Date.now();
        return (
          <span
            key={`${point.timestamp}-${index}`}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: isPast ? 3 : 2,
              height: isPast ? 3 : 2,
              borderRadius: 99,
              background: isPast ? '#22c55e' : '#93c5fd',
              opacity: isPast ? 0.82 : 0.5,
              transform: 'translate(-50%, -50%)',
              boxShadow: isPast ? '0 0 8px rgba(34,197,94,0.7)' : '0 0 7px rgba(147,197,253,0.6)',
            }}
          />
        );
      })}
      <span style={{
        position: 'absolute',
        left: `${sun.x}%`,
        top: `${sun.y}%`,
        width: 18,
        height: 18,
        borderRadius: 99,
        transform: 'translate(-50%, -50%)',
        background: '#facc15',
        border: '2px solid rgba(254,240,138,0.9)',
        boxShadow: '0 0 22px rgba(250,204,21,0.95), 0 0 52px rgba(251,191,36,0.45)',
      }} />
      {current && (
        <div style={{ position: 'absolute', left: `${current.x}%`, top: `${current.y}%`, transform: 'translate(-50%, -50%)' }}>
          <span style={{
            display: 'block',
            width: 15,
            height: 15,
            borderRadius: 99,
            border: '3px solid #fff',
            background: '#22c55e',
            boxShadow: '0 0 24px rgba(34,197,94,0.9)',
          }} />
        </div>
      )}
      <div style={{ position: 'absolute', left: 14, top: 12, color: '#fff' }}>
        <div style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', fontWeight: 950, fontSize: 14 }}>SGP4 ground track</div>
        <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: 11 }}>Green past / blue projected orbit / yellow terminator</div>
      </div>
      <div style={{ position: 'absolute', right: 12, bottom: 10, color: 'rgba(255,255,255,0.74)', fontSize: 11, textAlign: 'right' }}>
        {issData ? `${issData.latitude.toFixed(2)} lat / ${issData.longitude.toFixed(2)} lon` : 'waiting for TLE propagation'}
      </div>
    </div>
  );
}

function TelemetryPanel({ issData, lastUpdated, tle, tleEpoch, error, source }) {
  const visibility = issData?.visibility === 'daylight' ? 'Daylight' : 'Eclipsed / night side';
  const subsolar = subsolarPoint(issData?.date || INITIAL_RENDER_DATE);
  const accuracy = accuracyScore(tleEpoch);
  return (
    <aside className="iss-telemetry-panel" style={{
      position: 'absolute',
      top: 88,
      right: 20,
      width: 'min(360px, calc(100vw - 40px))',
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
          <div style={{ color: '#86efac', fontSize: 11, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase' }}>CelesTrak TLE + SGP4</div>
          <h2 style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', fontSize: '1.45rem', lineHeight: 1.05, marginTop: 4 }}>{tle?.name || 'International Space Station'}</h2>
          <div style={{ color: 'rgba(255,255,255,0.42)', fontSize: 11, marginTop: 4 }}>Propagated {clockTime(lastUpdated)}</div>
        </div>
        <span style={{
          border: `1px solid ${error ? 'rgba(251,191,36,0.4)' : 'rgba(34,197,94,0.4)'}`,
          color: error ? '#fde68a' : '#bbf7d0',
          background: error ? 'rgba(251,191,36,0.1)' : 'rgba(34,197,94,0.1)',
          borderRadius: 999,
          padding: '4px 9px',
          fontSize: 11,
          fontWeight: 900,
        }}>{source}</span>
      </div>

      {error ? (
        <div style={{ color: '#fbbf24', fontSize: 13, lineHeight: 1.55, padding: '0.75rem', borderRadius: 12, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
          Live CelesTrak refresh is unavailable. Using the latest same-origin TLE snapshot.
        </div>
      ) : null}

      <StatRow label="Latitude" value={issData?.latitude?.toFixed(4) ?? 'n/a'} unit="deg" color="#fde68a" />
      <StatRow label="Longitude" value={issData?.longitude?.toFixed(4) ?? 'n/a'} unit="deg" color="#fde68a" />
      <StatRow label="Altitude" value={issData?.altitude?.toFixed(1) ?? 'n/a'} unit="km" color="#86efac" />
      <StatRow label="Velocity" value={issData?.velocity?.toFixed(3) ?? 'n/a'} unit="km/s" color="#93c5fd" />
      <StatRow label="Orbit radius" value={issData?.orbitalRadius?.toFixed(0) ?? 'n/a'} unit="km" color="#c4b5fd" />
      <StatRow label="Inclination" value="51.64" unit="deg" color="#c4b5fd" />
      <StatRow label="Period" value="92.9" unit="min" color="#c4b5fd" />
      <StatRow label="Visibility" value={visibility} unit="" color="#fef08a" />
      <StatRow label="Subsolar point" value={`${subsolar.latitude.toFixed(1)}, ${subsolar.longitude.toFixed(1)}`} unit="deg" color="#fef08a" />
      <StatRow label="TLE epoch age" value={ageText(tleEpoch)} unit="" color={tleEpoch && Date.now() - tleEpoch.getTime() < 172800000 ? '#86efac' : '#fbbf24'} />
      <StatRow label="Tracking confidence" value={accuracy.score} unit={accuracy.score === 'n/a' ? '' : '/10'} color={accuracy.color} />

      <div style={{ marginTop: 12, color: 'rgba(255,255,255,0.42)', fontSize: 11, lineHeight: 1.55, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '0.65rem', background: 'rgba(255,255,255,0.035)' }}>
        <strong style={{ color: 'rgba(255,255,255,0.7)' }}>ZARYA note:</strong> CelesTrak uses ISS (ZARYA) for NORAD 25544, the station TLE name inherited from the first ISS module. Position is propagated locally with SGP4. {accuracy.note}
      </div>
    </aside>
  );
}

async function loadTleSnapshot() {
  const local = await fetch(LOCAL_TLE_URL, { cache: 'no-store' });
  if (!local.ok) throw new Error('Local ISS TLE snapshot unavailable');
  return local.json();
}

async function loadLiveTle() {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 4200);
  try {
    const response = await fetch(CELESTRAK_TLE_URL, { signal: controller.signal });
    if (!response.ok) throw new Error('CelesTrak unavailable');
    const text = await response.text();
    return parseTleText(text);
  } finally {
    window.clearTimeout(timeout);
  }
}

export default function ISSTracker() {
  const [tle, setTle] = useState(null);
  const [satrec, setSatrec] = useState(null);
  const [tleEpoch, setTleEpoch] = useState(null);
  const [issData, setIssData] = useState(null);
  const [trail, setTrail] = useState([]);
  const [groundTrack, setGroundTrack] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(false);
  const [paused, setPaused] = useState(false);
  const [followMode, setFollowMode] = useState(true);
  const [showClouds, setShowClouds] = useState(true);
  const [showCityLights, setShowCityLights] = useState(true);
  const [showOrbit, setShowOrbit] = useState(true);
  const [showSun, setShowSun] = useState(true);
  const [showIssModel, setShowIssModel] = useState(true);

  useEffect(() => {
    let active = true;
    async function hydrateTle() {
      try {
        const snapshot = await loadTleSnapshot();
        if (!active) return;
        setTle(snapshot);
        setError(snapshot.source === 'offline fallback');
      } catch {
        if (!active) return;
        setTle(FALLBACK_TLE);
        setError(true);
      }

      try {
        const live = await loadLiveTle();
        if (!active) return;
        setTle(live);
        setError(false);
      } catch {
        if (active) setError(true);
      }
    }
    hydrateTle();
    const id = window.setInterval(hydrateTle, 30 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (!tle?.line1 || !tle?.line2) return;
    try {
      const record = satellite.twoline2satrec(tle.line1, tle.line2);
      setSatrec(record);
      setTleEpoch(tleEpochDate(record));
    } catch {
      setSatrec(null);
      setTleEpoch(null);
      setError(true);
    }
  }, [tle]);

  useEffect(() => {
    if (!satrec) return;
    function tick() {
      if (paused) return;
      const state = computeState(satrec, new Date());
      if (!state) return;
      setIssData(state);
      setLastUpdated(new Date());
      setTrail((previous) => [...previous.slice(-95), state]);
      setGroundTrack(buildGroundTrack(satrec));
    }
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [satrec, paused]);

  const sourceLabel = error ? 'snapshot' : tle?.source?.includes('live') ? 'live TLE' : 'snapshot';

  return (
    <div style={{ width: '100%', height: '100vh', minHeight: 720, position: 'relative', background: '#01030b', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0.24, 0.22, 2.7], fov: 45 }} dpr={[1, 1.85]}>
        <Suspense fallback={null}>
          <EarthGlobe
            satrec={satrec}
            issData={issData}
            trail={trail}
            followMode={followMode}
            layers={{
              clouds: showClouds,
              cityLights: showCityLights,
              orbit: showOrbit,
              sun: showSun,
            }}
          />
        </Suspense>
      </Canvas>

      <TelemetryPanel issData={issData} lastUpdated={lastUpdated} tle={tle} tleEpoch={tleEpoch} error={error} source={sourceLabel} />
      <GroundMap issData={issData} groundTrack={groundTrack} />

      <div className="iss-command-panel" style={{
        position: 'absolute',
        top: 88,
        left: 20,
        zIndex: 26,
        width: 'min(360px, calc(100vw - 40px))',
        color: '#fff',
        background: 'rgba(2,6,23,0.72)',
        border: '1px solid rgba(255,255,255,0.11)',
        borderRadius: 18,
        padding: '0.85rem',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ color: '#86efac', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 900 }}>AstroBis mission view</div>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 1.55, marginTop: 8 }}>
          Real-time ISS position from CelesTrak TLE propagation, rendered over a textured Earth with normal, specular, clouds, and city-light layers.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          <button type="button" onClick={() => setFollowMode((value) => !value)} style={buttonStyle(followMode)}>
            Follow ISS
          </button>
          <button type="button" onClick={() => setPaused((value) => !value)} style={buttonStyle(paused)}>
            {paused ? 'Resume propagation' : 'Pause propagation'}
          </button>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ color: '#93c5fd', fontSize: 10, letterSpacing: '0.13em', textTransform: 'uppercase', fontWeight: 900, marginBottom: 8 }}>Visual layers</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            <button type="button" onClick={() => setShowClouds((value) => !value)} style={buttonStyle(showClouds, '#93c5fd')}>Clouds</button>
            <button type="button" onClick={() => setShowCityLights((value) => !value)} style={buttonStyle(showCityLights, '#facc15')}>City lights</button>
            <button type="button" onClick={() => setShowOrbit((value) => !value)} style={buttonStyle(showOrbit, '#22c55e')}>Orbit trail</button>
            <button type="button" onClick={() => setShowSun((value) => !value)} style={buttonStyle(showSun, '#fbbf24')}>Sun vector</button>
            <button type="button" onClick={() => setShowIssModel((value) => !value)} style={buttonStyle(showIssModel, '#c4b5fd')}>ISS model</button>
          </div>
        </div>
        {showIssModel && (
          <div style={{
            marginTop: 14,
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
            overflow: 'hidden',
            background: 'rgba(0,0,0,0.36)',
          }}>
            <iframe
              title="NASA 3D ISS model"
              src="https://solarsystem.nasa.gov/gltf_embed/2378/"
              loading="lazy"
              style={{ width: '100%', height: 128, border: 0, display: 'block', background: '#000' }}
            />
            <div style={{ padding: '0.42rem 0.6rem', color: 'rgba(255,255,255,0.48)', fontSize: 10, lineHeight: 1.35 }}>
              Official NASA 3D station model. The green marker in the globe is the propagated orbital position.
            </div>
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', right: 24, bottom: 18, zIndex: 22, color: 'rgba(255,255,255,0.28)', fontSize: 11 }}>
        Data: CelesTrak GP/TLE + SGP4 - Earth maps: Three.js examples
      </div>
    </div>
  );
}

function buttonStyle(active, color = '#22c55e') {
  return {
    border: `1px solid ${active ? `${color}78` : 'rgba(255,255,255,0.12)'}`,
    background: active ? `${color}21` : 'rgba(255,255,255,0.06)',
    color: active ? color : 'rgba(255,255,255,0.7)',
    borderRadius: 999,
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
    fontWeight: 850,
    fontSize: 12,
  };
}
