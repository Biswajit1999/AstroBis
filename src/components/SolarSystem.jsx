import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Line } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import BlackHole from './BlackHole';

// ─── Procedural planet textures ───────────────────────────────────────────────
function makeTexture(w, h, draw) {
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  draw(cv.getContext('2d'), w, h);
  return new THREE.CanvasTexture(cv);
}

const TEXTURES = {};
function getTexture(name) {
  if (typeof window === 'undefined') return null;
  if (TEXTURES[name]) return TEXTURES[name];

  const t = {
    Earth: () => makeTexture(1024, 512, (c, w, h) => {
      // Ocean
      const g = c.createLinearGradient(0,0,0,h);
      g.addColorStop(0,'#0d3060'); g.addColorStop(0.15,'#1a5fb5');
      g.addColorStop(0.5,'#1565c0'); g.addColorStop(0.85,'#1a5fb5'); g.addColorStop(1,'#0d3060');
      c.fillStyle=g; c.fillRect(0,0,w,h);
      // Polar ice
      c.fillStyle='#d0e8f5'; c.fillRect(0,0,w,38); c.fillRect(0,h-38,w,38);
      // Continents
      const cc=[['#2e7d4f',180,155,75,90,-0.3],['#3a8a50',225,305,42,72,0.2],
                ['#2e7d4f',455,158,55,65,0],['#4a7030',475,282,42,82,0.1],
                ['#2e7d4f',690,140,125,72,-0.1],['#7a6020',785,328,58,42,0.2],
                ['#2a6040',880,200,50,60,0.1]];
      cc.forEach(([col,x,y,rx,ry,r])=>{ c.fillStyle=col; c.beginPath(); c.ellipse(x,y,rx,ry,r,0,Math.PI*2); c.fill(); });
      // Clouds
      c.fillStyle='rgba(255,255,255,0.18)';
      for(let i=0;i<40;i++){ c.beginPath(); c.ellipse(Math.random()*w,Math.random()*h,25+Math.random()*65,8+Math.random()*18,Math.random(),0,Math.PI*2); c.fill(); }
    }),
    Mars: () => makeTexture(512, 256, (c, w, h) => {
      const g = c.createLinearGradient(0,0,0,h);
      g.addColorStop(0,'#5a1a00'); g.addColorStop(0.5,'#b03a10'); g.addColorStop(1,'#5a1a00');
      c.fillStyle=g; c.fillRect(0,0,w,h);
      // Ice caps
      c.fillStyle='rgba(220,235,245,0.7)'; c.beginPath(); c.ellipse(w/2,22,55,20,0,0,Math.PI*2); c.fill();
      c.beginPath(); c.ellipse(w/2,h-22,35,14,0,0,Math.PI*2); c.fill();
      // Surface variation
      for(let i=0;i<60;i++){
        c.fillStyle=`rgba(${80+Math.random()*60},${20+Math.random()*20},0,0.25)`;
        c.beginPath(); c.arc(Math.random()*w,Math.random()*h,3+Math.random()*20,0,Math.PI*2); c.fill();
      }
      // Valles Marineris canyon band
      c.fillStyle='rgba(60,10,0,0.4)';
      c.fillRect(0,h*0.42,w,h*0.1);
    }),
    Jupiter: () => makeTexture(1024, 512, (c, w, h) => {
      c.fillStyle='#c4883a'; c.fillRect(0,0,w,h);
      const bands=[['#d4984a',0.05],['#b87830',0.1],['#e0a860',0.08],['#8a5820',0.06],
                   ['#d4984a',0.09],['#c07030',0.07],['#e8b870',0.1],['#a06828',0.08],
                   ['#c8904a',0.07],['#b87030',0.09]];
      let ypos=0;
      bands.forEach(([col,frac])=>{
        const bh=h*frac;
        c.fillStyle=col; c.fillRect(0,ypos,w,bh); ypos+=bh;
      });
      // Fill rest
      c.fillStyle='#c4883a'; c.fillRect(0,ypos,w,h-ypos);
      // Great Red Spot
      c.fillStyle='rgba(180,50,30,0.7)';
      c.beginPath(); c.ellipse(700,260,35,22,0,0,Math.PI*2); c.fill();
      c.fillStyle='rgba(210,80,50,0.5)';
      c.beginPath(); c.ellipse(700,260,25,15,0,0,Math.PI*2); c.fill();
    }),
    Saturn: () => makeTexture(512, 256, (c, w, h) => {
      c.fillStyle='#e8d5a0'; c.fillRect(0,0,w,h);
      const bands=[['#dcc890',0.08],['#f0e0b0',0.06],['#d4bc80',0.07],['#e8d0a0',0.08],
                   ['#c8b078',0.05],['#ead5a8',0.09]];
      let y=0;
      bands.forEach(([col,f])=>{ c.fillStyle=col; c.fillRect(0,y,w,h*f); y+=h*f; });
    }),
    Uranus: () => makeTexture(256, 128, (c, w, h) => {
      const g = c.createLinearGradient(0,0,0,h);
      g.addColorStop(0,'#5cccc0'); g.addColorStop(0.5,'#7de8e0'); g.addColorStop(1,'#5cccc0');
      c.fillStyle=g; c.fillRect(0,0,w,h);
      c.fillStyle='rgba(100,220,215,0.3)';
      for(let i=0;i<12;i++){ c.fillRect(0,i*(h/12),w,h/24); }
    }),
    Neptune: () => makeTexture(256, 128, (c, w, h) => {
      const g = c.createLinearGradient(0,0,0,h);
      g.addColorStop(0,'#1a2a8a'); g.addColorStop(0.5,'#2040cc'); g.addColorStop(1,'#1a2a8a');
      c.fillStyle=g; c.fillRect(0,0,w,h);
      // Dark spot
      c.fillStyle='rgba(10,10,60,0.6)'; c.beginPath(); c.ellipse(150,65,25,18,0,0,Math.PI*2); c.fill();
      // Streaks
      c.fillStyle='rgba(80,120,220,0.25)';
      for(let i=0;i<8;i++){ c.fillRect(0,i*(h/8),w,3); }
    }),
  }[name];
  TEXTURES[name] = t ? t() : null;
  return TEXTURES[name];
}

