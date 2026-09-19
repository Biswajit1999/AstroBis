# Changelog

## 1.3.1 — 2026-09-19

- Make production builds and GitHub Pages deployments consume only reviewed,
  committed evidence snapshots.
- Move remote refreshes behind the explicit `npm run refresh:data` command so a
  deploy cannot silently publish statistics that differ from its source revision.
- Pin the Pages action to `npm run build:site` as a defence-in-depth release gate.

## 1.3.0 — 2026-09-19

- Add a deterministic JPL close-approach uncertainty and albedo sensitivity audit.
- Fix null/blank numeric values being coerced to zero in NEO and data-quality views.
- Expose query truncation and the actual chronological endpoint in the interface.
- Add machine JSON, CSV, accessible SVG, methods, limitations, and reproducibility evidence.
- Add six scientific unit tests and CI release validation.
- Upgrade Astro 4 to 7, Tailwind CSS 3 to 4, Axios, Vite, and related tooling.
- Reduce the locked dependency audit from 15 vulnerabilities to zero.

## 1.2.0

- Publish the AstroBis technical project report.
