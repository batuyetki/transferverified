/* ============================================================================
   POST /.netlify/functions/stripe-webhook — Work Order 06, Task 5.

   The ONLY thing that grants Chance Me. The success page is a courtesy;
   entitlement exists when — and only when — this function has verified a
   signed Stripe event that says the payment is real.

   Rules enforced here:
   - Signature verified with constructEvent against the RAW request body.
     Verification failure -> 400, no further processing.
   - Only checkout.session.completed (and its async-payment completion) grant;
     every other event is acknowledged and ignored cleanly.
   - The user comes from session metadata written by create-checkout-session
     from a VERIFIED Clerk session — never from anything the client sent here.
   - The session must actually be paid before granting.
   - Granting is idempotent: Stripe retries and duplicate deliveries land on
     "already granted", which is success, not an error.
   - 200 once verified and handled; failures are logged, not thrown into the
     response — except transient Clerk API errors, which return 500 so Stripe
     retries and the grant is never silently lost.
   ============================================================================ */
import Stripe from 'stripe';
import { clerkClient, requireEnv } from './_lib/auth.js';

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export default async function handler(request) {
  if (request.method !== 'POST') return json(405, { error: 'POST only.' });

  // Raw body exactly as Stripe sent it — parsing first would break the signature.
  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!signature) return json(400, { error: 'Missing stripe-signature header.' });

  let event;
  try {
    const stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'));
    event = stripe.webhooks.constructEvent(
      rawBody, signature, requireEnv('STRIPE_WEBHOOK_SECRET'));
  } catch (err) {
    console.error('stripe-webhook signature verification failed:', err.message);
    return json(400, { error: 'Signature verification failed.' });
  }

  // Everything below runs only on a verified event.
  if (event.type !== 'checkout.session.completed' &&
      event.type !== 'checkout.session.async_payment_succeeded') {
    return json(200, { received: true, ignored: event.type });
  }

  const session = event.data.object;

  if (session.payment_status !== 'paid') {
    // completed-but-unpaid happens with delayed payment methods; the
    // async_payment_succeeded event will land here later if it clears.
    console.log(`stripe-webhook: session ${session.id} not paid yet (${session.payment_status}); nothing granted.`);
    return json(200, { received: true, pending: true });
  }

  const userId = session.metadata && session.metadata.clerkUserId;
  if (!userId) {
    // permanent condition — retrying will never add a user id to this session
    console.error(`stripe-webhook: paid session ${session.id} has no clerkUserId in metadata; nothing granted.`);
    return json(200, { received: true, unprocessable: true });
  }

  try {
    const clerk = clerkClient();
    const user = await clerk.users.getUser(userId);
    if (user.publicMetadata?.chanceMe === true) {
      // duplicate delivery or retry: already granted is success
      return json(200, { received: true, alreadyGranted: true });
    }
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        chanceMe: true,
        chanceMePurchasedAt: new Date().toISOString()
      }
    });
    console.log(`stripe-webhook: Chance Me granted for session ${session.id}.`);
    return json(200, { received: true, granted: true });
  } catch (err) {
    // transient (Clerk API hiccup) -> non-2xx so Stripe retries; the grant
    // must never be silently lost. Idempotency makes the retry safe.
    console.error('stripe-webhook: entitlement update failed:', err.message);
    return json(500, { error: 'Entitlement update failed; Stripe will retry.' });
  }
}