// ─── Saturn ring texture ───────────────────────────────────────────────────────
function makeSaturnRingTex() {
  const cv = document.createElement('canvas'); cv.width=512; cv.height=1;
  const ctx=cv.getContext('2d'), g=ctx.createLinearGradient(0,0,512,0);
  g.addColorStop(0,    'rgba(190,170,120,0)');
  g.addColorStop(0.04, 'rgba(185,160,110,0.4)');  // D ring
  g.addColorStop(0.12, 'rgba(170,148,100,0.55)'); // C ring
  g.addColorStop(0.28, 'rgba(220,198,148,0.92)'); // B ring (bright)
  g.addColorStop(0.38, 'rgba(215,192,142,0.88)');
  g.addColorStop(0.44, 'rgba(50,40,30,0.05)');    // Cassini division
  g.addColorStop(0.48, 'rgba(50,40,30,0.03)');
  g.addColorStop(0.52, 'rgba(195,172,128,0.78)'); // A ring
  g.addColorStop(0.70, 'rgba(185,162,118,0.62)');
  g.addColorStop(0.82, 'rgba(175,150,108,0.35)'); // F ring fade
  g.addColorStop(0.92, 'rgba(160,138,98,0.12)');
  g.addColorStop(1,    'rgba(160,138,98,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,512,1);
  return new THREE.CanvasTexture(cv);
}
let _satRingTex = null;
const getSaturnRingTex = () => {
  if (typeof window==='undefined') return null;
  if (!_satRingTex) _satRingTex = makeSaturnRingTex();
  return _satRingTex;
};

// ─── Planet catalogue ─────────────────────────────────────────────────────────
const PLANETS = [
  { name:'Mercury', dist:18,  size:0.60, color:'#9E9E9E', emissive:'#1a1a1a', rough:1.0, metal:0, speed:0.80, moons:0,   type:'Rocky',     day:'59 days',   year:'88 days',   desc:'Smallest planet. No atmosphere, extreme temperature swings of 600 °C.', start:0.5  },
  { name:'Venus',   dist:30,  size:1.05, color:'#E8C97E', emissive:'#2a1a00', rough:0.5, metal:0, speed:0.32, moons:0,   type:'Rocky',     day:'243 days',  year:'225 days',  desc:'Hottest at 462 °C. Sulfuric-acid clouds make it the brightest planet to the naked eye.', atm:'#d4a030', atmAlpha:0.14, start:1.2 },
  { name:'Earth',   dist:42,  size:1.10, color:'#4B87C8', emissive:'#030f1e', rough:0.7, metal:0, speed:0.20, moons:1,   type:'Rocky',     day:'24 hours',  year:'365 days',  desc:'Only known harbour of life. 71% water surface, 1 large moon, 1 AU from the Sun.', hasMoon:true, atm:'#4488ff', atmAlpha:0.10, texName:'Earth', start:2.0 },
  { name:'Mars',    dist:60,  size:0.80, color:'#C1440E', emissive:'#1a0400', rough:0.9, metal:0, speed:0.106,moons:2,   type:'Rocky',     day:'24.6 hours',year:'687 days',  desc:'Red Planet. Home of Olympus Mons (22 km) — the tallest volcano in the solar system.', texName:'Mars', start:3.5 },
  { name:'Jupiter', dist:96,  size:3.20, color:'#C88B3A', emissive:'#1a0a00', rough:0.4, metal:0, speed:0.017,moons:95,  type:'Gas Giant', day:'9.9 hours', year:'12 years',  desc:'Largest planet — 1,300 Earths could fit inside. Great Red Spot is a 350-year-old storm.', texName:'Jupiter', start:0.8 },
  { name:'Saturn',  dist:138, size:2.60, color:'#EAD6B8', emissive:'#15100a', rough:0.4, metal:0, speed:0.0068,moons:146,type:'Gas Giant', day:'10.7 hours',year:'29 years',  desc:'Lowest density of any planet — it would float on water. 146 confirmed moons.', hasRings:true, texName:'Saturn', start:4.2 },
  { name:'Uranus',  dist:174, size:2.00, color:'#7DE8E8', emissive:'#052020', rough:0.3, metal:0, speed:0.0024,moons:27, type:'Ice Giant', day:'17.2 hours',year:'84 years',  desc:'Rolls along its orbit on its side (98° tilt). Has 13 faint rings.', hasRings:true, rCol:'#88aaaa', texName:'Uranus', start:1.6 },
  { name:'Neptune', dist:208, size:1.90, color:'#3B5FCC', emissive:'#040820', rough:0.3, metal:0, speed:0.0012,moons:16, type:'Ice Giant', day:'16 hours',   year:'165 years', desc:'Windiest planet — gusts reach 2,100 km/h. Has a Great Dark Spot analogous to Jupiter\'s GRS.', texName:'Neptune', start:3.0 },
];

// ─── Orbit path ───────────────────────────────────────────────────────────────
const OrbitRing = ({ dist, visible, color = '#ffffff', opacity = 0.13 }) => {
  const pts = useMemo(() => {
    const a = [];
    for (let i=0; i<=128; i++) { const θ=(i/128)*Math.PI*2; a.push([Math.cos(θ)*dist,0,Math.sin(θ)*dist]); }
    return a;
  }, [dist]);
  if (!visible) return null;
  return <Line points={pts} color={color} transparent opacity={opacity} lineWidth={0.5} />;
};

// ─── Habitable zone ───────────────────────────────────────────────────────────
const HabitableZone = ({ visible }) => {
  if (!visible) return null;
  const rings = [
    { r:33, w:1.5, col:'#00ff88', o:0.07 }, { r:36, w:2, col:'#00ff88', o:0.10 },
    { r:39, w:2, col:'#22ff99', o:0.12 }, { r:42, w:2, col:'#44ffaa', o:0.10 },
    { r:45, w:1.5, col:'#22ffaa', o:0.08 }, { r:48, w:1, col:'#00ff88', o:0.06 },
  ];
  return (
    <group>
      {rings.map((r, i) => (
        <mesh key={i} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[r.r - r.w/2, r.r + r.w/2, 128]} />
          <meshBasicMaterial color={r.col} transparent opacity={r.o} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

// ─── Ecliptic disc ────────────────────────────────────────────────────────────
const EclipticPlane = ({ visible }) => {
  if (!visible) return null;
  return (
    <mesh rotation={[-Math.PI/2, 0, 0]}>
      <ringGeometry args={[0, 250, 64]} />
      <meshBasicMaterial color="#3344aa" transparent opacity={0.025} side={THREE.DoubleSide} />
    </mesh>
  );
};

// Sun removed — replaced by BlackHole (imported above)

// ─── Saturn rings ─────────────────────────────────────────────────────────────
const SaturnRings = ({ size }) => {
  const tex = getSaturnRingTex();
  const inner = size * 1.18, outer = size * 2.35;
  const geo = useMemo(() => {
    const g = new THREE.RingGeometry(inner, outer, 256);
    // Fix UVs for radial texture
    const uv = g.attributes.uv;
    const pos = g.attributes.position;
    for (let i = 0; i < uv.count; i++) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      const r = v.length();
      uv.setXY(i, (r - inner) / (outer - inner), 0.5);
    }
    uv.needsUpdate = true;
    return g;
  }, [inner, outer]);

  return (
    <group rotation={[0.44, 0, 0.06]}>
      <mesh geometry={geo}>
        <meshBasicMaterial map={tex} side={THREE.DoubleSide} transparent opacity={0.88} />
      </mesh>
    </group>
  );
};

// Uranus thin rings
const UranusRings = ({ size }) => (
  <group rotation={[Math.PI/2.05, 0, 0]}>
    {[1.5, 1.65, 1.72].map((r, i) => (
      <mesh key={i}>
        <ringGeometry args={[size*r, size*r+0.2, 64]} />
        <meshBasicMaterial color="#88cccc" side={THREE.DoubleSide} transparent opacity={0.3-i*0.08} />
      </mesh>
    ))}
  </group>
);

// Earth moon
const Moon = ({ parentSize }) => {
  const ref = useRef(); const ang = useRef(0);
  const r = parentSize * 3.2;
  useFrame((_, dt) => {
    ang.current += 0.7 * dt;
    if (ref.current) { ref.current.position.x=Math.cos(ang.current)*r; ref.current.position.z=Math.sin(ang.current)*r; }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[parentSize*0.27, 16, 16]} />
      <meshStandardMaterial color="#aaa" roughness={1} metalness={0} />
    </mesh>
  );
};

// ─── Asteroid belt ────────────────────────────────────────────────────────────
const AsteroidBelt = () => {
  const COUNT = 2800;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(COUNT*3), col = new Float32Array(COUNT*3);
    for (let i=0; i<COUNT; i++) {
      const θ=Math.random()*Math.PI*2, r=68+Math.random()*20;
      pos[i*3]=Math.cos(θ)*r; pos[i*3+1]=(Math.random()-0.5)*3.2; pos[i*3+2]=Math.sin(θ)*r;
      const shade = 0.4 + Math.random()*0.4;
      col[i*3]=shade; col[i*3+1]=shade*0.95; col[i*3+2]=shade*0.88;
    }
    return [pos, col];
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={COUNT} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.25} vertexColors sizeAttenuation />
    </points>
  );
};

// Kuiper belt (icy)
const KuiperBelt = () => {
  const COUNT = 900;
  const pos = useMemo(() => {
    const p = new Float32Array(COUNT*3);
    for (let i=0; i<COUNT; i++) {
      const θ=Math.random()*Math.PI*2, r=222+Math.random()*55;
      p[i*3]=Math.cos(θ)*r; p[i*3+1]=(Math.random()-0.5)*6; p[i*3+2]=Math.sin(θ)*r;
    }
    return p;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.2} color="#aaccff" sizeAttenuation transparent opacity={0.55} />
    </points>
  );
};

// Animated comet
const Comet = () => {
  const grp = useRef(); const ang = useRef(1.0);
  const DIST = 155, SPEED = 0.55;
  useFrame((_, dt) => {
    ang.current += SPEED * dt;
    if (grp.current) {
      const x=Math.cos(ang.current)*DIST, z=Math.sin(ang.current)*DIST;
      grp.current.position.set(x, 8, z);
      // Tail points away from sun
      grp.current.rotation.y = -ang.current + Math.PI * 0.5;
    }
  });
  return (
    <group ref={grp}>
      <mesh>
        <sphereGeometry args={[0.45, 8, 8]} />
        <meshBasicMaterial color="#b0e0ff" />
      </mesh>
      {/* Dust tail */}
      {[0.9, 0.55, 0.28, 0.12].map((o, i) => (
        <mesh key={i} position={[3+i*3.5, 0, 0]} rotation={[0, 0, Math.PI/2]}>
          <coneGeometry args={[0.3+i*0.18, 4, 8]} />
          <meshBasicMaterial color="#88ccff" transparent opacity={o*0.25} />
        </mesh>
      ))}
    </group>
  );
};

// ─── Planet body ──────────────────────────────────────────────────────────────
const PlanetBody = ({ p, speed, orbits, hz, onSelect }) => {
  const grp = useRef(), mesh = useRef(), ang = useRef(p.start);
  const [hovered, setHovered] = useState(false);
  const tex = useMemo(() => p.texName ? getTexture(p.texName) : null, [p.texName]);

  useFrame((_, dt) => {
    ang.current += p.speed * speed * dt;
    if (grp.current) { grp.current.position.x=Math.cos(ang.current)*p.dist; grp.current.position.z=Math.sin(ang.current)*p.dist; }
    if (mesh.current) mesh.current.rotation.y += 0.006 + (p.type==='Gas Giant'?0.008:0);
  });

  const TYPE_COLORS = { Rocky:'#fca5a5', 'Gas Giant':'#fcd34d', 'Ice Giant':'#93c5fd' };
  const tc = TYPE_COLORS[p.type] || '#a78bfa';

  return (
    <>
      <OrbitRing dist={p.dist} visible={orbits} />
      <group ref={grp}>
        <mesh ref={mesh}
          onPointerOver={e=>{ e.stopPropagation(); setHovered(true); document.body.style.cursor='pointer'; }}
          onPointerOut={()=>{ setHovered(false); document.body.style.cursor='auto'; }}
          onClick={e=>{ e.stopPropagation(); onSelect(p); }}>
          <sphereGeometry args={[p.size, 64, 64]} />
          <meshStandardMaterial
            color={p.color} emissive={p.emissive}
            emissiveIntensity={p.type==='Gas Giant'?0.15:0.05}
            roughness={p.rough} metalness={p.metal}
            map={tex}
          />
        </mesh>

        {/* Atmosphere halo */}
        {p.atm && (
          <mesh>
            <sphereGeometry args={[p.size*1.07, 32, 32]} />
            <meshBasicMaterial color={p.atm} transparent opacity={p.atmAlpha||0.10} />
          </mesh>
        )}

        {/* Saturn rings */}
        {p.hasRings && p.name==='Saturn' && <SaturnRings size={p.size} />}
        {p.hasRings && p.name==='Uranus' && <UranusRings size={p.size} />}

        {/* Moon */}
        {p.hasMoon && <Moon parentSize={p.size} />}

        {/* Hover label */}
        {hovered && (
          <Html position={[0, p.size+2, 0]} center distanceFactor={90}>
            <div style={{
              background:'rgba(3,2,13,0.90)',
              border:`1px solid ${tc}55`,
              color:'#fff', padding:'4px 12px', borderRadius:20,
              fontSize:12, fontWeight:700,
              fontFamily:'Space Grotesk,Inter,sans-serif',
              whiteSpace:'nowrap', pointerEvents:'none',
              boxShadow:`0 0 14px ${tc}50`,
            }}>{p.name}</div>
          </Html>
        )}
      </group>
    </>
  );
};

// ─── Planet info panel ────────────────────────────────────────────────────────
const PlanetPanel = ({ planet, onClose }) => {
  if (!planet) return null;
  const TC = { Rocky:'#f87171', 'Gas Giant':'#fbbf24', 'Ice Giant':'#93c5fd' };
  const col = TC[planet.type] || '#a78bfa';
  const earthSize = planet.size / 1.1;
  return (
    <div style={{
      position:'absolute', top:80, right:20, width:295,
      background:'rgba(3,2,13,0.94)', backdropFilter:'blur(24px)',
      border:`1px solid ${col}55`, borderRadius:18, overflow:'hidden',
      zIndex:30, boxShadow:`0 0 50px ${col}18`,
    }}>
      {/* Header band */}
      <div style={{ background:`linear-gradient(135deg,${col}22,transparent)`, padding:'1rem 1.2rem 0.6rem' }}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontSize:'1.45rem',fontWeight:900,fontFamily:'Space Grotesk,sans-serif',color:'#fff'}}>{planet.name}</div>
            <span style={{fontSize:'0.68rem',fontWeight:700,background:`${col}22`,color:col,border:`1px solid ${col}44`,padding:'2px 8px',borderRadius:20}}>{planet.type}</span>
          </div>
          <button onClick={onClose} style={{
            background:'rgba(255,255,255,0.08)', border:'none', color:'rgba(255,255,255,0.5)',
            cursor:'pointer', width:28, height:28, borderRadius:8,
            fontSize:17, display:'flex', alignItems:'center', justifyContent:'center',
          }}>×</button>
        </div>
        {/* Size bar vs Earth */}
        <div style={{marginTop:'0.75rem'}}>
          <div style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.4)',marginBottom:'0.3rem'}}>Size relative to Earth</div>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <div style={{height:8,borderRadius:4,background:`linear-gradient(90deg,${col}88,${col})`,width:`${Math.min(100,earthSize*50)}%`,maxWidth:'80%',minWidth:4}} />
            <span style={{fontSize:'0.72rem',color:col,fontWeight:700}}>{earthSize.toFixed(2)}×</span>
          </div>
        </div>
      </div>
      <div style={{padding:'0.8rem 1.2rem'}}>
        <p style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.6)',lineHeight:1.6,marginBottom:'0.9rem'}}>{planet.desc}</p>
        {[['Moons',planet.moons],['Day length',planet.day],['Year length',planet.year]].map(([l,v])=>(
          <div key={l} style={{display:'flex',justifyContent:'space-between',marginBottom:'0.38rem',fontSize:'0.8rem',borderBottom:'1px solid rgba(255,255,255,0.05)',paddingBottom:'0.38rem'}}>
            <span style={{color:'rgba(255,255,255,0.42)'}}>{l}</span>
            <span style={{fontWeight:700,color:col}}>{v}</span>
          </div>
        ))}
        {/* Author credit inside panel */}
        <div style={{marginTop:'0.75rem',fontSize:'0.65rem',color:'rgba(255,255,255,0.2)',textAlign:'right'}}>
          Biswajit Jana @2026
        </div>
      </div>
    </div>
  );
};

