import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// ─── Star data (brightest / most famous stars) ────────────────────────────────
// [name, RA(hours), Dec(°), dist(pc), apparent mag, spectral class, full name]
const STAR_DATA = [
  ['Sirius',       6.752,  -16.716,  2.64,  -1.46, 'A', 'Alpha Canis Majoris — brightest star in the sky'],
  ['Canopus',      6.399,  -52.696,  95.9,  -0.74, 'F', 'Alpha Carinae — 2nd brightest, southern sky'],
  ['Arcturus',    14.261,   19.182,  11.3,  -0.05, 'K', 'Alpha Boötis — brightest in northern hemisphere'],
  ['Rigil Kent.', 14.660,  -60.833,   1.34, -0.27, 'G', 'Alpha Centauri — nearest stellar system, 4.37 ly'],
  ['Vega',        18.616,   38.784,   7.68,  0.03, 'A', 'Alpha Lyrae — former North Pole star, 25 ly'],
  ['Capella',      5.278,   45.998,  12.9,   0.08, 'G', 'Alpha Aurigae — actually 4 stars in 2 binary pairs'],
  ['Rigel',        5.242,   -8.202, 264.0,   0.13, 'B', 'Beta Orionis — blue supergiant, ~120,000 times solar luminosity'],
  ['Procyon',      7.655,    5.225,   3.50,  0.34, 'F', 'Alpha Canis Minoris — 11.5 ly away'],
  ['Achernar',     1.628,  -57.237,  44.1,   0.46, 'B', 'Alpha Eridani — extremely rapid rotator, oblate'],
  ['Betelgeuse',   5.919,    7.407, 197.0,   0.50, 'M', 'Alpha Orionis — red supergiant, future supernova'],
  ['Hadar',       14.064,  -60.373, 161.0,   0.61, 'B', 'Beta Centauri — triple star system'],
  ['Altair',      19.846,    8.868,   5.13,  0.77, 'A', 'Alpha Aquilae — rotates in ~9 hours, very oblate'],
  ['Aldebaran',    4.599,   16.509,  20.0,   0.85, 'K', 'Alpha Tauri — red giant eye of Taurus, 65 ly'],
  ['Acrux',       12.443,  -63.099,  99.0,   0.77, 'B', 'Alpha Crucis — brightest in Southern Cross'],
  ['Spica',       13.420,  -11.161,  77.0,   1.04, 'B', 'Alpha Virginis — binary, prompted Hipparchus to discover precession'],
  ['Antares',     16.490,  -26.432, 185.0,   1.09, 'M', 'Alpha Scorpii — red supergiant, 700x the radius of the Sun'],
  ['Pollux',       7.755,   28.026,  10.3,   1.14, 'K', 'Beta Geminorum — orange giant with confirmed exoplanet'],
  ['Fomalhaut',   22.961,  -29.622,   7.69,  1.16, 'A', 'Alpha Piscis Austrini — first star with imaged exoplanet'],
  ['Deneb',       20.691,   45.280, 802.0,   1.25, 'A', 'Alpha Cygni — one of the most luminous stars known'],
  ['Mimosa',      12.795,  -59.689,  85.0,   1.25, 'B', 'Beta Crucis — blue giant in Southern Cross'],
  ['Regulus',     10.139,   11.967,  23.8,   1.35, 'B', 'Alpha Leonis — fastest rotating bright star'],
  ['Adhara',       6.977,  -28.972, 132.0,   1.50, 'B', 'Epsilon CMa — brightest in UV as seen from Earth'],
  ['Castor',       7.577,   31.888,  15.8,   1.58, 'A', 'Alpha Geminorum — actually 6 stars in 3 pairs'],
  ['Gacrux',      12.519,  -57.113,  27.2,   1.64, 'M', 'Gamma Crucis — red giant, top star of Southern Cross'],
  ['Bellatrix',    5.419,    6.350,  77.0,   1.64, 'B', 'Gamma Orionis — "Female Warrior", Amazon star'],
  ['Elnath',       5.438,   28.608,  40.7,   1.65, 'B', 'Beta Tauri — on border of Taurus and Auriga'],
  ['Alnilam',      5.604,   -1.202, 411.0,   1.70, 'B', 'Epsilon Orionis — middle star of Orion Belt'],
  ['Alnitak',      5.679,   -1.943, 387.0,   1.77, 'O', 'Zeta Orionis — easternmost Belt star, O-type supergiant'],
  ['Alioth',      12.900,   55.959,  24.8,   1.76, 'A', 'Epsilon UMa — brightest in Ursa Major, Big Dipper handle'],
  ['Mirfak',       3.406,   49.861, 160.0,   1.79, 'F', 'Alpha Persei — yellow-white supergiant, 590 ly'],
  ['Dubhe',       11.062,   61.750,  37.9,   1.79, 'K', 'Alpha UMa — pointer star to North Star'],
  ['Kaus Aust.',  18.403,  -34.385,  45.0,   1.85, 'B', 'Epsilon Sgr — marks the top of the Sagittarius Teapot'],
  ['Alkaid',      13.792,   49.313,  30.9,   1.86, 'B', 'Eta UMa — end of Big Dipper handle, 100 ly'],
  ['Alnair',      22.137,  -46.961,  31.0,   1.73, 'B', 'Alpha Gruis — brightest in Grus (Crane constellation)'],
  ['Peacock',     20.428,  -56.735,  56.0,   1.94, 'B', 'Alpha Pavonis — blue-white subgiant, 183 ly'],
  ['Polaris',      2.530,   89.264, 132.0,   1.97, 'F', 'Alpha UMi — current North Star, Cepheid variable'],
  ['Miaplacidus',  9.220,  -69.717,  34.0,   1.68, 'A', 'Beta Carinae — 2nd brightest in Carina constellation'],
  ['Atria',       16.811,  -69.028,  91.5,   1.92, 'K', 'Alpha TrA — brightest in Triangulum Australe'],
  ['Alphard',      9.460,   -8.658,  54.0,   1.98, 'K', 'Alpha Hydrae — "the Solitary One", only bright star in Hydra'],
  ['Hamal',        2.120,   23.462,  20.2,   2.00, 'K', 'Alpha Arietis — brightest in Aries constellation'],
  ['Menkent',     14.112,  -36.370,  18.5,   2.06, 'K', 'Theta Centauri — orange giant, 61 ly away'],
  ['Nunki',       18.921,  -26.296,  69.0,   2.05, 'B', 'Sigma Sgr — blue-white giant in Sagittarius'],
  ['Saiph',        5.796,   -9.670, 198.0,   2.07, 'B', 'Kappa Orionis — lower-right star of Orion'],
  ['Alpheratz',    0.139,   29.091,  29.6,   2.07, 'A', 'Alpha Andromedae — gateway to Andromeda galaxy'],
  ['Rasalhague',  17.582,   12.560,  14.9,   2.08, 'A', 'Alpha Ophiuchi — head of the Serpent Bearer'],
  ['Kochab',      14.845,   74.155,  38.3,   2.08, 'K', 'Beta UMi — former North Star 3,000 years ago'],
  ['Denebola',    11.818,   14.572,  11.1,   2.14, 'A', 'Beta Leonis — tail of Leo the Lion, 36 ly'],
  ['Algol',        3.136,   40.957,  28.0,   2.09, 'B', 'Beta Persei — "Demon Star", famous eclipsing binary'],
  ['Schedar',      0.675,   56.537,  70.3,   2.24, 'K', 'Alpha Cassiopeiae — orange giant in the W constellation'],
  ['Mintaka',      5.534,   -0.299, 380.0,   2.23, 'O', 'Delta Orionis — westernmost Belt star, O-type'],
  ['Enif',        21.736,    9.875, 211.0,   2.38, 'K', 'Epsilon Pegasi — nose of Pegasus, K supergiant'],
  ['Ankaa',        0.438,  -42.306,  25.2,   2.40, 'K', 'Alpha Phoenicis — brightest in Phoenix constellation'],
  ['Sabik',       17.172,  -15.724,  26.0,   2.43, 'A', 'Eta Ophiuchi — double star in Ophiuchus'],
  ['Mizar',       13.399,   54.925,  23.6,   2.23, 'A', 'Zeta UMa — famous double star in Big Dipper handle'],
  ['Aludra',       7.401,  -29.303, 490.0,   2.45, 'B', 'Eta CMa — blue hypergiant, ~176,000 times solar luminosity'],
  ['Naos',         8.060,  -40.003,1399.0,   2.21, 'O', 'Zeta Puppis — one of the hottest & most luminous stars known'],
  ['Eta Car.',    10.751,  -59.684,2300.0,  -0.80, 'B', 'Eta Carinae — massive LBV, candidate for hypernova'],
  ['Phact',        5.661,  -34.074,  79.0,   2.65, 'B', 'Alpha Columbae — blue-white giant in Columba'],
  ['Wezen',        7.140,  -26.393, 491.0,   1.84, 'F', 'Delta CMa — yellow-white supergiant, expanding to red'],
  ['Avior',        8.375,  -59.510, 165.0,   1.86, 'K', 'Epsilon Carinae — bright Carina star used for navigation'],
  ['Sargas',      17.622,  -42.997, 109.0,   1.87, 'F', 'Theta Scorpii — yellow-white giant in Scorpius tail'],
  ['Mirzam',       6.378,  -17.956, 151.0,   1.98, 'B', 'Beta CMa — pulsating β Cep variable star'],
];

