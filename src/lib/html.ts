export function decodeHtmlEntities(input: string): string {
  // Fast-path for common case
  if (!input.includes('&')) return input

  const named: Record<string, string> = {
    quot: '"',
    amp: '&',
    lt: '<',
    gt: '>',
    apos: "'",
    nbsp: ' ',
  }

  return input.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (match, entity) => {
    if (typeof entity !== 'string') return match

    // Numeric entities
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
      const codePoint = Number.parseInt(entity.slice(2), 16)
      if (!Number.isFinite(codePoint)) return match
      try {
        return String.fromCodePoint(codePoint)
      } catch {
        return match
      }
    }
    if (entity.startsWith('#')) {
      const codePoint = Number.parseInt(entity.slice(1), 10)
      if (!Number.isFinite(codePoint)) return match
      try {
        return String.fromCodePoint(codePoint)
      } catch {
        return match
      }
    }

    // Named entities (limited set; leave unknown unchanged)
    return Object.prototype.hasOwnProperty.call(named, entity) ? named[entity]! : match
  })
}