// ─── Main Three.js scene ──────────────────────────────────────────────────────
const Scene = ({ speed, orbits, hz, ecliptic, onSelect }) => (
  <>
    <Stars radius={400} depth={60} count={10000} factor={4} saturation={0.3} fade speed={0.3} />
    <BlackHole />
    <HabitableZone visible={hz} />
    <EclipticPlane visible={ecliptic} />
    {PLANETS.map(p => (
      <PlanetBody key={p.name} p={p} speed={speed} orbits={orbits} hz={hz} onSelect={onSelect} />
    ))}
    <AsteroidBelt />
    <KuiperBelt />
    <Comet />
    <ambientLight intensity={0.04} color="#1a1030" />
    <hemisphereLight color="#110820" groundColor="#05030a" intensity={0.10} />
    <EffectComposer>
      <Bloom luminanceThreshold={0.25} luminanceSmoothing={0.85} intensity={2.2} radius={0.85} />
    </EffectComposer>
    <OrbitControls
      enableZoom enablePan enableDamping dampingFactor={0.06}
      maxDistance={420} minDistance={5} autoRotate={false}
    />
  </>
);

// ─── Control button ───────────────────────────────────────────────────────────
const CtrlBtn = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    background: active ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.05)',
    border: `1px solid ${active ? 'rgba(139,92,246,0.6)' : 'rgba(255,255,255,0.12)'}`,
    color: active ? '#c4b5fd' : 'rgba(255,255,255,0.45)',
    borderRadius:8, padding:'4px 12px', fontSize:'0.75rem',
    fontWeight:600, cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap',
    fontFamily:'Inter,sans-serif',
  }}>{children}</button>
);

