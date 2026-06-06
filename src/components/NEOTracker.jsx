import React, { useState, useEffect, useMemo } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const pad2 = n => String(n).padStart(2, '0');
const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; };
const weekLater = () => { const d = new Date(); d.setDate(d.getDate()+7); return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; };
const kmFmt = n => n >= 1e6 ? `${(n/1e6).toFixed(2)}M km` : `${(n/1000).toFixed(0)}K km`;

// ─── Orbit visualiser (SVG) ────────────────────────────────────────────────────
const OrbitViz = ({ neos }) => {
  const W = 340, H = 340, cx = W/2, cy = H/2;
  const EARTH_R = 18;
  const MAX_DIST_KM = 8e6; // show up to 8M km

  const items = neos.slice(0, 20).map(neo => {
    const approach = neo.close_approach_data[0];
    const distKm = parseFloat(approach.miss_distance.kilometers);
    const scaledR = EARTH_R + (distKm / MAX_DIST_KM) * (Math.min(W,H)/2 - EARTH_R - 12);
    const angle = Math.random() * 2 * Math.PI; // randomise angle
    const x = cx + scaledR * Math.cos(angle);
    const y = cy + scaledR * Math.sin(angle);
    const hazardous = neo.is_potentially_hazardous_asteroid;
    const sizeKm = neo.estimated_diameter.kilometers.estimated_diameter_max;
    const dotR = Math.max(3, Math.min(10, sizeKm * 25));
    return { x, y, dotR, hazardous, name: neo.name, distKm, angle, scaledR };
  });

  return (
    <svg width={W} height={H} style={{ display:'block', margin:'0 auto' }}>
      {/* Distance rings */}
      {[1, 2, 4, 8].map(m => {
        const r = EARTH_R + (m*1e6 / MAX_DIST_KM) * (Math.min(W,H)/2 - EARTH_R - 12);
        return (
          <g key={m}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={cx+r+2} y={cy-2} fill="rgba(255,255,255,0.2)" fontSize={9}>{m}M km</text>
          </g>
        );
      })}

      {/* Earth */}
      <circle cx={cx} cy={cy} r={EARTH_R} fill="#1565c0" />
      <circle cx={cx} cy={cy} r={EARTH_R+3} fill="none" stroke="#4488ff" strokeWidth={1} opacity={0.4} />
      <text x={cx} y={cy+4} textAnchor="middle" fill="white" fontSize={9} fontWeight="bold">🌍</text>

      {/* Moon orbit (384,400 km) */}
      {(() => {
        const r = EARTH_R + (384400 / MAX_DIST_KM) * (Math.min(W,H)/2 - EARTH_R - 12);
        return <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={0.8} strokeDasharray="3 4" />;
      })()}

      {/* NEO dots */}
      {items.map((it, i) => (
        <g key={i}>
          <line x1={cx} y1={cy} x2={it.x} y2={it.y} stroke={it.hazardous ? 'rgba(239,68,68,0.2)' : 'rgba(100,200,100,0.15)'} strokeWidth={0.8} />
          <circle cx={it.x} cy={it.y} r={it.dotR}
            fill={it.hazardous ? '#ef4444' : '#4ade80'}
            opacity={0.85}
          >
            <animate attributeName="opacity" values="0.6;1;0.6" dur={`${1.5+Math.random()}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
};

// ─── NEO card ─────────────────────────────────────────────────────────────────
const NEOCard = ({ neo }) => {
  const a = neo.close_approach_data[0];
  const distKm = parseFloat(a.miss_distance.kilometers);
  const distLD  = parseFloat(a.miss_distance.lunar);
  const speedKh = parseFloat(a.relative_velocity.kilometers_per_hour);
  const speedKs = (speedKh / 3600).toFixed(2);
  const dMin = neo.estimated_diameter.kilometers.estimated_diameter_min;
  const dMax = neo.estimated_diameter.kilometers.estimated_diameter_max;
  const hazard = neo.is_potentially_hazardous_asteroid;

  return (
    <div style={{
      background: hazard ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${hazard ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius:12, padding:'0.9rem 1rem', transition:'all 0.2s',
    }}
      onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
      onMouseLeave={e=>e.currentTarget.style.transform='none'}
    >
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.55rem'}}>
        <div style={{fontFamily:'Space Grotesk,sans-serif',fontWeight:700,fontSize:'0.88rem',color:'#fff',flex:1,marginRight:8}}>
          {neo.name.replace(/[()]/g,'')}
        </div>
        <span style={{
          fontSize:'0.65rem', fontWeight:800, borderRadius:20,
          padding:'2px 8px', flexShrink:0,
          background: hazard ? 'rgba(239,68,68,0.2)' : 'rgba(74,222,128,0.12)',
          color:        hazard ? '#f87171' : '#4ade80',
          border:       `1px solid ${hazard ? '#f87171' : '#4ade80'}44`,
        }}>
          {hazard ? '⚠ HAZARDOUS' : '✓ SAFE'}
        </span>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.3rem 0.5rem',fontSize:'0.76rem'}}>
        {[
          ['Date',      a.close_approach_date,           '#fde68a'],
          ['Distance',  `${kmFmt(distKm)} / ${distLD.toFixed(1)} LD`, '#93c5fd'],
          ['Speed',     `${speedKs} km/s`,               '#c4b5fd'],
          ['Diameter',  `${dMin.toFixed(3)}–${dMax.toFixed(3)} km`, '#86efac'],
        ].map(([l,v,c])=>(
          <div key={l}>
            <div style={{color:'rgba(255,255,255,0.35)',fontSize:'0.67rem'}}>{l}</div>
            <div style={{color:c,fontWeight:600}}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const NEOTracker = () => {
  const [neos,    setNeos]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [showHaz, setShowHaz] = useState(false);
  const [sort,    setSort]    = useState('date');

  useEffect(() => {
    const load = async () => {
      try {
        const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today()}&end_date=${weekLater()}&api_key=DEMO_KEY`;
        const r = await fetch(url);
        if (!r.ok) throw new Error();
        const d = await r.json();
        const all = Object.values(d.near_earth_objects).flat();
        setNeos(all);
      } catch {
        setError(true);
        // Fallback demo data
        setNeos(DEMO_NEOS);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = useMemo(() => neos
    .filter(n => !showHaz || n.is_potentially_hazardous_asteroid)
    .sort((a, b) => {
      if (sort === 'date')     return a.close_approach_data[0].close_approach_date.localeCompare(b.close_approach_data[0].close_approach_date);
      if (sort === 'distance') return parseFloat(a.close_approach_data[0].miss_distance.kilometers) - parseFloat(b.close_approach_data[0].miss_distance.kilometers);
      if (sort === 'size')     return b.estimated_diameter.kilometers.estimated_diameter_max - a.estimated_diameter.kilometers.estimated_diameter_max;
      if (sort === 'speed')    return parseFloat(b.close_approach_data[0].relative_velocity.kilometers_per_hour) - parseFloat(a.close_approach_data[0].relative_velocity.kilometers_per_hour);
      return 0;
    }), [neos, showHaz, sort]);

  const hazCount = neos.filter(n=>n.is_potentially_hazardous_asteroid).length;

  return (
    <div style={{ padding:'0 1.5rem 4rem', maxWidth:1200, margin:'0 auto' }}>

      {/* Summary bar */}
      {!loading && (
        <div style={{
          display:'flex', flexWrap:'wrap', gap:'1rem',
          background:'rgba(255,255,255,0.03)',
          border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:14, padding:'1rem 1.25rem', marginBottom:'1.75rem',
        }}>
          {[
            { label:'Total approaches', val:neos.length, col:'#a78bfa' },
            { label:'Potentially hazardous', val:hazCount, col:'#f87171' },
            { label:'Safe flybys', val:neos.length-hazCount, col:'#4ade80' },
            { label:'Next 7 days', val:'Tracked', col:'#93c5fd' },
          ].map(({ label, val, col }) => (
            <div key={label} style={{ flex:'1 1 140px' }}>
              <div style={{ fontSize:'1.6rem', fontWeight:900, color:col, fontFamily:'Space Grotesk,sans-serif', lineHeight:1 }}>{val}</div>
              <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)' }}>{label}</div>
            </div>
          ))}
          {error && <div style={{color:'#fbbf24',fontSize:'0.78rem',alignSelf:'center'}}>⚠ Demo data — NASA API rate-limited (30 req/hr)</div>}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:'1.75rem', alignItems:'start' }}>

        {/* Left: orbit visualiser */}
        <div style={{
          background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:16, padding:'1.25rem', position:'sticky', top:90,
        }}>
          <div style={{fontFamily:'Space Grotesk,sans-serif',fontWeight:700,fontSize:'0.9rem',marginBottom:'0.75rem',color:'rgba(255,255,255,0.7)'}}>
            Approach Proximity Map
          </div>
          {loading ? (
            <div style={{height:340,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.3)'}}>
              Loading…
            </div>
          ) : <OrbitViz neos={filtered} />}
          <div style={{marginTop:'0.75rem',fontSize:'0.68rem',color:'rgba(255,255,255,0.3)',lineHeight:1.6}}>
            🟢 Safe &nbsp;|&nbsp; 🔴 Potentially hazardous<br/>
            Dot size ∝ estimated diameter • Dashed ring = Moon's orbit<br/>
            <span style={{color:'rgba(255,255,255,0.18)'}}>Biswajit Jana @2026</span>
          </div>
        </div>

        {/* Right: controls + list */}
        <div>
          <div style={{
            display:'flex', flexWrap:'wrap', gap:'0.6rem',
            marginBottom:'1rem', alignItems:'center',
          }}>
            <select value={sort} onChange={e=>setSort(e.target.value)} style={{
              background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:8, padding:'0.45rem 0.8rem', color:'#fff', fontSize:'0.82rem', cursor:'pointer',
            }}>
              <option value="date">Sort: Closest date</option>
              <option value="distance">Sort: Nearest miss</option>
              <option value="size">Sort: Largest first</option>
              <option value="speed">Sort: Fastest first</option>
            </select>

            <button onClick={()=>setShowHaz(h=>!h)} style={{
              background: showHaz ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${showHaz ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
              color: showHaz ? '#f87171' : 'rgba(255,255,255,0.5)',
              borderRadius:8, padding:'0.45rem 0.9rem',
              fontSize:'0.82rem', cursor:'pointer', fontWeight:600,
            }}>
              {showHaz ? '⚠ Hazardous only' : 'All objects'}
            </button>

            <span style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.3)',marginLeft:'auto'}}>
              {filtered.length} objects
            </span>
          </div>

          {loading ? (
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {Array.from({length:6}).map((_,i)=>(
                <div key={i} style={{height:100,borderRadius:12,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.05)'}} />
              ))}
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.7rem', maxHeight:'72vh', overflowY:'auto', paddingRight:4 }}>
              {filtered.map(neo => <NEOCard key={neo.id} neo={neo} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Demo fallback ────────────────────────────────────────────────────────────
const DEMO_NEOS = [
  { id:'1',name:'(2024 BX1)',is_potentially_hazardous_asteroid:false,estimated_diameter:{kilometers:{estimated_diameter_min:0.012,estimated_diameter_max:0.027}},close_approach_data:[{close_approach_date:'2026-06-07',miss_distance:{kilometers:'2340000',lunar:'6.09'},relative_velocity:{kilometers_per_hour:'42300'}}] },
  { id:'2',name:'(2023 YR3)',is_potentially_hazardous_asteroid:true, estimated_diameter:{kilometers:{estimated_diameter_min:0.140,estimated_diameter_max:0.313}},close_approach_data:[{close_approach_date:'2026-06-08',miss_distance:{kilometers:'5820000',lunar:'15.1'},relative_velocity:{kilometers_per_hour:'78100'}}] },
  { id:'3',name:'(2024 DK4)',is_potentially_hazardous_asteroid:false,estimated_diameter:{kilometers:{estimated_diameter_min:0.055,estimated_diameter_max:0.122}},close_approach_data:[{close_approach_date:'2026-06-09',miss_distance:{kilometers:'1140000',lunar:'2.97'},relative_velocity:{kilometers_per_hour:'31500'}}] },
  { id:'4',name:'(2022 AP7)',is_potentially_hazardous_asteroid:true, estimated_diameter:{kilometers:{estimated_diameter_min:1.150,estimated_diameter_max:2.570}},close_approach_data:[{close_approach_date:'2026-06-10',miss_distance:{kilometers:'7340000',lunar:'19.1'},relative_velocity:{kilometers_per_hour:'95600'}}] },
  { id:'5',name:'(2024 GR2)',is_potentially_hazardous_asteroid:false,estimated_diameter:{kilometers:{estimated_diameter_min:0.022,estimated_diameter_max:0.049}},close_approach_data:[{close_approach_date:'2026-06-11',miss_distance:{kilometers:'3980000',lunar:'10.4'},relative_velocity:{kilometers_per_hour:'55200'}}] },
  { id:'6',name:'(2019 OK)',is_potentially_hazardous_asteroid:true, estimated_diameter:{kilometers:{estimated_diameter_min:0.057,estimated_diameter_max:0.128}},close_approach_data:[{close_approach_date:'2026-06-12',miss_distance:{kilometers:'730000', lunar:'1.90'},relative_velocity:{kilometers_per_hour:'88400'}}] },
  { id:'7',name:'(2024 HQ1)',is_potentially_hazardous_asteroid:false,estimated_diameter:{kilometers:{estimated_diameter_min:0.008,estimated_diameter_max:0.018}},close_approach_data:[{close_approach_date:'2026-06-13',miss_distance:{kilometers:'6120000',lunar:'15.9'},relative_velocity:{kilometers_per_hour:'27800'}}] },
];

export default NEOTracker;
