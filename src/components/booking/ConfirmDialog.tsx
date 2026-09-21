'use client'
import { useEffect,useRef } from 'react'
export default function ConfirmDialog({title,children,onCancel,onConfirm,busy=false,confirmLabel='Bestätigen',cancelLabel='Abbrechen'}:{title:string;children:React.ReactNode;onCancel:()=>void;onConfirm:()=>void;busy?:boolean;confirmLabel?:string;cancelLabel?:string}) {
  const ref=useRef<HTMLDialogElement>(null)
  useEffect(()=>{const node=ref.current;node?.showModal();return()=>node?.close()},[])
  return <dialog ref={ref} className='ticket-dialog' aria-labelledby='ticket-dialog-title' onCancel={e=>{e.preventDefault();if(!busy)onCancel()}}>
    <h2 id='ticket-dialog-title' className='ticket-section-title mb-4'>{title}</h2><div className='ticket-muted'>{children}</div>
    <div className='ticket-actions mb-0'><button type='button' className='ticket-button' autoFocus onClick={onCancel} disabled={busy}>{cancelLabel}</button><button type='button' className='ticket-button ticket-button-primary' onClick={onConfirm} disabled={busy}>{busy?'Wird gespeichert …':confirmLabel}</button></div>
  </dialog>
}
