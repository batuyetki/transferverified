/* ============================================================================
   TransferVerified — the Chance Me model, server-side. Work Order 06, Task 3.

   Everything here used to ship to the browser (WO4 Task 3); it now runs only
   inside the chance-me function so the UI's lock is backed by a real gate.
   The formula itself is still published in full on the Methodology page —
   server-side computation prevents casual bypass; it is not secrecy.

   REFERENCE_GPA carries the same rules it always has:
   1. Never merged into, or written onto, a school record.
   2. Never shown with a per-school "verified from the filing" treatment and
      never carrying a sourceUrl claim — there is no per-school filing behind it.
   3. Always labelled as a reference band for undergraduate admission overall,
      compiled from public CDS and institutional sources.

   SCHOOL_FACTS is a server-side extract of the TT_DATA fields the gates and
   the base rate need (regenerated from public/index.html's TT_DATA; keep in
   sync when the dataset is refreshed). The client still renders school names,
   rates, and source links from its own copy — these values are not new, they
   are the sourced facts the arithmetic starts from.
   ============================================================================ */

export const REFERENCE_GPA = [
  { slug: 'harvard-university',                    name: 'Harvard University',         low: 3.90, high: 4.00 },
  { slug: 'massachusetts-institute-of-technology', name: 'MIT',                        low: 3.90, high: 4.00 },
  { slug: 'stanford-university',                   name: 'Stanford University',        low: 3.88, high: 3.99 },
  { slug: 'yale-university',                       name: 'Yale University',            low: 3.86, high: 3.97 },
  { slug: 'princeton-university',                  name: 'Princeton University',       low: 3.87, high: 3.98 },
  { slug: 'columbia-university',                   name: 'Columbia University',        low: 3.86, high: 3.97 },
  { slug: 'university-of-chicago',                 name: 'University of Chicago',      low: 3.85, high: 3.99 },
  { slug: 'university-of-pennsylvania',            name: 'University of Pennsylvania', low: 3.85, high: 3.97 },
  { slug: 'duke-university',                       name: 'Duke University',            low: 3.85, high: 3.97 },
  { slug: 'northwestern-university',               name: 'Northwestern University',    low: 3.84, high: 3.97 },
  { slug: 'johns-hopkins-university',              name: 'Johns Hopkins University',   low: 3.82, high: 3.95 },
  { slug: 'dartmouth-college',                     name: 'Dartmouth College',          low: 3.82, high: 3.95 },
  { slug: 'brown-university',                      name: 'Brown University',           low: 3.80, high: 3.95 },
  { slug: 'vanderbilt-university',                 name: 'Vanderbilt University',      low: 3.80, high: 3.95 },
  { slug: 'cornell-university',                    name: 'Cornell University',         low: 3.80, high: 3.93 },
  { slug: 'rice-university',                       name: 'Rice University',            low: 3.79, high: 3.93 },
  { slug: 'university-of-notre-dame',              name: 'University of Notre Dame',   low: 3.82, high: 3.96 },
  { slug: 'university-of-california-los-angeles',  name: 'UCLA',                       low: 3.75, high: 4.00 },
  { slug: 'university-of-california-berkeley',     name: 'UC Berkeley',                low: 3.75, high: 4.00 },
  { slug: 'georgetown-university',                 name: 'Georgetown University',      low: 3.75, high: 3.95 },
  { slug: 'carnegie-mellon-university',            name: 'Carnegie Mellon University', low: 3.78, high: 3.93 },
  { slug: 'emory-university',                      name: 'Emory University',           low: 3.75, high: 3.90 },
  { slug: 'university-of-michigan-ann-arbor',      name: 'University of Michigan',     low: 3.75, high: 3.99 },
  { slug: 'university-of-virginia',                name: 'University of Virginia',     low: 3.78, high: 3.94 },
  { slug: 'wake-forest-university',                name: 'Wake Forest University',     low: 3.70, high: 3.90 },
  { slug: 'tufts-university',                      name: 'Tufts University',           low: 3.69, high: 3.88 },
  { slug: 'new-york-university',                   name: 'New York University',        low: 3.70, high: 3.87 },
  { slug: 'boston-university',                     name: 'Boston University',          low: 3.68, high: 3.85 },
  { slug: 'tulane-university',                     name: 'Tulane University',          low: 3.65, high: 3.85 },
  { slug: 'purdue-university',                     name: 'Purdue University',          low: 3.60, high: 3.80 }
];

