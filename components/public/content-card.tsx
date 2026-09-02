import Image from 'next/image';
import Link from 'next/link';
import type { ContentRecord, Locale } from '@/lib/types';
import { localized } from '@/lib/types';

export function ContentCard({item,locale,base}:{item:ContentRecord;locale:Locale;base:string}) {
  const slug=localized(item,'slug',locale); return <article className="content-card">
    <Link href={`/${locale}/${base}/${slug}`} className="card-image">
      <Image src={item.featured_image_url||'/assets/images/hero-field.png'} alt={localized(item,'title',locale)} fill sizes="(max-width: 700px) 100vw, 33vw"/>
    </Link>
    <span>{base.replace('_',' ')}</span><h2><Link href={`/${locale}/${base}/${slug}`}>{localized(item,'title',locale)}</Link></h2><p>{localized(item,'description',locale)}</p>
  </article>;
}
