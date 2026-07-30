/* ============================================================================
   Shared Clerk session verification — Work Order 06, Task 2.

   The ONE way any function learns who is calling. Identity comes only from a
   verified Clerk session token; nothing here reads a user id, email, or
   entitlement flag out of a request body, and no function may reimplement
   this per-function.
   ============================================================================ */
import { verifyToken, createClerkClient } from '@clerk/backend';

/* A missing variable is a deployment fault: fail loudly, never fall back. */
export function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

/* Extracts the bearer token from a request, verifies it with Clerk's backend
   SDK, and returns the verified user id — or null for anything less than a
   fully valid session. Callers turn null into a 401. */
export async function verifiedUserId(request) {
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  if (!token) return null;
  try {
    const payload = await verifyToken(token, {
      secretKey: requireEnv('CLERK_SECRET_KEY'),
      authorizedParties: [
        'https://transferverified.com',
        'https://www.transferverified.com',
      ],
    });
    return payload.sub || null;
  } catch {
    // Expired, forged, or foreign token — not an error worth logging a token for.
    return null;
  }
}

export function clerkClient() {
  return createClerkClient({ secretKey: requireEnv('CLERK_SECRET_KEY') });
}

/* Entitlement lives in Clerk publicMetadata: readable by the frontend for UI
   state, writable only server-side with the secret key. This is the server's
   own read of it — the client's copy is never trusted. */
export async function hasChanceMeEntitlement(userId) {
  const user = await clerkClient().users.getUser(userId);
  return user.publicMetadata?.chanceMe === true;
}
