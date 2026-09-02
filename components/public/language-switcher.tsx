'use client';

import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/types';

export function LanguageSwitcher({ locale, alternatePath }: { locale: Locale; alternatePath: string }) {
  const pathname = usePathname();
  function choose(next: Locale) {
    document.cookie = `aiueo_locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    if (next !== locale) window.location.assign(alternatePath || pathname.replace(`/${locale}`,`/${next}`));
  }
  return <div className="language-switcher" aria-label={locale === 'id' ? 'Pilih bahasa' : 'Choose language'}>
    <button type="button" className={locale === 'id' ? 'active' : ''} aria-pressed={locale === 'id'} onClick={()=>choose('id')}>ID</button>
    <span aria-hidden="true">/</span>
    <button type="button" className={locale === 'en' ? 'active' : ''} aria-pressed={locale === 'en'} onClick={()=>choose('en')}>EN</button>
  </div>;
}
