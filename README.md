![AstroBis astronomy dashboard banner](assets/astrobis-banner.png)

# AstroBis

> Independent research project in browser-based astronomy visualisation.

[Live site](https://biswajit1999.github.io/AstroBis/) · [Technical project report](docs/AstroBis-Ecosystem-Report.md) · [Repository](https://github.com/Biswajit1999/AstroBis)

AstroBis is an independently developed browser-native astronomy platform by **Biswajit Jana**. It combines Solar System scale, exoplanet catalogue data, ISS orbital propagation, small-body close approaches, interstellar visitors, stellar reference data, and NASA's Astronomy Picture of the Day in one interactive interface.

The project is designed for exploration, comparison, and scientific communication. It is not mission-operations software, an impact-prediction system, or a replacement for specialist astronomy packages.

---

## Modules

| Module              | Purpose                                                                                   | Data source or method               |
| ------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------- |
| Solar System Atlas  | Explore planets, dwarf planets, debris regions, heliopause context, and Oort Cloud shells | Compressed AU-scale visual geometry |
| Exoplanet Explorer  | Search, filter, compare, and plot planetary-system parameters                             | NASA Exoplanet Archive `PSCompPars` |
| ISS Mission Control | Propagate ISS position, telemetry, and ground track                                       | CelesTrak GP/TLE + SGP4             |
| Small-Body Watch    | Browse Earth close approaches and selected interstellar visitors                          | NASA/JPL CAD and SBDB APIs          |
| 3D Stellar Atlas    | Visualise bright stars using coordinate and spectral metadata                             | RA/Dec-based reference field        |
| NASA APOD           | Display NASA's Astronomy Picture of the Day                                               | NASA APOD service                   |

---

## Scientific approach

AstroBis separates three kinds of information:

1. **Source values** — catalogue fields, orbital elements, timestamps, and archived parameters.
2. **Derived quantities** — unit conversions, coordinate transformations, approximate size estimates, and comparison metrics.
3. **Illustrative layers** — planet textures, Oort Cloud particles, atmosphere effects, cloud layers, city lights, and exoplanet visualisations.

Illustrative components are not presented as direct observations unless stated otherwise.

---

## Solar System Atlas

The Solar System Atlas includes:

* Sun, eight planets, selected dwarf planets, and moon counts
* Asteroid Belt and Jupiter Trojan context
* Kuiper Belt and scattered-disc regions
* Heliopause reference region
* Inner and outer Oort Cloud shells
* Camera presets from inner planets to Oort-scale viewing
* Astronomical-unit ruler and light-time context
* Inclined and eccentric orbit visualisations

The Solar System spans more than five orders of magnitude between Earth's orbit and an outer Oort Cloud scale:

```math
\frac{100{,}000\ \mathrm{AU}}{1\ \mathrm{AU}} = 10^5
```

A single linear display would make the inner planetary system unreadable at Oort Cloud scale. AstroBis therefore uses compressed and focused visual views rather than claiming one physical scale across the entire scene.

Approximate one-way light time is:

```math
t_{\mathrm{light}}[\mathrm{min}]
=
8.316746 \times r_{\mathrm{AU}}
```

| Distance from the Sun | Approximate one-way light time |
| --------------------: | -----------------------------: |
|                  1 AU |                        8.3 min |
|                 30 AU |                          4.2 h |
|              1,000 AU |                       5.8 days |
|            100,000 AU |                     1.58 years |

The Oort Cloud is displayed as a sparse, scientifically motivated shell. It is not a direct image or complete catalogue of observed distant objects.

---

## Exoplanet Explorer

AstroBis uses a build-time NASA Exoplanet Archive TAP query against the `PSCompPars` table.

The deployed dataset is intentionally limited to:

```math
N_{\max}=4000
```

planet rows, ordered by host-system distance.

```sql
SELECT TOP 4000
  pl_name,
  hostname,
  discoverymethod,
  disc_facility,
  disc_year,
  pl_orbper,
  pl_rade,
  pl_bmasse,
  pl_eqt,
  pl_insol,
  pl_orbsmax,
  pl_orbeccen,
  pl_orbincl,
  sy_dist,
  st_teff,
  st_rad,
  st_mass,
  st_spectype
FROM pscomppars
WHERE pl_name IS NOT NULL
  AND hostname IS NOT NULL
ORDER BY sy_dist ASC
```

This makes AstroBis a nearby-system-oriented exploration interface rather than a complete or statistically unbiased census of confirmed exoplanets.

The module includes:

* Planet and host-star search
* Discovery-method and facility filters
* Radius, mass, temperature, orbital-period, and distance comparisons
* Mission and observatory grouping
* Discovery timeline and distribution plots
* Radius-temperature and orbit-radius scatter plots
* Archive source links
* Luminosity-derived orbital comparison proxies

A stellar-luminosity scaling relation is:

```math
\frac{L_{\star}}{L_{\odot}}
=
\left(
\frac{R_{\star}}{R_{\odot}}
\right)^2
\left(
\frac{T_{\star}}{5772\ \mathrm{K}}
\right)^4
```

An Earth-equivalent orbital-distance comparison is:

```math
a_{\oplus}
=
\frac{a}
{\sqrt{L_{\star}/L_{\odot}}}
```

These are comparison tools only. They do not constitute atmospheric characterisation or a claim that a planet is habitable.

---

## ISS Mission Control

The ISS module uses CelesTrak GP/TLE data for:

```math
\mathrm{NORAD\ Catalogue\ Number}=25544
```

Orbital propagation is performed locally using `satellite.js` and the SGP4 model.

The propagated position and velocity states are represented by:

```math
\mathbf{r}=(x,y,z)
```

```math
\mathbf{v}=(v_x,v_y,v_z)
```

The instantaneous velocity magnitude is:

```math
v=
\sqrt{v_x^2+v_y^2+v_z^2}
```

The module includes:

* Latitude and longitude
* Altitude and orbital velocity
* Orbital radius
* Inclination and approximate orbital period
* Ground-track projection
* Subsolar point
* Day/night context
* TLE epoch and age display
* Textured Earth, cloud layer, night-light map, and atmosphere effects

The rendered Earth layers are visual context only. AstroBis should not be used for safety-critical navigation, mission planning, or operational tracking.

---

## Small-Body Watch

The close-approach dataset covers Earth encounters from the build date through:

```math
31\ \mathrm{December}\ 2050
```

The current query applies:

```math
d_{\mathrm{AU}} \leq 0.3
```

with a maximum API return limit of:

```math
N_{\max}=7500
```

The interface displays miss distance in astronomical units, kilometres, and lunar distances.

```math
d_{\mathrm{km}}
=
d_{\mathrm{AU}}
\times
149{,}597{,}870.7
```

```math
d_{\mathrm{LD}}
=
\frac{d_{\mathrm{km}}}{384{,}400}
```

where $d_{\mathrm{LD}}$ is the approximate lunar-distance equivalent.

When an asteroid diameter is unavailable, a simplified albedo-dependent estimate may be used:

```math
D[\mathrm{km}]
=
\frac{1329}{\sqrt{p}}
10^{-H/5}
```

where:

* $D$ is estimated diameter in kilometres
* $H$ is absolute magnitude
* $p$ is assumed geometric albedo

The module includes:

* Close-approach date and nominal miss distance
* Relative velocity
* Diameter values or approximate size estimates
* Absolute magnitude
* Simplified energy-scale comparison
* Timeline and radar-style approach views
* Risk-style filtering
* Interstellar visitor records for 1I/'Oumuamua, 2I/Borisov, and 3I/ATLAS

Risk-style labels are prioritisation filters only. They are not official impact probabilities, Torino Scale values, Palermo Scale values, or hazard assessments.

---

## 3D Stellar Atlas

The Stellar Atlas is a compact bright-star reference environment built around right ascension, declination, distance, apparent magnitude, and spectral-class metadata.

The module includes:

* Bright-star positions in a 3D coordinate field
* Spectral colour filtering
* Constellation guide lines
* Distance shells
* Temperature, luminosity, and radius proxies
* H-R-style comparison view

For apparent magnitude $m$ and distance $d_{\mathrm{pc}}$ in parsecs, absolute magnitude is:

```math
M
=
m
-
5
\left[
\log_{10}(d_{\mathrm{pc}})-1
\right]
```

A luminosity comparison is:

```math
\frac{L}{L_{\odot}}
=
10^{(4.83-M)/2.5}
```

For visual readability, distant stars are shown using a compressed radial scale:

```math
r_{\mathrm{scene}}
=
150\log_{10}(d_{\mathrm{pc}}+1)
```

The Stellar Atlas is designed for orientation and comparison. It is not intended as a complete astrometric catalogue or precision stellar-parameter database.

---

## Data snapshots

AstroBis uses static JSON snapshots so that the site remains usable when a third-party API is unavailable, rate-limited, or blocked by browser policy.

The data-fetch script writes to:

```text
public/data/
```

Current snapshot outputs include:

```text
public/data/exoplanets.json
public/data/neo-approaches.json
public/data/iss-tle.json
public/data/small-body-visitors.json
```

If an upstream request fails, the build script retains an existing valid snapshot where possible rather than replacing it with an empty dataset.

---

## Technology

* Astro 4
* React 18
* Three.js
* `@react-three/fiber`
* `@react-three/drei`
* `@react-three/postprocessing`
* Tailwind CSS
* `satellite.js`
* NASA Exoplanet Archive TAP
* NASA/JPL Small-Body Database APIs
* CelesTrak GP/TLE data
* GitHub Pages deployment

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

Refresh local data snapshots:

```bash
npm run fetch:data
```

Run the development server:

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

`npm run build` automatically runs the data-refresh script through the project's `prebuild` command.

---

## Deployment

AstroBis is configured as a static Astro site for GitHub Pages:

```text
Site: https://biswajit1999.github.io
Base path: /AstroBis
```

The deployment workflow runs on:

* Pushes to `main`
* Manual workflow dispatch
* Scheduled daily refreshes

---

## Limits and responsible use

* The Oort Cloud is a modelled visual shell, not a detected image.
* Exoplanet portraits are visual encodings, not telescope photographs.
* The exoplanet interface uses a 4,000-row, distance-sorted working subset.
* Exoplanet comparison metrics are exploratory proxies, not habitability conclusions.
* ISS positions depend on the available GP/TLE element set and its epoch.
* Small-body orbital solutions can change as new observations refine trajectories.
* Diameter estimates depend strongly on assumed albedo.
* Energy values are simplified scale comparisons, not impact-consequence predictions.
* The Stellar Atlas is a compact reference layer, not a full survey catalogue.
* Public APIs may be unavailable during local builds or browser requests; static snapshots provide fallback access.

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

---

## License

MIT — see [LICENSE](LICENSE).
