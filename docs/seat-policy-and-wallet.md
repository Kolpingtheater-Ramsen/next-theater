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

## Wallet synchronization

Apply `0007_wallet_sync_jobs.sql` before deploying the updated Pages application
and retry worker. This adds only a job table and an index; it does not alter
reservations. Migration 0006 can remain installed but is no longer used.

Ticket status, version and seats are read in one database transaction. Every
Wallet write, including first issuance, acquires a per-booking lease. A request
that crashes can be retried after two minutes. Failed updates use increasing
retry delays (30 seconds to one hour), ordered so failing passes do not hold up
new updates. The five-minute worker schedule determines the next actual attempt.
The first issuance records its pending state before creating the Google class,
so the worker can recover from failures at that stage too.

If a booking changes during a Google request, its pending flag remains set and
the next attempt reads the latest booking. A save link is returned only after
the current confirmed booking was synchronized. The admin retry endpoint returns
counts for attempted, synchronized, pending and busy passes, without guest data.

## Google Wallet deployment (19 September 2026)

The existing Kolpingtheater Ramsen issuer `3388000000023043101` is reused.
All six December performances now have approved event classes with the new
artwork. Class approval does not grant the issuer public publishing access.
Google Cloud project `next-theater-wallet` has the Wallet API enabled. Its
service account `next-theater-wallet@next-theater-wallet.iam.gserviceaccount.com`
has Developer access on the issuer and no additional project IAM roles.
The active service-account credential is held in macOS Keychain and in encrypted
Cloudflare secrets. Do not export it into repository files, logs or documentation.

Production D1 was exported to a private backup and checked before applying only
the additive migration 0007. All four `GOOGLE_WALLET_*` secrets are installed on
Pages and the deployed `next-theater-wallet-sync` worker. The worker has a
five-minute schedule. Pages deployment `5816fddc` serves the updated ticket page and assets on the
production domain. The booking API returns all six performances, and the public
Wallet endpoint correctly remains unavailable (503). The banner was checked
on desktop and at a 390-pixel viewport.

Public issuance remains disabled because the Google issuer
is still in demo mode. The console shows two of three onboarding steps complete;
clicking Request publishing access does not open a form or confirm submission.
No successful publishing request or public approval has been established.

Real API validation exposed and fixed two issues: Google's REST resource paths
are case-sensitive (`eventTicketClass` and `eventTicketObject`), and an existing
console-created Draft class must be submitted as `UNDER_REVIEW` before issuance.
The code preserves existing class artwork and settings when submitting drafts.

A dedicated synthetic pass, labelled Wallet-Funktionstest (kein Eintritt), was
issued without creating a production reservation. Live Google read-back verified
first issuance, seat changes, check-in (`COMPLETED`), checkout (`ACTIVE`) and
cancellation (`INACTIVE`). On the connected Pixel 10, Google Wallet confirmed
Added to Wallet and subsequently displayed the updated seat field Storniert.
This establishes native saving and delivery of the cancellation update. Check-in
and checkout were verified through Google's API, not separately in Android UI.
The admission scanner was tested against isolated local D1.

The Romeo und Julia artwork is generated with the built-in Imagegen tool:
`public/img/banners/romeo-und-julia-2026.webp` for the booking page and
`public/img/banners/romeo-und-julia-2026-wallet.png` for event classes. The imagery
is illustrative, not a photograph of the real cast or set. It contains no text;
titles, times, seats and QR codes remain native accessible fields.

## Remaining activation

Complete the issuer's publishing request in the Google Pay & Wallet console and
verify that Google has granted publishing access. Demo passes can be saved by
issuer administrators/developers or approved test accounts. Once public access
is granted, set `GOOGLE_WALLET_ENABLED=true` on the worker and Pages, redeploy
Pages and verify issuance with a permitted test reservation. Do not expose the
public Wallet button while the issuer is restricted to demo accounts.

To verify credentials without printing secrets:

```sh
node scripts/configure-google-wallet.mjs /private/path/service-account.json --issuer ISSUER_ID
```

After Wrangler authentication, `--configure` checks migration 0007, deploys the
retry worker, installs settings on the worker and Pages, and explicitly leaves
Wallet disabled. The helper passes secrets through stdin and prints no key or
token. Redeploy Pages to apply changed secrets. Keep the original credential in
a secure local store, never in Git or chat.

## Verification

- 34 unit tests pass, including actual SQLite migrations, JWT verification,
  draft-class submission, concurrent issuance, cancellation races, expired
  leases, first-issuance recovery and retry fairness.
- The packaged Pages worker passes all 11 lifecycle scenarios (12 reported tests
  including the parent test) against isolated local D1. This includes concurrent
  bookings, optional seat guidance, admission-only scanning and cancellation.
- TypeScript, changed-file lint, Next.js production build and Pages packaging pass.
- Live Google API and Pixel checks are described above. Public activation remains
  a separate Google publishing gate.

References:

- https://developers.google.com/wallet/tickets/events/getting-started/issuer-onboarding
- https://developers.google.com/wallet/tickets/events/getting-started/auth/rest
- https://developers.google.com/wallet/reference/rest/v1/eventticketclass
- https://developers.google.com/wallet/tickets/events/resources/brand-guidelines
- https://developers.cloudflare.com/d1/worker-api/d1-database/#batch
