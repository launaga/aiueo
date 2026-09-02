const bpReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const bpHoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const bpPageHero = document.querySelector('.page-hero');

const bpPath = location.pathname.split('/').pop() || 'index.html';
const bpRouteNames = {
  'about.html': 'ABOUT',
  'services.html': 'SERVICES',
  'news.html': 'NEWS',
  'gallery.html': 'GALLERY',
  'events.html': 'EVENTS',
  'contact.html': 'CONTACT',
  'corporate-event.html': 'CORPORATE EVENT',
  'annual-kick-off.html': 'ANNUAL KICK OFF',
  'employee-gathering.html': 'EMPLOYEE GATHERING',
  'family-gathering.html': 'FAMILY GATHERING',
  'outing-outbound.html': 'OUTING & OUTBOUND',
  'team-building.html': 'TEAM BUILDING',
  'company-anniversary.html': 'COMPANY ANNIVERSARY',
  'custom-event-management.html': 'CUSTOM EVENT MANAGEMENT'
};

if (bpPageHero) {
  const routeName = bpRouteNames[bpPath] || 'AIUEO';
  const pageMarker = document.querySelector('.page-marker');
  if (pageMarker) pageMarker.textContent = routeName;
  bpPageHero.dataset.blueprintRoute = routeName;
}

const bpPreview = null;
const bpPreviewImage = null;
const bpServiceImages = [
  'assets/images/impact-demo.png',
  'assets/images/journey-listen.png',
  'assets/images/risk-team.png',
  'assets/images/hero-field.png',
  'assets/images/journey-execute.png',
  'assets/images/journey-design.png',
  'assets/images/journey-reflect.png',
  'assets/images/journey-prepare.png'
];

function bpSetPreviewTargets(selector, images, centered = false) {
  document.querySelectorAll(selector).forEach((item, index) => {
    item.dataset.bpPreview = images[index % images.length];
    if (centered) item.dataset.bpPreviewCentered = 'true';
  });
}

bpSetPreviewTargets('.capability-row', bpServiceImages, true);
bpSetPreviewTargets('.story-card', [
  'assets/images/journey-listen.png',
  'assets/images/journey-prepare.png',
  'assets/images/journey-reflect.png'
]);
bpSetPreviewTargets('.event-row', [
  'assets/images/journey-design.png',
  'assets/images/journey-reflect.png',
  'assets/images/impact-demo.png'
]);

if (bpHoverCapable && bpPreview && bpPreviewImage) {
  document.querySelectorAll('[data-bp-preview]').forEach((item) => {
    item.addEventListener('pointerenter', () => {
      bpPreviewImage.src = item.dataset.bpPreview;
      bpPreview.classList.toggle('is-centered', item.dataset.bpPreviewCentered === 'true');
      bpPreview.classList.add('is-active');
      item.closest('.capability-list')?.classList.add('has-active-preview');
    });
    item.addEventListener('pointermove', (event) => {
      if (item.dataset.bpPreviewCentered === 'true') return;
      const maxX = window.innerWidth - bpPreview.offsetWidth - 35;
      const maxY = window.innerHeight - bpPreview.offsetHeight - 35;
      bpPreview.style.setProperty('--preview-x', `${Math.max(10, Math.min(maxX, event.clientX))}px`);
      bpPreview.style.setProperty('--preview-y', `${Math.max(10, Math.min(maxY, event.clientY))}px`);
    });
    item.addEventListener('pointerleave', () => {
      bpPreview.classList.remove('is-active');
      item.closest('.capability-list')?.classList.remove('has-active-preview');
    });
  });
}

function bpUpdateScrollMotion() {
  if (!bpPageHero || bpReducedMotion) return;
  const progress = Math.min(1, window.scrollY / Math.max(1, bpPageHero.offsetHeight));
  bpPageHero.style.setProperty('--bp-scroll', progress.toFixed(3));
  const floatingImage = document.querySelector('.detail-image, .about-portrait');
  if (floatingImage) floatingImage.style.translate = `0 ${Math.min(24, window.scrollY * .035)}px`;
}
document.addEventListener('scroll', bpUpdateScrollMotion, { passive: true });
bpUpdateScrollMotion();

if (bpHoverCapable && !bpReducedMotion) {
  document.querySelectorAll('.team-card, .gallery-tile, .lead-story').forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const bounds = item.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      item.style.translate = `${x * 7}px ${y * 6}px`;
      item.style.rotate = `${x * 1.2}deg`;
    });
    item.addEventListener('pointerleave', () => {
      item.style.translate = '';
      item.style.rotate = '';
    });
  });
}
