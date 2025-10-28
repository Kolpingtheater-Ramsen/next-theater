import { NextRequest, NextResponse } from 'next/server'
import { PKPass } from 'passkit-generator'
import path from 'path'
import fs from 'fs'

export const runtime = 'nodejs'

// Helper to get seat label
function getSeatLabel(seatNumber: number): string {
  const row = Math.floor(seatNumber / 10)
  const seatInRow = seatNumber % 10
  return `${String.fromCharCode(65 + row)}${seatInRow + 1}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, name, email, playDate, playTime, seats } = body

    // Validate required fields
    if (!bookingId || !name || !email || !playDate || !playTime || !seats) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Parse date and time
    const [year, month, day] = playDate.split('-')
    const [hours, minutes] = playTime.split(':')
    const eventDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    )

    // Format date for display
    const displayDate = eventDate.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    const displayTime = `${hours}:${minutes} Uhr`

    // Convert seat numbers to labels
    const seatLabels = seats.map((s: number) => getSeatLabel(s)).join(', ')

    // Check if certificates exist
    const certPath = path.join(process.cwd(), 'certificates', 'apple-wallet')
    const hasCertificates = fs.existsSync(certPath) && 
                           fs.existsSync(path.join(certPath, 'signerCert.pem')) &&
                           fs.existsSync(path.join(certPath, 'signerKey.pem'))

    if (!hasCertificates) {
      return NextResponse.json(
        { 
          error: 'Apple Wallet certificates not configured',
          message: 'Please configure Apple Wallet certificates to enable this feature. See documentation for setup instructions.',
          setupRequired: true
        },
        { status: 503 }
      )
    }

    // Create the pass
    const pass = await PKPass.from({
      model: path.join(process.cwd(), 'certificates', 'apple-wallet', 'pass-model'),
      certificates: {
        wwdr: fs.readFileSync(path.join(certPath, 'wwdr.pem')),
        signerCert: fs.readFileSync(path.join(certPath, 'signerCert.pem')),
        signerKey: fs.readFileSync(path.join(certPath, 'signerKey.pem')),
      },
    })

    // Set pass properties using the props object
    Object.assign(pass.props, {
      serialNumber: bookingId,
      description: 'Winterstück 2025: Schicksalfäden',
      organizationName: 'Kolping Jugend Ramsen',
      backgroundColor: 'rgb(255, 106, 0)', // Kolping orange
      foregroundColor: 'rgb(255, 255, 255)',
      labelColor: 'rgb(255, 255, 255)',
      relevantDate: eventDate.toISOString(),
    })

    // Location for relevance
    Object.assign(pass.props, {
      locations: [
        {
          latitude: 49.4881,
          longitude: 7.9186,
          relevantText: 'Sie sind in der Nähe des Veranstaltungsortes!',
        },
      ],
    })

    // Set event ticket structure
    Object.assign(pass.props, {
      eventTicket: {
        primaryFields: [
          {
            key: 'event',
            label: 'VERANSTALTUNG',
            value: 'Schicksalfäden',
          },
        ],
        secondaryFields: [
          {
            key: 'date',
            label: 'DATUM',
            value: displayDate,
          },
          {
            key: 'time',
            label: 'UHRZEIT',
            value: displayTime,
          },
        ],
        auxiliaryFields: [
          {
            key: 'seats',
            label: 'PLÄTZE',
            value: seatLabels,
          },
        ],
        backFields: [
          {
            key: 'name',
            label: 'Name',
            value: name,
          },
          {
            key: 'email',
            label: 'E-Mail',
            value: email,
          },
          {
            key: 'bookingId',
            label: 'Buchungs-ID',
            value: bookingId,
          },
          {
            key: 'location',
            label: 'Veranstaltungsort',
            value: 'Klosterhof 7, 67305 Ramsen',
          },
          {
            key: 'info',
            label: 'Wichtige Informationen',
            value: 'Bitte erscheinen Sie 15 Minuten vor Vorstellungsbeginn. Der Einlass erfolgt nur mit gültigem Ticket.',
          },
        ],
      },
    })

    // Add barcode (QR code with booking URL)
    const ticketUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kolping-jugend.de'}/booking/view/${bookingId}`
    Object.assign(pass.props, {
      barcodes: [
        {
          format: 'PKBarcodeFormatQR',
          message: ticketUrl,
          messageEncoding: 'iso-8859-1',
        },
      ],
    })

    // Generate the pass buffer
    const buffer = pass.getAsBuffer()

    // Return the .pkpass file
    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="winterstück-${bookingId}.pkpass"`,
      },
    })
  } catch (error) {
    console.error('Error generating Apple Wallet pass:', error)
    return NextResponse.json(
      { error: 'Failed to generate wallet pass', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