// ─── Spectral colour map ──────────────────────────────────────────────────────
const SPEC_COLOR = { O:'#9bb0ff', B:'#aabfff', A:'#cad7ff', F:'#f8f7ff', G:'#fff4ea', K:'#ffd2a1', M:'#ffad50' };

// ─── Convert equatorial coords to 3D (log distance scale) ────────────────────
function eq3D(ra_h, dec_d, dist_pc) {
  const ra  = ra_h * (Math.PI / 12);
  const dec = dec_d * (Math.PI / 180);
  const d   = Math.log10(dist_pc + 1) * 140;
  return [d*Math.cos(dec)*Math.cos(ra), d*Math.sin(dec), d*Math.cos(dec)*Math.sin(ra)];
}

// Star apparent-magnitude → display size
const magToSize = mag => Math.max(0.4, Math.min(4.5, (2 - mag) * 0.9 + 1.5));

// ─── Individual star mesh ─────────────────────────────────────────────────────
const StarMesh = ({ star, onSelect, selected }) => {
  const [hov, setHov] = useState(false);
  const [name,ra,dec,dist,mag,sp,desc] = star;
  const pos = useMemo(() => eq3D(ra, dec, dist), [ra, dec, dist]);
  const col = SPEC_COLOR[sp] || '#ffffff';
  const size = magToSize(mag);
  const isSelected = selected === name;
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current && (hov || isSelected)) {
      ref.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 4) * 0.15);
    }
  });

  return (
    <group position={pos}>
      <mesh ref={ref}
        onPointerOver={e=>{ e.stopPropagation(); setHov(true); document.body.style.cursor='pointer'; }}
        onPointerOut={()=>{ setHov(false); document.body.style.cursor='auto'; }}
        onClick={e=>{ e.stopPropagation(); onSelect(star); }}>
        <sphereGeometry args={[size * 0.6, 8, 8]} />
        <meshBasicMaterial color={isSelected ? '#ffffff' : col} />
      </mesh>

      {/* Outer glow sphere */}
      {(hov || isSelected || mag < 0.5) && (
        <mesh>
          <sphereGeometry args={[size * 1.4, 8, 8]} />
          <meshBasicMaterial color={col} transparent opacity={isSelected ? 0.4 : 0.2} />
        </mesh>
      )}

      {/* Label */}
      {(hov || isSelected) && (
        <Html center position={[0, size*1.8, 0]} distanceFactor={120}>
          <div style={{
            color:'#fff', fontSize:11, fontWeight:700,
            fontFamily:'Space Grotesk,sans-serif',
            background:'rgba(2,1,10,0.85)',
            border:`1px solid ${col}55`, borderRadius:10,
            padding:'2px 8px', whiteSpace:'nowrap', pointerEvents:'none',
            boxShadow:`0 0 12px ${col}44`,
          }}>{name}</div>
        </Html>
      )}
    </group>
  );
};

