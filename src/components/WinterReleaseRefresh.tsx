'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MAX_TIMEOUT_MS, WINTER_RELEASE_MS } from '@/lib/winter-release'

export default function WinterReleaseRefresh() {
  const router = useRouter()

  useEffect(() => {
    const delay = WINTER_RELEASE_MS - Date.now()
    if (delay <= 0) {
      router.refresh()
      return
    }
    if (delay > MAX_TIMEOUT_MS) return

    const timer = window.setTimeout(() => {
      router.refresh()
    }, delay + 250)

    return () => window.clearTimeout(timer)
  }, [router])

  return null
}
