import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const { build } = require(require.resolve('esbuild', { paths: [require.resolve('wrangler')] }))
const compiled = await build({ entryPoints: ['src/lib/booking-email.ts'], bundle: true, write: false, format: 'esm', platform: 'neutral', tsconfig: 'tsconfig.json' })
const { renderBookingEmail } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`)
const play = { id: 'email-preview', title: 'Romeo und Julia', date: '2026-12-27', time: '17:00', total_seats: 68, venue: 'Klosterhof 7, 67305 Ramsen' }
const guest = { id: 'booking-preview-only', name: 'Testgast', email: 'preview@example.invalid' }
const render = (kind, seats, performance = play, recipient = guest) => renderBookingEmail(kind, recipient, performance, seats, 'Kolpingtheater Ramsen', 'https://theater.example.invalid')
const marked = html => [...html.matchAll(/title="Dein Platz ([A-Z]\d+)"/g)].map(match => match[1])

const transport = await build({
  entryPoints: ['src/lib/email.ts'], bundle: true, write: false, format: 'esm', platform: 'neutral', tsconfig: 'tsconfig.json',
  plugins: [{ name: 'installed-resend', setup(builder) {
    builder.onResolve({ filter: /^resend$/ }, () => ({ path: pathToFileURL(require.resolve('resend')).href, external: true }))
  } }],
})
const mail = await import(`data:text/javascript;base64,${Buffer.from(transport.outputFiles[0].text).toString('base64')}`)

test('confirmation locates the booked seats on both sides of the aisle and in the last row', () => {
  const message = render('confirmation', [69, 5, 22, 1, 4])
  assert.deepEqual(marked(message.html), ['A2', 'A5', 'A6', 'C3', 'G10'])
  assert.match(message.html, /BÜHNE/)
  assert.match(message.html, /Reihe A ist ganz vorn/)
  assert.match(message.html, /nicht deren Verfügbarkeit/)
  assert.equal([...message.html.matchAll(/title="(?:Dein Platz|Platz) [A-Z]\d+"/g)].length, 68)
  assert.doesNotMatch(message.html, /title="(?:Dein Platz|Platz) (?:A1|A10)"/)
  const rows = [...message.html.matchAll(/<tr>(.*?)<\/tr>/g)].slice(1)
  assert.equal(rows.length, 7)
  for (const [row] of rows) assert.equal([...row.matchAll(/<td\b/g)].length, 12)
  assert.match(message.text, /A5: Reihe A, Platz 5, links vom Mittelgang/)
  assert.match(message.text, /A6: Reihe A, Platz 6, rechts vom Mittelgang/)
  assert.match(message.text, /G10: Reihe G, Platz 10, rechts vom Mittelgang/)
  assert.doesNotMatch(message.html, /<(?:img|svg|script)\b|data:image|url\(/)
})

test('the map respects smaller venue capacities', () => {
  const message = render('confirmation', [14], { ...play, total_seats: 13 })
  assert.equal([...message.html.matchAll(/title="(?:Dein Platz|Platz) [A-Z]\d+"/g)].length, 13)
  assert.deepEqual(marked(message.html), ['B5'])
  assert.doesNotMatch(message.html, /title="(?:Dein Platz|Platz) (?:B6|C1)"/)
})

test('modification mails mark the resulting seats; cancellation mails do not show reserved seats', () => {
  const modified = render('modification', [12, 15])
  assert.match(modified.subject, /Sitzplätze wurden geändert/)
  assert.deepEqual(marked(modified.html), ['B3', 'B6'])
  const cancelled = render('cancellation', [12, 15])
  assert.deepEqual(marked(cancelled.html), [])
  assert.doesNotMatch(cancelled.html, /Hier sitzt du|BÜHNE/)
  assert.doesNotMatch(cancelled.text, /Deine Plätze im Saal/)
  assert.match(cancelled.text, /Plätze: B3, B6/)
  assert.match(cancelled.text, /wieder für andere Gäste verfügbar/)
})

test('guest and event text stays escaped and the private ticket link remains intact', () => {
  const message = render('confirmation', [2], { ...play, title: '<img src=x onerror=alert(1)>' }, { ...guest, name: 'Gast <script>alert(1)</script>' })
  assert.doesNotMatch(message.html, /<script>|<img\b/)
  assert.match(message.html, /&lt;script&gt;/)
  assert.match(message.html, /href="https:\/\/theater.example.invalid\/booking\/view\/booking-preview-only"/)
  assert.match(message.text, /https:\/\/theater.example.invalid\/booking\/view\/booking-preview-only/)
})

test('the real send functions include the map in confirmation and modification messages', async t => {
  const requests = []
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails')
    requests.push(JSON.parse(options.body))
    return Response.json({ id: 'local-email-test' })
  })
  const config = { apiKey: 're_local_test_only', fromEmail: 'from@example.invalid', replyToEmail: 'reply@example.invalid', theaterName: 'Kolpingtheater Ramsen' }
  const base = 'https://theater.example.invalid'
  assert.equal((await mail.sendBookingConfirmation(guest, play, [2, 69], config, base)).status, 'sent')
  assert.equal((await mail.sendBookingModification(guest, play, [15], [2, 69], config, base)).status, 'sent')
  assert.equal((await mail.sendCancellationConfirmation(guest, play, [15], config, base)).status, 'sent')
  assert.deepEqual(requests.map(message => marked(message.html)), [['A3', 'G10'], ['B6'], []])
  assert.match(requests[1].text, /B6: Reihe B, Platz 6, rechts vom Mittelgang/)
  assert.doesNotMatch(requests[1].text, /A3|G10/)
  assert.equal(requests[0].to, guest.email)
  assert.equal(requests[0].reply_to, config.replyToEmail)
  assert.equal((await mail.sendBookingConfirmation(guest, play, [2], { ...config, apiKey: undefined }, base)).status, 'not_configured')
  assert.equal(requests.length, 3)
})
