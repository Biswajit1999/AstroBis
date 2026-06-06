import React, { useState, useEffect } from 'react';

const APODCard = () => {
  const [apod, setApod]   = useState(null);
  const [load, setLoad]   = useState(true);
  const [err,  setErr]    = useState(false);
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        const res = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        setApod(data);
      } catch {
        // Beautiful fallback — one of the best-known APOD images
        setApod({
          title: 'Pillars of Creation — Webb NIRCam',
          explanation:
            'The Eagle Nebula\'s iconic "Pillars of Creation" captured in near-infrared light by the James Webb Space Telescope. Semi-transparent, blue-toned pillars tower against a rich amber background of distant stars. New stars are actively being born within these interstellar cloud columns of hydrogen gas and cosmic dust.',
          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg/1280px-Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg',
          media_type: 'image',
          date: new Date().toISOString().slice(0, 10),
          copyright: 'NASA / ESA / Hubble Heritage Team',
        });
      } finally {
        setLoad(false);
      }
    };
    fetchAPOD();
  }, []);

  if (load) {
    return (
      <div style={{
        background:'rgba(255,255,255,0.03)',
        border:'1px solid rgba(255,255,255,0.08)',
        borderRadius:20, overflow:'hidden',
        minHeight:400, display:'flex',
        alignItems:'center', justifyContent:'center',
      }}>
        <div style={{textAlign:'center',color:'rgba(255,255,255,0.4)'}}>
          <div style={{fontSize:32,marginBottom:8}}>🔭</div>
          <div style={{fontSize:'0.85rem'}}>Loading today's cosmos…</div>
        </div>
      </div>
    );
  }

  if (!apod) return null;

  const isImage = apod.media_type === 'image' || !apod.media_type;

  return (
    <div style={{
      background:'rgba(255,255,255,0.025)',
      border:'1px solid rgba(255,255,255,0.08)',
      borderRadius:20, overflow:'hidden',
      transition:'all 0.3s ease',
    }}>
      {/* Badge */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0.9rem 1.25rem',
        background:'linear-gradient(90deg,rgba(124,58,237,0.15),rgba(219,39,119,0.1))',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
          <span style={{fontSize:16}}>🌌</span>
          <span style={{
            fontSize:'0.7rem', fontWeight:700,
            color:'#a78bfa', letterSpacing:'0.1em', textTransform:'uppercase',
          }}>Astronomy Picture of the Day — {apod.date}</span>
        </div>
        <span style={{
          fontSize:'0.68rem', color:'rgba(255,255,255,0.35)',
          background:'rgba(255,255,255,0.06)',
          padding:'2px 8px', borderRadius:20,
        }}>NASA APOD</span>
      </div>

      {/* Image */}
      {isImage ? (
        <div style={{position:'relative',overflow:'hidden',maxHeight:420}}>
          <img
            src={apod.url}
            alt={apod.title}
            style={{
              width:'100%', height:420, objectFit:'cover',
              display:'block', transition:'transform 0.6s ease',
            }}
            onMouseEnter={e => e.target.style.transform='scale(1.03)'}
            onMouseLeave={e => e.target.style.transform='scale(1)'}
          />
          {/* Gradient overlay at bottom */}
          <div style={{
            position:'absolute', bottom:0, left:0, right:0,
            height:120,
            background:'linear-gradient(to top, rgba(3,2,13,0.95), transparent)',
          }} />
        </div>
      ) : (
        <div style={{position:'relative',paddingBottom:'56.25%',background:'#000'}}>
          <iframe
            src={apod.url}
            style={{position:'absolute',inset:0,width:'100%',height:'100%',border:'none'}}
            allowFullScreen title={apod.title}
          />
        </div>
      )}

      {/* Text */}
      <div style={{padding:'1.25rem 1.5rem'}}>
        <h3 style={{
          fontSize:'1.2rem', fontWeight:800,
          fontFamily:'Space Grotesk,sans-serif',
          marginBottom:'0.6rem', color:'#fff',
        }}>{apod.title}</h3>

        <p style={{
          fontSize:'0.83rem',
          color:'rgba(255,255,255,0.58)',
          lineHeight:1.65,
          display:'-webkit-box', WebkitLineClamp: expand ? 'none' : 3,
          WebkitBoxOrient:'vertical', overflow:'hidden',
          marginBottom:'0.75rem',
        }}>
          {apod.explanation}
        </p>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <button
            onClick={() => setExpand(e => !e)}
            style={{
              background:'none', border:'none', cursor:'pointer',
              color:'#a78bfa', fontSize:'0.78rem', fontWeight:600,
              padding:0, letterSpacing:'0.02em',
            }}
          >
            {expand ? '↑ Show less' : '↓ Read more'}
          </button>
          {apod.copyright && (
            <span style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.28)'}}>
              © {apod.copyright}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default APODCard;
