import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Accretion disk gradient texture ─────────────────────────────────────────
function makeAccretionTex() {
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 1;
  const ctx = cv.getContext('2d'), g = ctx.createLinearGradient(0, 0, 1024, 0);
  g.addColorStop(0,    'rgba(0,0,0,0)');
  g.addColorStop(0.02, 'rgba(120,180,255,0.95)'); // ISCO — blue-white (hottest)
  g.addColorStop(0.07, 'rgba(200,225,255,0.98)'); // Near-white hot
  g.addColorStop(0.14, 'rgba(255,245,190,0.92)'); // Yellow-white
  g.addColorStop(0.26, 'rgba(255,170,50,0.88)');  // Orange
  g.addColorStop(0.42, 'rgba(255,80,20,0.78)');   // Red-orange
  g.addColorStop(0.60, 'rgba(200,40,10,0.58)');   // Red
  g.addColorStop(0.76, 'rgba(120,20,5,0.32)');    // Dark red
  g.addColorStop(0.90, 'rgba(50,8,2,0.12)');
  g.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 1024, 1);
  return new THREE.CanvasTexture(cv);
}
let _bhTex = null;
const getBHTex = () => { if (typeof window==='undefined') return null; if (!_bhTex) _bhTex=makeAccretionTex(); return _bhTex; };

// UV-corrected ring geometry for radial texture mapping
function makeRingGeo(inner, outer, seg = 256) {
  const g = new THREE.RingGeometry(inner, outer, seg);
  const uv = g.attributes.uv, pos = g.attributes.position;
  for (let i = 0; i < uv.count; i++) {
    const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
    uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
  }
  uv.needsUpdate = true;
  return g;
}

// ─── BlackHole component ──────────────────────────────────────────────────────
const BlackHole = () => {
  const diskGrp    = useRef();
  const innerGlow  = useRef();
  const jet1       = useRef();
  const jet2       = useRef();
  const coronaRef  = useRef();
  const photonRef  = useRef();

  const diskTex    = getBHTex();
  const diskGeo    = useMemo(() => makeRingGeo(9, 48), []);
  const innerGeo   = useMemo(() => makeRingGeo(9, 16, 128), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Disk frame-dragging rotation (Kerr metric)
    if (diskGrp.current)   diskGrp.current.rotation.z  += 0.0016;
    // Inner ISCO flicker — plasma turbulence
    if (innerGlow.current) innerGlow.current.material.opacity = 0.48 + Math.sin(t * 14) * 0.14;
    // Photon ring shimmer
    if (photonRef.current) photonRef.current.material.opacity = 0.70 + Math.sin(t * 9 + 1) * 0.18;
    // Jet plasma pulses (AGN variability)
    if (jet1.current) { const s = 0.82 + Math.sin(t * 3.2) * 0.20; jet1.current.scale.x = jet1.current.scale.z = s; }
    if (jet2.current) { const s = 0.82 + Math.sin(t * 3.2 + Math.PI) * 0.20; jet2.current.scale.x = jet2.current.scale.z = s; }
    // Hot corona breathing
    if (coronaRef.current) coronaRef.current.scale.setScalar(1 + Math.sin(t * 5) * 0.05);
  });

  // Jet segment data [y-pos, cone-radius, cone-height, opacity]
  const upperJetSegs = [[20,1.6,24,0.28],[38,0.9,28,0.18],[60,0.45,32,0.10],[85,0.22,35,0.05]];
  const lowerJetSegs = [[20,1.6,24,0.20],[36,0.9,28,0.12],[55,0.45,30,0.07]];

  return (
    <group>
      {/* ── Gravitational shadow (larger than true EH for visual effect) ── */}
      <mesh>
        <sphereGeometry args={[7.5, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* ── Photon sphere — orbit of light ── */}
      <mesh ref={photonRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.6, 8.15, 256]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.75} />
      </mesh>

      {/* ── Hot X-ray corona ── */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[8.8, 32, 32]} />
        <meshBasicMaterial color="#99bbff" transparent opacity={0.10} side={THREE.BackSide} />
      </mesh>

      {/* ── Accretion disk (tilted 22° — Kerr inclination) ── */}
      <group ref={diskGrp} rotation={[0.38, 0, 0]}>
        {/* Main gradient disk */}
        <mesh geometry={diskGeo}>
          <meshBasicMaterial map={diskTex} side={THREE.DoubleSide} transparent depthWrite={false} />
        </mesh>

        {/* Inner ISCO bright zone (blue-white bloom trigger) */}
        <mesh ref={innerGlow} geometry={innerGeo}>
          <meshBasicMaterial color="#88c4ff" side={THREE.DoubleSide} transparent opacity={0.52} depthWrite={false} />
        </mesh>

        {/* Innermost photon capture ring — white-hot */}
        <mesh>
          <ringGeometry args={[9.0, 10.2, 256]} />
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.60} />
        </mesh>

        {/* Outer dust ring */}
        <mesh>
          <ringGeometry args={[48, 64, 128]} />
          <meshBasicMaterial color="#220800" side={THREE.DoubleSide} transparent opacity={0.18} />
        </mesh>
      </group>

      {/* ── Relativistic jets (M87*-style) ── */}
      <group ref={jet1}>
        {upperJetSegs.map(([y, r, h, o], i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[r, h, 12]} />
            <meshBasicMaterial color={i < 2 ? '#aaccff' : '#7799ee'} transparent opacity={o} />
          </mesh>
        ))}
      </group>
      <group ref={jet2}>
        {lowerJetSegs.map(([y, r, h, o], i) => (
          <mesh key={i} position={[0, -y, 0]}>
            <coneGeometry args={[r, h, 12]} />
            <meshBasicMaterial color="#8899dd" transparent opacity={o} />
          </mesh>
        ))}
      </group>

      {/* ── Disk lighting (illuminates planets) ── */}
      <pointLight color="#ff7722" intensity={3.5} distance={350} decay={1.15} position={[20, 2, 8]} />
      <pointLight color="#3377ff" intensity={1.8} distance={280} decay={1.4}  position={[-16, 4, 0]} />
      <pointLight color="#6688ff" intensity={0.9} distance={130} decay={1.5}  position={[0, 45, 0]} />
    </group>
  );
};

export default BlackHole;
