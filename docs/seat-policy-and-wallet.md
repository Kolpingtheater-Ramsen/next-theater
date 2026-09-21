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

Since 21 September 2026, the seat-gap notice is yellow and continuing with a new
gap requires explicit confirmation in the UI. New bookings show a dialog before
the personal-details step; "Plätze ändern" or Escape returns to the seat map,
and "Ja, Auswahl bestätigen" continues. Edits include the same warning in their
existing save confirmation, with "Trotzdem speichern". Selections without a new
gap continue normally. The API still permits these choices; this is a deliberate
confirmation step, not a seat-layout rejection.

The warning on the seat map and in the confirmation dialog offers a replacement
with the same seat count that introduces no new isolated free seats. Every
suggestion seats the entire group next to each other in one physical block;
it never splits guests across an aisle or rows. Among these alternatives it
prefers retaining chosen seats, then nearby seats. Row boundaries,
the aisle, blocked corners, other bookings and seats released during an edit are
included in the search. Existing gaps elsewhere do not invalidate a suggestion.
If no adjacent alternative exists, the warning says so, even when a split
selection could avoid gaps. "Empfehlung übernehmen" changes
only the current selection and returns to the map for review; it does not create
or save a booking. Keeping the original selection still requires confirmation.

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

At the initial deployment, public issuance stayed disabled while the issuer was
in demo mode. The publishing request was submitted on 19 September 2026.
All three onboarding steps were complete, and the console confirmed that the
decision would arrive by email. Google granted access on 21 September 2026;
the activation and current production status are documented below.

Console and network debugging identified why the request button initially did
nothing: Google's dialog handler awaits an Analytics callback, while Brave's
tracker-blocking replacement script does not invoke that callback. Temporarily
turning off Shields for `pay.google.com` allowed the normal form to open and be
submitted. Google returned HTTP 200 for the submission RPCs and the UI confirmed
completion. The original site Shields settings were restored afterward.

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

## Public activation (21 September 2026)

Google's approval email arrived at 14:40 UTC, and the Google Pay & Wallet console
confirmed the issuer's access without the demo or publishing-request banner.
`GOOGLE_WALLET_ENABLED=true` is now installed on both the retry worker and
production Pages. The worker's active version is
`17c16ec4-b7ff-46a5-97c0-830304e46e12`. Pages deployment `027706b1` publishes the
tested application from commit `882fa935` with the enabled setting.
The next scheduled production execution at 14:50 UTC completed with outcome
`ok`, on that worker version, without exceptions.

The production ticket API returns `walletAvailable: true` for an existing
confirmed reservation. Its response remains private and non-cacheable. Brave
shows an enabled "Zu Google Wallet hinzufügen" button with no console errors.
The Wallet endpoint rejects a nonexistent booking with 409 and a foreign origin
with 403. `/booking` and `/api/plays` both return 200 with six performances.

The existing synthetic pass was reissued using the live Google API, without
creating or changing production reservations. Read-back verifies seat changes,
check-in (`COMPLETED`), checkout (`ACTIVE`) and cancellation (`INACTIVE`).
Google Wallet's web UI displays the saved pass with the updated seats and Romeo
und Julia artwork, without a demo label or console errors. The synthetic pass
was cancelled after validation, and the web UI confirmed "Storniert". Android saving and
delivery of cancellation updates were verified on 19 September as described
above; no Android device was connected for the 21 September check.

The existing ticket implementation needed no source changes. The activation
build and Pages packaging pass, as do TypeScript and all 19 focused Wallet and
retention tests. Keep all credentials in the existing encrypted secret stores.
To disable issuance again, set `GOOGLE_WALLET_ENABLED=false` on Pages and the
worker and redeploy Pages. This preserves bookings and the retention schedule.

## Availability and data retention (19 September 2026)

Each performance shows the occupied share of its configured seat capacity under
the time button, with a percentage and an accessible meter. The bar is green
below 60%, amber from 60%, and red from 85%. A non-full performance never rounds
to 100%. The three introductory advice blocks below the dates have been removed.

`purgeExpiredBookings` deletes all booking statuses 14 days after each performance
start (plus `duration_minutes` when configured), using the venue timezone. The
existing five-minute worker runs cleanup before Wallet synchronization, including
when Wallet is disabled. The manual admin purge endpoint calls the same helper.
Deletion cascades to seats and Wallet synchronization jobs, removing names,
emails, management/admission tokens, request keys and delivery/check-in fields.
Expired rate-limit hashes and admin sessions are also removed. The deletion
transaction checks that the performance has not been rescheduled since selection.

The privacy notice at `/privacy#ticketbuchung` describes the actual fields,
reservation/delivery/admission purposes, service providers and optional Wallet
passes. It distinguishes active-database deletion from provider retention:
Cloudflare recovery history can persist up to 30 days after deletion; Resend's
standard email/log retention is 30 days from sending, with seven-day backups.
Email copies and Google Wallet passes saved in a guest's account are not remotely
deleted by the database cleanup. See the linked provider policies in the notice.

After restoring a database backup, keep public/admin access closed and run the
same retention cleanup before reopening the service. Do not retain manual data
exports past their operational purpose or reintroduce expired records.

Validation: six retention tests cover the expiry boundary, timezone/duration,
all booking states, cascading deletion, postponed performances, transactional
rollback, idempotency and Wallet-disabled execution. The packaged local worker's
scheduled event deleted an expired synthetic booking, seat and sync job while
preserving five later fixture bookings. Browser QA covered 0%, 35%, 60%, 85%, 99%
and 100% occupancy, closed bookings, desktop and a 390-pixel viewport.

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
- Live Google API, Pixel checks and the completed public activation are described
  above. The initial publishing gate is cleared.

References:

- https://developers.google.com/wallet/tickets/events/getting-started/issuer-onboarding
- https://developers.google.com/wallet/tickets/events/getting-started/auth/rest
- https://developers.google.com/wallet/reference/rest/v1/eventticketclass
- https://developers.google.com/wallet/tickets/events/resources/brand-guidelines
- https://developers.cloudflare.com/d1/worker-api/d1-database/#batch
