import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Line } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// ─── Lat/lon → 3D vector on sphere ───────────────────────────────────────────
function latLon3D(lat, lon, r = 1.02) {
  const φ = (90 - lat) * Math.PI / 180;
  const θ = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(
    -r * Math.sin(φ) * Math.cos(θ),
     r * Math.cos(φ),
     r * Math.sin(φ) * Math.sin(θ)
  );
}

// Build orbital path ring at ISS inclination 51.64°
function buildOrbitPath() {
  const pts = [];
  const inc = 51.64 * Math.PI / 180;
  for (let i = 0; i <= 180; i++) {
    const a = (i / 180) * Math.PI * 2;
    pts.push(new THREE.Vector3(
      1.075 * Math.cos(a),
      1.075 * Math.sin(a) * Math.sin(inc),
      1.075 * Math.sin(a) * Math.cos(inc)
    ));
  }
  return pts;
}

// ─── Earth globe ─────────────────────────────────────────────────────────────
function makeEarthTex() {
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512;
  const ctx = cv.getContext('2d');
  const g = ctx.createLinearGradient(0,0,0,512);
  g.addColorStop(0,'#0d3060'); g.addColorStop(0.15,'#1a5fb5');
  g.addColorStop(0.5,'#1565c0'); g.addColorStop(0.85,'#1a5fb5'); g.addColorStop(1,'#0d3060');
  ctx.fillStyle=g; ctx.fillRect(0,0,1024,512);
  ctx.fillStyle='#d0e8f5'; ctx.fillRect(0,0,1024,35); ctx.fillRect(0,477,1024,35);
  const cc=[['#2e7d4f',180,155,75,90,-0.3],['#3a8a50',225,305,42,72,0.2],
            ['#2e7d4f',455,158,55,65,0],['#4a7030',475,282,42,82,0.1],
            ['#2e7d4f',690,140,125,72,-0.1],['#7a6020',785,328,58,42,0.2]];
  cc.forEach(([c,x,y,rx,ry,r])=>{ ctx.fillStyle=c; ctx.beginPath(); ctx.ellipse(x,y,rx,ry,r,0,Math.PI*2); ctx.fill(); });
  ctx.fillStyle='rgba(255,255,255,0.15)';
  for(let i=0;i<35;i++){ ctx.beginPath(); ctx.ellipse(Math.random()*1024,Math.random()*512,30+Math.random()*60,8+Math.random()*18,Math.random(),0,Math.PI*2); ctx.fill(); }
  return new THREE.CanvasTexture(cv);
}
let _earthTex = null;
const getEarthTex = () => { if (typeof window==='undefined') return null; if (!_earthTex) _earthTex=makeEarthTex(); return _earthTex; };

// ─── Globe scene ──────────────────────────────────────────────────────────────
const GlobeScene = ({ issData, track }) => {
  const earthRef = useRef();
  const issDotRef = useRef();
  const glowRef = useRef();
  const orbitPts = useMemo(() => buildOrbitPath(), []);
  const tex = getEarthTex();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (earthRef.current) earthRef.current.rotation.y += 0.0008;
    // ISS dot glow pulse
    if (glowRef.current) glowRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.3);
  });

  const issPos = useMemo(() => {
    if (!issData) return null;
    return latLon3D(issData.latitude, issData.longitude, 1.09);
  }, [issData]);

  const trackPts = useMemo(() => {
    if (track.length < 2) return [];
    return track.map(p => latLon3D(p.lat, p.lon, 1.09));
  }, [track]);

  return (
    <>
      <Stars radius={120} depth={50} count={6000} factor={3} saturation={0.2} fade />

      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial map={tex} shininess={15} />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={earthRef} rotation={[0, 0.3, 0]}>
        <sphereGeometry args={[1.007, 48, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.07} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.04, 32, 32]} />
        <meshBasicMaterial color="#4488ff" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>

      {/* ISS orbital path */}
      <Line points={orbitPts} color="#ffffff" transparent opacity={0.20} lineWidth={0.8} />

      {/* Ground track */}
      {trackPts.length > 1 && (
        <Line points={trackPts} color="#ffee44" transparent opacity={0.50} lineWidth={1.5} />
      )}

      {/* ISS position dot */}
      {issPos && (
        <group position={[issPos.x, issPos.y, issPos.z]}>
          {/* Core dot (white — triggers bloom) */}
          <mesh>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Pulsing glow ring */}
          <mesh ref={glowRef}>
            <sphereGeometry args={[0.032, 8, 8]} />
            <meshBasicMaterial color="#ffee44" transparent opacity={0.35} />
          </mesh>
          {/* Label */}
          <Html center distanceFactor={3}>
            <div style={{
              color:'#ffee44', fontSize:11, fontWeight:700,
              fontFamily:'Space Grotesk,sans-serif',
              background:'rgba(0,0,0,0.6)', padding:'2px 7px',
              borderRadius:10, whiteSpace:'nowrap', pointerEvents:'none',
              border:'1px solid rgba(255,238,68,0.4)',
            }}>🛰 ISS</div>
          </Html>
        </group>
      )}

      {/* Lighting */}
      <ambientLight intensity={0.25} color="#334466" />
      <pointLight color="#fff8e8" intensity={2.5} distance={20} position={[5, 3, 5]} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={1.8} radius={0.8} />
      </EffectComposer>
      <OrbitControls enableZoom enableDamping dampingFactor={0.06} minDistance={1.3} maxDistance={8} />
    </>
  );
};

