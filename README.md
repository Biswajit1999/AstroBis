# AstroBis

AstroBis is an interactive astronomy platform built with Astro, React, Three.js, and live public space-data APIs. It focuses on realistic 3D exploration, current reference data, and browser-native visual tools.

## Features

- **Solar System Atlas** - Explore the Sun, planets, dwarf planets, asteroid belt, Kuiper belt, heliopause, and Oort Cloud on a compressed real-distance scale.
- **Exoplanet Archive** - Browse NASA Exoplanet Archive composite parameters with planet type, orbit, mass, radius, temperature, habitability proxy, and source links.
- **ISS Mission Control** - Track the International Space Station over a textured 3D Earth with clouds, telemetry, orbit projection, and ground-track map.
- **NEO Watch** - Query JPL close-approach data through 2050 with miss distance, velocity, size estimates, and risk-proxy filters.
- **3D Stellar Atlas** - Navigate bright stars using real RA/Dec coordinates, spectral colors, constellation guides, distance shells, and an H-R style inset.
- **NASA APOD** - Display the Astronomy Picture of the Day with scientific context.

## Tech Stack

- Astro 4
- React 18
- Three.js and @react-three/fiber
- @react-three/drei
- Tailwind CSS
- NASA Exoplanet Archive TAP
- JPL SBDB Close-Approach Data API
- wheretheiss.at public ISS telemetry

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the static build:

```bash
npm run preview
```

## Deployment

The project is configured for GitHub Pages under `/AstroBis` using Astro's `site` and `base` settings.

## Author

Created by Biswajit Jana.

## License

MIT
