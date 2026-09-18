import { getBookingById } from './db'
import { admissionCode, DEFAULT_VENUE, hasStarted, performanceStart, seatLabel } from './tickets'
import type { BookingWithSeats, Play } from '@/types/database'

const API = 'https://walletobjects.googleapis.com/walletobjects/v1'
const SITE = 'https://kolpingtheater-ramsen.de'
const localized = (value:string) => ({defaultValue:{language:'de',value}})
export function walletConfigured(env:CloudflareEnv) {
  return env.GOOGLE_WALLET_ENABLED === 'true' && !!env.GOOGLE_WALLET_ISSUER_ID && !!env.GOOGLE_WALLET_CLIENT_EMAIL && !!env.GOOGLE_WALLET_PRIVATE_KEY
}
function base64url(bytes:Uint8Array) {
  return btoa(Array.from(bytes,b=>String.fromCharCode(b)).join('')).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')
}
export async function signWalletJwt(payload:unknown,privateKey:string) {
  const pem=privateKey.replace(/\\n/g,'\n').replace(/-----[^-]+-----/g,'').replace(/\s/g,'')
  const key=await crypto.subtle.importKey('pkcs8',Uint8Array.from(atob(pem),c=>c.charCodeAt(0)),{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['sign'])
  const encode=(value:unknown)=>base64url(new TextEncoder().encode(JSON.stringify(value)))
  const content=`${encode({alg:'RS256',typ:'JWT'})}.${encode(payload)}`
  const signature=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',key,new TextEncoder().encode(content))
  return `${content}.${base64url(new Uint8Array(signature))}`
}
let cachedToken:{email:string;value:string;expires:number}|undefined
async function accessToken(env:CloudflareEnv) {
  if(cachedToken && cachedToken.email === env.GOOGLE_WALLET_CLIENT_EMAIL && cachedToken.expires > Date.now()) return cachedToken.value
  const now=Math.floor(Date.now()/1000)
  const assertion=await signWalletJwt({iss:env.GOOGLE_WALLET_CLIENT_EMAIL,scope:'https://www.googleapis.com/auth/wallet_object.issuer',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600},env.GOOGLE_WALLET_PRIVATE_KEY!)
  const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion}),signal:AbortSignal.timeout(8000)})
  const result=await response.json() as {access_token?:string}
  if(!response.ok || !result.access_token) throw new Error('Wallet authentication failed')
  cachedToken={email:env.GOOGLE_WALLET_CLIENT_EMAIL!,value:result.access_token,expires:Date.now()+3300000}
  return result.access_token
}
async function walletRequest(env:CloudflareEnv,path:string,method='GET',body?:unknown) {
  return fetch(`${API}/${path}`,{method,headers:{Authorization:`Bearer ${await accessToken(env)}`,'Content-Type':'application/json'},body:body ? JSON.stringify(body):undefined,signal:AbortSignal.timeout(8000)})
}
// Google displays the venue-local portion; do not pass a UTC wall time here.
export function walletEventTime(play:Play) {
  const local=`${play.date}T${play.time}:00`
  const offset=(Date.parse(`${local}Z`)-performanceStart(play).getTime())/60000
  const sign=offset<0?'-':'+'
  return `${local}${sign}${String(Math.floor(Math.abs(offset)/60)).padStart(2,'0')}:${String(Math.abs(offset)%60).padStart(2,'0')}`
}
export function walletClass(env:CloudflareEnv,play:Play) {
  return {id:`${env.GOOGLE_WALLET_ISSUER_ID}.${play.id}`,issuerName:'Kolpingtheater Ramsen',reviewStatus:'UNDER_REVIEW',
    eventName:localized(play.title),eventId:play.id,hexBackgroundColor:'#201c19',
    logo:{sourceUri:{uri:`${SITE}/img/logo.png`},contentDescription:localized('Kolpingtheater Ramsen')},
    ...(play.id.startsWith('romeo-julia-2026-') ? {heroImage:{sourceUri:{uri:`${SITE}/img/banners/romeo-und-julia-2026-wallet.png`},contentDescription:localized('Romeo und Julia am Balkon im Mondlicht')}} : {}),
    venue:{name:localized('Kolpingtheater Ramsen'),address:localized(play.venue || DEFAULT_VENUE)},
    dateTime:{start:walletEventTime(play)},
    finePrint:localized('Eintritt frei. Bitte 15 Minuten vor Beginn da sein. Dieses Ticket gilt für alle angegebenen Plätze.'),
  }
}
export function walletObject(env:CloudflareEnv,booking:BookingWithSeats) {
  if(!booking.play || !booking.admission_token) throw new Error('Ticket incomplete')
  const state=booking.status==='cancelled'?'INACTIVE':booking.status==='checked_in'?'COMPLETED':'ACTIVE'
  return {id:`${env.GOOGLE_WALLET_ISSUER_ID}.ticket_${booking.admission_token}`,classId:`${env.GOOGLE_WALLET_ISSUER_ID}.${booking.play_id}`,state,
    ticketHolderName:booking.name,ticketNumber:booking.admission_token.slice(0,8).toUpperCase(),
    seatInfo:{seat:localized(booking.seats.map(seatLabel).join(', ') || 'Storniert')},
    barcode:{type:'QR_CODE',value:admissionCode(booking.admission_token),alternateText:booking.admission_token.slice(0,8).toUpperCase()},
    textModulesData:[{id:'party',header:'Reservierte Plätze',body:`${booking.seats.length} Plätze · Gemeinsam einchecken`},{id:'status',header:'Status',body:state==='INACTIVE'?'Storniert':state==='COMPLETED'?'Bereits eingecheckt':'Reservierung bestätigt'}],
    // No management link or email address is placed in the admission pass.
    linksModuleData:{uris:[{uri:`${SITE}/booking`,description:'Vorstellungen und Informationen'}]},
  }
}
async function upsertObject(env:CloudflareEnv,booking:BookingWithSeats) {
  const body=walletObject(env,booking)
  let response=await walletRequest(env,`eventTicketObject/${body.id}`,'PATCH',body)
  if(response.status===404) response=await walletRequest(env,'eventTicketObject','POST',body)
  if(response.status===409) response=await walletRequest(env,`eventTicketObject/${body.id}`,'PATCH',body)
  if(!response.ok) throw new Error(`Wallet object update failed (${response.status})`)
}
async function ensureClass(env: CloudflareEnv, play: Play) {
  const event = walletClass(env, play)
  const path = `eventTicketClass/${event.id}`
  let found = await walletRequest(env, path)
  if (found.status === 404) {
    const created = await walletRequest(env, 'eventTicketClass', 'POST', event)
    if (created.ok) return
    if (created.status !== 409) throw new Error('Wallet event could not be created')
    // Another request or the console may have created a draft meanwhile.
    found = await walletRequest(env, path)
  }
  if (!found.ok) throw new Error('Wallet event unavailable')
  const existing = await found.json() as { reviewStatus?: string }
  if (existing.reviewStatus?.toUpperCase() === 'DRAFT') {
    // Console-created drafts cannot issue objects. Preserve their artwork and
    // other settings; approved classes do not need to be resubmitted.
    const submitted = await walletRequest(env, path, 'PATCH', { reviewStatus: 'UNDER_REVIEW' })
    if (!submitted.ok) throw new Error('Wallet event could not be submitted')
  }
}

