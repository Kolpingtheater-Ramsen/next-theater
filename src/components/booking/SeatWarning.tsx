'use client'

import { seatLabel } from '@/lib/tickets'
import type { SeatPolicyResult } from '@/lib/seat-policy'

type Props = {
  policy: SeatPolicyResult
  onAcceptSuggestion: (seats: number[]) => void
  disabled?: boolean
}

export default function SeatWarning({ policy, onAcceptSuggestion, disabled = false }: Props) {
  if (!policy.notice) return null
  const suggestion = policy.suggestedSeats
  return <div className='ticket-notice ticket-notice-warning'>
    <div role='status' aria-live='polite'>
      <p>{policy.notice}</p>
      {suggestion ? <p className='ticket-recommendation'><strong>Empfehlung: {suggestion.map(seatLabel).join(' · ')}</strong><br/>Gleiche Anzahl, ohne neue Einzellücken.</p>
        : <p className='ticket-recommendation'>Für diese Platzanzahl ist aktuell keine Alternative ohne neue Einzellücken verfügbar.</p>}
    </div>
    {suggestion && <button type='button' className='ticket-button ticket-recommendation-button' disabled={disabled} onClick={() => onAcceptSuggestion(suggestion)}>Empfehlung übernehmen</button>}
  </div>
}
