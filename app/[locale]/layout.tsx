import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { Header } from '@/components/public/header';
import { Footer } from '@/components/public/footer';
import '../public.css';

export const metadata: Metadata = { metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://aiueo-eta.vercel.app'), title:{default:'AIUEO Event Organizer',template:'%s | AIUEO'}, description:'AIUEO corporate event organizer in Jakarta, Indonesia.' };

export default async function PublicLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}) {
  const {locale}=await params; if(!isLocale(locale)) notFound();
  return <html lang={locale} data-scroll-behavior="smooth"><body id="top"><a className="skip-link" href="#main">{locale==='id'?'Lewati ke konten':'Skip to content'}</a><Header locale={locale} alternatePath=""/>{children}<Footer locale={locale}/></body></html>;
}
