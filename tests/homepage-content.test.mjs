import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8')

test('homepage shows the post-show thank-you message', () => {
  assert.match(source, /Danke für euren Besuch/)
  assert.match(source, /Das war die\{' '\}[\s\S]*Creepshow\./)
  assert.match(
    source,
    /Danke an alle, die bei unseren Vorstellungen auf der Kolpingwiese[\s\S]*dabei waren\./,
  )
})

test('homepage announces where winter and summer news will appear', () => {
  assert.match(source, /Stay tuned/)
  assert.match(source, /welches Stück wir[\s\S]*im Winter spielen/)
  assert.match(source, /was im nächsten Sommer auf die Bühne[\s\S]*kommt/)
})

test('homepage uses the established social channel URLs', () => {
  assert.match(source, /https:\/\/www\.instagram\.com\/kolpingtheater_ramsen\//)
  assert.match(source, /https:\/\/www\.youtube\.com\/@kolpingtheaterramsen/)
})

test('homepage metadata describes the temporary post-show state', () => {
  assert.match(source, /Danke für euren Besuch \| Kolpingtheater Ramsen/)
  assert.doesNotMatch(source, /Premiere · 22\. August 2026/)
})
