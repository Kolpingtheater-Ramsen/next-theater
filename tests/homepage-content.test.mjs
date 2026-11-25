import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8')
const aboutSource = readFileSync(new URL('../src/app/about/page.tsx', import.meta.url), 'utf8')
const pressSource = readFileSync(new URL('../src/app/presse/page.tsx', import.meta.url), 'utf8')
const timeline = JSON.parse(readFileSync(new URL('../src/data/timeline.json', import.meta.url), 'utf8'))

test('homepage presents the live Romeo & Julia winter production and gates booking CTA until Dec 1', () => {
  assert.match(source, /data-home-state='winter-show'/)
  assert.doesNotMatch(source, /data-home-state='post-show'/)
  assert.match(source, /Romeo &(?:amp;)? Julia – Ein Minidrama \| Kolpingtheater Ramsen/)
  assert.match(source, /Ein Minidrama/)
  assert.match(source, /Kreativbühne/)
  assert.match(source, /50 Minuten/)
  assert.match(source, /Eintritt frei/)
  assert.match(source, /images: \['\/img\/romeo-und-julia-2026-poster\.jpg'\]/)
  assert.match(source, /Reservierung ab 1\. Dezember/)
  assert.match(source, /Plätze reservieren/)
})

test('homepage uses the established social channel URLs', () => {
  assert.match(source, /https:\/\/www\.instagram\.com\/kolpingtheater_ramsen\//)
  assert.match(source, /https:\/\/www\.youtube\.com\/@kolpingtheaterramsen/)
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

test('homepage renders the Romeo & Julia FAQ and omits the legacy Creepshow FAQ', () => {
  assert.doesNotMatch(source, /@\/data\/faq\.json/)
  assert.match(source, /id='faq'/)
})

test('homepage preserves non-current-show sections', () => {
  assert.match(source, /Jugend-Engagement-Preis/)
  assert.match(source, /Kontakt &amp; Anfahrt/)
})
