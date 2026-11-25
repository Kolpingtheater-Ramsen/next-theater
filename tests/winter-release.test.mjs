import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import { localD1 } from './helpers/d1.mjs'

const require = createRequire(import.meta.url)
const { build } = require(
  require.resolve('esbuild', { paths: [require.resolve('wrangler')] }),
)
async function loadTs(entry) {
  const compiled = await build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'neutral',
    tsconfig: 'tsconfig.json',
  })
  return import(
    `data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`
  )
}

const {
  bookingHref,
  homeHref,
  isWinterReleaseLive,
  shouldShowWinterRelease,
} = await loadTs('src/lib/winter-release.ts')
const tickets = await loadTs('src/lib/tickets.ts')
const { seatBlocks } = await loadTs('src/lib/seat-policy.ts')
const { renderBookingEmail } = await loadTs('src/lib/booking-email.ts')

const homeSource = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8')
const bookingPageSource = readFileSync(new URL('../src/app/booking/page.tsx', import.meta.url), 'utf8')
const bookingFlowSource = readFileSync(new URL('../src/app/booking/BookingFlow.tsx', import.meta.url), 'utf8')
const bookingComingSoonSource = readFileSync(new URL('../src/app/booking/BookingComingSoon.tsx', import.meta.url), 'utf8')
const bookingLayoutSource = readFileSync(new URL('../src/app/booking/layout.tsx', import.meta.url), 'utf8')
const supportSource = readFileSync(new URL('../src/components/booking/TicketSupportNotice.tsx', import.meta.url), 'utf8')
const headerSource = readFileSync(new URL('../src/components/Header.tsx', import.meta.url), 'utf8')
const placeholders = JSON.parse(readFileSync(new URL('../src/data/image-placeholders.json', import.meta.url), 'utf8'))
const romeoFaq = JSON.parse(readFileSync(new URL('../src/data/romeo-faq.json', import.meta.url), 'utf8'))

test('winter release activates at exactly 2026-12-01 00:00 CET', () => {
  assert.equal(isWinterReleaseLive(Date.parse('2026-11-30T23:59:59.999+01:00')), false)
  assert.equal(isWinterReleaseLive(Date.parse('2026-11-30T22:59:59.999Z')), false)
  assert.equal(isWinterReleaseLive(Date.parse('2026-12-01T00:00:00.000+01:00')), true)
  assert.equal(isWinterReleaseLive(Date.parse('2026-11-30T23:00:00.000Z')), true)
  assert.equal(isWinterReleaseLive(Date.parse('2026-12-27T17:00:00+01:00')), true)
})

test('preview parameter enables winter preview on both localhost and production before Dec 1', () => {
  const before = Date.parse('2026-11-26T12:00:00+01:00')
  const after = Date.parse('2026-12-01T00:00:00+01:00')

  assert.deepEqual(
    shouldShowWinterRelease({ now: before, previewValue: 'winter', host: 'localhost:3000', envPreview: false }),
    { live: true, preview: true },
  )
  assert.deepEqual(
    shouldShowWinterRelease({ now: before, previewValue: 'winter', host: 'kolpingtheater-ramsen.de', envPreview: false }),
    { live: true, preview: true },
  )
  assert.deepEqual(
    shouldShowWinterRelease({ now: before, previewValue: 'other', host: 'localhost:3000', envPreview: false }),
    { live: false, preview: false },
  )
  assert.deepEqual(
    shouldShowWinterRelease({ now: before, previewValue: undefined, host: 'kolpingtheater-ramsen.de', envPreview: false }),
    { live: false, preview: false },
  )
  assert.deepEqual(
    shouldShowWinterRelease({ now: after, previewValue: 'winter', host: 'kolpingtheater-ramsen.de', envPreview: false }),
    { live: true, preview: false },
  )

  assert.equal(bookingHref(true), '/booking?preview=winter')
  assert.equal(bookingHref(false), '/booking')
  assert.equal(homeHref(true), '/?preview=winter')
  assert.equal(homeHref(false), '/')
})

test('homepage configures dynamic edge rendering, Kreativbuehne branding, 50 min duration, FAQ, support and preview noindex', () => {
  assert.match(homeSource, /export const runtime = 'edge'/)
  assert.match(homeSource, /export const dynamic = 'force-dynamic'/)
  assert.match(homeSource, /data-home-state='winter-show'/)
  assert.doesNotMatch(homeSource, /data-home-state='post-show'/)
  assert.match(homeSource, /<WinterReleaseRefresh \/>/)
  assert.match(homeSource, /Reservierung ab 1\. Dezember/)
  assert.match(homeSource, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/)
  assert.match(homeSource, /RomeoJuliaPoster/)
  assert.match(homeSource, /bookingHref\(preview\)/)
  assert.match(homeSource, /Kreativbühne/)
  assert.doesNotMatch(homeSource, /Wintertheater/)
  assert.match(homeSource, /50 Minuten/)
  assert.match(homeSource, /Ein Minidrama/)
  assert.match(homeSource, /verkürzte/)
  assert.match(homeSource, /78 Plätze/)
  assert.match(homeSource, /Reihen A–H/)
  assert.match(homeSource, /kolpingtheaterramsen@gmail\.com/)
  assert.match(homeSource, /romeo-faq\.json/)
  assert.match(homeSource, /id='faq'/)
  assert.match(homeSource, /27\./)
  assert.match(homeSource, /28\./)
  assert.match(homeSource, /17:00/)
  assert.match(homeSource, /19:30/)
  assert.match(homeSource, /Pfarrheim/)
  assert.match(homeSource, /Klosterhof 7/)
  assert.match(homeSource, /Eintritt frei/)
  assert.doesNotMatch(homeSource, /29\.12|29\. Dezember/)
  assert.doesNotMatch(homeSource, /Dauer: ca\. 50 Minuten · 78 Plätze/)
  assert.doesNotMatch(homeSource, /nicht das abendfüllende Original/)
  assert.ok(Array.isArray(romeoFaq) && romeoFaq.length >= 6)
  const faqSerialized = JSON.stringify(romeoFaq)
  assert.match(faqSerialized, /Einlass beginnt 30 Minuten vor Vorstellungsbeginn/)
  assert.match(faqSerialized, /nicht zu knapp/)
  assert.match(faqSerialized, /Bahnhofstraße/)
})