// ─── Star info panel ──────────────────────────────────────────────────────────
const StarPanel = ({ star, onClose }) => {
  if (!star) return null;
  const [name,ra,dec,dist,mag,sp,desc] = star;
  const col = SPEC_COLOR[sp] || '#ffffff';
  const lyDist = (dist * 3.2616).toFixed(1);
  const spName = { O:'O-type (hottest blue)',B:'B-type (blue-white)',A:'A-type (white)',F:'F-type (yellow-white)',G:'G-type (yellow)',K:'K-type (orange)',M:'M-type (coolest red)' }[sp];

  return (
    <div style={{
      position:'absolute', top:80, right:20, width:290,
      background:'rgba(2,1,10,0.93)', backdropFilter:'blur(24px)',
      border:`1px solid ${col}55`, borderRadius:18, overflow:'hidden',
      zIndex:30, boxShadow:`0 0 50px ${col}18`,
    }}>
      <div style={{background:`linear-gradient(135deg,${col}22,transparent)`,padding:'1rem 1.2rem 0.7rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontFamily:'Space Grotesk,sans-serif',fontWeight:900,fontSize:'1.5rem',color:'#fff'}}>{name}</div>
            <span style={{fontSize:'0.68rem',fontWeight:700,background:`${col}22`,color:col,border:`1px solid ${col}44`,padding:'2px 8px',borderRadius:20}}>{spName}</span>
          </div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,0.08)',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer',width:28,height:28,borderRadius:8,fontSize:17,display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
        </div>
      </div>
      <div style={{padding:'0.75rem 1.2rem'}}>
        <p style={{fontSize:'0.79rem',color:'rgba(255,255,255,0.58)',lineHeight:1.65,marginBottom:'0.85rem'}}>{desc}</p>
        {[
          ['App. magnitude', mag.toFixed(2)],
          ['Distance', `${lyDist} light-years (${dist} pc)`],
          ['RA / Dec', `${ra.toFixed(3)}h / ${dec.toFixed(2)}°`],
          ['Spectral class', sp],
        ].map(([l,v])=>(
          <div key={l} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.05)',padding:'0.35rem 0',fontSize:'0.78rem'}}>
            <span style={{color:'rgba(255,255,255,0.4)'}}>{l}</span>
            <span style={{fontWeight:700,color:col}}>{v}</span>
          </div>
        ))}
        <div style={{marginTop:'0.75rem',fontSize:'0.65rem',color:'rgba(255,255,255,0.2)',textAlign:'right'}}>Biswajit Jana @2026</div>
      </div>
    </div>
  );
};