// ─── Stats card ───────────────────────────────────────────────────────────────
const StatRow = ({ label, value, unit, color='#a78bfa' }) => (
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',
    borderBottom:'1px solid rgba(255,255,255,0.05)',padding:'0.45rem 0',fontSize:'0.82rem'}}>
    <span style={{color:'rgba(255,255,255,0.42)'}}>{label}</span>
    <span style={{fontWeight:700,color}}>{value}<span style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.35)',marginLeft:4}}>{unit}</span></span>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const ISSTracker = () => {
  const [issData, setIssData] = useState(null);
  const [track,   setTrack]   = useState([]);
  const [error,   setError]   = useState(false);
  const [lastUpd, setLastUpd] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const r = await window.fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const d = await r.json();
        setIssData(d);
        setTrack(prev => [...prev.slice(-120), { lat: d.latitude, lon: d.longitude }]);
        setLastUpd(new Date());
        setError(false);
      } catch { setError(true); }
    };
    fetch();
    const id = setInterval(fetch, 3000);
    return () => clearInterval(id);
  }, []);

  const velocity_kms = issData ? (issData.velocity / 3600).toFixed(2) : '—';
  const visible = issData ? (issData.visibility === 'daylight' ? '☀️ Daylight' : '🌙 Night') : '—';

  return (
    <div style={{ width:'100%', height:'100vh', position:'relative', background:'#02010a' }}>
      <Canvas camera={{ position:[0,0,2.8], fov:45 }}>
        <Suspense fallback={null}>
          <GlobeScene issData={issData} track={track} />
        </Suspense>
      </Canvas>

      {/* Stats panel */}
      <div style={{
        position:'absolute', top:80, right:20, width:270,
        background:'rgba(2,1,10,0.92)', backdropFilter:'blur(20px)',
        border:'1px solid rgba(255,238,68,0.25)', borderRadius:16,
        padding:'1.1rem 1.25rem', zIndex:20, color:'#fff',
        boxShadow:'0 0 40px rgba(255,238,68,0.08)',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.9rem'}}>
          <span style={{fontSize:20}}>🛰</span>
          <div>
            <div style={{fontFamily:'Space Grotesk,sans-serif',fontWeight:800,fontSize:'1.05rem'}}>
              International Space Station
            </div>
            <div style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.35)'}}>
              {lastUpd ? `Updated ${lastUpd.toLocaleTimeString()}` : 'Connecting…'}
            </div>
          </div>
        </div>

        {error ? (
          <p style={{color:'#f87171',fontSize:'0.8rem'}}>⚠ Unable to reach API. Check connection.</p>
        ) : (
          <>
            <StatRow label="Latitude"    value={issData?.latitude?.toFixed(4)  ?? '—'} unit="°"    color='#fde68a' />
            <StatRow label="Longitude"   value={issData?.longitude?.toFixed(4) ?? '—'} unit="°"    color='#fde68a' />
            <StatRow label="Altitude"    value={issData?.altitude?.toFixed(1)  ?? '—'} unit="km"   color='#86efac' />
            <StatRow label="Velocity"    value={velocity_kms}                          unit="km/s"  color='#93c5fd' />
            <StatRow label="Visibility"  value={visible}                               unit=""      color='#c4b5fd' />
            <StatRow label="Orbit inc."  value="51.64"                                 unit="°"     color='#a78bfa' />
            <StatRow label="Orbital period" value="~92"                                unit="min"   color='#a78bfa' />
          </>
        )}

        <div style={{
          marginTop:'0.85rem',padding:'0.5rem',
          background:'rgba(255,238,68,0.06)',
          border:'1px solid rgba(255,238,68,0.15)',
          borderRadius:8, fontSize:'0.72rem', color:'rgba(255,255,255,0.4)',
          lineHeight:1.5,
        }}>
          🟡 Yellow trail = last 6 min ground track<br/>
          ⬜ White ring = full orbital path (51.64° inc.)
        </div>
        <div style={{marginTop:'0.6rem',fontSize:'0.65rem',color:'rgba(255,255,255,0.2)',textAlign:'right'}}>
          Biswajit Jana @2026 · wheretheiss.at API
        </div>
      </div>

      {/* Top overlay */}
      <div style={{
        position:'absolute', top:80, left:20, zIndex:20,
        fontFamily:'Space Grotesk,sans-serif',
        color:'rgba(255,255,255,0.5)',
      }}>
        <div style={{fontSize:'0.7rem',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'0.3rem',color:'rgba(255,238,68,0.6)'}}>
          Live • 3s refresh
        </div>
        <div style={{
          fontSize:'0.72rem',color:'rgba(255,255,255,0.3)',
          display:'flex',flexDirection:'column',gap:4,
        }}>
          <div>🖱 Drag to rotate</div>
          <div>🖱 Scroll to zoom</div>
        </div>
      </div>
    </div>
  );
};

export default ISSTracker;
