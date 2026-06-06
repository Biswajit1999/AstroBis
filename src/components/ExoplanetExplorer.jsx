import React, { useState, useEffect } from 'react';

// Planet type classifier by radius (in Jupiter radii)
const classifyPlanet = (radJ) => {
  if (!radJ) return { label:'Unknown', color:'#6b7280', bg:'rgba(107,114,128,0.15)' };
  const re = radJ * 11.2; // Jupiter radii → Earth radii
  if (re < 1.25)  return { label:'Rocky',      color:'#f87171', bg:'rgba(239,68,68,0.12)' };
  if (re < 2.0)   return { label:'Super-Earth', color:'#fb923c', bg:'rgba(249,115,22,0.12)' };
  if (re < 4.0)   return { label:'Mini-Neptune',color:'#60a5fa', bg:'rgba(96,165,250,0.12)' };
  if (re < 10)    return { label:'Neptune-like', color:'#818cf8', bg:'rgba(129,140,248,0.12)' };
  return              { label:'Gas Giant',    color:'#fbbf24', bg:'rgba(245,158,11,0.12)' };
};

// Habitability score (simplified Earth Similarity Index proxy)
const habitScore = (planet) => {
  if (!planet.pl_radj || !planet.pl_orbper) return 0;
  const re = (planet.pl_radj || 0) * 11.2;
  const sizeFit  = re >= 0.7 && re <= 1.5 ? 1 : Math.max(0, 1 - Math.abs(re - 1) * 0.4);
  const periodFit = planet.pl_orbper >= 200 && planet.pl_orbper <= 600 ? 1 :
    Math.max(0, 1 - Math.abs(Math.log(planet.pl_orbper / 365)) * 0.5);
  return Math.round(Math.min(100, (sizeFit * 0.6 + periodFit * 0.4) * 100));
};

// ─── Orbital diagram ──────────────────────────────────────────────────────────
const OrbitDiagram = ({ planet }) => {
  const period = planet.pl_orbper || 365;
  const r = Math.max(0.05, Math.min(1, Math.log10(period + 1) / 3));
  const planetR = (planet.pl_radj || 0.09) * 11.2;
  const sizePx = Math.max(3, Math.min(10, planetR * 2));
  const type = classifyPlanet(planet.pl_radj);
  return (
    <div style={{position:'relative',width:70,height:70,flexShrink:0}}>
      {/* Star */}
      <div style={{
        position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        width:8, height:8, borderRadius:'50%',
        background:'radial-gradient(circle,#FFF176,#FDB813)',
        boxShadow:'0 0 8px #FDB813',
      }} />
      {/* Orbit ring */}
      <div style={{
        position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        width:50*r+10, height:50*r+10,
        borderRadius:'50%',
        border:`1px solid ${type.color}30`,
      }} />
      {/* Planet */}
      <div style={{
        position:'absolute',
        width:sizePx, height:sizePx,
        borderRadius:'50%',
        background:type.color,
        boxShadow:`0 0 6px ${type.color}88`,
        top:`calc(50% - ${25*r+5}px)`,
        left:`calc(50% - ${sizePx/2}px)`,
      }} />
    </div>
  );
};