export type WalletSyncResult = 'synced' | 'pending' | 'busy' | 'unavailable'
export async function syncWalletPass(env: CloudflareEnv, bookingId: string): Promise<WalletSyncResult> {
  if (!walletConfigured(env)) return 'unavailable'
  const now = Math.floor(Date.now() / 1000), lease = crypto.randomUUID()
  // All writers, including first issuance, use this per-booking lease. A crashed
  // request releases itself after two minutes; provider calls time out after 8s.
  const job = await env.DB.prepare(`INSERT INTO wallet_sync_jobs (booking_id, lease_token, lease_until)
    SELECT id, ?, ? FROM bookings WHERE id = ? AND wallet_issued = 1
    ON CONFLICT(booking_id) DO UPDATE SET lease_token = excluded.lease_token, lease_until = excluded.lease_until
    WHERE wallet_sync_jobs.lease_until <= ? RETURNING attempts`)
    .bind(lease, now + 120, bookingId, now).first<{ attempts: number }>()
  if (!job) return 'busy'
  try {
    const booking = await getBookingById(env.DB, bookingId)
    if (!booking?.play) throw new Error('Ticket incomplete')
    // A failed first issuance can be recovered entirely by the retry worker.
    await ensureClass(env, booking.play)
    await upsertObject(env, booking)
    const results = await env.DB.batch([
      env.DB.prepare(`UPDATE bookings SET wallet_sync_pending = 0 WHERE id = ? AND version = ?
        AND EXISTS (SELECT 1 FROM wallet_sync_jobs WHERE booking_id = ? AND lease_token = ?)`)
        .bind(bookingId, booking.version || 0, bookingId, lease),
      env.DB.prepare('DELETE FROM wallet_sync_jobs WHERE booking_id = ? AND lease_token = ?').bind(bookingId, lease),
    ])
    // An edit during the Google request retains its pending flag. The next run
    // reads the latest booking rather than replaying an obsolete pass body.
    if (results[0].meta.changes) return 'synced'
    // If an unusually slow write outlives its lease, a replacement writer may
    // already have cleared the flag. Schedule reconciliation in that case too.
    await env.DB.prepare('UPDATE bookings SET wallet_sync_pending = 1 WHERE id = ?').bind(bookingId).run()
    return 'pending'
  } catch {
    const delay = Math.min(3600, 30 * 2 ** Math.min(job.attempts, 7))
    await env.DB.batch([
      env.DB.prepare('UPDATE bookings SET wallet_sync_pending = 1 WHERE id = ?').bind(bookingId),
      env.DB.prepare(`UPDATE wallet_sync_jobs SET lease_token = NULL, lease_until = 0,
        retry_at = ?, attempts = attempts + 1 WHERE booking_id = ? AND lease_token = ?`)
        .bind(Math.floor(Date.now() / 1000) + delay, bookingId, lease),
    ])
    console.error('Wallet update queued for retry')
    return 'pending'
  }
}

