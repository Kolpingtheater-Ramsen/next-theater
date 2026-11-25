import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8')
const aboutSource = readFileSync(new URL('../src/app/about/page.tsx', import.meta.url), 'utf8')
const pressSource = readFileSync(new URL('../src/app/presse/page.tsx', import.meta.url), 'utf8')
const timeline = JSON.parse(readFileSync(new URL('../src/data/timeline.json', import.meta.url), 'utf8'))

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

test('homepage metadata describes the theater and uses the Creepshow artwork', () => {
  assert.match(source, /Danke für euren Besuch \| Kolpingtheater Ramsen/)
  assert.match(source, /images: \['\/img\/creepshow-banner\.webp'\]/)
  assert.match(source, /data-home-state='post-show'/)
})

test('the removed national nomination is no longer promoted on the site', () => {
  for (const pageSource of [source, aboutSource, pressSource, JSON.stringify(timeline)]) {
    assert.doesNotMatch(pageSource, /Deutschen? Engagementpreis|engagementpreis-2026|Publikumsvoting/i)
  }
  assert.match(pressSource, /Jugend-Engagement-Wettbewerb RLP/)
  assert.ok(timeline.some(entry => entry.header.includes('Jugend-Engagement')))
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