/* Sourced facts per school: the base rate the arithmetic starts from and the
   published rules the gates check. Extracted from TT_DATA 2026-07-18. */
export const SCHOOL_FACTS = {
  'harvard-university': { name: 'Harvard University', rate: 0.0064, minCredits: '4', minGpa: '', creditCap: '16', creditCapUnit: 'units' },
  'massachusetts-institute-of-technology': { name: 'Massachusetts Institute of Technology', rate: 0.0238, minCredits: '', minGpa: '', creditCap: '2 yrs', creditCapUnit: 'in residence' },
  'stanford-university': { name: 'Stanford University', rate: 0.0225, minCredits: '', minGpa: '', creditCap: '90', creditCapUnit: 'quarter' },
  'yale-university': { name: 'Yale University', rate: 0.0258, minCredits: '', minGpa: '', creditCap: '18', creditCapUnit: 'units' },
  'princeton-university': { name: 'Princeton University', rate: 0.0185, minCredits: '', minGpa: '', creditCap: '2 yrs of credit', creditCapUnit: '' },
  'columbia-university': { name: 'Columbia University', rate: 0.0897, minCredits: '24', minGpa: '', creditCap: '64', creditCapUnit: 'semester' },
  'university-of-chicago': { name: 'University of Chicago', rate: 0.0929, minCredits: '', minGpa: '', creditCap: '2 yrs (6 qtrs)', creditCapUnit: 'in residence' },
  'university-of-pennsylvania': { name: 'University of Pennsylvania', rate: 0.0321, minCredits: '', minGpa: '', creditCap: 'half of courses', creditCapUnit: 'in residence' },
  'duke-university': { name: 'Duke University', rate: 0.0403, minCredits: '', minGpa: '', creditCap: '2 yrs of coursework', creditCapUnit: '' },
  'northwestern-university': { name: 'Northwestern University', rate: 0.1197, minCredits: '24', minGpa: '', creditCap: '6 quarters', creditCapUnit: 'in residence' },
  'johns-hopkins-university': { name: 'Johns Hopkins University', rate: 0.0482, minCredits: '12', minGpa: '', creditCap: '60', creditCapUnit: 'semester' },
  'dartmouth-college': { name: 'Dartmouth College', rate: 0.0987, minCredits: '', minGpa: '', creditCap: '17', creditCapUnit: 'credits' },
  'brown-university': { name: 'Brown University', rate: 0.0466, minCredits: '7', minGpa: '', creditCap: '15', creditCapUnit: 'courses' },
  'vanderbilt-university': { name: 'Vanderbilt University', rate: 0.2616, minCredits: '', minGpa: '', creditCap: 'final 60', creditCapUnit: 'in residence' },
  'cornell-university': { name: 'Cornell University', rate: 0.1171, minCredits: '', minGpa: '', creditCap: '60', creditCapUnit: 'semester' },
  'rice-university': { name: 'Rice University', rate: 0.0746, minCredits: '12', minGpa: '', creditCap: '60', creditCapUnit: 'in residence' },
  'university-of-notre-dame': { name: 'University of Notre Dame', rate: 0.17, minCredits: '24', minGpa: '', creditCap: 'final 60', creditCapUnit: 'in residence' },
  'university-of-california-los-angeles': { name: 'University of California Los Angeles', rate: 0.234, minCredits: '76', minGpa: '', creditCap: '70', creditCapUnit: 'semester' },
  'university-of-california-berkeley': { name: 'University of California Berkeley', rate: 0.2418, minCredits: '', minGpa: '', creditCap: '70', creditCapUnit: 'semester' },
  'georgetown-university': { name: 'Georgetown University', rate: 0.1108, minCredits: '12', minGpa: '', creditCap: '60', creditCapUnit: 'semester' },
  'carnegie-mellon-university': { name: 'Carnegie Mellon University', rate: 0.0845, minCredits: '', minGpa: '', creditCap: '180 units', creditCapUnit: 'in residence' },
  'emory-university': { name: 'Emory University', rate: 0.2268, minCredits: '', minGpa: '', creditCap: '62', creditCapUnit: 'semester' },
  'university-of-michigan-ann-arbor': { name: 'University of Michigan Ann Arbor', rate: 0.3497, minCredits: '', minGpa: '', creditCap: '60', creditCapUnit: 'credits' },
  'university-of-virginia': { name: 'University of Virginia', rate: 0.3197, minCredits: '9', minGpa: '', creditCap: '60', creditCapUnit: 'credits' },
  'wake-forest-university': { name: 'Wake Forest University', rate: 0.3728, minCredits: '', minGpa: '', creditCap: 'final 60', creditCapUnit: 'in residence' },
  'tufts-university': { name: 'Tufts University', rate: 0.1091, minCredits: '76', minGpa: '', creditCap: '60', creditCapUnit: 'credits' },
  'new-york-university': { name: 'New York University', rate: 0.3865, minCredits: '24', minGpa: '', creditCap: '64', creditCapUnit: 'semester' },
  'boston-university': { name: 'Boston University', rate: 0.3573, minCredits: '12', minGpa: '', creditCap: '68', creditCapUnit: 'semester' },
  'tulane-university': { name: 'Tulane University', rate: 0.6363, minCredits: '12', minGpa: '', creditCap: 'final 60', creditCapUnit: 'in residence' },
  'purdue-university': { name: 'Purdue University', rate: 0.4256, minCredits: '', minGpa: '', creditCap: '32 upper-div', creditCapUnit: 'in residence' }
};

