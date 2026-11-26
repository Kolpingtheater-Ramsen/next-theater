'use client'
import { useState } from 'react'
type Props = {
  name: string
  email: string
  onChange: (field: 'name' | 'email', value: string) => void
  onSubmit: () => void
  busy: boolean
  serverField?: string
  forGuest?: boolean
  preview?: boolean
}

export default function BookingForm({name,email,onChange,onSubmit,busy,serverField,forGuest,preview}:Props) {
  const [errors,setErrors]=useState<{name?:string;email?:string}>({})
  const disabled = busy || preview

  function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (disabled) return
    const next:typeof errors={}
    if(name.trim().length<2) next.name='Bitte gib den vollständigen Namen ein.'
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email='Bitte prüfe die E-Mail-Adresse.'
    setErrors(next)
    if(Object.keys(next).length) { e.currentTarget.querySelector<HTMLInputElement>(`#ticket-${next.name?'name':'email'}`)?.focus(); return }
    onSubmit()
  }
  return <form onSubmit={submit} noValidate className='ticket-panel' aria-busy={busy}>
    <div className='ticket-field'>
      <label htmlFor='ticket-name'>{forGuest ? 'Name des Gastes' : 'Dein Name'}</label>
      <input id='ticket-name' name='name' autoComplete={forGuest ? 'off' : 'name'} required minLength={2} maxLength={120}
        value={name} onChange={e => onChange('name', e.target.value)} disabled={disabled} placeholder='Vor- und Nachname'
        aria-invalid={!!errors.name || serverField === 'name'}
        aria-describedby={errors.name ? 'ticket-name-error' : serverField === 'name' ? 'ticket-server-error' : undefined} />
      {errors.name && <p id='ticket-name-error' className='ticket-field-error'>{errors.name}</p>}
    </div>
    <div className='ticket-field'>
      <label htmlFor='ticket-email'>{forGuest ? 'E-Mail-Adresse für das Ticket' : 'E-Mail-Adresse'}</label>
      <input id='ticket-email' name='email' type='email' autoComplete={forGuest ? 'off' : 'email'} inputMode='email' required maxLength={254}
        value={email} onChange={e => onChange('email', e.target.value)} disabled={disabled} placeholder={forGuest ? undefined : 'du@beispiel.de'}
        aria-invalid={!!errors.email || serverField === 'email'}
        aria-describedby={errors.email ? 'ticket-email-error' : serverField === 'email' ? 'ticket-server-error' : 'ticket-email-hint'} />
      {errors.email && <p id='ticket-email-error' className='ticket-field-error'>{errors.email}</p>}
      <p id='ticket-email-hint' className='ticket-muted text-xs mt-2'>
        An diese Adresse senden wir {forGuest ? 'das Ticket' : 'dein Ticket'}. Bitte prüfe sie vor dem Buchen.
      </p>
    </div>
    <button className='ticket-button ticket-button-primary w-full' type='submit' disabled={disabled}>{busy?'Plätze werden reserviert …':'Kostenfrei reservieren'}{!busy&&<span aria-hidden='true'>→</span>}</button>
    <p className='ticket-muted text-xs mt-4'>{forGuest
      ? 'Die Reservierung ist verbindlich. Über den Ticketlink lassen sich die Plätze wieder freigeben.'
      : 'Deine Reservierung ist verbindlich. Falls du nicht kommen kannst, gib die Plätze über deinen Ticketlink wieder frei.'}</p>
    <p className='ticket-muted text-xs mt-3'>Wir verwenden deine Angaben für Reservierung, Ticketversand und Einlass. Die Buchungsdaten werden 14 Tage nach der Aufführung automatisch aus unserem Ticketsystem gelöscht. Mehr dazu in der <a className='underline' href='/privacy#ticketbuchung' target='_blank' rel='noreferrer'>Datenschutzerklärung</a>.</p>
  </form>
}
