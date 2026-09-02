import Image from 'next/image';
import Link from 'next/link';
import type { ContentRecord, Locale } from '@/lib/types';
import { localized } from '@/lib/types';
import { copy, packageSeeds, pageCopy } from '@/lib/site-content';
import { getDictionary } from '@/lib/i18n';
import { ContentCard } from './content-card';
import { ContactForm } from './contact-form';

type PublicPageProps={locale:Locale;section:keyof typeof pageCopy;items?:ContentRecord[];detail?:ContentRecord;pageRecord?:ContentRecord};
export function PublicPage({locale,section,items=[],detail,pageRecord}:PublicPageProps) {
  const t=getDictionary(locale); const page=pageCopy[section];
  if(detail) return <main id="main"><section className="page-hero detail-hero"><div><p className="overline">AIUEO / {section}</p><h1>{localized(detail,'title',locale)}</h1><p>{localized(detail,'description',locale)}</p></div>{detail.featured_image_url&&<div className="detail-image"><Image src={detail.featured_image_url} alt={localized(detail,'title',locale)} fill sizes="(max-width: 900px) 100vw, 48vw"/></div>}</section><section className="detail-body"><p>{localized(detail,'body',locale)}</p><Link className="pill-button ink" href={`/${locale}/contact`}>{t.contactCta}<span>↗</span></Link></section></main>;
  if(section==='packages') return <main id="main"><section className="page-hero packages-hero"><div><p className="overline">AIUEO / {t.packages}</p><h1>{copy(page,'title',locale)}</h1><p>{copy(page,'description',locale)}</p></div></section><section className="package-grid">{packageSeeds.map((item)=><article className="package-card" key={item.slug}><div className="package-image"><Image src={item.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw"/></div><p className="overline">{locale==='id'?'Paket indikatif':'Indicative package'}</p><h2>{item[`name_${locale}`]}</h2><strong>{item[`price_${locale}`]}</strong><p>{item[`description_${locale}`]}</p><Link href={`/${locale}/contact?destination=${item.slug}`}>{locale==='id'?'Bahas paket ini':'Discuss this package'} ↗</Link></article>)}</section><section className="package-note"><h2>{locale==='id'?'Kenapa bukan harga mati?':'Why not a fixed price?'}</h2><p>{locale==='id'?'Biaya bus, akomodasi, aktivitas, musim, jumlah peserta, dan ruang lingkup berubah dari satu event ke event lain. Setiap penawaran diverifikasi memakai harga NET vendor yang masih berlaku dan kalkulator costing internal sebelum dikirim.':'Transport, accommodation, activities, season, guest count, and scope change from one event to another. Every proposal is verified against current vendor NET rates and the internal costing calculator before it is sent.'}</p></section></main>;
  if(section==='privacy') return <LegalPage locale={locale} kind="privacy"/>;
  if(section==='terms') return <LegalPage locale={locale} kind="terms"/>;
  if(section==='contact') return <main id="main"><section className="page-hero warm"><div><p className="overline">AIUEO / {t.contact}</p><h1>{pageRecord?localized(pageRecord,'title',locale):copy(page,'title',locale)}</h1><p>{pageRecord?localized(pageRecord,'description',locale):copy(page,'description',locale)}</p></div></section><section className="contact-section"><div><h2>{t.contactTitle}</h2><p>{t.contactCopy}</p><a href="https://wa.me/6289674002822" target="_blank" rel="noopener noreferrer">{t.whatsapp} ↗</a></div><ContactForm locale={locale}/></section></main>;
  const base=section==='services'?'services':section==='gallery'?'gallery':section==='events'?'events':'news';
  return <main id="main"><section className="page-hero"><div><p className="overline">AIUEO / {section}</p><h1>{pageRecord?localized(pageRecord,'title',locale):copy(page,'title',locale)}</h1><p>{pageRecord?localized(pageRecord,'description',locale):copy(page,'description',locale)}</p></div></section>
    {section==='about'?<About locale={locale}/>:<section className="content-grid">{items.length?items.map(item=><ContentCard key={item.id} item={item} locale={locale} base={base}/>):<div className="empty-state"><h2>{t.empty}</h2><Link href={`/${locale}/contact`}>{t.contactCta} ↗</Link></div>}</section>}
  </main>;
}

function About({locale}:{locale:Locale}) { return <><section className="manifesto"><h2>{locale==='id'?'Kami merancang untuk manusia, bukan angka kehadiran.':'We design for people, not attendance numbers.'}</h2><p>{locale==='id'?'Dari ide pertama sampai tamu terakhir pulang, kami merancang ritme, mengelola kerumitan, dan menjaga alasan semua orang hadir.':'From the first idea to the last guest heading home, we design the rhythm, manage the complexity, and protect the reason everyone came.'}</p></section><section className="values"><article><b>01</b><h3>{locale==='id'?'Manusia dulu':'Human first'}</h3></article><article><b>02</b><h3>{locale==='id'?'Tujuan di dalam':'Purpose inside'}</h3></article><article><b>03</b><h3>{locale==='id'?'Hidup di lokasi':'Alive on site'}</h3></article></section></> }

function LegalPage({locale,kind}:{locale:Locale;kind:'privacy'|'terms'}) {
  const page=pageCopy[kind];
  const privacy=locale==='id'?[
    ['Brief konsultasi','Form brief menyusun pesan di browser Anda dan membukanya di WhatsApp. Website tidak menyimpan isinya ke database lead. Anda dapat meninjau pesan sebelum mengirim.'],
    ['Konten dan Admin','Konten publik dapat dibaca dari CMS Supabase. Area Admin dilindungi autentikasi dan role; tidak ada registrasi publik.'],
    ['Log teknis','Penyedia hosting dapat memproses log teknis minimum seperti alamat IP, waktu akses, dan user-agent untuk keamanan dan operasional. Log tidak digunakan untuk iklan.'],
    ['Layanan pihak lain','Jika Anda memilih WhatsApp atau tautan penjadwalan, pemrosesan berikutnya mengikuti kebijakan layanan tersebut.'],
    ['Hak dan kontak','Untuk pertanyaan, koreksi, atau penghapusan data yang pernah Anda kirim langsung ke tim AIUEO, hubungi WhatsApp resmi yang tercantum di website.'],
  ]:[
    ['Consultation brief','The brief form composes a message in your browser and opens it in WhatsApp. The website does not store its contents in a lead database. You can review the message before sending.'],
    ['Content and Admin','Public content may be read from the Supabase CMS. Admin is protected by authentication and roles; there is no public registration.'],
    ['Technical logs','The hosting provider may process minimum technical logs such as IP address, access time, and user-agent for security and operations. These logs are not used for advertising.'],
    ['Other services','If you choose WhatsApp or a scheduling link, further processing follows that service’s own policy.'],
    ['Rights and contact','For questions, correction, or deletion of information you previously sent directly to AIUEO, contact the official WhatsApp number shown on this website.'],
  ];
  const terms=locale==='id'?[
    ['Bukan penawaran final','Harga paket adalah indikasi awal. Penawaran final hanya berlaku dalam dokumen quote yang memiliki versi, ruang lingkup, jumlah peserta, dan masa berlaku.'],
    ['Konten dan ketersediaan','Tanggal, lokasi, vendor, dan aktivitas dapat berubah sampai dikonfirmasi tertulis. Website tidak menjanjikan ketersediaan.'],
    ['Keselamatan','Aktivitas fisik memerlukan asesmen, informasi kesehatan, waiver, dan ketentuan keselamatan terpisah. Informasi website tidak menggantikan briefing atau kontrak.'],
    ['Hak cipta dan media','Materi website tidak boleh digunakan ulang secara komersial tanpa izin. Foto dan video hanya boleh dipublikasikan setelah hak penggunaan dikonfirmasi.'],
    ['Kontrak event','Ketentuan penyelenggaraan, pembayaran, pembatalan, perubahan, dan tanggung jawab diatur dalam kontrak yang direview dan disepakati kedua pihak.'],
  ]:[
    ['Not a final offer','Package prices are early indications. A final offer exists only in a versioned quote that states scope, guest count, and validity.'],
    ['Content and availability','Dates, places, vendors, and activities may change until confirmed in writing. The website does not promise availability.'],
    ['Safety','Physical activities require assessment, health information, waivers, and separate safety terms. Website information does not replace a briefing or contract.'],
    ['Copyright and media','Website materials may not be reused commercially without permission. Photos and video may be published only after usage rights are confirmed.'],
    ['Event contract','Delivery, payment, cancellation, change, and liability terms are governed by a contract reviewed and agreed by both parties.'],
  ];
  const sections=kind==='privacy'?privacy:terms;
  return <main id="main"><section className="page-hero"><div><p className="overline">AIUEO / {kind}</p><h1>{copy(page,'title',locale)}</h1><p>{copy(page,'description',locale)}</p></div></section><section className="legal-copy"><p className="legal-updated">{locale==='id'?'Terakhir diperbarui: 2 September 2026':'Last updated: 2 September 2026'}</p>{sections.map(([title,body])=><article key={title}><h2>{title}</h2><p>{body}</p></article>)}</section></main>;
}
