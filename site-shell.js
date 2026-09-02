const services = [
  ['Corporate Event', 'corporate-event.html'],
  ['Annual Kick Off', 'annual-kick-off.html'],
  ['Employee Gathering', 'employee-gathering.html'],
  ['Family Gathering', 'family-gathering.html'],
  ['Outing & Outbound', 'outing-outbound.html'],
  ['Team Building', 'team-building.html'],
  ['Company Anniversary', 'company-anniversary.html'],
  ['Custom Event Management', 'custom-event-management.html']
];

const brand = `<span>A</span><span>I</span><span>U</span><span>E</span><span>O</span>`;
const serviceLinks = services.map(([name, url]) => `<a href="${url}">${name}</a>`).join('');

document.querySelector('[data-site-header]').innerHTML = `
  <header class="site-header inner-header">
    <a class="brand" href="index.html" aria-label="AIUEO home">${brand}</a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span>Menu</span><i></i><i></i></button>
    <nav class="site-nav" id="site-nav" aria-label="Main navigation">
      <a href="index.html">Home</a><a href="about.html">About</a>
      <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="services-menu">Services <span>+</span></button>
      <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="resources-menu">Resources <span>+</span></button>
      <div class="header-utilities" aria-label="Appearance">
        <button class="utility-button theme-toggle" type="button" aria-label="Switch to dark mode" aria-pressed="false"><svg class="moon-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.4A8.5 8.5 0 0 1 8.6 4 8.5 8.5 0 1 0 20 15.4Z"></path></svg><svg class="sun-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg></button>
      </div>
      <a class="nav-contact" href="contact.html">Contact <span>↗</span></a>
    </nav>
    <div class="nav-panel services-panel" id="services-menu"><p class="panel-kicker">What we make happen</p><div class="panel-list">${serviceLinks}</div><a class="panel-cta" href="services.html">Explore every capability <span>↗</span></a></div>
    <div class="nav-panel resources-panel" id="resources-menu"><p class="panel-kicker">Fresh from the field</p><a href="news.html"><span>News</span><small>Ideas, notes &amp; dispatches</small></a><a href="gallery.html"><span>Gallery</span><small>Proof that it happened</small></a><a href="events.html"><span>Events</span><small>What’s coming up</small></a></div>
  </header>`;

document.querySelector('[data-site-footer]').innerHTML = `
  <footer class="site-footer">
    <a class="brand footer-brand" href="index.html" aria-label="AIUEO home">${brand}</a><p>Life is an event.<br>Make it live.</p>
    <div class="footer-links"><a href="about.html">About</a><a href="services.html">Services</a><a href="news.html">News</a><a href="gallery.html">Gallery</a><a href="events.html">Events</a><a href="contact.html">Contact</a></div>
    <div class="footer-contact"><a href="https://wa.me/6289674002822" target="_blank" rel="noopener">WhatsApp ↗</a><a href="tel:+6289674002822">+62 896 7400 2822</a><span>Jakarta, Indonesia</span><div class="language-switcher" aria-label="Choose language"><span>Language</span><button type="button" data-language="id">ID</button><i>/</i><button type="button" data-language="en" class="active">EN</button></div></div>
    <div class="footer-bottom"><span>© 2026 AIUEO</span><span>Built for real-life moments.</span><a href="#top">Back to top ↑</a></div>
  </footer>`;

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const panels = document.querySelectorAll('.nav-panel');
const triggers = document.querySelectorAll('.nav-trigger');
function closeNavigation() {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  panels.forEach((panel) => panel.classList.remove('open'));
  triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
}
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
triggers.forEach((trigger) => trigger.addEventListener('click', () => {
  const panel = document.querySelector(`#${trigger.getAttribute('aria-controls')}`);
  const willOpen = !panel.classList.contains('open');
  panels.forEach((item) => item.classList.remove('open'));
  triggers.forEach((item) => item.setAttribute('aria-expanded', 'false'));
  if (willOpen) { panel.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); }
}));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeNavigation(); });
document.addEventListener('click', (event) => { if (!event.target.closest('.site-header')) closeNavigation(); });

const currentPath = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.site-nav a, .footer-links a').forEach((link) => {
  if (link.getAttribute('href') === currentPath) link.setAttribute('aria-current', 'page');
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('in-view'));
} else {
  const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in-view');
    currentObserver.unobserve(entry.target);
  }), { threshold: .1, rootMargin: '0px 0px -7% 0px' });
  revealItems.forEach((item, index) => { item.style.transitionDelay = `${index % 3 * 60}ms`; observer.observe(item); });
}

const progress = document.querySelector('.page-progress i');
document.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max ? scrollY / max : 0})`;
}, { passive: true });

const cursor = document.querySelector('.cursor');
if (cursor && !reducedMotion && matchMedia('(hover:hover)').matches) {
  let x = -100, y = -100, cx = -100, cy = -100;
  document.addEventListener('pointermove', (event) => { x = event.clientX; y = event.clientY; });
  const move = () => { cx += (x - cx) * .18; cy += (y - cy) * .18; cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(move); };
  move();
  document.querySelectorAll('[data-cursor]').forEach((item) => {
    item.addEventListener('mouseenter', () => { cursor.classList.add('active'); cursor.querySelector('span').textContent = item.dataset.cursor; });
    item.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

document.querySelectorAll('form[data-brief-form]').forEach((form) => form.addEventListener('submit', (event) => {
  event.preventDefault();
  const output = form.querySelector('output');
  if (!form.checkValidity()) { form.reportValidity(); output.textContent = 'Add a valid work email to continue.'; return; }
  output.textContent = 'Signal received. Our team will follow up with the next step.';
  form.reset();
}));

document.querySelectorAll('[data-gallery-filter]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-gallery-filter]').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  document.querySelectorAll('[data-gallery-kind]').forEach((item) => item.classList.toggle('is-hidden', button.dataset.galleryFilter !== 'all' && item.dataset.galleryKind !== button.dataset.galleryFilter));
}));

const controlsScript = document.createElement('script');
controlsScript.src = 'controls.js';
document.head.append(controlsScript);
