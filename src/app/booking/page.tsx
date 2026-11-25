import type { Metadata } from 'next'
import {
  getWinterReleaseState,
  type ReleaseSearchParams,
} from '@/lib/winter-release-server'
import BookingComingSoon from './BookingComingSoon'
import BookingFlow from './BookingFlow'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

type BookingPageProps = { searchParams?: ReleaseSearchParams }

export async function generateMetadata({
  searchParams,
}: BookingPageProps): Promise<Metadata> {
  const { live } = await getWinterReleaseState(searchParams)
  return {
    title: live
      ? 'Tickets · Romeo & Julia | Kolpingtheater Ramsen'
      : 'Tickets | Kolpingtheater Ramsen',
  }
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { live } = await getWinterReleaseState(searchParams)
  return live ? <BookingFlow /> : <BookingComingSoon />
}
