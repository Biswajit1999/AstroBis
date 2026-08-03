# AstroBis

## Independent Research Project in Browser-Based Astronomy Visualisation

**Author:** Biswajit Jana
**Role:** Independent Researcher — Astrophysics, Instrumentation and Scientific Computing
**Project date:** 21 June 2026

## Project scope

AstroBis is an independently developed browser-based astronomy environment for exploring Solar System scale, EarthOps world mapping, exoplanet catalogue parameters, satellite motion, close-approach records, interstellar visitors, and bright-star geometry.

The project is not intended to replace specialist packages such as NASA Horizons, mission operations software, full planetarium applications, or peer-reviewed catalogue analysis pipelines. Its purpose is narrower: to make public astronomical data, physical scale, and derived quantities inspectable through a coherent interactive interface.

AstroBis combines Astro static-site delivery, React interfaces, Three.js/WebGL scenes, SVG data views, static JSON snapshots, and browser-side requests to public astronomy services.

The implementation distinguishes three categories of content:

1. **Archive and propagated values** — catalogue parameters, orbital elements, timestamps, and propagated coordinates.
2. **Derived quantities** — unit conversions, ranking values, approximate energy scales, and coordinate transformations.
3. **Scientific visualisations** — compressed scale maps, planet textures, cloud particles, atmospheric effects, and exoplanet representations.

Visual components are not presented as direct observations unless the underlying source supports that interpretation.

---

## Data handling and reproducibility

AstroBis is deployed as a static website. To avoid dependence on a single live request, each main module uses a two-layer approach:

* a build-time JSON snapshot generated from a public source;
* a browser-side refresh attempt when the source permits direct access.

Snapshot files retain fields such as:

[
{\texttt{generatedAt},\ \texttt{source},\ \texttt{query},\ \texttt{count},\ \texttt{data}}
]

If an upstream request fails, the last valid snapshot is retained rather than replacing a working dataset with an empty response. This is important for a public project because browser CORS restrictions, source downtime, and API-rate limits can otherwise make a static deployment unreliable.

For each release, the repository should retain:

* release tag or commit hash;
* UTC snapshot-generation time;
* source endpoint;
* query parameters;
* row count;
* fallback status.

---

## Solar System atlas

The Solar System module presents the Sun, planets, selected dwarf planets, major debris populations, heliopause scale, and an outer-cloud visualisation.

The real Solar System cannot be represented using one linear scale. The ratio between Earth's orbital distance and an outer Oort Cloud distance of (100{,}000\ \mathrm{AU}) is:

[
\frac{100{,}000}{1}=10^5
]

A linear display would make the inner planetary system effectively invisible when the Oort Cloud is included. AstroBis therefore uses compressed scene coordinates.

For close-range viewing, the display coordinate is:

[
s_{\mathrm{inner}}(r)=17\sqrt{r_{\mathrm{AU}}}
\tag{1}
]

For outer-system and Oort-scale viewing, it uses:

[
s_{\log}(r)=38\log_{10}(r_{\mathrm{AU}}+1)
\tag{2}
]

where (s) is a visual scene coordinate rather than a physical distance.

The current scale regions are treated as explanatory bands:

| Region                                 |              Approximate radial interval |
| -------------------------------------- | ---------------------------------------: |
| Kuiper Belt                            |              (30\text{–}50\ \mathrm{AU}) |
| Scattered Disc                         |             (50\text{–}120\ \mathrm{AU}) |
| Heliopause reference region            |                   (\sim120\ \mathrm{AU}) |
| Inner Oort Cloud / Hills Cloud display |   (1{,}000\text{–}20{,}000\ \mathrm{AU}) |
| Outer Oort Cloud display               | (20{,}000\text{–}100{,}000\ \mathrm{AU}) |

The Oort Cloud is represented as a sparse, spherical modelled shell. It is not an observed image or a complete orbital population. Its purpose is to make the scale transition between the planetary system and the distant Solar reservoir visible.