/* ---- every tunable value, unchanged from the WO4 client implementation ---- */
export const CM = {
  BAND_SHIFT: 0.05,

  GPA_MULT: [
    { id: 'atTop',     label: 'at or above the top of the band', m: 1.80 },
    { id: 'upperHalf', label: 'in the upper half of the band',   m: 1.40 },
    { id: 'lowerHalf', label: 'in the lower half of the band',   m: 1.10 },
    { id: 'below10',   label: 'up to 0.10 below the band',       m: 0.75 },
    { id: 'below25',   label: '0.10 to 0.25 below the band',     m: 0.45 },
    { id: 'farBelow',  label: 'more than 0.25 below the band',   m: 0.25 }
  ],

  CREDIT_MULT: [
    { lo: 0,  hi: 15,       label: 'under 15 credits',   m: 0.45 },
    { lo: 15, hi: 30,       label: '15 to 29 credits',   m: 0.65 },
    { lo: 30, hi: 45,       label: '30 to 44 credits',   m: 1.00 },
    { lo: 45, hi: 60,       label: '45 to 59 credits',   m: 1.10 },
    { lo: 60, hi: Infinity, label: '60 or more credits', m: 1.20 }
  ],

  HS_THRESHOLD: 30,

  FLOOR: 0.01,
  CEIL_MULTIPLE: 3,
  CEIL_ABS: 0.50,
  REL: 0.20,
  MIN_SPAN: 2,
  MAX_SPAN: 6,

  CAP_GATE_UNITS: ['semester', 'credits', 'semester credits', 'sem. (2-yr)'],
  CAP_MIN_PLAUSIBLE: 30
};

const VALID_LEVELS = ['', 'freshman', 'sophomore', 'junior'];
const CREDITS_CEILING = 300;   // above any real semester-credit count

const estNum = v => { const f = parseFloat(String(v == null ? '' : v).replace(/[^0-9.]/g, '')); return isFinite(f) ? f : null; };
const estPct = x => { const v = x * 100; return (v >= 10 ? v.toFixed(0) : v.toFixed(1)) + '%'; };

const cmGatesOnCap = (cap, unit) =>
  cap != null && CM.CAP_GATE_UNITS.includes(unit) && cap >= CM.CAP_MIN_PLAUSIBLE;

/* ---- input validation: reject malformed input, never coerce it ---- */
export function validateInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'Request body must be a JSON object.' };
  const { gpa, credits, level, hsGpa, slugs } = body;

  if (typeof gpa !== 'number' || !isFinite(gpa) || gpa < 0 || gpa > 4)
    return { error: 'gpa must be a number between 0.00 and 4.00.' };
  if (typeof credits !== 'number' || !Number.isInteger(credits) || credits < 0 || credits > CREDITS_CEILING)
    return { error: `credits must be a non-negative integer no greater than ${CREDITS_CEILING}.` };
  if (level !== undefined && level !== null && !VALID_LEVELS.includes(level))
    return { error: 'level must be freshman, sophomore, or junior.' };
  if (hsGpa !== undefined && hsGpa !== null &&
      (typeof hsGpa !== 'number' || !isFinite(hsGpa) || hsGpa < 0 || hsGpa > 4))
    return { error: 'hsGpa must be a number between 0.00 and 4.00, or null.' };
  if (!Array.isArray(slugs) || slugs.length === 0)
    return { error: 'slugs must be a non-empty array of school slugs.' };
  if (slugs.length > REFERENCE_GPA.length)
    return { error: 'slugs contains more entries than there are covered schools.' };
  const seen = new Set();
  for (const s of slugs) {
    if (typeof s !== 'string' || !SCHOOL_FACTS[s]) return { error: 'slugs contains an unknown school.' };
    if (seen.has(s)) return { error: 'slugs contains a duplicate school.' };
    seen.add(s);
  }
  return {
    profile: { gpa, credits, hsGpa: (hsGpa === undefined ? null : hsGpa) },
    slugs: slugs.slice()
  };
}

