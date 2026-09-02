(() => {
  const config = window.AIUEO_CONFIG || {};
  const storageKey = 'aiueo-language';
  const translations = {
    id: {
      'Home': 'Beranda', 'About': 'Tentang', 'Services': 'Layanan', 'Resources': 'Wawasan', 'Contact': 'Kontak',
      'What we make happen': 'Yang bisa kita wujudkan', 'Explore every capability': 'Lihat semua layanan',
      'Fresh from the field': 'Catatan dari lapangan', 'News': 'Catatan', 'Gallery': 'Galeri', 'Events': 'Agenda',
      'What’s coming up': 'Agenda terkonfirmasi', 'Choose language': 'Pilih bahasa', 'Language': 'Bahasa',
      'Back to top': 'Kembali ke atas', 'Skip to content': 'Lewati ke konten'
    }
  };

  function translateShared(language) {
    const dictionary = translations[language] || {};
    document.documentElement.lang = language;
    document.querySelectorAll('[data-language]').forEach((button) => {
      const active = button.dataset.language === language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (language === 'en') return location.reload();
    document.querySelectorAll('a, button, .panel-kicker, .language-switcher > span, .skip-link').forEach((node) => {
      const text = node.childNodes.length === 1 ? node.textContent.trim() : '';
      if (dictionary[text]) node.textContent = dictionary[text];
    });
    const sharedSelectors = {
      '.site-nav > a[href="index.html"]': 'Beranda', '.site-nav > a[href="about.html"]': 'Tentang',
      '.nav-trigger[aria-controls="services-menu"]': 'Layanan <span>+</span>',
      '.nav-trigger[aria-controls="resources-menu"]': 'Wawasan <span>+</span>',
      '.site-nav > .nav-contact': 'Kontak <span>↗</span>', '.language-switcher > span': 'Bahasa'
    };
    Object.entries(sharedSelectors).forEach(([selector, html]) => {
      const node = document.querySelector(selector); if (node) node.innerHTML = html;
    });
    document.querySelectorAll('[data-id]').forEach((node) => { node.innerHTML = node.dataset.id; });
    document.querySelectorAll('[data-id-placeholder]').forEach((node) => { node.placeholder = node.dataset.idPlaceholder; });
  }

  const selectedLanguage = localStorage.getItem(storageKey) || 'en';
  if (selectedLanguage === 'id') translateShared('id');
  document.querySelectorAll('[data-language]').forEach((button) => button.addEventListener('click', () => {
    localStorage.setItem(storageKey, button.dataset.language);
    if (button.dataset.language === 'en') location.reload(); else translateShared('id');
  }));

  function campaignContext() {
    const params = new URLSearchParams(location.search);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid'];
    return keys.map((key) => params.get(key) ? `${key}: ${params.get(key)}` : '').filter(Boolean).join('\n');
  }

  document.querySelectorAll('[data-consultation-form]').forEach((form) => {
    const output = form.querySelector('output');
    const whatsappButton = form.querySelector('[data-submit-whatsapp]');
    const calendarLink = document.querySelector('[data-calendar-link]');
    if (config.calendarAppointmentUrl && calendarLink) {
      calendarLink.href = config.calendarAppointmentUrl;
      calendarLink.hidden = false;
    }
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = new FormData(form);
      const language = document.documentElement.lang;
      const lines = language === 'id' ? [
        'Halo AIUEO, saya ingin konsultasi event.',
        `Nama / peran: ${data.get('name')} / ${data.get('role')}`,
        `Perusahaan: ${data.get('company')}`,
        `Jenis acara: ${data.get('type')}`,
        `Perkiraan peserta: ${data.get('guests')}`,
        `Waktu / lokasi: ${data.get('date')} / ${data.get('destination')}`,
        `Catatan: ${data.get('note') || '-'}`
      ] : [
        'Hello AIUEO, I would like to discuss an event.',
        `Name / role: ${data.get('name')} / ${data.get('role')}`,
        `Company: ${data.get('company')}`,
        `Event type: ${data.get('type')}`,
        `Estimated guests: ${data.get('guests')}`,
        `Timing / location: ${data.get('date')} / ${data.get('destination')}`,
        `Notes: ${data.get('note') || '-'}`
      ];
      const attribution = campaignContext();
      if (attribution) lines.push(`Campaign:\n${attribution}`);
      const url = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
      output.textContent = language === 'id' ? 'Brief siap. WhatsApp akan terbuka di tab baru.' : 'Your brief is ready. WhatsApp will open in a new tab.';
      window.open(url, '_blank', 'noopener,noreferrer');
    });
    whatsappButton?.addEventListener('click', () => form.requestSubmit());
  });

  document.querySelectorAll('[data-video-component]').forEach((container) => {
    const source = container.dataset.videoSrc;
    if (!source) return;
    const image = container.querySelector('img');
    const video = document.createElement('video');
    video.controls = true;
    video.preload = navigator.connection?.saveData ? 'none' : 'metadata';
    video.poster = image?.src || '';
    video.playsInline = true;
    video.setAttribute('aria-label', container.dataset.videoLabel || image?.alt || 'AIUEO event video');
    const mobileSource = container.dataset.videoMobileSrc;
    if (mobileSource) {
      const mobileSourceNode = document.createElement('source');
      mobileSourceNode.src = mobileSource;
      mobileSourceNode.type = container.dataset.videoType || 'video/mp4';
      mobileSourceNode.media = '(max-width: 600px)';
      video.append(mobileSourceNode);
    }
    const sourceNode = document.createElement('source');
    sourceNode.src = source;
    sourceNode.type = container.dataset.videoType || 'video/mp4';
    video.append(sourceNode);
    video.addEventListener('error', () => { video.replaceWith(image); image.hidden = false; }, { once: true });
    image.hidden = true;
    image.after(video);
    const canAutoplay = container.dataset.videoAutoplay === 'true'
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      && !navigator.connection?.saveData;
    if (canAutoplay) {
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.play().catch(() => { video.autoplay = false; });
    }
  });
})();