---

## Mars 3D map

The Mars module is a dedicated areography view rather than a decorative planet preview. It combines a locally cached global Mars surface texture, a NASA PDS Mars Global Surveyor MOLA topography layer, and a static same-origin snapshot of major surface features, landing sites, planetary constants, and moon context.

The deployed Mars snapshot is written to:

[
\texttt{public/data/mars-map.json}
]

and includes:

* planetary constants such as radius, gravity, sol length, axial tilt, orbital period, and known moons;
* named feature points such as Olympus Mons, Valles Marineris, Hellas Planitia, Gale Crater, Jezero Crater, Tharsis Montes, Elysium Mons, Nili Fossae, and polar layered deposits;
* landing-site records for Viking, Pathfinder, Spirit, Opportunity, Phoenix, Curiosity, InSight, Perseverance, and Zhurong;
* source records for NASA Mars facts, NASA Mars Trek, NASA PDS MOLA MEGDR, IAU/USGS planetary nomenclature, and public texture-map references.

The 3D scene uses a spherical Mars body with an equirectangular texture, MOLA-derived displacement, MOLA hillshade, labelled surface markers, optional coordinate grid, polar cap visualization, a thin atmospheric haze, and simplified Phobos/Deimos orbit context. Coordinate picking converts the selected texture coordinate into latitude and normalized longitude:

[
\phi_{\mathrm{lat}}=(0.5-v)\times180^\circ
]

[
\lambda_{\mathrm{lon}}=u\times360^\circ-180^\circ
]

where (u,v) are the selected texture coordinates. Feature locations are approximate center points, not landing-ellipse or rover-traverse geometries.

The terrain layer is derived from the PDS MOLA MEGDR median-topography product, whose source grid is 5760 by 2880 samples at 16 pixels per degree. AstroBis resamples that grid into a compact same-origin WebGL heightmap and uses a labelled vertical-exaggeration control so global volcanoes, basins, and canyon systems remain visible at whole-planet scale. This module is still not a rover-scale GIS terrain engine; local HiRISE/CTX patches would be a separate zoomed-surface layer.

### Orbital geometry

For planets and dwarf planets, AstroBis can display eccentric and inclined orbit paths. With semi-major axis (a), eccentricity (e), inclination (i), and display parameter (\theta), the semi-minor axis is:

[
b=a\sqrt{1-e^2}
\tag{3}
]

The in-plane ellipse is drawn as:

[
x=a(\cos\theta-e)
\tag{4}
]

[
z_{\mathrm{flat}}=b\sin\theta
\tag{5}
]

and then rotated by inclination:

[
y=\sin(i),z_{\mathrm{flat}}
\tag{6}
]

[
z=\cos(i),z_{\mathrm{flat}}
\tag{7}
]

These equations define visual orbit geometry. They are not a full time-dependent ephemeris calculation: the display does not solve Kepler’s equation or use an epoch-specific planetary state vector.

### Light-time context

AstroBis uses:

[
1\ \mathrm{AU}=149{,}597{,}870.7\ \mathrm{km}
]

and an approximate one-way light-time relation:

[
t_{\mathrm{light}}[\mathrm{min}]
================================

8.316746 \times r_{\mathrm{AU}}
\tag{8}
]

For example:

[
t_{\mathrm{Earth}}\approx8.3\ \mathrm{min}
]

[
t_{\mathrm{Neptune}}\approx4.2\ \mathrm{hours}
]

[
t_{1000\ \mathrm{AU}}\approx5.8\ \mathrm{days}
]

[
t_{100000\ \mathrm{AU}}\approx1.58\ \mathrm{years}
]

This gives the user a physically meaningful way to understand why an Oort Cloud-scale display requires a different visual mode from the inner planetary system.

---

## Exoplanet explorer

The exoplanet module uses a NASA Exoplanet Archive TAP query against the Planetary Systems Composite Parameters table, `PSCompPars`.

The deployed snapshot uses a high working ceiling:

[
N_{\max}=7000
]

The query selects up to 7,000 planet rows ordered by host-system distance:

[
\mathrm{ORDER\ BY}\ \texttt{sy_dist}\ \mathrm{ASC}
]

This ceiling is above the confirmed-planet count at the time of the current snapshot, so the deployed table can carry the full confirmed working catalogue while retaining a bounded query for static-site reliability. The interface also stores a separate archive count query for headline totals.

The interface includes catalogue values such as:

[
P_{\mathrm{orb}},\quad R_p,\quad M_p,\quad T_{\mathrm{eq}},\quad S,\quad a,\quad e,\quad i,\quad d,\quad T_{\star},\quad R_{\star},\quad M_{\star}
]

where (P_{\mathrm{orb}}) is orbital period, (R_p) is planetary radius, (M_p) is planetary mass, (T_{\mathrm{eq}}) is equilibrium temperature, (S) is incident flux, (a) is semi-major axis, (e) is eccentricity, (i) is inclination, and (d) is host-system distance.

### Planet-class labels

The interface uses radius-based exploratory categories:

| Category     |                     Radius condition |
| ------------ | -----------------------------------: |
| Rocky        |                 (R_p<1.25R_{\oplus}) |
| Super-Earth  | (1.25R_{\oplus}\leq R_p<2R_{\oplus}) |
| Mini-Neptune |    (2R_{\oplus}\leq R_p<4R_{\oplus}) |
| Neptune-like |   (4R_{\oplus}\leq R_p<10R_{\oplus}) |
| Gas giant    |                (R_p\geq10R_{\oplus}) |

These categories are visual and comparative labels. They do not imply a unique atmospheric composition or formation history.

### Stellar luminosity proxy

Where stellar radius and effective temperature are available, AstroBis estimates luminosity relative to the Sun as:

[
\frac{L_{\star}}{L_{\odot}}
===========================

\left(\frac{R_{\star}}{R_{\odot}}\right)^2
\left(\frac{T_{\star}}{5772\ \mathrm{K}}\right)^4
\tag{9}
]

This follows the Stefan–Boltzmann scaling relation.

An Earth-equivalent orbital-distance proxy is then calculated as:

[
a_{\oplus}
==========

\frac{a}{\sqrt{L_{\star}/L_{\odot}}}
\tag{10}
]

The present interface highlights:

[
0.72 \leq a_{\oplus}\leq1.77
\tag{11}
]

as an exploratory “habitable-zone band.” This is not an official habitable-zone classification, because true habitability depends on stellar spectrum, atmospheric composition, albedo, greenhouse processes, planetary mass, rotation, clouds, and many other effects.

### Exploration score

AstroBis includes a comparative exploration score, not a scientific habitability claim:

[
H
=

100
\frac{\sum_i w_i f_i}{\sum_i w_i}
\tag{12}
]

The score combines available quantities:

* radius similarity to (1.05R_{\oplus}), weight (w_R=38);
* equilibrium-temperature similarity to (288\ \mathrm{K}), weight (w_T=40);
* incident-flux similarity when temperature is unavailable, weight (w_S=34);
* orbital-period similarity to (365.25\ \mathrm{days}), weight (w_P=22).

For example, the radius term is:

[
f_R
===

\max
\left[
0,
1-\frac{|R_p-1.05|}{2.2}
\right]
\tag{13}
]

The score should be labelled as an **exploration ranking proxy** throughout the interface.

---

## ISS mission-control view

The ISS module uses CelesTrak General Perturbations orbital-element data for NORAD catalogue number:

[
\mathrm{CATNR}=25544
]

The element set is propagated locally using an SGP4 implementation. The propagated state provides position and velocity vectors:

[
\mathbf{r}=(x,y,z)
]

[
\mathbf{v}=(v_x,v_y,v_z)
]

The instantaneous speed is:

[
v
=

\sqrt{v_x^2+v_y^2+v_z^2}
\tag{14}
]