// ─── Exoplanet card ───────────────────────────────────────────────────────────
const PlanetCard = ({ planet }) => {
  const type   = classifyPlanet(planet.pl_radj);
  const score  = habitScore(planet);
  const re     = planet.pl_radj ? (planet.pl_radj * 11.2).toFixed(2) : '—';
  const massJ  = planet.pl_bmassj?.toFixed(3) ?? '—';
  const period = planet.pl_orbper?.toFixed(1) ?? '—';
  const dist   = planet.sy_dist?.toFixed(1) ?? '—';

  const barColor = score > 60 ? '#4ade80' : score > 30 ? '#fbbf24' : '#f87171';

  return (
    <div className="card" style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',gap:'0.75rem'}}>
        <OrbitDiagram planet={planet} />
        <div style={{flex:1,minWidth:0}}>
          <div style={{
            fontFamily:'Space Grotesk,sans-serif',fontWeight:800,
            fontSize:'1.0rem',color:'#fff',
            overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
            marginBottom:'0.25rem',
          }}>{planet.pl_name || '—'}</div>
          <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.45)',marginBottom:'0.35rem'}}>
            ⭐ {planet.hostname || '—'}
          </div>
          <span style={{
            fontSize:'0.67rem',fontWeight:700,
            background:type.bg, color:type.color,
            border:`1px solid ${type.color}44`,
            padding:'2px 8px',borderRadius:20,
          }}>{type.label}</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display:'grid', gridTemplateColumns:'1fr 1fr',
        gap:'0.4rem 0.75rem', fontSize:'0.77rem',
      }}>
        {[
          ['Radius', `${re} R⊕`],
          ['Mass', `${massJ} MJ`],
          ['Period', `${period} days`],
          ['Distance', `${dist} pc`],
        ].map(([k,v]) => (
          <div key={k} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.05)',paddingBottom:'0.3rem'}}>
            <span style={{color:'rgba(255,255,255,0.38)'}}>{k}</span>
            <span style={{fontWeight:600,color:'rgba(255,255,255,0.8)'}}>{v}</span>
          </div>
        ))}
      </div>

      {/* Habitability bar */}
      <div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.72rem',marginBottom:'0.3rem'}}>
          <span style={{color:'rgba(255,255,255,0.4)'}}>Habitability index</span>
          <span style={{fontWeight:700,color:barColor}}>{score}%</span>
        </div>
        <div style={{height:4,borderRadius:2,background:'rgba(255,255,255,0.08)'}}>
          <div style={{
            height:'100%', borderRadius:2,
            width:`${score}%`,
            background:`linear-gradient(90deg,${barColor}88,${barColor})`,
            transition:'width 1s ease',
          }} />
        </div>
      </div>
    </div>
  );
};

// ─── Mock fallback data ────────────────────────────────────────────────────────
const MOCK = [
  { pl_name:'Proxima Cen b', hostname:'Proxima Centauri', pl_bmassj:0.004, pl_radj:0.094, pl_orbper:11.2,   sy_dist:1.3 },
  { pl_name:'TRAPPIST-1e',   hostname:'TRAPPIST-1',       pl_bmassj:0.006, pl_radj:0.082, pl_orbper:6.1,    sy_dist:12.1 },
  { pl_name:'TRAPPIST-1f',   hostname:'TRAPPIST-1',       pl_bmassj:0.007, pl_radj:0.102, pl_orbper:9.2,    sy_dist:12.1 },
  { pl_name:'Kepler-452b',   hostname:'Kepler-452',       pl_bmassj:0.045, pl_radj:0.143, pl_orbper:384.8,  sy_dist:430 },
  { pl_name:'Kepler-22b',    hostname:'Kepler-22',        pl_bmassj:0.135, pl_radj:0.213, pl_orbper:289.9,  sy_dist:620 },
  { pl_name:'HD 209458 b',   hostname:'HD 209458',        pl_bmassj:0.690, pl_radj:0.123, pl_orbper:3.5,    sy_dist:47.5 },
  { pl_name:'WASP-12b',      hostname:'WASP-12',          pl_bmassj:1.470, pl_radj:0.160, pl_orbper:1.09,   sy_dist:206 },
  { pl_name:'GJ 667Cc',      hostname:'GJ 667C',          pl_bmassj:0.015, pl_radj:0.118, pl_orbper:28.1,   sy_dist:6.8 },
  { pl_name:'K2-18b',        hostname:'K2-18',            pl_bmassj:0.026, pl_radj:0.22,  pl_orbper:32.9,   sy_dist:124 },
  { pl_name:'TOI-700d',      hostname:'TOI-700',          pl_bmassj:0.009, pl_radj:0.097, pl_orbper:37.4,   sy_dist:31.1 },
  { pl_name:'LHS 1140b',     hostname:'LHS 1140',         pl_bmassj:0.021, pl_radj:0.124, pl_orbper:24.7,   sy_dist:12.5 },
  { pl_name:'55 Cnc e',      hostname:'55 Cancri',        pl_bmassj:0.027, pl_radj:0.165, pl_orbper:0.74,   sy_dist:12.6 },
];

