import React, { useState, useEffect, useRef } from 'react';

const useCountUp = (target, duration = 2000, started) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return val;
};

const Stat = ({ value, suffix, label, description, icon, delay, started }) => {
  const n = useCountUp(value, 2200, started);
  return (
    <div
      className="card"
      style={{
        textAlign:'center', padding:'2rem 1.5rem',
        animationDelay:`${delay}ms`,
        opacity: started ? 1 : 0,
        transform: started ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div style={{fontSize:'2.5rem',marginBottom:'0.5rem',lineHeight:1}}>{icon}</div>
      <div style={{
        fontSize:'3.2rem', fontWeight:900,
        fontFamily:'Space Grotesk,sans-serif',
        lineHeight:1, marginBottom:'0.4rem',
        background:'linear-gradient(135deg,#a78bfa,#ec4899)',
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        backgroundClip:'text',
      }}>
        {n.toLocaleString()}{suffix}
      </div>
      <div style={{fontWeight:700,fontSize:'0.95rem',marginBottom:'0.3rem',color:'#e2e8f0'}}>
        {label}
      </div>
      <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.4)',lineHeight:1.5}}>
        {description}
      </div>
    </div>
  );
};

const stats = [
  { value:5700,  suffix:'+', label:'Exoplanets Confirmed', description:'Worlds orbiting other stars — and counting', icon:'🌍', delay:0 },
  { value:200,   suffix:'B', label:'Galaxies Observable',  description:'In the observable universe alone',             icon:'🌌', delay:150 },
  { value:13800, suffix:'M', label:'Years — Universe Age', description:'Years since the Big Bang',                    icon:'⏳', delay:300 },
  { value:8,     suffix:'',  label:'Planets in our System',description:'Each unique — from tiny Mercury to vast Jupiter', icon:'☀️', delay:450 },
];

const StatsCounter = () => {
  const ref     = useRef(null);
  const [go, setGo] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setGo(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',
      gap:'1.25rem', maxWidth:1100, margin:'0 auto', padding:'0 1rem',
    }}>
      {stats.map(s => <Stat key={s.label} {...s} started={go} />)}
    </div>
  );
};

export default StatsCounter;
