import React, { useEffect, useMemo, useState } from 'react';

const FALLBACK_STATS = {
  schemaVersion: 1,
  generatedAt: '2026-06-21T21:10:28.916Z',
  source: 'Bundled AstroBis reference snapshot',
  exoplanetQuery: 'NASA Exoplanet Archive ps table: default_flag = 1',
  stats: {
    confirmedExoplanets: 6298,
    oortInnerAu: 1000,
    oortOuterAu: 100000,
    universeAgeGyr: 13.8,
    solarSystemPlanets: 8,
  },
};

function dataUrl(filename) {
  const base = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
    ? import.meta.env.BASE_URL
    : '/';
  return `${base.endsWith('/') ? base : `${base}/`}data/${filename}`;
}

function number(value) {
  return new Intl.NumberFormat('en-US').format(Number(value) || 0);
}

function StatCard({ icon, value, label, description, accent = '#c084fc' }) {
  return (
    <article
      className="card"
      style={{
        textAlign: 'center',
        padding: '1.9rem 1.25rem',
        minHeight: 208,
        display: 'grid',
        alignContent: 'center',
        gap: 7,
      }}
    >
      <div style={{ fontSize: '2.25rem', lineHeight: 1 }} aria-hidden="true">{icon}</div>
      <div style={{
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 900,
        fontFamily: 'Space Grotesk, sans-serif',
        lineHeight: 1.04,
        letterSpacing: '-0.04em',
        color: accent,
        textShadow: `0 0 24px ${accent}26`,
      }}>
        {value}
      </div>
      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#e2e8f0' }}>
        {label}
      </div>
      <div style={{ fontSize: '0.77rem', color: 'rgba(255,255,255,0.48)', lineHeight: 1.5 }}>
        {description}
      </div>
    </article>
  );
}

export default function StatsCounter() {
  const [snapshot, setSnapshot] = useState(FALLBACK_STATS);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${dataUrl('home-stats.json')}?ts=${Date.now()}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`home-stats.json returned ${response.status}`);
        return response.json();
      })
      .then((payload) => {
        if (payload?.stats?.confirmedExoplanets) setSnapshot(payload);
      })
      .catch(() => {
        // The visible fallback is intentional: avoid zero-value cards during
        // hydration or when an upstream build-time request is unavailable.
      });

    return () => controller.abort();
  }, []);

  const stats = snapshot?.stats || FALLBACK_STATS.stats;

  const cards = useMemo(() => [
    {
      icon: '◌',
      value: `${number(stats.confirmedExoplanets)}+`,
      label: 'Confirmed exoplanets',
      description: 'NASA Archive count; refreshed by the site data workflow.',
      accent: '#c084fc',
    },
    {
      icon: '◒',
      value: `${number(stats.oortOuterAu)} AU`,
      label: 'Oort-cloud outer scale',
      description: 'A scale reference, not a detected outer boundary.',
      accent: '#67e8f9',
    },
    {
      icon: '◷',
      value: `${Number(stats.universeAgeGyr).toFixed(1)} billion yr`,
      label: 'Age of the Universe',
      description: 'Standard cosmological reference value.',
      accent: '#a78bfa',
    },
    {
      icon: '☉',
      value: number(stats.solarSystemPlanets),
      label: 'Planets in the Solar System',
      description: 'Mercury through Neptune.',
      accent: '#fbbf24',
    },
  ], [stats]);

  const generatedLabel = snapshot?.generatedAt
    ? new Date(snapshot.generatedAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
    : 'bundled snapshot';

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1.25rem',
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 1rem',
      }}>
        {cards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      <p style={{
        maxWidth: 850,
        margin: '1rem auto 0',
        padding: '0 1rem',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.38)',
        fontSize: '0.74rem',
        lineHeight: 1.55,
      }}>
        Snapshot: {generatedLabel}. Catalogue figures are build-time values; the Oort Cloud number is a scale reference because the cloud has not been directly imaged.
      </p>
    </div>
  );
}
