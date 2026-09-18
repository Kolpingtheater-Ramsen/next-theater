# Seat selection and Wallet activation

## Seat policy

New bookings and seat edits may not create a new isolated free seat within a
physical block. Row ends, the central aisle and the two blocked front corners
are block boundaries. Existing isolated seats remain bookable. Groups use
adjacent seats in one block whenever an orphan-free group of that size remains
available. When only scattered seats remain, split groups are allowed if they
do not create new isolated seats. Unchanged existing bookings remain valid.
Cancellation is never blocked by this policy.

The seat map explains invalid selections and offers a valid alternative of the
same size where possible. The API applies the same rules. Migration
`0006_seat_layout_guard.sql` verifies the occupancy snapshot inside the booking
transaction, so concurrent bookings cannot jointly leave a singleton behind.
Apply this additive migration before deploying the application. No existing
booking is moved or deleted. The check rows are removed within the transaction.

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
