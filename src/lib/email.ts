// Email utility for sending booking confirmations
import { Resend } from 'resend'
import type { Play } from '@/types/database'

interface EmailConfig {
  apiKey: string
  fromEmail: string
  theaterName: string
  replyToEmail: string
}

/**
 * Format date for German locale (e.g., "Sa, 27.12.2025")
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Get seat labels for display (e.g., "A1, A2, B3")
 */
function getSeatLabels(seats: number[]): string {
  return seats
    .sort((a, b) => a - b)
    .map((seatNumber) => {
      const row = Math.floor(seatNumber / 10)
      const seatInRow = seatNumber % 10
      return `${String.fromCharCode(65 + row)}${seatInRow + 1}`
    })
    .join(', ')
}

/**
 * Booking confirmation email template
 */
function getConfirmationEmailBody(data: {
  name: string
  date: string
  time: string
  seats: string
  bookingUrl: string
}): string {
  return `Hallo ${data.name},

vielen Dank für deine Reservierung!

DEINE BUCHUNGSDETAILS:
━━━━━━━━━━━━━━━━━━━━━━━
📅 Datum: ${data.date}
🕐 Uhrzeit: ${data.time}
💺 Sitzplätze: ${data.seats}

WICHTIGE INFORMATIONEN:
━━━━━━━━━━━━━━━━━━━━━━━
✓ Bitte erscheine 15 Minuten vor Vorstellungsbeginn
✓ Zeige dein Ticket (QR-Code) am Einlass vor
✓ Deine Platzreservierung ist verbindlich
✓ Der Eintritt ist kostenfrei

DEIN TICKET:
━━━━━━━━━━━━━━━━━━━━━━━
🎟️ Online-Ticket ansehen:
${data.bookingUrl}

Du kannst dein Ticket auch auf deinem Smartphone speichern und am Eingang vorzeigen.

STORNIERUNG:
━━━━━━━━━━━━━━━━━━━━━━━
Falls du nicht kommen kannst, kannst du deine Buchung über den obigen Link stornieren.
Bitte gib anderen die Chance, die Plätze zu nutzen.

Wir freuen uns auf dein Kommen!

Die Kolping-Theatergruppe
Winterstück 2025 - Schicksalfäden

---
Bei Fragen oder Problemen kannst du uns gerne kontaktieren.
`
}

/**
 * Cancellation confirmation email template
 */
function getCancellationEmailBody(data: {
  name: string
  date: string
  time: string
  seats: string
}): string {
  return `Hallo ${data.name},

hiermit bestätigen wir die Stornierung deiner Buchung.

STORNIERTE BUCHUNG:
━━━━━━━━━━━━━━━━━━━━━━━
📅 Datum: ${data.date}
🕐 Uhrzeit: ${data.time}
💺 Sitzplätze: ${data.seats}

Die Sitzplätze wurden freigegeben und stehen anderen Besuchern zur Verfügung.

Wir hoffen, dass du zu einem anderen Termin kommen kannst!

Die Kolping-Theatergruppe
Winterstück 2025 - Schicksalfäden

---
Bei Fragen oder Problemen kannst du uns gerne kontaktieren.
`
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmation(
  booking: {
    name: string
    email: string
    id: string
  },
  play: Play,
  seats: number[],
  config: EmailConfig,
  baseUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = new Resend(config.apiKey)
    
    const bookingUrl = `${baseUrl}/booking/view/${booking.id}`
    const seatLabels = getSeatLabels(seats)
    const formattedDate = formatDate(play.date)

    await resend.emails.send({
      from: `${config.theaterName} <${config.fromEmail}>`,
      to: booking.email,
      replyTo: config.replyToEmail,
      subject: 'Deine Reservierung für das Winterstück 2025 - Schicksalfäden',
      text: getConfirmationEmailBody({
        name: booking.name,
        date: formattedDate,
        time: play.time,
        seats: seatLabels,
        bookingUrl,
      }),
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send cancellation confirmation email
 */
export async function sendCancellationConfirmation(
  booking: {
    name: string
    email: string
  },
  play: Play,
  seats: number[],
  config: EmailConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = new Resend(config.apiKey)
    
    const seatLabels = getSeatLabels(seats)
    const formattedDate = formatDate(play.date)

    await resend.emails.send({
      from: `${config.theaterName} <${config.fromEmail}>`,
      to: booking.email,
      replyTo: config.replyToEmail,
      subject: 'Stornierungsbestätigung - Winterstück 2025',
      text: getCancellationEmailBody({
        name: booking.name,
        date: formattedDate,
        time: play.time,
        seats: seatLabels,
      }),
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error sending cancellation email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

