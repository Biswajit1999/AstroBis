# Reproducibility

## Environment

- Node.js 22.12 or newer (CI uses Node.js 24)
- Dependency versions frozen by `package-lock.json`
- Static Astro build; no server state is required

## Reproduce the checked release

```bash
npm ci
npm run validate
npm audit --audit-level=moderate
```

`npm run validate` executes the scientific unit tests, checks that generated
NEO research files match their committed input, runs Astro diagnostics, and
builds all static routes without fetching new remote data.

## Refresh data intentionally

```bash
npm run refresh:data
npm run validate
```

A refresh changes the evidence base. Review the source query, row count,
chronological coverage, API signature, input SHA-256, numerical summaries, and
rendered figure before committing it. Production builds and deploys consume only
the reviewed snapshots in the source revision; they never refresh evidence.

## Deterministic research products

`scripts/build-neo-sensitivity.mjs` derives JSON, CSV, and SVG products solely
from the committed JPL CAD JSON. The JSON records a canonical-LF SHA-256 so Git
line-ending conversion cannot make identical JSON appear different across
Windows and Linux. Check mode recomputes all three products in memory and fails
if any committed output is stale.
