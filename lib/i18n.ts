import type { Locale } from '@/lib/types';

export const locales: Locale[] = ['id', 'en'];
export const defaultLocale: Locale = 'id';
export const isLocale = (value: string): value is Locale => locales.includes(value as Locale);

const dictionaries = {
  id: {
    home: 'Beranda', about: 'Tentang', services: 'Layanan', resources: 'Referensi', news: 'Berita', gallery: 'Galeri', events: 'Agenda', contact: 'Kontak',
    menu: 'Menu', skip: 'Lewati ke konten', language: 'Bahasa', backTop: 'Kembali ke atas', readMore: 'Baca selengkapnya', explore: 'Jelajahi layanan ini',
    contactTitle: 'Punya alasan untuk berkumpul?', contactCopy: 'Ceritakan tujuan, jumlah peserta, waktu, dan lokasi yang sedang dipertimbangkan. Kami akan membantu menyusun langkah berikutnya.',
    contactCta: 'Mulai brief singkat', whatsapp: 'Chat lewat WhatsApp', empty: 'Belum ada konten yang diterbitkan.', required: 'Wajib diisi', submit: 'Kirim brief', success: 'Terima kasih. Tim kami akan segera menghubungi Anda.', error: 'Terjadi kendala. Silakan coba lagi.',
  },
  en: {
    home: 'Home', about: 'About', services: 'Services', resources: 'Resources', news: 'News', gallery: 'Gallery', events: 'Events', contact: 'Contact',
    menu: 'Menu', skip: 'Skip to content', language: 'Language', backTop: 'Back to top', readMore: 'Read more', explore: 'Explore this service',
    contactTitle: 'Got a reason to gather?', contactCopy: 'Tell us the goal, guest count, timing, and place you have in mind. We’ll help shape the next step.',
    contactCta: 'Start a short brief', whatsapp: 'Continue on WhatsApp', empty: 'No published content yet.', required: 'Required', submit: 'Send brief', success: 'Thank you. Our team will be in touch shortly.', error: 'Something went wrong. Please try again.',
  },
} as const;

export function getDictionary(locale: Locale) { return dictionaries[locale]; }

export function otherLocale(locale: Locale): Locale { return locale === 'id' ? 'en' : 'id'; }

export function swapLocalizedSlug(path: string[], locale: Locale, services: Array<{ slug_id: string; slug_en: string }>) {
  if (!path.length) return [];
  const current = path[0];
  const match = services.find((item) => item[`slug_${locale}`] === current);
  return match ? [match[`slug_${otherLocale(locale)}`]] : path;
}
