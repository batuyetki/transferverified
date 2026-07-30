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

## Work Order 06 — Task 6 test results (2026-07-30)

All tests run against production (transferverified.com), sandbox/dev keys.

### Happy path — PASS
- Owner signed up via Clerk prebuilt components (no password touched this codebase).
- Chance Me locked for the signed-in, unpaid account.
- Purchase via Stripe Checkout, test card 4242 4242 4242 4242 → webhook fired →
  `publicMetadata` = `{ chanceMe: true, chanceMePurchasedAt: "2026-07-30T20:38:55.662Z" }`
  → Chance Me unlocked; live estimates returned and rendered.
- Estimate correctness: live responses for GPA 3.50 / 45 credits matched the
  server model exactly (Harvard 1–2 %, Purdue 32–38 %, UCLA blocked on its
  76-credit minimum). The model itself was verified against the previous
  client implementation with a 27,000-case parity sweep (0 mismatches).

### Failure cases — ALL FAIL CORRECTLY
| Case | Result |
|---|---|
| `chance-me`, no session | 401, no estimates |
| `chance-me`, forged bearer token | 401 |
| `chance-me`, valid session but not entitled | 403 |
| **Forced `hasChanceMeAccess()` → true** (in-memory metadata tamper) | UI unlocked, server still 403, **zero estimates rendered** — the point of this work order, confirmed |
| Webhook, no signature | 400, nothing granted |
| Webhook, forged signature (fake paid session) | 400, nothing granted |
| Webhook, valid signature over tampered body (offline test) | 400 |
| Visiting `/#/success` without paying | Waiting state only; page grants nothing (only the webhook writes entitlement) |
| GPA 7.0 | 400 "gpa must be a number between 0.00 and 4.00." |
| Negative credits | 400 |
| Non-integer credits (30.5) | 400 |
| Unknown slug | 400 |
| Empty slugs | 400 |
| Buying when already entitled | 200 `{ alreadyEntitled: true }` — no second checkout created |

### Persistence — NOT RUN (owner opted to skip, 2026-07-30)
Entitlement lives in Clerk `publicMetadata` on the account (verified present
server-side), so it follows the account by construction; the sign-out/sign-in
and different-browser checks were skipped for time. Runnable any time: sign
out and back in, and sign in from another browser — Chance Me should be
unlocked in both.

### Card decline — NOT RUN (owner opted to skip, 2026-07-30)
Skipped for time. Risk is low: Stripe's hosted checkout does not complete a
declined payment, and the webhook grants only sessions with
`payment_status: "paid"` (the unpaid-session refusal is covered by the
offline webhook tests above). Runnable any time with a second account and
card 4000 0000 0000 0002.

### Notes from the run
- The first test payment completed before the webhook endpoint was registered
  in Stripe, so no grant occurred (fail-closed, as designed). Fixed by
  registering the endpoint, adding `STRIPE_WEBHOOK_SECRET`, and redeploying;
  a second test payment then granted within seconds. The first sandbox
  payment can be refunded from the Stripe dashboard if tidiness matters —
  it is test money.
- Netlify env-var changes reach functions only on the next deploy. If a
  secret is rotated, push any commit (empty is fine) afterwards.

## Production checklist — written down only, NOT executed

- Create the production Clerk instance; add its CNAME records at Porkbun.
- Replace both Clerk `<script>` tags in `public/index.html` with the
  production instance's URL and publishable key (see the comment above them).
- Swap `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in Netlify.
- Complete Stripe business verification; activate live mode.
- Recreate the "Chance Me" product in live mode — products do not copy from
  sandbox and the Price ID will differ.
- Swap `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` in Netlify.
- Register a live-mode webhook endpoint for `checkout.session.completed` at
  `https://transferverified.com/.netlify/functions/stripe-webhook`;
  update `STRIPE_WEBHOOK_SECRET` with the live signing secret.
- Redeploy (push a commit) so functions pick up the new variables, then
  complete one real purchase end-to-end.
