# AstroBis Ecosystem Report

**Author:** Biswajit Jana  
**Live site:** https://biswajit1999.github.io/AstroBis/  
**Repository:** https://github.com/Biswajit1999/AstroBis  
**Report date:** 21 June 2026

## Executive Summary

AstroBis is a browser-native astronomy dashboard designed to make Solar System scale, exoplanet catalogues, orbital tracking, near-Earth object monitoring, and stellar reference data visible in one coherent interface. The project combines an Astro static site, React interfaces, Three.js/WebGL scenes, SVG analytics, and public scientific data sources from NASA, JPL, CelesTrak, and related astronomy services.

The goal is not to clone a planetarium package. AstroBis is built as an animated research console: the Solar System is navigable as a compressed 3D scale model, the ISS is propagated from public TLE data, exoplanets are explored through quantitative archive fields, and small-body risk/visitor channels are separated from ordinary visual storytelling.

This public report intentionally describes the scientific basis, interface design, and data provenance at a high level. It does not disclose private prompts, unpublished working artifacts, or internal production notes.

## Project Philosophy

AstroBis follows four design principles:

1. **Measured data first.** Whenever possible, interface labels, orbital values, counts, distances, and source links come from traceable public data sources.
2. **Visual interpretation is labelled.** Exoplanet portraits and distant cloud particles are scientific visualizations or artist-model representations, not direct photographs.
3. **Scale must be navigable.** The Solar System spans too many orders of magnitude for one linear display, so the app uses logarithmic and focused scale modes.
4. **Each page should work as a small scientific instrument.** The interface is not only decorative; every page offers filters, plots, controls, or telemetry.

## Solar System Atlas

The Solar System scene presents the Sun, eight planets, officially recognized dwarf planets, major debris regions, and boundary zones using a compressed astronomical-unit scale. The scene includes:

- Eccentric and inclined orbit rendering.
- Planet and dwarf-planet information panels.
- Moon counts and selected physical values.
- Asteroid belt, Jupiter trojan, Kuiper belt, scattered disk, heliopause, inner Oort Cloud, and outer Oort Cloud regions.
- Camera presets for inner planets, giant planets, Kuiper belt, heliopause, and Oort Cloud scale.
- An astronomical-unit ruler with light-time context.

### Oort Cloud Treatment

NASA describes the Oort Cloud as a giant spherical shell surrounding the Sun, planets, and Kuiper Belt objects. NASA also notes that the Oort Cloud has not been directly imaged because of its great distance. The AstroBis visualization therefore treats it as a sparse modeled shell rather than a literal observed photograph.

The scale used in the app follows NASA's public estimate that the main Oort Cloud may begin around **1,000 AU** and extend to roughly **100,000 AU** from the Sun. This creates a necessary user-interface challenge: from inside the planetary system the Oort Cloud should not look like a nearby ring. It only becomes readable after zooming out by orders of magnitude.

Key reference:  
https://science.nasa.gov/resource/oort-cloud-and-scale-of-the-solar-system-infographic/  
https://science.nasa.gov/solar-system/oort-cloud/

## Exoplanet Archive

The exoplanet page uses NASA Exoplanet Archive composite parameters through the TAP service. AstroBis stores a same-origin build snapshot for reliability and attempts browser-side refresh where possible.

The interface includes:

- Approximately 4,000 loaded catalogue rows when the archive query succeeds.
- Search by planet or host star.
- Filters by planet class, discovery method, and temperature band.
- Sorting by habitability proxy, distance, radius, discovery year, period, completeness, or name.
- Mission/facility grouping for Kepler, K2, TESS, ground transit surveys, radial velocity, microlensing, and imaging channels.
- Discovery timeline and distribution plots.
- Radius-temperature and orbit-radius scatter views.

The habitability and stellar-luminosity values are proxies intended for exploration, not official classifications. They are useful for comparing candidates but should not be treated as claims of habitability.

Key reference:  
https://exoplanetarchive.ipac.caltech.edu/docs/TAP/usingTAP.html

## ISS Mission Control

The ISS page tracks the International Space Station using CelesTrak GP/TLE data and local SGP4 propagation through `satellite.js`. The globe renders a textured Earth with normal, specular, cloud, atmospheric, and night-side city-light layers. Telemetry includes:

- Latitude and longitude.
- Altitude and velocity.
- Orbital radius.
- Inclination and approximate orbital period.
- Visibility state.
- Subsolar point.
- TLE epoch age.

The scene separates measured propagation from visualization. TLE-based propagation is accurate enough for public educational tracking, but precision depends on TLE freshness and is not a replacement for mission operations software.

Key references:  
https://celestrak.org/NORAD/documentation/gp-data-formats.php  
https://github.com/shashwatak/satellite-js

## Small-Body And Visitor Watch

The small-body page uses JPL's SBDB Close-Approach Data API for Earth close approaches through 2050. It also includes a separate visitor channel for known interstellar/hyperbolic objects from the JPL SBDB API.

The close-approach dashboard includes:

- Miss distance in kilometers, AU, and lunar distances.
- Relative speed.
- Diameter estimate or measured diameter where available.
- Absolute magnitude.
- Energy-scale proxy.
- Risk-proxy and large-object filters.
- Timeline and approach radar views.

The visitor channel includes:

- 1I/'Oumuamua.
- 2I/Borisov.
- 3I/ATLAS.
- Hyperbolic eccentricity, perihelion distance, inclination, estimated hyperbolic excess speed, perihelion date, and approximate time to the 1,000 AU Oort boundary.

Risk labels are prioritization aids only. They are not official impact probabilities.

Key references:  
https://ssd-api.jpl.nasa.gov/doc/cad.html  
https://ssd-api.jpl.nasa.gov/doc/sbdb.html  
https://science.nasa.gov/solar-system/comets/3i-atlas/3i-atlas-facts-and-faqs/

## Stellar Atlas

The Stellar Atlas renders bright stars using right ascension, declination, distance, magnitude, and spectral-class metadata in a 3D coordinate field. The page includes constellation guide lines, distance shells, spectral filtering, and physical proxies for temperature, luminosity, and radius.

The stellar chart is a compact educational layer rather than a full astrometric catalogue. It is designed for visual orientation and comparison.

## Data Refresh Strategy

AstroBis is a static GitHub Pages site, so its data strategy combines two layers:

1. **Build-time snapshots** refresh public JSON files during site builds and scheduled workflows.
2. **Browser-side refresh attempts** allow pages to request live data directly when browser CORS and service availability permit.

This gives the site a reliable fallback while keeping data fresher than a purely hardcoded demo.

## User Interface Strategy

AstroBis uses a restrained dark astronomy-console style: dense enough for repeated use, but still visually immersive. The interface prioritizes:

- Stable controls with clear labels.
- Scientific units next to values.
- Separating data panels from 3D scenes.
- Responsive behavior for mobile and desktop.
- Avoiding marketing-page structure in tool pages.

## Known Limitations

- The Oort Cloud is theoretical and not directly imaged; AstroBis renders a scientifically motivated projection.
- Exoplanet portraits are generated visual encodings of catalogue values, not telescope photographs.
- TLE propagation accuracy depends on current orbital elements.
- JPL close-approach and SBDB values can update as new observations refine orbits.
- Some public APIs may be unavailable or blocked by browser CORS, so local snapshots are kept.

## Source Register

- NASA Oort Cloud overview: https://science.nasa.gov/solar-system/oort-cloud/
- NASA Oort Cloud scale infographic: https://science.nasa.gov/resource/oort-cloud-and-scale-of-the-solar-system-infographic/
- NASA Exoplanet Archive TAP: https://exoplanetarchive.ipac.caltech.edu/docs/TAP/usingTAP.html
- JPL Close-Approach Data API: https://ssd-api.jpl.nasa.gov/doc/cad.html
- JPL Small-Body Database API: https://ssd-api.jpl.nasa.gov/doc/sbdb.html
- JPL Horizons API: https://ssd-api.jpl.nasa.gov/doc/horizons.html
- CelesTrak GP/TLE documentation: https://celestrak.org/NORAD/documentation/gp-data-formats.php
- NASA 3I/ATLAS facts: https://science.nasa.gov/solar-system/comets/3i-atlas/3i-atlas-facts-and-faqs/
- IAU/MPC 2026 satellite update: https://www.iau.org/IAU/IAU/News/Ann2026/MPC-New-Moons-Saturn-Jupiter.aspx
