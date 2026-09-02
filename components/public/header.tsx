'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Locale } from '@/lib/types';
import { getDictionary } from '@/lib/i18n';
import { LanguageSwitcher } from './language-switcher';

export function Header({ locale, alternatePath }: { locale: Locale; alternatePath: string }) {
  const [open,setOpen] = useState(false); const t = getDictionary(locale);
  const links = [[t.home,''],[t.about,'about'],[t.services,'services'],[t.events,'events'],[t.news,'news'],[t.gallery,'gallery']] as const;
  return <header className="site-header">
    <Link className="brand" href={`/${locale}`} aria-label="AIUEO home"><span>A</span><span>I</span><span>U</span><span>E</span><span>O</span></Link>
    <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-nav" onClick={()=>setOpen(!open)}>{t.menu}<i/><i/></button>
    <nav id="site-nav" className={open ? 'site-nav open' : 'site-nav'} aria-label="Main navigation">
      {links.map(([label,slug])=><Link key={slug} href={`/${locale}${slug?`/${slug}`:''}`} onClick={()=>setOpen(false)}>{label}</Link>)}
      <LanguageSwitcher locale={locale} alternatePath={alternatePath}/>
      <Link className="nav-contact" href={`/${locale}/contact`} onClick={()=>setOpen(false)}>{t.contact}<span>↗</span></Link>
    </nav>
  </header>;
}
