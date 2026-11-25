import { headers } from 'next/headers'
import { shouldShowWinterRelease } from './winter-release'

export type ReleaseSearchParams = Promise<
  Record<string, string | string[] | undefined>
>

/** Resolve winter release visibility from request headers and query params. */
export async function getWinterReleaseState(
  searchParams?: ReleaseSearchParams,
) {
  const [headerList, resolvedParams] = await Promise.all([
    headers(),
    searchParams ??
      Promise.resolve({} as Record<string, string | string[] | undefined>),
  ])

  return shouldShowWinterRelease({
    previewValue: resolvedParams.preview,
    host: headerList.get('host'),
  })
}
