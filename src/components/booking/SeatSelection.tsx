'use client'
import { useState } from 'react'
import { MAX_SEATS, SEATS_PER_ROW, seatLabel, seatNumbers } from '@/lib/tickets'
import { seatPolicy } from '@/lib/seat-policy'

type Props={bookedSeats:number[];selectedSeats:number[];originalSeats?:number[];onChange:(seats:number[])=>void;onContinue:()=>void;totalSeats:number;disabled?:boolean;continueLabel?:string}
export default function SeatSelection({bookedSeats,selectedSeats,originalSeats=[],onChange,onContinue,totalSeats,disabled=false,continueLabel='Weiter'}:Props) {
  const [notice,setNotice]=useState('')
  const numbers=seatNumbers(totalSeats), allowed=new Set(numbers)
  const rows=Math.ceil((totalSeats+2)/SEATS_PER_ROW)
  const policy=seatPolicy(totalSeats,bookedSeats,selectedSeats,originalSeats)
  function toggle(seat:number) {
    setNotice('')
    if(selectedSeats.includes(seat)) onChange(selectedSeats.filter(s=>s!==seat))
    else if(selectedSeats.length>=MAX_SEATS) setNotice('Du kannst bis zu fünf Plätze reservieren. Entferne zuerst einen Platz aus deiner Auswahl.')
    else onChange([...selectedSeats,seat].sort((a,b)=>a-b))
  }
  function seat(number:number) {
    if(!allowed.has(number)) return <span key={number} className='ticket-seat-spacer' aria-hidden='true'/>
    const taken=bookedSeats.includes(number),selected=selectedSeats.includes(number)
    return <button key={number} type='button' className='ticket-seat' disabled={disabled||taken} aria-pressed={selected} aria-label={`Platz ${seatLabel(number)}, ${taken?'belegt':selected?'ausgewählt':'frei'}`} onClick={()=>toggle(number)}>{number%10+1}</button>
  }
  return <>
    <p className='ticket-notice'>Bitte wähle zusammenhängende Plätze und lass keine einzelnen Plätze frei. So können auch andere Gäste zusammensitzen.</p>
    <div className='ticket-seat-toolbar'>
      <div className='ticket-seat-legend'><span><i/>Frei</span><span><i className='chosen'/>Deine Auswahl</span><span><i className='taken'/>Belegt</span></div>
    </div>
    <div className='ticket-panel'>
      <div className='ticket-map-view'>
        <p className='ticket-muted md:hidden text-xs mb-2'>Du kannst den Saalplan seitlich verschieben.</p>
        <div className='ticket-map-scroll' tabIndex={0} role='region' aria-label='Saalplan, horizontal scrollbar'>
          <div className='ticket-map'><div className='ticket-stage'>BÜHNE</div>
            {Array.from({length:rows},(_,r)=><div className='ticket-seat-row' key={r}><span className='ticket-row-letter'>{String.fromCharCode(65+r)}</span>{Array.from({length:5},(_,i)=>seat(r*10+i))}<span aria-hidden='true'/>{Array.from({length:5},(_,i)=>seat(r*10+5+i))}</div>)}
          </div>
        </div>
      </div>
    </div>
    {policy.issue&&<div className='ticket-error' role='status' aria-live='polite'>
      <p>{policy.issue.message}</p>
      {policy.suggestion&&<button type='button' className='ticket-back' disabled={disabled} onClick={()=>{setNotice('');onChange(policy.suggestion!)}}>Vorschlag übernehmen: {policy.suggestion.map(seatLabel).join(' · ')}</button>}
    </div>}
    {notice&&<p role='alert' className='ticket-error'>{notice}</p>}
    <div className='ticket-seat-footer'>
      <div className='ticket-seat-summary' aria-live='polite'>{selectedSeats.length} von {MAX_SEATS} Plätzen<strong>{selectedSeats.length?selectedSeats.map(seatLabel).join(' · '):'Wähle deine Plätze'}</strong></div>
      <button type='button' className='ticket-button ticket-button-primary' onClick={onContinue} disabled={disabled||!selectedSeats.length||!!policy.issue}>{continueLabel} <span aria-hidden='true'>→</span></button>
    </div>
    <p className='ticket-muted text-xs mt-4'>Die Plätze sind nach Abschluss deiner Buchung verbindlich reserviert.</p>
  </>
}
