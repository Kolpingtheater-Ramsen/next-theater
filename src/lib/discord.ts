interface DiscordSeatUpdateOptions {
  webhookUrl?: string
  showLabel: string
  seatCount: number
  availableSeatCount: number
  action: 'booked' | 'cancelled'
}

/**
 * Send a simple seat update notification to a Discord webhook.
 * Silently fails if the webhook URL is not configured or if sending fails.
 */
export async function sendDiscordSeatUpdate({
  webhookUrl,
  showLabel,
  seatCount,
  availableSeatCount,
  action,
}: DiscordSeatUpdateOptions): Promise<void> {
  if (!webhookUrl) {
    return
  }

  const seatLabel = action === 'booked' ? 'Gebuchte Plätze' : 'Stornierte Plätze'
  const content = `Vorstellung: ${showLabel}
${seatLabel}: ${seatCount}
Verfügbare Plätze: ${availableSeatCount}`

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    if (!response.ok) {
      console.error('Failed to send Discord notification', response.status, await response.text())
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error)
  }
}
