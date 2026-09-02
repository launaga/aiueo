import Image from 'next/image';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { ContentResource } from '@/lib/types';

const allowed=['pages','services','events','articles','gallery_items'] as const;
export default async function PreviewPage({params}:{params:Promise<{resource:string;id:string}>}){await requireAdmin();const {resource,id}=await params;if(!allowed.includes(resource as ContentResource))notFound();const supabase=await createClient();const {data}=await supabase.from(resource).select('*').eq('id',id).maybeSingle();if(!data)notFound();return <main className="admin-content preview-page"><div className="preview-banner">Preview draft · tidak terlihat publik <a href={`/admin/content/${resource}`}>Kembali ke editor</a></div><div className="preview-columns">{(['id','en'] as const).map(locale=><article key={locale}><p className="eyebrow">{locale==='id'?'Bahasa Indonesia':'English'}</p>{data.featured_image_url&&<div className="preview-image"><Image src={data.featured_image_url} alt={data[`title_${locale}`]} fill sizes="50vw"/></div>}<h1>{data[`title_${locale}`]}</h1><p className="deck">{data[`description_${locale}`]}</p><div className="preview-body">{data[`body_${locale}`]}</div></article>)}</div></main>}
