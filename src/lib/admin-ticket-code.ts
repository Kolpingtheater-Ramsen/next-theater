// Accept the admission code shown in Wallet as well as the private ticket link.
// This only extracts a value; the authenticated server validates the ticket.
export function extractAdminTicketCode(value: string): string | null {
  const text = value.trim()
  if (/^KTR1:[a-f0-9-]+$/.test(text)) return text
  if (/^booking-[a-zA-Z0-9-]+$/.test(text)) return text
  try {
    const url = new URL(text)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    const match = /^\/booking\/view\/(booking-[a-zA-Z0-9-]+)\/?$/.exec(url.pathname)
    return match?.[1] || null
  } catch { return null }
}
