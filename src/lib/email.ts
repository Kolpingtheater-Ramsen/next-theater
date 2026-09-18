import { Resend } from 'resend'
import type { Play } from '@/types/database'
import { escapeHtml, formatDay, seatLabel, DEFAULT_VENUE } from './tickets'

export type EmailStatus = 'sent' | 'failed' | 'not_configured'
type EmailConfig = { apiKey?: string; fromEmail: string; theaterName: string; replyToEmail: string }
type Recipient = { name: string; email: string; id?: string }

async function send(kind: 'confirmation' | 'modification' | 'cancellation', booking: Recipient, play: Play, seats: number[], config: EmailConfig, baseUrl: string): Promise<{ success: boolean; status: EmailStatus }> {
  if (!config.apiKey) return { success: false, status: 'not_configured' }
  const cancelled = kind === 'cancellation'
  const heading = cancelled ? 'Deine Buchung wurde storniert' : kind === 'modification' ? 'Deine Sitzplätze wurden geändert' : 'Deine Plätze sind reserviert'
  const url = cancelled ? `${baseUrl}/booking` : `${baseUrl}/booking/view/${booking.id}`
  const seatText = [...seats].sort((a,b) => a-b).map(seatLabel).join(', ')
  const info = `${play.title}\n${formatDay(play.date, true)} · ${play.time} Uhr\n${play.venue || DEFAULT_VENUE}\nPlätze: ${seatText}`
  const action = cancelled ? 'Andere Vorstellung wählen' : 'Ticket öffnen und verwalten'
  const note = cancelled ? 'Die Plätze sind wieder für andere Gäste verfügbar.' : 'Der Eintritt ist frei. Bitte sei 15 Minuten vor Beginn da. Ein Ticket gilt für alle reservierten Plätze. Deinen privaten Ticketlink bitte nicht weitergeben. Du kannst darüber deine Plätze ändern oder die Buchung stornieren.'
  const text = `Hallo ${booking.name},\n\n${heading}.\n\n${info}\n\n${note}\n\n${action}:\n${url}\n\n${config.theaterName}`
  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f4f1ec;color:#20201f;font:16px/1.6 Arial,sans-serif"><div style="max-width:580px;margin:32px auto;padding:32px;background:white;border-radius:16px"><p style="font-size:12px;letter-spacing:2px;color:#995000">${escapeHtml(config.theaterName)}</p><h1 style="font-size:28px;line-height:1.2">${escapeHtml(heading)}</h1><p>Hallo ${escapeHtml(booking.name)},</p><div style="padding:20px;background:#f8f5ef;border-radius:12px"><h2 style="margin:0 0 12px;font-size:24px">${escapeHtml(play.title)}</h2><p style="margin:0">${escapeHtml(formatDay(play.date,true))} · ${escapeHtml(play.time)} Uhr<br>${escapeHtml(play.venue || DEFAULT_VENUE)}<br><strong>Plätze: ${escapeHtml(seatText)}</strong></p></div><p>${escapeHtml(note)}</p><p style="margin:28px 0"><a href="${escapeHtml(url)}" style="background:#a84d08;color:white;padding:14px 20px;text-decoration:none;border-radius:8px;display:inline-block">${action}</a></p><p style="font-size:13px;color:#666">Falls der Button nicht funktioniert:<br><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p></div></body></html>`
  try {
    let timeout: ReturnType<typeof setTimeout> | undefined
    const result = await Promise.race([
      new Resend(config.apiKey).emails.send({ from: `${config.theaterName} <${config.fromEmail}>`, to: booking.email, replyTo: config.replyToEmail, subject: `${heading}: ${play.title}`, html, text }),
      new Promise<never>((_, reject) => { timeout = setTimeout(() => reject(new Error('Email timeout')), 8000) }),
    ]).finally(() => clearTimeout(timeout))
    return { success: !result.error, status: result.error ? 'failed' : 'sent' }
  } catch { return { success: false, status: 'failed' } }
}

export function emailConfig(env: CloudflareEnv): EmailConfig {
  return { apiKey: env.RESEND_API_KEY, fromEmail: env.FROM_EMAIL || 'ticket-noreply@kolpingtheater-ramsen.de', theaterName: env.THEATER_NAME || 'Kolpingtheater Ramsen', replyToEmail: env.REPLY_TO_EMAIL || 'kolpingtheaterramsen@gmail.com' }
}
export function sendBookingConfirmation(booking: Recipient, play: Play, seats: number[], config: EmailConfig, baseUrl: string) { return send('confirmation',booking,play,seats,config,baseUrl) }
export function sendBookingModification(booking: Recipient, play: Play, seats: number[], _oldSeats: number[], config: EmailConfig, baseUrl: string) { return send('modification',booking,play,seats,config,baseUrl) }
export function sendCancellationConfirmation(booking: Recipient, play: Play, seats: number[], config: EmailConfig, baseUrl: string) { return send('cancellation',booking,play,seats,config,baseUrl) }
