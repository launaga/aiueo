import Link from 'next/link';
import type { Locale } from '@/lib/types';
import { getDictionary } from '@/lib/i18n';

export function Footer({locale}:{locale:Locale}) { const t=getDictionary(locale); return <footer className="site-footer">
  <Link className="brand footer-brand" href={`/${locale}`} aria-label="AIUEO home"><span>A</span><span>I</span><span>U</span><span>E</span><span>O</span></Link>
  <p>{locale==='id'?'Hidup penuh momen.':'Life is an event.'}<br/>{locale==='id'?'Buat jadi berkesan.':'Make it live.'}</p>
  <div className="footer-links"><Link href={`/${locale}/about`}>{t.about}</Link><Link href={`/${locale}/services`}>{t.services}</Link><Link href={`/${locale}/news`}>{t.news}</Link><Link href={`/${locale}/gallery`}>{t.gallery}</Link><Link href={`/${locale}/events`}>{t.events}</Link><Link href={`/${locale}/contact`}>{t.contact}</Link></div>
  <div className="footer-contact"><a href="https://wa.me/6289674002822" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a><a href="tel:+6289674002822">+62 896 7400 2822</a><span>Jakarta, Indonesia</span></div>
  <div className="footer-bottom"><span>© 2026 AIUEO</span><span>{locale==='id'?'Dibangun untuk momen di dunia nyata.':'Built for real-life moments.'}</span><a href="#top">{t.backTop} ↑</a></div>
</footer> }
