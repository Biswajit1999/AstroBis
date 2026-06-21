![AstroBis astronomy dashboard banner](assets/astrobis-banner.png)

# AstroBis

[![Live Demo](https://img.shields.io/badge/Live-Demo-0A66C2?style=for-the-badge)](https://biswajit1999.github.io/AstroBis/)
[![Astro](https://img.shields.io/badge/Astro-4.x-FF5D01?style=for-the-badge\&logo=astro)](https://astro.build/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge\&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge\&logo=three.js)](https://threejs.org/)
[![NASA Data](https://img.shields.io/badge/Data-NASA%20%26%20JPL-0B3D91?style=for-the-badge)](https://www.nasa.gov/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

### Independent Research Project in Browser-Based Astronomy Visualisation

AstroBis is a browser-native astronomy platform developed by **Biswajit Jana** that combines Solar System exploration, exoplanet catalogues, ISS orbital tracking, near-Earth object monitoring, interstellar visitor records, stellar visualisation, and NASA astronomy content into a single interactive environment.

The project focuses on **scientific visualisation, public astronomy data, and browser-based exploration** rather than static educational content. Wherever possible, values are sourced from publicly available scientific archives and displayed through interactive visual tools.

🌐 **Live Website:**
https://biswajit1999.github.io/AstroBis/

📄 **Technical Report:**
docs/AstroBis-Ecosystem-Report.md

---

## Overview

AstroBis currently contains six major modules:

| Module                 | Description                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| 🌞 Solar System Atlas  | Interactive exploration of planets, dwarf planets, Kuiper Belt, heliopause, and Oort Cloud scales |
| 🪐 Exoplanet Explorer  | NASA Exoplanet Archive catalogue browsing, filtering, and visual analytics                        |
| 🛰 ISS Mission Control | ISS tracking using CelesTrak orbital elements and SGP4 propagation                                |
| ☄ Small-Body Watch     | Near-Earth object monitoring and interstellar visitor records                                     |
| ⭐ 3D Stellar Atlas     | Interactive stellar reference field using astronomical coordinates                                |
| 📸 NASA APOD           | Astronomy Picture of the Day integration                                                          |

---

## Solar System Atlas

The Solar System Atlas provides a navigable representation of the Solar System from the inner planets to Oort Cloud scales.

Features include:

* Eight planets and selected dwarf planets
* Asteroid Belt and Jupiter Trojan populations
* Kuiper Belt and scattered-disc regions
* Heliopause reference zone
* Inner and outer Oort Cloud representations
* AU ruler and light-travel-time references
* Multiple scale presets
* Inclined and eccentric orbit visualisation

The Solar System spans more than five orders of magnitude in distance, so AstroBis uses compressed visual scales and multiple viewing modes rather than a single linear representation.

---

## Exoplanet Explorer

The Exoplanet Explorer uses NASA Exoplanet Archive data and currently stores a working subset of approximately **4,000 planetary systems**.

Capabilities include:

* Planet and host-star search
* Discovery method filtering
* Radius, mass, temperature, and orbital analysis
* Discovery timeline visualisation
* Scatter-plot analytics
* Mission and observatory statistics
* Habitability-style comparison metrics
* Archive source linking

The platform is designed for exploration and comparison rather than scientific classification.

---

## ISS Mission Control

ISS Mission Control propagates the International Space Station orbit using publicly available orbital elements from CelesTrak.

Displayed telemetry includes:

* Latitude
* Longitude
* Altitude
* Velocity
* Orbital period
* Inclination
* Ground-track projection
* Day/night context
* TLE age and epoch information

The Earth model includes cloud layers, night lighting, atmosphere effects, and orbital visualisation.

---

## Small-Body Watch

Small-Body Watch uses NASA/JPL close-approach records and orbital databases to visualise Earth encounters and known interstellar visitors.

Current features include:

* Earth close approaches through 2050
* Miss distance visualisation
* Relative velocity estimates
* Diameter and brightness information
* Risk-style filtering
* Timeline analytics
* Interstellar visitor records

Included interstellar visitors:

* 1I/'Oumuamua
* 2I/Borisov
* 3I/ATLAS

Risk indicators are visual prioritisation tools and should not be interpreted as official hazard assessments.

---

## 3D Stellar Atlas

The Stellar Atlas provides an interactive three-dimensional reference map of bright stars.

Features include:

* Right ascension and declination coordinates
* Spectral colour representation
* Distance shells
* Constellation guides
* Luminosity and temperature proxies
* Interactive navigation

The atlas is intended as a visual orientation tool rather than a complete astrometric catalogue.

---

## Data Sources

AstroBis integrates public astronomical datasets from:

* NASA Exoplanet Archive
* NASA/JPL Small-Body Database
* NASA/JPL Close-Approach Data API
* NASA Astronomy Picture of the Day
* CelesTrak Orbital Data
* Public astronomical catalogues and reference datasets

Build-time snapshots are generated automatically to ensure functionality even when third-party APIs are unavailable.

---

## Technology Stack

### Frontend

* Astro 4
* React 18
* Three.js
* @react-three/fiber
* @react-three/drei
* Tailwind CSS

### Data & Astronomy

* NASA Exoplanet Archive TAP
* NASA/JPL Small-Body APIs
* CelesTrak GP/TLE
* satellite.js (SGP4 propagation)

### Deployment

* GitHub Pages
* GitHub Actions
* Automated data-refresh workflows

---

## Local Installation

Clone the repository:

```bash
git clone https://github.com/Biswajit1999/AstroBis.git
cd AstroBis
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Scientific Notes

AstroBis intentionally separates:

* Archive values and measured data
* Derived quantities and visual analytics
* Illustrative visualisations

Examples:

* Oort Cloud particles are visual representations, not observed objects.
* Exoplanet renders are artistic interpretations, not telescope images.
* ISS positions depend on the age of the available orbital elements.
* Small-body records may change as orbital solutions are refined.

---

## About the Author

**Biswajit Jana**
Independent Researcher — Astrophysics, Instrumentation & Scientific Computing

MSc Astrophysics (Advanced Research)
University of Hertfordshire

Academic Portfolio:

https://biswajit1999.github.io/Biswajit_Jana.github.io/

---

## License

Released under the MIT License.