/* ---- Step 1: eligibility gates. Sourced facts, run before any arithmetic. ---- */
function gatesFor(slug, p) {
  const s = SCHOOL_FACTS[slug];
  const gates = [];
  const cap = estNum(s.creditCap), unit = (s.creditCapUnit || '').trim();

  if (cmGatesOnCap(cap, unit) && p.credits > cap)
    gates.push({ hard: true, text: `${s.name} caps transferable credit at ${cap} ${unit}. You have entered ${p.credits}.` });

  const minCred = estNum(s.minCredits);
  if (minCred != null && p.credits < minCred)
    gates.push({ hard: true, text: `${s.name} requires at least ${minCred} transferable credits to apply. You have entered ${p.credits}, so that stated minimum is not met yet.` });

  const minGpa = estNum(s.minGpa);
  if (minGpa != null && p.gpa < minGpa)
    gates.push({ hard: true, text: `${s.name} states a minimum GPA of ${minGpa}. You have entered ${p.gpa.toFixed(2)}.` });

  if (cap != null && !cmGatesOnCap(cap, unit) && unit !== 'in residence')
    gates.push({ hard: false, text: `${s.name} publishes a transfer limit of ${String(s.creditCap)}${unit ? ' ' + unit : ''}. That is not stated in semester credit-hours, so we do not check your credit total against it.` });
  if (unit === 'in residence')
    gates.push({ hard: false, text: `${s.name} requires ${String(s.creditCap)} in residence. That is a graduation requirement, not a limit on what you can transfer in.` });

  return gates;
}

/* ---- Steps 2-3: comparison point and GPA multiplier ---- */
function comparisonFor(ref, p) {
  const underThreshold = p.credits < CM.HS_THRESHOLD;
  const useHs = underThreshold && p.hsGpa != null;
  const shifted = !useHs;                       // HS GPA compares to the raw band
  const low = ref.low - (shifted ? CM.BAND_SHIFT : 0);
  const high = ref.high - (shifted ? CM.BAND_SHIFT : 0);
  const gpa = useHs ? p.hsGpa : p.gpa;
  return { low, high, gpa, shifted, useHs, underThreshold,
           weakWithoutHs: underThreshold && !useHs };
}
function gpaMult(gpa, low, high) {
  const mid = (low + high) / 2;
  const M = CM.GPA_MULT;
  if (gpa >= high) return M[0];
  if (gpa >= mid) return M[1];
  if (gpa >= low) return M[2];
  const d = low - gpa;
  if (d <= 0.10) return M[3];
  if (d <= 0.25) return M[4];
  return M[5];
}
const creditMult = c => CM.CREDIT_MULT.find(b => c >= b.lo && c < b.hi);

/* ---- Steps 5-7: combine, bound, and turn into a range.
        Identical arithmetic to the WO4 client implementation. ---- */
