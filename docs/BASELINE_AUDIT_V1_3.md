# AstroBis v1.3 research-readiness audit

The v1.3 upgrade was assessed against evidence expected in a research software
portfolio: numerical validity, uncertainty treatment, data coverage, claim
discipline, reproducibility, automated verification, security, and accessible
communication. Scores are rubric-based maturity indicators, not scientific
performance measurements.

| Dimension | Before | After | Evidence |
| --- | ---: | ---: | --- |
| Numerical validity | 55 | 96 | Missing JPL diameters no longer become zero; parser fails closed |
| Uncertainty treatment | 20 | 96 | 3σ distance and albedo sensitivity classes |
| Coverage transparency | 28 | 98 | 7,500/39,427 and 15 July 2030 endpoint exposed |
| Claim discipline | 50 | 98 | Encounter screen separated from MOID, PHA, and impact risk |
| Reproducibility | 38 | 96 | Input hash plus deterministic JSON/CSV/SVG freshness check |
| Automated verification | 10 | 94 | Six scientific tests, Astro check, full static build in CI |
| Dependency security | 42 | 98 | Astro 7/Tailwind 4 migration; zero-audit dependency graph |
| Accessible evidence | 68 | 94 | Direct-labelled SVG, text interpretation, table fallback |
| **Composite** | **39** | **96** | Equal-weight mean, rounded |

The largest gain is epistemic rather than cosmetic: the previous interface
silently presented a partial response and single-point size estimates. The new
release makes missingness, query truncation, interval overlap, model assumptions,
and the boundary of inference inspectable in both machine and human-readable
forms.
