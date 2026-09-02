import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getPublished } from '@/lib/data';
import { isLocale } from '@/lib/i18n';
import { pageCopy, copy } from '@/lib/site-content';
import { localized, type ContentRecord, type ContentResource, type Locale } from '@/lib/types';
import { HomePage } from '@/components/public/home-page';
import { PublicPage } from '@/components/public/public-page';

type Props={params:Promise<{locale:string;slug?:string[]}>};
const resourceMap:Record<string,ContentResource>={services:'services',events:'events',news:'articles',gallery:'gallery_items'};

async function resolve(params:Props['params']) {
  const {locale:raw,slug=[]}=await params; if(!isLocale(raw)) notFound(); const locale=raw as Locale;
  const pages=await getPublished('pages');
  if(!slug.length) { const [items,articles]=await Promise.all([getPublished('services'),getPublished('articles')]); return {locale,slug,section:'home' as const,items,articles,pageRecord:pages.find(item=>item.slug_id==='home')}; }
  const section=slug[0] as keyof typeof pageCopy;
  if(!Object.hasOwn(pageCopy,section)) notFound();
  const resource=resourceMap[section]; const items=resource?await getPublished(resource):[];
  if(slug.length===1) return {locale,slug,section,items,pageRecord:pages.find(item=>item.slug_id===section)};
  const detail=items.find((item)=>item.slug_id===slug[1]||item.slug_en===slug[1]); if(!detail) notFound();
  return {locale,slug,section,items,detail,pageRecord:pages.find(item=>item.slug_id===section)};
}

export async function generateMetadata({params}:Props):Promise<Metadata>{
  const resolved=await resolve(params); const {locale,slug,section}=resolved;
  const detail='detail' in resolved?resolved.detail as ContentRecord:undefined;
  const pageRecord='pageRecord' in resolved?resolved.pageRecord:undefined;
  const title=detail?localized(detail,'title',locale):pageRecord?localized(pageRecord,'title',locale):copy(pageCopy[section],'title',locale);
  const description=detail?localized(detail,'description',locale):pageRecord?localized(pageRecord,'description',locale):copy(pageCopy[section],'description',locale);
  const path=slug.join('/'); const canonical=`/${locale}${path?`/${path}`:''}`;
  const other=locale==='id'?'en':'id';
  let otherPath=path;
  if(detail&&slug.length>1) otherPath=`${slug[0]}/${localized(detail,'slug',other)}`;
  return {title,description,alternates:{canonical,languages:{'id-ID':`/id${locale==='id'&&path?`/${path}`:other==='id'&&otherPath?`/${otherPath}`:''}`,'en-US':`/en${locale==='en'&&path?`/${path}`:other==='en'&&otherPath?`/${otherPath}`:''}`,'x-default':`/id${path?`/${locale==='id'?path:otherPath}`:''}`}},openGraph:{title,description,url:canonical,locale:locale==='id'?'id_ID':'en_US',type:'website',images:['/assets/images/impact-demo.png']}};
}

export default async function Page({params}:Props){
  const result=await resolve(params); const {locale,section}=result;
  if('detail' in result&&result.detail&&result.slug[1]!==localized(result.detail,'slug',locale)) redirect(`/${locale}/${section}/${localized(result.detail,'slug',locale)}`);
  const site=process.env.NEXT_PUBLIC_SITE_URL||'https://aiueo-eta.vercel.app';
  const schema={'@context':'https://schema.org','@type':section==='services'?'Service':'WebPage',name:'detail' in result&&result.detail?localized(result.detail,'title',locale):copy(pageCopy[section],'title',locale),inLanguage:locale==='id'?'id-ID':'en-US',isPartOf:{'@type':'WebSite',name:'AIUEO',url:site}};
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>{section==='home'?<HomePage locale={locale} services={result.items??[]} articles={'articles'in result?(result.articles??[]):[]} pageRecord={'pageRecord'in result?result.pageRecord:undefined}/>:<PublicPage locale={locale} section={section} items={result.items??[]} detail={'detail'in result?result.detail:undefined} pageRecord={'pageRecord'in result?result.pageRecord:undefined}/>}</>;
}
