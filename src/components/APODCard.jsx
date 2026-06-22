import React, { useEffect, useMemo, useState } from 'react';

const APOD_FALLBACK = {
  title: 'NASA APOD snapshot unavailable',
  explanation: 'The local Astronomy Picture of the Day snapshot was unavailable during the most recent data refresh. Run npm run fetch:data or npm run build to refresh the same-origin APOD cache.',
  media_type: 'image',
  date: null,
  url: null,
  localImageUrl: null,
  copyright: 'NASA APOD',
  sourceUrl: 'https://apod.nasa.gov/apod/astropix.html',
};

function assetUrl(relativePath) {
  if (!relativePath) return null;
  if (/^https?:\/\//i.test(relativePath)) return relativePath;

  const base = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
    ? import.meta.env.BASE_URL
    : '/';

  const normalisedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalisedBase}${String(relativePath).replace(/^\/+/, '')}`;
}

function normaliseApod(payload) {
  if (!payload || typeof payload !== 'object') return APOD_FALLBACK;

  return {
    ...APOD_FALLBACK,
    ...payload,
    title: payload.title || APOD_FALLBACK.title,
    explanation: payload.explanation || APOD_FALLBACK.explanation,
    media_type: payload.media_type || 'image',
  };
}

function MediaFallback({ title, sourceUrl }) {
  return (
    <div style={{
      minHeight: 360,
      display: 'grid',
      placeItems: 'center',
      padding: '2rem',
      textAlign: 'center',
      background: 'radial-gradient(circle at 50% 25%, rgba(99,102,241,0.18), transparent 34%), linear-gradient(135deg, #070716, #03020d)',
      color: 'rgba(255,255,255,0.72)',
    }}>
      <div>
        <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>✦</div>
        <strong style={{ display: 'block', fontFamily: 'Space Grotesk, Inter, sans-serif', color: '#fff', marginBottom: 8 }}>
          {title || 'NASA APOD image unavailable'}
        </strong>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#a78bfa', fontSize: '0.82rem', textDecoration: 'none' }}
          >
            Open NASA APOD ↗
          </a>
        )}
      </div>
    </div>
  );
}

const APODCard = () => {
  const [apod, setApod] = useState(null);
  const [load, setLoad] = useState(true);
  const [expand, setExpand] = useState(false);
  const [imageState, setImageState] = useState('loading');
  const [usingRemoteImage, setUsingRemoteImage] = useState(false);

  const snapshotUrl = useMemo(() => assetUrl(`data/apod.json?ts=${Date.now()}`), []);
  const fallbackImageUrl = useMemo(() => assetUrl('data/apod-fallback.svg'), []);

  useEffect(() => {
    let active = true;

    async function loadSnapshot() {
      try {
        const response = await fetch(snapshotUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error(`APOD snapshot returned ${response.status}`);
        const payload = await response.json();
        if (active) setApod(normaliseApod(payload));
      } catch {
        if (active) setApod(APOD_FALLBACK);
      } finally {
        if (active) setLoad(false);
      }
    }

    loadSnapshot();
    return () => {
      active = false;
    };
  }, [snapshotUrl]);

  useEffect(() => {
    setImageState('loading');
    setUsingRemoteImage(false);
  }, [apod?.date, apod?.localImageUrl, apod?.url]);

  if (load) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        overflow: 'hidden',
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✦</div>
          <div style={{ fontSize: '0.85rem' }}>Loading local APOD snapshot…</div>
        </div>
      </div>
    );
  }

  const entry = apod || APOD_FALLBACK;
  const isImage = entry.media_type === 'image' || !entry.media_type;
  const localImage = assetUrl(entry.localImageUrl);
  const remoteImage = entry.url || null;
  const imageSource = usingRemoteImage ? remoteImage : (localImage || remoteImage || fallbackImageUrl);
  const imageIsFallback = imageSource === fallbackImageUrl || imageState === 'failed';

  const handleImageError = () => {
    if (!usingRemoteImage && remoteImage && remoteImage !== localImage) {
      setUsingRemoteImage(true);
      return;
    }
    setImageState('failed');
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 20,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.9rem 1.25rem',
        background: 'linear-gradient(90deg,rgba(124,58,237,0.15),rgba(219,39,119,0.1))',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        gap: '0.8rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
          <span style={{ fontSize: 16 }}>🌌</span>
          <span style={{
            fontSize: '0.7rem', fontWeight: 700,
            color: '#a78bfa', letterSpacing: '0.1em', textTransform: 'uppercase',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            Astronomy Picture of the Day{entry.date ? ` — ${entry.date}` : ''}
          </span>
        </div>
        <span style={{
          flex: '0 0 auto',
          fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)',
          background: 'rgba(255,255,255,0.06)',
          padding: '2px 8px', borderRadius: 20,
        }}>NASA APOD</span>
      </div>

      {isImage ? (
        imageIsFallback ? (
          <MediaFallback title={entry.title} sourceUrl={entry.sourceUrl || APOD_FALLBACK.sourceUrl} />
        ) : (
          <div style={{ position: 'relative', overflow: 'hidden', maxHeight: 420, background: '#05050e' }}>
            {imageState === 'loading' && (
              <div style={{
                position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', zIndex: 1,
                background: 'radial-gradient(circle at 50% 35%, rgba(99,102,241,0.12), transparent 35%), #05050e',
                color: 'rgba(255,255,255,0.42)', fontSize: '0.82rem',
              }}>
                Loading APOD image snapshot…
              </div>
            )}
            <img
              src={imageSource}
              alt={entry.title}
              referrerPolicy="no-referrer"
              style={{
                width: '100%', height: 420, objectFit: 'cover', display: 'block',
                transition: 'transform 0.6s ease, opacity 0.25s ease',
                opacity: imageState === 'loaded' ? 1 : 0.02,
              }}
              onLoad={() => setImageState('loaded')}
              onError={handleImageError}
              onMouseEnter={(event) => { event.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseLeave={(event) => { event.currentTarget.style.transform = 'scale(1)'; }}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: 120,
              background: 'linear-gradient(to top, rgba(3,2,13,0.95), transparent)',
              pointerEvents: 'none',
            }} />
          </div>
        )
      ) : entry.url ? (
        <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
          <iframe
            src={entry.url}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={entry.title}
          />
        </div>
      ) : (
        <MediaFallback title={entry.title} sourceUrl={entry.sourceUrl || APOD_FALLBACK.sourceUrl} />
      )}

      <div style={{ padding: '1.25rem 1.5rem' }}>
        <h3 style={{
          fontSize: '1.2rem', fontWeight: 800,
          fontFamily: 'Space Grotesk, sans-serif',
          marginBottom: '0.6rem', color: '#fff',
        }}>{entry.title}</h3>

        <p style={{
          fontSize: '0.83rem', color: 'rgba(255,255,255,0.58)', lineHeight: 1.65,
          display: '-webkit-box', WebkitLineClamp: expand ? 'none' : 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '0.75rem',
        }}>
          {entry.explanation}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => setExpand((value) => !value)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', color: '#a78bfa',
              fontSize: '0.78rem', fontWeight: 600, padding: 0, letterSpacing: '0.02em',
            }}
          >
            {expand ? '↑ Show less' : '↓ Read more'}
          </button>
          {entry.copyright && (
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)', textAlign: 'right' }}>
              © {entry.copyright}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default APODCard;
