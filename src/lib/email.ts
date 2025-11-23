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
 * Booking confirmation email template (HTML)
 */
function getConfirmationEmailHTML(data: {
  name: string
  date: string
  time: string
  seats: string
  bookingUrl: string
  bannerUrl: string
}): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;"> 
  <p>Hallo ${data.name},</p>
  
  <p>vielen Dank für deine Reservierung!</p>
  
  <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 5px;">DEINE BUCHUNGSDETAILS:</h2>
  <ul style="list-style: none; padding-left: 0;">
    <li style="margin-bottom: 10px;">📅 <strong>Datum:</strong> ${data.date}</li>
    <li style="margin-bottom: 10px;">🕐 <strong>Uhrzeit:</strong> ${data.time}</li>
    <li style="margin-bottom: 10px;">💺 <strong>Sitzplätze:</strong> ${data.seats}</li>
  </ul>
  
  <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 5px;">WICHTIGE INFORMATIONEN:</h2>
  <ul style="list-style: none; padding-left: 0;">
    <li style="margin-bottom: 8px;">✓ Bitte erscheine 15 Minuten vor Vorstellungsbeginn</li>
    <li style="margin-bottom: 8px;">✓ Zeige dein Ticket (QR-Code) am Einlass vor</li>
    <li style="margin-bottom: 8px;">✓ Deine Platzreservierung ist verbindlich</li>
    <li style="margin-bottom: 8px;">✓ Der Eintritt ist kostenfrei</li>
  </ul>
  
  <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 5px;">DEIN TICKET:</h2>
  <p>🎟️ <a href="${data.bookingUrl}" style="color: #0066cc; text-decoration: none; font-weight: bold;">Online-Ticket ansehen</a></p>
  
  <p>Du kannst dein Ticket auch auf deinem Smartphone speichern und am Eingang vorzeigen.</p>
  
  <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 5px;">STORNIERUNG:</h2>
  <p>Falls du nicht kommen kannst, kannst du deine Buchung hier stornieren: <a href="${data.bookingUrl}" style="color: #0066cc; text-decoration: none; font-weight: bold;">Stornierung</a>
  Bitte gib anderen die Chance, die Plätze zu nutzen.</p>
  
  <p>Wir freuen uns auf dein Kommen!</p>
  
  <p><strong>Die Kolping-Theatergruppe<br>
  Winterstück 2025 - Schicksalsfäden</strong></p>
  
  <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
  <p style="font-size: 12px; color: #666;">Bei Fragen oder Problemen kannst du uns gerne kontaktieren.</p>
  
  <img src="${data.bannerUrl}" alt="Schicksalsfäden" style="width: 100%; max-width: 600px; height: auto; display: block; margin-top: 30px;" />
</body>
</html>`
}

/**
 * Booking confirmation email template (plain text)
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
Winterstück 2025 - Schicksalsfäden

---
Bei Fragen oder Problemen kannst du uns gerne kontaktieren.
`
}

/**
 * Cancellation confirmation email template (HTML)
 */
function getCancellationEmailHTML(data: {
  name: string
  date: string
  time: string
  seats: string
  bookingUrl: string
  bannerUrl: string
}): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p>Hallo ${data.name},</p>
  
  <p>hiermit bestätigen wir die Stornierung deiner Buchung.</p>
  
  <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 5px;">STORNIERTE BUCHUNG:</h2>
  <ul style="list-style: none; padding-left: 0;">
    <li style="margin-bottom: 10px;">📅 <strong>Datum:</strong> ${data.date}</li>
    <li style="margin-bottom: 10px;">🕐 <strong>Uhrzeit:</strong> ${data.time}</li>
    <li style="margin-bottom: 10px;">💺 <strong>Sitzplätze:</strong> ${data.seats}</li>
  </ul>
  
  <p>Die Sitzplätze wurden freigegeben und stehen anderen Besuchern zur Verfügung.</p>
  
  <p>Wir hoffen, dass du zu einem anderen Termin kommen kannst! <a href="${data.bookingUrl}" style="color: #0066cc; text-decoration: none; font-weight: bold;">Neue Buchung vornehmen</a></p>
  
  <p><strong>Die Kolping-Theatergruppe<br>
  Winterstück 2025 - Schicksalsfäden</strong></p>
  
  <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
  <p style="font-size: 12px; color: #666;">Bei Fragen oder Problemen kannst du uns gerne kontaktieren.</p>
  
  <img src="${data.bannerUrl}" alt="Schicksalsfäden" style="width: 100%; max-width: 600px; height: auto; display: block; margin-top: 30px;" />
</body>
</html>`
}

/**
 * Cancellation confirmation email template (plain text)
 */
function getCancellationEmailBody(data: {
  name: string
  date: string
  time: string
  seats: string
  bookingUrl: string
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
Neue Buchung vornehmen: ${data.bookingUrl}

Die Kolping-Theatergruppe
Winterstück 2025 - Schicksalsfäden

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

    const bannerUrl = `${baseUrl}/img/banners/schicksal.jpg`
    
    await resend.emails.send({
      from: `${config.theaterName} <${config.fromEmail}>`,
      to: booking.email,
      replyTo: config.replyToEmail,
      subject: 'Deine Reservierung für das Winterstück 2025 - Schicksalsfäden',
      html: getConfirmationEmailHTML({
        name: booking.name,
        date: formattedDate,
        time: play.time,
        seats: seatLabels,
        bookingUrl,
        bannerUrl,
      }),
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
  config: EmailConfig,
  baseUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = new Resend(config.apiKey)
    
    const seatLabels = getSeatLabels(seats)
    const formattedDate = formatDate(play.date)
    const bannerUrl = `${baseUrl}/img/banners/schicksal.jpg`
    const bookingUrl = `${baseUrl}/booking`

    await resend.emails.send({
      from: `${config.theaterName} <${config.fromEmail}>`,
      to: booking.email,
      replyTo: config.replyToEmail,
      subject: 'Stornierungsbestätigung - Winterstück 2025',
      html: getCancellationEmailHTML({
        name: booking.name,
        date: formattedDate,
        time: play.time,
        seats: seatLabels,
        bookingUrl,
        bannerUrl,
      }),
      text: getCancellationEmailBody({
        name: booking.name,
        date: formattedDate,
        time: play.time,
        seats: seatLabels,
        bookingUrl,
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

