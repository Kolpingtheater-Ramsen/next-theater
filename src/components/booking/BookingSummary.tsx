import type { Play } from '@/types/database'
import { DEFAULT_VENUE,formatDay,seatLabel } from '@/lib/tickets'
export default function BookingSummary({play,seats,onEdit}:{play:Play;seats:number[];onEdit?:()=>void}) {
  return <aside className='ticket-panel ticket-summary' aria-label='Deine Reservierung'>
    <p className='ticket-eyebrow'>Dein Theaterabend</p><h3 className='ticket-section-title'>{play.title}</h3>
    <dl><div><dt>Vorstellung</dt><dd>{formatDay(play.date)}<br/>{play.time} Uhr</dd></div><div><dt>Spielort</dt><dd>{play.venue||DEFAULT_VENUE}</dd></div><div><dt>{seats.length===1?'Dein Platz':'Deine Plätze'}</dt><dd>{seats.map(seatLabel).join(' · ')}</dd></div>{onEdit&&<div><button className='ticket-back' type='button' onClick={onEdit}>Plätze ändern</button></div>}</dl>
    <div className='ticket-summary-price'><span>{seats.length} {seats.length===1?'Sitzplatz':'Sitzplätze'}</span><strong>Eintritt frei</strong></div>
  </aside>
}