The orbital radius is approximated by:

[
r_{\mathrm{orb}}
================

R_{\oplus}+h
\tag{15}
]

using:

[
R_{\oplus}=6371\ \mathrm{km}
]

where (h) is altitude above the reference Earth radius.

The TLE age is shown as:

[
\Delta t_{\mathrm{TLE}}
=======================

\frac{t_{\mathrm{now}}-t_{\mathrm{epoch}}}{3600}
\quad[\mathrm{hours}]
\tag{16}
]

This value is essential because TLE-based propagation becomes less representative as the element epoch ages.

The displayed reference values are approximately:

[
i\approx51.64^{\circ}
]

[
P\approx92.9\ \mathrm{min}
]

The globe, cloud layer, atmospheric glow, city lights, and Earth shading are visual context. They do not alter the propagated orbital solution.

AstroBis should describe this module as:

> SGP4 propagation from the latest available GP/TLE element set or bundled snapshot.

It should not use language such as “mission-grade live position” or “real-time operational tracking.”

---

## EarthOps world map

The EarthOps module adds a space-first world map rather than a general geopolitical news map. Its purpose is to bring orbital infrastructure, upcoming launches, public Earth-event feeds, and spaceflight news into a single browser scene.

The module uses a build-time snapshot file:

[
\texttt{public/data/world-ops.json}
]

The snapshot schema includes:

* `generatedAt`, `schemaVersion`, and `sources`;
* `events[]` for Earth events, earthquakes, and public disaster alerts;
* `satellites[]` for selected CelesTrak General Perturbations objects;
* `launches[]` for upcoming launch cards;
* `news[]` for spaceflight-news articles;
* `media[]` for curated official/public video and Earth-imagery source links;
* `totals` for layer and source counts.

### Public feed layers

The present EarthOps snapshot draws from:

* NASA EONET v3 for open natural-event feeds;
* USGS GeoJSON earthquake feeds for recent seismic events;
* GDACS current disaster feeds for public disaster-alert markers;
* CelesTrak GP JSON groups for stations, recent launches, GEO objects, Starlink, OneWeb, and selected debris populations;
* Launch Library 2 for upcoming launch windows and pad metadata;
* Spaceflight News API for spaceflight articles.
* NASA Live, NASA ISS public streams, NASA Worldview/GIBS, and NOAA nowCOAST for official/public media and Earth-imagery entry points.

Browser-side refresh is only attempted for CORS-friendly sources: EONET, USGS, GDACS, and selected CelesTrak groups. Launch and news records remain snapshot based unless a future public CORS policy makes client refresh reliable.

### Earth geometry

Surface markers are converted from geodetic latitude and longitude to a visual sphere using:

[
x=R\cos\phi\cos\lambda
\tag{32}
]

[
y=R\sin\phi
\tag{33}
]

[
z=-R\cos\phi\sin\lambda
\tag{34}
]

where (\phi) is latitude, (\lambda) is longitude, and (R) is the visual Earth radius. This is appropriate for map markers and launch-site pins, but it is not a geodetic Earth ellipsoid model.

The globe is an interpretive 3D visual layer using public Earth texture maps, a separate cloud layer, a night-light layer, atmosphere glow, star background, and a terminator reference. These layers provide spatial context for public event feeds and orbital overlays.

The user can switch between three views:

* a 3D globe for geographic context;
* a 2D operations projection for dense marker inspection;
* an orbital-shell view that de-emphasises Earth and makes satellite/debris structure easier to read.

### Satellite and debris display

EarthOps renders large orbital groups as lightweight point clouds. Objects are placed using catalogue orbital elements and a simplified angular update suitable for visual awareness:

[
M(t)=M_0+n\Delta t
\tag{35}
]

where (M_0) is the mean anomaly in degrees and (n) is mean motion converted to degrees per day. This produces a stable visual approximation for many objects while keeping the page responsive.

