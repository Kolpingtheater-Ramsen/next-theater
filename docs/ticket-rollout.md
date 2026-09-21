# Ticket booking rollout

The ticket pages contain six performances of Romeo und Julia on 27, 28 and
29 December 2026, at 17:00 and 19:30 each day. The seed uses the existing venue,
68 bookable seats and free admission. A booking contains at most five seats.
No duration is assumed. Navigation and homepage content are unchanged.

For subsequent seat-selection rules and Wallet credential setup, see
[seat-policy-and-wallet.md](seat-policy-and-wallet.md). Apply migration 0006
as historical schema and 0007 for serialized Wallet synchronization before
deploying the application and retry worker. Seat-layout guidance is optional;
the updated application no longer uses the whole-layout guard from 0006.

## Database and deployment order

Deploying the application requires the new database columns. Before pushing a
branch that automatically deploys to production:

1. Authenticate Wrangler and check the production D1 migration history and schema.
2. Export `theater-bookings` to a private local backup. It contains personal data.
3. Apply `0004_ticket_flow.sql`, then `0005_romeo_und_julia_2026.sql`. Use the D1
   migration runner when its history matches the current schema. Do not replay old
   migrations against an untracked production schema. Then apply the additive
   migrations `0006_seat_layout_guard.sql` and `0007_wallet_sync_jobs.sql`.
4. Deploy the tested Pages build, then check `/booking` and `/api/plays` on the
   production domain. Do not create real reservations as an automated smoke test.

Migration 0004 adds admission tokens, request keys, booking versions, email state,
Wallet synchronization state, revocable admin sessions and rate limits. It does
not delete reservations. Migration 0005 inserts six performances without replacing
existing rows. Old admin cookies no longer grant access; administrators must log
in again with the configured password. Existing private management URLs remain
valid. New QR codes contain an admission token instead of the management URL.

Keep a copy of the prior Pages deployment for application rollback. The schema
additions can remain in place; do not remove columns or reservations to roll back
the UI. Reverting to the old application would also restore its old authentication
and ticket behavior, so prefer correcting the new deployment where possible.

## Google Wallet

Public Wallet issuance was activated on 21 September 2026 after Google's approval
email and console verification. Both production Pages and the retry worker have
the enabled setting. Existing confirmed tickets now show the Wallet button; see
[the activation record](seat-policy-and-wallet.md#public-activation-21-september-2026)
for deployment identifiers and the exact verification scope.

Wallet stays hidden unless all four settings are configured on Pages:

- `GOOGLE_WALLET_ENABLED=true`
- `GOOGLE_WALLET_ISSUER_ID`
- `GOOGLE_WALLET_CLIENT_EMAIL`
- `GOOGLE_WALLET_PRIVATE_KEY` (PKCS#8 service-account private key)

Use Cloudflare secrets for credentials. Do not place them in Git or this document.
The issuer must grant the service account access, and production passes require
the corresponding Google Wallet publishing access. See the official
[event-ticket setup](https://developers.google.com/wallet/tickets/events/web).

Configure the same settings on the worker in `wrangler.wallet.toml`, then deploy
it. Its five-minute schedule retries failed pass updates. Booking modifications,
cancellation, check-in and checkout also attempt immediate synchronization. The
authenticated `POST /api/admin/wallet/sync` endpoint can trigger a retry manually.
Deploy and verify the retry worker before enabling the public Wallet button.

Before activation, save a test pass on Android, change its seats, cancel it, and
verify the updated pass and admission scanner. Also verify check-in and checkout.
Offline Wallet displays can be stale; the server-side admission lookup determines
whether a reservation is valid. The Wallet barcode never authorizes management.

## Checks

```sh
node --test tests/*.test.mjs
./node_modules/.bin/tsc --noEmit --incremental false
./node_modules/.bin/eslint src/app/booking src/components/booking src/lib src/app/api src/app/admin/scan
./node_modules/.bin/next build
./node_modules/.bin/next-on-pages
./node_modules/.bin/wrangler deploy --dry-run --config wrangler.wallet.toml
```

The integration suite requires an isolated local D1 database with all migrations,
a synthetic `ADMIN_PASSWORD_HASH` for `local-ticket-test-only`, and no mail,
Discord or Wallet credentials. It rejects a non-loopback target URL and creates
synthetic test performances and reservations. Run it against either local Next
development or the packaged Pages worker:

```sh
TICKET_TEST_URL=http://localhost:3098 node --test tests/ticket-flow.integration.mjs
```

Coverage includes booking and edit validation, seat and email races, simultaneous
request retries, version conflicts, private API responses, forged admin sessions,
admission scanning, check-in, checkout, cancellation and logout. Unit tests cover
Berlin calendar offsets, Wallet states and signed JWTs with an ephemeral key.
These checks do not prove real email delivery or Android Wallet behavior.