export function estimateFor(slug, p) {
  const ref = REFERENCE_GPA.find(r => r.slug === slug);
  const school = SCHOOL_FACTS[slug];
  if (!ref || !school) return { slug, status: 'no-reference' };
  if (school.rate == null) return { slug, status: 'no-rate', gates: [] };

  const gates = gatesFor(slug, p);
  if (gates.some(g => g.hard)) return { slug, status: 'blocked', gates };

  const cmp = comparisonFor(ref, p);
  const g = gpaMult(cmp.gpa, cmp.low, cmp.high);
  const c = creditMult(p.credits);
  const base = school.rate;
  const ceil = Math.min(CM.CEIL_MULTIPLE * base, CM.CEIL_ABS);
  const raw = base * g.m * c.m;
  const point = Math.min(ceil, Math.max(CM.FLOOR, raw));

  // whole percentages first — rounding before the span rule is what reproduces
  // the original work order's examples (15% -> 12-18, 2% -> 1-3)
  const pc = point * 100;
  let lo = Math.round(pc * (1 - CM.REL));
  let hi = Math.round(pc * (1 + CM.REL));
  if (hi - lo > CM.MAX_SPAN) {
    const mid = Math.round(pc);
    lo = Math.max(1, mid - Math.floor(CM.MAX_SPAN / 2));
    hi = lo + CM.MAX_SPAN;
  }
  if (hi - lo < CM.MIN_SPAN) {
    const need = CM.MIN_SPAN - (hi - lo);
    const down = Math.min(Math.ceil(need / 2), Math.max(0, lo - 1));
    lo -= down; hi += need - down;
  }
  // the ceiling bounds the whole range, not just the point
  const ceilPc = Math.max(1, Math.round(ceil * 100));
  if (hi > ceilPc) { const shift = hi - ceilPc; hi = ceilPc; lo = Math.max(1, lo - shift); }
  lo = Math.max(1, lo);
  // where floor and ceiling are closer than the minimum span, the bounds win
  if (hi - lo < CM.MIN_SPAN) hi = Math.min(ceilPc, lo + CM.MIN_SPAN);
  if (hi <= lo) hi = lo + 1;

  return { slug, status: 'ok', gates, cmp, g, c, base, raw, ceil, point, lo, hi };
}

/* ---- compose the response the renderer needs: estimates plus breakdown,
        with sourced figures and our weighting labelled apart ---- */
export function resultFor(slug, p) {
  const e = estimateFor(slug, p);
  if (e.status !== 'ok') return { slug, status: e.status, gates: e.gates || [] };

  const { cmp, g, c, base, raw, ceil, point, lo, hi } = e;
  const school = SCHOOL_FACTS[slug];
  return {
    slug,
    status: 'ok',
    gates: e.gates,
    comparison: {
      gpa: cmp.gpa,
      kind: cmp.useHs ? 'high school' : 'college',
      low: cmp.low,
      high: cmp.high,
      shifted: cmp.shifted,
      underThreshold: cmp.underThreshold,
      weakWithoutHs: cmp.weakWithoutHs,
      // the cap the credits were checked against, when it gates at all —
      // lets the renderer say "X of Y allowed" without knowing the gate rule
      capAllowed: (() => {
        const cap = estNum(school.creditCap), unit = (school.creditCapUnit || '').trim();
        return cmGatesOnCap(cap, unit) ? cap : null;
      })()
    },
    range: { lo, hi, text: `${lo}–${hi}%` },
    breakdown: [
      { label: `${school.name}’s published transfer admit rate`,
        value: estPct(base), tag: 'sourced' },
      { label: `Reference band${cmp.shifted
          ? `, shifted down by ${CM.BAND_SHIFT.toFixed(2)} because we are comparing a college GPA`
          : ', unshifted because we are comparing a high school GPA'}`,
        value: `${cmp.low.toFixed(2)}–${cmp.high.toFixed(2)}`, tag: 'reference' },
      { label: cmp.useHs ? 'Your high school GPA' : 'Your college GPA',
        value: cmp.gpa.toFixed(2), tag: 'yours' },
      { label: `GPA sits ${g.label}`, value: `×${g.m.toFixed(2)}`, tag: 'our weighting' },
      { label: `Credits: ${c.label}`, value: `×${c.m.toFixed(2)}`, tag: 'our weighting' },
      { label: 'Applied to the base rate',
        value: `${estPct(base)} × ${g.m.toFixed(2)} × ${c.m.toFixed(2)} = ${estPct(raw)}`,
        tag: 'calculated' },
      { label: `Bounded: floor ${estPct(CM.FLOOR)}, ceiling the lower of ${CM.CEIL_MULTIPLE}× the base rate and ${estPct(CM.CEIL_ABS)}`,
        value: estPct(point), tag: 'calculated' },
      { label: `Shown as a range of ±${Math.round(CM.REL * 100)}%, ${CM.MIN_SPAN}–${CM.MAX_SPAN} points wide`,
        value: `${lo}–${hi}%`, tag: 'ours' }
    ]
  };
}
