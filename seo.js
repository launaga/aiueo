(() => {
  const config = window.AIUEO_CONFIG || {};
  const siteUrl = (config.siteUrl || 'https://aiu-eo.com').replace(/\/$/, '');
  const path = location.pathname.split('/').pop() || 'index.html';
  const pages = {
    'index.html': ['AIUEO , Corporate Event Organizer Jakarta', 'Partner event organizer untuk kick off, gathering, outing, team building, dan acara perusahaan yang terasa hangat, terarah, dan berkesan.'],
    'about.html': ['Tentang AIUEO , Partner untuk Momen Perusahaan', 'Kenali cara AIUEO merancang dan menjalankan acara perusahaan dari obrolan awal hingga evaluasi.'],
    'services.html': ['Layanan Event Organizer Perusahaan , AIUEO', 'Jelajahi layanan corporate event, kick off, gathering, outing, team building, anniversary, dan event management AIUEO.'],
    'events.html': ['Agenda & Program AIUEO', 'Temukan agenda publik dan program AIUEO yang telah dikonfirmasi.'],
    'gallery.html': ['Galeri Event AIUEO , Momen di Lapangan', 'Lihat suasana gathering, team building, dan proses produksi event AIUEO.'],
    'news.html': ['Catatan Lapangan AIUEO , Ide Event Perusahaan', 'Wawasan praktis tentang partisipasi, produksi, budaya, dan desain acara perusahaan.'],
    'contact.html': ['Konsultasi Event Perusahaan , Hubungi AIUEO', 'Ceritakan tujuan, jumlah peserta, waktu, dan kebutuhan acara Anda. Lanjutkan konsultasi bersama AIUEO melalui WhatsApp atau jadwal konsultasi.'],
    'corporate-event.html': ['Corporate Event Organizer , AIUEO', 'Strategi kreatif, produksi, dan pengelolaan corporate event yang menjaga pesan tetap terasa manusiawi.'],
    'annual-kick-off.html': ['Annual Kick Off Perusahaan , AIUEO', 'Rancang annual kick off yang menyatukan arah, energi, dan partisipasi tim.'],
    'employee-gathering.html': ['Employee Gathering Perusahaan , AIUEO', 'Employee gathering yang memberi ruang bagi tim untuk terhubung, merayakan, dan pulang membawa cerita.'],
    'family-gathering.html': ['Family Gathering Perusahaan , AIUEO', 'Family gathering yang ramah berbagai usia dengan alur, aktivitas, dan kenyamanan yang terencana.'],
    'outing-outbound.html': ['Corporate Outing & Outbound , AIUEO', 'Outing dan outbound perusahaan dengan itinerary, transportasi, aktivitas, makan, keselamatan, dan ritme perjalanan yang terencana.'],
    'team-building.html': ['Team Building Perusahaan , AIUEO', 'Program team building yang dirancang dari dinamika dan tujuan nyata tim Anda.'],
    'company-anniversary.html': ['Company Anniversary Event , AIUEO', 'Rayakan perjalanan perusahaan dan babak berikutnya melalui pengalaman anniversary yang terarah.'],
    'custom-event-management.html': ['Custom Event Management , AIUEO', 'Manajemen event khusus dari konsep, vendor, produksi, logistik, hingga evaluasi.']
  };
  const [title, description] = pages[path] || pages['index.html'];
  const canonicalPath = path === 'index.html' ? '/' : `/${path}`;
  const canonical = `${siteUrl}${canonicalPath}`;
  const image = `${siteUrl}/assets/images/impact-demo.png`;

  document.title = title;
  const upsertMeta = (selector, attrs) => {
    let node = document.head.querySelector(selector);
    if (!node) { node = document.createElement('meta'); document.head.append(node); }
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  };
  let canonicalLink = document.head.querySelector('link[rel="canonical"]');
  if (!canonicalLink) { canonicalLink = document.createElement('link'); canonicalLink.rel = 'canonical'; document.head.append(canonicalLink); }
  canonicalLink.href = canonical;
  upsertMeta('meta[name="description"]', { name: 'description', content: description });
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'AIUEO' });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });
  upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: 'Peserta menikmati pengalaman acara bersama AIUEO' });
  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });

  const isService = /^(corporate-event|annual-kick-off|employee-gathering|family-gathering|outing-outbound|team-building|company-anniversary|custom-event-management)\.html$/.test(path);
  const graph = [
    {
      '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: config.organizationName || 'AIUEO Event Organizer',
      alternateName: 'AIUEO', url: `${siteUrl}/`, logo: `${siteUrl}/assets/images/aiueo-logo.png`,
      contactPoint: { '@type': 'ContactPoint', telephone: '+62-896-7400-2822', contactType: 'customer service', availableLanguage: ['id', 'en'] },
      sameAs: config.instagramUrl ? [config.instagramUrl] : undefined
    },
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'AIUEO', url: `${siteUrl}/`, inLanguage: ['id-ID', 'en'] },
    { '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: title, description, isPartOf: { '@id': `${siteUrl}/#website` }, inLanguage: document.documentElement.lang || 'en' }
  ];
  const shortTitle = title.split(/[,,]/)[0].trim();
  if (isService) graph.push({ '@type': 'Service', name: shortTitle, description, provider: { '@id': `${siteUrl}/#organization` }, areaServed: { '@type': 'Country', name: 'Indonesia' }, url: canonical });
  if (path !== 'index.html') graph.push({ '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
    { '@type': 'ListItem', position: 2, name: shortTitle, item: canonical }
  ] });
  const schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.append(schema);
})();