// ─── Exported component ───────────────────────────────────────────────────────
const SolarSystem = () => {
  const [selected,  setSelected]  = useState(null);
  const [speed,     setSpeed]     = useState(1.0);
  const [orbits,    setOrbits]    = useState(true);
  const [hz,        setHz]        = useState(false);
  const [ecliptic,  setEcliptic]  = useState(false);

  return (
    <div style={{ width:'100%', height:'100vh', position:'relative', background:'#03020d' }}>

      {/* Canvas — camera angled 30° above ecliptic */}
      <Canvas camera={{ position:[35, 75, 175], fov:56 }}>
        <Suspense fallback={null}>
          <Scene speed={speed} orbits={orbits} hz={hz} ecliptic={ecliptic} onSelect={setSelected} />
        </Suspense>
      </Canvas>

      {/* Planet info */}
      <PlanetPanel planet={selected} onClose={()=>setSelected(null)} />

      {/* Top-left legend */}
      <div style={{
        position:'absolute', top:80, left:20, zIndex:20,
        display:'flex', flexDirection:'column', gap:6,
      }}>
        {[
          {c:'#fca5a5',l:'Rocky planets'},
          {c:'#fcd34d',l:'Gas giants'},
          {c:'#93c5fd',l:'Ice giants'},
          {c:'#aaaaaa',l:'Asteroid belt'},
          {c:'#aaccff',l:'Kuiper belt'},
          {c:'#b0e0ff',l:'Comet'},
        ].map(({c,l})=>(
          <div key={l} style={{display:'flex',alignItems:'center',gap:7,fontSize:'0.73rem',color:'rgba(255,255,255,0.55)'}}>
            <span style={{width:8,height:8,borderRadius:'50%',background:c,flexShrink:0,boxShadow:`0 0 4px ${c}88`}} />
            {l}
          </div>
        ))}
      </div>

      {/* Habitable-zone legend */}
      {hz && (
        <div style={{
          position:'absolute', top:82, left:180, zIndex:20,
          background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.3)',
          borderRadius:8, padding:'4px 10px', fontSize:'0.72rem',
          color:'#00ff88', fontWeight:600,
        }}>🟢 Habitable Zone</div>
      )}

      {/* Bottom controls */}
      <div style={{
        position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)',
        display:'flex', alignItems:'center', gap:'1rem',
        background:'rgba(3,2,13,0.88)', backdropFilter:'blur(18px)',
        border:'1px solid rgba(255,255,255,0.09)',
        borderRadius:50, padding:'0.65rem 1.75rem', zIndex:20,
        whiteSpace:'nowrap',
      }}>
        {/* Speed */}
        <span style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.4)',fontWeight:600,letterSpacing:'0.08em'}}>SPEED</span>
        <input type="range" min={0} max={5} step={0.1} value={speed}
          onChange={e=>setSpeed(+e.target.value)} style={{width:85}} />
        <span style={{fontSize:'0.82rem',fontWeight:800,color:'#a78bfa',minWidth:30}}>{speed.toFixed(1)}×</span>

        <div style={{width:1,height:18,background:'rgba(255,255,255,0.1)'}} />

        <CtrlBtn active={orbits}   onClick={()=>setOrbits(o=>!o)}>◯ Orbits</CtrlBtn>
        <CtrlBtn active={hz}       onClick={()=>setHz(h=>!h)}>🟢 HZ</CtrlBtn>
        <CtrlBtn active={ecliptic} onClick={()=>setEcliptic(e=>!e)}>⬡ Plane</CtrlBtn>

        <div style={{width:1,height:18,background:'rgba(255,255,255,0.1)'}} />

        <span style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.3)'}}>
          🖱 Drag · Scroll · Click planet
        </span>
      </div>

      {/* Author watermark — bottom left */}
      <div style={{
        position:'absolute', bottom:28, left:24, zIndex:20,
        fontFamily:'Space Grotesk,sans-serif',
        fontSize:'0.72rem', fontWeight:700,
        color:'rgba(255,255,255,0.22)',
        letterSpacing:'0.05em',
      }}>
        Biswajit Jana @2026
      </div>

      {/* Title top-center */}
      <div style={{
        position:'absolute', top:80, left:'50%', transform:'translateX(-50%)',
        zIndex:20, textAlign:'center', pointerEvents:'none',
      }}>
        <div style={{
          fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.15em',
          textTransform:'uppercase', color:'rgba(255,255,255,0.25)',
          fontFamily:'Space Grotesk,sans-serif',
        }}>
          Black Hole System Simulator — Biswajit Jana @2026
        </div>
      </div>
    </div>
  );
};

export default SolarSystem;
