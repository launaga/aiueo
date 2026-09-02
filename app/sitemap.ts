import type { MetadataRoute } from 'next';
import { getPublished } from '@/lib/data';
import { localized } from '@/lib/types';

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const origin=process.env.NEXT_PUBLIC_SITE_URL||'https://aiueo-eta.vercel.app'; const sections=['about','services','events','news','gallery','contact'];
  const rows=await Promise.all([getPublished('services'),getPublished('events'),getPublished('articles'),getPublished('gallery_items')]);
  const resourceNames=['services','events','news','gallery'];
  const entries:MetadataRoute.Sitemap=[];
  for(const locale of ['id','en'] as const){entries.push({url:`${origin}/${locale}`,changeFrequency:'weekly',priority:1});sections.forEach(section=>entries.push({url:`${origin}/${locale}/${section}`,changeFrequency:'weekly',priority:.8}));rows.forEach((items,i)=>items.forEach(item=>entries.push({url:`${origin}/${locale}/${resourceNames[i]}/${localized(item,'slug',locale)}`,lastModified:item.updated_at,changeFrequency:'monthly',priority:.7})));}
  return entries;
}
