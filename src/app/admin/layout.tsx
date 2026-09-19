import type { Metadata } from 'next'
import AdminNavigation from '@/components/admin/AdminNavigation'
import './admin.css'

export const metadata: Metadata = {
  title: 'Theaterverwaltung | Kolpingtheater Ramsen',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className='admin-area'><AdminNavigation />{children}</div>
}
