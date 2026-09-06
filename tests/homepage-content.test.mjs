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

test('homepage presents and links the nomination announcement', () => {
  assert.match(source, /Wir sind[\s\S]*nominiert\./)
  assert.match(source, /Jugend-Engagement-Wettbewerb RLP/)
  assert.match(source, /href='\/engagementpreis-2026'/)
  assert.match(source, /https:\/\/www\.deutscher-engagementpreis\.de\//)
  assert.match(source, /1\.–29\. Oktober 2026/)
})

test('nomination page carries the project story and verified 2026 facts', () => {
  assert.match(nominationSource, /Seit 2014 schreiben, bauen, organisieren und spielen/)
  assert.match(nominationSource, /Jugend-Engagement-Wettbewerb RLP/)
  assert.match(nominationSource, /626/)
  assert.match(nominationSource, /170/)
  assert.match(nominationSource, /1\.–29\. Oktober 2026/)
  assert.match(nominationSource, /26\. November 2026/)
  assert.match(nominationSource, /10\.000 Euro/)
  assert.match(nominationSource, /https:\/\/www\.deutscher-engagementpreis\.de\//)
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
