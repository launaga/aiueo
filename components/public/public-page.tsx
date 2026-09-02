import Image from 'next/image';
import Link from 'next/link';
import type { ContentRecord, Locale } from '@/lib/types';
import { localized } from '@/lib/types';
import { copy, pageCopy } from '@/lib/site-content';
import { getDictionary } from '@/lib/i18n';
import { ContentCard } from './content-card';
import { ContactForm } from './contact-form';

type PublicPageProps={locale:Locale;section:keyof typeof pageCopy;items?:ContentRecord[];detail?:ContentRecord;pageRecord?:ContentRecord};
export function PublicPage({locale,section,items=[],detail,pageRecord}:PublicPageProps) {
  const t=getDictionary(locale); const page=pageCopy[section];
  if(detail) return <main id="main"><section className="page-hero detail-hero"><div><p className="overline">AIUEO / {section}</p><h1>{localized(detail,'title',locale)}</h1><p>{localized(detail,'description',locale)}</p></div>{detail.featured_image_url&&<div className="detail-image"><Image src={detail.featured_image_url} alt={localized(detail,'title',locale)} fill sizes="(max-width: 900px) 100vw, 48vw"/></div>}</section><section className="detail-body"><p>{localized(detail,'body',locale)}</p><Link className="pill-button ink" href={`/${locale}/contact`}>{t.contactCta}<span>↗</span></Link></section></main>;
  if(section==='contact') return <main id="main"><section className="page-hero warm"><div><p className="overline">AIUEO / {t.contact}</p><h1>{pageRecord?localized(pageRecord,'title',locale):copy(page,'title',locale)}</h1><p>{pageRecord?localized(pageRecord,'description',locale):copy(page,'description',locale)}</p></div></section><section className="contact-section"><div><h2>{t.contactTitle}</h2><p>{t.contactCopy}</p><a href="https://wa.me/6289674002822" target="_blank" rel="noopener noreferrer">{t.whatsapp} ↗</a></div><ContactForm locale={locale}/></section></main>;
  const base=section==='services'?'services':section==='gallery'?'gallery':section==='events'?'events':'news';
  return <main id="main"><section className="page-hero"><div><p className="overline">AIUEO / {section}</p><h1>{pageRecord?localized(pageRecord,'title',locale):copy(page,'title',locale)}</h1><p>{pageRecord?localized(pageRecord,'description',locale):copy(page,'description',locale)}</p></div></section>
    {section==='about'?<About locale={locale}/>:<section className="content-grid">{items.length?items.map(item=><ContentCard key={item.id} item={item} locale={locale} base={base}/>):<div className="empty-state"><h2>{t.empty}</h2><Link href={`/${locale}/contact`}>{t.contactCta} ↗</Link></div>}</section>}
  </main>;
}

function About({locale}:{locale:Locale}) { return <><section className="manifesto"><h2>{locale==='id'?'Kami merancang untuk manusia, bukan angka kehadiran.':'We design for people, not attendance numbers.'}</h2><p>{locale==='id'?'Dari ide pertama sampai tamu terakhir pulang, kami merancang ritme, mengelola kerumitan, dan menjaga alasan semua orang hadir.':'From the first idea to the last guest heading home, we design the rhythm, manage the complexity, and protect the reason everyone came.'}</p></section><section className="values"><article><b>01</b><h3>{locale==='id'?'Manusia dulu':'Human first'}</h3></article><article><b>02</b><h3>{locale==='id'?'Tujuan di dalam':'Purpose inside'}</h3></article><article><b>03</b><h3>{locale==='id'?'Hidup di lokasi':'Alive on site'}</h3></article></section></> }
