# Limitations and responsible interpretation

- The committed JPL CAD query is capped at 7,500 of 39,427 matching rows. Because
  it is date sorted, it covers a chronological prefix ending on 15 July 2030, not
  every requested encounter through 2050.
- JPL CAD distance limits are reported three-sigma close-approach bounds. This
  audit classifies interval overlap; it does not perform orbital covariance
  propagation.
- Encounter distance is not Earth MOID. The 0.05 AU screen therefore must not be
  labelled as an official PHA classification.
- Only 3.1% of returned rows have measured diameters. Most displayed sizes use
  the H–albedo relation and a declared 0.05–0.25 albedo sensitivity bracket.
- The albedo bracket is a scenario range, not a population prior or posterior
  for any object.
- No result is an impact probability, Torino score, hazard assessment, or advice
  for operational decision-making. Follow NASA/JPL CNEOS for official analysis.
- Remote catalogues evolve. The versioned release describes the committed input
  hash, not an immutable statement about future orbital solutions.
- Other AstroBis modules are exploratory visualisations with module-specific
  approximations. Their rendered geometry should not be treated as precision
  astrometry, cartography, or mission operations software.
