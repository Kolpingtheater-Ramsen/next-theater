import type { Metadata } from 'next'
import './tickets.css'
export const metadata:Metadata={title:'Tickets · Romeo und Julia | Kolpingtheater Ramsen',robots:{index:false,follow:false},referrer:'no-referrer'}
export default function BookingLayout({children}:{children:React.ReactNode}) {
  return <div className='ticket-flow'>{children}</div>
}