// ─── Main component ────────────────────────────────────────────────────────────
const ExoplanetExplorer = () => {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [sortBy,  setSortBy]  = useState('habitability');
  const [typeFilter, setType] = useState('all');
  const [source,  setSource]  = useState('live');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const q = encodeURIComponent(
          `SELECT pl_name,hostname,pl_bmassj,pl_radj,pl_orbper,sy_dist FROM ps WHERE pl_name IS NOT NULL ORDER BY pl_name LIMIT 80`
        );
        const res = await fetch(
          `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${q}&format=json`
        );
        if (!res.ok) throw new Error('API unavailable');
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error('empty');
        setPlanets(data);
        setSource('live');
      } catch {
        setPlanets(MOCK);
        setSource('demo');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = planets
    .filter(p => {
      const q = search.toLowerCase();
      if (q && !(p.pl_name?.toLowerCase().includes(q) || p.hostname?.toLowerCase().includes(q))) return false;
      if (typeFilter !== 'all') {
        const t = classifyPlanet(p.pl_radj).label.toLowerCase();
        if (!t.includes(typeFilter)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'habitability') return habitScore(b) - habitScore(a);
      if (sortBy === 'name')    return (a.pl_name || '').localeCompare(b.pl_name || '');
      if (sortBy === 'radius')  return (b.pl_radj || 0) - (a.pl_radj || 0);
      if (sortBy === 'distance')return (a.sy_dist || 0) - (b.sy_dist || 0);
      if (sortBy === 'period')  return (a.pl_orbper || 0) - (b.pl_orbper || 0);
      return 0;
    });

  return (
    <div style={{padding:'0 1.5rem 4rem',maxWidth:1200,margin:'0 auto'}}>

      {/* Source badge */}
      {!loading && (
        <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
          <span style={{
            fontSize:'0.72rem',fontWeight:700,
            background: source==='live' ? 'rgba(74,222,128,0.12)' : 'rgba(251,191,36,0.12)',
            color: source==='live' ? '#4ade80' : '#fbbf24',
            border: `1px solid ${source==='live' ? '#4ade8044' : '#fbbf2444'}`,
            padding:'3px 12px',borderRadius:20,
          }}>
            {source === 'live' ? '🟢 Live NASA Exoplanet Archive' : '🟡 Demo data — NASA API unavailable in browser'}
          </span>
        </div>
      )}

      {/* Filters */}
      <div style={{
        background:'rgba(255,255,255,0.03)',
        border:'1px solid rgba(255,255,255,0.07)',
        borderRadius:16,padding:'1.25rem',
        marginBottom:'1.75rem',
        display:'flex',flexWrap:'wrap',gap:'0.75rem',alignItems:'center',
      }}>
        <input
          type="text" placeholder="🔍  Search planet or star name…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            flex:'1 1 220px',minWidth:0,
            background:'rgba(255,255,255,0.06)',
            border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:10,padding:'0.55rem 0.9rem',
            color:'#fff',fontSize:'0.9rem',outline:'none',
          }}
        />

        <select value={typeFilter} onChange={e=>setType(e.target.value)} style={{
          background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:10,padding:'0.55rem 0.9rem',color:'#fff',fontSize:'0.85rem',cursor:'pointer',
        }}>
          <option value="all">All types</option>
          <option value="rocky">Rocky</option>
          <option value="super">Super-Earth</option>
          <option value="neptune">Neptune-like</option>
          <option value="gas">Gas Giant</option>
        </select>

        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{
          background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:10,padding:'0.55rem 0.9rem',color:'#fff',fontSize:'0.85rem',cursor:'pointer',
        }}>
          <option value="habitability">Sort: Habitability</option>
          <option value="name">Sort: Name</option>
          <option value="radius">Sort: Radius</option>
          <option value="distance">Sort: Distance</option>
          <option value="period">Sort: Orbital period</option>
        </select>

        <span style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.35)',marginLeft:'auto'}}>
          {filtered.length} of {planets.length} worlds
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:'1.25rem'}}>
          {Array.from({length:12}).map((_,i) => (
            <div key={i} style={{
              background:'rgba(255,255,255,0.03)',
              border:'1px solid rgba(255,255,255,0.06)',
              borderRadius:16,padding:'1.5rem',height:220,
              animation:'pulse 1.5s ease-in-out infinite',
              animationDelay:`${i*80}ms`,
            }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:'center',padding:'4rem',color:'rgba(255,255,255,0.35)'}}>
          <div style={{fontSize:'3rem',marginBottom:'0.75rem'}}>🔭</div>
          <p>No planets match your search. Try a different name or filter.</p>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:'1.25rem'}}>
          {filtered.map((p, i) => (
            <PlanetCard key={p.pl_name || i} planet={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExoplanetExplorer;
