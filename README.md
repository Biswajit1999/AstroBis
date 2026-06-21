![AstroBis astronomy dashboard banner](assets/astrobis-banner.png)

# AstroBis

**Independent research project in browser-based astronomy visualisation**

[Live site](https://biswajit1999.github.io/AstroBis/) · [Technical project report](docs/AstroBis-Ecosystem-Report.md) · [MIT License](LICENSE)

AstroBis is a browser-native astronomy platform developed by **Biswajit Jana**, an independent researcher working across astrophysics, instrumentation, scientific computing, and public scientific visualisation.

The project brings together Solar System scale, exoplanet catalogue values, ISS orbital propagation, small-body close approaches, interstellar visitors, stellar coordinates, and NASA’s Astronomy Picture of the Day in one interactive environment.

AstroBis is designed as a scientific exploration interface, not as mission-operations software, an impact-prediction system, or a replacement for specialist astronomy tools.

---

## What AstroBis does

| Module              | Purpose                                                                                  | Primary source or method            |
| ------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------- |
| Solar System Atlas  | Explores planets, dwarf planets, debris regions, heliopause scale, and Oort Cloud shells | Compressed AU-scale geometry        |
| Exoplanet Explorer  | Filters and plots planetary-system parameters                                            | NASA Exoplanet Archive `PSCompPars` |
| ISS Mission Control | Propagates the ISS orbit and ground track                                                | CelesTrak GP/TLE + SGP4             |
| Small-Body Watch    | Displays future Earth close approaches and visitor context                               | NASA/JPL CAD and SBDB APIs          |
| 3D Stellar Atlas    | Visualises bright-star positions and broad physical proxies                              | RA/Dec-based 3D coordinate field    |
| NASA APOD           | Displays NASA’s daily astronomy image and accompanying context                           | NASA APOD service                   |

---

## Scientific conventions

AstroBis keeps three layers distinct:

1. **Source values** — archive fields, TLEs, orbital elements, timestamps, and catalogue parameters.
2. **Derived quantities** — unit conversions, geometric transformations, screening scores, and physical proxies.
3. **Illustrative layers** — planet textures, Oort Cloud particles, exoplanet renders, clouds, night lights, and atmospheric effects.

Visual layers are not presented as direct observations unless explicitly supported by their source.

---

## Solar System Atlas

The Solar System spans more than five orders of magnitude between Earth’s orbit and an outer Oort Cloud scale:

[
\frac{100{,}000\ \mathrm{AU}}{1\ \mathrm{AU}} = 10^5
]

A single linear display would make the inner planetary system unreadable. AstroBis therefore uses compressed visual coordinates.

For inner-system viewing:

[
s_{\mathrm{inner}}(r) = 17\sqrt{r_{\mathrm{AU}}}
]

For outer-system and Oort-scale viewing:

[
s_{\log}(r) = 38\log_{10}(r_{\mathrm{AU}} + 1)
]

These are display transformations, not physical distance scales.

The atlas includes:

* Sun, eight planets, selected dwarf planets, and moon counts
* Asteroid Belt and Jupiter Trojan regions
* Kuiper Belt and scattered-disc context
* Heliopause reference region
* Inner and outer Oort Cloud shells
* Camera presets from the inner planets to outer-cloud scale
* AU ruler and light-time reference values

Approximate one-way light time is calculated using:

[
t_{\mathrm{light}}[\mathrm{min}] = 8.316746 \times r_{\mathrm{AU}}
]

For reference:

|                 Distance |     One-way light time |
| -----------------------: | ---------------------: |
|         (1\ \mathrm{AU}) |    (8.3\ \mathrm{min}) |
|        (30\ \mathrm{AU}) |      (4.2\ \mathrm{h}) |
|   (1{,}000\ \mathrm{AU}) |   (5.8\ \mathrm{days}) |
| (100{,}000\ \mathrm{AU}) | (1.58\ \mathrm{years}) |

The Oort Cloud is represented as a sparse, scientifically motivated visual model. It has not been directly imaged or mapped as a resolved population.

---

## Exoplanet Explorer

AstroBis queries the NASA Exoplanet Archive `PSCompPars` table and stores a build-time working subset:

[
N_{\max} = 4000
]

The selected rows are ordered by host-system distance:

```sql
SELECT TOP 4000 ...
FROM pscomppars
WHERE pl_name IS NOT NULL
  AND hostname IS NOT NULL
ORDER BY sy_dist ASC
```

This means the deployed view is a **distance-sorted exploration subset**, not a complete or statistically unbiased exoplanet census.

The module supports:

* Search by planet and host-star name
* Discovery-method and discovery-facility filters
* Radius, mass, temperature, orbital-period, and distance views
* Mission and facility comparisons
* Discovery timeline and scatter plots
* Radius–temperature and orbit–radius diagrams
* Archive source links

A stellar-luminosity proxy is derived from stellar radius and effective temperature:

[
\frac{L_{\star}}{L_{\odot}}
===========================

\left(\frac{R_{\star}}{R_{\odot}}\right)^2
\left(\frac{T_{\star}}{5772\ \mathrm{K}}\right)^4
]

An Earth-equivalent orbital-distance proxy is then:

[
a_{\oplus}
==========

\frac{a}{\sqrt{L_{\star}/L_{\odot}}}
]

These values are intended for comparison and exploration. They are not official classifications of planetary habitability.

---

## ISS Mission Control

The ISS page uses CelesTrak GP/TLE data for:

[
\mathrm{NORAD\ catalogue\ number} = 25544
]

Orbital propagation is performed locally using `satellite.js` and the SGP4 model.

The propagated state contains position and velocity vectors:

[
\mathbf{r} = (x, y, z)
]

[
\mathbf{v} = (v_x, v_y, v_z)
]

Instantaneous speed is calculated as:

[
v =
\sqrt{v_x^2 + v_y^2 + v_z^2}
]

The module includes:

* Latitude and longitude
* Altitude and velocity
* Orbital radius
* Approximate orbital period and inclination
* Ground-track projection
* Subsolar point and day/night context
* TLE epoch and element-age display

The rendered Earth, cloud layer, city-light map, atmosphere, and shader effects provide visual context only. AstroBis should not be used for safety-critical navigation or mission operations.

---

## Small-Body Watch

The close-approach module uses NASA/JPL SBDB Close-Approach Data API records for Earth encounters between the build date and:

[
31\ \mathrm{December}\ 2050
]

The current snapshot query uses:

[
d_{\mathrm{AU}} \leq 0.3
]

with a maximum response size of:

[
N_{\max} = 7500
]

Displayed close-approach distance conversions are:

[
d_{\mathrm{km}}
===============

d_{\mathrm{AU}}
\times
149{,}597{,}870.7
]

[
d_{\mathrm{LD}}
===============

\frac{d_{\mathrm{km}}}{384{,}400}
]

where (d_{\mathrm{LD}}) is lunar distance.

When no measured diameter is available, AstroBis can estimate diameter from absolute magnitude (H), adopting an assumed geometric albedo of (p=0.14):

[
D[\mathrm{km}]
==============

\frac{1329}{\sqrt{p}}
10^{-H/5}
]

The module includes:

* Miss distance in AU, kilometres, and lunar distances
* Relative velocity
* Diameter values or albedo-dependent estimates
* Absolute magnitude
* Simplified energy-scale comparison
* Timeline and radar-style approach views
* Risk-style screening filters
* Interstellar visitor records for 1I/'Oumuamua, 2I/Borisov, and 3I/ATLAS

Risk-style labels are sorting aids only. They are not official impact probabilities, Torino Scale values, Palermo Scale values, or hazard assessments.

---

## 3D Stellar Atlas

The Stellar Atlas is a compact bright-star reference layer built around right ascension, declination, distance, apparent magnitude, and spectral-class metadata.

For apparent magnitude (m) and distance (d_{\mathrm{pc}}), absolute magnitude is calculated as:

[
M
=

## m

5
\left[
\log_{10}(d_{\mathrm{pc}})-1
\right]
]

A luminosity proxy is:

[
\frac{L}{L_{\odot}}
===================

10^{(4.83-M)/2.5}
]

For display, stellar distance is compressed logarithmically:

[
r_{\mathrm{scene}}
==================

150\log_{10}(d_{\mathrm{pc}}+1)
]

Coordinates are then represented as:

[
x=r\cos\delta\cos\alpha
]

[
y=r\sin\delta
]

[
z=r\cos\delta\sin\alpha
]

The atlas includes:

* Bright-star positions in a 3D coordinate field
* Spectral colour filtering
* Constellation guide lines
* Distance shells
* Broad temperature, luminosity, and radius proxies
* H–R-style comparison view

It is intended for visual orientation and comparison, not as a complete astrometric catalogue.

---

## Data snapshots and refresh workflow

AstroBis uses static data snapshots so the public deployment remains usable if a third-party API is unavailable, rate-limited, or blocked by browser policy.

During the build process, the project refreshes:

```text
public/data/exoplanets.json
public/data/neo-approaches.json
public/data/iss-tle.json
public/data/small-body-visitors.json
```

The build pipeline is:

```bash
npm run fetch:data
npm run build
```

The `prebuild` script runs `fetch:data` automatically before a production build.

GitHub Actions deploys the site after pushes to `main` and includes a scheduled daily workflow.

---

## Technology

* Astro 4
* React 18
* Three.js
* `@react-three/fiber`
* `@react-three/drei`
* `@react-three/postprocessing`
* Tailwind CSS
* `satellite.js` SGP4/SDP4 propagation
* NASA Exoplanet Archive TAP
* NASA/JPL SBDB Close-Approach Data API
* NASA/JPL SBDB API
* CelesTrak GP/TLE data

---

## Local development

Clone the repository:

```bash
git clone https://github.com/Biswajit1999/AstroBis.git
cd AstroBis
```

Install dependencies:

```bash
npm install
```

Refresh bundled data snapshots:

```bash
npm run fetch:data
```

Start the local development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Deployment

AstroBis is configured for GitHub Pages under:

```text
/AstroBis
```

Astro’s `site` and `base` settings are configured for the project deployment path.

---

## Limits and responsible use

* The Oort Cloud is represented as a modelled outer-Solar-System shell, not a detected image.
* Exoplanet portraits are visual encodings of archive properties, not telescope photographs.
* The exoplanet table is limited to a 4,000-row distance-sorted subset.
* Habitability-style values are exploration proxies, not scientific conclusions.
* ISS coordinates depend on the age and quality of the available GP/TLE element set.
* Close-approach data may change as orbital solutions are refined.
* Diameter estimates depend strongly on the assumed albedo.
* Energy values are simplified scale comparisons, not impact-consequence predictions.
* The Stellar Atlas is an educational reference layer, not a full survey catalogue.

---

## Data sources

* [NASA Exoplanet Archive TAP Service](https://exoplanetarchive.ipac.caltech.edu/docs/TAP/usingTAP.html)
* [NASA/JPL Close-Approach Data API](https://ssd-api.jpl.nasa.gov/doc/cad.html)
* [NASA/JPL Small-Body Database API](https://ssd-api.jpl.nasa.gov/doc/sbdb.html)
* [CelesTrak GP Data Documentation](https://celestrak.org/NORAD/documentation/gp-data-formats.php)
* [NASA Oort Cloud Overview](https://science.nasa.gov/solar-system/oort-cloud/)
* [NASA Astronomy Picture of the Day](https://apod.nasa.gov/)

---

## Author

Created and maintained by **Biswajit Jana**
Independent Researcher — Astrophysics, Instrumentation and Scientific Computing

[Academic portfolio](https://biswajit1999.github.io/Biswajit_Jana.github.io/)

## License

[MIT](LICENSE)
