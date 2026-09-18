# Seat selection and Wallet activation

## Seat policy

Seat-layout guidance is optional. New bookings and edits can leave single free
seats, use separate groups or select the middle of a free block. A short notice
explains newly isolated seats and explicitly allows continuing with the choice.
There is no forced alternative and no layout rejection in either write API.
Row ends, the central aisle and blocked front corners still bound the notice's
seat blocks. Existing isolated seats, unchanged bookings and partial releases
do not trigger it.

The five-seat maximum, one active reservation per email and performance, and
the deadline at performance start remain in force. Occupied or invalid seats
remain unavailable. Database uniqueness, transactional writes, request keys
and booking versions continue to protect against double bookings and stale edits.
The whole-layout snapshot check is no longer used: unrelated simultaneous
bookings can both succeed, including when they leave a single seat between them.
Migration 0006 can stay installed; its guard table is unused by the updated code.
No seat-policy migration or change to existing reservations is required.

`src/lib/seat-policy.ts` provides the notice shared by new bookings and edits.

## Seat-rule verification (18 September 2026)

The release passes 21 unit tests and 11 lifecycle scenarios against the packaged
Pages worker with isolated local D1 state. These cover new bookings and edits
with gaps, simultaneous disjoint bookings, duplicate seats, stale edits,
transaction rollback and the existing email limit. TypeScript, changed-file
lint, Next.js build and Pages packaging pass. In Brave, selecting A3 shows the
optional A2 gap notice, enables Continue and retains A3 on the details step.

## Existing Google Wallet issuer

The signed-in console was inspected on 18 September 2026. Kolpingtheater Ramsen
already has an issuer account and an authorized service account. The issuer is
still in demo mode; production Pages has no `GOOGLE_WALLET_*` settings. Do not
enable the public Wallet button until Google grants publishing access and the
pass lifecycle is verified on Android.

The implementation already issues signed event-ticket save links and updates
seats, cancellation, check-in and checkout. The scheduled worker retries pending
updates. No management URL or guest email is included in the pass.

With the existing service-account JSON file available locally, verify access:

```sh
node scripts/configure-google-wallet.mjs /private/path/service-account.json --issuer ISSUER_ID
```

After Wrangler is authenticated, add `--configure` to deploy the retry worker and
set the four required settings on both the worker and Pages. The helper passes
secrets through stdin, leaves Wallet disabled and prints no key or access token.
Redeploy Pages to apply its new secrets. Keep the original key in a secure local
credential store; do not commit it or paste it into chat.

In the Google Pay & Wallet console, complete the issuer's publishing request.
Demo passes can be tested by issuer administrators/developers or approved test
accounts. Before public activation, verify saving a pass, changing seats,
cancelling, check-in and checkout on Android. Configure
`GOOGLE_WALLET_ENABLED=true` on the retry worker and Pages only after these checks,
then redeploy Pages.

References:

- https://developers.google.com/wallet/tickets/events/getting-started/issuer-onboarding
- https://developers.google.com/wallet/tickets/events/web
- https://developers.cloudflare.com/d1/worker-api/d1-database/#batch
