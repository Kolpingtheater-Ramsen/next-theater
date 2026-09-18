import { Resend } from 'resend'
import type { Play } from '@/types/database'
import { renderBookingEmail, type BookingEmailKind, type EmailRecipient } from './booking-email'

export type EmailStatus = 'sent' | 'failed' | 'not_configured'
type EmailConfig = { apiKey?: string; fromEmail: string; theaterName: string; replyToEmail: string }
type Recipient = EmailRecipient

async function send(kind: BookingEmailKind, booking: Recipient, play: Play, seats: number[], config: EmailConfig, baseUrl: string): Promise<{ success: boolean; status: EmailStatus }> {
  if (!config.apiKey) return { success: false, status: 'not_configured' }
  const content = renderBookingEmail(kind, booking, play, seats, config.theaterName, baseUrl)
  try {
    let timeout: ReturnType<typeof setTimeout> | undefined
    const result = await Promise.race([
      new Resend(config.apiKey).emails.send({ from: `${config.theaterName} <${config.fromEmail}>`, to: booking.email, replyTo: config.replyToEmail, ...content }),
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
