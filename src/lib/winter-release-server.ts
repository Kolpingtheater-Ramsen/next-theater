import { shouldShowWinterRelease } from './winter-release'

export type ReleaseSearchParams = Promise<
  Record<string, string | string[] | undefined>
>

/** Resolve winter release visibility from request query params. */
export async function getWinterReleaseState(
  searchParams?: ReleaseSearchParams,
) {
  const resolvedParams = searchParams
    ? await searchParams
    : ({} as Record<string, string | string[] | undefined>)

  return shouldShowWinterRelease({
    previewValue: resolvedParams.preview,
  })
}
