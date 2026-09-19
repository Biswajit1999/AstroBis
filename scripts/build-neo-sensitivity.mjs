import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { auditCadPayload } from '../src/lib/neo-science.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INPUT = path.join(ROOT, 'public', 'data', 'neo-approaches.json');
const OUTPUT = path.join(ROOT, 'public', 'data', 'neo-sensitivity.json');
const CSV = path.join(ROOT, 'public', 'data', 'neo-albedo-sensitivity.csv');
const FIGURE = path.join(ROOT, 'public', 'assets', 'neo-sensitivity.svg');
const check = process.argv.includes('--check');

const raw = await readFile(INPUT);
const payload = JSON.parse(raw);
const audit = auditCadPayload(payload);
const canonicalInput = Buffer.from(raw.toString('utf8').replace(/\r\n/g, '\n'));
audit.inputSha256 = createHash('sha256').update(canonicalInput).digest('hex');

const json = `${JSON.stringify(audit, null, 2)}\n`;
const csv = [
  'albedo,nominal_close_at_or_above_140m,robust_close_at_or_above_140m',
  ...audit.sizeSensitivity.albedoGrid.map((row) => (
    `${row.albedo},${row.nominalCloseAtOrAbove140m},${row.robustCloseAtOrAbove140m}`
  )),
].join('\n') + '\n';

function bar(value, maximum, x, y, width, color, label) {
  const filled = Math.max(2, (value / maximum) * width);
  return `<g><text x="${x}" y="${y - 8}" class="label">${label}</text><rect x="${x}" y="${y}" width="${width}" height="20" rx="5" class="track"/><rect x="${x}" y="${y}" width="${filled.toFixed(2)}" height="20" rx="5" fill="${color}"/><text x="${x + width + 12}" y="${y + 15}" class="value">${value}</text></g>`;
}

const distance = audit.distanceSensitivity;
const nominalSize = audit.sizeSensitivity.nominalClose;
const robustLarge = (nominalSize['measured-large'] || 0)
  + (nominalSize['inferred-robust-large'] || 0);
const sensitive = nominalSize['albedo-sensitive'] || 0;
const robustSmall = (nominalSize['measured-small'] || 0)
  + (nominalSize['inferred-robust-small'] || 0);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="650" viewBox="0 0 1200 650" role="img" aria-labelledby="title desc">
<title id="title">AstroBis close-approach sensitivity audit</title><desc id="desc">Comparison of nominal versus uncertainty-robust close approaches and size classifications under an albedo sensitivity interval.</desc>
<style>.bg{fill:#050816}.panel{fill:#0e1730;stroke:#263456}.title{fill:#f8fafc;font:700 34px system-ui}.sub{fill:#a9b7d0;font:17px system-ui}.heading{fill:#e2e8f0;font:700 21px system-ui}.label{fill:#cbd5e1;font:15px system-ui}.value{fill:#f8fafc;font:700 16px system-ui}.track{fill:#1d2945}.note{fill:#93a4bf;font:14px system-ui}</style>
<rect width="1200" height="650" class="bg"/><text x="60" y="68" class="title">Close-approach evidence changes when uncertainty is kept visible</text>
<text x="60" y="101" class="sub">Returned JPL CAD prefix: ${audit.coverage.returnedRows.toLocaleString()} of ${audit.coverage.matchingRows.toLocaleString()} matching rows · ${audit.coverage.firstReturnedApproach} to ${audit.coverage.lastReturnedApproach}</text>
<rect x="50" y="135" width="535" height="390" rx="20" class="panel"/><rect x="615" y="135" width="535" height="390" rx="20" class="panel"/>
<text x="80" y="180" class="heading">0.05 AU encounter-distance screen</text>
${bar(distance.nominalClose, distance.nominalClose, 80, 225, 390, '#a78bfa', 'Nominal distance ≤ 0.05 AU')}
${bar(distance.robustClose, distance.nominalClose, 80, 300, 390, '#34d399', '3σ maximum also ≤ 0.05 AU')}
${bar(distance.nominalBoundarySensitive, distance.nominalClose, 80, 375, 390, '#fb7185', 'Nominal-close but interval crosses boundary')}
<text x="80" y="455" class="note">CAD distance is encounter-specific; it is not Earth MOID.</text>
<text x="645" y="180" class="heading">140 m size screen among nominal-close rows</text>
${bar(robustLarge, distance.nominalClose, 645, 225, 390, '#34d399', 'Robust large / measured large')}
${bar(sensitive, distance.nominalClose, 645, 300, 390, '#fbbf24', 'Classification changes across albedo 0.05–0.25')}
${bar(robustSmall, distance.nominalClose, 645, 375, 390, '#60a5fa', 'Robust small / measured small')}
<text x="645" y="455" class="note">H=22 spans ${(audit.sizeSensitivity.h22DiameterKm.albedo025 * 1000).toFixed(0)}–${(audit.sizeSensitivity.h22DiameterKm.albedo005 * 1000).toFixed(0)} m across the declared albedo bracket.</text>
<text x="60" y="575" class="sub">SENSITIVITY / ENCOUNTER SCREEN — NOT A PHA DESIGNATION, IMPACT PROBABILITY, TORINO SCORE, OR HAZARD ASSESSMENT</text>
<text x="60" y="610" class="note">Source: NASA/JPL SBDB Close Approach Data API snapshot · generated deterministically by scripts/build-neo-sensitivity.mjs</text></svg>\n`;

const products = [[OUTPUT, json], [CSV, csv], [FIGURE, svg]];
if (check) {
  for (const [file, expected] of products) {
    const existing = await readFile(file, 'utf8').catch(() => '');
    if (existing !== expected) {
      throw new Error(`${path.relative(ROOT, file)} is stale; run npm run research:neo`);
    }
  }
  console.log('NEO sensitivity products are current');
} else {
  for (const [file, content] of products) await writeFile(file, content, 'utf8');
  console.log(`Wrote ${path.relative(ROOT, OUTPUT)}, ${path.relative(ROOT, CSV)}, and ${path.relative(ROOT, FIGURE)}`);
}
