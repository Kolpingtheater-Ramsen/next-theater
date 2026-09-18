import { getBookingById } from './db'
import { admissionCode, DEFAULT_VENUE, performanceStart, seatLabel } from './tickets'
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
  let response=await walletRequest(env,`eventticketobject/${body.id}`,'PATCH',body)
  if(response.status===404) response=await walletRequest(env,'eventticketobject','POST',body)
  if(response.status===409) response=await walletRequest(env,`eventticketobject/${body.id}`,'PATCH',body)
  if(!response.ok) throw new Error(`Wallet object update failed (${response.status})`)
}
export async function syncWalletPass(env:CloudflareEnv,bookingId:string):Promise<void> {
  if(!walletConfigured(env)) return
  const booking=await getBookingById(env.DB,bookingId)
  if(!booking?.wallet_issued || !booking.play) return
  try {
    await upsertObject(env,booking)
    const cleared=await env.DB.prepare('UPDATE bookings SET wallet_sync_pending = 0 WHERE id = ? AND version = ?').bind(booking.id,booking.version || 0).run()
    if(!cleared.meta.changes) await env.DB.prepare('UPDATE bookings SET wallet_sync_pending = 1 WHERE id = ?').bind(booking.id).run()
  } catch {
    await env.DB.prepare('UPDATE bookings SET wallet_sync_pending = 1 WHERE id = ?').bind(booking.id).run()
    console.error('Wallet update queued for retry')
  }
}
export async function createWalletLink(env:CloudflareEnv,booking:BookingWithSeats,origin:string) {
  if(!walletConfigured(env) || !booking.play) throw new Error('Wallet unavailable')
  const event=walletClass(env,booking.play)
  const found=await walletRequest(env,`eventticketclass/${event.id}`)
  if(found.status===404) {
    const created=await walletRequest(env,'eventticketclass','POST',event)
    if(!created.ok && created.status!==409) throw new Error('Wallet event could not be created')
  } else if(!found.ok) throw new Error('Wallet event unavailable')
  // Persist intent before contacting Google, so a concurrent edit/cancellation is retried.
  await env.DB.prepare('UPDATE bookings SET wallet_issued = 1, wallet_sync_pending = 1 WHERE id = ?').bind(booking.id).run()
  await upsertObject(env,booking)
  await syncWalletPass(env,booking.id)
  const jwt=await signWalletJwt({iss:env.GOOGLE_WALLET_CLIENT_EMAIL,aud:'google',typ:'savetowallet',iat:Math.floor(Date.now()/1000),origins:[new URL(origin).host],payload:{eventTicketObjects:[{id:walletObject(env,booking).id}]}},env.GOOGLE_WALLET_PRIVATE_KEY!)
  return `https://pay.google.com/gp/v/save/${jwt}`
}
export async function syncPendingWalletPasses(env:CloudflareEnv) {
  if(!walletConfigured(env)) return
  const pending=await env.DB.prepare('SELECT id FROM bookings WHERE wallet_sync_pending = 1 AND wallet_issued = 1 LIMIT 50').all<{id:string}>()
  for(const row of pending.results || []) await syncWalletPass(env,row.id)
}
