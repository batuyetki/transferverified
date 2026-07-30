/* ============================================================================
   POST /.netlify/functions/create-checkout-session — Work Order 06, Task 4.

   Creates a Stripe Checkout Session for the one-time $9.99 Chance Me
   purchase. The Clerk user id attached to the session comes ONLY from the
   verified session token — never from the request body — because it is what
   the webhook will grant entitlement to. This endpoint grants nothing itself.
   ============================================================================ */
import Stripe from 'stripe';
import { verifiedUserId, hasChanceMeEntitlement, requireEnv } from './_lib/auth.js';

const SITE = 'https://transferverified.com';

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export default async function handler(request) {
  try {
    if (request.method !== 'POST') return json(405, { error: 'POST only.' });

    const userId = await verifiedUserId(request);
    if (!userId) return json(401, { error: 'Sign in to buy Chance Me.' });

    // already-entitled users must not be able to buy twice
    if (await hasChanceMeEntitlement(userId))
      return json(200, { alreadyEntitled: true });

    const stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'));
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',                       // one-time, not a subscription
      line_items: [{ price: requireEnv('STRIPE_PRICE_ID'), quantity: 1 }],
      success_url: `${SITE}/#/success`,
      cancel_url: `${SITE}/#/cancel`,
      client_reference_id: userId,
      metadata: { clerkUserId: userId },     // how the webhook knows who paid
      integration_identifier: 'transferverified-chanceme-kqzmwvxr'
    });

    return json(200, { url: session.url });
  } catch (err) {
    console.error('create-checkout-session failed:', err.message);
    return json(500, { error: 'Could not start checkout. Try again shortly.' });
  }
}