export async function createWalletLink(env: CloudflareEnv, booking: BookingWithSeats, origin: string) {
  if (!walletConfigured(env) || !booking.play) throw new Error('Wallet unavailable')
  // Persist intent before the first Google call, including class creation.
  const issued = await env.DB.prepare(`UPDATE bookings SET wallet_issued = 1, wallet_sync_pending = 1
    WHERE id = ? AND status = 'confirmed' AND version = ?`).bind(booking.id, booking.version || 0).run()
  if (!issued.meta.changes) throw new Error('Booking changed')
  if (await syncWalletPass(env, booking.id) !== 'synced') throw new Error('Wallet update pending')
  const latest = await getBookingById(env.DB, booking.id)
  if (!latest?.play || latest.status !== 'confirmed' || hasStarted(latest.play) || latest.wallet_sync_pending) {
    throw new Error('Booking changed')
  }
  const jwt = await signWalletJwt({ iss: env.GOOGLE_WALLET_CLIENT_EMAIL, aud: 'google', typ: 'savetowallet',
    iat: Math.floor(Date.now() / 1000), origins: [new URL(origin).host],
    payload: { eventTicketObjects: [{ id: walletObject(env, latest).id }] },
  }, env.GOOGLE_WALLET_PRIVATE_KEY!)
  return `https://pay.google.com/gp/v/save/${jwt}`
}

export async function syncPendingWalletPasses(env: CloudflareEnv) {
  const summary = { enabled: walletConfigured(env), attempted: 0, synced: 0, pending: 0, busy: 0 }
  if (!summary.enabled) return summary
  const now = Math.floor(Date.now() / 1000)
  const pending = await env.DB.prepare(`SELECT b.id FROM bookings b
    LEFT JOIN wallet_sync_jobs j ON j.booking_id = b.id
    WHERE b.wallet_sync_pending = 1 AND b.wallet_issued = 1
      AND COALESCE(j.retry_at, 0) <= ? AND COALESCE(j.lease_until, 0) <= ?
    ORDER BY COALESCE(j.retry_at, 0), b.id LIMIT 50`).bind(now, now).all<{ id: string }>()
  for (const row of pending.results || []) {
    summary.attempted++
    try {
      const result = await syncWalletPass(env, row.id)
      if (result === 'synced') summary.synced++
      else if (result === 'busy') summary.busy++
      else summary.pending++
    } catch {
      // A failed job must not prevent later reservations from being synchronized.
      summary.pending++
      console.error('Wallet synchronization deferred')
    }
  }
  return summary
}
