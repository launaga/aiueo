import type { ContentRecord, Locale } from '@/lib/types';

const now = '2026-09-02T00:00:00.000Z';
const serviceSeed = [
  ['corporate-event','corporate-event','Corporate Event','Corporate Event','Acara perusahaan dengan konsep tajam, produksi mulus, dan energi yang hidup.','A sharp concept, seamless production, and a room that feels fully switched on.','/assets/images/events/corporate-event.jpg'],
  ['annual-kick-off','annual-kick-off','Annual Kick Off','Annual Kick Off','Satukan arah, energi, dan ambisi tahun baru dalam pengalaman yang terasa.','Turn the year’s ambition into clear direction, shared energy, and momentum.','/assets/images/events/annual-kickoff.jpg'],
  ['employee-gathering','employee-gathering','Employee Gathering','Employee Gathering','Ruang untuk tim terhubung, merayakan, dan menikmati kebersamaan.','A day where teams connect, celebrate, and genuinely enjoy being together.','/assets/images/events/employee-gathering.jpg'],
  ['family-gathering','family-gathering','Family Gathering','Family Gathering','Pengalaman inklusif bagi kolega, pasangan, anak, dan setiap generasi.','An inclusive experience for colleagues, partners, children, and every generation.','/assets/images/events/family-gathering.jpg'],
  ['outing-outbound','outing-outbound','Outing & Outbound','Outing & Outbound','Keluar dari rutinitas untuk bergerak, tertawa, menjelajah, dan pulang dengan cerita baru.','Step out of routine to move, laugh, explore, and return with a new team story.','/assets/images/events/outing-beach.jpg'],
  ['team-building','team-building','Team Building','Team Building','Aktivitas bermakna yang dibangun dari dinamika nyata tim Anda.','Purposeful challenges designed around the dynamics your team needs to strengthen.','/assets/images/events/team-building.jpg'],
  ['company-anniversary','company-anniversary','Company Anniversary','Company Anniversary','Rayakan perjalanan tanpa terjebak masa lalu—sejarah, pertunjukan, dan momentum baru.','Honor the journey with history, spectacle, and forward momentum.','/assets/images/events/company-anniversary.jpg'],
  ['custom-event-management','custom-event-management','Manajemen Event Khusus','Custom Event Management','Tidak ada template. Kami membangun format yang tepat untuk tujuan unik Anda.','No template and no awkward fit. We build the right format around your unique purpose.','/assets/images/events/custom-event.jpg'],
];

export const seedServices: ContentRecord[] = serviceSeed.map((s, index) => ({
  id: `seed-service-${index + 1}`, slug_id: s[0], slug_en: s[1], title_id: s[2], title_en: s[3], description_id: s[4], description_en: s[5],
  body_id: 'Dari konsep kreatif, alur acara, vendor, produksi, hingga evaluasi—setiap detail dijaga agar tujuan acara tetap terasa manusiawi.',
  body_en: 'From creative concept, show flow, vendors, and production through evaluation—every detail protects the human purpose behind the event.',
  featured_image_url: s[6], status: 'published', sort_order: index, published_at: now, created_at: now, updated_at: now,
}));

export const seedArticles: ContentRecord[] = [{ id:'seed-article-1', slug_id:'kick-off-butuh-cerita', slug_en:'your-kick-off-needs-a-story', title_id:'Kick off Anda butuh cerita, bukan sekadar rundown.', title_en:'Your annual kick off needs a plot, not another rundown.', description_id:'Energi yang baik dirancang. Inilah titik mulainya.', description_en:'Good energy is designed. Here’s where it starts.', body_id:'Acara yang kuat memiliki alur: alasan untuk hadir, ketegangan yang relevan, partisipasi, dan penutup yang menggerakkan.', body_en:'Strong events have an arc: a reason to show up, relevant tension, participation, and a closing moment that moves people.', featured_image_url:'/assets/images/events/annual-kickoff.jpg', status:'published', sort_order:0, published_at:now, created_at:now, updated_at:now }];