test('booking routes use Kreativbuehne branding, support contact, preview noindex, and gate booking until Dec 1', () => {
  assert.match(bookingPageSource, /export const runtime = 'edge'/)
  assert.match(bookingPageSource, /export const dynamic = 'force-dynamic'/)
  assert.match(bookingPageSource, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/)
  assert.match(bookingPageSource, /BookingComingSoon/)
  assert.match(bookingPageSource, /BookingFlow/)

  for (const src of [bookingFlowSource, bookingComingSoonSource]) {
    assert.match(src, /Kreativbühne/)
    assert.doesNotMatch(src, /Wintertheater/)
    assert.match(src, /TicketSupportNotice/)
  }
  assert.match(bookingComingSoonSource, /1\. Dezember/)
  assert.match(bookingComingSoonSource, /Romeo &(?:amp;)? Julia/)
  assert.match(bookingFlowSource, /window\.location\.search/)
  assert.match(bookingFlowSource, /50 Minuten|durationMinutes/)
  assert.match(bookingFlowSource, /verkürzte/)
  assert.match(supportSource, /kolpingtheaterramsen@gmail\.com/)
  assert.doesNotMatch(bookingLayoutSource, /Romeo|romeo-und-julia-2026/i)
})

test('header gates Tickets via winter-release without useSearchParams and preserves preview links', () => {
  assert.match(headerSource, /winter-release/)
  assert.match(headerSource, /homeHref/)
  assert.doesNotMatch(headerSource, /useSearchParams/)
})

test('D1 migrations configure 4 Romeo & Julia plays with 78 seats and 50 min duration', () => {
  const { sqlite } = localD1()
  const rows = sqlite
    .prepare("SELECT id, title, date, time, total_seats, duration_minutes FROM plays WHERE id LIKE 'romeo-julia-2026-%' ORDER BY date, time")
    .all()
  assert.equal(rows.length, 4)
  assert.deepEqual(
    rows.map((r) => `${r.date} ${r.time}`),
    ['2026-12-27 17:00', '2026-12-27 19:30', '2026-12-28 17:00', '2026-12-28 19:30'],
  )
  assert.ok(rows.every((r) => r.title === 'Romeo & Julia – Ein Minidrama' && r.total_seats === 78 && r.duration_minutes === 50))
})

test('78-seat layout adds row H and renders duration in confirmation emails', () => {
  assert.equal(tickets.seatNumbers(78).length, 78)
  assert.equal(tickets.seatLabel(70), 'H1')
  assert.equal(tickets.seatLabel(79), 'H10')
  assert.equal(tickets.validSeats([70, 79], 78), true)
  assert.equal(tickets.validSeats([80], 78), false)
  assert.deepEqual(seatBlocks(78).at(-1), [75, 76, 77, 78, 79])

  const email = renderBookingEmail(
    'confirmation',
    { name: 'Test', email: 'test@example.invalid' },
    {
      id: 'romeo-julia-2026-12-27-1700',
      title: 'Romeo & Julia – Ein Minidrama',
      date: '2026-12-27',
      time: '17:00',
      total_seats: 78,
      duration_minutes: 50,
      venue: 'Klosterhof 7, 67305 Ramsen',
    },
    [70, 79],
    'Kolpingtheater Ramsen',
    'https://kolpingtheater-ramsen.de',
  )
  assert.match(email.text, /ca\. 50 Minuten/)
  assert.match(email.text, /H1.*H10/)
  assert.match(email.html, /title="Dein Platz H1"/)
  assert.match(email.html, /title="Dein Platz H10"/)
  assert.equal([...email.html.matchAll(/title="(?:Dein Platz|Platz) [A-Z]\d+"/g)].length, 78)
})

test('poster asset exists and has placeholder metadata', () => {
  assert.equal(existsSync(new URL('../public/img/romeo-und-julia-2026-poster.jpg', import.meta.url)), true)
  const meta = placeholders['/img/romeo-und-julia-2026-poster.jpg']
  assert.ok(meta)
  assert.equal(meta.width, 905)
  assert.equal(meta.height, 1280)
  assert.match(meta.blurDataURL, /^data:image\/webp;base64,/)
})