Selected high-value operational views, such as the dedicated ISS tracker, use SGP4 propagation from current GP/TLE data. EarthOps should therefore be described as an orbital-awareness layer, not a precision flight-dynamics engine.

### Public media policy

EarthOps does not rebroadcast commercial news channels or unvetted CCTV streams. The media deck is limited to official/public sources and source links such as NASA live programming, ISS video streams, NASA Earthdata Worldview/GIBS, and NOAA nowCOAST. Embedded players are used only where a public embeddable URL is available.

### Launch-site mapping

Launch Library pad locations are normalized with a curated coordinate lookup for common launch sites including Kennedy/Cape Canaveral, Vandenberg, Starbase, Wallops, Baikonur, Kourou, Wenchang, Jiuquan, Taiyuan, Xichang, Tanegashima, Satish Dhawan, Mahia, Plesetsk, Vostochny, and Kodiak.

Where a pad cannot be matched, the launch still appears in the mission timeline but does not receive a mapped globe marker.

---

## Small-body close approaches and interstellar visitors

The small-body module uses JPL close-approach records for Earth encounters between the build date and:

[
31\ \mathrm{December}\ 2050
]

The current snapshot query includes objects with nominal miss distance:

[
d_{\mathrm{AU}}\leq0.3
]

and can return up to:

[
N_{\max}=7500
]

records.

### Distance conversion

AstroBis converts close-approach distance through:

[
d_{\mathrm{km}}
===============

d_{\mathrm{AU}}
\times149{,}597{,}870.7
\tag{17}
]

and lunar distance:

[
d_{\mathrm{LD}}
===============

\frac{d_{\mathrm{km}}}{384{,}400}
\tag{18}
]

where (384{,}400\ \mathrm{km}) is the adopted mean Earth–Moon distance.

### Diameter estimate from absolute magnitude

When JPL does not provide a diameter, AstroBis estimates one from absolute magnitude (H), assuming geometric albedo:

[
p=0.14
]

[
D[\mathrm{km}]
==============

\frac{1329}{\sqrt{p}}
10^{-H/5}
\tag{19}
]

This diameter is an albedo-dependent estimate, not a measurement. Different asteroid surface reflectivities can produce very different diameters for the same absolute magnitude.

### Energy-scale proxy

For a simplified impact-energy comparison, AstroBis assumes spherical geometry and bulk density:

[
\rho=2500\ \mathrm{kg,m^{-3}}
]

[
M
=

\frac{4}{3}\pi R^3\rho
\tag{20}
]

[
E
=

\frac{1}{2}Mv^2
\tag{21}
]

The energy is reported in megatons of TNT using:

[
E_{\mathrm{Mt}}
===============

\frac{E}{4.184\times10^{15}}
\tag{22}
]

This is deliberately not an impact-damage calculation. It omits impact angle, composition, fragmentation, atmospheric entry, terrain, ocean effects, and impact location.

### Risk-proxy label

The interface marks a record with a risk-style proxy when:

[
d_{\mathrm{AU}}\leq0.05
]

and, where available,

[
H\leq22
]

This is a sorting aid only. It is not an impact probability, Torino-scale value, Palermo-scale value, or official hazard assessment.

### Interstellar-visitor channel

The visitor module includes:

* 1I/'Oumuamua;
* 2I/Borisov;
* 3I/ATLAS.

For hyperbolic visitors, the interface estimates asymptotic speed using:

[
v_{\infty}
\approx
\frac{29.7847}{\sqrt{|a_{\mathrm{AU}}|}}
\quad[\mathrm{km,s^{-1}}]
\tag{23}
]

where (a_{\mathrm{AU}}) is the magnitude of the hyperbolic semi-major axis in astronomical units.

A simple constant-speed estimate to the nominal (1000\ \mathrm{AU}) Oort-scale boundary is:

[
t_{1000}
\approx
\frac{(1000-q)\times1\ \mathrm{AU}}{v_{\infty}}
\tag{24}
]