export const seedEvents: ContentRecord[] = [{ id:'seed-event-1', slug_id:'program-private-perusahaan', slug_en:'private-company-programs', title_id:'Program privat untuk perusahaan', title_en:'Private programs for companies', description_id:'Tanggal publik akan ditampilkan setelah dikonfirmasi. Hubungi kami untuk program privat.', description_en:'Public dates appear once confirmed. Talk to us about a private program.', body_id:'Program dirancang sesuai tujuan, jumlah peserta, waktu, dan lokasi.', body_en:'Programs are shaped around your goals, guest count, timing, and location.', featured_image_url:'/assets/images/events/water-activity.jpg', status:'published', sort_order:0, published_at:now, created_at:now, updated_at:now }];

export const seedGallery: ContentRecord[] = [
  ['rafting','rafting','Arus, fokus, dan kerja tim','Current, focus, and teamwork','Persiapan aktivitas rafting.','Preparing for a rafting activity.','/assets/images/events/rafting.jpg'],
  ['malam-kebersamaan','shared-evening','Malam kebersamaan','A shared evening','Cerita dimulai setelah agenda selesai.','The stories begin after the agenda.','/assets/images/events/company-anniversary.jpg'],
  ['briefing-tim','team-briefing','Briefing sebelum bergerak','Briefing before the team moves','Fasilitator menyiapkan ritme aktivitas.','A facilitator sets the rhythm for the activity.','/assets/images/events/team-building.jpg'],
].map((s,index)=>({id:`seed-gallery-${index+1}`,slug_id:s[0],slug_en:s[1],title_id:s[2],title_en:s[3],description_id:s[4],description_en:s[5],body_id:'',body_en:'',featured_image_url:s[6],status:'published' as const,sort_order:index,published_at:now,created_at:now,updated_at:now}));

export const pageCopy = {
  home: { title_id:'Hidup penuh momen. Buat jadi berkesan.', title_en:'Life is an event. Make it live.', description_id:'Kami mengubah momen perusahaan menjadi cerita bersama yang layak dikenang.', description_en:'We turn company moments into shared stories people actually want to remember.' },
  about: { title_id:'Bukan sekadar event organizer.', title_en:'Not just an event organizer.', description_id:'Kami mendengar, merancang ritme, mengelola kerumitan, dan menjaga alasan orang berkumpul.', description_en:'We listen, design the rhythm, manage the chaos, and protect the reason people came together.' },
  services: { title_id:'Apa yang bisa kita hidupkan?', title_en:'What can we make live?', description_id:'Pilih titik awal. Kami akan membuatnya terasa milik Anda.', description_en:'Choose a starting point. We’ll make it yours.' },
  events: { title_id:'Agenda yang benar-benar terjadi.', title_en:'What’s coming up.', description_id:'Hanya tanggal yang sudah dikonfirmasi yang kami tampilkan.', description_en:'Only confirmed dates go live.' },
  news: { title_id:'Catatan dari lapangan.', title_en:'Fresh from the field.', description_id:'Ide, pelajaran, dan sudut pandang tentang pengalaman perusahaan.', description_en:'Ideas, lessons, and perspectives on company experiences.' },
  gallery: { title_id:'Bukti bahwa ini terjadi.', title_en:'Proof that it happened.', description_id:'Momen nyata, energi nyata, dan orang-orang yang hadir sepenuhnya.', description_en:'Real moments, real energy, and people fully present.' },
  contact: { title_id:'Mulai dari alasan untuk berkumpul.', title_en:'Start with the reason to gather.', description_id:'Kami akan membantu membentuk langkah berikutnya.', description_en:'We’ll help shape the next step.' },
} as const;

export function copy<T extends Record<string,string>>(value: T, field: string, locale: Locale) { return value[`${field}_${locale}`]; }