// ─── 3D scene ─────────────────────────────────────────────────────────────────
const CatalogueScene = ({ stars, onSelect, selected, filter }) => {
  const filtered = useMemo(() =>
    stars.filter(s => filter === 'all' || s[5] === filter), [stars, filter]);

  return (
    <>
      <Stars radius={400} depth={80} count={12000} factor={3.5} saturation={0.4} fade speed={0.2} />
      {filtered.map(star => (
        <StarMesh key={star[0]} star={star} onSelect={onSelect} selected={selected?.[0]} />
      ))}
      <ambientLight intensity={0.05} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.85} intensity={1.5} radius={0.75} />
      </EffectComposer>
      <OrbitControls enableZoom enableDamping dampingFactor={0.05} maxDistance={800} minDistance={5} autoRotate autoRotateSpeed={0.15} />
    </>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const StarCatalogue = () => {
  const [selected, setSelected] = useState(null);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');

  const visStars = useMemo(() =>
    STAR_DATA.filter(s => !search || s[0].toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <div style={{ width:'100%', height:'100vh', position:'relative', background:'#02010a' }}>
      <Canvas camera={{ position:[0, 60, 280], fov:55 }}>
        <Suspense fallback={null}>
          <CatalogueScene stars={visStars} onSelect={setSelected} selected={selected} filter={filter} />
        </Suspense>
      </Canvas>

      {/* Star info panel */}
      <StarPanel star={selected} onClose={()=>setSelected(null)} />

      {/* Controls panel */}
      <div style={{
        position:'absolute', top:80, left:20, zIndex:20,
        display:'flex', flexDirection:'column', gap:'0.6rem', width:220,
      }}>
        <input
          type="text" placeholder="🔍 Search star…"
          value={search} onChange={e=>setSearch(e.target.value)}
          style={{
            background:'rgba(2,1,10,0.85)', backdropFilter:'blur(12px)',
            border:'1px solid rgba(255,255,255,0.12)',
            borderRadius:10, padding:'0.5rem 0.8rem',
            color:'#fff', fontSize:'0.82rem', outline:'none', width:'100%',
          }}
        />
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{
          background:'rgba(2,1,10,0.85)', backdropFilter:'blur(12px)',
          border:'1px solid rgba(255,255,255,0.12)',
          borderRadius:10, padding:'0.5rem 0.8rem',
          color:'#fff', fontSize:'0.82rem', cursor:'pointer',
        }}>
          <option value="all">All spectral types</option>
          <option value="O">O — Blue (hottest)</option>
          <option value="B">B — Blue-white</option>
          <option value="A">A — White</option>
          <option value="F">F — Yellow-white</option>
          <option value="G">G — Yellow (Sun-like)</option>
          <option value="K">K — Orange giants</option>
          <option value="M">M — Red (coolest)</option>
        </select>

        {/* Spectral legend */}
        <div style={{
          background:'rgba(2,1,10,0.85)', backdropFilter:'blur(12px)',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:10, padding:'0.75rem',
          display:'flex', flexDirection:'column', gap:5,
        }}>
          {Object.entries(SPEC_COLOR).map(([sp,col])=>(
            <div key={sp} style={{display:'flex',alignItems:'center',gap:8,fontSize:'0.72rem',color:'rgba(255,255,255,0.55)'}}>
              <span style={{width:8,height:8,borderRadius:'50%',background:col,flexShrink:0,boxShadow:`0 0 4px ${col}88`}} />
              <span style={{color:col,fontWeight:600,minWidth:14}}>{sp}</span>
              <span>— {{O:'Blue supergiant',B:'Blue-white',A:'White',F:'Yellow-white',G:'Sun-like yellow',K:'Orange giant',M:'Red giant'}[sp]}</span>
            </div>
          ))}
        </div>

        <div style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.28)',lineHeight:1.6,paddingLeft:2}}>
          {visStars.length} stars shown<br/>
          Distances log-scaled<br/>
          Click star for details<br/>
          <span style={{color:'rgba(255,255,255,0.18)'}}>Biswajit Jana @2026</span>
        </div>
      </div>

      {/* Title */}
      <div style={{
        position:'absolute', top:80, left:'50%', transform:'translateX(-50%)',
        zIndex:20, textAlign:'center', pointerEvents:'none',
        fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.14em',
        textTransform:'uppercase', color:'rgba(255,255,255,0.22)',
        fontFamily:'Space Grotesk,sans-serif',
      }}>
        Stellar Catalogue — Biswajit Jana @2026
      </div>
    </div>
  );
};

export default StarCatalogue;
