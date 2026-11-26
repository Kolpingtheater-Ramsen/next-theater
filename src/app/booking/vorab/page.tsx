import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { hasAdminSession } from '@/lib/admin-auth'
import BookingFlow from '../BookingFlow'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Reservierung für VIPs und Presse | Kolpingtheater Ramsen',
}

export default async function TeamBookingPage() {
  const token = (await cookies()).get('admin-token')?.value
  if (!(await hasAdminSession(token))) redirect('/admin?weiter=vorab')

  return <BookingFlow forGuest />
}
