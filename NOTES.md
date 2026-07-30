# TransferVerified — deploy repo notes

## Work Order 06 — Stripe webhook registration (Task 5 handoff)

The webhook function is deployed but cannot verify events until its signing
secret exists. These six steps finish the wiring — steps 3–6 are the owner's:

1. ~~Commit and push the webhook function.~~ Done — deployed with WO6 Task 5.
2. Deployed webhook endpoint URL:

   **`https://transferverified.com/.netlify/functions/stripe-webhook`**

3. Owner: register that URL in **Stripe → Developers → Webhooks → Add endpoint**
   (sandbox account), listening for the event **`checkout.session.completed`**.
   (Optionally also `checkout.session.async_payment_succeeded` — the function
   handles it for delayed payment methods; card payments don't need it.)
4. Stripe issues a **signing secret** (`whsec_…`) for the new endpoint.
5. Owner: add it to Netlify as the environment variable **`STRIPE_WEBHOOK_SECRET`**
   (Site settings → Environment variables). Never commit it anywhere.
6. Owner: redeploy the site (trigger a deploy or push any commit) so the
   functions pick up the variable, then confirm here. Until then the webhook
   returns 400/500 for every event and grants nothing — that is the designed
   fail-closed behavior.

## Work Order 06 — Task 6 test results

(to be filled in during Task 6, after the webhook secret is live)

## Production checklist

(to be written in Task 6 — written down only, not executed)
