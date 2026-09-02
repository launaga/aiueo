'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import type { Locale } from '@/lib/types';

const WHATSAPP_NUMBER = '6289674002822';

function campaignContext() {
  const params = new URLSearchParams(window.location.search);
  return ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid']
    .map((key) => params.get(key) ? `${key}: ${params.get(key)}` : '')
    .filter(Boolean)
    .join('\n');
}

export function buildWhatsAppBrief(formData: FormData, locale: Locale) {
  const value = (key: string) => String(formData.get(key) || '-').trim() || '-';
  const lines = locale === 'id' ? [
    'Halo AIUEO, saya ingin konsultasi event.',
    `Nama / peran: ${value('name')} / ${value('role')}`,
    `Perusahaan: ${value('company')}`,
    `Nomor WhatsApp: ${value('phone')}`,
    `Jenis acara: ${value('event_type')}`,
    `Estimasi peserta: ${value('pax')}`,
    `Waktu / destinasi: ${value('event_date')} / ${value('destination')}`,
    `Sumber: ${value('source')}`,
    `Catatan: ${value('message')}`,
  ] : [
    'Hello AIUEO, I would like to discuss an event.',
    `Name / role: ${value('name')} / ${value('role')}`,
    `Company: ${value('company')}`,
    `WhatsApp number: ${value('phone')}`,
    `Event type: ${value('event_type')}`,
    `Estimated guests: ${value('pax')}`,
    `Timing / destination: ${value('event_date')} / ${value('destination')}`,
    `Source: ${value('source')}`,
    `Notes: ${value('message')}`,
  ];
  if (typeof window !== 'undefined') {
    const attribution = campaignContext();
    if (attribution) lines.push(`Campaign:\n${attribution}`);
  }
  return lines.join('\n');
}

export function ContactForm({locale}:{locale:Locale}) {
  const [status,setStatus] = useState('');
  const calendarUrl = process.env.NEXT_PUBLIC_CALENDAR_APPOINTMENT_URL;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const brief = buildWhatsAppBrief(new FormData(form), locale);
    setStatus(locale === 'id' ? 'Brief siap. WhatsApp dibuka di tab baru.' : 'Your brief is ready. WhatsApp is opening in a new tab.');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(brief)}`, '_blank', 'noopener,noreferrer');
  }

  return <form onSubmit={submit} className="contact-form">
    <label>{locale==='id'?'Nama PIC':'Contact name'}<input name="name" required minLength={2} autoComplete="name"/></label>
    <label>{locale==='id'?'Peran / jabatan':'Role / title'}<input name="role" required autoComplete="organization-title"/></label>
    <label>{locale==='id'?'Perusahaan':'Company'}<input name="company" required autoComplete="organization"/></label>
    <label>{locale==='id'?'Nomor WhatsApp':'WhatsApp number'}<input name="phone" type="tel" required autoComplete="tel"/></label>
    <label>{locale==='id'?'Jenis acara':'Event type'}<select name="event_type" required defaultValue=""><option value="" disabled>{locale==='id'?'Pilih jenis acara':'Choose an event type'}</option><option>Corporate Event</option><option>Employee Gathering</option><option>Outing &amp; Outbound</option><option>Team Building</option><option>Family Gathering</option><option>Annual Kick Off</option><option>{locale==='id'?'Lainnya':'Other'}</option></select></label>
    <label>{locale==='id'?'Estimasi peserta':'Estimated guests'}<input name="pax" type="number" min="1" inputMode="numeric" required/></label>
    <label>{locale==='id'?'Perkiraan tanggal':'Estimated date'}<input name="event_date" type="date" required/></label>
    <label>{locale==='id'?'Destinasi / kota':'Destination / city'}<input name="destination" required/></label>
    <label className="wide">{locale==='id'?'Tahu AIUEO dari':'How did you hear about AIUEO?'}<select name="source" required defaultValue=""><option value="" disabled>{locale==='id'?'Pilih sumber':'Choose a source'}</option><option>Referral</option><option>Instagram</option><option>Google</option><option>LinkedIn</option><option>WhatsApp</option><option>{locale==='id'?'Lainnya':'Other'}</option></select></label>
    <label className="wide">{locale==='id'?'Catatan tambahan (opsional)':'Additional notes (optional)'}<textarea name="message" maxLength={2000} rows={4}/></label>
    <p className="form-privacy wide">{locale==='id'?'Brief ini tidak disimpan di database website. Saat Anda melanjutkan, data dikirim ke WhatsApp sesuai pilihan Anda.':'This brief is not stored in the website database. When you continue, it is sent to WhatsApp at your direction.'} <Link href={`/${locale}/privacy`}>{locale==='id'?'Baca privasi':'Read privacy'}</Link>.</p>
    <div className="form-actions wide"><button className="pill-button" type="submit">{locale==='id'?'Lanjutkan ke WhatsApp':'Continue to WhatsApp'}<span>↗</span></button>{calendarUrl&&<a className="text-link" href={calendarUrl} target="_blank" rel="noopener noreferrer">{locale==='id'?'Jadwalkan konsultasi':'Book a consultation'} ↗</a>}</div>
    <p className="form-status wide" role="status">{status}</p>
  </form>;
}