where (q) is perihelion distance in AU.

This quantity should be called a **ballistic outward-travel estimate**, not an ephemeris prediction.

---

## Stellar atlas

The Stellar Atlas is a compact bright-star visual reference, not a complete astrometric catalogue.

For apparent magnitude (m) and distance (d_{\mathrm{pc}}), absolute magnitude is calculated as:

[
M
=

## m

5
\left[
\log_{10}(d_{\mathrm{pc}})-1
\right]
\tag{25}
]

The interface uses spectral-type temperature proxies:

| Spectral class |      Temperature proxy |
| -------------- | ---------------------: |
| O              | (30{,}000\ \mathrm{K}) |
| B              | (15{,}000\ \mathrm{K}) |
| A              |  (9{,}000\ \mathrm{K}) |
| F              |  (7{,}000\ \mathrm{K}) |
| G              |  (5{,}800\ \mathrm{K}) |
| K              |  (4{,}500\ \mathrm{K}) |
| M              |  (3{,}200\ \mathrm{K}) |

These values are broad display approximations, not individual stellar-atmosphere fits.

Luminosity is estimated using:

[
\frac{L}{L_{\odot}}
===================

10^{(4.83-M)/2.5}
\tag{26}
]

and stellar radius is then approximated through:

[
\frac{R}{R_{\odot}}
===================

\frac{\sqrt{L/L_{\odot}}}
{(T/5772)^2}
\tag{27}
]

For spatial display, right ascension (\alpha), declination (\delta), and a compressed distance coordinate are used:

[
r_{\mathrm{scene}}
==================

150\log_{10}(d_{\mathrm{pc}}+1)
\tag{28}
]

[
x=r\cos\delta\cos\alpha
\tag{29}
]

[
y=r\sin\delta
\tag{30}
]

[
z=r\cos\delta\sin\alpha
\tag{31}
]

The logarithmic distance coordinate allows nearby and more distant bright stars to remain visible in one 3D frame. It is not a linearly scaled Galactic map.

Before formal academic use, the project should explicitly document the source catalogue, catalogue version, coordinate epoch, distance convention, and licence for the stellar dataset.

---

## Interpretation limits

AstroBis is strongest when treated as a transparent scientific interface rather than a source of new measurements.

The following limits are explicit:

* Oort Cloud particles are modelled visual markers, not detected bodies.
* Planet renders are visual encodings of archive values, not direct images.
* The exoplanet table uses a bounded TAP query and should be interpreted with the snapshot generation date.
* The exploration score and habitable-zone band are comparative proxies.
* ISS coordinates depend on element age and the available GP/TLE set.
* EarthOps event, disaster, launch, and news records are public feed snapshots, not official emergency-management or mission-status products.
* Small-body diameter estimates depend on assumed albedo.
* Impact-energy values are scale comparisons, not consequence assessments.
* Visitor outward-travel values are simplified constant-speed estimates.
* The Stellar Atlas is a compact educational reference layer, not a full astrometric survey.

---

## Data and method record

AstroBis currently draws on the following public scientific services and software layers:

* NASA Exoplanet Archive TAP service and `PSCompPars` table;
* NASA/JPL Small-Body Database Close-Approach Data API;
* NASA/JPL Small-Body Database orbital data;
* CelesTrak GP/TLE data for the ISS;
* CelesTrak GP JSON groups for EarthOps satellite and debris samples;
* NASA EONET v3, USGS GeoJSON, and GDACS current disaster feeds for EarthOps public event layers;
* Launch Library 2 and Spaceflight News API for mission timeline context;
* NASA Live, NASA Worldview/GIBS, and NOAA nowCOAST for public media and Earth-imagery context;
* SGP4 propagation through `satellite.js`;
* NASA Solar System science material for Oort Cloud scale context.

AstroBis is developed independently as a public scientific-computing and visualisation project. Its value lies in bringing traceable data, explicit assumptions, physical scale, and transparent limitations into one accessible browser environment.
