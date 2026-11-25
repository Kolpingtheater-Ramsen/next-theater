import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8')
const nominationSource = readFileSync(
  new URL('../src/app/engagementpreis-2026/page.tsx', import.meta.url),
  'utf8',
)

test('homepage shows the post-show thank-you message', () => {
  assert.match(source, /Danke für euren Besuch/)
  assert.match(source, /Das war die\{' '\}[\s\S]*Creepshow\./)
  assert.match(
    source,
    /Danke an alle, die bei unseren Vorstellungen auf der Kolpingwiese[\s\S]*dabei waren\./,
  )
})

test('homepage announces where winter and summer news will appear', () => {
  assert.match(source, /Wie es weitergeht/)
  assert.match(source, /welches Stück wir[\s\S]*im Winter spielen/)
  assert.match(source, /was im nächsten Sommer auf die Bühne[\s\S]*kommt/)
})

test('homepage uses the established social channel URLs', () => {
  assert.match(source, /https:\/\/www\.instagram\.com\/kolpingtheater_ramsen\//)
  assert.match(source, /https:\/\/www\.youtube\.com\/@kolpingtheaterramsen/)
})

test('homepage metadata highlights the current nomination', () => {
  assert.match(
    source,
    /Für den Deutschen Engagementpreis 2026 nominiert \| Kolpingtheater Ramsen/,
  )
  assert.match(source, /deutscher-engagementpreis-2026-banner\.png/)
  assert.match(source, /post-show-nominated/)
  assert.doesNotMatch(source, /Premiere · 22\. August 2026/)
})

const officialNominationLink =
  "href='https://www.deutscher-engagementpreis.de/engagiertenfinder/engagiertendetails/6728-kolpingsfamilie-ramsen-mit-kolping-openair-theater'"

test('homepage presents and links the nomination announcement', () => {
  assert.match(source, /Wir sind[\s\S]*nominiert\./)
  assert.match(source, /Jugend-Engagement-Wettbewerb RLP/)
  assert.match(source, /href='\/engagementpreis-2026'/)
  assert.ok(source.includes(officialNominationLink))
  assert.match(source, /Publikumsvoting seit dem 29\. Oktober 2026 beendet/)
})

test('nomination page carries the project story and verified 2026 facts', () => {
  assert.match(nominationSource, /Seit 2014 schreiben, bauen, organisieren und spielen/)
  assert.match(nominationSource, /Jugend-Engagement-Wettbewerb RLP/)
  assert.match(nominationSource, /626/)
  assert.match(nominationSource, /170/)
  assert.match(nominationSource, /1\.–29\. Oktober 2026/)
  assert.match(nominationSource, /26\. November 2026/)
  assert.match(nominationSource, /10\.000 Euro/)
  assert.equal(nominationSource.split(officialNominationLink).length - 1, 2)
})

test('closed voting is not advertised on either page or in metadata', () => {
  for (const pageSource of [source, nominationSource]) {
    assert.match(pageSource, /description:\s*'[^']*Publikumsvoting ist beendet/)
    assert.match(pageSource, /Danke an alle, die für unser/)
    assert.doesNotMatch(pageSource, /Jetzt.+abstimmen|ist geöffnet|Abstimmen bis|Stimmt bis|publikumspreis\/nominierte/)
  }
})

test('homepage preserves the historical productions and repertoire', () => {
  assert.match(source, /Vergangene <span[^>]*>Stücke\.<\/span>/)
  assert.match(source, /Alle Galerien/)
  assert.match(source, /<Marquee items=\{marqueeItems\}/)
  assert.match(source, /<FeaturedProductions items=\{featuredItems\}/)
})

test('homepage omits the finished production FAQ', () => {
  assert.doesNotMatch(source, /Häufige <span[^>]*>Fragen\.<\/span>/)
  assert.doesNotMatch(source, /id=['"]faq['"]|faq-heading|@\/data\/faq\.json/)
})

test('homepage preserves non-current-show sections', () => {
  assert.match(source, /Jugend-Engagement-Preis/)
  assert.match(source, /Kontakt &amp; Anfahrt/)
})
