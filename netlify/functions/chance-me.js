/* ============================================================================
   POST /.netlify/functions/chance-me — Work Order 06, Task 3.

   The gate that makes the paywall real. Order of checks:
     1. Verified Clerk session (shared helper) ....... else 401
     2. Entitlement in Clerk publicMetadata .......... else 403
     3. Per-user rate limit .......................... else 429
     4. Strict input validation ..................... else 400
   Only then does the model run. The client renders; it never calculates.
   ============================================================================ */
import { verifiedUserId, hasChanceMeEntitlement } from './_lib/auth.js';
import { validateInput, resultFor } from './_lib/chance-model.js';

/* Best-effort per-instance rate limit. There is deliberately no database in
   this project, so this protects each warm function instance; an entitled
   user has no legitimate reason to exceed it. */
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 30;
const recentCalls = new Map(); // userId -> [timestamps]

function rateLimited(userId) {
  const now = Date.now();
  const calls = (recentCalls.get(userId) || []).filter(t => now - t < RATE_WINDOW_MS);
  if (calls.length >= RATE_MAX) { recentCalls.set(userId, calls); return true; }
  calls.push(now);
  recentCalls.set(userId, calls);
  return false;
}

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export default async function handler(request) {
  try {
    if (request.method !== 'POST') return json(405, { error: 'POST only.' });

    const userId = await verifiedUserId(request);
    if (!userId) return json(401, { error: 'Sign in to use Chance Me.' });

    if (!(await hasChanceMeEntitlement(userId)))
      return json(403, { error: 'This account does not have Chance Me.' });

    if (rateLimited(userId))
      return json(429, { error: 'Too many requests. Wait a moment and try again.' });

    let body;
    try { body = await request.json(); }
    catch { return json(400, { error: 'Request body must be valid JSON.' }); }

    const input = validateInput(body);
    if (input.error) return json(400, { error: input.error });

    const results = input.slugs.map(slug => resultFor(slug, input.profile));
    return json(200, { results });
  } catch (err) {
    // never log tokens or request bodies; the message is enough to debug config
    console.error('chance-me failed:', err.message);
    return json(500, { error: 'Something went wrong on our side. Try again shortly.' });
  }
}
