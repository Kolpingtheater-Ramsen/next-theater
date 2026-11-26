export const WINTER_RELEASE_ISO = '2026-12-01T00:00:00+01:00'
export const WINTER_RELEASE_MS = Date.parse(WINTER_RELEASE_ISO)
export const WINTER_PREVIEW_PARAM = 'winter'
export const MAX_TIMEOUT_MS = 2_147_483_647

type PreviewInput = {
  previewValue?: string | string[] | null
  host?: string | null
  envPreview?: boolean
}

export function isWinterReleaseLive(now = Date.now()): boolean {
  return now >= WINTER_RELEASE_MS
}

export function isRomeoJuliaPerformance(playId: string): boolean {
  return playId.startsWith('romeo-julia-2026-')
}

export function isLocalHost(host: string | null | undefined): boolean {
  if (!host) return false
  const normalized = host.trim().toLowerCase()
  if (!normalized) return false

  const hostname = normalized.startsWith('[')
    ? normalized.slice(1, normalized.indexOf(']'))
    : normalized === '::1'
      ? '::1'
      : normalized.split(':')[0]

  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1'
  )
}

export function isWinterPreviewEnabled(input?: PreviewInput): boolean {
  const envPreview =
    input?.envPreview ??
    (typeof process !== 'undefined' &&
      process.env?.WINTER_RELEASE_PREVIEW === '1')
  if (envPreview) return true

  const rawPreview = input?.previewValue
  const value = Array.isArray(rawPreview) ? rawPreview[0] : rawPreview
  return value === WINTER_PREVIEW_PARAM
}

export function shouldShowWinterRelease(
  options?: PreviewInput & { now?: number },
): { live: boolean; preview: boolean } {
  if (isWinterReleaseLive(options?.now)) {
    return { live: true, preview: false }
  }
  const preview = isWinterPreviewEnabled(options)
  return { live: preview, preview }
}

export function bookingHref(preview: boolean): string {
  return preview ? `/booking?preview=${WINTER_PREVIEW_PARAM}` : '/booking'
}

export function homeHref(preview: boolean): string {
  return preview ? `/?preview=${WINTER_PREVIEW_PARAM}` : '/'
}
