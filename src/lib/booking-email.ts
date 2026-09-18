import type { Play } from '@/types/database'
import { escapeHtml, formatDay, seatLabel, seatNumbers, SEATS_PER_ROW, DEFAULT_VENUE } from './tickets'

export type BookingEmailKind = 'confirmation' | 'modification' | 'cancellation'
export type EmailRecipient = { name: string; email: string; id?: string }

function seatMap(capacity: number, seats: number[]) {
  const available = new Set(seatNumbers(capacity))
  const selected = new Set(seats.filter(seat => available.has(seat)))
  if (!selected.size) return { html: '', text: '' }
  const ordered = [...selected].sort((a, b) => a - b)
  const labels = ordered.map(seatLabel).join(', ')
  const rows = Math.ceil((Math.max(...available) + 1) / SEATS_PER_ROW)
  const mapRows = Array.from({ length: rows }, (_, row) => {
    const cells = Array.from({ length: SEATS_PER_ROW }, (_, column) => {
      const seat = row * SEATS_PER_ROW + column
      const aisle = column === SEATS_PER_ROW / 2
        ? '<td width="6%" aria-hidden="true" style="font-size:0;line-height:30px">&nbsp;</td>' : ''
      if (!available.has(seat)) return `${aisle}<td aria-hidden="true">&nbsp;</td>`
      const chosen = selected.has(seat)
      const background = chosen ? '#a84d08' : '#ece8e2'
      return `${aisle}<td align="center" valign="middle" bgcolor="${background}" title="${chosen ? 'Dein Platz' : 'Platz'} ${seatLabel(seat)}" style="background:${background};color:${chosen ? '#ffffff' : '#555555'};border:${chosen ? '2px solid #703205' : '1px solid #d6d0c8'};border-radius:4px;font: ${chosen ? 'bold ' : ''}11px/30px Arial,sans-serif;height:30px">${chosen ? `<strong>${column + 1}</strong>` : column + 1}</td>`
    }).join('')
    return `<tr><td width="6%" align="left" style="font:bold 12px Arial,sans-serif;color:#555555">${String.fromCharCode(65 + row)}</td>${cells}</tr>`
  }).join('')
  const html = `<div style="margin:24px 0">
    <h2 style="margin:0 0 8px;font: bold 20px/1.3 Arial,sans-serif">Hier sitzt du</h2>
    <p style="margin:0 0 12px;font-size:13px;color:#555555">Blick zur Bühne. Reihe A ist ganz vorn.</p>
    <div role="img" aria-label="Saalplan, Blick zur Bühne. Deine Plätze: ${labels}.">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:10px"><tr><td align="center" bgcolor="#38332e" style="background:#38332e;color:#ffffff;padding:8px;font:bold 12px Arial,sans-serif;letter-spacing:2px">BÜHNE</td></tr></table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="2" style="width:100%;table-layout:fixed;border-spacing:2px">${mapRows}</table>
    </div>
    <p style="margin:10px 0 0;font-size:13px;color:#555555"><strong style="color:#a84d08">Deine Plätze: ${labels}</strong><br>Der Abstand in der Mitte ist der Mittelgang. Grau zeigt die weiteren Plätze im Saal, nicht deren Verfügbarkeit.</p>
  </div>`
  const text = `Deine Plätze im Saal (Blick zur Bühne, Reihe A ganz vorn):\n${ordered.map(seat => `${seatLabel(seat)}: Reihe ${String.fromCharCode(65 + Math.floor(seat / SEATS_PER_ROW))}, Platz ${seat % SEATS_PER_ROW + 1}, ${seat % SEATS_PER_ROW < SEATS_PER_ROW / 2 ? 'links' : 'rechts'} vom Mittelgang.`).join('\n')}`
  return { html, text }
}

export function renderBookingEmail(kind: BookingEmailKind, booking: EmailRecipient, play: Play, seats: number[], theaterName: string, baseUrl: string) {
  const cancelled = kind === 'cancellation'
  const heading = cancelled ? 'Deine Buchung wurde storniert' : kind === 'modification' ? 'Deine Sitzplätze wurden geändert' : 'Deine Plätze sind reserviert'
  const url = cancelled ? `${baseUrl}/booking` : `${baseUrl}/booking/view/${booking.id}`
  const seatText = [...seats].sort((a,b) => a-b).map(seatLabel).join(', ')
  const info = `${play.title}\n${formatDay(play.date, true)} · ${play.time} Uhr\n${play.venue || DEFAULT_VENUE}\nPlätze: ${seatText}`
  const action = cancelled ? 'Andere Vorstellung wählen' : 'Ticket öffnen und verwalten'
  const note = cancelled ? 'Die Plätze sind wieder für andere Gäste verfügbar.' : 'Der Eintritt ist frei. Bitte sei 15 Minuten vor Beginn da. Ein Ticket gilt für alle reservierten Plätze. Deinen privaten Ticketlink bitte nicht weitergeben. Du kannst darüber deine Plätze ändern oder die Buchung stornieren.'
  const map = cancelled ? { html: '', text: '' } : seatMap(play.total_seats, seats)
  const text = `Hallo ${booking.name},\n\n${heading}.\n\n${info}${map.text ? `\n\n${map.text}` : ''}\n\n${note}\n\n${action}:\n${url}\n\n${theaterName}`
  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f4f1ec;color:#20201f;font:16px/1.6 Arial,sans-serif"><div style="max-width:580px;margin:32px auto;padding:24px;background:white;border-radius:16px"><p style="font-size:12px;letter-spacing:2px;color:#995000">${escapeHtml(theaterName)}</p><h1 style="font-size:28px;line-height:1.2">${escapeHtml(heading)}</h1><p>Hallo ${escapeHtml(booking.name)},</p><div style="padding:20px;background:#f8f5ef;border-radius:12px"><h2 style="margin:0 0 12px;font-size:24px">${escapeHtml(play.title)}</h2><p style="margin:0">${escapeHtml(formatDay(play.date,true))} · ${escapeHtml(play.time)} Uhr<br>${escapeHtml(play.venue || DEFAULT_VENUE)}<br><strong>Plätze: ${escapeHtml(seatText)}</strong></p></div>${map.html}<p>${escapeHtml(note)}</p><p style="margin:28px 0"><a href="${escapeHtml(url)}" style="background:#a84d08;color:white;padding:14px 20px;text-decoration:none;border-radius:8px;display:inline-block">${action}</a></p><p style="font-size:13px;color:#666">Falls der Button nicht funktioniert:<br><a href="${escapeHtml(url)}" style="overflow-wrap:anywhere;word-break:break-all">${escapeHtml(url)}</a></p></div></body></html>`
  return { subject: `${heading}: ${play.title}`, html, text }
}
