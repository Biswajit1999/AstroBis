# NEO encounter-sensitivity audit

Version 1.3.0 turns the Small-Body Watch from a point-estimate display into a
coverage- and uncertainty-explicit research product. The analysis is a
**sensitivity / encounter screen, not an impact probability**.

## Question

How much do the JPL CAD 3σ close-approach distance interval and the unknown
visual geometric albedo change an apparent 0.05 AU / 140 m screen?

This deliberately does not reproduce the formal potentially hazardous asteroid
(PHA) definition. The CAD `dist` field describes one encounter; it is not the
object's Earth minimum orbit intersection distance (MOID).

## Data contract

- Input: `public/data/neo-approaches.json`
- Source: NASA/JPL SBDB Close Approach Data API, signature version 1.5
- Query: Earth encounters from 2026-08-13 through 2050-12-31, `dist-max=0.3`,
  date sorted, `limit=7500`, full names and diameters requested
- Input SHA-256: `0a9deda5fe250c6335992578bb02a55781a5464925caf5120e268cc2afe6e1b3`
- Returned: 7,500 of 39,471 matching rows (19.0%)
- Returned chronological coverage: 2026-Aug-13 through 2030-Jul-10

The parser requires the fields used by the calculation and checks the API
signature. A schema change fails closed. Missing and blank numeric values remain
missing; they are not coerced to zero.

## Method

For an object without a measured diameter, diameter is estimated from absolute
magnitude `H` and assumed geometric albedo `pV`:

`D(km) = 1329 / sqrt(pV) × 10^(-H/5)`

The reference display uses `pV=0.14`. Classification sensitivity is evaluated
over the declared bracket `pV=0.05–0.25`; this bracket is not an object-level
posterior. Measured diameters are never replaced by the H–albedo estimate.

Distance classes use the JPL fields as follows:

- robust close: `dist_max ≤ 0.05 AU`
- robust outside: `dist_min > 0.05 AU`
- boundary-sensitive: the 3σ interval crosses 0.05 AU

Size classes relative to 0.14 km are measured-large, measured-small,
inferred-robust-large, inferred-robust-small, albedo-sensitive, or unknown.

## Results

| Quantity | Result |
| --- | ---: |
| Measured diameters | 233 / 7,500 (3.1%) |
| H-derived diameter intervals | 7,265 |
| Unknown size | 2 |
| Nominal distance ≤0.05 AU | 590 |
| Robust close at reported 3σ maximum | 397 |
| Nominal-close but boundary-sensitive | 193 |
| Nominal-outside but could cross boundary | 327 |
| All distance-boundary-sensitive rows | 520 |

Among the 590 nominal-close rows, 60 are robustly at least 140 m, 64 change
class across the declared albedo bracket, and 466 are robustly smaller. For
`H=22`, inferred diameter ranges from 105.8 m at `pV=0.25` to 236.6 m at
`pV=0.05`; the reference `pV=0.14` result is 141.4 m.

The nominal-close count at or above 140 m changes from 124 to 60 across the
albedo grid. Requiring the reported 3σ maximum distance to remain within
0.05 AU changes that range to 111–58.

## Outputs

- `public/data/neo-sensitivity.json`: full machine-readable audit
- `public/data/neo-albedo-sensitivity.csv`: compact albedo grid
- `public/assets/neo-sensitivity.svg`: accessible, direct-labelled figure
- `/neo/`: rendered evidence panel and data table

Regenerate with `npm run research:neo`; verify byte-current outputs with
`npm run check:research`.

## Claim boundary

The screen is not a PHA designation, impact probability, Torino score, or
hazard assessment. It does not propagate orbital covariance or infer an impact
trajectory. A row-limited response supports claims only about its returned,
date-sorted prefix. Results will change when the upstream catalogue or query
snapshot changes.

## Primary sources

- [JPL SBDB Close Approach Data API documentation](https://ssd-api.jpl.nasa.gov/doc/cad.html)
- [NASA CNEOS NEO and PHA definitions](https://cneos.jpl.nasa.gov/about/neo_groups.html)
- [Mainzer et al. (2011), NEOWISE diameters and albedos](https://doi.org/10.1088/0004-637X/741/2/68)
- [NASA NTRS asteroid diameter–albedo relation](https://ntrs.nasa.gov/citations/20170003913)
