import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

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

    // Check if Google Wallet is configured
    const serviceAccountEmail = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL
    const serviceAccountKey = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_KEY
    const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID

    if (!serviceAccountEmail || !serviceAccountKey || !issuerId) {
      return NextResponse.json(
        { 
          error: 'Google Wallet not configured',
          message: 'Please configure Google Wallet API credentials to enable this feature. See documentation for setup instructions.',
          setupRequired: true
        },
        { status: 503 }
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

    // Convert seat numbers to labels
    const seatLabels = seats.map((s: number) => getSeatLabel(s)).join(', ')

    // Create the event ticket class if it doesn't exist
    const classId = `${issuerId}.winterstück_2025`
    const objectId = `${issuerId}.${bookingId}`

    // Event ticket object
    const eventTicketObject = {
      id: objectId,
      classId: classId,
      state: 'ACTIVE',
      heroImage: {
        sourceUri: {
          uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kolping-jugend.de'}/img/banners/nexus.jpg`,
        },
        contentDescription: {
          defaultValue: {
            language: 'de',
            value: 'Winterstück 2025: Schicksalfäden',
          },
        },
      },
      textModulesData: [
        {
          header: 'VERANSTALTUNGSORT',
          body: 'Klosterhof 7, 67305 Ramsen',
          id: 'location',
        },
        {
          header: 'WICHTIGE INFORMATIONEN',
          body: 'Bitte erscheinen Sie 15 Minuten vor Vorstellungsbeginn. Der Einlass erfolgt nur mit gültigem Ticket.',
          id: 'info',
        },
      ],
      linksModuleData: {
        uris: [
          {
            uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kolping-jugend.de'}/booking/view/${bookingId}`,
            description: 'Ticket anzeigen',
            id: 'ticket_link',
          },
        ],
      },
      barcode: {
        type: 'QR_CODE',
        value: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kolping-jugend.de'}/booking/view/${bookingId}`,
      },
      locations: [
        {
          latitude: 49.4881,
          longitude: 7.9186,
        },
      ],
      seatInfo: {
        seat: {
          defaultValue: {
            language: 'de',
            value: seatLabels,
          },
        },
      },
      ticketHolderName: name,
      ticketNumber: bookingId,
    }

    // Create the event ticket class definition
    const eventTicketClass = {
      id: classId,
      issuerName: 'Kolping Jugend Ramsen',
      reviewStatus: 'UNDER_REVIEW',
      eventName: {
        defaultValue: {
          language: 'de',
          value: 'Winterstück 2025: Schicksalfäden',
        },
      },
      eventId: 'winterstück_2025',
      logo: {
        sourceUri: {
          uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kolping-jugend.de'}/img/logo.png`,
        },
        contentDescription: {
          defaultValue: {
            language: 'de',
            value: 'Kolping Jugend Ramsen',
          },
        },
      },
      venue: {
        name: {
          defaultValue: {
            language: 'de',
            value: 'Klosterhof Ramsen',
          },
        },
        address: {
          defaultValue: {
            language: 'de',
            value: 'Klosterhof 7, 67305 Ramsen',
          },
        },
      },
      dateTime: {
        start: eventDate.toISOString(),
      },
      hexBackgroundColor: '#ff6a00',
    }

    // Create JWT payload
    const claims = {
      iss: serviceAccountEmail,
      aud: 'google',
      origins: [process.env.NEXT_PUBLIC_BASE_URL || 'https://kolping-jugend.de'],
      typ: 'savetowallet',
      payload: {
        eventTicketClasses: [eventTicketClass],
        eventTicketObjects: [eventTicketObject],
      },
    }

    // Sign the JWT
    const token = jwt.sign(claims, serviceAccountKey, {
      algorithm: 'RS256',
    })

    // Return the "Add to Google Wallet" URL
    const googleWalletUrl = `https://pay.google.com/gp/v/save/${token}`

    return NextResponse.json({
      success: true,
      url: googleWalletUrl,
    })
  } catch (error) {
    console.error('Error generating Google Wallet pass:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate wallet pass',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
