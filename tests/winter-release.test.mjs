import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'

const require = createRequire(import.meta.url)
const { build } = require(
  require.resolve('esbuild', { paths: [require.resolve('wrangler')] }),
)
const compiled = await build({
  entryPoints: ['src/lib/winter-release.ts'],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'neutral',
  tsconfig: 'tsconfig.json',
})
const {
  bookingHref,
  isLocalHost,
  isWinterReleaseLive,
  shouldShowWinterRelease,
} = await import(
  `data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`
)

const homeSource = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8')
const bookingPageSource = readFileSync(new URL('../src/app/booking/page.tsx', import.meta.url), 'utf8')
const bookingComingSoonSource = readFileSync(new URL('../src/app/booking/BookingComingSoon.tsx', import.meta.url), 'utf8')
const bookingLayoutSource = readFileSync(new URL('../src/app/booking/layout.tsx', import.meta.url), 'utf8')
const headerSource = readFileSync(new URL('../src/components/Header.tsx', import.meta.url), 'utf8')
const placeholders = JSON.parse(readFileSync(new URL('../src/data/image-placeholders.json', import.meta.url), 'utf8'))

test('winter release activates at exactly 2026-12-01 00:00 CET', () => {
  assert.equal(isWinterReleaseLive(Date.parse('2026-11-30T23:59:59.999+01:00')), false)
  assert.equal(isWinterReleaseLive(Date.parse('2026-11-30T22:59:59.999Z')), false)
  assert.equal(isWinterReleaseLive(Date.parse('2026-12-01T00:00:00.000+01:00')), true)
  assert.equal(isWinterReleaseLive(Date.parse('2026-11-30T23:00:00.000Z')), true)
  assert.equal(isWinterReleaseLive(Date.parse('2026-12-27T17:00:00+01:00')), true)
})

test('preview parameter only enables winter release on localhost before Dec 1', () => {
  const before = Date.parse('2026-11-26T12:00:00+01:00')
  const after = Date.parse('2026-12-01T00:00:00+01:00')

  assert.equal(isLocalHost('localhost:3000'), true)
  assert.equal(isLocalHost('127.0.0.1:8788'), true)
  assert.equal(isLocalHost('[::1]:3000'), true)
  assert.equal(isLocalHost('kolpingtheater-ramsen.de'), false)
  assert.equal(isLocalHost('localhost.evil.com'), false)

  assert.deepEqual(
    shouldShowWinterRelease({ now: before, previewValue: 'winter', host: 'localhost:3000', envPreview: false }),
    { live: true, preview: true },
  )
  assert.deepEqual(
    shouldShowWinterRelease({ now: before, previewValue: 'winter', host: '127.0.0.1:8788', envPreview: false }),
    { live: true, preview: true },
  )
  assert.deepEqual(
    shouldShowWinterRelease({ now: before, previewValue: 'winter', host: 'kolpingtheater-ramsen.de', envPreview: false }),
    { live: false, preview: false },
  )
  assert.deepEqual(
    shouldShowWinterRelease({ now: before, previewValue: undefined, host: 'localhost:3000', envPreview: false }),
    { live: false, preview: false },
  )
  assert.deepEqual(
    shouldShowWinterRelease({ now: after, previewValue: 'winter', host: 'localhost:3000', envPreview: false }),
    { live: true, preview: false },
  )

  assert.equal(bookingHref(true), '/booking?preview=winter')
  assert.equal(bookingHref(false), '/booking')
})

test('homepage configures dynamic edge rendering, poster showcase, and exact poster dates', () => {
  assert.match(homeSource, /export const runtime = 'edge'/)
  assert.match(homeSource, /export const dynamic = 'force-dynamic'/)
  assert.match(homeSource, /winter-show/)
  assert.match(homeSource, /RomeoJuliaPoster/)
  assert.match(homeSource, /bookingHref\(preview\)/)
  assert.match(homeSource, /27\./)
  assert.match(homeSource, /28\./)
  assert.match(homeSource, /17:00/)
  assert.match(homeSource, /19:30/)
  assert.match(homeSource, /Pfarrheim/)
  assert.match(homeSource, /Klosterhof 7/)
  assert.match(homeSource, /Eintritt frei/)
  assert.match(homeSource, /Reservierung notwendig/)
  assert.doesNotMatch(homeSource, /29\.12|29\. Dezember/)
})

test('booking routes gate the production title and flow before Dec 1 without leaking Romeo', () => {
  assert.match(bookingPageSource, /export const runtime = 'edge'/)
  assert.match(bookingPageSource, /export const dynamic = 'force-dynamic'/)
  assert.match(bookingPageSource, /BookingComingSoon/)
  assert.match(bookingPageSource, /BookingFlow/)

  assert.doesNotMatch(bookingComingSoonSource, /Romeo|romeo-und-julia-2026/i)
  assert.doesNotMatch(bookingLayoutSource, /Romeo|romeo-und-julia-2026/i)
})

test('header gates Tickets via winter-release without useSearchParams', () => {
  assert.match(headerSource, /winter-release/)
  assert.doesNotMatch(headerSource, /useSearchParams/)
})

test('poster asset exists and has placeholder metadata', () => {
  assert.equal(existsSync(new URL('../public/img/romeo-und-julia-2026-poster.jpg', import.meta.url)), true)
  const meta = placeholders['/img/romeo-und-julia-2026-poster.jpg']
  assert.ok(meta)
  assert.equal(meta.width, 905)
  assert.equal(meta.height, 1280)
  assert.match(meta.blurDataURL, /^data:image\/webp;base64,/)
})
