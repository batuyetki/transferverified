/* ============================================================================
   TransferVerified — reference GPA bands
   Work Order 04, Task 2.

   WHAT THIS IS, AND WHAT IT IS NOT
   -------------------------------
   These figures are NOT in the same class as the rest of the data on this site.
   Everything in TT_DATA is transfer-specific and extracted from a named filing
   that the school itself published, and every value there links back to it.

   These do not. They are a reference band for **average admitted GPA for
   undergraduate admission overall** — not transfer-specific — compiled from
   public Common Data Set and institutional sources. They are an orientation
   point for the Chance Me estimate and nothing else.

   RULES THIS FILE EXISTS TO ENFORCE
   ---------------------------------
   1. Kept entirely separate from TT_DATA. These values are never merged into,
      or written onto, a school record.
   2. Never displayed with a per-school "verified from the filing" treatment,
      and never carrying a sourceUrl claim. There is no per-school source link
      for these numbers because they are not per-school filings.
   3. Always labelled as a reference band compiled from public CDS and
      institutional data, describing undergraduate admission overall.
   4. They appear only inside Chance Me and on the Methodology page. Nowhere
      else on the site.

   The `slug` on each row is mapped by hand to the matching TT_DATA record.
   Do not fuzzy-match on name — several of these differ from how the school is
   named in the dataset (MIT, UCLA, UC Berkeley, and Michigan all do).

   No build step: this file is loaded by a plain <script> tag before the main
   application script and is independently editable.
   ============================================================================ */

window.REFERENCE_GPA = [
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

/* The one sentence that must accompany these figures wherever they are shown.
   Kept here, next to the data, so the label and the data cannot drift apart. */
window.REFERENCE_GPA_LABEL =
  'Reference band compiled from public Common Data Set and institutional sources. ' +
  'It describes average admitted GPA for undergraduate admission overall, not transfer admission.';
