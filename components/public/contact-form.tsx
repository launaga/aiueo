'use client';

import { useActionState } from 'react';
import { submitLead } from '@/app/actions/contact';
import type { Locale } from '@/lib/types';
import { getDictionary } from '@/lib/i18n';

export function ContactForm({locale}:{locale:Locale}) {
  const [state,action,pending]=useActionState(submitLead,{ok:false,message:''}); const t=getDictionary(locale);
  return <form action={action} className="contact-form"><input type="hidden" name="locale" value={locale}/><input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
    <label>{locale==='id'?'Nama':'Name'}<input name="name" required minLength={2} autoComplete="name"/></label>
    <label>Email<input name="email" type="email" required autoComplete="email"/></label>
    <label>{locale==='id'?'Telepon':'Phone'}<input name="phone" type="tel" autoComplete="tel"/></label>
    <label>{locale==='id'?'Perusahaan':'Company'}<input name="company" autoComplete="organization"/></label>
    <label className="wide">{locale==='id'?'Ceritakan kebutuhan acara':'Tell us about the event'}<textarea name="message" required minLength={10} rows={5}/></label>
    <button className="pill-button" disabled={pending}>{pending?(locale==='id'?'Mengirim…':'Sending…'):t.submit}<span>↗</span></button>
    <p className={state.ok?'form-status success':'form-status'} role="status">{state.message}</p>
  </form>;
}
